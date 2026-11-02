// import { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";

// import {
//   LayoutDashboard,
//   PanelTop,
//   Building2,
//   Images,
//   Download,
//   BookOpen,
//   FileText,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   Image,
//   BarChart3,
//   MessageSquareText,
//   CalendarDays,
//   Trophy,
//   PlayCircle,
//   BriefcaseBusiness,
//   Link2,
//   Megaphone,
//   Newspaper,
//   UsersRound,
//   ShieldCheck,
//   Award,
//   FolderOpen,
//   Settings,
// } from "lucide-react";

// /*
// |--------------------------------------------------------------------------
// | Admin Layout
// |--------------------------------------------------------------------------
// */

// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [openMenus, setOpenMenus] = useState({
//     homepage: true,
//     departments: false,
//     iqac: false,
//     accreditation: false,
//   });

//   /*
//   |--------------------------------------------------------------------------
//   | Toggle Dropdown
//   |--------------------------------------------------------------------------
//   */

//   const toggleMenu = (menu) => {
//     setOpenMenus((previous) => ({
//       ...previous,
//       [menu]: !previous[menu],
//     }));
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Close Mobile Sidebar
//   |--------------------------------------------------------------------------
//   */

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | Main Navigation
//   |--------------------------------------------------------------------------
//   */

//   const mainNavClass = ({ isActive }) =>
//     `
//       flex
//       items-center
//       gap-3
//       rounded-xl
//       px-3
//       py-2.5
//       text-sm
//       transition-all
//       duration-200
//       ${isActive
//       ? "bg-[#0f3262] font-semibold text-white shadow-sm"
//       : "font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0f3262]"
//     }
//     `;

//   /*
//   |--------------------------------------------------------------------------
//   | Sub Navigation
//   |--------------------------------------------------------------------------
//   */

//   const subNavClass = ({ isActive }) =>
//     `
//       flex
//       items-center
//       gap-3
//       rounded-lg
//       px-3
//       py-2
//       text-[13px]
//       transition-all
//       duration-200
//       ${isActive
//       ? "bg-blue-50 font-semibold text-[#0f3262]"
//       : "font-medium text-slate-500 hover:bg-slate-100 hover:text-[#0f3262]"
//     }
//     `;

//   /*
//   |--------------------------------------------------------------------------
//   | Dropdown Header
//   |--------------------------------------------------------------------------
//   */

//   const dropdownButtonClass = `
//     flex
//     w-full
//     items-center
//     justify-between
//     rounded-xl
//     px-3
//     py-2.5
//     text-sm
//     font-semibold
//     text-slate-700
//     transition-all
//     duration-200
//     hover:bg-slate-100
//     hover:text-[#0f3262]
//   `;

//   return (
//     <div className="flex min-h-screen bg-[#f1f5f9]">

//       {/* =========================================================
//           MOBILE OVERLAY
//       ========================================================= */}

//       {sidebarOpen && (
//         <button
//           type="button"
//           aria-label="Close navigation"
//           onClick={closeSidebar}
//           className="
//             fixed
//             inset-0
//             z-40
//             bg-slate-900/30
//             backdrop-blur-[2px]
//             lg:hidden
//           "
//         />
//       )}

//       {/* =========================================================
//           SIDEBAR
//       ========================================================= */}

//       <aside
//         className={`
//           fixed
//           inset-y-0
//           left-0
//           z-50
//           flex
//           w-72
//           flex-col
//           border-r
//           border-slate-200
//           bg-slate-50
//           shadow-sm
//           transition-transform
//           duration-300
//           lg:static
//           lg:translate-x-0
//           ${sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full"
//           }
//         `}
//       >

//         {/* =======================================================
//             BRAND
//         ======================================================= */}

//         <div
//           className="
//             flex
//             h-[68px]
//             shrink-0
//             items-center
//             justify-between
//             border-b
//             border-slate-200
//             bg-white
//             px-5
//           "
//         >

//           <div className="flex items-center gap-3">

//             <div
//               className="
//                 flex
//                 h-10
//                 w-10
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-xl
//                 bg-[#0f3262]
//                 text-white
//                 shadow-sm
//               "
//             >
//               <Building2 size={20} />
//             </div>

//             <div className="min-w-0">

