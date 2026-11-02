
import express from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORIES
|--------------------------------------------------------------------------
*/

const logoDirectory = path.join(
  process.cwd(),
  "uploads",
  "college-header",
  "logo"
);

const campusDirectory = path.join(
  process.cwd(),
  "uploads",
  "college-header",
  "campus"
);

fs.mkdirSync(logoDirectory, { recursive: true });
fs.mkdirSync(campusDirectory, { recursive: true });

/*
|--------------------------------------------------------------------------
| MULTER
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, logoDirectory);
    } else if (file.fieldname === "campus_image") {
      cb(null, campusDirectory);
    } else {
      cb(null, logoDirectory);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, JPEG, PNG and WEBP images are allowed.")
      );
    }

    cb(null, true);
  },
});

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

async function getCollegeHeader() {
  const [rows] = await pool.query(`
    SELECT
      id,
      college_name,
      slogan,
      tagline,
      affiliation,
      naac_grade,
      naac_cycle,
      naac_gpa,
      established_year,
      phone,
      email,
      address,
      logo_url,
      campus_image_url,
      is_active,
      created_at,
      updated_at
    FROM college_header
    WHERE is_active = 1
    ORDER BY id ASC
    LIMIT 1
  `);

  return rows.length ? rows[0] : null;
}

/*
|--------------------------------------------------------------------------
| GET COLLEGE HEADER
|--------------------------------------------------------------------------
| GET /api/college-header
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const header = await getCollegeHeader();

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "College header not found.",
      });
    }

    res.json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("GET COLLEGE HEADER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college header.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE COLLEGE HEADER
|--------------------------------------------------------------------------
| PUT /api/college-header
|--------------------------------------------------------------------------
*/

