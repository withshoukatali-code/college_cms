// import { useEffect, useState } from "react";

// import CollegeLogo from "./CollegeLogo";
// import CollegeInfo from "./CollegeInfo";
// import CollegeImage from "./CollegeImage";
// import NaacCard from "./NaacCard";

// const API_URL = "http://localhost:5000/api/settings";

// const fallbackCollege = {
//   logo_url: "/images/logo.png",
//   tagline: "Knowledge • Character • Service",
//   college_name: "ABC Senior College",
//   affiliation: "Affiliated to Shivaji University, Kolhapur",
//   address: "Sangli • Maharashtra • India",
//   campus_image: "/images/campus.jpg",
//   naac_grade: "A++",
//   naac_cycle: "Cycle IV",
//   naac_cgpa: "CGPA : 3.58",
// };

// function SiteHeader() {
//   const [college, setCollege] = useState(fallbackCollege);

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await fetch(API_URL);

//         if (!response.ok) {
//           throw new Error("Failed to fetch college settings");
//         }

//         const result = await response.json();

//         if (result.success && result.data) {
//           setCollege({
//             ...fallbackCollege,
//             ...result.data,
//           });
//         }
//       } catch (error) {
//         console.error("College settings API error:", error);
//       }
//     };

//     fetchSettings();
//   }, []);

//   return (
//     <header
//       className="
//         border-b
//         border-slate-200
//         bg-linear-to-b
//         from-white
//         to-slate-50
//       "
//     >
//       <div
//         className="
//           mx-auto
//           max-w-screen-2xl
//           px-6
//           lg:px-10
//         "
//       >
//         <div
//           className="
//             flex
//             items-end
//             justify-between
//             py-3
//           "
//         >

//           {/* =====================================================
//               LEFT
//           ===================================================== */}

//           <div
//             className="
//               flex
//               items-center
//               gap-8
//             "
//           >
//             <CollegeLogo
//               logo={college.logo_url}
//               collegeName={college.college_name}
//             />

//             <CollegeInfo
//               tagline={college.tagline || college.slogan}
//               collegeName={college.college_name}
//               affiliation={
//                 college.affiliation || college.university_name
//               }
//               address={college.address}
//             />
//           </div>

//           {/* =====================================================
//               RIGHT
//           ===================================================== */}

//           <div
//             className="
//               hidden
//               items-end
//               gap-6
//               lg:flex
//             "
//           >
//             <CollegeImage
//               image={college.campus_image}
//             />

//             <NaacCard
//               grade={college.naac_grade}
//               cycle={college.naac_cycle}
//               cgpa={college.naac_cgpa}
//             />
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }

// export default SiteHeader;

// other layput with botton

// import { useEffect, useState } from "react";
// import {
//   Mail,
//   Phone,
//   Award,
//   CalendarDays,
//   MapPin,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000";

// const API_URL = `${API_BASE}/api/college-header`;

// function SiteHeader() {
//   const [college, setCollege] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /*
//   |--------------------------------------------------------------------------
//   | FETCH COLLEGE HEADER
//   |--------------------------------------------------------------------------
//   */

//   useEffect(() => {
//     let mounted = true;

//     const fetchCollegeHeader = async () => {
//       try {
//         const response = await fetch(API_URL);

//         if (!response.ok) {
//           throw new Error(
//             `HTTP ${response.status}`
//           );
//         }

//         const result = await response.json();

//         if (!mounted) return;

//         if (
//           result.success &&
//           result.data
//         ) {
//           setCollege(result.data);
//         } else {
//           setCollege(null);
//         }
//       } catch (error) {
//         console.error(
//           "Failed to fetch college header:",
//           error
//         );

//         if (mounted) {
//           setCollege(null);
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchCollegeHeader();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | DEFAULT DATA
//   |--------------------------------------------------------------------------
//   |
//   | These are only visual fallbacks.
//   | Actual college information comes from the API.
//   |
//   */

