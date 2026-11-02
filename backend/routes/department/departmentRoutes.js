import express from "express";
import db from "../../config/db.js";

const router = express.Router();

const ensureDepartmentSections = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS department_sections (
            id INT AUTO_INCREMENT PRIMARY KEY,
            department_id INT NOT NULL,
            section_key VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content LONGTEXT,
            display_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_department_sections_department_order (department_id, display_order)
        )
    `);

    const [columns] = await db.query("SHOW COLUMNS FROM department_sections");
    const columnNames = new Set(columns.map((column) => column.Field));
    if (!columnNames.has("section_key")) {
        await db.query("ALTER TABLE department_sections ADD COLUMN section_key VARCHAR(100) NULL");
    }
    if (!columnNames.has("title")) {
        await db.query("ALTER TABLE department_sections ADD COLUMN title VARCHAR(255) NULL");
    }
    if (!columnNames.has("content")) {
        await db.query("ALTER TABLE department_sections ADD COLUMN content LONGTEXT NULL");
    }
    if (columnNames.has("section_title")) {
        await db.query("UPDATE department_sections SET title = section_title WHERE title IS NULL OR title = ''");
    }
    if (columnNames.has("section_content")) {
        await db.query("UPDATE department_sections SET content = section_content WHERE content IS NULL OR content = ''");
    }
    await db.query("UPDATE department_sections SET section_key = CONCAT('section-', id) WHERE section_key IS NULL OR section_key = ''");
};

/* =========================================================
   TEST
========================================================= */
router.get("/test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "Department API is working",
            database: rows,
        });
    } catch (error) {
        console.error("DEPARTMENT TEST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Database connection/query failed",
            error: error.message,
        });
    }
});


/* =========================================================
   GET ALL DEPARTMENTS
   GET /api/departments
========================================================= */
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                name,
                slug,
                short_name,
                department_image,
                tagline,
                description,
                established_year,
                programme,
                affiliation,
                hod_name,
                hod_designation,
                hod_qualification,
                hod_image,
                hod_profile,
                display_order,
                is_active,
                                (
                                        SELECT GROUP_CONCAT(DISTINCT dp.programme_level)
                                        FROM department_programmes dp
                                        WHERE dp.department_id = departments.id
                                            AND dp.is_active = 1
                                ) AS programme_levels,
                created_at,
                updated_at
            FROM departments
            ORDER BY display_order ASC, id ASC
        `);

        res.json({
            success: true,
            departments: rows,
        });

    } catch (error) {
        console.error("GET DEPARTMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load departments",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});


/* =========================================================
   GET SINGLE DEPARTMENT BY ID
   GET /api/departments/id/:id
========================================================= */
router.get("/id/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID",
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                slug,
                short_name,
                department_image,
                tagline,
                description,
                established_year,
                programme,
                affiliation,
                hod_name,
                hod_designation,
                hod_qualification,
                hod_image,
                hod_profile,
                display_order,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        // Load flexible sections for admin, including unpublished entries.
        let sections = [];

        try {
            await ensureDepartmentSections();
            const [sectionRows] = await db.query(
                `
                SELECT
                    id,
                    department_id,
                    section_key,
                    title,
                    content,
                    display_order,
                    is_active,
                    created_at,
                    updated_at
                FROM department_sections
                                WHERE department_id = ?
                ORDER BY display_order ASC, id ASC
                `,
                [id]
            );

            sections = sectionRows;
        } catch (sectionError) {
            // If department_sections does not exist yet,
            // department itself can still be loaded.
            console.warn(
                "DEPARTMENT SECTIONS LOAD WARNING:",
                sectionError.message
            );
        }

        res.json({
            success: true,
            department: rows[0],
            sections,
        });

    } catch (error) {
        console.error("GET DEPARTMENT BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load department",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});

router.get("/:id/sections", async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid department ID" });
        }
        await ensureDepartmentSections();
        const [rows] = await db.query(
            "SELECT id, department_id, section_key, title, content, display_order, is_active FROM department_sections WHERE department_id = ? ORDER BY display_order, id",
            [departmentId]
        );
        res.json({ success: true, sections: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to load department sections", error: error.message });
    }
});

