
import express from "express";
import db from "../../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* =========================================================
   DIRECTORIES
========================================================= */

const photoDir = "uploads/departments/faculty";
const resumeDir = "uploads/departments/resumes";

if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
}

if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}


/* =========================================================
   MULTER
========================================================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "photo") {
            cb(null, photoDir);
        } else if (file.fieldname === "resume") {
            cb(null, resumeDir);
        } else {
            cb(new Error("Invalid upload field"));
        }
    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const baseName =
            path
                .basename(file.originalname, extension)
                .replace(/[^a-zA-Z0-9_-]/g, "-")
                .toLowerCase();

        const uniqueName =
            `${Date.now()}-${baseName}${extension}`;

        cb(null, uniqueName);
    }
});


const upload = multer({

    storage,

    limits: {
        fileSize: 20 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        if (file.fieldname === "photo") {

            const allowed = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowed.includes(file.mimetype)) {
                return cb(
                    new Error(
                        "Faculty photo must be JPG, PNG or WEBP"
                    )
                );
            }
        }

        if (file.fieldname === "resume") {

            if (file.mimetype !== "application/pdf") {
                return cb(
                    new Error(
                        "Resume must be a PDF file"
                    )
                );
            }
        }

        cb(null, true);
    }
});


/* =========================================================
   TEST
========================================================= */

router.get("/test", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS test"
        );

        res.json({
            success: true,
            message: "Department Faculty API is working",
            data: rows[0]
        });

    } catch (error) {

        console.error(
            "FACULTY API TEST ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Faculty API test failed",
            error: error.message
        });
    }
});


/* =========================================================
   GET ALL FACULTY OF DEPARTMENT
========================================================= */

router.get(
    "/department/:departmentId",
    async (req, res) => {

        try {

            const departmentId =
                Number(req.params.departmentId);

            if (
                !Number.isInteger(departmentId) ||
                departmentId <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Valid Department ID is required"
                });
            }

            const activeFilter = req.query.include_inactive === "1" ? "" : "AND is_active = 1";
            const [rows] = await db.query(
                `
                SELECT
                    id,
                    department_id,
                    name,
                    designation,
                    qualification,
                    specialization,
                    experience,
                    email,
                    phone,
                    profile,
                    photo_url,
                    resume_url,
                    is_hod,
                    display_order,
                    is_active,
                    created_at,
                    updated_at
                FROM department_faculty
                WHERE department_id = ?
                                    ${activeFilter}
                ORDER BY
                    is_hod DESC,
                    display_order ASC,
                    id ASC
                `,
                [departmentId]
            );

            res.json({
                success: true,
                faculty: rows
            });

        } catch (error) {

            console.error(
                "GET DEPARTMENT FACULTY ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Unable to fetch department faculty",
                error: error.message
            });
        }
    }
);


/* =========================================================
   GET SINGLE FACULTY
========================================================= */

router.get("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Faculty ID is required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT *
            FROM department_faculty
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty member not found"
            });
        }

        res.json({
            success: true,
            faculty: rows[0]
        });

    } catch (error) {

        console.error(
            "GET FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to fetch faculty",
            error: error.message
        });
    }
});


/* =========================================================
   CREATE FACULTY
========================================================= */

router.post(
    "/",
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        },
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    async (req, res) => {

        try {

            const {
                department_id,
                name,
                designation,
                qualification,
                specialization,
                experience,
                email,
                phone,
                profile,
                is_hod,
                display_order,
                is_active
            } = req.body;

            const departmentId =
                Number(department_id);

            if (
                !Number.isInteger(departmentId) ||
                departmentId <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Valid Department ID is required"
                });
            }

            if (!name || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Faculty name is required"
                });
            }


            /* ---------------------------------------------
               Check department
            --------------------------------------------- */

            const [departmentRows] =
                await db.query(
                    `
                    SELECT id
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
               If new faculty is HOD,
               remove HOD status from existing HOD
            --------------------------------------------- */

            const hod =
                Number(is_hod) === 1 ? 1 : 0;

            if (hod === 1) {

                await db.query(
                    `
                    UPDATE department_faculty
                    SET is_hod = 0
                    WHERE department_id = ?
                    `,
                    [departmentId]
                );
            }


            /* ---------------------------------------------
               Uploaded files
            --------------------------------------------- */

            const photo =
                req.files?.photo?.[0];

            const resume =
                req.files?.resume?.[0];

            const photoUrl = photo
                ? `/uploads/departments/faculty/${photo.filename}`
                : null;

            const resumeUrl = resume
                ? `/uploads/departments/resumes/${resume.filename}`
                : null;


            /* ---------------------------------------------
               Insert
            --------------------------------------------- */

            const [result] = await db.query(
                `
                INSERT INTO department_faculty
                (
                    department_id,
                    name,
                    designation,
                    qualification,
                    specialization,
                    experience,
                    email,
                    phone,
                    profile,
                    photo_url,
                    resume_url,
                    is_hod,
                    display_order,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    departmentId,
                    name.trim(),
                    designation || null,
                    qualification || null,
                    specialization || null,
                    experience || null,
                    email || null,
                    phone || null,
                    profile || null,
                    photoUrl,
                    resumeUrl,
                    hod,
                    Number(display_order) || 0,
                    Number(is_active) === 0 ? 0 : 1
                ]
            );

            res.status(201).json({
                success: true,
                message: "Faculty member added successfully",
                faculty_id: result.insertId
            });

        } catch (error) {

            console.error(
                "CREATE FACULTY ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Unable to create faculty member",
                error: error.message
            });
        }
    }
);


