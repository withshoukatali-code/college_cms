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

const uploadDir = path.join(__dirname, "../uploads/naac");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================================================
   MULTER CONFIGURATION
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    cb(
      null,
      `${Date.now()}-${baseName}${extension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (extension !== ".pdf") {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});

/* =========================================================
   HELPERS
========================================================= */

const makeSlug = (title) => {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};

const deleteFileIfExists = (fileUrl) => {
  if (!fileUrl) return;

  const cleanPath = String(fileUrl).replace(/^\/+/, "");

  const filePath = path.join(
    __dirname,
    "..",
    cleanPath
  );

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(
        "Unable to delete file:",
        error.message
      );
    }
  }
};

/* =========================================================
   GET ALL ACTIVE CRITERIA
   GET /api/naac/criteria

   ORDER:
   Criterion 1
   Criterion 2
   Criterion 3
   ...
   Criterion 8
   Criterion 9
========================================================= */

router.get("/criteria", async (req, res) => {
  try {
    const [criteria] = await db.query(`
      SELECT
        id,
        criterion_number,
        slug,
        title,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM naac_criteria
      WHERE is_active = 1
      ORDER BY
        criterion_number ASC,
        id ASC
    `);

    return res.json({
      success: true,
      criteria,
    });
  } catch (error) {
    console.error(
      "GET NAAC CRITERIA ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load NAAC criteria",
      error: error.message,
    });
  }
});

/* =========================================================
   GET SINGLE CRITERION BY SLUG
   GET /api/naac/criteria/:slug

   Example:
   /api/naac/criteria/research-for-the-light-with-nasa
========================================================= */

router.get("/criteria/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Criterion slug is required",
      });
    }

    /* -----------------------------------------------------
       CRITERION
    ----------------------------------------------------- */

    const [criteria] = await db.query(
      `
      SELECT
        id,
        criterion_number,
        slug,
        title,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM naac_criteria
      WHERE slug = ?
        AND is_active = 1
      LIMIT 1
      `,
      [slug]
    );

    if (!criteria.length) {
      return res.status(404).json({
        success: false,
        message: "NAAC criterion not found",
      });
    }

    const criterion = criteria[0];

    /* -----------------------------------------------------
       SUBCRITERIA

       Actual table has:
       id
       criterion_id
       code
       title
       content
       display_order
       is_active

       NO created_at
       NO updated_at
    ----------------------------------------------------- */

    const [subcriteria] = await db.query(
      `
      SELECT
        id,
        criterion_id,
        code,
        title,
        content,
        display_order,
        is_active
      FROM naac_subcriteria
      WHERE criterion_id = ?
        AND is_active = 1
      ORDER BY
        display_order ASC,
        id ASC
      `,
      [criterion.id]
    );

    /* -----------------------------------------------------
       DOCUMENTS

       Actual table has:
       id
       subcriterion_id
       title
       file_url
       file_name
       display_order
       is_active
       created_at

       NO updated_at
    ----------------------------------------------------- */

    for (const subcriterion of subcriteria) {
      const [documents] = await db.query(
        `
        SELECT
          id,
          subcriterion_id,
          title,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM naac_documents
        WHERE subcriterion_id = ?
          AND is_active = 1
        ORDER BY
          display_order ASC,
          id ASC
        `,
        [subcriterion.id]
      );

      subcriterion.documents = documents;
    }

    return res.json({
      success: true,
      criterion,
      subcriteria,
    });
  } catch (error) {
    console.error(
      "GET NAAC CRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load criterion",
      error: error.message,
    });
  }
});

/* =========================================================
   CREATE CRITERION
   POST /api/naac/criteria
========================================================= */

router.post("/criteria", async (req, res) => {
  try {
    const {
      criterion_number,
      title,
      slug,
      description,
      display_order,
      is_active,
    } = req.body;

    if (
      criterion_number === undefined ||
      criterion_number === null ||
      !String(title || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Criterion number and title are required",
      });
    }

    const finalSlug =
      String(slug || "").trim() ||
      makeSlug(title);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: "Unable to generate criterion slug",
      });
    }

    const [numberExists] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE criterion_number = ?
      LIMIT 1
      `,
      [criterion_number]
    );

    if (numberExists.length) {
      return res.status(409).json({
        success: false,
        message:
          `Criterion number ${criterion_number} already exists`,
      });
    }

    const [slugExists] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE slug = ?
      LIMIT 1
      `,
      [finalSlug]
    );

    if (slugExists.length) {
      return res.status(409).json({
        success: false,
        message: "Criterion slug already exists",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO naac_criteria
      (
        criterion_number,
        slug,
        title,
        description,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        criterion_number,
        finalSlug,
        String(title).trim(),
        description || null,
        display_order ?? 0,
        is_active ?? 1,
      ]
    );

    const [created] = await db.query(
      `
      SELECT
        id,
        criterion_number,
        slug,
        title,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM naac_criteria
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "NAAC criterion created successfully",
      criterion: created[0],
    });
  } catch (error) {
    console.error(
      "CREATE NAAC CRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create NAAC criterion",
      error: error.message,
    });
  }
});