//   const collegeName =
//     college?.college_name ||
//     "College Name";

//   const shortName =
//     college?.short_name ||
//     "";

//   const slogan =
//     college?.slogan ||
//     "";

//   const tagline =
//     college?.tagline ||
//     "";

//   const affiliation =
//     college?.affiliation ||
//     "";

//   const universityName =
//     college?.university_name ||
//     "";

//   const establishedYear =
//     college?.established_year ||
//     "";

//   const naacGrade =
//     college?.naac_grade ||
//     "";

//   const naacCycle =
//     college?.naac_cycle ||
//     "";

//   const naacCgpa =
//     college?.naac_cgpa ||
//     "";

//   const phone =
//     college?.phone ||
//     "";

//   const email =
//     college?.email ||
//     "";

//   const address =
//     college?.address ||
//     "";

//   const logoUrl =
//     college?.logo_url || null;

//   /*
//   |--------------------------------------------------------------------------
//   | IMAGE ERROR HANDLER
//   |--------------------------------------------------------------------------
//   */

//   const handleLogoError = (event) => {
//     event.currentTarget.style.display =
//       "none";
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | LOADING STATE
//   |--------------------------------------------------------------------------
//   |
//   | IMPORTANT:
//   | We do NOT return null while loading.
//   | This prevents the header from appearing and
//   | then disappearing during API loading.
//   |
//   */

//   return (
//     <header className="w-full bg-white border-b border-slate-200">

//       {/* ============================================================
//           MAIN COLLEGE HEADER
//       ============================================================ */}

//       <div className="w-full bg-white">

//         <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

//           <div className="flex min-h-[110px] items-center gap-4 py-4 sm:gap-6">

//             {/* ======================================================
//                 LOGO
//             ====================================================== */}

//             <div className="flex shrink-0 items-center justify-center">

//               {logoUrl ? (
//                 <img
//                   src={logoUrl}
//                   alt={`${collegeName} Logo`}
//                   onError={handleLogoError}
//                   className="
//                     h-20
//                     w-20
//                     object-contain
//                     sm:h-24
//                     sm:w-24
//                     lg:h-28
//                     lg:w-28
//                   "
//                 />
//               ) : (
//                 <div
//                   className="
//                     flex
//                     h-20
//                     w-20
//                     items-center
//                     justify-center
//                     rounded-full
//                     border
//                     border-slate-200
//                     bg-slate-50
//                     text-center
//                     text-xs
//                     font-semibold
//                     text-slate-500
//                     sm:h-24
//                     sm:w-24
//                     lg:h-28
//                     lg:w-28
//                   "
//                 >
//                   LOGO
//                 </div>
//               )}

//             </div>

//             {/* ======================================================
//                 COLLEGE INFORMATION
//             ====================================================== */}

//             <div className="min-w-0 flex-1">

//               {/* College name */}

//               <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

//                 <h1
//                   className="
//                     text-lg
//                     font-extrabold
//                     leading-tight
//                     tracking-tight
//                     text-slate-900
//                     sm:text-2xl
//                     lg:text-3xl
//                   "
//                 >
//                   {loading
//                     ? "College Name"
//                     : collegeName}
//                 </h1>

//                 {shortName && (
//                   <span
//                     className="
//                       rounded-md
//                       bg-slate-100
//                       px-2
//                       py-1
//                       text-xs
//                       font-bold
//                       text-slate-600
//                     "
//                   >
//                     {shortName}
//                   </span>
//                 )}

//               </div>

//               {/* Slogan */}

//               {slogan && (
//                 <p
//                   className="
//                     mt-1
//                     text-sm
//                     font-semibold
//                     text-blue-900
//                     sm:text-base
//                   "
//                 >
//                   {slogan}
//                 </p>
//               )}

//               {/* Tagline */}

