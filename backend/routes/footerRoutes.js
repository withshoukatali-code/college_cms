import express from "express";
import db from "../config/db.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET PUBLIC FOOTER
|--------------------------------------------------------------------------
| GET /api/footer
|
| Reads footer information from the `footer` table.
| Only the active footer record is returned.
|--------------------------------------------------------------------------
*/

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        id,
        college_name,
        tagline,
        description,
        affiliation,
        established_year,
        naac_grade,
        address,
        phone,
        email,
        logo,

        principal_name,
        principal_designation,
        principal_mobile,

        administration_name,
        administration_designation,
        administration_mobile,

        grievance_name,
        grievance_designation,
        grievance_mobile,

        facilitation_name,
        facilitation_designation,
        facilitation_mobile,

        library_name,
        library_designation,
        library_mobile,

        placement_name,
        placement_designation,
        placement_mobile,

        anti_ragging_name,
        anti_ragging_designation,
        anti_ragging_mobile,

        women_harassment_name,
        women_harassment_designation,
        women_harassment_mobile,

        women_empowerment_name,
        women_empowerment_designation,
        women_empowerment_mobile,

        copyright_text,
        developer_name,
        developer_text,
        developer_url,

        is_active,
        created_at,
        updated_at

      FROM footer
      WHERE is_active = 1
      ORDER BY id DESC
      LIMIT 1
      `
    );

    if (!rows.length) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active footer found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET PUBLIC FOOTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch footer",
      error: error.message,
    });
  }
});

export default router;