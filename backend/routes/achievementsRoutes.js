import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL ACTIVE ACHIEVEMENTS
|--------------------------------------------------------------------------
| Public homepage
| GET /api/achievements
*/
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        achievement_type,
        display_order,
        is_active
      FROM achievements
      WHERE is_active = 1
      ORDER BY display_order ASC, id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Achievements GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL ACHIEVEMENTS
|--------------------------------------------------------------------------
| Admin
| GET /api/achievements/all
*/
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        achievement_type,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM achievements
      ORDER BY display_order ASC, id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Achievements ALL error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET SINGLE ACHIEVEMENT
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        achievement_type,
        display_order,
        is_active
      FROM achievements
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Achievement GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievement",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE ACHIEVEMENT
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      achievement_type,
      display_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO achievements
      (
        title,
        description,
        achievement_type,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        description || "",
        achievement_type || "Institutional",
        Number(display_order) || 0,
        is_active === undefined ? 1 : is_active ? 1 : 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Achievement CREATE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create achievement",
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE ACHIEVEMENT
|--------------------------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      description,
      achievement_type,
      display_order,
      is_active,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE achievements
      SET
        title = ?,
        description = ?,
        achievement_type = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        description || "",
        achievement_type || "Institutional",
        Number(display_order) || 0,
        is_active ? 1 : 0,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.json({
      success: true,
      message: "Achievement updated successfully",
    });
  } catch (error) {
    console.error("Achievement UPDATE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update achievement",
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE ACHIEVEMENT
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      `
      DELETE FROM achievements
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    res.json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Achievement DELETE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete achievement",
    });
  }
});

export default router;