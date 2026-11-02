import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const router = express.Router();

// =========================================================
// PATH SETUP
// =========================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(
  __dirname,
  "../uploads/home-welcome"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${baseName}${extension}`
    );
  },
});

// =========================================================
// UPLOAD CONFIG
// =========================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    // Principal photo
    if (file.fieldname === "principal_photo") {
      const allowedImages = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (allowedImages.includes(file.mimetype)) {
        return cb(null, true);
      }

      return cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed for Principal Photo."
        )
      );
    }

    // Principal profile PDF
    if (
      file.fieldname ===
      "principal_profile_pdf"
    ) {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      }

      return cb(
        new Error(
          "Only PDF files are allowed for Principal Profile."
        )
      );
    }

    cb(
      new Error(
        `Unexpected upload field: ${file.fieldname}`
      )
    );
  },
});

// =========================================================
// HELPER
// =========================================================

const deleteUploadedFile = (fileUrl) => {
  if (
    !fileUrl ||
    typeof fileUrl !== "string"
  ) {
    return;
  }

  if (
    !fileUrl.startsWith(
      "/uploads/home-welcome/"
    )
  ) {
    return;
  }

  const filePath = path.join(
    __dirname,
    "..",
    fileUrl
  );

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(
        "Deleted old uploaded file:",
        filePath
      );
    } catch (error) {
      console.warn(
        "Could not delete old uploaded file:",
        error.message
      );
    }
  }
};

// =========================================================
// GET ACTIVE
//
// GET /api/home-welcome
// =========================================================

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        welcome_title,

        principal_name,
        principal_designation,
        principal_photo,
        principal_message,

        principal_profile_pdf,
        principal_profile_button_text,

        card_one_title,
        card_one_description,
        card_one_link,

        card_two_title,
        card_two_description,
        card_two_link,

        card_three_title,
        card_three_description,
        card_three_link,

        is_active,
        created_at,
        updated_at

      FROM home_welcome

      WHERE is_active = 1

      ORDER BY id ASC

      LIMIT 1
    `);

    res.json({
      success: true,
      data: rows.length
        ? rows[0]
        : null,
    });
  } catch (error) {
    console.error(
      "GET home welcome error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch home welcome",
      error: error.message,
    });
  }
});

// =========================================================
// GET ALL
//
// GET /api/home-welcome/all
// =========================================================

router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM home_welcome
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET all home welcome error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch home welcome records",
      error: error.message,
    });
  }
});

// =========================================================
// GET SINGLE
//
// GET /api/home-welcome/:id
// =========================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM home_welcome
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message:
          "Home welcome record not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "GET home welcome record error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch home welcome record",
      error: error.message,
    });
  }
});

// =========================================================
// PRINCIPAL MESSAGE ONLY
//
// PUT /api/home-welcome/:id/principal-message
// =========================================================

router.put(
  "/:id/principal-message",
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        principal_message,
      } = req.body;

      if (
        principal_message === undefined ||
        principal_message === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Principal message is required.",
        });
      }

      const message =
        String(principal_message).trim();

      const [result] = await pool.query(
        `
        UPDATE home_welcome

        SET principal_message = ?

        WHERE id = ?
        `,
        [message || null, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message:
            "Home welcome record not found.",
        });
      }

      const [rows] = await pool.query(
        `
        SELECT *
        FROM home_welcome
        WHERE id = ?
        `,
        [id]
      );

      return res.json({
        success: true,
        message:
          "Principal message updated successfully.",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE principal message error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update principal message.",
        error: error.message,
      });
    }
  }
);

// =========================================================
// UPLOAD PRINCIPAL PHOTO
//
// POST /api/home-welcome/upload-principal-photo
// =========================================================