//               <h1
//                 className="
//                   truncate
//                   text-sm
//                   font-bold
//                   text-slate-900
//                 "
//               >
//                 Admin Dashboard
//               </h1>

//               <p
//                 className="
//                   mt-0.5
//                   text-[11px]
//                   font-medium
//                   text-slate-400
//                 "
//               >
//                 Administration Panel
//               </p>

//             </div>

//           </div>

//           <button
//             type="button"
//             onClick={closeSidebar}
//             aria-label="Close sidebar"
//             className="
//               rounded-lg
//               p-2
//               text-slate-500
//               transition
//               hover:bg-slate-100
//               hover:text-slate-800
//               lg:hidden
//             "
//           >
//             <X size={18} />
//           </button>

//         </div>

//         {/* =======================================================
//             NAVIGATION
//         ======================================================= */}

//         <nav
//           className="
//             flex-1
//             overflow-y-auto
//             px-3
//             py-5
//           "
//         >

//           {/* =====================================================
//               SECTION LABEL
//           ===================================================== */}

//           <div
//             className="
//               mb-2
//               px-3
//               text-[10px]
//               font-bold
//               uppercase
//               tracking-[0.16em]
//               text-slate-400
//             "
//           >
//             Main Navigation
//           </div>

//           {/* =====================================================
//               DASHBOARD
//           ===================================================== */}

//           <NavLink
//             to="/admin"
//             end
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <LayoutDashboard size={18} />
//             <span>Dashboard</span>
//           </NavLink>

//           {/* =====================================================
//               TOPBAR
//           ===================================================== */}

//           <NavLink
//             to="/admin/topbar"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <PanelTop size={18} />
//             <span>TopBar</span>
//           </NavLink>

//           {/* =====================================================
//               HEADER
//           ===================================================== */}

//           <NavLink
//             to="/homepage/CollegeHeader"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <Building2 size={18} />
//             <span>Header</span>
//           </NavLink>

//           <NavLink
//             to="/header/BottomInstitutionalStrip"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <Building2 size={18} />
//             <span>College Staus</span>
//           </NavLink>

//           {/* =====================================================
//               HOMEPAGE
//           ===================================================== */}

//           <div className="mt-1">

//             <button
//               type="button"
//               onClick={() => toggleMenu("homepage")}
//               className={dropdownButtonClass}
//             >
//               <span className="flex items-center gap-3">
//                 <LayoutDashboard size={18} />
//                 Homepage
//               </span>

//               {openMenus.homepage ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}
//             </button>

//             {openMenus.homepage && (
//               <div
//                 className="
//                   mt-1
//                   ml-5
//                   space-y-0.5
//                   border-l
//                   border-slate-200
//                   pl-2
//                 "
//               >

//                 {/* Hero Slider */}

//                 <NavLink
//                   to="/admin/homepage/hero-slider"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Image size={16} />
//                   Hero Slider
//                 </NavLink>

//                 {/* Statistics */}

//                 <NavLink
//                   to="/admin/homepage/statistics"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <BarChart3 size={16} />
//                   Statistics
//                 </NavLink>


//                 {/* About College */}

//                 <NavLink
//                   to="/admin/homepage/aboutcollege"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Building2 size={16} />
//                   About College
//                 </NavLink>
//                 {/* Welcome */}

//                 <NavLink
//                   to="/admin/homepage/welcome"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <MessageSquareText size={16} />
//                   Principal Welcome
//                 </NavLink>

//                 {/* Events */}

//                 <NavLink
//                   to="/admin/homepage/events"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <CalendarDays size={16} />
//                   Events
//                 </NavLink>

//                 {/* Achievements */}

//                 <NavLink
//                   to="/admin/homepage/achievements"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Trophy size={16} />
//                   Achievements
//                 </NavLink>

//                 {/* YouTube */}

//                 <NavLink
//                   to="/admin/homepage/youtube"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <PlayCircle size={16} />
//                   YouTube
//                 </NavLink>

//                 {/* =================================================
//                     HOME PLACEMENTS
//                     IMPORTANT:
//                     Route is /admin/homepage/placements
//                 ================================================= */}

//                 <NavLink
//                   to="/admin/homepage/placements"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <BriefcaseBusiness size={16} />
//                   Home Placements
//                 </NavLink>

//                 {/* Home Gallery */}

//                 <NavLink
//                   to="/admin/homepage/gallery"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Images size={16} />
//                   Home Gallery
//                 </NavLink>

