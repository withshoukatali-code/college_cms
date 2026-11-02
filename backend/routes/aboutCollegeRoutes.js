
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../config/db.js";

const router = express.Router();

/*
=========================================================
ABOUT COLLEGE
Table: about_college
=========================================================
*/

const SELECT_FIELDS = `
    id,
    title,
    title_highlight,
    description,
    image_url,
    image_alt,
    accreditation_label,
    accreditation_text,
    highlight1_title,
    highlight1_description,
    highlight2_title,
    highlight2_description,
    highlight3_title,
    highlight3_description,
    button_text,
    button_link,
    is_active,
    display_order,
    created_at,
    updated_at
`;

/*
=========================================================
UPLOAD DIRECTORY
=========================================================
*/

const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "about-college"
);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true,
    });
}

/*
=========================================================
MULTER
IMPORTANT:
React sends field name = "file"
=========================================================
*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const safeName = path
            .basename(
                file.originalname,
                ext
            )
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .toLowerCase();

        cb(
            null,
            `${Date.now()}-${safeName}${ext}`
        );
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );
        }

        cb(null, true);
    },
});

/*
=========================================================
HELPER
=========================================================
*/

const clean = (value, fallback = null) => {
    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    const valueString = String(value).trim();

    return valueString
        ? valueString
        : fallback;
};

/*
=========================================================
PUBLIC
GET /api/about-college
=========================================================
*/

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                ${SELECT_FIELDS}
            FROM about_college
            WHERE is_active = 1
            ORDER BY display_order ASC, id ASC
        `);

        res.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error(
            "GET /api/about-college:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch About College data",
        });
    }
});

/*
=========================================================
ADMIN
GET /api/about-college/admin
=========================================================
*/

router.get("/admin", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                ${SELECT_FIELDS}
            FROM about_college
            ORDER BY display_order ASC, id ASC
        `);

        res.json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error(
            "GET /api/about-college/admin:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch About College records",
        });
    }
});

/*
=========================================================
ADMIN
GET /api/about-college/admin/:id
=========================================================
*/

router.get("/admin/:id", async (req, res) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT
                ${SELECT_FIELDS}
            FROM about_college
            WHERE id = ?
            `,
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message:
                    "About College record not found",
            });
        }

        res.json({
            success: true,
            data: rows[0],
        });
    } catch (error) {
        console.error(
            "GET /api/about-college/admin/:id:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch About College record",
        });
    }
});

/*
=========================================================
ADMIN
POST /api/about-college/admin

IMPORTANT:
upload.single("file")
=========================================================
*/

router.post(
    "/admin",
    upload.single("file"),
    async (req, res) => {
        try {
            console.log(
                "POST About College body:",
                req.body
            );

            console.log(
                "POST About College file:",
                req.file
                    ? req.file.filename
                    : "NO FILE"
            );

            const {
                title,
                title_highlight,
                description,
                image_alt,
                accreditation_label,
                accreditation_text,
                highlight1_title,
                highlight1_description,
                highlight2_title,
                highlight2_description,
                highlight3_title,
                highlight3_description,
                button_text,
                button_link,
                is_active,
                display_order,
            } = req.body;

            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required.",
                });
            }

            if (
                !description ||
                !description.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Description is required.",
                });
            }

            /*
            -------------------------------------------------
            IMAGE URL
            -------------------------------------------------
            */

            let imageUrl = null;

            if (req.file) {
                imageUrl =
                    `/uploads/about-college/${req.file.filename}`;
            }

            /*
            -------------------------------------------------
            INSERT
            -------------------------------------------------
            */

            const [result] = await pool.query(
                `
                INSERT INTO about_college
                (
                    title,
                    title_highlight,
                    description,
                    image_url,
                    image_alt,
                    accreditation_label,
                    accreditation_text,
                    highlight1_title,
                    highlight1_description,
                    highlight2_title,
                    highlight2_description,
                    highlight3_title,
                    highlight3_description,
                    button_text,
                    button_link,
                    is_active,
                    display_order
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    clean(title),
                    clean(title_highlight),
                    clean(description),
                    imageUrl,
                    clean(
                        image_alt,
                        "College campus"
                    ),
                    clean(
                        accreditation_label,
                        "Accreditation"
                    ),
                    clean(
                        accreditation_text,
                        "NAAC Accredited"
                    ),
                    clean(
                        highlight1_title,
                        "Institution"
                    ),
                    clean(
                        highlight1_description,
                        "About our college"
                    ),
                    clean(
                        highlight2_title,
                        "Academics"
                    ),
                    clean(
                        highlight2_description,
                        "Programmes & departments"
                    ),
                    clean(
                        highlight3_title,
                        "Excellence"
                    ),
                    clean(
                        highlight3_description,
                        "Quality & achievements"
                    ),
                    clean(
                        button_text,
                        "Discover More"
                    ),
                    clean(
                        button_link,
                        "/about"
                    ),
                    Number(is_active) === 1
                        ? 1
                        : 0,
                    Number(display_order) || 0,
                ]
            );

            res.status(201).json({
                success: true,
                message:
                    "About College created successfully.",
                id: result.insertId,
                image_url: imageUrl,
            });
        } catch (error) {
            console.error(
                "POST /api/about-college/admin ERROR:",
                error
            );

            /*
            Delete uploaded file if database
            insertion fails.
            */
            if (req.file) {
                try {
                    fs.unlinkSync(
                        path.join(
                            uploadDir,
                            req.file.filename
                        )
                    );
                } catch (deleteError) {
                    console.error(
                        "Could not remove uploaded file:",
                        deleteError
                    );
                }
            }

            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to create About College.",
            });
        }
    }
);

