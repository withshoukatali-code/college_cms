import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "content-documents");
const moduleKeys = new Set([
  "feedback",
  "audit",
  "recognition-rankings",
  "mandatory-disclosure",
  "iqac-annual-reports",
  "iqac-archive",
  "iqac-action-taken",
  "naac-documents",
]);
const requiredPdfModules = new Set([
  "feedback",
  "audit",
  "mandatory-disclosure",
  "iqac-annual-reports",
  "iqac-archive",
  "iqac-action-taken",
  "naac-documents",
]);

fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const safeName = path.basename(file.originalname)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      callback(null, `${Date.now()}-${safeName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isPdf = path.extname(file.originalname).toLowerCase() === ".pdf"
      && file.mimetype === "application/pdf";
    callback(isPdf ? null : new Error("Only PDF files are allowed."), isPdf);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS cms_document_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      module_key VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      category VARCHAR(180) NULL,
      academic_year VARCHAR(32) NULL,
      pdf_url TEXT NULL,
      external_url TEXT NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cms_document_module (module_key, is_active, display_order)
    )
  `);
  const [columns] = await db.query("SHOW COLUMNS FROM cms_document_items");
  if (!columns.some((column) => column.Field === "external_url")) {
    await db.query("ALTER TABLE cms_document_items ADD COLUMN external_url TEXT NULL");
  }
}

function isValidModule(moduleKey) {
  return moduleKeys.has(moduleKey);
}

function requiresPdf(moduleKey) {
  return requiredPdfModules.has(moduleKey);
}