router.put("/", async (req, res) => {
  try {
    const {
      college_name,
      slogan,
      tagline,
      affiliation,
      naac_grade,
      naac_cycle,
      naac_gpa,
      established_year,
      phone,
      email,
      address,
      logo_url,
      campus_image_url,
      is_active,
    } = req.body;

    const [rows] = await pool.query(`
      SELECT id
      FROM college_header
      ORDER BY id ASC
      LIMIT 1
    `);

    if (rows.length === 0) {
      const [result] = await pool.query(
        `
        INSERT INTO college_header (
          college_name,
          slogan,
          tagline,
          affiliation,
          naac_grade,
          naac_cycle,
          naac_gpa,
          established_year,
          phone,
          email,
          address,
          logo_url,
          campus_image_url,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          college_name || "",
          slogan || "",
          tagline || "",
          affiliation || "",
          naac_grade || "",
          naac_cycle || "",
          naac_gpa || "",
          established_year || "",
          phone || "",
          email || "",
          address || "",
          logo_url || "",
          campus_image_url || "",
          is_active === undefined ? 1 : is_active,
        ]
      );

      const [newRows] = await pool.query(
        `SELECT * FROM college_header WHERE id = ?`,
        [result.insertId]
      );

      return res.json({
        success: true,
        message: "College header created successfully.",
        data: newRows[0],
      });
    }

    const id = rows[0].id;

    await pool.query(
      `
      UPDATE college_header
      SET
        college_name = ?,
        slogan = ?,
        tagline = ?,
        affiliation = ?,
        naac_grade = ?,
        naac_cycle = ?,
        naac_gpa = ?,
        established_year = ?,
        phone = ?,
        email = ?,
        address = ?,
        logo_url = ?,
        campus_image_url = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        college_name || "",
        slogan || "",
        tagline || "",
        affiliation || "",
        naac_grade || "",
        naac_cycle || "",
        naac_gpa || "",
        established_year || "",
        phone || "",
        email || "",
        address || "",
        logo_url || "",
        campus_image_url || "",
        is_active === undefined ? 1 : is_active,
        id,
      ]
    );

    const [updatedRows] = await pool.query(
      `SELECT * FROM college_header WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "College header updated successfully.",
      data: updatedRows[0],
    });
  } catch (error) {
    console.error("UPDATE COLLEGE HEADER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save college header.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPLOAD LOGO
|--------------------------------------------------------------------------
| POST /api/college-header/upload/logo
|--------------------------------------------------------------------------
*/

router.post("/upload/logo", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No logo file selected.",
      });
    }

    const logoUrl = `/uploads/college-header/logo/${req.file.filename}`;

    const [rows] = await pool.query(`
      SELECT id, logo_url
      FROM college_header
      ORDER BY id ASC
      LIMIT 1
    `);

    if (rows.length === 0) {
      await pool.query(
        `
        INSERT INTO college_header (
          college_name,
          logo_url,
          is_active
        )
        VALUES (?, ?, 1)
        `,
        ["Your College Name", logoUrl]
      );
    } else {
      if (rows[0].logo_url) {
        const oldPath = path.join(
          process.cwd(),
          rows[0].logo_url.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await pool.query(
        `
        UPDATE college_header
        SET logo_url = ?
        WHERE id = ?
        `,
        [logoUrl, rows[0].id]
      );
    }

    res.json({
      success: true,
      message: "Logo uploaded successfully.",
      url: logoUrl,
    });
  } catch (error) {
    console.error("UPLOAD LOGO ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload logo.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPLOAD CAMPUS IMAGE
|--------------------------------------------------------------------------
| POST /api/college-header/upload/campus
|--------------------------------------------------------------------------
*/

router.post(
  "/upload/campus",
  upload.single("campus_image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No campus image selected.",
        });
      }

      const campusImageUrl = `/uploads/college-header/campus/${req.file.filename}`;

      const [rows] = await pool.query(`
        SELECT id, campus_image_url
        FROM college_header
        ORDER BY id ASC
        LIMIT 1
      `);

      if (rows.length === 0) {
        await pool.query(
          `
          INSERT INTO college_header (
            college_name,
            campus_image_url,
            is_active
          )
          VALUES (?, ?, 1)
          `,
          ["Your College Name", campusImageUrl]
        );
      } else {
        if (rows[0].campus_image_url) {
          const oldPath = path.join(
            process.cwd(),
            rows[0].campus_image_url.replace(/^\/+/, "")
          );

          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        await pool.query(
          `
          UPDATE college_header
          SET campus_image_url = ?
          WHERE id = ?
          `,
          [campusImageUrl, rows[0].id]
        );
      }

      res.json({
        success: true,
        message: "Campus image uploaded successfully.",
        url: campusImageUrl,
      });
    } catch (error) {
      console.error("UPLOAD CAMPUS IMAGE ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Failed to upload campus image.",
        error: error.message,
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| DELETE LOGO
|--------------------------------------------------------------------------
| DELETE /api/college-header/logo
|--------------------------------------------------------------------------
*/

router.delete("/logo", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, logo_url
      FROM college_header
      ORDER BY id ASC
      LIMIT 1
    `);

    if (!rows.length || !rows[0].logo_url) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }

    const logoPath = path.join(
      process.cwd(),
      rows[0].logo_url.replace(/^\/+/, "")
    );

    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }

    await pool.query(
      `
      UPDATE college_header
      SET logo_url = NULL
      WHERE id = ?
      `,
      [rows[0].id]
    );

    res.json({
      success: true,
      message: "Logo deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE LOGO ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete logo.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE CAMPUS IMAGE
|--------------------------------------------------------------------------
| DELETE /api/college-header/campus
|--------------------------------------------------------------------------
*/

router.delete("/campus", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, campus_image_url
      FROM college_header
      ORDER BY id ASC
      LIMIT 1
    `);

    if (!rows.length || !rows[0].campus_image_url) {
      return res.status(404).json({
        success: false,
        message: "Campus image not found.",
      });
    }

    const imagePath = path.join(
      process.cwd(),
      rows[0].campus_image_url.replace(/^\/+/, "")
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await pool.query(
      `
      UPDATE college_header
      SET campus_image_url = NULL
      WHERE id = ?
      `,
      [rows[0].id]
    );

    res.json({
      success: true,
      message: "Campus image deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CAMPUS IMAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete campus image.",
      error: error.message,
    });
  }
});

export default router;