/* =========================================================
   UPDATE CRITERION
   PUT /api/naac/criteria/:id
========================================================= */

router.put("/criteria/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      criterion_number,
      title,
      slug,
      description,
      display_order,
      is_active,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Criterion ID is required",
      });
    }

    if (
      criterion_number === undefined ||
      criterion_number === null ||
      !String(title || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Criterion number and title are required",
      });
    }

    const finalSlug =
      String(slug || "").trim() ||
      makeSlug(title);

    const [existing] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "NAAC criterion not found",
      });
    }

    const [numberExists] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE criterion_number = ?
        AND id <> ?
      LIMIT 1
      `,
      [criterion_number, id]
    );

    if (numberExists.length) {
      return res.status(409).json({
        success: false,
        message:
          `Criterion number ${criterion_number} already exists`,
      });
    }

    const [slugExists] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE slug = ?
        AND id <> ?
      LIMIT 1
      `,
      [finalSlug, id]
    );

    if (slugExists.length) {
      return res.status(409).json({
        success: false,
        message: "Criterion slug already exists",
      });
    }

    await db.query(
      `
      UPDATE naac_criteria
      SET
        criterion_number = ?,
        slug = ?,
        title = ?,
        description = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        criterion_number,
        finalSlug,
        String(title).trim(),
        description || null,
        display_order ?? 0,
        is_active ?? 1,
        id,
      ]
    );

    const [updated] = await db.query(
      `
      SELECT
        id,
        criterion_number,
        slug,
        title,
        description,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM naac_criteria
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "NAAC criterion updated successfully",
      criterion: updated[0],
    });
  } catch (error) {
    console.error(
      "UPDATE NAAC CRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update NAAC criterion",
      error: error.message,
    });
  }
});

/* =========================================================
   DELETE CRITERION
   DELETE /api/naac/criteria/:id
========================================================= */

router.delete("/criteria/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Criterion ID is required",
      });
    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "NAAC criterion not found",
      });
    }

    const [subcriteria] = await db.query(
      `
      SELECT id
      FROM naac_subcriteria
      WHERE criterion_id = ?
      `,
      [id]
    );

    for (const subcriterion of subcriteria) {
      const [documents] = await db.query(
        `
        SELECT file_url
        FROM naac_documents
        WHERE subcriterion_id = ?
        `,
        [subcriterion.id]
      );

      for (const document of documents) {
        deleteFileIfExists(document.file_url);
      }

      await db.query(
        `
        DELETE FROM naac_documents
        WHERE subcriterion_id = ?
        `,
        [subcriterion.id]
      );
    }

    await db.query(
      `
      DELETE FROM naac_subcriteria
      WHERE criterion_id = ?
      `,
      [id]
    );

    await db.query(
      `
      DELETE FROM naac_criteria
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "NAAC criterion deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE NAAC CRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete NAAC criterion",
      error: error.message,
    });
  }
});

/* =========================================================
   CREATE SUBCRITERION
   POST /api/naac/subcriteria
========================================================= */

router.post("/subcriteria", async (req, res) => {
  try {
    const {
      criterion_id,
      code,
      title,
      content,
      display_order,
      is_active,
    } = req.body;

    if (
      !criterion_id ||
      !String(code || "").trim() ||
      !String(title || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Criterion, code and title are required",
      });
    }

    const [criterion] = await db.query(
      `
      SELECT id
      FROM naac_criteria
      WHERE id = ?
      LIMIT 1
      `,
      [criterion_id]
    );

    if (!criterion.length) {
      return res.status(404).json({
        success: false,
        message: "Parent NAAC criterion not found",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO naac_subcriteria
      (
        criterion_id,
        code,
        title,
        content,
        display_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        criterion_id,
        String(code).trim(),
        String(title).trim(),
        content || null,
        display_order ?? 0,
        is_active ?? 1,
      ]
    );

    const [created] = await db.query(
      `
      SELECT
        id,
        criterion_id,
        code,
        title,
        content,
        display_order,
        is_active
      FROM naac_subcriteria
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Criterion point created successfully",
      subcriterion: created[0],
    });
  } catch (error) {
    console.error(
      "CREATE SUBCRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create criterion point",
      error: error.message,
    });
  }
});