router.post("/:id/sections", async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        const { section_key, title, content = "", display_order = 0, is_active = 1 } = req.body;
        if (!Number.isInteger(departmentId) || departmentId <= 0 || !section_key?.trim() || !title?.trim()) {
            return res.status(400).json({ success: false, message: "Department, section key, and title are required" });
        }
        await ensureDepartmentSections();
        const [department] = await db.query("SELECT id FROM departments WHERE id = ?", [departmentId]);
        if (!department.length) return res.status(404).json({ success: false, message: "Department not found" });
        const [result] = await db.query(
            "INSERT INTO department_sections (department_id, section_key, title, content, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)",
            [departmentId, section_key.trim().toLowerCase(), title.trim(), content, Number(display_order) || 0, Number(is_active) === 1 ? 1 : 0]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to create department section", error: error.message });
    }
});

router.put("/:id/sections/:sectionId", async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        const sectionId = Number(req.params.sectionId);
        const { section_key, title, content = "", display_order = 0, is_active = 1 } = req.body;
        if (!Number.isInteger(departmentId) || departmentId <= 0 || !Number.isInteger(sectionId) || sectionId <= 0 || !section_key?.trim() || !title?.trim()) {
            return res.status(400).json({ success: false, message: "Department, section key, and title are required" });
        }
        await ensureDepartmentSections();
        const [result] = await db.query(
            "UPDATE department_sections SET section_key = ?, title = ?, content = ?, display_order = ?, is_active = ? WHERE id = ? AND department_id = ?",
            [section_key.trim().toLowerCase(), title.trim(), content, Number(display_order) || 0, Number(is_active) === 1 ? 1 : 0, sectionId, departmentId]
        );
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Department section not found" });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to update department section", error: error.message });
    }
});

router.delete("/:id/sections/:sectionId", async (req, res) => {
    try {
        const departmentId = Number(req.params.id);
        const sectionId = Number(req.params.sectionId);
        if (!Number.isInteger(departmentId) || departmentId <= 0 || !Number.isInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({ success: false, message: "Invalid department section ID" });
        }
        await ensureDepartmentSections();
        const [result] = await db.query("DELETE FROM department_sections WHERE id = ? AND department_id = ?", [sectionId, departmentId]);
        if (!result.affectedRows) return res.status(404).json({ success: false, message: "Department section not found" });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to delete department section", error: error.message });
    }
});


