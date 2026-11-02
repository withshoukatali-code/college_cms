import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import db from "../config/db.js";

const router = express.Router();

/* =========================================================
   DIRECTORY SETUP
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "iqac"
);

fs.mkdirSync(uploadDir, {
  recursive: true,
});

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const originalName = path.basename(
      file.originalname
    );

    const safeName = originalName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(
      null,
      `${Date.now()}-${safeName}`
    );
  },
});

/* =========================================================
   PDF ONLY
========================================================= */

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    extension === ".pdf" &&
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed for IQAC meetings."
      ),
      false
    );
  }
};

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* =========================================================
   DELETE FILE
========================================================= */

const deleteFile = (fileUrl) => {
  try {
    if (!fileUrl) return;

    let relativePath = fileUrl;

    if (relativePath.startsWith("/")) {
      relativePath =
        relativePath.substring(1);
    }

    const filePath = path.join(
      __dirname,
      "..",
      relativePath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "IQAC FILE DELETE ERROR:",
      error
    );
  }
};

/* =========================================================
   GET ALL IQAC MEETINGS
   GET /api/iqac/meetings
========================================================= */

router.get("/meetings", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        academic_year,
        meeting_title,
        meeting_date,
        description,
        document_file,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM iqac_meetings
      ORDER BY
        academic_year DESC,
        display_order ASC,
        meeting_date DESC,
        id DESC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET IQAC MEETINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch IQAC meetings",
      error: error.message,
    });
  }
});

/* =========================================================
   GET SINGLE MEETING
   GET /api/iqac/meetings/:id
========================================================= */

router.get(
  "/meetings/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT
          id,
          academic_year,
          meeting_title,
          meeting_date,
          description,
          document_file,
          display_order,
          is_active,
          created_at,
          updated_at
        FROM iqac_meetings
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "IQAC meeting not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "GET IQAC MEETING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch IQAC meeting",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   CREATE MEETING
   POST /api/iqac/meetings
========================================================= */

router.post(
  "/meetings",
  upload.single("document"),
  async (req, res) => {
    try {
      const {
        academic_year,
        meeting_title,
        meeting_date,
        description,
        display_order,
        is_active,
      } = req.body;

      if (!academic_year?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/iqac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Academic year is required.",
        });
      }

      if (!meeting_title?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/iqac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Meeting title is required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload the IQAC meeting PDF.",
        });
      }

      const documentFile =
        `/uploads/iqac/${req.file.filename}`;

      const finalDisplayOrder =
        display_order !== undefined &&
        display_order !== ""
          ? Number(display_order)
          : 1;

      const finalIsActive =
        is_active !== undefined
          ? Number(is_active)
          : 1;

      await db.query(
        `
        INSERT INTO iqac_meetings
        (
          academic_year,
          meeting_title,
          meeting_date,
          description,
          document_file,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          academic_year.trim(),
          meeting_title.trim(),
          meeting_date || null,
          description?.trim() || null,
          documentFile,
          finalDisplayOrder,
          finalIsActive,
        ]
      );

      return res.status(201).json({
        success: true,
        message:
          "IQAC meeting added successfully.",
      });
    } catch (error) {
      console.error(
        "CREATE IQAC MEETING ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/iqac/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create IQAC meeting",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   UPDATE MEETING
   PUT /api/iqac/meetings/:id
========================================================= */

router.put(
  "/meetings/:id",
  upload.single("document"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        academic_year,
        meeting_title,
        meeting_date,
        description,
        display_order,
        is_active,
      } = req.body;

      const [existingRows] = await db.query(
        `
        SELECT
          id,
          document_file
        FROM iqac_meetings
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!existingRows.length) {
        if (req.file) {
          deleteFile(
            `/uploads/iqac/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message:
            "IQAC meeting not found.",
        });
      }

      if (!academic_year?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/iqac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Academic year is required.",
        });
      }

      if (!meeting_title?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/iqac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Meeting title is required.",
        });
      }

      const oldDocumentFile =
        existingRows[0].document_file;

      let documentFile =
        oldDocumentFile;

      if (req.file) {
        documentFile =
          `/uploads/iqac/${req.file.filename}`;
      }

      const finalDisplayOrder =
        display_order !== undefined &&
        display_order !== ""
          ? Number(display_order)
          : 1;

      const finalIsActive =
        is_active !== undefined
          ? Number(is_active)
          : 1;

      await db.query(
        `
        UPDATE iqac_meetings
        SET
          academic_year = ?,
          meeting_title = ?,
          meeting_date = ?,
          description = ?,
          document_file = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          academic_year.trim(),
          meeting_title.trim(),
          meeting_date || null,
          description?.trim() || null,
          documentFile,
          finalDisplayOrder,
          finalIsActive,
          id,
        ]
      );

      if (
        req.file &&
        oldDocumentFile &&
        oldDocumentFile !== documentFile
      ) {
        deleteFile(oldDocumentFile);
      }

      return res.status(200).json({
        success: true,
        message:
          "IQAC meeting updated successfully.",
      });
    } catch (error) {
      console.error(
        "UPDATE IQAC MEETING ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/iqac/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update IQAC meeting",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   DELETE MEETING
   DELETE /api/iqac/meetings/:id
========================================================= */

router.delete(
  "/meetings/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT document_file
        FROM iqac_meetings
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message:
            "IQAC meeting not found.",
        });
      }

      const documentFile =
        rows[0].document_file;

      await db.query(
        `
        DELETE FROM iqac_meetings
        WHERE id = ?
        `,
        [id]
      );

      if (documentFile) {
        deleteFile(documentFile);
      }

      return res.status(200).json({
        success: true,
        message:
          "IQAC meeting deleted successfully.",
      });
    } catch (error) {
      console.error(
        "DELETE IQAC MEETING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete IQAC meeting",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "PDF size must not exceed 10 MB.",
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