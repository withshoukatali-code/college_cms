import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
=========================================================
PUBLIC
GET /api/quick-links

Only active quick links
=========================================================
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        path,
        icon,
        sort_order,
        is_active
      FROM quick_links
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Quick Links Public API Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quick links",
      error: error.message,
    });
  }
});


/*
=========================================================
ADMIN
GET /api/quick-links/admin

Return ALL quick links including inactive
=========================================================
*/

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        path,
        icon,
        sort_order,
        is_active
      FROM quick_links
      ORDER BY sort_order ASC, id ASC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Quick Links Admin GET Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quick links",
      error: error.message,
    });
  }
});


/*
=========================================================
CREATE
POST /api/quick-links
=========================================================
*/

router.post("/", async (req, res) => {
  try {
    const {
      title,
      path,
      icon,
      sort_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!path || !path.trim()) {
      return res.status(400).json({
        success: false,
        message: "Path is required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO quick_links
      (
        title,
        path,
        icon,
        sort_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        path.trim(),
        icon?.trim() || "BookOpen",
        Number(sort_order) || 0,
        Number(is_active) ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        path,
        icon,
        sort_order,
        is_active
      FROM quick_links
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Quick link created successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Quick Links Create Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create quick link",
      error: error.message,
    });
  }
});


/*
=========================================================
UPDATE
PUT /api/quick-links/:id
=========================================================
*/

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      path,
      icon,
      sort_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!path || !path.trim()) {
      return res.status(400).json({
        success: false,
        message: "Path is required",
      });
    }

    const [existing] = await pool.query(
      `
      SELECT id
      FROM quick_links
      WHERE id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quick link not found",
      });
    }

    await pool.query(
      `
      UPDATE quick_links
      SET
        title = ?,
        path = ?,
        icon = ?,
        sort_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        path.trim(),
        icon?.trim() || "BookOpen",
        Number(sort_order) || 0,
        Number(is_active) ? 1 : 0,
        id,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        path,
        icon,
        sort_order,
        is_active
      FROM quick_links
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Quick link updated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Quick Links Update Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quick link",
      error: error.message,
    });
  }
});


/*
=========================================================
DELETE
DELETE /api/quick-links/:id
=========================================================
*/

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      `
      SELECT id
      FROM quick_links
      WHERE id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quick link not found",
      });
    }

    await pool.query(
      `
      DELETE FROM quick_links
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Quick link deleted successfully",
    });
  } catch (error) {
    console.error("Quick Links Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quick link",
      error: error.message,
    });
  }
});


export default router;