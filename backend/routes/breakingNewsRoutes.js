import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
=========================================================
PUBLIC
GET /api/breaking-news

Returns active breaking news for the public homepage.
=========================================================
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        category,
        description,
        publish_date,
        link,
        display_order
      FROM news_notices
      WHERE is_breaking = 1
        AND is_active = 1
      ORDER BY
        display_order ASC,
        publish_date DESC,
        id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Public Breaking News GET Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch breaking news",
    });
  }
});


/*
=========================================================
ADMIN
GET /api/breaking-news/admin

Returns all breaking news for admin management.
=========================================================
*/

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        category,
        description,
        publish_date,
        link,
        display_order,
        is_breaking,
        is_active,
        created_at,
        updated_at
      FROM news_notices
      WHERE is_breaking = 1
      ORDER BY
        display_order ASC,
        publish_date DESC,
        id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Admin Breaking News GET Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch breaking news",
    });
  }
});


/*
=========================================================
CREATE BREAKING NEWS
POST /api/breaking-news
=========================================================
*/

router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      publish_date,
      link,
      display_order,
      is_breaking,
      is_active,
    } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "News title is required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO news_notices
      (
        title,
        category,
        description,
        publish_date,
        link,
        display_order,
        is_breaking,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        category?.trim() || "News",
        description?.trim() || null,
        publish_date || null,
        link?.trim() || null,
        Number(display_order ?? 0),
        Number(is_breaking ?? 1),
        Number(is_active ?? 1),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Breaking news created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Breaking News CREATE Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create breaking news",
    });
  }
});


/*
=========================================================
UPDATE BREAKING NEWS
PUT /api/breaking-news/:id
=========================================================
*/

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      description,
      publish_date,
      link,
      display_order,
      is_breaking,
      is_active,
    } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "News title is required",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE news_notices
      SET
        title = ?,
        category = ?,
        description = ?,
        publish_date = ?,
        link = ?,
        display_order = ?,
        is_breaking = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        category?.trim() || "News",
        description?.trim() || null,
        publish_date || null,
        link?.trim() || null,
        Number(display_order ?? 0),
        Number(is_breaking ?? 1),
        Number(is_active ?? 1),
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Breaking news not found",
      });
    }

    res.json({
      success: true,
      message: "Breaking news updated successfully",
    });
  } catch (error) {
    console.error("Breaking News UPDATE Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update breaking news",
    });
  }
});


/*
=========================================================
DELETE BREAKING NEWS
DELETE /api/breaking-news/:id
=========================================================
*/

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM news_notices
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Breaking news not found",
      });
    }

    res.json({
      success: true,
      message: "Breaking news deleted successfully",
    });
  } catch (error) {
    console.error("Breaking News DELETE Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete breaking news",
    });
  }
});


/*
=========================================================
EXPORT ROUTER
=========================================================
*/

export default router;