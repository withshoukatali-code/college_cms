import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads", "facilities");
fs.mkdirSync(uploadDir, { recursive: true });

const initialFacilities = [
  { name: "College Campus", category: "Campus", description: "Campus grounds and shared outdoor spaces for learning and student life.", features: ["Campus grounds", "Student gathering areas"] },
  { name: "Library", category: "Learning", description: "Library facilities and learning resources for students and faculty.", features: ["Reading and study space", "Print and digital resources"] },
  { name: "Computer Department", category: "Academic", description: "Department facilities supporting computer and information-technology education.", features: ["Computer-based learning", "Department support"] },
  { name: "Office Building", category: "Administration", description: "Administrative offices for student, academic, and institutional services.", features: ["Student services", "Administrative support"] },
  { name: "Sports Facilities", category: "Student Life", description: "Sports and recreation facilities supporting physical activity and student development.", features: ["Outdoor sports", "Student recreation"] },
  { name: "Canteen", category: "Student Life", description: "Campus canteen serving students, staff, and visitors.", features: ["Refreshments", "Seating area"] },
  { name: "Parking", category: "Campus", description: "Parking arrangements for the college community and visitors.", features: ["Two-wheeler parking", "Visitor parking"] },
  { name: "Ladies Room", category: "Student Support", description: "A private rest and support space for women on campus.", features: ["Private rest space", "Student support"] },
  { name: "Staff Room", category: "Staff Support", description: "Staff workspace and rest area for faculty and college employees.", features: ["Staff workspace", "Meeting and preparation area"] },
  { name: "Computer Laboratory", category: "Academic", description: "Computer lab supporting practical instruction, project work, and internet-based learning.", features: ["Computers", "Projector", "Backup power", "Internet connectivity"] },
  { name: "IQAC Infrastructure", category: "IQAC", description: "Facilities and technology supporting IQAC meetings, documentation, review, and quality-assurance activities.", features: ["Meeting and review space", "Documentation support", "Presentation equipment"] },
];

const facilityColumns = [
  ["building_area_sq_ft", "DECIMAL(10,2) NULL"],
  ["open_area_sq_ft", "DECIMAL(10,2) NULL"],
  ["computer_count", "INT NULL"],
  ["computer_configuration", "TEXT NULL"],
  ["projector_count", "INT NULL"],
  ["smart_board_count", "INT NULL"],
  ["backup_power", "TEXT NULL"],
  ["internet_details", "TEXT NULL"],
];

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const safeName = path.basename(file.originalname).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
      callback(null, `${Date.now()}-${safeName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const validImage = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    callback(validImage ? null : new Error("Upload a JPG, PNG, or WebP image."), validImage);
  },
  limits: { fileSize: 8 * 1024 * 1024 },
});

const makeSlug = (name) => String(name || "facility").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function ensureFacilities() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      slug VARCHAR(200) NOT NULL UNIQUE,
      category VARCHAR(100) NOT NULL DEFAULT 'General',
      description TEXT,
      features_json LONGTEXT NOT NULL,
      image_url TEXT,
      building_area_sq_ft DECIMAL(10,2) NULL,
      open_area_sq_ft DECIMAL(10,2) NULL,
      computer_count INT NULL,
      computer_configuration TEXT NULL,
      projector_count INT NULL,
      smart_board_count INT NULL,
      backup_power TEXT NULL,
      internet_details TEXT NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  const [columns] = await db.query("SHOW COLUMNS FROM facilities");
  const existingColumns = new Set(columns.map((column) => column.Field));
  for (const [name, definition] of facilityColumns) {
    if (!existingColumns.has(name)) await db.query(`ALTER TABLE facilities ADD COLUMN ${name} ${definition}`);
  }
  for (const [index, facility] of initialFacilities.entries()) {
    const slug = makeSlug(facility.name);
    await db.query(
      `INSERT IGNORE INTO facilities (name, slug, category, description, features_json, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [facility.name, slug, facility.category, facility.description, JSON.stringify(facility.features), index + 1]
    );
  }
}

function formatFacility(row) {
  return { ...row, features: JSON.parse(row.features_json || "[]") };
}