/* =========================================================
   UPDATE FACULTY
========================================================= */

router.put(
    "/:id",
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        },
        {
            name: "resume",
            maxCount: 1
        }
    ]),
    async (req, res) => {

        try {

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid Faculty ID is required"
                });
            }

            const {
                name,
                designation,
                qualification,
                specialization,
                experience,
                email,
                phone,
                profile,
                is_hod,
                display_order,
                is_active
            } = req.body;


            if (!name || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Faculty name is required"
                });
            }


            /* ---------------------------------------------
               Existing faculty
            --------------------------------------------- */

            const [existingRows] =
                await db.query(
                    `
                    SELECT *
                    FROM department_faculty
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [id]
                );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Faculty member not found"
                });
            }

            const existing =
                existingRows[0];

            const hod =
                Number(is_hod) === 1 ? 1 : 0;


            /* ---------------------------------------------
               If this faculty becomes HOD,
               remove existing HOD
            --------------------------------------------- */

            if (hod === 1) {

                await db.query(
                    `
                    UPDATE department_faculty
                    SET is_hod = 0
                    WHERE department_id = ?
                    AND id != ?
                    `,
                    [
                        existing.department_id,
                        id
                    ]
                );
            }


            /* ---------------------------------------------
               File URLs
            --------------------------------------------- */

            let photoUrl =
                existing.photo_url;

            let resumeUrl =
                existing.resume_url;


            const photo =
                req.files?.photo?.[0];

            const resume =
                req.files?.resume?.[0];


            if (photo) {

                photoUrl =
                    `/uploads/departments/faculty/${photo.filename}`;
            }

            if (resume) {

                resumeUrl =
                    `/uploads/departments/resumes/${resume.filename}`;
            }


            /* ---------------------------------------------
               Update
            --------------------------------------------- */

            await db.query(
                `
                UPDATE department_faculty

                SET
                    name = ?,
                    designation = ?,
                    qualification = ?,
                    specialization = ?,
                    experience = ?,
                    email = ?,
                    phone = ?,
                    profile = ?,
                    photo_url = ?,
                    resume_url = ?,
                    is_hod = ?,
                    display_order = ?,
                    is_active = ?

                WHERE id = ?
                `,
                [
                    name.trim(),
                    designation || null,
                    qualification || null,
                    specialization || null,
                    experience || null,
                    email || null,
                    phone || null,
                    profile || null,
                    photoUrl,
                    resumeUrl,
                    hod,
                    Number(display_order) || 0,
                    Number(is_active) === 0 ? 0 : 1,
                    id
                ]
            );


            res.json({
                success: true,
                message: "Faculty member updated successfully"
            });

        } catch (error) {

            console.error(
                "UPDATE FACULTY ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Unable to update faculty member",
                error: error.message
            });
        }
    }
);


/* =========================================================
   TOGGLE ACTIVE STATUS
========================================================= */

router.patch("/:id/toggle", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Faculty ID is required"
            });
        }

        const [rows] = await db.query(
            `
            SELECT id, is_active
            FROM department_faculty
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty member not found"
            });
        }

        const newStatus =
            rows[0].is_active ? 0 : 1;

        await db.query(
            `
            UPDATE department_faculty
            SET is_active = ?
            WHERE id = ?
            `,
            [newStatus, id]
        );

        res.json({
            success: true,
            message: newStatus
                ? "Faculty member activated"
                : "Faculty member deactivated",
            is_active: newStatus
        });

    } catch (error) {

        console.error(
            "TOGGLE FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to change faculty status",
            error: error.message
        });
    }
});


/* =========================================================
   DELETE FACULTY
========================================================= */

router.delete("/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Faculty ID is required"
            });
        }

        const [result] = await db.query(
            `
            DELETE FROM department_faculty
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty member not found"
            });
        }

        res.json({
            success: true,
            message: "Faculty member deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE FACULTY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to delete faculty member",
            error: error.message
        });
    }
});


export default router;