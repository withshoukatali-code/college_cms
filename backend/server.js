
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import pool from "./config/db.js";

// ============================================================
// ROUTES
// ============================================================

import heroSliderRoutes from "./routes/heroSliderRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import homeEventsRoutes from "./routes/homeEventsRoutes.js";
import youtubeRoutes from "./routes/YoutubeRoutes.js";
import homePlacementsRoutes from "./routes/homeplacementRoutes.js";
import homeGalleryRoutes from "./routes/homeGalleryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import newsNoticeRoutes from "./routes/newsNoticeRoutes.js";
import breakingNewsRoutes from "./routes/breakingNewsRoutes.js";
import quickLinksRoutes from "./routes/quickLinksRoutes.js";
import homeHeroRoutes from "./routes/homeHeroRoutes.js";
import homeStatisticsRoutes from "./routes/homeStatisticsRoutes.js";
import homeWelcomeRoutes from "./routes/homeWelcomeRoutes.js";
import achievementsRoutes from "./routes/achievementsRoutes.js";
import aboutCollegeRoutes from "./routes/aboutCollegeRoutes.js";
import bottomInstitutionalStripRoutes from "./routes/bottomInstitutionalStripRoute.js";
import footerRoute from "./routes/footerRoutes.js";

import screenReaderRoutes from "./routes/screenReaderRoutes.js";
//======================================
// COLLEGE DEPT
//=======================================

import departmentRoutes from "./routes/department/departmentRoutes.js";
import departmentProgrammeRoutes from "./routes/department/departmentProgrammeRoutes.js";
import departmentProfileRoutes from "./routes/department/departmentProfileRoutes.js";
import departmentFacultyRoutes from "./routes/department/departmentFacultyRoutes.js";
import naacRoutes from "./routes/naacRoutes.js";
import aqarRoutes from "./routes/aqarRoutes.js";
import iqacRoutes from "./routes/iqacRoutes.js";
// ============================================================
// COLLEGE HEADER
// ============================================================

import collegeHeaderRoutes from "./routes/collegeHeaderRoute.js";



//===========================================================
// NAAC
import extensionProfileRoutes from "./routes/extensionProfileRoutes.js";
import criteriaExtensionDocumentsRoutes from "./routes/criteriaExtensionDocumentsRoutes.js";
import bestPracticesRoutes from "./routes/bestPracticesRoutes.js";
import committeeDocumentsRoutes from "./routes/committeeDocumentsRoutes.js";
import managementCommitteesRoutes from "./routes/managementCommitteesRoutes.js";
import sitePagesRoutes from "./routes/sitePagesRoutes.js";
import facilitiesRoutes from "./routes/facilitiesRoutes.js";
import contentDocumentRoutes from "./routes/contentDocumentRoutes.js";
//===========================================================
// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();

// ============================================================
// EXPRESS APP
// ============================================================

const app = express();

const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGINS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ============================================================
// PATHS
// ============================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(
  __dirname,
  "uploads"
);

console.log(
  "Uploads directory:",
  uploadsPath
);

// ============================================================
// CORS
// ============================================================

app.use(
  cors({
    origin: allowedOrigins?.length ? allowedOrigins : true,
    credentials: true,
  })
);

// ============================================================
// BODY PARSERS
// ============================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ============================================================
// STATIC UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ============================================================
// BASIC TEST
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College CMS Backend Running 🚀",
  });
});

// ============================================================
// DATABASE TEST
// ============================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT 1 AS connected"
    );

    res.json({
      success: true,
      message: "MySQL connected successfully",
      database: process.env.DB_NAME,
      result: rows,
    });
  } catch (error) {
    console.error(
      "Database connection error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "MySQL connection failed",
      code: error.code || "",
      error: error.message || "",
    });
  }
});

// ============================================================
// HERO SLIDER
// ============================================================

app.use(
  "/api/hero-slides",
  heroSliderRoutes
);

app.use(
  "/api/hero-slider",
  heroSliderRoutes
);

// ============================================================
// COLLEGE STATISTICS
// ============================================================

app.use(
  "/api/college-statistics",
  statisticsRoutes
);

app.use(
  "/api/home-statistics",
  homeStatisticsRoutes
);

// ============================================================
// HOMEPAGE
// ============================================================

app.use(
  "/api/home-events",
  homeEventsRoutes
);

app.use(
  "/api/home-welcome",
  homeWelcomeRoutes
);

app.use(
  "/api/achievements",
  achievementsRoutes
);


app.use(
  "/api/bottom-institutional-strip",
  bottomInstitutionalStripRoutes
);
// ============================================================
// HOMEPAGE MEDIA / CONTENT
// ============================================================