/*
=========================================================
ADMIN
PUT /api/about-college/admin/:id

IMPORTANT:
upload.single("file")
=========================================================
*/

router.put(
    "/admin/:id",
    upload.single("file"),
    async (req, res) => {
        try {
            const { id } = req.params;

            console.log(
                "PUT About College body:",
                req.body
            );

            console.log(
                "PUT About College file:",
                req.file
                    ? req.file.filename
                    : "NO FILE"
            );

            /*
            -------------------------------------------------
            FIND EXISTING RECORD
            -------------------------------------------------
            */

            const [existingRows] =
                await pool.query(
                    `
                    SELECT *
                    FROM about_college
                    WHERE id = ?
                    `,
                    [id]
                );

            if (!existingRows.length) {
                return res.status(404).json({
                    success: false,
                    message:
                        "About College record not found.",
                });
            }

            const existing =
                existingRows[0];

            const {
                title,
                title_highlight,
                description,
                existing_image,
                image_alt,
                accreditation_label,
                accreditation_text,
                highlight1_title,
                highlight1_description,
                highlight2_title,
                highlight2_description,
                highlight3_title,
                highlight3_description,
                button_text,
                button_link,
                is_active,
                display_order,
            } = req.body;

            if (!title || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title is required.",
                });
            }

            if (
                !description ||
                !description.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Description is required.",
                });
            }

            /*
            -------------------------------------------------
            DETERMINE IMAGE
            -------------------------------------------------
            */

            let imageUrl =
                existing.image_url || null;

            /*
            New image selected
            */

            if (req.file) {
                imageUrl =
                    `/uploads/about-college/${req.file.filename}`;

                /*
                Delete old local image
                */

                if (
                    existing.image_url &&
                    existing.image_url.startsWith(
                        "/uploads/about-college/"
                    )
                ) {
                    const oldFile =
                        path.join(
                            process.cwd(),
                            existing.image_url
                                .replace(
                                    /^\//,
                                    ""
                                )
                        );

                    if (
                        fs.existsSync(
                            oldFile
                        )
                    ) {
                        try {
                            fs.unlinkSync(
                                oldFile
                            );
                        } catch (deleteError) {
                            console.error(
                                "Could not delete old image:",
                                deleteError
                            );
                        }
                    }
                }
            } else if (
                existing_image !==
                undefined
            ) {
                /*
                Keep the image supplied by
                frontend.
                */

                imageUrl =
                    clean(existing_image);
            }

            /*
            -------------------------------------------------
            UPDATE
            -------------------------------------------------
            */

            const [result] =
                await pool.query(
                    `
                    UPDATE about_college
                    SET
                        title = ?,
                        title_highlight = ?,
                        description = ?,
                        image_url = ?,
                        image_alt = ?,
                        accreditation_label = ?,
                        accreditation_text = ?,
                        highlight1_title = ?,
                        highlight1_description = ?,
                        highlight2_title = ?,
                        highlight2_description = ?,
                        highlight3_title = ?,
                        highlight3_description = ?,
                        button_text = ?,
                        button_link = ?,
                        is_active = ?,
                        display_order = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    `,
                    [
                        clean(title),
                        clean(
                            title_highlight
                        ),
                        clean(description),
                        imageUrl,
                        clean(
                            image_alt,
                            "College campus"
                        ),
                        clean(
                            accreditation_label,
                            "Accreditation"
                        ),
                        clean(
                            accreditation_text,
                            "NAAC Accredited"
                        ),
                        clean(
                            highlight1_title,
                            "Institution"
                        ),
                        clean(
                            highlight1_description,
                            "About our college"
                        ),
                        clean(
                            highlight2_title,
                            "Academics"
                        ),
                        clean(
                            highlight2_description,
                            "Programmes & departments"
                        ),
                        clean(
                            highlight3_title,
                            "Excellence"
                        ),
                        clean(
                            highlight3_description,
                            "Quality & achievements"
                        ),
                        clean(
                            button_text,
                            "Discover More"
                        ),
                        clean(
                            button_link,
                            "/about"
                        ),
                        Number(is_active) === 1
                            ? 1
                            : 0,
                        Number(
                            display_order
                        ) || 0,
                        id,
                    ]
                );

            if (
                result.affectedRows === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "About College record not found.",
                });
            }

            res.json({
                success: true,
                message:
                    "About College updated successfully.",
                image_url: imageUrl,
            });
        } catch (error) {
            console.error(
                "PUT /api/about-college/admin/:id ERROR:",
                error
            );

            if (req.file) {
                try {
                    fs.unlinkSync(
                        path.join(
                            uploadDir,
                            req.file.filename
                        )
                    );
                } catch (deleteError) {
                    console.error(
                        "Could not remove uploaded file:",
                        deleteError
                    );
                }
            }

            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "Failed to update About College.",
            });
        }
    }
);

