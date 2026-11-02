import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "site-pages");
fs.mkdirSync(uploadDir, { recursive: true });

const photoUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const validType = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    callback(validType ? null : new Error("Use a JPG, PNG, or WebP image."), validType);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const profilePdfUpload = multer({
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
    const validPdf = path.extname(file.originalname).toLowerCase() === ".pdf" &&
      file.mimetype === "application/pdf";
    callback(validPdf ? null : new Error("Choose a PDF profile document."), validPdf);
  },
  limits: { fileSize: 20 * 1024 * 1024 },
});

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_pages (
      page_key VARCHAR(120) PRIMARY KEY,
      content_json LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

const parsePage = (row) => ({
  page_key: row.page_key,
  content: typeof row.content_json === "string"
    ? JSON.parse(row.content_json)
    : row.content_json,
  updated_at: row.updated_at,
});

function removeLocalPhoto(photoUrl) {
  if (!photoUrl?.startsWith("/uploads/site-pages/")) return;
  const fullPath = path.resolve(__dirname, "..", photoUrl.slice(1));
  const directory = path.resolve(uploadDir);
  if (fullPath.startsWith(`${directory}${path.sep}`) && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

async function saveResourceAsset(req, res, assetField, filePrefix) {
  const resourceIndex = Number(req.params.index);
  if (!Number.isInteger(resourceIndex) || resourceIndex < 0) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: "Invalid resource item." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a file to upload." });
  }

  try {
    await ensureTable();
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Page content not found." });
    }

    const content = JSON.parse(rows[0].content_json);
    if (!Array.isArray(content.resources) || !content.resources[resourceIndex]) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Resource item not found." });
    }

    const resource = content.resources[resourceIndex];
    const previousFile = resource[assetField];
    resource[assetField] = `${filePrefix}${req.file.filename}`;
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), req.params.pageKey]
    );
    removeLocalPhoto(previousFile);
    res.json({ success: true, data: resource });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD SITE PAGE RESOURCE ASSET ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload page resource." });
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await db.query("SELECT page_key, content_json, updated_at FROM site_pages ORDER BY page_key");
    res.json({ success: true, data: rows.map(parsePage) });
  } catch (error) {
    console.error("GET SITE PAGES ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load page content." });
  }
});

router.get("/:pageKey", async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await db.query(
      "SELECT page_key, content_json, updated_at FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Page content not initialized." });
    res.json({ success: true, data: parsePage(rows[0]) });
  } catch (error) {
    console.error("GET SITE PAGE ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load page content." });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await ensureTable();
    const pages = Array.isArray(req.body?.pages) ? req.body.pages : [];
    for (const page of pages) {
      if (!/^[a-z0-9-]+$/.test(page.page_key || "") || !page.content || typeof page.content !== "object") continue;
      await db.query(
        "INSERT IGNORE INTO site_pages (page_key, content_json) VALUES (?, ?)",
        [page.page_key, JSON.stringify(page.content)]
      );
    }
    res.json({ success: true, seeded: pages.length });
  } catch (error) {
    console.error("SEED SITE PAGES ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to initialize page content." });
  }
});

router.put("/:pageKey", async (req, res) => {
  try {
    await ensureTable();
    if (!/^[a-z0-9-]+$/.test(req.params.pageKey) || !req.body?.content || typeof req.body.content !== "object") {
      return res.status(400).json({ success: false, message: "Valid page content is required." });
    }
    await db.query(
      `INSERT INTO site_pages (page_key, content_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)`,
      [req.params.pageKey, JSON.stringify(req.body.content)]
    );
    res.json({ success: true, message: "Page content saved." });
  } catch (error) {
    console.error("SAVE SITE PAGE ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to save page content." });
  }
});

router.post("/:pageKey/photo", photoUpload.single("photo"), async (req, res) => {
  try {
    await ensureTable();
    if (!req.file) return res.status(400).json({ success: false, message: "Choose a profile photo." });
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Page content not found." });
    }
    const content = JSON.parse(rows[0].content_json);
    const oldPhoto = content.profile?.photo;
    content.profile = { ...(content.profile || {}), photo: `/uploads/site-pages/${req.file.filename}` };
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), req.params.pageKey]
    );
    removeLocalPhoto(oldPhoto);
    res.json({ success: true, photo: content.profile.photo });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD SITE PAGE PHOTO ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload profile photo." });
  }
});

