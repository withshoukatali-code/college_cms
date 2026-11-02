import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET ALL ACTIVE SCREEN READERS - PUBLIC
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        website_url,
        access_type,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM screen_readers
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET SCREEN READERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch screen readers",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL SCREEN READERS - ADMIN
|--------------------------------------------------------------------------
*/
router.get("/admin/all", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        website_url,
        access_type,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM screen_readers
      ORDER BY display_order ASC, id ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET ADMIN SCREEN READERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch screen readers",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET SINGLE SCREEN READER
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        website_url,
        access_type,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM screen_readers
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Screen reader not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET SCREEN READER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch screen reader",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE SCREEN READER
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      website_url,
      access_type,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Screen reader name is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO screen_readers
      (
        name,
        website_url,
        access_type,
        description,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        website_url?.trim() || null,
        access_type || "Free",
        description?.trim() || null,
        Number(display_order) || 1,
        Number(is_active) === 0 ? 0 : 1,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Screen reader added successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE SCREEN READER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create screen reader",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE SCREEN READER
|--------------------------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      website_url,
      access_type,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Screen reader name is required",
      });
    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM screen_readers
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Screen reader not found",
      });
    }

    await db.query(
      `
      UPDATE screen_readers
      SET
        name = ?,
        website_url = ?,
        access_type = ?,
        description = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        name.trim(),
        website_url?.trim() || null,
        access_type || "Free",
        description?.trim() || null,
        Number(display_order) || 1,
        Number(is_active) === 0 ? 0 : 1,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Screen reader updated successfully",
    });
  } catch (error) {
    console.error("UPDATE SCREEN READER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update screen reader",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE SCREEN READER
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM screen_readers
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Screen reader not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Screen reader deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SCREEN READER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete screen reader",
      error: error.message,
    });
  }
});

export default router;