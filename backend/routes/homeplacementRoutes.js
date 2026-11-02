import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import pool from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| UPLOAD SETUP
|--------------------------------------------------------------------------
*/

const logoDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "placement-logos"
);

fs.mkdirSync(logoDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, logoDirectory);
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(
      null,
      `logo-${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${extension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image files are allowed."));
  },
});

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const toNullableText = (value) => {
  if (!value || !value.trim()) {
    return null;
  }

  return value.trim();
};

const toNullableNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const removeUploadedLogo = async (logoPath) => {
  if (!logoPath?.startsWith("/uploads/placement-logos/")) {
    return;
  }

  const filePath = path.join(
    logoDirectory,
    path.basename(logoPath)
  );

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to remove logo:", error);
    }
  }
};

/*
|--------------------------------------------------------------------------
| PUBLIC
| GET /api/home-placements
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        company_name,
        company_logo,
        highest_package,
        average_package,
        students_placed,
        company_website,
        display_order
      FROM home_placements
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    // Kept as an array because the existing homepage expects an array.
    res.json(rows);
  } catch (error) {
    console.error("GET placements error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement partners.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN LIST
| GET /api/home-placements/admin
|--------------------------------------------------------------------------
*/

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        company_name,
        company_logo,
        highest_package,
        average_package,
        students_placed,
        company_website,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_placements
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET admin placements error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch placement partners.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE
| POST /api/home-placements/admin
|--------------------------------------------------------------------------
*/

router.post("/admin", upload.single("company_logo"), async (req, res) => {
  try {
    const {
      company_name,
      company_logo_url,
      highest_package,
      average_package,
      students_placed,
      company_website,
      display_order,
      is_active,
    } = req.body;

    if (!company_name?.trim()) {
      if (req.file) {
        await removeUploadedLogo(
          `/uploads/placement-logos/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    const companyLogo = req.file
      ? `/uploads/placement-logos/${req.file.filename}`
      : toNullableText(company_logo_url);

    const [result] = await pool.query(
      `
      INSERT INTO home_placements
      (
        company_name,
        company_logo,
        highest_package,
        average_package,
        students_placed,
        company_website,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        company_name.trim(),
        companyLogo,
        toNullableNumber(highest_package),
        toNullableNumber(average_package),
        toNullableNumber(students_placed),
        toNullableText(company_website),
        toNullableNumber(display_order) || 0,
        Number(is_active) === 1 ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        company_name,
        company_logo,
        highest_package,
        average_package,
        students_placed,
        company_website,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_placements
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Placement partner created successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("POST placement partner error:", error);

    if (req.file) {
      await removeUploadedLogo(
        `/uploads/placement-logos/${req.file.filename}`
      );
    }

    res.status(500).json({
      success: false,
      message: "Failed to create placement partner.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE
| PUT /api/home-placements/admin/:id
|--------------------------------------------------------------------------
*/

router.put(
  "/admin/:id",
  upload.single("company_logo"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        company_name,
        company_logo_url,
        remove_logo,
        highest_package,
        average_package,
        students_placed,
        company_website,
        display_order,
        is_active,
      } = req.body;

      if (!company_name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Company name is required.",
        });
      }

      const [existingRows] = await pool.query(
        `
        SELECT id, company_logo
        FROM home_placements
        WHERE id = ?
        `,
        [id]
      );

      if (existingRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Placement partner not found.",
        });
      }

      const existingPartner = existingRows[0];
      const suppliedLogoUrl = toNullableText(company_logo_url);

      let companyLogo = existingPartner.company_logo;

      if (req.file) {
        companyLogo = `/uploads/placement-logos/${req.file.filename}`;
      } else if (remove_logo === "1") {
        companyLogo = null;
      } else if (suppliedLogoUrl) {
        companyLogo = suppliedLogoUrl;
      }

      await pool.query(
        `
        UPDATE home_placements
        SET
          company_name = ?,
          company_logo = ?,
          highest_package = ?,
          average_package = ?,
          students_placed = ?,
          company_website = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          company_name.trim(),
          companyLogo,
          toNullableNumber(highest_package),
          toNullableNumber(average_package),
          toNullableNumber(students_placed),
          toNullableText(company_website),
          toNullableNumber(display_order) || 0,
          Number(is_active) === 1 ? 1 : 0,
          id,
        ]
      );

      if (
        existingPartner.company_logo &&
        existingPartner.company_logo !== companyLogo
      ) {
        await removeUploadedLogo(existingPartner.company_logo);
      }

      const [rows] = await pool.query(
        `
        SELECT
          id,
          company_name,
          company_logo,
          highest_package,
          average_package,
          students_placed,
          company_website,
          display_order,
          is_active,
          created_at,
          updated_at
        FROM home_placements
        WHERE id = ?
        `,
        [id]
      );

      res.json({
        success: true,
        message: "Placement partner updated successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error("PUT placement partner error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update placement partner.",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE
| DELETE /api/home-placements/admin/:id
|--------------------------------------------------------------------------
*/

router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT id, company_logo
      FROM home_placements
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Placement partner not found.",
      });
    }

    await pool.query(
      `
      DELETE FROM home_placements
      WHERE id = ?
      `,
      [id]
    );

    await removeUploadedLogo(rows[0].company_logo);

    res.json({
      success: true,
      message: "Placement partner deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE placement partner error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete placement partner.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPLOAD ERRORS
|--------------------------------------------------------------------------
*/

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Logo image must be smaller than 2 MB."
          : error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }

  next();
});

export default router;