/* =========================================================
   UPDATE SUBCRITERION
   PUT /api/naac/subcriteria/:id
========================================================= */

router.put("/subcriteria/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      criterion_id,
      code,
      title,
      content,
      display_order,
      is_active,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subcriterion ID is required",
      });
    }

    if (
      !criterion_id ||
      !String(code || "").trim() ||
      !String(title || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Criterion, code and title are required",
      });
    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM naac_subcriteria
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Criterion point not found",
      });
    }

    await db.query(
      `
      UPDATE naac_subcriteria
      SET
        criterion_id = ?,
        code = ?,
        title = ?,
        content = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        criterion_id,
        String(code).trim(),
        String(title).trim(),
        content || null,
        display_order ?? 0,
        is_active ?? 1,
        id,
      ]
    );

    const [updated] = await db.query(
      `
      SELECT
        id,
        criterion_id,
        code,
        title,
        content,
        display_order,
        is_active
      FROM naac_subcriteria
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      success: true,
      message: "Criterion point updated successfully",
      subcriterion: updated[0],
    });
  } catch (error) {
    console.error(
      "UPDATE SUBCRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update criterion point",
      error: error.message,
    });
  }
});

/* =========================================================
   DELETE SUBCRITERION
   DELETE /api/naac/subcriteria/:id
========================================================= */

