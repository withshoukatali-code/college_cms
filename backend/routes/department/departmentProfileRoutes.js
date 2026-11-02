import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/* =========================================================
   TEST
========================================================= */

router.get("/test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "Department Profile API is working",
            data: rows[0]
        });
    } catch (error) {
        console.error("DEPARTMENT PROFILE TEST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Department Profile API test failed",
            error: error.message
        });
    }
});


/* =========================================================
   GET PROFILE BY DEPARTMENT ID
   Public + Admin
========================================================= */

router.get("/department/:departmentId", async (req, res) => {
    try {
        const departmentId = Number(req.params.departmentId);

        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Department ID is required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                dp.id,
                dp.department_id,
                d.name AS department_name,
                dp.established_year,
                dp.short_description,
                dp.about_department,
                dp.vision,
                dp.mission,
                dp.department_image_url,
                dp.email,
                dp.phone,
                dp.office_location,
                dp.is_active,
                dp.created_at,
                dp.updated_at

            FROM department_profiles dp

            INNER JOIN departments d
                ON d.id = dp.department_id

            WHERE dp.department_id = ?

            LIMIT 1
            `,
            [departmentId]
        );

        if (rows.length === 0) {
            return res.json({
                success: true,
                profile: null
            });
        }

        res.json({
            success: true,
            profile: rows[0]
        });

    } catch (error) {
        console.error("GET DEPARTMENT PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch department profile",
            error: error.message
        });
    }
});


/* =========================================================
   CREATE PROFILE
========================================================= */

router.post("/", async (req, res) => {
    try {
        const {
            department_id,
            established_year,
            short_description,
            about_department,
            vision,
            mission,
            department_image_url,
            email,
            phone,
            office_location,
            is_active = 1
        } = req.body;

        const departmentId = Number(department_id);

        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Department ID is required"
            });
        }

        /* ---------------------------------------------
           Check department exists
        --------------------------------------------- */

        const [departmentRows] = await db.query(
            `
            SELECT id, name
            FROM departments
            WHERE id = ?
            LIMIT 1
            `,
            [departmentId]
        );

        if (departmentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        /* ---------------------------------------------
           Prevent duplicate profile
        --------------------------------------------- */

        const [existingRows] = await db.query(
            `
            SELECT id
            FROM department_profiles
            WHERE department_id = ?
            LIMIT 1
            `,
            [departmentId]
        );

        if (existingRows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Department profile already exists",
                profile_id: existingRows[0].id
            });
        }

        /* ---------------------------------------------
           Insert
        --------------------------------------------- */

        const [result] = await db.query(
            `
            INSERT INTO department_profiles
            (
                department_id,
                established_year,
                short_description,
                about_department,
                vision,
                mission,
                department_image_url,
                email,
                phone,
                office_location,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                departmentId,
                established_year || null,
                short_description || null,
                about_department || null,
                vision || null,
                mission || null,
                department_image_url || null,
                email || null,
                phone || null,
                office_location || null,
                is_active ? 1 : 0
            ]
        );

        res.status(201).json({
            success: true,
            message: "Department profile created successfully",
            profile_id: result.insertId
        });

    } catch (error) {
        console.error("CREATE DEPARTMENT PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create department profile",
            error: error.message
        });
    }
});


/* =========================================================
   UPDATE PROFILE
========================================================= */

router.put("/:id", async (req, res) => {
    try {
        const profileId = Number(req.params.id);

        if (!Number.isInteger(profileId) || profileId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Profile ID is required"
            });
        }

        const {
            established_year,
            short_description,
            about_department,
            vision,
            mission,
            department_image_url,
            email,
            phone,
            office_location,
            is_active = 1
        } = req.body;

        /* ---------------------------------------------
           Check profile
        --------------------------------------------- */

        const [existingRows] = await db.query(
            `
            SELECT id
            FROM department_profiles
            WHERE id = ?
            LIMIT 1
            `,
            [profileId]
        );

        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department profile not found"
            });
        }

        /* ---------------------------------------------
           Update
        --------------------------------------------- */

        await db.query(
            `
            UPDATE department_profiles

            SET
                established_year = ?,
                short_description = ?,
                about_department = ?,
                vision = ?,
                mission = ?,
                department_image_url = ?,
                email = ?,
                phone = ?,
                office_location = ?,
                is_active = ?

            WHERE id = ?
            `,
            [
                established_year || null,
                short_description || null,
                about_department || null,
                vision || null,
                mission || null,
                department_image_url || null,
                email || null,
                phone || null,
                office_location || null,
                is_active ? 1 : 0,
                profileId
            ]
        );

        res.json({
            success: true,
            message: "Department profile updated successfully"
        });

    } catch (error) {
        console.error("UPDATE DEPARTMENT PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update department profile",
            error: error.message
        });
    }
});


/* =========================================================
   DELETE PROFILE
========================================================= */

router.delete("/:id", async (req, res) => {
    try {
        const profileId = Number(req.params.id);

        if (!Number.isInteger(profileId) || profileId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Profile ID is required"
            });
        }

        const [result] = await db.query(
            `
            DELETE FROM department_profiles
            WHERE id = ?
            `,
            [profileId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department profile not found"
            });
        }

        res.json({
            success: true,
            message: "Department profile deleted successfully"
        });

    } catch (error) {
        console.error("DELETE DEPARTMENT PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete department profile",
            error: error.message
        });
    }
});


/* =========================================================
   TOGGLE ACTIVE STATUS
========================================================= */

router.patch("/:id/toggle", async (req, res) => {
    try {
        const profileId = Number(req.params.id);

        if (!Number.isInteger(profileId) || profileId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Profile ID is required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT id, is_active
            FROM department_profiles
            WHERE id = ?
            LIMIT 1
            `,
            [profileId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department profile not found"
            });
        }

        const newStatus = rows[0].is_active ? 0 : 1;

        await db.query(
            `
            UPDATE department_profiles
            SET is_active = ?
            WHERE id = ?
            `,
            [newStatus, profileId]
        );

        res.json({
            success: true,
            message: newStatus
                ? "Department profile activated"
                : "Department profile deactivated",
            is_active: newStatus
        });

    } catch (error) {
        console.error("TOGGLE DEPARTMENT PROFILE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to change department profile status",
            error: error.message
        });
    }
});


export default router;