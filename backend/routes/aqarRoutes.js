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
  "aqar"
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
    const originalName = path.basename(file.originalname);

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
   FILE FILTER
========================================================= */

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
];

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const mimeType = file.mimetype;

  if (
    allowedExtensions.includes(extension) &&
    allowedMimeTypes.includes(mimeType)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, XLS and XLSX files are allowed."
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
   DELETE FILE HELPER
========================================================= */

const deleteFile = (fileUrl) => {
  try {
    if (!fileUrl) return;

    let relativePath = fileUrl;

    if (relativePath.startsWith("/")) {
      relativePath = relativePath.substring(1);
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
      "AQAR FILE DELETE ERROR:",
      error
    );
  }
};

/* =========================================================
   GET ALL AQAR DOCUMENTS
   GET /api/naac/aqar
========================================================= */

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        academic_year,
        document_title,
        document_file,
        document_type,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM aqar_documents
      ORDER BY
        academic_year DESC,
        display_order ASC,
        id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET AQAR DOCUMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AQAR documents",
      error: error.message,
    });
  }
});

/* =========================================================
   GET SINGLE AQAR DOCUMENT
   GET /api/naac/aqar/:id
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        academic_year,
        document_title,
        document_file,
        document_type,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM aqar_documents
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "AQAR document not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "GET AQAR DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AQAR document",
      error: error.message,
    });
  }
});

/* =========================================================
   CREATE AQAR DOCUMENT
   POST /api/naac/aqar
========================================================= */

router.post(
  "/",
  upload.single("document"),
  async (req, res) => {
    try {
      const {
        academic_year,
        document_title,
        document_type,
        description,
        display_order,
        is_active,
      } = req.body;

      if (!academic_year?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/aqar/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Academic year is required.",
        });
      }

      if (!document_title?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/aqar/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Document title is required.",
        });
      }

      /*
        File is required when creating a new AQAR document.
      */

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an AQAR document.",
        });
      }

      const documentFile =
        `/uploads/aqar/${req.file.filename}`;

      const finalDocumentType =
        document_type?.trim() || "AQAR";

      const finalDisplayOrder =
        display_order !== undefined &&
        display_order !== ""
          ? Number(display_order)
          : 1;

      const finalIsActive =
        is_active !== undefined
          ? Number(is_active)
          : 1;

      const [result] = await db.query(
        `
        INSERT INTO aqar_documents
        (
          academic_year,
          document_title,
          document_file,
          document_type,
          description,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          academic_year.trim(),
          document_title.trim(),
          documentFile,
          finalDocumentType,
          description?.trim() || null,
          finalDisplayOrder,
          finalIsActive,
        ]
      );

      const [rows] = await db.query(
        `
        SELECT
          id,
          academic_year,
          document_title,
          document_file,
          document_type,
          description,
          display_order,
          is_active,
          created_at,
          updated_at
        FROM aqar_documents
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: "AQAR document added successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "CREATE AQAR DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/aqar/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create AQAR document",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   UPDATE AQAR DOCUMENT
   PUT /api/naac/aqar/:id
========================================================= */

router.put(
  "/:id",
  upload.single("document"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        academic_year,
        document_title,
        document_type,
        description,
        display_order,
        is_active,
      } = req.body;

      const [existingRows] = await db.query(
        `
        SELECT
          id,
          document_file
        FROM aqar_documents
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!existingRows.length) {
        if (req.file) {
          deleteFile(
            `/uploads/aqar/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message: "AQAR document not found.",
        });
      }

      const existingDocument =
        existingRows[0];

      if (!academic_year?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/aqar/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Academic year is required.",
        });
      }

      if (!document_title?.trim()) {
        if (req.file) {
          deleteFile(
            `/uploads/aqar/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Document title is required.",
        });
      }

      let documentFile =
        existingDocument.document_file;

      /*
        Replace old file only if a new file
        was uploaded.
      */

      if (req.file) {
        documentFile =
          `/uploads/aqar/${req.file.filename}`;
      }

      const finalDocumentType =
        document_type?.trim() || "AQAR";

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
        UPDATE aqar_documents
        SET
          academic_year = ?,
          document_title = ?,
          document_file = ?,
          document_type = ?,
          description = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          academic_year.trim(),
          document_title.trim(),
          documentFile,
          finalDocumentType,
          description?.trim() || null,
          finalDisplayOrder,
          finalIsActive,
          id,
        ]
      );

      /*
        Delete previous physical file
        only after successful database update.
      */

      if (
        req.file &&
        existingDocument.document_file &&
        existingDocument.document_file !==
          documentFile
      ) {
        deleteFile(
          existingDocument.document_file
        );
      }

      const [rows] = await db.query(
        `
        SELECT
          id,
          academic_year,
          document_title,
          document_file,
          document_type,
          description,
          display_order,
          is_active,
          created_at,
          updated_at
        FROM aqar_documents
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      return res.status(200).json({
        success: true,
        message: "AQAR document updated successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE AQAR DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/aqar/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update AQAR document",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   DELETE AQAR DOCUMENT
   DELETE /api/naac/aqar/:id
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        document_file
      FROM aqar_documents
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "AQAR document not found.",
      });
    }

    const documentFile =
      rows[0].document_file;

    await db.query(
      `
      DELETE FROM aqar_documents
      WHERE id = ?
      `,
      [id]
    );

    if (documentFile) {
      deleteFile(documentFile);
    }

    return res.status(200).json({
      success: true,
      message: "AQAR document deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE AQAR DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete AQAR document",
      error: error.message,
    });
  }
});

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "File size must not exceed 10 MB.",
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