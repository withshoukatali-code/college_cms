
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const router = express.Router();

// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "news-notices"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ============================================================
// MULTER
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${name}${ext}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];

    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(
        new Error(
          "Only PDF, DOC, DOCX, JPG, JPEG and WEBP files are allowed."
        )
      );
    }

    cb(null, true);
  },
});

// ============================================================
// HELPER
// ============================================================

const fileUrl = (filename) => {
  if (!filename) return null;

  return `/uploads/news-notices/${filename}`;
};

// ============================================================
// GET ALL
// GET /api/news-notices
// ============================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        category,
        description,
        publish_date,
        link,
        attachment,
        is_active,
        display_order,
        created_at,
        updated_at,
        is_breaking
      FROM news_notices
      ORDER BY
        display_order ASC,
        publish_date DESC,
        id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(
      "GET /api/news-notices:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load news or notices.",
      error: error.message,
    });
  }
});

// ============================================================
// ADMIN GET ALL
// GET /api/news-notices/admin
//
// IMPORTANT:
// This MUST come before /:id
// ============================================================

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        category,
        description,
        publish_date,
        link,
        attachment,
        is_active,
        display_order,
        created_at,
        updated_at,
        is_breaking
      FROM news_notices
      ORDER BY
        display_order ASC,
        publish_date DESC,
        id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(
      "GET /api/news-notices/admin:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load admin news and notices.",
      error: error.message,
    });
  }
});

// ============================================================
// GET SINGLE
// GET /api/news-notices/:id
//
// This is AFTER /admin so "admin" is not treated as an ID.
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        category,
        description,
        publish_date,
        link,
        attachment,
        is_active,
        display_order,
        created_at,
        updated_at,
        is_breaking
      FROM news_notices
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "News or notice not found.",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(
      "GET /api/news-notices/:id:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load news or notice.",
      error: error.message,
    });
  }
});

// ============================================================
// CREATE
// POST /api/news-notices
// ============================================================

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log(
        "CREATE NEWS/NOTICE BODY:",
        req.body
      );

      console.log(
        "CREATE NEWS/NOTICE FILE:",
        req.file
          ? req.file.filename
          : "No file"
      );

      const {
        title,
        category,
        description,
        publish_date,
        link,
        display_order,
        is_active,
        is_breaking,
      } = req.body;

      // --------------------------------------------------------
      // TITLE
      // --------------------------------------------------------

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      // --------------------------------------------------------
      // CATEGORY
      // --------------------------------------------------------

      const finalCategory =
        category === "Notice"
          ? "Notice"
          : "News";

      // --------------------------------------------------------
      // ATTACHMENT
      // --------------------------------------------------------

      const attachment = req.file
        ? fileUrl(req.file.filename)
        : null;

      // --------------------------------------------------------
      // VALUES
      // --------------------------------------------------------

      const finalDescription =
        description?.trim() || null;

      const finalDate =
        publish_date?.trim() || null;

      const finalLink =
        link?.trim() || null;

      const finalOrder =
        display_order !== undefined &&
        display_order !== ""
          ? Number(display_order)
          : 0;

      const finalActive =
        is_active !== undefined &&
        is_active !== ""
          ? Number(is_active)
          : 1;

      const finalBreaking =
        is_breaking !== undefined &&
        is_breaking !== ""
          ? Number(is_breaking)
          : 0;

      // --------------------------------------------------------
      // INSERT
      // --------------------------------------------------------

      const [result] = await pool.query(
        `
        INSERT INTO news_notices
        (
          title,
          category,
          description,
          publish_date,
          link,
          attachment,
          is_active,
          display_order,
          is_breaking
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title.trim(),
          finalCategory,
          finalDescription,
          finalDate,
          finalLink,
          attachment,
          finalActive,
          finalOrder,
          finalBreaking,
        ]
      );

      // --------------------------------------------------------
      // GET CREATED RECORD
      // --------------------------------------------------------

      const [rows] = await pool.query(
        `
        SELECT
          id,
          title,
          category,
          description,
          publish_date,
          link,
          attachment,
          is_active,
          display_order,
          created_at,
          updated_at,
          is_breaking
        FROM news_notices
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message:
          "News or notice created successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "POST /api/news-notices:",
        error
      );

      // Delete uploaded file if DB failed
      if (req.file) {
        const uploadedPath = path.join(
          uploadDir,
          req.file.filename
        );

        if (fs.existsSync(uploadedPath)) {
          try {
            fs.unlinkSync(uploadedPath);
          } catch {}
        }
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create news or notice.",
        error: error.message,
      });
    }
  }
);