//                 {/* Quick Links */}

//                 <NavLink
//                   to="/admin/homepage/quick-links"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Link2 size={16} />
//                   Quick Links
//                 </NavLink>

//                 {/* Breaking News */}

//                 <NavLink
//                   to="/admin/homepage/breaking-news"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Megaphone size={16} />
//                   Breaking News
//                 </NavLink>

//                 {/* News & Notices */}

//                 <NavLink
//                   to="/admin/homepage/news-notices"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Newspaper size={16} />
//                   News & Notices
//                 </NavLink>

//               </div>
//             )}

//           </div>

//           {/* =====================================================
//               DEPARTMENTS
//           ===================================================== */}

//           <div className="mt-1">

//             <button
//               type="button"
//               onClick={() => toggleMenu("departments")}
//               className={dropdownButtonClass}
//             >

//               <span className="flex items-center gap-3">
//                 <UsersRound size={18} />
//                 Departments
//               </span>

//               {openMenus.departments ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}

//             </button>

//             {openMenus.departments && (
//               <div
//                 className="
//                   mt-1
//                   ml-5
//                   space-y-0.5
//                   border-l
//                   border-slate-200
//                   pl-2
//                 "
//               >

//                 <NavLink
//                   to="/admin/departments"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Building2 size={16} />
//                   Manage Departments
//                 </NavLink>

//                 <NavLink
//                   to="/admin/departments/arts"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <BookOpen size={16} />
//                   Arts
//                 </NavLink>

//                 <NavLink
//                   to="/admin/departments/science"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <BarChart3 size={16} />
//                   Science
//                 </NavLink>

//                 <NavLink
//                   to="/admin/departments/commerce"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <BriefcaseBusiness size={16} />
//                   Commerce
//                 </NavLink>

//                 <NavLink
//                   to="/admin/departments/professional"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Award size={16} />
//                   Professional Courses
//                 </NavLink>

//               </div>
//             )}

//           </div>

//           {/* =====================================================
//               IQAC
//           ===================================================== */}

//           <div className="mt-1">

//             <button
//               type="button"
//               onClick={() => toggleMenu("iqac")}
//               className={dropdownButtonClass}
//             >

//               <span className="flex items-center gap-3">
//                 <ShieldCheck size={18} />
//                 IQAC
//               </span>

//               {openMenus.iqac ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}

//             </button>

//             {openMenus.iqac && (
//               <div
//                 className="
//                   mt-1
//                   ml-5
//                   space-y-0.5
//                   border-l
//                   border-slate-200
//                   pl-2
//                 "
//               >

//                 <NavLink
//                   to="/admin/iqac/about"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   About IQAC
//                 </NavLink>

//                 <NavLink
//                   to="/admin/iqac/vision-mission"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   Vision & Mission
//                 </NavLink>

//                 <NavLink
//                   to="/admin/iqac/composition"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   IQAC Composition
//                 </NavLink>

//                 <NavLink
//                   to="/admin/iqac/coordinator"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   Coordinator
//                 </NavLink>

//                 <NavLink
//                   to="/admin/iqac/quality-initiatives"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   Quality Initiatives
//                 </NavLink>

//                 <NavLink
//                   to="/admin/iqac/reports"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   Reports & Records
//                 </NavLink>

//               </div>
//             )}

//           </div>

//           {/* =====================================================
//               ACCREDITATION
//           ===================================================== */}

//           <div className="mt-1">

//             <button
//               type="button"
//               onClick={() => toggleMenu("accreditation")}
//               className={dropdownButtonClass}
//             >

//               <span className="flex items-center gap-3">
//                 <Award size={18} />
//                 Accreditation
//               </span>

//               {openMenus.accreditation ? (
//                 <ChevronDown size={16} />
//               ) : (
//                 <ChevronRight size={16} />
//               )}

//             </button>

//             {openMenus.accreditation && (
//               <div
//                 className="
//                   mt-1
//                   ml-5
//                   space-y-0.5
//                   border-l
//                   border-slate-200
//                   pl-2
//                 "
//               >

//                 <NavLink
//                   to="/admin/accreditation"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Award size={16} />
//                   NAAC
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/iiqa"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <FileText size={16} />
//                   IIQA
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/ssr"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <FileText size={16} />
//                   SSR
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/dvv"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <FileText size={16} />
//                   DVV Clarifications
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/aqar"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <FolderOpen size={16} />
//                   AQAR
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/certificates"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <Award size={16} />
//                   NAAC Certificates
//                 </NavLink>