app.use(
  "/api/youtube",
  youtubeRoutes
);

app.use(
  "/api/home-youtube",
  youtubeRoutes
);

app.use(
  "/api/home-placements",
  homePlacementsRoutes
);

app.use(
  "/api/home-gallery",
  homeGalleryRoutes
);

app.use(
  "/api/quick-links",
  quickLinksRoutes
);

// ============================================================
// NEWS
// ============================================================

app.use(
  "/api/news-notices",
  newsNoticeRoutes
);

app.use(
  "/api/breaking-news",
  breakingNewsRoutes
);

// ============================================================
// SETTINGS / FOOTER
// ============================================================

app.use(
  "/api/settings",
  settingsRoutes
);

app.use("/api/footer", footerRoute);

// ============================================================
// ABOUT COLLEGE
// ============================================================

app.use(
  "/api/about-college",
  aboutCollegeRoutes
);

// ============================================================
// COLLEGE HEADER
// ============================================================
//
// GET:
// /api/college-header
//
// PUT:
// /api/college-header
//
// GET LOGO:
// /api/college-header/logo
//
// GET CAMPUS IMAGE:
// /api/college-header/campus-image
//
// DELETE LOGO:
// /api/college-header/logo
//
// DELETE CAMPUS IMAGE:
// /api/college-header/campus-image
//
// ============================================================

app.use(
  "/api/college-header",
  collegeHeaderRoutes
);

// ============================================================
// HOME HERO
// ============================================================

app.use(
  "/api/home-hero",
  homeHeroRoutes
);

//===========================================================
// NAAC
app.use(  "/api/naac/extension-profile",  extensionProfileRoutes);
app.use(  "/api/naac/extension-documents",  criteriaExtensionDocumentsRoutes);
app.use("/api/naac/aqar", aqarRoutes);
app.use( "/api/naac/best-practices",  bestPracticesRoutes);
app.use("/api/iqac", iqacRoutes);
app.use("/api/committees", committeeDocumentsRoutes);
app.use("/api/management-committees", managementCommitteesRoutes);
app.use("/api/site-pages", sitePagesRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/content-documents", contentDocumentRoutes);

let visitorTableReady;
async function ensureVisitorTable() {
  if (!visitorTableReady) {
    visitorTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS website_visitor_sessions (
        visitor_key VARCHAR(64) PRIMARY KEY,
        first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `).catch((error) => {
      visitorTableReady = null;
      throw error;
    });
  }
  await visitorTableReady;
}

app.post("/api/visitor-count", async (req, res) => {
  try {
    const visitorKey = String(req.body?.visitorKey || "");
    if (!/^[a-zA-Z0-9-]{16,64}$/.test(visitorKey)) {
      return res.status(400).json({ success: false, message: "A valid visitor session key is required." });
    }
    await ensureVisitorTable();
    await pool.query("INSERT IGNORE INTO website_visitor_sessions (visitor_key) VALUES (?)", [visitorKey]);
    const [[row]] = await pool.query("SELECT COUNT(*) AS total FROM website_visitor_sessions");
    res.json({ success: true, total: Number(row.total) || 0 });
  } catch (error) {
    console.error("VISITOR COUNT ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to load visitor count." });
  }
});


//============================================================
//Other
app.use("/api/screen-readers", screenReaderRoutes);
//==========================================================
// ============================================================
// 404 HANDLER
// ============================================================

// ============================================================
// BASIC SERVER TEST
// ============================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "SERVER IS RUNNING"
  });
});

// ============================================================
// COLLEGE DEPARTMENT
// ============================================================

app.use(  "/api/departments",  departmentRoutes);
app.use(    "/api/department-programmes",    departmentProgrammeRoutes);
app.use("/api/department-profile", departmentProfileRoutes);
app.use(    "/api/department-faculty",    departmentFacultyRoutes);
app.use("/api/naac", naacRoutes);

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "SERVER IS RUNNING"
    });
});
//============================================================
//COLLEGE DEPT
//============================================================
app.use("/api/departments", departmentRoutes);


//============================================================
// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(  (error, req, res, next) => {    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {
    console.log("");
    console.log(
      "=================================================="
    );

    console.log(
      `College CMS Backend running on http://localhost:${PORT}`
    );

    console.log(
      "College Header API:",
      `http://localhost:${PORT}/api/college-header`
    );

    console.log(
      "Uploads:",
      `http://localhost:${PORT}/uploads`
    );

    console.log(
      "=================================================="
    );

    console.log("");
  }
);