//               {tagline && (
//                 <p
//                   className="
//                     mt-1
//                     max-w-3xl
//                     text-xs
//                     leading-relaxed
//                     text-slate-500
//                     sm:text-sm
//                   "
//                 >
//                   {tagline}
//                 </p>
//               )}

//               {/* Affiliation */}

//               {(affiliation ||
//                 universityName) && (
//                 <div
//                   className="
//                     mt-2
//                     flex
//                     flex-wrap
//                     items-center
//                     gap-x-4
//                     gap-y-1
//                     text-xs
//                     text-slate-600
//                     sm:text-sm
//                   "
//                 >

//                   {affiliation && (
//                     <span>
//                       <span className="font-semibold">
//                         Affiliated:
//                       </span>{" "}
//                       {affiliation}
//                     </span>
//                   )}

//                   {universityName && (
//                     <span>
//                       <span className="font-semibold">
//                         University:
//                       </span>{" "}
//                       {universityName}
//                     </span>
//                   )}

//                 </div>
//               )}

//             </div>

//             {/* ======================================================
//                 RIGHT SIDE INFORMATION
//             ====================================================== */}

//             <div
//               className="
//                 hidden
//                 shrink-0
//                 flex-col
//                 items-end
//                 gap-2
//                 text-right
//                 lg:flex
//               "
//             >

//               {/* Established */}

//               {establishedYear && (
//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-2
//                     text-sm
//                     text-slate-600
//                   "
//                 >
//                   <CalendarDays
//                     size={16}
//                     className="text-blue-800"
//                   />

//                   <span>
//                     Est.{" "}
//                     <strong>
//                       {establishedYear}
//                     </strong>
//                   </span>
//                 </div>
//               )}

//               {/* NAAC */}

//               {(naacGrade ||
//                 naacCycle ||
//                 naacCgpa) && (
//                 <div
//                   className="
//                     flex
//                     items-center
//                     gap-2
//                     rounded-lg
//                     bg-blue-50
//                     px-3
//                     py-2
//                     text-sm
//                     font-semibold
//                     text-blue-900
//                   "
//                 >
//                   <Award
//                     size={18}
//                     className="text-blue-800"
//                   />

//                   <span>
//                     {naacGrade &&
//                       `NAAC ${naacGrade}`}

//                     {naacCycle &&
//                       ` • ${naacCycle}`}

//                     {naacCgpa &&
//                       ` • CGPA ${naacCgpa}`}
//                   </span>
//                 </div>
//               )}

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ============================================================
//           CONTACT STRIP
//       ============================================================ */}

//       {(phone ||
//         email ||
//         address) && (
//         <div
//           className="
//             w-full
//             border-t
//             border-slate-100
//             bg-slate-50
//           "
//         >

//           <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

//             <div
//               className="
//                 flex
//                 min-h-10
//                 flex-wrap
//                 items-center
//                 gap-x-6
//                 gap-y-2
//                 py-2
//                 text-xs
//                 text-slate-600
//                 sm:text-sm
//               "
//             >

//               {/* Phone */}

//               {phone && (
//                 <a
//                   href={`tel:${phone}`}
//                   className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     transition
//                     hover:text-blue-800
//                   "
//                 >
//                   <Phone
//                     size={15}
//                     className="text-blue-800"
//                   />

//                   <span>
//                     {phone}
//                   </span>
//                 </a>
//               )}

//               {/* Email */}

//               {email && (
//                 <a
//                   href={`mailto:${email}`}
//                   className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     transition
//                     hover:text-blue-800
//                   "
//                 >
//                   <Mail
//                     size={15}
//                     className="text-blue-800"
//                   />

//                   <span>
//                     {email}
//                   </span>
//                 </a>
//               )}

//               {/* Address */}

//               {address && (
//                 <div
//                   className="
//                     inline-flex
//                     min-w-0
//                     items-start
//                     gap-2
//                   "
//                 >
//                   <MapPin
//                     size={15}
//                     className="
//                       mt-0.5
//                       shrink-0
//                       text-blue-800
//                     "
//                   />