function removeUploadedFile(fileUrl) {
  if (!fileUrl?.startsWith("/uploads/content-documents/")) return;
  const filePath = path.resolve(__dirname, "..", fileUrl.slice(1));
  const directory = path.resolve(uploadDir);
  if (filePath.startsWith(`${directory}${path.sep}`) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function removeRequestUpload(file) {
  if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
}

function parseDisplayOrder(value) {
  const order = Number(value);
  return Number.isInteger(order) && order >= 0 ? order : 0;
}

function validateExternalUrl(value) {
  const input = String(value || "").trim();
  if (!input) return { valid: true, value: null };
  try {
    const url = new URL(input);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { valid: true, value: url.href };
    }
  } catch {
    return { valid: false, value: null };
  }
  return { valid: false, value: null };
}

router.get("/:moduleKey", async (req, res) => {
  const { moduleKey } = req.params;
  if (!isValidModule(moduleKey)) {
    return res.status(400).json({ success: false, message: "Unknown document module." });
  }
  try {
    await ensureTable();
    const includeInactive = req.query.includeInactive === "1";
    const [rows] = await db.query(
      `SELECT id, module_key, title, description, category, academic_year,
        pdf_url, external_url, display_order, is_active, updated_at
       FROM cms_document_items
       WHERE module_key = ? ${includeInactive ? "" : "AND is_active = 1"}
       ORDER BY display_order ASC, academic_year DESC, id ASC`,
      [moduleKey]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET CMS DOCUMENT ITEMS ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load documents." });
  }
});

router.post("/:moduleKey", upload.single("pdf"), async (req, res) => {
  const { moduleKey } = req.params;
  if (!isValidModule(moduleKey)) {
    removeRequestUpload(req.file);
    return res.status(400).json({ success: false, message: "Unknown document module." });
  }

  try {
    await ensureTable();
    const title = String(req.body?.title || "").trim();
    if (!title) {
      removeRequestUpload(req.file);
      return res.status(400).json({ success: false, message: "Document title is required." });
    }
    const externalUrl = validateExternalUrl(req.body?.external_url);
    if (!externalUrl.valid) {
      removeRequestUpload(req.file);
      return res.status(400).json({ success: false, message: "Enter a valid HTTP or HTTPS document URL." });
    }
    if (requiresPdf(moduleKey) && !req.file && !externalUrl.value) {
      return res.status(400).json({ success: false, message: "Choose a PDF document." });
    }
    const pdfUrl = req.file ? `/uploads/content-documents/${req.file.filename}` : null;
    const [result] = await db.query(
      `INSERT INTO cms_document_items
        (module_key, title, description, category, academic_year, pdf_url, external_url, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        moduleKey,
        title,
        String(req.body?.description || "").trim() || null,
        String(req.body?.category || "").trim() || null,
        String(req.body?.academic_year || "").trim() || null,
        pdfUrl,
        externalUrl.value,
        parseDisplayOrder(req.body?.display_order),
        req.body?.is_active === "0" ? 0 : 1,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId, message: "Document added." });
  } catch (error) {
    removeRequestUpload(req.file);
    console.error("CREATE CMS DOCUMENT ITEM ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to add document." });
  }
});

router.put("/:moduleKey/:id", upload.single("pdf"), async (req, res) => {
  const { moduleKey } = req.params;
  const id = Number(req.params.id);
  if (!isValidModule(moduleKey) || !Number.isInteger(id) || id < 1) {
    removeRequestUpload(req.file);
    return res.status(400).json({ success: false, message: "Invalid document." });
  }

  try {
    await ensureTable();
    const title = String(req.body?.title || "").trim();
    if (!title) {
      removeRequestUpload(req.file);
      return res.status(400).json({ success: false, message: "Document title is required." });
    }
    const [rows] = await db.query(
      "SELECT pdf_url FROM cms_document_items WHERE id = ? AND module_key = ? LIMIT 1",
      [id, moduleKey]
    );
    if (!rows.length) {
      removeRequestUpload(req.file);
      return res.status(404).json({ success: false, message: "Document not found." });
    }
    const currentPdf = rows[0].pdf_url;
    const externalUrl = validateExternalUrl(req.body?.external_url);
    if (!externalUrl.valid) {
      removeRequestUpload(req.file);
      return res.status(400).json({ success: false, message: "Enter a valid HTTP or HTTPS document URL." });
    }
    const pdfUrl = req.file ? `/uploads/content-documents/${req.file.filename}` : currentPdf;
    if (requiresPdf(moduleKey) && !pdfUrl && !externalUrl.value) {
      removeRequestUpload(req.file);
      return res.status(400).json({ success: false, message: "Choose a PDF document." });
    }

    await db.query(
      `UPDATE cms_document_items
       SET title = ?, description = ?, category = ?, academic_year = ?,
         pdf_url = ?, external_url = ?, display_order = ?, is_active = ?
       WHERE id = ? AND module_key = ?`,
      [
        title,
        String(req.body?.description || "").trim() || null,
        String(req.body?.category || "").trim() || null,
        String(req.body?.academic_year || "").trim() || null,
        pdfUrl,
        externalUrl.value,
        parseDisplayOrder(req.body?.display_order),
        req.body?.is_active === "0" ? 0 : 1,
        id,
        moduleKey,
      ]
    );
    if (req.file && currentPdf !== pdfUrl) removeUploadedFile(currentPdf);
    res.json({ success: true, message: "Document updated." });
  } catch (error) {
    removeRequestUpload(req.file);
    console.error("UPDATE CMS DOCUMENT ITEM ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to update document." });
  }
});

router.delete("/:moduleKey/:id", async (req, res) => {
  const { moduleKey } = req.params;
  const id = Number(req.params.id);
  if (!isValidModule(moduleKey) || !Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: "Invalid document." });
  }
  try {
    await ensureTable();
    const [rows] = await db.query(
      "SELECT pdf_url FROM cms_document_items WHERE id = ? AND module_key = ? LIMIT 1",
      [id, moduleKey]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Document not found." });
    }
    await db.query("DELETE FROM cms_document_items WHERE id = ? AND module_key = ?", [id, moduleKey]);
    removeUploadedFile(rows[0].pdf_url);
    res.json({ success: true, message: "Document deleted." });
  } catch (error) {
    console.error("DELETE CMS DOCUMENT ITEM ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to delete document." });
  }
});

router.use((error, req, res, next) => {
  if (error) return res.status(400).json({ success: false, message: error.message });
  next();
});

export default router;
