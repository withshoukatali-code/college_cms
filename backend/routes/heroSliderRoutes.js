import express from "express";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "hero-slider"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      `hero-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

// =====================================================
// GET ACTIVE HERO SLIDES
// PUBLIC HOMEPAGE
// =====================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        image_url,
        button_text,
        button_link,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM heroslider
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET /api/hero-slider error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slides.",
    });
  }
});

// =====================================================
// GET ALL HERO SLIDES
// ADMIN
// =====================================================

router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        image_url,
        button_text,
        button_link,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM heroslider
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET /api/hero-slider/all error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slides.",
    });
  }
});

// =====================================================
// UPLOAD HERO IMAGE
// POST /api/hero-slider/upload
// =====================================================

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded.",
        });
      }

      const imageUrl =
        `/uploads/hero-slider/${req.file.filename}`;

      res.json({
        success: true,
        message: "Hero image uploaded successfully.",
        image_url: imageUrl,
      });
    } catch (error) {
      console.error(
        "Hero image upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to upload hero image.",
      });
    }
  }
);

// =====================================================
// CREATE HERO SLIDE
// POST /api/hero-slider
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      image_url,
      button_text,
      button_link,
      display_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero slide title is required.",
      });
    }

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero slide image is required.",
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO heroslider
        (
          title,
          description,
          image_url,
          button_text,
          button_link,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        description?.trim() || null,
        image_url.trim(),
        button_text?.trim() || null,
        button_link?.trim() || null,
        Number(display_order) || 0,
        is_active === false ? 0 : 1,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Hero slide added successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(
      "POST /api/hero-slider error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add hero slide.",
    });
  }
});

// =====================================================
// UPDATE HERO SLIDE
// PUT /api/hero-slider/:id
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image_url,
      button_text,
      button_link,
      display_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero slide title is required.",
      });
    }

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero slide image is required.",
      });
    }

    const [result] = await db.query(
      `
        UPDATE heroslider
        SET
          title = ?,
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
        description?.trim() || null,
        image_url.trim(),
        button_text?.trim() || null,
        button_link?.trim() || null,
        Number(display_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found.",
      });
    }

    res.json({
      success: true,
      message: "Hero slide updated successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/hero-slider/:id error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update hero slide.",
    });
  }
});

// =====================================================
// DELETE HERO SLIDE
// DELETE /api/hero-slider/:id
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get image first so it can be removed
    const [rows] = await db.query(
      `
        SELECT image_url
        FROM heroslider
        WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found.",
      });
    }

    const imageUrl = rows[0].image_url;

    const [result] = await db.query(
      `
        DELETE FROM heroslider
        WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found.",
      });
    }

    // Remove uploaded image if it belongs to our upload folder
    if (
      imageUrl &&
      imageUrl.startsWith(
        "/uploads/hero-slider/"
      )
    ) {
      const imagePath = path.join(
        process.cwd(),
        imageUrl.replace(/^\//, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: "Hero slide deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/hero-slider/:id error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete hero slide.",
    });
  }
});

export default router;