//                 <NavLink
//                   to="/admin/accreditation/criteria"
//                   className={subNavClass}
//                   onClick={closeSidebar}
//                 >
//                   <FolderOpen size={16} />
//                   Criteria-wise Documents
//                 </NavLink>

//               </div>
//             )}

//           </div>

//           {/* =====================================================
//               SEPARATOR
//           ===================================================== */}

//           <div className="my-4 border-t border-slate-200" />

//           {/* =====================================================
//               GALLERY
//           ===================================================== */}

//           <NavLink
//             to="/admin/gallery"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <Images size={18} />
//             <span>Gallery</span>
//           </NavLink>

//           {/* =====================================================
//               DOWNLOADS
//           ===================================================== */}

//           <NavLink
//             to="/admin/downloads"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <Download size={18} />
//             <span>Downloads</span>
//           </NavLink>

//           {/* =====================================================
//               LIBRARY
//           ===================================================== */}

//           <NavLink
//             to="/admin/library"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <BookOpen size={18} />
//             <span>Library</span>
//           </NavLink>

//           {/* =====================================================
//               FOOTER
//           ===================================================== */}

//           <NavLink
//             to="/admin/footer"
//             className={mainNavClass}
//             onClick={closeSidebar}
//           >
//             <FileText size={18} />
//             <span>Footer</span>
//           </NavLink>

//         </nav>

//         {/* =======================================================
//             SIDEBAR FOOTER
//         ======================================================= */}

//         <div
//           className="
//             shrink-0
//             border-t
//             border-slate-200
//             bg-white
//             p-4
//           "
//         >

//           <div
//             className="
//               flex
//               items-center
//               gap-3
//               rounded-xl
//               bg-slate-50
//               px-3
//               py-3
//             "
//           >

//             <div
//               className="
//                 flex
//                 h-9
//                 w-9
//                 items-center
//                 justify-center
//                 rounded-lg
//                 bg-white
//                 text-[#0f3262]
//                 shadow-sm
//               "
//             >
//               <Settings size={17} />
//             </div>

//             <div className="min-w-0">

//               <p
//                 className="
//                   truncate
//                   text-xs
//                   font-semibold
//                   text-slate-700
//                 "
//               >
//                 CMS Administration
//               </p>

//               <p
//                 className="
//                   mt-0.5
//                   text-[10px]
//                   text-slate-400
//                 "
//               >
//                 Senior College
//               </p>

//             </div>

//           </div>

//         </div>

//       </aside>

//       {/* =========================================================
//           MAIN CONTENT AREA
//       ========================================================= */}

//       <div className="flex min-w-0 flex-1 flex-col">

//         {/* =======================================================
//             MOBILE HEADER
//         ======================================================= */}

//         <header
//           className="
//             sticky
//             top-0
//             z-30
//             flex
//             h-[68px]
//             shrink-0
//             items-center
//             border-b
//             border-slate-200
//             bg-white
//             px-4
//             lg:hidden
//           "
//         >

//           <button
//             type="button"
//             onClick={() => setSidebarOpen(true)}
//             aria-label="Open navigation"
//             className="
//               rounded-xl
//               p-2.5
//               text-slate-600
//               transition
//               hover:bg-slate-100
//             "
//           >
//             <Menu size={21} />
//           </button>

//           <div className="ml-3">

//             <p
//               className="
//                 text-sm
//                 font-bold
//                 text-slate-900
//               "
//             >
//               College CMS
//             </p>

//             <p
//               className="
//                 text-[11px]
//                 text-slate-400
//               "
//             >
//               Administration Panel
//             </p>

//           </div>

//         </header>

//         {/* =======================================================
//             PAGE CONTENT
//         ======================================================= */}

//         <main
//           className="
//             min-w-0
//             flex-1
//           "
//         >
//           <Outlet />
//         </main>

//       </div>

//     </div>
//   );
// }

// export default AdminLayout;


import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { studentsEraPages } from "../../../features/public/students-era/studentsEraPages";

