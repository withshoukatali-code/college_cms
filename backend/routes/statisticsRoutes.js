import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ACTIVE COLLEGE STATISTICS
|--------------------------------------------------------------------------
| GET /api/college-statistics
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        value,
        label,
        icon,
        display_order
      FROM college_statistics
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET college statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college statistics",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL STATISTICS
|--------------------------------------------------------------------------
| GET /api/college-statistics/all
|--------------------------------------------------------------------------
*/

router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        value,
        label,
        icon,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM college_statistics
      ORDER BY display_order ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET all college statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college statistics",
      error: error.message,
    });
  }
});

export default router;