router.post("/:pageKey/hero-image", photoUpload.single("photo"), async (req, res) => {
  try {
    await ensureTable();
    if (!req.file) return res.status(400).json({ success: false, message: "Choose a hero image." });
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Page content not found." });
    }
    const content = JSON.parse(rows[0].content_json);
    const oldHeroImage = content.heroImage;
    content.heroImage = `/uploads/site-pages/${req.file.filename}`;
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), req.params.pageKey]
    );
    removeLocalPhoto(oldHeroImage);
    res.json({ success: true, heroImage: content.heroImage });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD SITE PAGE HERO IMAGE ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload hero image." });
  }
});

router.post("/:pageKey/profile-pdf", profilePdfUpload.single("document"), async (req, res) => {
  try {
    await ensureTable();
    if (!req.file) return res.status(400).json({ success: false, message: "Choose a PDF profile document." });
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Page content not found." });
    }
    const content = JSON.parse(rows[0].content_json);
    const oldPdf = content.profile?.pdf;
    content.profile = { ...(content.profile || {}), pdf: `/uploads/site-pages/${req.file.filename}` };
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), req.params.pageKey]
    );
    removeLocalPhoto(oldPdf);
    res.json({ success: true, pdf: content.profile.pdf });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD SITE PAGE PROFILE PDF ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload profile PDF." });
  }
});

router.post("/:pageKey/document", profilePdfUpload.single("document"), async (req, res) => {
  try {
    await ensureTable();
    if (!req.file) return res.status(400).json({ success: false, message: "Choose a PDF document." });
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      [req.params.pageKey]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Page content not found." });
    }
    const content = JSON.parse(rows[0].content_json);
    const oldDocument = content.pdfUrl;
    content.pdfUrl = `/uploads/site-pages/${req.file.filename}`;
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), req.params.pageKey]
    );
    removeLocalPhoto(oldDocument);
    res.json({ success: true, pdfUrl: content.pdfUrl });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD SITE PAGE PDF ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload PDF document." });
  }
});

router.post("/:pageKey/resources/:index/photo", photoUpload.single("photo"), async (req, res) => {
  await saveResourceAsset(req, res, "imageUrl", "/uploads/site-pages/");
});

router.post("/:pageKey/resources/:index/document", profilePdfUpload.single("document"), async (req, res) => {
  await saveResourceAsset(req, res, "pdfUrl", "/uploads/site-pages/");
});

router.post("/library/services/:index/document", profilePdfUpload.single("document"), async (req, res) => {
  const serviceIndex = Number(req.params.index);
  if (!Number.isInteger(serviceIndex) || serviceIndex < 0) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: "Invalid library service." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a PDF document." });
  }

  try {
    await ensureTable();
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      ["library"]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Library content not found." });
    }

    const content = JSON.parse(rows[0].content_json);
    if (!Array.isArray(content.services) || !content.services[serviceIndex]) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Library service not found." });
    }

    const service = content.services[serviceIndex];
    const previousDocument = service.documentUrl;
    service.documentUrl = `/uploads/site-pages/${req.file.filename}`;
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), "library"]
    );
    removeLocalPhoto(previousDocument);
    res.json({ success: true, documentUrl: service.documentUrl });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD LIBRARY SERVICE PDF ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload library service PDF." });
  }
});

router.post("/library/sections/:sectionIndex/items/:itemIndex/document", profilePdfUpload.single("document"), async (req, res) => {
  const sectionIndex = Number(req.params.sectionIndex);
  const itemIndex = Number(req.params.itemIndex);
  if (!Number.isInteger(sectionIndex) || sectionIndex < 0 || !Number.isInteger(itemIndex) || itemIndex < 0) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: "Invalid library page content item." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose a PDF document." });
  }

  try {
    await ensureTable();
    const [rows] = await db.query(
      "SELECT content_json FROM site_pages WHERE page_key = ? LIMIT 1",
      ["library"]
    );
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Library content not found." });
    }

    const content = JSON.parse(rows[0].content_json);
    const item = content.sections?.[sectionIndex]?.items?.[itemIndex];
    if (!item) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: "Library content item not found." });
    }

    const previousDocument = item.documentUrl;
    item.documentUrl = `/uploads/site-pages/${req.file.filename}`;
    await db.query(
      "UPDATE site_pages SET content_json = ? WHERE page_key = ?",
      [JSON.stringify(content), "library"]
    );
    removeLocalPhoto(previousDocument);
    res.json({ success: true, documentUrl: item.documentUrl });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPLOAD LIBRARY PAGE ITEM PDF ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to upload Library page PDF." });
  }
});

router.use((error, req, res, next) => {
  if (error) return res.status(400).json({ success: false, message: error.message });
  next();
});

export default router;