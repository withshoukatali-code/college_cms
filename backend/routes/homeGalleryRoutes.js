import express from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "gallery"
);

/*
|--------------------------------------------------------------------------
| CREATE DIRECTORY
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| MULTER
|--------------------------------------------------------------------------
|
| Store uploaded image in memory first.
| Sharp will then process it and save WebP.
|
*/

const storage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| FILE FILTER
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
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
      ),
      false
    );
  }
};

/*
|--------------------------------------------------------------------------
| MULTER UPLOAD
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| DELETE IMAGE FILE
|--------------------------------------------------------------------------
*/

const deleteImageFile = (imageUrl) => {
  try {
    if (!imageUrl) {
      return;
    }

    /*
    Example:

    /uploads/gallery/photo-123.webp

    becomes:

    uploads/gallery/photo-123.webp
    */

    const relativePath = imageUrl.replace(/^\/+/, "");

    const filePath = path.join(
      process.cwd(),
      relativePath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "Deleted gallery image:",
        filePath
      );
    }
  } catch (error) {
    console.error(
      "Failed to delete gallery image:",
      error
    );
  }
};

/*
|--------------------------------------------------------------------------
| CREATE UNIQUE WEBP FILENAME
|--------------------------------------------------------------------------
*/

const createFileName = (originalName) => {
  const extension = path.extname(
    originalName
  );

  const baseName = path
    .basename(originalName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${baseName || "gallery-image"}-${Date.now()}.webp`;
};

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| PUBLIC
| GET /api/home-gallery
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        image_url,
        alt_text,
        display_order,
        is_active
      FROM home_gallery
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET /api/home-gallery error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage gallery.",
    });
  }
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| ADMIN
| GET /api/home-gallery/admin
|--------------------------------------------------------------------------
*/

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        image_url,
        alt_text,
        display_order,
        is_active
      FROM home_gallery
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET /api/home-gallery/admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage gallery.",
    });
  }
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| UPLOAD IMAGE
|
| POST /api/home-gallery/upload
|
| FormData:
| image = selected file
|--------------------------------------------------------------------------
*/

router.post(
  "/upload",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      /*
      ------------------------------------------------------
      CREATE WEBP FILE NAME
      ------------------------------------------------------
      */

      const fileName = createFileName(
        req.file.originalname
      );

      const outputPath = path.join(
        uploadDirectory,
        fileName
      );

      /*
      ------------------------------------------------------
      SHARP PROCESSING
      ------------------------------------------------------
      */

      await sharp(req.file.buffer)
        .rotate()
        .resize({
          width: 1800,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({
          quality: 85,
          effort: 4,
        })
        .toFile(outputPath);

      /*
      ------------------------------------------------------
      DATABASE / FRONTEND URL
      ------------------------------------------------------
      */

      const imageUrl =
        `/uploads/gallery/${fileName}`;

      console.log(
        "Gallery image uploaded:",
        outputPath
      );

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        data: {
          filename: fileName,
          image_url: imageUrl,
        },
      });
    } catch (error) {
      console.error(
        "POST /api/home-gallery/upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to upload image.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| CREATE GALLERY RECORD
|
| POST /api/home-gallery/admin
|--------------------------------------------------------------------------
*/

router.post("/admin", async (req, res) => {
  try {
    const {
      title,
      image_url,
      alt_text,
      display_order,
      is_active,
    } = req.body;

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO home_gallery
      (
        title,
        image_url,
        alt_text,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        title?.trim() || null,
        image_url.trim(),
        alt_text?.trim() || null,
        Number(display_order) || 0,
        is_active ? 1 : 0,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Homepage gallery image added successfully.",
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    console.error(
      "POST /api/home-gallery/admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to add homepage gallery image.",
    });
  }
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| UPDATE GALLERY RECORD
|
| PUT /api/home-gallery/admin/:id
|--------------------------------------------------------------------------
*/

router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      image_url,
      alt_text,
      display_order,
      is_active,
    } = req.body;

    /*
    ------------------------------------------------------
    GET OLD RECORD
    ------------------------------------------------------
    */

    const [existingRows] = await pool.query(
      `
      SELECT
        id,
        image_url
      FROM home_gallery
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const oldImageUrl =
      existingRows[0].image_url;

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    /*
    ------------------------------------------------------
    UPDATE DATABASE
    ------------------------------------------------------
    */

    await pool.query(
      `
      UPDATE home_gallery
      SET
        title = ?,
        image_url = ?,
        alt_text = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title?.trim() || null,
        image_url.trim(),
        alt_text?.trim() || null,
        Number(display_order) || 0,
        is_active ? 1 : 0,
        id,
      ]
    );

    /*
    ------------------------------------------------------
    DELETE OLD IMAGE IF REPLACED
    ------------------------------------------------------
    */

    if (
      oldImageUrl &&
      oldImageUrl !== image_url.trim()
    ) {
      deleteImageFile(oldImageUrl);
    }

    res.json({
      success: true,
      message:
        "Homepage gallery image updated successfully.",
    });
  } catch (error) {
    console.error(
      "PUT /api/home-gallery/admin/:id error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update homepage gallery image.",
    });
  }
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| DELETE
|
| DELETE /api/home-gallery/admin/:id
|--------------------------------------------------------------------------
*/

router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    /*
    ------------------------------------------------------
    GET IMAGE
    ------------------------------------------------------
    */

    const [rows] = await pool.query(
      `
      SELECT
        id,
        image_url
      FROM home_gallery
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const imageUrl =
      rows[0].image_url;

    /*
    ------------------------------------------------------
    DELETE DATABASE RECORD
    ------------------------------------------------------
    */

    await pool.query(
      `
      DELETE FROM home_gallery
      WHERE id = ?
      `,
      [id]
    );

    /*
    ------------------------------------------------------
    DELETE PHYSICAL IMAGE
    ------------------------------------------------------
    */

    deleteImageFile(imageUrl);

    res.json({
      success: true,
      message:
        "Homepage gallery image deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/home-gallery/admin/:id error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete homepage gallery image.",
    });
  }
});

/*
|--------------------------------------------------------------------------
|--------------------------------------------------------------------------
| MULTER / UPLOAD ERROR HANDLER
|--------------------------------------------------------------------------
*/

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "Image size must not exceed 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;