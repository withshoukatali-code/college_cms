import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import db from "../config/db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   UPLOAD DIRECTORY
========================================================= */

const uploadDir = path.join(
  __dirname,
  "../uploads/best-practices"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
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
    fileSize: 20 * 1024 * 1024,
  },
});

/* =========================================================
   HELPER
========================================================= */

const buildFileUrl = (req, fileUrl) => {
  if (!fileUrl) return null;

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
  ) {
    return fileUrl;
  }

  return `${req.protocol}://${req.get("host")}${
    fileUrl.startsWith("/") ? "" : "/"
  }${fileUrl}`;
};

/* =========================================================
   GET ALL YEARS
   IMPORTANT:
   This route must come before /:id
========================================================= */

router.get("/years", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT academic_year
      FROM best_practices
      WHERE is_active = 1
      ORDER BY academic_year DESC
    `);

    return res.json({
      success: true,
      data: rows.map((row) => row.academic_year),
    });
  } catch (error) {
    console.error(
      "GET BEST PRACTICE YEARS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch academic years",
      error: error.message,
    });
  }
});

/* =========================================================
   GET ALL BEST PRACTICES
========================================================= */

router.get("/", async (req, res) => {
  try {
    const { academic_year } = req.query;

    let sql = `
      SELECT
        id,
        academic_year,
        practice_number,
        title,
        short_description,
        objectives,
        context,
        practice,
        activities,
        outcomes_impact,
        evidence_of_success,
        problems_encountered,
        resources_required,
        beneficiaries,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM best_practices
      WHERE is_active = 1
    `;

    const params = [];

    if (academic_year) {
      sql += `
        AND academic_year = ?
      `;

      params.push(academic_year);
    }

    sql += `
      ORDER BY
        academic_year DESC,
        display_order ASC,
        practice_number ASC,
        id ASC
    `;

    const [practices] = await db.query(
      sql,
      params
    );

    /* =====================================================
       LOAD ACTIVITIES, PHOTOS AND DOCUMENTS
       FOR EACH BEST PRACTICE
    ===================================================== */

    for (const practice of practices) {
      /* ---------------------------------------------------
         ACTIVITIES
      --------------------------------------------------- */

      const [activities] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_title,
          description,
          activity_date,
          participants,
          beneficiary_group,
          outcomes,
          display_order,
          is_active,
          created_at
        FROM best_practice_activities
        WHERE best_practice_id = ?
          AND is_active = 1
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [practice.id]
      );

      /* ---------------------------------------------------
         PHOTOS
      --------------------------------------------------- */

      const [photos] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_id,
          image_url,
          image_title,
          caption,
          display_order,
          is_active,
          created_at
        FROM best_practice_photos
        WHERE best_practice_id = ?
          AND is_active = 1
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [practice.id]
      );

      /* ---------------------------------------------------
         DOCUMENTS
      --------------------------------------------------- */

      const [documents] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_id,
          title,
          document_type,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM best_practice_documents
        WHERE best_practice_id = ?
          AND is_active = 1
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [practice.id]
      );

      /* ---------------------------------------------------
         ATTACH RELATED DATA
      --------------------------------------------------- */

      practice.activityItems = activities;

      practice.photoItems = photos.map(
        (photo) => ({
          ...photo,
          image_url: buildFileUrl(
            req,
            photo.image_url
          ),
        })
      );

      practice.documentItems =
        documents.map((document) => ({
          ...document,
          file_url: buildFileUrl(
            req,
            document.file_url
          ),
        }));
    }

    return res.json({
      success: true,
      data: practices,
    });
  } catch (error) {
    console.error(
      "GET BEST PRACTICES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch best practices",
      error: error.message,
    });
  }
});

/* =========================================================
   GET SINGLE BEST PRACTICE
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [practices] = await db.query(
      `
      SELECT
        id,
        academic_year,
        practice_number,
        title,
        short_description,
        objectives,
        context,
        practice,
        activities,
        outcomes_impact,
        evidence_of_success,
        problems_encountered,
        resources_required,
        beneficiaries,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM best_practices
      WHERE id = ?
      `,
      [id]
    );

    if (!practices.length) {
      return res.status(404).json({
        success: false,
        message: "Best practice not found",
      });
    }

    const practice = practices[0];

    /* ---------------------------------------------------
       ACTIVITIES
    --------------------------------------------------- */

    const [activities] = await db.query(
      `
      SELECT
        id,
        best_practice_id,
        activity_title,
        description,
        activity_date,
        participants,
        beneficiary_group,
        outcomes,
        display_order,
        is_active,
        created_at
      FROM best_practice_activities
      WHERE best_practice_id = ?
      ORDER BY
        display_order ASC,
        id ASC
      `,
      [id]
    );

    /* ---------------------------------------------------
       PHOTOS
    --------------------------------------------------- */

    const [photos] = await db.query(
      `
      SELECT
        id,
        best_practice_id,
        activity_id,
        image_url,
        image_title,
        caption,
        display_order,
        is_active,
        created_at
      FROM best_practice_photos
      WHERE best_practice_id = ?
      ORDER BY
        display_order ASC,
        id ASC
      `,
      [id]
    );

    /* ---------------------------------------------------
       DOCUMENTS
    --------------------------------------------------- */

    const [documents] = await db.query(
      `
      SELECT
        id,
        best_practice_id,
        activity_id,
        title,
        document_type,
        file_url,
        file_name,
        display_order,
        is_active,
        created_at
      FROM best_practice_documents
      WHERE best_practice_id = ?
      ORDER BY
        display_order ASC,
        id ASC
      `,
      [id]
    );

    /* ---------------------------------------------------
       ATTACH RELATED DATA
    --------------------------------------------------- */

    practice.activityItems = activities;

    practice.photoItems = photos.map(
      (photo) => ({
        ...photo,
        image_url: buildFileUrl(
          req,
          photo.image_url
        ),
      })
    );

    practice.documentItems =
      documents.map((document) => ({
        ...document,
        file_url: buildFileUrl(
          req,
          document.file_url
        ),
      }));

    return res.json({
      success: true,
      data: practice,
    });
  } catch (error) {
    console.error(
      "GET BEST PRACTICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch best practice",
      error: error.message,
    });
  }
});

/* =========================================================
   CREATE BEST PRACTICE
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      academic_year,
      practice_number,
      title,
      short_description,
      objectives,
      context,
      practice,
      activities,
      outcomes_impact,
      evidence_of_success,
      problems_encountered,
      resources_required,
      beneficiaries,
      display_order,
      is_active,
    } = req.body;

    if (!academic_year || !title) {
      return res.status(400).json({
        success: false,
        message:
          "Academic year and title are required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO best_practices (
        academic_year,
        practice_number,
        title,
        short_description,
        objectives,
        context,
        practice,
        activities,
        outcomes_impact,
        evidence_of_success,
        problems_encountered,
        resources_required,
        beneficiaries,
        display_order,
        is_active
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      `,
      [
        academic_year,
        practice_number || 1,
        title,
        short_description || null,
        objectives || null,
        context || null,
        practice || null,
        activities || null,
        outcomes_impact || null,
        evidence_of_success || null,
        problems_encountered || null,
        resources_required || null,
        beneficiaries || null,
        display_order || 1,
        is_active === undefined
          ? 1
          : is_active,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Best practice created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(
      "CREATE BEST PRACTICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create best practice",
      error: error.message,
    });
  }
});