//                   <span className="line-clamp-2">
//                     {address}
//                   </span>
//                 </div>
//               )}

//             </div>

//           </div>

//         </div>
//       )}

//     </header>
//   );
// }

// export default SiteHeader;




import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Award,
  ShieldCheck,
  Building2,
  BadgeCheck,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API_URL = `${API_BASE}/api/college-header`;

function SiteHeader() {
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH COLLEGE HEADER
  ============================================================ */

  useEffect(() => {
    let mounted = true;

    const fetchCollegeHeader = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!mounted) return;

        if (result.success && result.data) {
          setCollege(result.data);
        } else {
          setCollege(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch college header:",
          error
        );

        if (mounted) {
          setCollege(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCollegeHeader();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================================
     COLLEGE DATA
  ============================================================ */

  const collegeName =
    college?.college_name || "College Name";

  const shortName =
    college?.short_name || "";

  const slogan =
    college?.slogan || "";

  const tagline =
    college?.tagline || "";

  const affiliation =
    college?.affiliation || "";

  const universityName =
    college?.university_name || "";

  const address =
    college?.address || "";

  const establishedYear =
    college?.established_year || "";

  /* ============================================================
     NAAC DATA
  ============================================================ */

  const naacGrade =
    college?.naac_grade || "";

  const naacCycle =
    college?.naac_cycle || "";

  const naacCgpa =
    college?.naac_gpa || "";

  /* ============================================================
     CONTACT
  ============================================================ */

  const phone =
    college?.phone || "";

  const email =
    college?.email || "";

  /* ============================================================
     LOGO
  ============================================================ */

  const logoUrl =
    college?.logo_url || null;

  /* ============================================================
     CAMPUS IMAGE
  ============================================================ */

  const campusImage =
    college?.campus_image_url ||
    college?.campus_image ||
    college?.college_image_url ||
    college?.college_image ||
    null;

  /* ============================================================
     INSTITUTIONAL INFORMATION

     These safely support different possible database field names.
  ============================================================ */

  const aisheCode =
    college?.aishe_code ||
    college?.aisheCode ||
    college?.aishe ||
    "";

  const ugcStatus =
    college?.ugc_status ||
    college?.ugcStatus ||
    college?.ugc_recognition ||
    college?.ugc_recognized ||
    "";

  const recognition2f12b =
    college?.recognition_2f_12b ||
    college?.ugc_2f_12b ||
    college?.recognition_2f_12b_status ||
    college?.two_f_12_b ||
    "";

  const isoCertification =
    college?.iso_certification ||
    college?.iso_certification_status ||
    college?.iso ||
    college?.iso_status ||
    "";

  const autonomousStatus =
    college?.autonomous_status ||
    college?.autonomousStatus ||
    college?.autonomous ||
    "";

  /* ============================================================
     IMAGE URL HELPER
  ============================================================ */

  const getImageUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    if (url.startsWith("/")) {
      return `${API_BASE}${url}`;
    }

    return `${API_BASE}/${url}`;
  };

  const logo = getImageUrl(logoUrl);
  const campus = getImageUrl(campusImage);

  /* ============================================================
     IMAGE ERROR HANDLERS
  ============================================================ */

  const handleLogoError = (event) => {
    event.currentTarget.style.display = "none";
  };

  const handleCampusError = (event) => {
    event.currentTarget.style.display = "none";
  };

  /* ============================================================
     HEADER
  ============================================================ */

  return (
    <header className="w-full bg-white">

      {/* ==========================================================
          TOP STRIP
          LIGHT BACKGROUND + DARK TEXT
      ========================================================== */}

      <div
        className="
          w-full
          border-b
          border-slate-200
          bg-slate-50
          text-slate-700
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[34px]
            w-full
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* CONTACT */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-5
              sm:gap-7
            "
          >

            {email && (
              <a
                href={`mailto:${email}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-[11px]
                  font-semibold
                  text-slate-700
                  transition
                  hover:text-[#0f3262]
                  sm:text-xs
                "
              >
                <Mail
                  size={14}
                  className="text-[#a77b14]"
                />

                <span className="hidden sm:inline">
                  {email}
                </span>

                <span className="sm:hidden">
                  Email
                </span>
              </a>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-[11px]
                  font-semibold
                  text-slate-700
                  transition
                  hover:text-[#0f3262]
                  sm:text-xs
                "
              >
                <Phone
                  size={14}
                  className="text-[#a77b14]"
                />

                {phone}
              </a>
            )}

          </div>


          {/* IMPORTANT LINKS */}

          <nav
            className="
              flex
              min-w-0
              items-center
              justify-end
              gap-x-1
              sm:gap-x-2
            "
          >

            {/* NAAC DOCUMENTS */}

            <a
              href="/naac"
              className="
                inline-flex
                items-center
                whitespace-nowrap
                rounded-md
                bg-[#0f3262]
                px-3
                py-1.5
                text-[10px]
                font-extrabold
                uppercase
                tracking-wide
                text-white
                shadow-sm
                transition
                hover:bg-[#092849]
                sm:px-3.5
                sm:text-xs
              "
            >
              <Award
                size={13}
                className="mr-1.5 text-[#f2d16a]"
              />

              NAAC DOCUMENTS
            </a>


            {/* IQAC */}

            <a
              href="/iqac"
              className="
                rounded-md
                px-2
                py-1.5
                text-[10px]
                font-bold
                text-slate-700
                transition
                hover:bg-white
                hover:text-[#0f3262]
                sm:px-2.5
                sm:text-xs
              "
            >
              IQAC
            </a>


            {/* AQAR */}

            <a
              href="/naac/aqar"
              className="
                rounded-md
                px-2
                py-1.5
                text-[10px]
                font-bold
                text-slate-700
                transition
                hover:bg-white
                hover:text-[#0f3262]
                sm:px-2.5
                sm:text-xs
              "
            >
              AQAR
            </a>


            {/* SSR */}

            <a
              href="/naac/ssr"
              className="
                rounded-md
                px-2
                py-1.5
                text-[10px]
                font-bold
                text-slate-700
                transition
                hover:bg-white
                hover:text-[#0f3262]
                sm:px-2.5
                sm:text-xs
              "
            >
              SSR
            </a>


            {/* DVV */}

            <a
              href="/naac/dvv"
              className="
                rounded-md
                px-2
                py-1.5
                text-[10px]
                font-bold
                text-slate-700
                transition
                hover:bg-white
                hover:text-[#0f3262]
                sm:px-2.5
                sm:text-xs
              "
            >
              DVV
            </a>


            {/* DOWNLOADS */}

            <a
              href="/downloads"
              className="
                rounded-md
                px-2
                py-1.5
                text-[10px]
                font-bold
                text-slate-700
                transition
                hover:bg-white
                hover:text-[#0f3262]
                sm:px-2.5
                sm:text-xs
              "
            >
              Downloads
            </a>

          </nav>

        </div>
      </div>


      {/* ==========================================================
          MAIN COLLEGE HEADER
      ========================================================== */}

      <div className="w-full bg-white py-5">

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              flex
              min-h-[142px]
              items-center
              gap-4
              py-1
              sm:gap-5
              lg:gap-6
            "
          >

            {/* ======================================================
                LOGO
            ====================================================== */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-center
              "
            >

              {logo ? (
                <img
                  src={logo}
                  alt={`${collegeName} Logo`}
                  onError={handleLogoError}
                  className="
                    h-20
                    w-20
                    object-contain
                    sm:h-24
                    sm:w-24
                    lg:h-28
                    lg:w-28
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50
                    text-[10px]
                    font-bold
                    text-[#0f3262]
                    sm:h-24
                    sm:w-24
                    lg:h-28
                    lg:w-28
                  "
                >
                  LOGO
                </div>
              )}

            </div>


            {/* ======================================================
                COLLEGE INFORMATION
            ====================================================== */}

            <div className="min-w-0 flex-1">

              {/* TAGLINE ABOVE COLLEGE NAME */}

              {tagline && (
                <div className="mb-0.5">

                  <span
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#9b7414]
                      sm:text-[10px]
                    "
                  >
                    {tagline}
                  </span>

                </div>
              )}


              {/* COLLEGE NAME */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >

                <h1
                  className="
                    text-2xl
                    font-bold
                    leading-tight
                    tracking-tight
                    text-orange-400
                    sm:text-2xl
                    lg:text-[29px]
                    xl:text-[32px]
                  "
                >
                  {loading
                    ? "College Name"
                    : collegeName}
                </h1>

                {shortName && (
                  <span
                    className="
                      rounded
                      border
                      border-slate-200
                      bg-slate-50
                      px-2
                      py-0.5
                      text-[9px]
                      font-bold
                      text-slate-600
                    "
                  >
                    {shortName}
                  </span>
                )}

              </div>


              {/* SLOGAN */}

              {/* {slogan && (
                <p
                  className="
                    mt-0.5
                    text-sm
                    font-semibold
                    text-[#0f3262]
                    sm:text-base
                  "
                >
                  {slogan}
                </p>
              )} */}


              {/* ADDRESS */}

              {address && (
                <div
                  className="
                    mt-1
                    flex
                    max-w-3xl
                    items-start
                    gap-2
                    text-xs
                    leading-snug
                    text-slate-600
                    sm:text-sm
                  "
                >

                  <MapPin
                    size={16}
                    className="
                      mt-0.5
                      shrink-0
                      text-[#a77b14]
                    "
                  />

                  <span>
                    {address}
                  </span>

                </div>
              )}


              {/* AFFILIATION */}

              {(affiliation ||
                universityName) && (
                <div
                  className="
                    mt-1
                    flex
                    flex-wrap
                    items-center
                    gap-x-5
                    gap-y-1
                    text-xs
                    text-slate-600
                    sm:text-sm
                  "
                >

                  {affiliation && (
                    <span>
                      <strong className="text-slate-700">
                        Affiliated:
                      </strong>{" "}
                      {affiliation}
                    </span>
                  )}

                  {universityName && (
                    <span>
                      <strong className="text-slate-700">
                        University:
                      </strong>{" "}
                      {universityName}
                    </span>
                  )}

                </div>
              )}

            </div>


            {/* ======================================================
                CAMPUS IMAGE
            ====================================================== */}

            <div
              className="
                relative
                hidden
                h-[120px]
                w-[215px]
                shrink-0
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-slate-100
                shadow-md
                sm:block
                md:h-[128px]
                md:w-[235px]
                lg:h-[138px]
                lg:w-[260px]
              "
            >

              {campus ? (
                <>
                  <img
                    src={campus}
                    alt={`${collegeName} Campus`}
                    onError={handleCampusError}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#061a32]/65
                      via-transparent
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-2
                      left-2
                      rounded-full
                      bg-[#061a32]/85
                      px-3
                      py-1
                      text-[8px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-white
                    "
                  >
                    Our Campus
                  </div>
                </>
              ) : (
                <div
                  className="
                    flex
                    h-full
                    items-center
                    justify-center
                  "
                >
                  <Building2
                    size={34}
                    className="text-slate-300"
                  />
                </div>
              )}

            </div>


            {/* ======================================================
                PREMIUM NAAC CARD
            ====================================================== */}

            <div
              className="
                relative
                flex
                h-[108px]
                w-[116px]
                shrink-0
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-[#c79b32]
                bg-[#071b34]
                shadow-[0_6px_18px_rgba(7,27,52,0.20)]
                sm:h-[116px]
                sm:w-[124px]
                lg:h-[124px]
                lg:w-[132px]
              "
            >

              {/* GOLD TOP ACCENT */}

              <div
                className="
                  absolute
                  left-1/2
                  top-0
                  h-[3px]
                  w-12
                  -translate-x-1/2
                  rounded-b-full
                  bg-[#e0b83e]
                "
              />


              {/* NAAC */}

              <div
                className="
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#f5d477]
                  sm:text-[8px]
                "
              >
                NAAC ACCREDITED
              </div>


              {/* GRADE */}

              <div
                className="
                  mt-0.5
                  text-[34px]
                  font-black
                  leading-none
                  text-[#f4cf55]
                  sm:text-[38px]
                  lg:text-[40px]
                "
              >
                {naacGrade}
              </div>


              {/* DIVIDER */}

              <div
                className="
                  my-1
                  h-px
                  w-10
                  bg-[#d4a72c]/70
                "
              />


              {/* CYCLE */}

              <div
                className="
                  text-[12px]
                  font-extrabold
                  uppercase
                  tracking-[0.08em]
                  text-white
                  sm:text-[13px]
                  lg:text-[14px]
                "
              >
                {naacCycle}
              </div>


              {/* CGPA */}

              <div
                className="
                  mt-0.5
                  text-[11px]
                  font-semibold
                  text-slate-200
                  sm:text-[12px]
                  lg:text-[13px]
                "
              >
                CGPA{" "}
                <span
                  className="
                    font-black
                    text-[#f4d36b]
                  "
                >
                  {naacCgpa}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==========================================================
          BOTTOM INSTITUTIONAL CREDENTIAL STRIP
      ========================================================== */}

      {/* <div
        className="
          border-t
          border-slate-200
          bg-slate-50
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              grid
              min-h-[46px]
              grid-cols-2
              items-center
              gap-x-5
              gap-y-2
              py-2
              sm:grid-cols-3
              lg:grid-cols-6
              lg:gap-4
            "
          > */}

            {/* ====================================================
                1. ESTABLISHED
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Building2
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  Established
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    font-semibold
                    text-slate-500
                  "
                >
                  {establishedYear || "Year"}
                </div>

              </div>

            </div> */}


            {/* ====================================================
                2. UGC RECOGNIZED
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <ShieldCheck
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  UGC Recognized
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    text-slate-500
                  "
                >
                  {ugcStatus || "UGC Recognized"}
                </div>

              </div>

            </div> */}


            {/* ====================================================
                3. AISHE CODE
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Building2
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  AISHE Code
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    font-semibold
                    text-slate-500
                  "
                >
                  {aisheCode || "AISHE Code"}
                </div>

              </div>

            </div> */}


            {/* ====================================================
                4. 2(f) / 12(B)
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <BadgeCheck
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  2(f) / 12(B)
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    text-slate-500
                  "
                >
                  {recognition2f12b || "UGC Recognition"}
                </div>

              </div>

            </div> */}


            {/* ====================================================
                5. ISO CERTIFIED
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <ShieldCheck
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  ISO Certified
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    text-slate-500
                  "
                >
                  {isoCertification || "Quality Certified"}
                </div>

              </div>

            </div> */}


            {/* ====================================================
                6. AUTONOMOUS STATUS
            ==================================================== */}

            {/* <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Award
                size={18}
                className="shrink-0 text-[#a77b14]"
              />

              <div className="leading-tight">

                <div
                  className="
                    text-[11px]
                    font-bold
                    text-[#25364a]
                    sm:text-xs
                  "
                >
                  Autonomous Status
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    text-slate-500
                  "
                >
                  {autonomousStatus || "Institutional Status"}
                </div>

              </div>

            </div> */}

          {/* </div>

        </div>

      </div> */}

    </header>
  );
}

export default SiteHeader;

