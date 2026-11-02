import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM college_settings
      ORDER BY id ASC
      LIMIT 1
    `);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "College settings not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Settings API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch college settings",
      code: error.code || null,
      error: error.message || "",
    });
  }
});

export default router;