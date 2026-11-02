import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------
// Upload directory
// backend/routes -> backend/uploads/extension-profile
// ----------------------------------------------------
const uploadDir = path.join(
  __dirname,
  "..",
  "uploads",
  "extension-profile"
);

fs.mkdirSync(uploadDir, { recursive: true });

// ----------------------------------------------------
// Multer storage
// ----------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const originalName = path
      .basename(file.originalname)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const uniqueName = `${Date.now()}-${originalName}`;

    cb(null, uniqueName);
  },
});

// ----------------------------------------------------
// Allowed document types
// ----------------------------------------------------
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

  if (
    allowedExtensions.includes(extension) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, XLS and XLSX files are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// ----------------------------------------------------
// Helper: delete uploaded file
// ----------------------------------------------------
const deleteFile = (filePath) => {
  if (!filePath) return;

  try {
    let relativePath = filePath;

    // /uploads/extension-profile/file.pdf
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.substring(1);
    }

    // Convert URL path to local file path
    const fullPath = path.join(
      __dirname,
      "..",
      relativePath
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("FILE DELETE ERROR:", error.message);
  }
};

// ====================================================
// GET ALL
// GET /api/naac/extension-profile
// ====================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        extended_id,
        deviation_question,
        document_title,
        document_file,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM extension_profile
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET EXTENSION PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch Extension Profile records.",
      error: error.message,
    });
  }
});

// ====================================================
// GET SINGLE
// GET /api/naac/extension-profile/:id
// ====================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        extended_id,
        deviation_question,
        document_title,
        document_file,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM extension_profile
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Extension Profile record not found.",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET EXTENSION PROFILE BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch record.",
      error: error.message,
    });
  }
});

// ====================================================
// CREATE
// POST /api/naac/extension-profile
// multipart/form-data
// field name: document
// ====================================================
router.post("/", upload.single("document"), async (req, res) => {
  try {
    const {
      extended_id,
      deviation_question,
      document_title,
      document_type,
      academic_year,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!extended_id || !extended_id.trim()) {
      if (req.file) deleteFile(`/uploads/extension-profile/${req.file.filename}`);

      return res.status(400).json({
        success: false,
        message: "Extended ID is required.",
      });
    }

    if (!deviation_question || !deviation_question.trim()) {
      if (req.file) deleteFile(`/uploads/extension-profile/${req.file.filename}`);

      return res.status(400).json({
        success: false,
        message: "Deviation question is required.",
      });
    }

    const documentFile = req.file
      ? `/uploads/extension-profile/${req.file.filename}`
      : null;

    const finalDocumentType =
      document_type ||
      (req.file
        ? path.extname(req.file.originalname).replace(".", "").toUpperCase()
        : null);

    const [result] = await db.query(
      `
      INSERT INTO extension_profile
      (
        extended_id,
        deviation_question,
        document_title,
        document_file,
        document_type,
        academic_year,
        description,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        extended_id.trim(),
        deviation_question.trim(),
        document_title || null,
        documentFile,
        finalDocumentType,
        academic_year || null,
        description || null,
        display_order || 1,
        is_active === undefined ? 1 : Number(is_active),
      ]
    );

    const [rows] = await db.query(
      `
      SELECT *
      FROM extension_profile
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Extension Profile record created successfully.",
      data: rows[0],
    });
  } catch (error) {
    if (req.file) {
      deleteFile(`/uploads/extension-profile/${req.file.filename}`);
    }

    console.error("CREATE EXTENSION PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create Extension Profile record.",
      error: error.message,
    });
  }
});

// ====================================================
// UPDATE
// PUT /api/naac/extension-profile/:id
// multipart/form-data
// field name: document
// ====================================================
router.put("/:id", upload.single("document"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      extended_id,
      deviation_question,
      document_title,
      document_type,
      academic_year,
      description,
      display_order,
      is_active,
    } = req.body;

    const [existingRows] = await db.query(
      `
      SELECT *
      FROM extension_profile
      WHERE id = ?
      `,
      [id]
    );

    if (existingRows.length === 0) {
      if (req.file) {
        deleteFile(`/uploads/extension-profile/${req.file.filename}`);
      }

      return res.status(404).json({
        success: false,
        message: "Extension Profile record not found.",
      });
    }

    const existing = existingRows[0];

    if (!extended_id || !extended_id.trim()) {
      if (req.file) {
        deleteFile(`/uploads/extension-profile/${req.file.filename}`);
      }

      return res.status(400).json({
        success: false,
        message: "Extended ID is required.",
      });
    }

    if (!deviation_question || !deviation_question.trim()) {
      if (req.file) {
        deleteFile(`/uploads/extension-profile/${req.file.filename}`);
      }

      return res.status(400).json({
        success: false,
        message: "Deviation question is required.",
      });
    }

    let documentFile = existing.document_file;
    let finalDocumentType =
      document_type || existing.document_type;

    // New file selected
    if (req.file) {
      documentFile = `/uploads/extension-profile/${req.file.filename}`;

      finalDocumentType =
        document_type ||
        path
          .extname(req.file.originalname)
          .replace(".", "")
          .toUpperCase();

      // Delete old file
      if (existing.document_file) {
        deleteFile(existing.document_file);
      }
    }

    await db.query(
      `
      UPDATE extension_profile
      SET
        extended_id = ?,
        deviation_question = ?,
        document_title = ?,
        document_file = ?,
        document_type = ?,
        academic_year = ?,
        description = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        extended_id.trim(),
        deviation_question.trim(),
        document_title || null,
        documentFile,
        finalDocumentType || null,
        academic_year || null,
        description || null,
        display_order || 1,
        is_active === undefined ? 1 : Number(is_active),
        id,
      ]
    );

    const [rows] = await db.query(
      `
      SELECT *
      FROM extension_profile
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Extension Profile record updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    if (req.file) {
      deleteFile(`/uploads/extension-profile/${req.file.filename}`);
    }

    console.error("UPDATE EXTENSION PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update Extension Profile record.",
      error: error.message,
    });
  }
});

// ====================================================
// DELETE
// DELETE /api/naac/extension-profile/:id
// ====================================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT document_file
      FROM extension_profile
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Extension Profile record not found.",
      });
    }

    const documentFile = rows[0].document_file;

    await db.query(
      `
      DELETE FROM extension_profile
      WHERE id = ?
      `,
      [id]
    );

    if (documentFile) {
      deleteFile(documentFile);
    }

    res.json({
      success: true,
      message: "Extension Profile record deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE EXTENSION PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete Extension Profile record.",
      error: error.message,
    });
  }
});

// ====================================================
// MULTER ERROR HANDLER
// ====================================================
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 10 MB.",
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