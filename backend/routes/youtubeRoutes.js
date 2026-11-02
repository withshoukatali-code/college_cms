import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// ============================================================
// GET ALL YOUTUBE VIDEOS
// GET /api/home-youtube/all
// ============================================================

router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_youtube
      ORDER BY display_order ASC, id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET /api/home-youtube/all ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube videos.",
      error: error.message,
    });
  }
});

// ============================================================
// GET ACTIVE YOUTUBE VIDEOS
// GET /api/home-youtube
// ============================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        display_order,
        is_active
      FROM home_youtube
      WHERE is_active = 1
      ORDER BY display_order ASC, id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET /api/home-youtube ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube videos.",
      error: error.message,
    });
  }
});

// ============================================================
// ADD YOUTUBE VIDEO
// POST /api/home-youtube
// ============================================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      video_url,
      thumbnail_url,
      display_order = 0,
      is_active = 1,
    } = req.body;

    if (!title || !video_url) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required.",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO home_youtube
      (
        title,
        description,
        video_url,
        thumbnail_url,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description || null,
        video_url,
        thumbnail_url || null,
        display_order,
        is_active,
      ]
    );

    res.status(201).json({
      success: true,
      message: "YouTube video added successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("POST /api/home-youtube ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add YouTube video.",
      error: error.message,
    });
  }
});

// ============================================================
// UPDATE YOUTUBE VIDEO
// PUT /api/home-youtube/:id
// ============================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      video_url,
      thumbnail_url,
      display_order = 0,
      is_active = 1,
    } = req.body;

    if (!title || !video_url) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required.",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE home_youtube
      SET
        title = ?,
        description = ?,
        video_url = ?,
        thumbnail_url = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title,
        description || null,
        video_url,
        thumbnail_url || null,
        display_order,
        is_active,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "YouTube video not found.",
      });
    }

    res.json({
      success: true,
      message: "YouTube video updated successfully.",
    });
  } catch (error) {
    console.error("PUT /api/home-youtube/:id ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update YouTube video.",
      error: error.message,
    });
  }
});

// ============================================================
// DELETE YOUTUBE VIDEO
// DELETE /api/home-youtube/:id
// ============================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM home_youtube
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "YouTube video not found.",
      });
    }

    res.json({
      success: true,
      message: "YouTube video deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/home-youtube/:id ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete YouTube video.",
      error: error.message,
    });
  }
});

export default router;