router.post(
  "/upload-principal-photo",
  upload.single("principal_photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a photo.",
        });
      }

      const imageUrl =
        `/uploads/home-welcome/${req.file.filename}`;

      const [rows] = await pool.query(`
        SELECT id, principal_photo

        FROM home_welcome

        WHERE is_active = 1

        ORDER BY id ASC

        LIMIT 1
      `);

      if (!rows.length) {
        deleteUploadedFile(imageUrl);

        return res.status(404).json({
          success: false,
          message:
            "No active Home Welcome record exists.",
        });
      }

      const recordId = rows[0].id;
      const oldPhoto =
        rows[0].principal_photo;

      await pool.query(
        `
        UPDATE home_welcome

        SET principal_photo = ?

        WHERE id = ?
        `,
        [imageUrl, recordId]
      );

      deleteUploadedFile(oldPhoto);

      return res.json({
        success: true,
        message:
          "Principal photo uploaded successfully",

        data: {
          id: recordId,
          image_url: imageUrl,
          file_url: imageUrl,
          principal_photo: imageUrl,
        },
      });
    } catch (error) {
      console.error(
        "Principal photo upload error:",
        error
      );

      if (req.file) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to upload principal photo",
        error: error.message,
      });
    }
  }
);

// =========================================================
// UPLOAD PRINCIPAL PROFILE PDF
//
// POST /api/home-welcome/upload-principal-profile
// =========================================================

router.post(
  "/upload-principal-profile",
  upload.single(
    "principal_profile_pdf"
  ),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a PDF file.",
        });
      }

      const pdfUrl =
        `/uploads/home-welcome/${req.file.filename}`;

      const [rows] = await pool.query(`
        SELECT
          id,
          principal_profile_pdf

        FROM home_welcome

        WHERE is_active = 1

        ORDER BY id ASC

        LIMIT 1
      `);

      if (!rows.length) {
        deleteUploadedFile(pdfUrl);

        return res.status(404).json({
          success: false,
          message:
            "No active Home Welcome record exists.",
        });
      }

      const recordId = rows[0].id;

      const oldPdf =
        rows[0].principal_profile_pdf;

      await pool.query(
        `
        UPDATE home_welcome

        SET principal_profile_pdf = ?

        WHERE id = ?
        `,
        [pdfUrl, recordId]
      );

      deleteUploadedFile(oldPdf);

      return res.json({
        success: true,
        message:
          "Principal profile PDF uploaded successfully",

        data: {
          id: recordId,
          pdf_url: pdfUrl,
          file_url: pdfUrl,
          principal_profile_pdf: pdfUrl,
        },
      });
    } catch (error) {
      console.error(
        "Principal PDF upload error:",
        error
      );

      if (req.file) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to upload principal profile PDF",
        error: error.message,
      });
    }
  }
);

// =========================================================
// CREATE
//
// POST /api/home-welcome
//
// Supports:
// - Principal Photo
// - Principal Profile PDF
// =========================================================