/*
=========================================================
DELETE
DELETE /api/about-college/admin/:id
=========================================================
*/

router.delete(
    "/admin/:id",
    async (req, res) => {
        try {
            const { id } = req.params;

            const [rows] =
                await pool.query(
                    `
                    SELECT image_url
                    FROM about_college
                    WHERE id = ?
                    `,
                    [id]
                );

            if (!rows.length) {
                return res.status(404).json({
                    success: false,
                    message:
                        "About College record not found.",
                });
            }

            const imageUrl =
                rows[0].image_url;

            const [result] =
                await pool.query(
                    `
                    DELETE FROM about_college
                    WHERE id = ?
                    `,
                    [id]
                );

            if (
                result.affectedRows === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "About College record not found.",
                });
            }

            /*
            Delete local image
            */

            if (
                imageUrl &&
                imageUrl.startsWith(
                    "/uploads/about-college/"
                )
            ) {
                const imagePath =
                    path.join(
                        process.cwd(),
                        imageUrl.replace(
                            /^\//,
                            ""
                        )
                    );

                if (
                    fs.existsSync(imagePath)
                ) {
                    try {
                        fs.unlinkSync(
                            imagePath
                        );
                    } catch (error) {
                        console.error(
                            "Could not delete image:",
                            error
                        );
                    }
                }
            }

            res.json({
                success: true,
                message:
                    "About College deleted successfully.",
            });
        } catch (error) {
            console.error(
                "DELETE /api/about-college/admin/:id:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Failed to delete About College.",
            });
        }
    }
);

/*
=========================================================
MULTER ERROR HANDLER
=========================================================
*/

router.use(
    (error, req, res, next) => {
        if (
            error instanceof multer.MulterError
        ) {
            console.error(
                "Multer Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.code ===
                    "LIMIT_FILE_SIZE"
                        ? "Image size must be less than 10 MB."
                        : error.message,
            });
        }

        if (error) {
            console.error(
                "Upload Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error.message ||
                    "Image upload failed.",
            });
        }

        next();
    }
);

export default router;