// ============================================================
// UPDATE
// PUT /api/news-notices/:id
// ============================================================

router.put(
  "/:id",
  upload.single("file"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        title,
        category,
        description,
        publish_date,
        link,
        display_order,
        is_active,
        is_breaking,
      } = req.body;

      // --------------------------------------------------------
      // EXISTING RECORD
      // --------------------------------------------------------

      const [existingRows] =
        await pool.query(
          `
          SELECT *
          FROM news_notices
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        );

      if (existingRows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "News or notice not found.",
        });
      }

      const existing =
        existingRows[0];

      // --------------------------------------------------------
      // CATEGORY
      // --------------------------------------------------------

      const finalCategory =
        category === "Notice"
          ? "Notice"
          : "News";

      // --------------------------------------------------------
      // ATTACHMENT
      // --------------------------------------------------------

      let attachment =
        existing.attachment || null;

      // New file uploaded
      if (req.file) {
        attachment = fileUrl(
          req.file.filename
        );

        // Delete old attachment
        if (existing.attachment) {
          const oldFilename =
            path.basename(
              existing.attachment
            );

          const oldPath = path.join(
            uploadDir,
            oldFilename
          );

          if (fs.existsSync(oldPath)) {
            try {
              fs.unlinkSync(oldPath);
            } catch (fileError) {
              console.warn(
                "Old attachment could not be deleted:",
                fileError.message
              );
            }
          }
        }
      }

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------

      await pool.query(
        `
        UPDATE news_notices
        SET
          title = ?,
          category = ?,
          description = ?,
          publish_date = ?,
          link = ?,
          attachment = ?,
          is_active = ?,
          display_order = ?,
          is_breaking = ?
        WHERE id = ?
        `,
        [
          title?.trim() ||
            existing.title,

          finalCategory,

          description !== undefined
            ? description.trim() || null
            : existing.description,

          publish_date !== undefined &&
          publish_date !== ""
            ? publish_date
            : existing.publish_date,

          link !== undefined &&
          link !== ""
            ? link.trim()
            : null,

          attachment,

          is_active !== undefined &&
          is_active !== ""
            ? Number(is_active)
            : existing.is_active,

          display_order !== undefined &&
          display_order !== ""
            ? Number(display_order)
            : existing.display_order,

          is_breaking !== undefined &&
          is_breaking !== ""
            ? Number(is_breaking)
            : existing.is_breaking,

          id,
        ]
      );

      // --------------------------------------------------------
      // RETURN UPDATED
      // --------------------------------------------------------

      const [rows] = await pool.query(
        `
        SELECT
          id,
          title,
          category,
          description,
          publish_date,
          link,
          attachment,
          is_active,
          display_order,
          created_at,
          updated_at,
          is_breaking
        FROM news_notices
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      res.json({
        success: true,
        message:
          "News or notice updated successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "PUT /api/news-notices/:id:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update news or notice.",
        error: error.message,
      });
    }
  }
);

// ============================================================
// DELETE
// DELETE /api/news-notices/:id
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // FIND RECORD
    // --------------------------------------------------------

    const [rows] = await pool.query(
      `
      SELECT attachment
      FROM news_notices
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "News or notice not found.",
      });
    }

    const attachment =
      rows[0].attachment;

    // --------------------------------------------------------
    // DELETE DATABASE RECORD
    // --------------------------------------------------------

    await pool.query(
      `
      DELETE FROM news_notices
      WHERE id = ?
      `,
      [id]
    );

    // --------------------------------------------------------
    // DELETE FILE
    // --------------------------------------------------------

    if (attachment) {
      const filename =
        path.basename(attachment);

      const filePath = path.join(
        uploadDir,
        filename
      );

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    }

    res.json({
      success: true,
      message:
        "News or notice deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/news-notices/:id:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete news or notice.",
      error: error.message,
    });
  }
});

export default router;