/* =========================================================
   UPDATE BEST PRACTICE
========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      academic_year,
      practice_number,
      title,
      short_description,
      objectives,
      context,
      practice,
      activities,
      outcomes_impact,
      evidence_of_success,
      problems_encountered,
      resources_required,
      beneficiaries,
      display_order,
      is_active,
    } = req.body;

    if (!academic_year || !title) {
      return res.status(400).json({
        success: false,
        message:
          "Academic year and title are required",
      });
    }

    const [result] = await db.query(
      `
      UPDATE best_practices
      SET
        academic_year = ?,
        practice_number = ?,
        title = ?,
        short_description = ?,
        objectives = ?,
        context = ?,
        practice = ?,
        activities = ?,
        outcomes_impact = ?,
        evidence_of_success = ?,
        problems_encountered = ?,
        resources_required = ?,
        beneficiaries = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        academic_year,
        practice_number || 1,
        title,
        short_description || null,
        objectives || null,
        context || null,
        practice || null,
        activities || null,
        outcomes_impact || null,
        evidence_of_success || null,
        problems_encountered || null,
        resources_required || null,
        beneficiaries || null,
        display_order || 1,
        is_active === undefined
          ? 1
          : is_active,
        id,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Best practice not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Best practice updated successfully",
    });
  } catch (error) {
    console.error(
      "UPDATE BEST PRACTICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update best practice",
      error: error.message,
    });
  }
});

/* =========================================================
   DELETE BEST PRACTICE
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `
      DELETE FROM best_practices
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Best practice not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Best practice deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE BEST PRACTICE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete best practice",
      error: error.message,
    });
  }
});

/* =========================================================
   ACTIVITIES
========================================================= */

