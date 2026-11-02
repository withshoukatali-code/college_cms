import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* =========================================================
   GET ALL STATISTICS
   GET /api/home-statistics
========================================================= */

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        label,
        value,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_statistics
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET home statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college statistics",
      error: error.message,
    });
  }
});


/* =========================================================
   GET ACTIVE STATISTICS
   GET /api/home-statistics/active
========================================================= */

router.get("/active", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        label,
        value,
        description,
        display_order,
        is_active
      FROM home_statistics
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET active statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active statistics",
      error: error.message,
    });
  }
});


/* =========================================================
   GET SINGLE STATISTIC
   GET /api/home-statistics/:id
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        id,
        label,
        value,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_statistics
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found.",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET single statistic error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch statistic.",
      error: error.message,
    });
  }
});


/* =========================================================
   CREATE STATISTIC
   POST /api/home-statistics
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      label,
      value,
      description = "",
      display_order = 0,
      is_active = 1,
    } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({
        success: false,
        message: "Statistic label is required.",
      });
    }

    if (!value || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Statistic value is required.",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO home_statistics
      (
        label,
        value,
        description,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        label.trim(),
        value.trim(),
        description?.trim() || "",
        Number(display_order) || 0,
        Number(is_active) === 1 ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        label,
        value,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_statistics
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Statistic added successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("POST home statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add statistic.",
      error: error.message,
    });
  }
});


/* =========================================================
   UPDATE STATISTIC
   PUT /api/home-statistics/:id
========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      label,
      value,
      description = "",
      display_order = 0,
      is_active = 1,
    } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({
        success: false,
        message: "Statistic label is required.",
      });
    }

    if (!value || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Statistic value is required.",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE home_statistics
      SET
        label = ?,
        value = ?,
        description = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        label.trim(),
        value.trim(),
        description?.trim() || "",
        Number(display_order) || 0,
        Number(is_active) === 1 ? 1 : 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found.",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        id,
        label,
        value,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM home_statistics
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Statistic updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    console.error("PUT home statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update statistic.",
      error: error.message,
    });
  }
});


/* =========================================================
   DELETE STATISTIC
   DELETE /api/home-statistics/:id
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM home_statistics
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Statistic not found.",
      });
    }

    res.json({
      success: true,
      message: "Statistic deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE home statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete statistic.",
      error: error.message,
    });
  }
});


export default router;