import express from "express";
import pool from "../config/db.js";

const router = express.Router();


// =====================================================
// PUBLIC - GET ACTIVE ITEMS
// GET /api/bottom-institutional-strip
// =====================================================
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                field_name,
                field_value,
                display_order,
                is_active
            FROM bottom_institutional_strip
            WHERE is_active = 1
            ORDER BY display_order ASC, id ASC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("Bottom Strip GET Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    }
});


// =====================================================
// ADMIN - GET ALL ITEMS
// GET /api/bottom-institutional-strip/all
// =====================================================
router.get("/all", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                field_name,
                field_value,
                display_order,
                is_active,
                created_at,
                updated_at
            FROM bottom_institutional_strip
            ORDER BY display_order ASC, id ASC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("Bottom Strip ALL Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    }
});


// =====================================================
// ADMIN - CREATE
// POST /api/bottom-institutional-strip
// =====================================================
router.post("/", async (req, res) => {
    try {
        const {
            field_name,
            field_value,
            display_order = 0,
            is_active = 1
        } = req.body;

        if (!field_name || !field_value) {
            return res.status(400).json({
                success: false,
                message: "Field name and field value are required"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO bottom_institutional_strip
            (
                field_name,
                field_value,
                display_order,
                is_active
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                field_name,
                field_value,
                display_order,
                is_active
            ]
        );

        res.status(201).json({
            success: true,
            message: "Institutional strip item created successfully",
            id: result.insertId
        });

    } catch (error) {
        console.error("Bottom Strip POST Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// =====================================================
// ADMIN - UPDATE
// PUT /api/bottom-institutional-strip/:id
// =====================================================
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            field_name,
            field_value,
            display_order = 0,
            is_active = 1
        } = req.body;

        if (!field_name || !field_value) {
            return res.status(400).json({
                success: false,
                message: "Field name and field value are required"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE bottom_institutional_strip
            SET
                field_name = ?,
                field_value = ?,
                display_order = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                field_name,
                field_value,
                display_order,
                is_active,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Institutional strip item not found"
            });
        }

        res.json({
            success: true,
            message: "Institutional strip item updated successfully"
        });

    } catch (error) {
        console.error("Bottom Strip PUT Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// =====================================================
// ADMIN - DELETE
// DELETE /api/bottom-institutional-strip/:id
// =====================================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `
            DELETE FROM bottom_institutional_strip
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Institutional strip item not found"
            });
        }

        res.json({
            success: true,
            message: "Institutional strip item deleted successfully"
        });

    } catch (error) {
        console.error("Bottom Strip DELETE Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// =====================================================
// ADMIN - REORDER
// PUT /api/bottom-institutional-strip/reorder/:id
// =====================================================
router.put("/reorder/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { display_order } = req.body;

        const [result] = await pool.query(
            `
            UPDATE bottom_institutional_strip
            SET display_order = ?
            WHERE id = ?
            `,
            [display_order, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Institutional strip item not found"
            });
        }

        res.json({
            success: true,
            message: "Display order updated successfully"
        });

    } catch (error) {
        console.error("Bottom Strip Reorder Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export default router;