/* =========================================================
   GET SINGLE DEPARTMENT BY SLUG
   GET /api/departments/:slug
========================================================= */
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                slug,
                short_name,
                department_image,
                tagline,
                description,
                established_year,
                programme,
                affiliation,
                hod_name,
                hod_designation,
                hod_qualification,
                hod_image,
                hod_profile,
                display_order,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE slug = ?
              AND is_active = 1
            LIMIT 1
            `,
            [slug]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        let sections = [];

        try {
            await ensureDepartmentSections();
            const [sectionRows] = await db.query(
                `
                SELECT
                    id,
                    department_id,
                    section_key,
                    title,
                    content,
                    display_order,
                    is_active,
                    created_at,
                    updated_at
                FROM department_sections
                WHERE department_id = ?
                  AND is_active = 1
                ORDER BY display_order ASC, id ASC
                `,
                [rows[0].id]
            );

            sections = sectionRows;
        } catch (sectionError) {
            console.warn(
                "DEPARTMENT SECTIONS LOAD WARNING:",
                sectionError.message
            );
        }

        res.json({
            success: true,
            department: rows[0],
            sections,
        });

    } catch (error) {
        console.error("GET DEPARTMENT BY SLUG ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load department",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});


/* =========================================================
   CREATE DEPARTMENT
   POST /api/departments
========================================================= */
router.post("/", async (req, res) => {
    try {
        const {
            name,
            slug,
            short_name,
            department_image,
            tagline,
            description,
            established_year,
            programme,
            affiliation,
            hod_name,
            hod_designation,
            hod_qualification,
            hod_image,
            hod_profile,
            display_order = 0,
            is_active = 1,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        const finalSlug =
            slug && slug.trim()
                ? slug.trim().toLowerCase()
                : name
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");

        const [existing] = await db.query(
            `SELECT id FROM departments WHERE slug = ? LIMIT 1`,
            [finalSlug]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A department with this slug already exists",
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO departments (
                name,
                slug,
                short_name,
                department_image,
                tagline,
                description,
                established_year,
                programme,
                affiliation,
                hod_name,
                hod_designation,
                hod_qualification,
                hod_image,
                hod_profile,
                display_order,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                finalSlug,
                short_name || null,
                department_image || null,
                tagline || null,
                description || null,
                established_year || null,
                programme || null,
                affiliation || null,
                hod_name || null,
                hod_designation || null,
                hod_qualification || null,
                hod_image || null,
                hod_profile || null,
                Number(display_order) || 0,
                is_active ? 1 : 0,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            id: result.insertId,
        });

    } catch (error) {
        console.error("CREATE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to create department",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});


/* =========================================================
   UPDATE DEPARTMENT
   PUT /api/departments/:id
========================================================= */
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID",
            });
        }

        const {
            name,
            slug,
            short_name,
            department_image,
            tagline,
            description,
            established_year,
            programme,
            affiliation,
            hod_name,
            hod_designation,
            hod_qualification,
            hod_image,
            hod_profile,
            display_order = 0,
            is_active = 1,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        const finalSlug =
            slug && slug.trim()
                ? slug.trim().toLowerCase()
                : name
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "");

        const [duplicate] = await db.query(
            `
            SELECT id
            FROM departments
            WHERE slug = ?
              AND id != ?
            LIMIT 1
            `,
            [finalSlug, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Another department already uses this slug",
            });
        }

        const [result] = await db.query(
            `
            UPDATE departments
            SET
                name = ?,
                slug = ?,
                short_name = ?,
                department_image = ?,
                tagline = ?,
                description = ?,
                established_year = ?,
                programme = ?,
                affiliation = ?,
                hod_name = ?,
                hod_designation = ?,
                hod_qualification = ?,
                hod_image = ?,
                hod_profile = ?,
                display_order = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                finalSlug,
                short_name || null,
                department_image || null,
                tagline || null,
                description || null,
                established_year || null,
                programme || null,
                affiliation || null,
                hod_name || null,
                hod_designation || null,
                hod_qualification || null,
                hod_image || null,
                hod_profile || null,
                Number(display_order) || 0,
                is_active ? 1 : 0,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.json({
            success: true,
            message: "Department updated successfully",
            affectedRows: result.affectedRows,
        });

    } catch (error) {
        console.error("UPDATE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update department",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});


/* =========================================================
   DELETE DEPARTMENT
   DELETE /api/departments/:id
========================================================= */
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid department ID",
            });
        }

        await ensureDepartmentSections();
        await db.query("DELETE FROM department_sections WHERE department_id = ?", [id]);
        const [result] = await db.query(
            `DELETE FROM departments WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        res.json({
            success: true,
            message: "Department deleted successfully",
        });

    } catch (error) {
        console.error("DELETE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete department",
            error: error.message,
            code: error.code || null,
            sqlMessage: error.sqlMessage || null,
        });
    }
});


/* =========================================================
   TOGGLE STATUS
   PATCH /api/departments/:id/toggle
========================================================= */
router.patch("/:id/toggle", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [result] = await db.query(
            `
            UPDATE departments
            SET is_active = IF(is_active = 1, 0, 1)
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        const [rows] = await db.query(
            `
            SELECT id, is_active
            FROM departments
            WHERE id = ?
            `,
            [id]
        );

        res.json({
            success: true,
            message: "Department status updated",
            is_active: rows[0]?.is_active ?? 0,
        });

    } catch (error) {
        console.error("TOGGLE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update department status",
            error: error.message,
        });
    }
});


export default router;