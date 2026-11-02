import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../../config/db.js";
import sanitizeHtml from "sanitize-html";

const router = express.Router();
const syllabusDirectory = path.resolve("uploads/departments/syllabi");
fs.mkdirSync(syllabusDirectory, { recursive: true });

const syllabusUpload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, callback) => callback(null, syllabusDirectory),
        filename: (_req, file, callback) => {
            const safeName = path.basename(file.originalname, path.extname(file.originalname))
                .replace(/[^a-z0-9_-]/gi, "-")
                .toLowerCase();
            callback(null, `${Date.now()}-${safeName}.pdf`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        const isPdf = file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf";
        callback(isPdf ? null : new Error("Syllabus must be a PDF file"), isPdf);
    },
});

let syllabusContentSchemaPromise;
const ensureSyllabusContentColumn = async () => {
    if (!syllabusContentSchemaPromise) {
        syllabusContentSchemaPromise = (async () => {
            const [columns] = await db.query("SHOW COLUMNS FROM department_programmes LIKE 'syllabus_content'");
            if (!columns.length) {
                await db.query("ALTER TABLE department_programmes ADD COLUMN syllabus_content LONGTEXT NULL");
            }
        })();
    }
    await syllabusContentSchemaPromise;
};

const cleanSyllabusHtml = (html) => sanitizeHtml(html || "", {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h1", "h2", "h3", "h4", "blockquote", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "span", "div", "a"],
    allowedAttributes: {
        a: ["href", "target", "rel"],
        table: ["border"],
        th: ["colspan", "rowspan", "scope"],
        td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
});

router.post("/upload-syllabus", syllabusUpload.single("syllabus"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "A PDF syllabus file is required" });
    }
    res.status(201).json({ success: true, syllabus_url: `/uploads/departments/syllabi/${req.file.filename}` });
});

/*
|--------------------------------------------------------------------------
| GET ALL PROGRAMMES FOR A DEPARTMENT
|--------------------------------------------------------------------------
| GET /api/department-programmes/department/:departmentId
*/
router.get("/department/:departmentId", async (req, res) => {
    try {
    await ensureSyllabusContentColumn();
        const { departmentId } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM department_programmes
            WHERE department_id = ?
            ORDER BY programme_level, display_order, id
            `,
            [departmentId]
        );

        res.json({
            success: true,
            programmes: rows,
        });
    } catch (error) {
        console.error("GET PROGRAMMES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch department programmes",
            error: error.message,
        });
    }
});


/*
|--------------------------------------------------------------------------
| GET SINGLE PROGRAMME
|--------------------------------------------------------------------------
| GET /api/department-programmes/:id
|--------------------------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
    try {
    await ensureSyllabusContentColumn();
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM department_programmes
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Programme not found",
            });
        }

        res.json({
            success: true,
            programme: rows[0],
        });
    } catch (error) {
        console.error("GET SINGLE PROGRAMME ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch programme",
            error: error.message,
        });
    }
});


/*
|--------------------------------------------------------------------------
| CREATE PROGRAMME
|--------------------------------------------------------------------------
| POST /api/department-programmes
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
    try {
        const {
            department_id,
            programme_level,
            programme_name,
            programme_code,
            duration,
            intake_capacity,
            eligibility,
            description,
            syllabus_url,
            syllabus_content,
            display_order,
            is_active,
        } = req.body;

        if (!department_id) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required",
            });
        }

        if (!programme_name || !programme_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Programme name is required",
            });
        }

        // Verify department exists
        const [department] = await db.query(
            `
            SELECT id
            FROM departments
            WHERE id = ?
            LIMIT 1
            `,
            [department_id]
        );

        if (department.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Department does not exist",
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO department_programmes
            (
                department_id,
                programme_level,
                programme_name,
                programme_code,
                duration,
                intake_capacity,
                eligibility,
                description,
                syllabus_url,
                syllabus_content,
                display_order,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                department_id,
                programme_level || "UG",
                programme_name.trim(),
                programme_code || null,
                duration || null,
                intake_capacity || null,
                eligibility || null,
                description || null,
                syllabus_url || null,
                cleanSyllabusHtml(syllabus_content),
                display_order || 0,
                is_active !== undefined ? is_active : 1,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Programme created successfully",
            id: result.insertId,
        });
    } catch (error) {
        console.error("CREATE PROGRAMME ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create programme",
            error: error.message,
        });
    }
});


/*
|--------------------------------------------------------------------------
| UPDATE PROGRAMME
|--------------------------------------------------------------------------
| PUT /api/department-programmes/:id
|--------------------------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
    try {
    await ensureSyllabusContentColumn();
        const { id } = req.params;

        const {
            department_id,
            programme_level,
            programme_name,
            programme_code,
            duration,
            intake_capacity,
            eligibility,
            description,
            syllabus_url,
            syllabus_content,
            display_order,
            is_active,
        } = req.body;

        if (!programme_name || !programme_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Programme name is required",
            });
        }

        const [existing] = await db.query(
            `
            SELECT id
            FROM department_programmes
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Programme not found",
            });
        }

        // If department_id is supplied, verify it
        if (department_id) {
            const [department] = await db.query(
                `
                SELECT id
                FROM departments
                WHERE id = ?
                LIMIT 1
                `,
                [department_id]
            );

            if (department.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Department does not exist",
                });
            }
        }

        const [result] = await db.query(
            `
            UPDATE department_programmes
            SET
                department_id = ?,
                programme_level = ?,
                programme_name = ?,
                programme_code = ?,
                duration = ?,
                intake_capacity = ?,
                eligibility = ?,
                description = ?,
                syllabus_url = ?,
                syllabus_content = ?,
                display_order = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                department_id,
                programme_level || "UG",
                programme_name.trim(),
                programme_code || null,
                duration || null,
                intake_capacity || null,
                eligibility || null,
                description || null,
                syllabus_url || null,
                cleanSyllabusHtml(syllabus_content),
                display_order || 0,
                is_active !== undefined ? is_active : 1,
                id,
            ]
        );

        res.json({
            success: true,
            message: "Programme updated successfully",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        console.error("UPDATE PROGRAMME ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update programme",
            error: error.message,
        });
    }
});


/*
|--------------------------------------------------------------------------
| DELETE PROGRAMME
|--------------------------------------------------------------------------
| DELETE /api/department-programmes/:id
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `
            DELETE FROM department_programmes
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Programme not found",
            });
        }

        res.json({
            success: true,
            message: "Programme deleted successfully",
        });
    } catch (error) {
        console.error("DELETE PROGRAMME ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete programme",
            error: error.message,
        });
    }
});


/*
|--------------------------------------------------------------------------
| TOGGLE PROGRAMME STATUS
|--------------------------------------------------------------------------
| PATCH /api/department-programmes/:id/toggle
|--------------------------------------------------------------------------
*/
router.patch("/:id/toggle", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT is_active
            FROM department_programmes
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Programme not found",
            });
        }

        const newStatus = rows[0].is_active ? 0 : 1;

        await db.query(
            `
            UPDATE department_programmes
            SET is_active = ?
            WHERE id = ?
            `,
            [newStatus, id]
        );

        res.json({
            success: true,
            message: newStatus
                ? "Programme activated"
                : "Programme deactivated",
            is_active: newStatus,
        });
    } catch (error) {
        console.error("TOGGLE PROGRAMME ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to change programme status",
            error: error.message,
        });
    }
});


export default router;