router.post(
  "/",
  upload.fields([
    {
      name: "principal_photo",
      maxCount: 1,
    },
    {
      name: "principal_profile_pdf",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const {
        welcome_title,

        principal_name,
        principal_designation,
        principal_message,

        principal_profile_button_text,

        card_one_title,
        card_one_description,
        card_one_link,

        card_two_title,
        card_two_description,
        card_two_link,

        card_three_title,
        card_three_description,
        card_three_link,

        is_active,
      } = req.body;

      if (!welcome_title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Welcome title is required",
        });
      }

      const photoFile =
        req.files?.principal_photo?.[0];

      const pdfFile =
        req.files
          ?.principal_profile_pdf?.[0];

      const principalPhoto =
        photoFile
          ? `/uploads/home-welcome/${photoFile.filename}`
          : null;

      const principalPdf =
        pdfFile
          ? `/uploads/home-welcome/${pdfFile.filename}`
          : null;

      const active =
        Number(is_active ?? 1) === 1
          ? 1
          : 0;

      if (active === 1) {
        await pool.query(`
          UPDATE home_welcome
          SET is_active = 0
        `);
      }

      const [result] =
        await pool.query(
          `
          INSERT INTO home_welcome
          (
            welcome_title,

            principal_name,
            principal_designation,
            principal_photo,
            principal_message,

            principal_profile_pdf,
            principal_profile_button_text,

            card_one_title,
            card_one_description,
            card_one_link,

            card_two_title,
            card_two_description,
            card_two_link,

            card_three_title,
            card_three_description,
            card_three_link,

            is_active
          )

          VALUES
          (
            ?, ?, ?, ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?,
            ?
          )
          `,
          [
            welcome_title.trim(),

            principal_name?.trim() ||
              null,

            principal_designation?.trim() ||
              null,

            principalPhoto,

            principal_message?.trim() ||
              null,

            principalPdf,

            principal_profile_button_text?.trim() ||
              "View Profile",

            card_one_title?.trim() ||
              null,

            card_one_description?.trim() ||
              null,

            card_one_link?.trim() ||
              null,

            card_two_title?.trim() ||
              null,

            card_two_description?.trim() ||
              null,

            card_two_link?.trim() ||
              null,

            card_three_title?.trim() ||
              null,

            card_three_description?.trim() ||
              null,

            card_three_link?.trim() ||
              null,

            active,
          ]
        );

      const [rows] =
        await pool.query(
          `
          SELECT *
          FROM home_welcome
          WHERE id = ?
          `,
          [result.insertId]
        );

      return res.status(201).json({
        success: true,
        message:
          "Home welcome created successfully",
        data: rows[0],
      });
    } catch (error) {
      console.error(
        "CREATE home welcome error:",
        error
      );

      // Remove newly uploaded files
      if (
        req.files?.principal_photo?.[0]
      ) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.files.principal_photo[0].filename}`
        );
      }

      if (
        req.files
          ?.principal_profile_pdf?.[0]
      ) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.files.principal_profile_pdf[0].filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create home welcome",
        error: error.message,
      });
    }
  }
);

// =========================================================
// UPDATE FULL HOME WELCOME
//
// PUT /api/home-welcome/:id
//
// Supports:
// - Principal Photo
// - Principal Profile PDF
// =========================================================

router.put(
  "/:id",
  upload.fields([
    {
      name: "principal_photo",
      maxCount: 1,
    },
    {
      name: "principal_profile_pdf",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // ====================================================
      // CHECK RECORD
      // ====================================================

      const [existingRows] =
        await pool.query(
          `
          SELECT *
          FROM home_welcome
          WHERE id = ?
          `,
          [id]
        );

      if (!existingRows.length) {
        return res.status(404).json({
          success: false,
          message:
            "Home welcome record not found",
        });
      }

      const existing =
        existingRows[0];

      // ====================================================
      // BODY
      // ====================================================

      const {
        welcome_title,

        principal_name,
        principal_designation,
        principal_message,

        principal_profile_button_text,

        card_one_title,
        card_one_description,
        card_one_link,

        card_two_title,
        card_two_description,
        card_two_link,

        card_three_title,
        card_three_description,
        card_three_link,

        is_active,

        existing_principal_photo,
        existing_principal_profile_pdf,
      } = req.body;

      if (!welcome_title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Welcome title is required",
        });
      }

      // ====================================================
      // NEW PHOTO
      // ====================================================

      const photoFile =
        req.files?.principal_photo?.[0];

      let principalPhoto;

      if (photoFile) {
        principalPhoto =
          `/uploads/home-welcome/${photoFile.filename}`;
      } else {
        principalPhoto =
          existing_principal_photo !==
          undefined
            ? existing_principal_photo ||
              null
            : existing.principal_photo ||
              null;
      }

      // ====================================================
      // NEW PDF
      // ====================================================

      const pdfFile =
        req.files
          ?.principal_profile_pdf?.[0];

      let principalPdf;

      if (pdfFile) {
        principalPdf =
          `/uploads/home-welcome/${pdfFile.filename}`;
      } else {
        principalPdf =
          existing_principal_profile_pdf !==
          undefined
            ? existing_principal_profile_pdf ||
              null
            : existing.principal_profile_pdf ||
              null;
      }

      // ====================================================
      // ACTIVE
      // ====================================================

      const active =
        Number(is_active ?? 1) === 1
          ? 1
          : 0;

      if (active === 1) {
        await pool.query(
          `
          UPDATE home_welcome

          SET is_active = 0

          WHERE id != ?
          `,
          [id]
        );
      }

      // ====================================================
      // UPDATE
      // ====================================================

      const [result] =
        await pool.query(
          `
          UPDATE home_welcome

          SET
            welcome_title = ?,

            principal_name = ?,
            principal_designation = ?,
            principal_photo = ?,
            principal_message = ?,

            principal_profile_pdf = ?,
            principal_profile_button_text = ?,

            card_one_title = ?,
            card_one_description = ?,
            card_one_link = ?,

            card_two_title = ?,
            card_two_description = ?,
            card_two_link = ?,

            card_three_title = ?,
            card_three_description = ?,
            card_three_link = ?,

            is_active = ?

          WHERE id = ?
          `,
          [
            welcome_title.trim(),

            principal_name?.trim() ||
              null,

            principal_designation?.trim() ||
              null,

            principalPhoto,

            principal_message?.trim() ||
              null,

            principalPdf,

            principal_profile_button_text?.trim() ||
              "View Profile",

            card_one_title?.trim() ||
              null,

            card_one_description?.trim() ||
              null,

            card_one_link?.trim() ||
              null,

            card_two_title?.trim() ||
              null,

            card_two_description?.trim() ||
              null,

            card_two_link?.trim() ||
              null,

            card_three_title?.trim() ||
              null,

            card_three_description?.trim() ||
              null,

            card_three_link?.trim() ||
              null,

            active,

            id,
          ]
        );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message:
            "Home welcome record not found",
        });
      }

      // ====================================================
      // DELETE OLD PHOTO
      // ====================================================

      if (
        photoFile &&
        existing.principal_photo &&
        existing.principal_photo !==
          principalPhoto
      ) {
        deleteUploadedFile(
          existing.principal_photo
        );
      }

      // ====================================================
      // DELETE OLD PDF
      // ====================================================

      if (
        pdfFile &&
        existing.principal_profile_pdf &&
        existing.principal_profile_pdf !==
          principalPdf
      ) {
        deleteUploadedFile(
          existing.principal_profile_pdf
        );
      }

      // ====================================================
      // RETURN UPDATED RECORD
      // ====================================================

      const [rows] =
        await pool.query(
          `
          SELECT *
          FROM home_welcome
          WHERE id = ?
          `,
          [id]
        );

      return res.json({
        success: true,

        message:
          "Home welcome updated successfully",

        data: rows[0],
      });
    } catch (error) {
      console.error(
        "UPDATE home welcome error:",
        error
      );

      // Delete newly uploaded files if update fails
      if (
        req.files?.principal_photo?.[0]
      ) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.files.principal_photo[0].filename}`
        );
      }

      if (
        req.files
          ?.principal_profile_pdf?.[0]
      ) {
        deleteUploadedFile(
          `/uploads/home-welcome/${req.files.principal_profile_pdf[0].filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update home welcome",
        error: error.message,
      });
    }
  }
);

// =========================================================
// DELETE
//
// DELETE /api/home-welcome/:id
// =========================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] =
      await pool.query(
        `
        SELECT
          principal_photo,
          principal_profile_pdf

        FROM home_welcome

        WHERE id = ?
        `,
        [id]
      );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message:
          "Home welcome record not found",
      });
    }

    const oldPhoto =
      rows[0].principal_photo;

    const oldPdf =
      rows[0].principal_profile_pdf;

    const [result] =
      await pool.query(
        `
        DELETE FROM home_welcome

        WHERE id = ?
        `,
        [id]
      );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message:
          "Home welcome record not found",
      });
    }

    deleteUploadedFile(oldPhoto);
    deleteUploadedFile(oldPdf);

    return res.json({
      success: true,
      message:
        "Home welcome deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE home welcome error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete home welcome",
      error: error.message,
    });
  }
});

// =========================================================
// MULTER ERROR HANDLER
// =========================================================

router.use(
  (error, req, res, next) => {
    if (
      error instanceof multer.MulterError
    ) {
      console.error(
        "Multer error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.code ===
          "LIMIT_FILE_SIZE"
            ? "Uploaded file is too large. Maximum size is 10 MB."
            : error.message,
      });
    }

    if (error) {
      console.error(
        "Home welcome upload error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "File upload failed",
      });
    }

    next();
  }
);

export default router;