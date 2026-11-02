import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(
  __dirname,
  "../uploads/home-slides"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${baseName}${extension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

// =====================================================
// PUBLIC ACTIVE SLIDES
// GET /api/home-slides
// =====================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        subtitle,
        description,
        image_url,
        button_text,
        button_link,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_slides
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET home slides error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home slides",
      error: error.message,
    });
  }
});

// =====================================================
// ALL SLIDES - ADMIN
// GET /api/home-slides/all
// =====================================================

router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM home_slides
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET all home slides error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home slides",
      error: error.message,
    });
  }
});

// =====================================================
// SINGLE
// GET /api/home-slides/:id
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM home_slides
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Home slide not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET home slide error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home slide",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE
// POST /api/home-slides
// multipart/form-data
// =====================================================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        subtitle,
        description,
        button_text,
        button_link,
        display_order,
        is_active,
      } = req.body;

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slide title is required",
        });
      }

      const imageUrl = req.file
        ? `/uploads/home-slides/${req.file.filename}`
        : null;

      const active =
        Number(is_active ?? 1) === 1 ? 1 : 0;

      const [result] = await pool.query(
        `
        INSERT INTO home_slides
        (
          title,
          subtitle,
          description,
          image_url,
          button_text,
          button_link,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title.trim(),
          subtitle?.trim() || null,
          description?.trim() || null,
          imageUrl,
          button_text?.trim() || null,
          button_link?.trim() || null,
          Number(display_order) || 0,
          active,
        ]
      );

      const [rows] = await pool.query(
        `
        SELECT *
        FROM home_slides
        WHERE id = ?
        `,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: "Hero slide created successfully",
        data: rows[0],
      });
    } catch (error) {
      console.error("CREATE home slide error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create hero slide",
        error: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE
// PUT /api/home-slides/:id
// =====================================================

router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        title,
        subtitle,
        description,
        button_text,
        button_link,
        display_order,
        is_active,
      } = req.body;

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slide title is required",
        });
      }

      const [oldRows] = await pool.query(
        `
        SELECT image_url
        FROM home_slides
        WHERE id = ?
        `,
        [id]
      );

      if (!oldRows.length) {
        return res.status(404).json({
          success: false,
          message: "Home slide not found",
        });
      }

      let imageUrl = oldRows[0].image_url;

      if (req.file) {
        imageUrl =
          `/uploads/home-slides/${req.file.filename}`;
      }

      const active =
        Number(is_active ?? 1) === 1 ? 1 : 0;

      const [result] = await pool.query(
        `
        UPDATE home_slides
        SET
          title = ?,
          subtitle = ?,
          description = ?,
          image_url = ?,
          button_text = ?,
          button_link = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          title.trim(),
          subtitle?.trim() || null,
          description?.trim() || null,
          imageUrl,
          button_text?.trim() || null,
          button_link?.trim() || null,
          Number(display_order) || 0,
          active,
          id,
        ]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Home slide not found",
        });
      }

      // Delete old image after successful DB update
      const oldImage = oldRows[0].image_url;

      if (
        req.file &&
        oldImage &&
        oldImage.startsWith(
          "/uploads/home-slides/"
        )
      ) {
        const oldFile = path.join(
          __dirname,
          "..",
          oldImage
        );

        if (fs.existsSync(oldFile)) {
          try {
            fs.unlinkSync(oldFile);
          } catch (deleteError) {
            console.warn(
              "Could not delete old slide image:",
              deleteError.message
            );
          }
        }
      }

      const [rows] = await pool.query(
        `
        SELECT *
        FROM home_slides
        WHERE id = ?
        `,
        [id]
      );

      res.json({
        success: true,
        message: "Hero slide updated successfully",
        data: rows[0],
      });
    } catch (error) {
      console.error("UPDATE home slide error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update hero slide",
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE
// DELETE /api/home-slides/:id
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT image_url
      FROM home_slides
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Home slide not found",
      });
    }

    const imageUrl = rows[0].image_url;

    await pool.query(
      `
      DELETE FROM home_slides
      WHERE id = ?
      `,
      [id]
    );

    if (
      imageUrl &&
      imageUrl.startsWith(
        "/uploads/home-slides/"
      )
    ) {
      const imageFile = path.join(
        __dirname,
        "..",
        imageUrl
      );

      if (fs.existsSync(imageFile)) {
        try {
          fs.unlinkSync(imageFile);
        } catch (deleteError) {
          console.warn(
            "Could not delete slide image:",
            deleteError.message
          );
        }
      }
    }

    res.json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error("DELETE home slide error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete hero slide",
      error: error.message,
    });
  }
});

export default router;