router.delete("/subcriteria/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subcriterion ID is required",
      });
    }

    const [documents] = await db.query(
      `
      SELECT file_url
      FROM naac_documents
      WHERE subcriterion_id = ?
      `,
      [id]
    );

    for (const document of documents) {
      deleteFileIfExists(document.file_url);
    }

    await db.query(
      `
      DELETE FROM naac_documents
      WHERE subcriterion_id = ?
      `,
      [id]
    );

    const [result] = await db.query(
      `
      DELETE FROM naac_subcriteria
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Criterion point not found",
      });
    }

    return res.json({
      success: true,
      message: "Criterion point deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE SUBCRITERION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete criterion point",
      error: error.message,
    });
  }
});

/* =========================================================
   CREATE DOCUMENT
   POST /api/naac/documents
========================================================= */

router.post(
  "/documents",
  upload.single("document"),
  async (req, res) => {
    try {
      const {
        subcriterion_id,
        title,
        display_order,
        is_active,
      } = req.body;

      if (!subcriterion_id) {
        if (req.file) {
          deleteFileIfExists(
            `/uploads/naac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Subcriterion ID is required",
        });
      }

      if (!String(title || "").trim()) {
        if (req.file) {
          deleteFileIfExists(
            `/uploads/naac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Document title is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "PDF document is required",
        });
      }

      const [subcriterion] = await db.query(
        `
        SELECT id
        FROM naac_subcriteria
        WHERE id = ?
        LIMIT 1
        `,
        [subcriterion_id]
      );

      if (!subcriterion.length) {
        deleteFileIfExists(
          `/uploads/naac/${req.file.filename}`
        );

        return res.status(404).json({
          success: false,
          message: "Criterion point not found",
        });
      }

      const fileUrl =
        `/uploads/naac/${req.file.filename}`;

      const [result] = await db.query(
        `
        INSERT INTO naac_documents
        (
          subcriterion_id,
          title,
          file_url,
          file_name,
          display_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          subcriterion_id,
          String(title).trim(),
          fileUrl,
          req.file.originalname,
          display_order ?? 0,
          is_active ?? 1,
        ]
      );

      const [created] = await db.query(
        `
        SELECT
          id,
          subcriterion_id,
          title,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM naac_documents
        WHERE id = ?
        `,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message:
          "NAAC document uploaded successfully",
        document: created[0],
      });
    } catch (error) {
      if (req.file) {
        deleteFileIfExists(
          `/uploads/naac/${req.file.filename}`
        );
      }

      console.error(
        "CREATE NAAC DOCUMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to upload NAAC document",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   UPDATE DOCUMENT
   PUT /api/naac/documents/:id
========================================================= */

router.put(
  "/documents/:id",
  upload.single("document"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        subcriterion_id,
        title,
        display_order,
        is_active,
      } = req.body;

      if (!id) {
        if (req.file) {
          deleteFileIfExists(
            `/uploads/naac/${req.file.filename}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Document ID is required",
        });
      }

      const [existingRows] = await db.query(
        `
        SELECT
          id,
          subcriterion_id,
          title,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM naac_documents
        WHERE id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!existingRows.length) {
        if (req.file) {
          deleteFileIfExists(
            `/uploads/naac/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message: "NAAC document not found",
        });
      }

      const existing = existingRows[0];

      const finalSubcriterionId =
        subcriterion_id ||
        existing.subcriterion_id;

      const finalTitle =
        String(title || "").trim() ||
        existing.title;

      const [subcriterion] = await db.query(
        `
        SELECT id
        FROM naac_subcriteria
        WHERE id = ?
        LIMIT 1
        `,
        [finalSubcriterionId]
      );

      if (!subcriterion.length) {
        if (req.file) {
          deleteFileIfExists(
            `/uploads/naac/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message: "Criterion point not found",
        });
      }

      let finalFileUrl = existing.file_url;
      let finalFileName = existing.file_name;

      if (req.file) {
        finalFileUrl =
          `/uploads/naac/${req.file.filename}`;

        finalFileName =
          req.file.originalname;
      }

      await db.query(
        `
        UPDATE naac_documents
        SET
          subcriterion_id = ?,
          title = ?,
          file_url = ?,
          file_name = ?,
          display_order = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          finalSubcriterionId,
          finalTitle,
          finalFileUrl,
          finalFileName,
          display_order ??
            existing.display_order ??
            0,
          is_active ??
            existing.is_active ??
            1,
          id,
        ]
      );

      if (
        req.file &&
        existing.file_url &&
        existing.file_url !== finalFileUrl
      ) {
        deleteFileIfExists(existing.file_url);
      }

      const [updated] = await db.query(
        `
        SELECT
          id,
          subcriterion_id,
          title,
          file_url,
          file_name,
          display_order,
          is_active,
          created_at
        FROM naac_documents
        WHERE id = ?
        `,
        [id]
      );

      return res.json({
        success: true,
        message:
          "NAAC document updated successfully",
        document: updated[0],
      });
    } catch (error) {
      if (req.file) {
        deleteFileIfExists(
          `/uploads/naac/${req.file.filename}`
        );
      }

      console.error(
        "UPDATE NAAC DOCUMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to update NAAC document",
        error: error.message,
      });
    }
  }
);

/* =========================================================
   DELETE DOCUMENT
   DELETE /api/naac/documents/:id
========================================================= */

router.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required",
      });
    }

    const [documents] = await db.query(
      `
      SELECT
        id,
        file_url
      FROM naac_documents
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!documents.length) {
      return res.status(404).json({
        success: false,
        message: "NAAC document not found",
      });
    }

    deleteFileIfExists(
      documents[0].file_url
    );

    await db.query(
      `
      DELETE FROM naac_documents
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      success: true,
      message:
        "NAAC document deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE NAAC DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete NAAC document",
      error: error.message,
    });
  }
});

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message || "Request failed",
    });
  }

  next();
});

export default router;