import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Images,
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Image,
  BarChart3,
  MessageSquareText,
  CalendarDays,
  Trophy,
  PlayCircle,
  BriefcaseBusiness,
  Link2,
  Megaphone,
  Newspaper,
  UsersRound,
  Award,
  Settings,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Admin Layout
|--------------------------------------------------------------------------
*/

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openMenus, setOpenMenus] = useState({
    header: false,
    homepage: false,
    studentsEra: true,
    departments: false,
    accreditation: false,
  });

  /*
  |--------------------------------------------------------------------------
  | Toggle Dropdown
  |--------------------------------------------------------------------------
  */

  const toggleMenu = (menu) => {
    setOpenMenus((previous) => ({
      ...previous,
      [menu]: !previous[menu],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Close Mobile Sidebar
  |--------------------------------------------------------------------------
  */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Main Navigation
  |--------------------------------------------------------------------------
  */

  const mainNavClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      rounded-xl
      px-3
      py-2.5
      text-sm
      transition-all
      duration-200
      ${isActive
      ? "bg-[#0f3262] font-semibold text-white shadow-sm"
      : "font-medium text-slate-600 hover:bg-slate-100 hover:text-[#0f3262]"
    }
    `;

  /*
  |--------------------------------------------------------------------------
  | Sub Navigation
  |--------------------------------------------------------------------------
  */

  const subNavClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      rounded-lg
      px-3
      py-2
      text-[13px]
      transition-all
      duration-200
      ${isActive
      ? "bg-blue-50 font-semibold text-[#0f3262]"
      : "font-medium text-slate-500 hover:bg-slate-100 hover:text-[#0f3262]"
    }
    `;

  /*
  |--------------------------------------------------------------------------
  | Dropdown Header
  |--------------------------------------------------------------------------
  */

  const dropdownButtonClass = `
    flex
    w-full
    items-center
    justify-between
    rounded-xl
    px-3
    py-2.5
    text-sm
    font-semibold
    text-slate-700
    transition-all
    duration-200
    hover:bg-slate-100
    hover:text-[#0f3262]
  `;

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-slate-900/30
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-200
          bg-slate-50
          shadow-sm
          transition-transform
          duration-300
          lg:static
          lg:translate-x-0
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* =======================================================
            BRAND
        ======================================================= */}

        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-5
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#0f3262]
                text-white
                shadow-sm
              "
            >
              <Building2 size={20} />
            </div>

            <div className="min-w-0">

              <h1
                className="
                  truncate
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Admin Dashboard
              </h1>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  font-medium
                  text-slate-400
                "
              >
                Administration Panel
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              lg:hidden
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================= */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >

          {/* =====================================================
              SECTION LABEL
          ===================================================== */}

          <div
            className="
              mb-2
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
          >
            Main Navigation
          </div>

          {/* =====================================================
              DASHBOARD
          ===================================================== */}

          <NavLink
            to="/admin"
            end
            className={mainNavClass}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/library"
            className={mainNavClass}
            onClick={closeSidebar}
          >
            <BookOpen size={18} />
            <span>Library</span>
          </NavLink>

          {/* =====================================================
              TOPBAR
          ===================================================== */}

          {/* <NavLink
            to="/admin/topbar"
            className={mainNavClass}
            onClick={closeSidebar}
          >
            <PanelTop size={18} />
            <span>TopBar</span>
          </NavLink> */}

          {/* =====================================================
              HEADER & COLLEGE IDENTITY
          ===================================================== */}

          <div className="mt-1">
            <button
              type="button"
              onClick={() => toggleMenu("header")}
              className={dropdownButtonClass}
              aria-expanded={openMenus.header}
            >
              <span className="flex items-center gap-3">
                <Building2 size={18} />
                Header &amp; College Identity
              </span>
              {openMenus.header ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openMenus.header && (
              <div className="mt-1 ml-5 space-y-0.5 border-l border-slate-200 pl-2">
                <NavLink
                  to="/admin/header"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  Header Settings
                </NavLink>
                <NavLink
                  to="/admin/college-status"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  College Status
                </NavLink>
              </div>
            )}
          </div>

          {/* =====================================================
              HOMEPAGE
          ===================================================== */}

          <div className="mt-1">

            <button
              type="button"
              onClick={() => toggleMenu("homepage")}
              className={dropdownButtonClass}
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                Homepage
              </span>

              {openMenus.homepage ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus.homepage && (
              <div
                className="
                  mt-1
                  ml-5
                  space-y-0.5
                  border-l
                  border-slate-200
                  pl-2
                "
              >

                {/* Hero Slider */}

                <NavLink
                  to="/admin/homepage/hero-slider"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Image size={16} />
                  Hero Slider
                </NavLink>

                {/* Statistics */}

                <NavLink
                  to="/admin/homepage/statistics"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <BarChart3 size={16} />
                  Statistics
                </NavLink>

                {/* About College */}

                <NavLink
                  to="/admin/homepage/aboutcollege"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  About College
                </NavLink>

                {/* Welcome */}

                <NavLink
                  to="/admin/homepage/welcome"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <MessageSquareText size={16} />
                  Principal Welcome
                </NavLink>

                {/* Events */}

                <NavLink
                  to="/admin/homepage/events"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <CalendarDays size={16} />
                  Events
                </NavLink>

                {/* Achievements */}

                <NavLink
                  to="/admin/homepage/achievements"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Trophy size={16} />
                  Achievements
                </NavLink>

                {/* YouTube */}

                <NavLink
                  to="/admin/homepage/youtube"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <PlayCircle size={16} />
                  YouTube
                </NavLink>

                {/* Home Placements */}

                <NavLink
                  to="/admin/homepage/placements"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <BriefcaseBusiness size={16} />
                  Home Placements
                </NavLink>

                {/* Home Gallery */}

                <NavLink
                  to="/admin/homepage/gallery"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Images size={16} />
                  Home Gallery
                </NavLink>

                {/* Quick Links */}

                <NavLink
                  to="/admin/homepage/quick-links"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Link2 size={16} />
                  Quick Links
                </NavLink>

                {/* Breaking News */}

                <NavLink
                  to="/admin/homepage/breaking-news"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Megaphone size={16} />
                  Breaking News
                </NavLink>

                {/* News & Notices */}

                <NavLink
                  to="/admin/homepage/news-notices"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Newspaper size={16} />
                  News & Notices
                </NavLink>

              </div>
            )}

          </div>

          {/* =====================================================
              STUDENTS' ERA
          ===================================================== */}

          <div className="mt-1">
            <button
              type="button"
              onClick={() => toggleMenu("studentsEra")}
              className={dropdownButtonClass}
              aria-expanded={openMenus.studentsEra}
            >
              <span className="flex items-center gap-3">
                <BookOpen size={18} />
                Students' Era
              </span>
              {openMenus.studentsEra ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openMenus.studentsEra && (
              <div className="mt-1 ml-5 space-y-0.5 border-l border-slate-200 pl-2">
                {studentsEraPages.map(({ pageKey, title }) => {
                  const suffix = pageKey === "students-era" ? "overview" : pageKey.replace("students-era-", "");
                  return (
                    <NavLink
                      key={pageKey}
                      to={`/admin/students-era/${suffix}`}
                      className={subNavClass}
                      onClick={closeSidebar}
                    >
                      <FileText size={16} />
                      {title}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* =====================================================
              DEPARTMENTS
          ===================================================== */}

          <div className="mt-1">

            <button
              type="button"
              onClick={() => toggleMenu("departments")}
              className={dropdownButtonClass}
            >
              <span className="flex items-center gap-3">
                <UsersRound size={18} />
                Departments
              </span>

              {openMenus.departments ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {openMenus.departments && (
              <div
                className="
        mt-1
        ml-5
        space-y-0.5
        border-l
        border-slate-200
        pl-2
      "
              >

                <NavLink
                  to="/admin/departments"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  Manage Departments
                </NavLink>

                <NavLink
                  to="/admin/departments/new"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  Add Department
                </NavLink>

                <NavLink
                  to="/admin/department-profiles"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  Department Profiles
                </NavLink>

                <NavLink
                  to="/admin/department-programmes"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <BookOpen size={16} />
                  Academic Programmes
                </NavLink>

                <NavLink
                  to="/admin/department-sections"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <FileText size={16} />
                  Department Page Sections
                </NavLink>

                <NavLink
                  to="/admin/department-faculty"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <UsersRound size={16} />
                  Faculty and Staff
                </NavLink>

                <NavLink
                  to="/admin/facilities"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Building2 size={16} />
                  Campus Facilities
                </NavLink>

              </div>
            )}

          </div>

          {/* =====================================================
              ACCREDITATION
          ===================================================== */}

          <div className="mt-1">

            <button
              type="button"
              onClick={() =>
                toggleMenu("accreditation")
              }
              className={dropdownButtonClass}
            >

              <span className="flex items-center gap-3">
                <Award size={18} />
                Accreditation
              </span>

              {openMenus.accreditation ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}

            </button>

            {openMenus.accreditation && (
              <div
                className="
                  mt-1
                  ml-5
                  space-y-0.5
                  border-l
                  border-slate-200
                  pl-2
                "
              >

                <NavLink
                  to="/admin/pages"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <FileText size={16} />
                  Manage Pages
                </NavLink>

                <NavLink
                  to="/admin/accreditation/criteria"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <Award size={16} />
                  NAAC Criteria &amp; Documents
                </NavLink>

                <NavLink to="/admin/aqar" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  AQAR Reports
                </NavLink>

                <NavLink to="/admin/extension-profile" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Extension Profile
                </NavLink>

                <NavLink to="/admin/extension-documents" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Criteria Extension Documents
                </NavLink>

                <NavLink to="/admin/naac/best-practices" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Best Practices
                </NavLink>

                <NavLink
                  to="/admin/committees"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <FileText size={16} />
                  Committee PDFs
                </NavLink>

                <NavLink
                  to="/admin/management-committees"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <UsersRound size={16} />
                  Management Committees
                </NavLink>

                <NavLink
                  to="/admin/iqac"
                  className={subNavClass}
                  onClick={closeSidebar}
                >
                  <FileText size={16} />
                  IQAC
                </NavLink>

                <NavLink to="/admin/feedback" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Feedback Documents
                </NavLink>
                <NavLink to="/admin/audit" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Audit Documents
                </NavLink>
                <NavLink to="/admin/recognition-rankings" className={subNavClass} onClick={closeSidebar}>
                  <Award size={16} />
                  Recognition &amp; Rankings
                </NavLink>
                <NavLink to="/admin/mandatory-disclosure" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Mandatory Disclosure
                </NavLink>
                <NavLink to="/admin/iqac/annual-reports" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  IQAC Annual Reports
                </NavLink>
                <NavLink to="/admin/iqac/archive" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  IQAC Archive
                </NavLink>
                <NavLink to="/admin/iqac/action-taken" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  Action Taken Reports
                </NavLink>
                <NavLink to="/admin/naac-documents" className={subNavClass} onClick={closeSidebar}>
                  <FileText size={16} />
                  NAAC Documents
                </NavLink>

              </div>
            )}

          </div>

          {/* =====================================================
              SEPARATOR
          ===================================================== */}

          <div className="my-4 border-t border-slate-200" />

          {/* =====================================================
              GALLERY
          ===================================================== */}

          <NavLink
            to="/admin/homepage/gallery"
            className={mainNavClass}
            onClick={closeSidebar}
          >
            <Images size={18} />
            <span>Gallery</span>
          </NavLink>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <NavLink
            to="/admin/footer"
            className={mainNavClass}
            onClick={closeSidebar}
          >
            <FileText size={18} />
            <span>Footer</span>
          </NavLink>

        </nav>

        {/* =======================================================
            SIDEBAR FOOTER
        ======================================================= */}

        <div
          className="
            shrink-0
            border-t
            border-slate-200
            bg-white
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-slate-50
              px-3
              py-3
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-white
                text-[#0f3262]
                shadow-sm
              "
            >
              <Settings size={17} />
            </div>

            <div className="min-w-0">

              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                  text-slate-700
                "
              >
                CMS Administration
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-slate-400
                "
              >
                Senior College
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* =========================================================
          MAIN CONTENT AREA
      ========================================================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* =======================================================
            MOBILE HEADER
        ======================================================= */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-[68px]
            shrink-0
            items-center
            border-b
            border-slate-200
            bg-white
            px-4
            lg:hidden
          "
        >

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="
              rounded-xl
              p-2.5
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            <Menu size={21} />
          </button>

          <div className="ml-3">

            <p
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              College CMS
            </p>

            <p
              className="
                text-[11px]
                text-slate-400
              "
            >
              Administration Panel
            </p>

          </div>

        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <main
          className="
            min-w-0
            flex-1
            px-4
            py-5
            md:px-6
            lg:px-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;