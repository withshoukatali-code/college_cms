import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change this import path only if your db connection file has a different name.
import db from "../config/db.js";

// --------------------------------------------------
// Upload directory
// --------------------------------------------------

const uploadDir = path.join(
  __dirname,
  "../uploads/criteria-extension-documents"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// --------------------------------------------------
// Multer storage
// --------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${baseName}${ext}`
    );
  },
});

// --------------------------------------------------
// File filter
// --------------------------------------------------

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ];

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedTypes.includes(ext)) {
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
    fileSize: 10 * 1024 * 1024,
  },
});

// --------------------------------------------------
// Helper: delete uploaded file
// --------------------------------------------------

const deleteFile = (filePath) => {
  if (!filePath) return;

  const relativePath = filePath.replace(
    /^\/+/,
    ""
  );

  const fullPath = path.join(
    __dirname,
    "../",
    relativePath
  );

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// ==================================================
// GET ALL
// ==================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        criterion_no,
        document_title,
        document_file,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM criteria_extension_documents
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET CRITERIA EXTENSION DOCUMENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch Criteria Extension Documents.",
    });
  }
});

// ==================================================
// GET SINGLE
// ==================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        criterion_no,
        document_title,
        document_file,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM criteria_extension_documents
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "GET CRITERIA EXTENSION DOCUMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch document.",
    });
  }
});

// ==================================================
// CREATE
// ==================================================

router.post(
  "/",
  upload.single("document"),
  async (req, res) => {
    try {
      const {
        criterion_no,
        document_title,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
      } = req.body;

      if (!criterion_no?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Criterion number is required.",
        });
      }

      if (!document_title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Document title is required.",
        });
      }

      const documentFile = req.file
        ? `/uploads/criteria-extension-documents/${req.file.filename}`
        : null;

      const [result] = await db.query(
        `
        INSERT INTO criteria_extension_documents
        (
          criterion_no,
          document_title,
          document_file,
          document_type,
          academic_year,
          description,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          criterion_no.trim(),
          document_title.trim(),
          documentFile,
          document_type?.trim() || null,
          academic_year?.trim() || null,
          description?.trim() || null,
          Number(display_order) || 1,
          is_active === undefined
            ? 1
            : Number(is_active),
        ]
      );

      const [rows] = await db.query(
        `
        SELECT *
        FROM criteria_extension_documents
        WHERE id = ?
        `,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message:
          "Criteria Extension Document added successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "CREATE CRITERIA EXTENSION DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/criteria-extension-documents/${req.file.filename}`
        );
      }

      res.status(500).json({
        success: false,
        message:
          "Unable to add Criteria Extension Document.",
      });
    }
  }
);

// ==================================================
// UPDATE
// ==================================================

router.put(
  "/:id",
  upload.single("document"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        criterion_no,
        document_title,
        document_type,
        academic_year,
        description,
        display_order,
        is_active,
      } = req.body;

      if (!criterion_no?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Criterion number is required.",
        });
      }

      if (!document_title?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Document title is required.",
        });
      }

      const [existingRows] =
        await db.query(
          `
          SELECT *
          FROM criteria_extension_documents
          WHERE id = ?
          LIMIT 1
          `,
          [id]
        );

      if (existingRows.length === 0) {
        if (req.file) {
          deleteFile(
            `/uploads/criteria-extension-documents/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message: "Document not found.",
        });
      }

      const existing =
        existingRows[0];

      let documentFile =
        existing.document_file;

      if (req.file) {
        documentFile = `/uploads/criteria-extension-documents/${req.file.filename}`;

        if (existing.document_file) {
          deleteFile(
            existing.document_file
          );
        }
      }

      await db.query(
        `
        UPDATE criteria_extension_documents
        SET
          criterion_no = ?,
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
          criterion_no.trim(),
          document_title.trim(),
          documentFile,
          document_type?.trim() || null,
          academic_year?.trim() || null,
          description?.trim() || null,
          Number(display_order) || 1,
          is_active === undefined
            ? 1
            : Number(is_active),
          id,
        ]
      );

      const [rows] = await db.query(
        `
        SELECT *
        FROM criteria_extension_documents
        WHERE id = ?
        `,
        [id]
      );

      res.json({
        success: true,
        message:
          "Criteria Extension Document updated successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE CRITERIA EXTENSION DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        deleteFile(
          `/uploads/criteria-extension-documents/${req.file.filename}`
        );
      }

      res.status(500).json({
        success: false,
        message:
          "Unable to update Criteria Extension Document.",
      });
    }
  }
);

// ==================================================
// DELETE
// ==================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT document_file
      FROM criteria_extension_documents
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    if (rows[0].document_file) {
      deleteFile(
        rows[0].document_file
      );
    }

    await db.query(
      `
      DELETE FROM criteria_extension_documents
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message:
        "Criteria Extension Document deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CRITERIA EXTENSION DOCUMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete Criteria Extension Document.",
    });
  }
});

export default router;