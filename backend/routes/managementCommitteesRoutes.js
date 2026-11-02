import express from "express";
import db from "../config/db.js";

const router = express.Router();
const committeeKeys = new Set(["governing-management", "local-management"]);

async function ensureManagementCommitteeTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS management_committee_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      committee_key VARCHAR(80) NOT NULL,
      member_name VARCHAR(255) NOT NULL,
      designation VARCHAR(255) NOT NULL,
      representation VARCHAR(255) NULL,
      display_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_management_committee_members (committee_key, is_active, display_order)
    )
  `);
}

function validCommitteeKey(value) {
  return committeeKeys.has(String(value || ""));
}

router.get("/", async (req, res) => {
  try {
    await ensureManagementCommitteeTable();
    const committeeKey = String(req.query.committee_key || "");
    if (committeeKey && !validCommitteeKey(committeeKey)) {
      return res.status(400).json({ success: false, message: "Unknown management committee." });
    }

    const includeInactive = req.query.includeInactive === "1";
    const conditions = [];
    const values = [];
    if (committeeKey) {
      conditions.push("committee_key = ?");
      values.push(committeeKey);
    }
    if (!includeInactive) conditions.push("is_active = 1");
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const [rows] = await db.query(
      `SELECT id, committee_key, member_name, designation, representation,
        display_order, is_active, updated_at
       FROM management_committee_members ${where}
       ORDER BY display_order ASC, id ASC`,
      values
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET MANAGEMENT COMMITTEE MEMBERS ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load committee members." });
  }
});

router.post("/", async (req, res) => {
  try {
    await ensureManagementCommitteeTable();
    const committeeKey = String(req.body?.committee_key || "");
    const memberName = String(req.body?.member_name || "").trim();
    const designation = String(req.body?.designation || "").trim();
    if (!validCommitteeKey(committeeKey)) {
      return res.status(400).json({ success: false, message: "Choose a valid committee." });
    }
    if (!memberName || !designation) {
      return res.status(400).json({ success: false, message: "Member name and designation are required." });
    }

    const [result] = await db.query(
      `INSERT INTO management_committee_members
        (committee_key, member_name, designation, representation, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        committeeKey,
        memberName,
        designation,
        String(req.body?.representation || "").trim() || null,
        Number(req.body?.display_order) || 0,
        Number(req.body?.is_active) === 0 ? 0 : 1,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId, message: "Committee member added." });
  } catch (error) {
    console.error("CREATE MANAGEMENT COMMITTEE MEMBER ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to add committee member." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await ensureManagementCommitteeTable();
    const memberId = Number(req.params.id);
    if (!Number.isInteger(memberId) || memberId < 1) {
      return res.status(400).json({ success: false, message: "Invalid committee member." });
    }
    const memberName = String(req.body?.member_name || "").trim();
    const designation = String(req.body?.designation || "").trim();
    if (!memberName || !designation) {
      return res.status(400).json({ success: false, message: "Member name and designation are required." });
    }

    const [result] = await db.query(
      `UPDATE management_committee_members
       SET member_name = ?, designation = ?, representation = ?, display_order = ?, is_active = ?
       WHERE id = ?`,
      [
        memberName,
        designation,
        String(req.body?.representation || "").trim() || null,
        Number(req.body?.display_order) || 0,
        Number(req.body?.is_active) === 0 ? 0 : 1,
        memberId,
      ]
    );
    if (!result.affectedRows) {
      const [rows] = await db.query("SELECT id FROM management_committee_members WHERE id = ? LIMIT 1", [memberId]);
      if (!rows.length) return res.status(404).json({ success: false, message: "Committee member not found." });
    }
    res.json({ success: true, message: "Committee member updated." });
  } catch (error) {
    console.error("UPDATE MANAGEMENT COMMITTEE MEMBER ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to update committee member." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ensureManagementCommitteeTable();
    const memberId = Number(req.params.id);
    if (!Number.isInteger(memberId) || memberId < 1) {
      return res.status(400).json({ success: false, message: "Invalid committee member." });
    }
    const [result] = await db.query("DELETE FROM management_committee_members WHERE id = ?", [memberId]);
    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Committee member not found." });
    }
    res.json({ success: true, message: "Committee member deleted." });
  } catch (error) {
    console.error("DELETE MANAGEMENT COMMITTEE MEMBER ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to delete committee member." });
  }
});

export default router;