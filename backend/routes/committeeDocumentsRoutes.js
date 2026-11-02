import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "committees");
const antiRaggingPdf = "https://jascca.org/wp-content/uploads/2023/08/College-discipline-and-Anti-Ragging-committee-1.pdf";

const committees = [
  ["iqac", "IQAC", null],
  ["anti-ragging", "Anti-Ragging Committee", antiRaggingPdf],
  ["grievance", "Grievance Redressal Cell", null],
  ["icc", "Internal Complaints Committee (ICC)", null],
  ["sc-st", "SC/ST Cell", null],
  ["obc", "OBC Cell", null],
  ["minority", "Minority Cell", null],
  ["divyang", "Divyang Cell", null],
  ["student-welfare", "Student Welfare Committee", null],
];
const defaultCommitteeSlugs = new Set(committees.map(([slug]) => slug));

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
    const isPdf = path.extname(file.originalname).toLowerCase() === ".pdf" &&
      file.mimetype === "application/pdf";
    callback(isPdf ? null : new Error("Only PDF files are allowed."), isPdf);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

async function ensureCommitteeRecords() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS committee_documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      committee_slug VARCHAR(100) NOT NULL UNIQUE,
      committee_title VARCHAR(255) NOT NULL,
      category VARCHAR(180) NULL,
      pdf_url TEXT NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [columns] = await db.query("SHOW COLUMNS FROM committee_documents");
  const columnNames = new Set(columns.map((column) => column.Field));
  if (!columnNames.has("category")) {
    await db.query("ALTER TABLE committee_documents ADD COLUMN category VARCHAR(180) NULL");
  }
  if (!columnNames.has("display_order")) {
    await db.query("ALTER TABLE committee_documents ADD COLUMN display_order INT NOT NULL DEFAULT 0");
  }

  for (const [index, [slug, title, pdfUrl]] of committees.entries()) {
    await db.query(
      `INSERT IGNORE INTO committee_documents
        (committee_slug, committee_title, category, pdf_url, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [slug, title, slug === "iqac" ? "IQAC" : "Student and statutory committees", pdfUrl, index + 1]
    );
  }
}

function removeUploadedFile(fileUrl) {
  if (!fileUrl?.startsWith("/uploads/committees/")) return;
  const filePath = path.resolve(__dirname, "..", fileUrl.slice(1));
  const directory = path.resolve(uploadDir);
  if (filePath.startsWith(`${directory}${path.sep}`) && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const includeInactive = req.query.includeInactive === "1";
    const [rows] = await db.query(`
      SELECT id, committee_slug, committee_title, category, pdf_url,
        display_order, is_active, updated_at
      FROM committee_documents
      ${includeInactive ? "" : "WHERE is_active = 1"}
      ORDER BY display_order ASC, id ASC
    `);
    res.json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        is_default: defaultCommitteeSlugs.has(row.committee_slug),
      })),
    });
  } catch (error) {
    console.error("GET COMMITTEE DOCUMENTS ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load committee documents." });
  }
});

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const title = String(req.body?.committee_title || "").trim();
    if (!title) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Committee title is required." });
    }

    const baseSlug = String(req.body?.committee_slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    if (!baseSlug) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "A valid committee title is required." });
    }
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
    const pdfUrl = req.file ? `/uploads/committees/${req.file.filename}` : null;
    const [result] = await db.query(
      `INSERT INTO committee_documents
        (committee_slug, committee_title, category, pdf_url, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title,
        String(req.body?.category || "").trim() || null,
        pdfUrl,
        Number(req.body?.display_order) || 0,
        req.body?.is_active === "0" ? 0 : 1,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId, slug, message: "Committee added." });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("CREATE COMMITTEE ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to add committee." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const [rows] = await db.query(
      `SELECT committee_slug, committee_title, pdf_url, is_active
       FROM committee_documents WHERE committee_slug = ? AND is_active = 1 LIMIT 1`,
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Committee not found." });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("GET COMMITTEE DOCUMENT ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load committee document." });
  }
});

router.put("/:slug", upload.single("pdf"), async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const [rows] = await db.query(
      "SELECT committee_title, category, pdf_url, display_order, is_active FROM committee_documents WHERE committee_slug = ? LIMIT 1",
      [req.params.slug]
    );
    if (!rows.length) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Committee not found." });
    }

    const existing = rows[0];
    const title = String(req.body?.committee_title ?? existing.committee_title).trim();
    if (!title) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Committee title is required." });
    }
    const pdfUrl = req.file ? `/uploads/committees/${req.file.filename}` : existing.pdf_url;
    const category = req.body?.category === undefined
      ? existing.category
      : String(req.body.category).trim() || null;
    const displayOrder = req.body?.display_order === undefined
      ? existing.display_order
      : Number(req.body.display_order) || 0;
    const isActive = req.body?.is_active === undefined
      ? (req.file ? 1 : existing.is_active)
      : req.body.is_active === "0" ? 0 : 1;
    await db.query(
      `UPDATE committee_documents
       SET committee_title = ?, category = ?, pdf_url = ?, display_order = ?, is_active = ?
       WHERE committee_slug = ?`,
      [title, category, pdfUrl, displayOrder, isActive, req.params.slug]
    );
    if (req.file) removeUploadedFile(existing.pdf_url);
    res.json({ success: true, message: "Committee saved.", pdf_url: pdfUrl });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("SAVE COMMITTEE DOCUMENT ERROR:", error);
    res.status(500).json({ success: false, message: error.message || "Unable to save committee PDF." });
  }
});

router.delete("/:slug/item", async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const [rows] = await db.query(
      "SELECT pdf_url FROM committee_documents WHERE committee_slug = ? LIMIT 1",
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Committee not found." });
    }
    if (defaultCommitteeSlugs.has(req.params.slug)) {
      return res.status(400).json({ success: false, message: "Default committee entries cannot be deleted; deactivate them instead." });
    }
    await db.query("DELETE FROM committee_documents WHERE committee_slug = ?", [req.params.slug]);
    removeUploadedFile(rows[0].pdf_url);
    res.json({ success: true, message: "Committee deleted." });
  } catch (error) {
    console.error("DELETE COMMITTEE ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to delete committee." });
  }
});

router.delete("/:slug", async (req, res) => {
  try {
    await ensureCommitteeRecords();
    const [rows] = await db.query(
      "SELECT pdf_url FROM committee_documents WHERE committee_slug = ? LIMIT 1",
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Committee not found." });
    }
    await db.query(
      "UPDATE committee_documents SET pdf_url = NULL WHERE committee_slug = ?",
      [req.params.slug]
    );
    removeUploadedFile(rows[0].pdf_url);
    res.json({ success: true, message: "Committee PDF removed." });
  } catch (error) {
    console.error("REMOVE COMMITTEE DOCUMENT ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to remove committee PDF." });
  }
});

export default router;