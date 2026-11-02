import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import pool from "../config/db.js";

const router = express.Router();

const eventsDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "events"
);

fs.mkdirSync(eventsDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, eventsDirectory);
    },

    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();

      callback(
        null,
        `event-${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${extension}`
      );
    },
  }),

  limits: {
    fileSize: 3 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image files are allowed."));
  },
});

const cleanText = (value) => {
  if (!value || !value.trim()) return null;

  return value.trim();
};

const removeImage = async (imageUrl) => {
  if (!imageUrl?.startsWith("/uploads/events/")) return;

  try {
    await fs.promises.unlink(
      path.join(eventsDirectory, path.basename(imageUrl))
    );
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to remove event image:", error);
    }
  }
};

const selectFields = `
  id,
  title,
  category,
  description,
  event_date,
  image_url,
  button_text,
  button_link,
  display_order,
  is_active,
  created_at,
  updated_at
`;

/*
|--------------------------------------------------------------------------
| PUBLIC EVENTS
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ${selectFields}
      FROM home_events
      WHERE is_active = 1
      ORDER BY display_order ASC, event_date ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home events.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN EVENTS
|--------------------------------------------------------------------------
*/

router.get("/admin", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ${selectFields}
      FROM home_events
      ORDER BY display_order ASC, event_date ASC, id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch home events.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CREATE EVENT
|--------------------------------------------------------------------------
*/

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      event_date,
      image_url,
      button_text,
      button_link,
      display_order,
      is_active,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event title is required.",
      });
    }

    const savedImageUrl = req.file
      ? `/uploads/events/${req.file.filename}`
      : cleanText(image_url);

    const [result] = await pool.query(
      `
      INSERT INTO home_events
      (
        title, category, description, event_date, image_url,
        button_text, button_link, display_order, is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title.trim(),
        cleanText(category),
        cleanText(description),
        event_date || null,
        savedImageUrl,
        cleanText(button_text),
        cleanText(button_link),
        Number(display_order) || 0,
        Number(is_active) === 1 ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `SELECT ${selectFields} FROM home_events WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: rows[0],
    });
  } catch (error) {
    if (req.file) {
      await removeImage(`/uploads/events/${req.file.filename}`);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create home event.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE EVENT
|--------------------------------------------------------------------------
*/

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      category,
      description,
      event_date,
      image_url,
      remove_image,
      button_text,
      button_link,
      display_order,
      is_active,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event title is required.",
      });
    }

    const [existingRows] = await pool.query(
      `SELECT id, image_url FROM home_events WHERE id = ?`,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Home event not found.",
      });
    }

    const existing = existingRows[0];
    let savedImageUrl = existing.image_url;

    if (req.file) {
      savedImageUrl = `/uploads/events/${req.file.filename}`;
    } else if (remove_image === "1") {
      savedImageUrl = null;
    } else if (cleanText(image_url)) {
      savedImageUrl = cleanText(image_url);
    }

    await pool.query(
      `
      UPDATE home_events
      SET
        title = ?,
        category = ?,
        description = ?,
        event_date = ?,
        image_url = ?,
        button_text = ?,
        button_link = ?,
        display_order = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        cleanText(category),
        cleanText(description),
        event_date || null,
        savedImageUrl,
        cleanText(button_text),
        cleanText(button_link),
        Number(display_order) || 0,
        Number(is_active) === 1 ? 1 : 0,
        id,
      ]
    );

    if (existing.image_url !== savedImageUrl) {
      await removeImage(existing.image_url);
    }

    const [rows] = await pool.query(
      `SELECT ${selectFields} FROM home_events WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Event updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update home event.",
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE EVENT
|--------------------------------------------------------------------------
*/

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, image_url FROM home_events WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Home event not found.",
      });
    }

    await pool.query(`DELETE FROM home_events WHERE id = ?`, [id]);
    await removeImage(rows[0].image_url);

    res.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete home event.",
      error: error.message,
    });
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Event image must be smaller than 3 MB."
          : error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Event image upload failed.",
    });
  }

  next();
});

export default router;