/* ---------------------------------------------------------
   GET ACTIVITIES
--------------------------------------------------------- */

router.get(
  "/:id/activities",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_title,
          description,
          activity_date,
          participants,
          beneficiary_group,
          outcomes,
          display_order,
          is_active,
          created_at
        FROM best_practice_activities
        WHERE best_practice_id = ?
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [id]
      );

      return res.json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.error(
        "GET ACTIVITIES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch activities",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   CREATE ACTIVITY
--------------------------------------------------------- */

router.post(
  "/:id/activities",
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        activity_title,
        description,
        activity_date,
        participants,
        beneficiary_group,
        outcomes,
        display_order,
        is_active,
      } = req.body;

      if (!activity_title) {
        return res.status(400).json({
          success: false,
          message:
            "Activity title is required",
        });
      }

      const [result] = await db.query(
        `
        INSERT INTO best_practice_activities (
          best_practice_id,
          activity_title,
          description,
          activity_date,
          participants,
          beneficiary_group,
          outcomes,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          activity_title,
          description || null,
          activity_date || null,
          participants || null,
          beneficiary_group || null,
          outcomes || null,
          display_order || 1,
          is_active === undefined
            ? 1
            : is_active,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Activity added successfully",
        id: result.insertId,
      });
    } catch (error) {
      console.error(
        "CREATE ACTIVITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to create activity",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   UPDATE ACTIVITY
--------------------------------------------------------- */

router.put(
  "/:id/activities/:activityId",
  async (req, res) => {
    try {
      const {
        id,
        activityId,
      } = req.params;

      const {
        activity_title,
        description,
        activity_date,
        participants,
        beneficiary_group,
        outcomes,
        display_order,
        is_active,
      } = req.body;

      if (!activity_title) {
        return res.status(400).json({
          success: false,
          message:
            "Activity title is required",
        });
      }

      const [result] = await db.query(
        `
        UPDATE best_practice_activities
        SET
          activity_title = ?,
          description = ?,
          activity_date = ?,
          participants = ?,
          beneficiary_group = ?,
          outcomes = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [
          activity_title,
          description || null,
          activity_date || null,
          participants || null,
          beneficiary_group || null,
          outcomes || null,
          display_order || 1,
          is_active === undefined
            ? 1
            : is_active,
          activityId,
          id,
        ]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Activity not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Activity updated successfully",
      });
    } catch (error) {
      console.error(
        "UPDATE ACTIVITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update activity",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   DELETE ACTIVITY
--------------------------------------------------------- */

router.delete(
  "/:id/activities/:activityId",
  async (req, res) => {
    try {
      const {
        id,
        activityId,
      } = req.params;

      const [result] = await db.query(
        `
        DELETE FROM best_practice_activities
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [activityId, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: "Activity not found",
        });
      }

      return res.json({
        success: true,
        message:
          "Activity deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE ACTIVITY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete activity",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   PHOTOS
========================================================= */

/* ---------------------------------------------------------
   GET PHOTOS
--------------------------------------------------------- */

router.get(
  "/:id/photos",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_id,
          image_url,
          image_title,
          caption,
          display_order,
          is_active,
          created_at
        FROM best_practice_photos
        WHERE best_practice_id = ?
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [id]
      );

      const data = rows.map(
        (row) => ({
          ...row,
          image_url: buildFileUrl(
            req,
            row.image_url
          ),
        })
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "GET PHOTOS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch photos",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   UPLOAD PHOTO
--------------------------------------------------------- */

router.post(
  "/:id/photos",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      const {
        activity_id,
        image_title,
        caption,
        display_order,
        is_active,
      } = req.body;

      const imageUrl =
        `/uploads/best-practices/${req.file.filename}`;

      const [result] = await db.query(
        `
        INSERT INTO best_practice_photos (
          best_practice_id,
          activity_id,
          image_url,
          image_title,
          caption,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          activity_id || null,
          imageUrl,
          image_title || null,
          caption || null,
          display_order || 1,
          is_active === undefined
            ? 1
            : is_active,
        ]
      );

      return res.status(201).json({
        success: true,
        message:
          "Photo uploaded successfully",
        id: result.insertId,
        image_url: buildFileUrl(
          req,
          imageUrl
        ),
      });
    } catch (error) {
      console.error(
        "UPLOAD PHOTO ERROR:",
        error
      );

      if (req.file) {
        const filePath = path.join(
          uploadDir,
          req.file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to upload photo",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   DELETE PHOTO
--------------------------------------------------------- */

router.delete(
  "/:id/photos/:photoId",
  async (req, res) => {
    try {
      const {
        id,
        photoId,
      } = req.params;

      const [rows] = await db.query(
        `
        SELECT image_url
        FROM best_practice_photos
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [photoId, id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Photo not found",
        });
      }

      const imageUrl =
        rows[0].image_url;

      const [result] = await db.query(
        `
        DELETE FROM best_practice_photos
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [photoId, id]
      );

      if (
        imageUrl &&
        imageUrl.startsWith(
          "/uploads/"
        )
      ) {
        const filePath = path.join(
          __dirname,
          "..",
          imageUrl
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.json({
        success: true,
        message:
          "Photo deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE PHOTO ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete photo",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   DOCUMENTS
========================================================= */

/* ---------------------------------------------------------
   GET DOCUMENTS
--------------------------------------------------------- */

router.get(
  "/:id/documents",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        `
        SELECT
          id,
          best_practice_id,
          activity_id,
          title,
          document_type,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM best_practice_documents
        WHERE best_practice_id = ?
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [id]
      );

      const data = rows.map(
        (row) => ({
          ...row,
          file_url: buildFileUrl(
            req,
            row.file_url
          ),
        })
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "GET DOCUMENTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch documents",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   UPLOAD DOCUMENT
--------------------------------------------------------- */

router.post(
  "/:id/documents",
  upload.single("document"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document is required",
        });
      }

      const {
        activity_id,
        title,
        document_type,
        display_order,
        is_active,
      } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message:
            "Document title is required",
        });
      }

      const fileUrl =
        `/uploads/best-practices/${req.file.filename}`;

      const [result] = await db.query(
        `
        INSERT INTO best_practice_documents (
          best_practice_id,
          activity_id,
          title,
          document_type,
          file_url,
          file_name,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          activity_id || null,
          title,
          document_type || "Evidence",
          fileUrl,
          req.file.originalname,
          display_order || 1,
          is_active === undefined
            ? 1
            : is_active,
        ]
      );

      return res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully",
        id: result.insertId,
        file_url: buildFileUrl(
          req,
          fileUrl
        ),
      });
    } catch (error) {
      console.error(
        "UPLOAD DOCUMENT ERROR:",
        error
      );

      if (req.file) {
        const filePath = path.join(
          uploadDir,
          req.file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to upload document",
        error: error.message,
      });
    }
  }
);

/* ---------------------------------------------------------
   DELETE DOCUMENT
--------------------------------------------------------- */

router.delete(
  "/:id/documents/:documentId",
  async (req, res) => {
    try {
      const {
        id,
        documentId,
      } = req.params;

      const [rows] = await db.query(
        `
        SELECT file_url
        FROM best_practice_documents
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [documentId, id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      const fileUrl =
        rows[0].file_url;

      const [result] = await db.query(
        `
        DELETE FROM best_practice_documents
        WHERE id = ?
          AND best_practice_id = ?
        `,
        [documentId, id]
      );

      if (
        fileUrl &&
        fileUrl.startsWith(
          "/uploads/"
        )
      ) {
        const filePath = path.join(
          __dirname,
          "..",
          fileUrl
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.json({
        success: true,
        message:
          "Document deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete document",
        error: error.message,
      });
    }
  }
);

export default router;