function removeFacilityImage(imageUrl) {
  if (!imageUrl?.startsWith("/uploads/facilities/")) return;
  const filePath = path.resolve(__dirname, "..", imageUrl.slice(1));
  const directory = path.resolve(uploadDir);
  if (filePath.startsWith(`${directory}${path.sep}`) && fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

router.get("/", async (req, res) => {
  try {
    await ensureFacilities();
    const includeInactive = req.query.includeInactive === "1";
    const [rows] = await db.query(`
      SELECT id, name, slug, category, description, features_json, image_url,
        building_area_sq_ft, open_area_sq_ft, computer_count, computer_configuration,
        projector_count, smart_board_count, backup_power, internet_details,
        display_order, is_active
      FROM facilities ${includeInactive ? "" : "WHERE is_active = 1"}
      ORDER BY display_order ASC, id ASC
    `);
    res.json({ success: true, data: rows.map(formatFacility) });
  } catch (error) {
    console.error("GET FACILITIES ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load facilities." });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    await ensureFacilities();
    const { name, category, description, features, building_area_sq_ft, open_area_sq_ft, computer_count, computer_configuration, projector_count, smart_board_count, backup_power, internet_details, display_order, is_active } = req.body;
    if (!String(name || "").trim()) return res.status(400).json({ success: false, message: "Facility name is required." });
    let parsedFeatures = [];
    try { parsedFeatures = JSON.parse(features || "[]"); } catch { parsedFeatures = []; }
    const imageUrl = req.file ? `/uploads/facilities/${req.file.filename}` : null;
    const [result] = await db.query(
      `INSERT INTO facilities (name, slug, category, description, features_json, image_url,
        building_area_sq_ft, open_area_sq_ft, computer_count, computer_configuration,
        projector_count, smart_board_count, backup_power, internet_details, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [String(name).trim(), `${makeSlug(name)}-${Date.now().toString().slice(-5)}`, String(category || "General").trim(), String(description || "").trim(), JSON.stringify(Array.isArray(parsedFeatures) ? parsedFeatures : []), imageUrl, building_area_sq_ft || null, open_area_sq_ft || null, computer_count === "" ? null : computer_count, computer_configuration || null, projector_count === "" ? null : projector_count, smart_board_count === "" ? null : smart_board_count, backup_power || null, internet_details || null, Number(display_order) || 0, Number(is_active) === 0 ? 0 : 1]
    );
    res.status(201).json({ success: true, message: "Facility created.", id: result.insertId });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("CREATE FACILITY ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to create facility." });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    await ensureFacilities();
    const [rows] = await db.query("SELECT * FROM facilities WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Facility not found." });
    const existing = rows[0];
    const { name, category, description, features, building_area_sq_ft, open_area_sq_ft, computer_count, computer_configuration, projector_count, smart_board_count, backup_power, internet_details, display_order, is_active } = req.body;
    let parsedFeatures = existing.features_json;
    if (features !== undefined) {
      try { parsedFeatures = JSON.stringify(JSON.parse(features)); } catch { parsedFeatures = existing.features_json; }
    }
    const imageUrl = req.file ? `/uploads/facilities/${req.file.filename}` : existing.image_url;
    await db.query(
      `UPDATE facilities SET name = ?, category = ?, description = ?, features_json = ?, image_url = ?,
        building_area_sq_ft = ?, open_area_sq_ft = ?, computer_count = ?, computer_configuration = ?,
        projector_count = ?, smart_board_count = ?, backup_power = ?, internet_details = ?,
        display_order = ?, is_active = ? WHERE id = ?`,
      [String(name || existing.name).trim(), String(category ?? existing.category).trim(), String(description ?? existing.description ?? "").trim(), parsedFeatures, imageUrl, building_area_sq_ft || null, open_area_sq_ft || null, computer_count === "" ? null : computer_count ?? null, computer_configuration || null, projector_count === "" ? null : projector_count ?? null, smart_board_count === "" ? null : smart_board_count ?? null, backup_power || null, internet_details || null, Number(display_order ?? existing.display_order) || 0, Number(is_active) === 0 ? 0 : 1, req.params.id]
    );
    if (req.file) removeFacilityImage(existing.image_url);
    res.json({ success: true, message: "Facility updated." });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("UPDATE FACILITY ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to update facility." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ensureFacilities();
    const [rows] = await db.query("SELECT image_url FROM facilities WHERE id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Facility not found." });
    await db.query("DELETE FROM facilities WHERE id = ?", [req.params.id]);
    removeFacilityImage(rows[0].image_url);
    res.json({ success: true, message: "Facility deleted." });
  } catch (error) {
    console.error("DELETE FACILITY ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to delete facility." });
  }
});

router.use((error, req, res, next) => {
  if (error) return res.status(400).json({ success: false, message: error.message });
  next();
});

export default router;