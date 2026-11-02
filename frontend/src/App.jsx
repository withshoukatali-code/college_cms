import { Routes, Route } from "react-router-dom";

// ============================================================
// PUBLIC WEBSITE
// ============================================================

import HomePage from "./features/public/home/HomePage";
import StaticPage from "./features/public/StaticPage";
import LibraryPage from "./features/public/library/LibraryPage";
import StudentsEraPage from "./features/public/students-era/StudentsEraPage";
import { studentsEraPages } from "./features/public/students-era/studentsEraPages";
import DocumentListingPage from "./features/public/DocumentListingPage";
import CommitteeListingPage from "./features/public/CommitteeListingPage";
import Alumni from "./features/public/accessibility/Alumni";

// ============================================================
// ADMIN
// ============================================================

import AdminLayout from "./pages/public/admin/AdminLayout";
import AdminDashboard from "./pages/public/admin/AdminDashboard";
import AdminHomepage from "./pages/public/admin/AdminHomepage";
import LibraryAdmin from "./pages/public/admin/LibraryAdmin";
import ManagedDocumentsAdmin from "./pages/public/admin/ManagedDocumentsAdmin";
import FooterAdmin from "./pages/public/admin/footer/Footer";


// ============================================================
// DEPARTMENTS
// ============================================================
import DepartmentForm from "./pages/public/admin/department/DepartmentForm";
import Department from "./pages/public/admin/department/Departments";
import DepartmentPage from "./features/public/departments/DepartmentPage";
import NaacPage from "./features/public/naac/NaacPage";
import NaacCriterionPage from "./features/public/naac/NaacCriterionPage";
import NaacAdmin from "./pages/public/admin/naac/NaacAdmin";
import DepartmentCrudPage from "./pages/public/admin/department/DepartmentCrudPage";
//=============================================================
// NAAC
import Naac from "./features/public/naac/Naac";
import ExtensionProfile from "./features/public/naac/ExtensionProfile";
import ExtensionProfileAdmin from "./pages/public/admin/naac/ExtensionProfileAdmin";
import CriteriaExtensionDocuments from "./features/public/naac/CriteriaExtensionDocuments";
import CriteriaExtensionDocumentsAdmin from "./pages/public/admin/naac/CriteriaExtensionDocumentsAdmin";
import AqarAdmin from "./pages/public/admin/naac/AqarAdmin";
import AqarPage from "./features/public/naac/AqarPage";
import BestPracticesAdmin from "./pages/public/admin/naac/BestPracticesAdmin";
import BestPractices from "./features/public/naac/BestPractices";
//=============================================================

// ============================================================
// ADMIN → HOMEPAGE
// ============================================================

import CollegeHeader from "./pages/public/admin/homepage/CollegeHeader";
import HeroSlider from "./pages/public/admin/homepage/HeroSlider";
import HomeStatistics from "./pages/public/admin/homepage/HomeStatistics";
import HomeWelcome from "./pages/public/admin/homepage/HomeWelcome";
import AboutCollege from "./pages/public/admin/homepage/AboutCollege";
import HomeEvents from "./pages/public/admin/homepage/HomeEvents";
import Achievements from "./pages/public/admin/homepage/Achievements";
import HomeYoutube from "./pages/public/admin/homepage/HomeYoutube";
import HomePlacements from "./pages/public/admin/homepage/HomePlacements";
import HomeGallery from "./pages/public/admin/homepage/HomeGallery";
import QuickLinks from "./pages/public/admin/homepage/QuickLinks";
import BreakingNews from "./pages/public/admin/homepage/BreakingNews";
import NewsNotices from "./pages/public/admin/homepage/NewsNotices";
import BottomInstitutional from "./pages/public/admin/homepage/BottomInstitutional";
import IQAC from "./features/public/naac/IQAC";
import IQACAdmin from "./pages/public/admin/naac/IQACAdmin";
import ScreenReader from "./features/public/accessibility/ScreenReader";
import ScreenReaderAdmin from "./pages/public/admin/accessibility/ScreenReaderAdmin";
import CommitteePage from "./features/public/CommitteePage";
import ManagementCommitteePage from "./features/public/ManagementCommitteePage";
import CommitteeDocumentsAdmin from "./pages/public/admin/committees/CommitteeDocumentsAdmin";
import ManagementCommitteesAdmin from "./pages/public/admin/committees/ManagementCommitteesAdmin";
import SitePagesAdmin from "./pages/public/admin/SitePagesAdmin";
import EContentsPage from "./features/public/EContentsPage";
import FacilitiesPage from "./features/public/FacilitiesPage";
import FacilitiesAdmin from "./pages/public/admin/FacilitiesAdmin";
// ============================================================
// APP
// ============================================================

function App() {
  return (
    <Routes>

      {/* ======================================================
          PUBLIC WEBSITE
      ====================================================== */}

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route path="/about" element={<StaticPage pageKey="about" />} />
      <Route path="/about/college-overview" element={<StaticPage pageKey="college-overview" />} />
      <Route path="/about/founder" element={<StaticPage pageKey="founder" />} />
      <Route path="/about/chairman" element={<StaticPage pageKey="chairman" />} />
      <Route path="/about/principal" element={<StaticPage pageKey="principal" />} />
      <Route path="/about/mission-vision" element={<StaticPage pageKey="mission-vision" />} />
      <Route path="/about/legacy" element={<StaticPage pageKey="legacy" />} />
      <Route path="/about/governing-management-committee" element={<ManagementCommitteePage committeeKey="governing-management" />} />
      <Route path="/about/local-management-committee" element={<ManagementCommitteePage committeeKey="local-management" />} />
      <Route path="/programmes" element={<StaticPage pageKey="programmes" />} />
      <Route path="/academics/programmes" element={<StaticPage pageKey="academics-programmes" />} />
      <Route path="/academics/calendar" element={<StaticPage pageKey="academics-calendar" />} />
      <Route path="/admissions" element={<StaticPage pageKey="admissions" />} />
      <Route path="/admissions/process" element={<StaticPage pageKey="admissions-process" />} />
      <Route path="/examinations" element={<StaticPage pageKey="examinations" />} />
      <Route path="/timetable" element={<StaticPage pageKey="timetable" />} />
      <Route path="/results" element={<StaticPage pageKey="results" />} />
      <Route path="/gallery" element={<StaticPage pageKey="gallery" />} />
      <Route path="/useful-links" element={<StaticPage pageKey="useful-links" />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route
        path="/feedback"
        element={<DocumentListingPage moduleKey="feedback" title="Feedback" subtitle="Student and stakeholder feedback" description="Published feedback reports and documents." />}
      />
      <Route path="/facilities" element={<FacilitiesPage />} />
      <Route path="/research" element={<StaticPage pageKey="research" />} />
      <Route path="/downloads" element={<StaticPage pageKey="downloads" />} />
      <Route path="/students-era" element={<StudentsEraPage pageKey="students-era" />} />
      <Route path="/students-era/ncc" element={<StudentsEraPage pageKey="students-era-ncc" />} />
      <Route path="/students-era/nss" element={<StudentsEraPage pageKey="students-era-nss" />} />
      <Route path="/students-era/cultural-activities" element={<StudentsEraPage pageKey="students-era-cultural-activities" />} />
      <Route path="/students-era/womens-empowerment" element={<StudentsEraPage pageKey="students-era-womens-empowerment" />} />
      <Route path="/students-era/sports" element={<StudentsEraPage pageKey="students-era-sports" />} />
      <Route path="/students-era/gym" element={<StudentsEraPage pageKey="students-era-gym" />} />
      <Route path="/students-era/career-guidance" element={<StudentsEraPage pageKey="students-era-career-guidance" />} />
      <Route path="/students-era/seminars" element={<StudentsEraPage pageKey="students-era-seminars" />} />
      <Route path="/students-era/placements" element={<StudentsEraPage pageKey="students-era-placements" />} />
      <Route path="/alumni" element={<Alumni />} />
      <Route path="/e-contents" element={<EContentsPage />} />
      <Route path="/econtents" element={<EContentsPage />} />

      <Route
        path="/departments"
        element={<Department />}
      />

      <Route path="/departments/:slug" element={<DepartmentPage />} />

      <Route path="/naac" element={<Naac />} />
      <Route path="/naac/criterion-1" element={<StaticPage pageKey="naac-criteria" />} />
      <Route path="/naac/criteria" element={<NaacPage />} />
      <Route path="/naac/criteria/:slug" element={<NaacCriterionPage />} />
      <Route path="/naac/ssr" element={<StaticPage pageKey="naac-ssr" />} />
      <Route path="/naac/dvv" element={<StaticPage pageKey="naac-dvv" />} />
      <Route path="/naac/documents" element={<DocumentListingPage moduleKey="naac-documents" title="NAAC Documents" subtitle="Accreditation" />} />
      <Route path="/naac/certificates" element={<DocumentListingPage moduleKey="naac-documents" title="NAAC Documents" subtitle="Accreditation" categoryFilter="NAAC Certificates" />} />
      <Route path="/naac/affiliation" element={<DocumentListingPage moduleKey="naac-documents" title="NAAC Documents" subtitle="Accreditation" categoryFilter="Affiliation Documents" />} />
      <Route path="/naac/best-practices" element={<BestPractices />} />
      <Route path="/naac/aqar" element={<AqarPage />} />
      <Route path="/iqac" element={<StaticPage pageKey="iqac-about" />} />
      <Route path="/iqac/about" element={<StaticPage pageKey="iqac-about" />} />
      <Route path="/iqac/vision-mission" element={<StaticPage pageKey="iqac-vision-mission" />} />
      <Route path="/iqac/committee" element={<StaticPage pageKey="iqac-committee" />} />
      <Route path="/iqac/coordinator" element={<StaticPage pageKey="iqac-coordinator" />} />
      <Route path="/iqac/meetings" element={<IQAC />} />
      <Route path="/iqac/minutes" element={<IQAC />} />
      <Route path="/iqac/action-taken" element={<DocumentListingPage moduleKey="iqac-action-taken" title="Action Taken Reports" subtitle="IQAC · Quality documentation" />} />
      <Route path="/iqac/best-practices" element={<StaticPage pageKey="iqac-best-practices" />} />
      <Route path="/iqac/distinctiveness" element={<StaticPage pageKey="iqac-distinctiveness" />} />
      <Route path="/iqac/audit" element={<DocumentListingPage moduleKey="audit" title="Audit Reports" subtitle="IQAC · Quality initiatives" description="Academic, administrative, environmental, energy, and gender audit documents." />} />
      <Route path="/iqac/aaa" element={<DocumentListingPage moduleKey="audit" title="Audit Reports" subtitle="IQAC · Quality initiatives" />} />
      <Route path="/iqac/green-audit" element={<DocumentListingPage moduleKey="audit" title="Audit Reports" subtitle="IQAC · Quality initiatives" />} />
      <Route path="/iqac/energy-audit" element={<DocumentListingPage moduleKey="audit" title="Audit Reports" subtitle="IQAC · Quality initiatives" />} />
      <Route path="/iqac/gender-audit" element={<DocumentListingPage moduleKey="audit" title="Audit Reports" subtitle="IQAC · Quality initiatives" />} />
      <Route path="/iqac/quality-initiatives" element={<StaticPage pageKey="iqac-quality-initiatives" />} />
      <Route path="/iqac/activities" element={<StaticPage pageKey="iqac-activities" />} />
      <Route path="/iqac/annual-reports" element={<DocumentListingPage moduleKey="iqac-annual-reports" title="IQAC Annual Reports" subtitle="Quality documentation" />} />
      <Route path="/iqac/archive" element={<DocumentListingPage moduleKey="iqac-archive" title="IQAC Archive" subtitle="Quality documents" />} />

      <Route path="/extension-profile" element={<ExtensionProfile />} />
      <Route path="/extension-documents" element={<CriteriaExtensionDocuments />} />

      <Route path="/accreditation/recognition-rankings" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" />} />
      <Route path="/accreditation/nirf" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" categoryFilter="NIRF" />} />
      <Route path="/accreditation/aishe" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" categoryFilter="AISHE" />} />
      <Route path="/accreditation/ugc" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" categoryFilter="UGC Recognition" />} />
      <Route path="/accreditation/affiliation" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" categoryFilter="University Affiliation" />} />
      <Route path="/accreditation/approvals" element={<DocumentListingPage moduleKey="recognition-rankings" title="Recognition & Rankings" subtitle="Accreditation" categoryFilter="Recognition & Approvals" />} />

      <Route path="/mandatory-disclosure" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" />} />
      <Route path="/mandatory-disclosure/rti" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information · RTI" categoryFilter="Right to Information (RTI)" />} />
      <Route path="/mandatory-disclosure/profile" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" categoryFilter="Institution Profile" />} />
      <Route path="/mandatory-disclosure/policies" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" categoryFilter="Policies & Manuals" />} />
      <Route path="/mandatory-disclosure/code-of-conduct" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" categoryFilter="Code of Conduct" />} />
      <Route path="/mandatory-disclosure/service-rules" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" categoryFilter="Service Rules" />} />
      <Route path="/mandatory-disclosure/hr-policy" element={<DocumentListingPage moduleKey="mandatory-disclosure" title="Mandatory Disclosure" subtitle="Public information" categoryFilter="HR Policy" />} />

      <Route path="/accreditation/committees" element={<CommitteeListingPage />} />
      <Route path="/committees/iqac" element={<CommitteePage slug="iqac" />} />
      <Route path="/committees/anti-ragging" element={<CommitteePage slug="anti-ragging" />} />
      <Route path="/committees/grievance" element={<CommitteePage slug="grievance" />} />
      <Route path="/committees/icc" element={<CommitteePage slug="icc" />} />
      <Route path="/committees/sc-st" element={<CommitteePage slug="sc-st" />} />
      <Route path="/committees/obc" element={<CommitteePage slug="obc" />} />
      <Route path="/committees/minority" element={<CommitteePage slug="minority" />} />
      <Route path="/committees/divyang" element={<CommitteePage slug="divyang" />} />
      <Route path="/committees/student-welfare" element={<CommitteePage slug="student-welfare" />} />

      <Route path="/admin/iqac" element={<IQACAdmin />} />

      {/* ==================================
         other 
      ================================== */}

      <Route
        path="/screen-reader"
        element={<ScreenReader />}
      />

      <Route
        path="/admin/screen-reader"
        element={<ScreenReaderAdmin />}
      />
      {/* ======================================================
          ADMIN
          Parent URL: /admin
      ====================================================== */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* ====================================================
            ADMIN DASHBOARD
            URL: /admin
        ==================================================== */}

        <Route
          index
          element={<AdminDashboard />}
        />

        {/* ====================================================
            ADMIN → DEPARTMENTS
          ==================================================== */}

        <Route path="departments/new" element={<DepartmentForm />} />
        <Route path="departments/:id" element={<DepartmentForm />} />
        <Route path="departments" element={<Department />} />
        <Route path="department-profiles" element={<DepartmentCrudPage resource="profiles" />} />
        <Route path="department-programmes" element={<DepartmentCrudPage resource="programmes" />} />
        <Route path="department-sections" element={<DepartmentCrudPage resource="sections" />} />
        <Route path="department-faculty" element={<DepartmentCrudPage resource="faculty" />} />
        <Route path="accessibility/alumni" element={<SitePagesAdmin initialPageKey="alumni" pageKeys={["alumni"]} />} />
        <Route path="facilities" element={<FacilitiesAdmin />} />
        <Route path="library" element={<LibraryAdmin />} />
        <Route path="feedback" element={<ManagedDocumentsAdmin moduleKey="feedback" title="Feedback Documents" requiresPdf />} />
        <Route path="audit" element={<ManagedDocumentsAdmin moduleKey="audit" title="Audit Documents" requiresPdf />} />
        <Route path="recognition-rankings" element={<ManagedDocumentsAdmin moduleKey="recognition-rankings" title="Recognition & Rankings" />} />
        <Route path="mandatory-disclosure" element={<ManagedDocumentsAdmin moduleKey="mandatory-disclosure" title="Mandatory Disclosure Documents" requiresPdf />} />
        <Route path="iqac/annual-reports" element={<ManagedDocumentsAdmin moduleKey="iqac-annual-reports" title="IQAC Annual Reports" requiresPdf />} />
        <Route path="iqac/archive" element={<ManagedDocumentsAdmin moduleKey="iqac-archive" title="IQAC Archive" requiresPdf />} />
        <Route path="iqac/action-taken" element={<ManagedDocumentsAdmin moduleKey="iqac-action-taken" title="IQAC Action Taken Reports" requiresPdf />} />
        <Route path="naac-documents" element={<ManagedDocumentsAdmin moduleKey="naac-documents" title="NAAC Documents" />} />
        <Route path="accreditation/criteria" element={<NaacAdmin />} />
        <Route path="naac" element={<NaacAdmin />} />
        <Route path="accreditation" element={<NaacAdmin />} />
        <Route path="aqar" element={<AqarAdmin />} />
        <Route path="committees" element={<CommitteeDocumentsAdmin />} />
        <Route path="management-committees" element={<ManagementCommitteesAdmin />} />
        <Route path="pages" element={<SitePagesAdmin />} />
        <Route path="founder" element={<SitePagesAdmin initialPageKey="founder" pageKeys={["founder"]} />} />
        {studentsEraPages.map(({ pageKey }) => {
          const suffix = pageKey === "students-era" ? "overview" : pageKey.replace("students-era-", "");
          return (
            <Route
              key={pageKey}
              path={`students-era/${suffix}`}
              element={<SitePagesAdmin initialPageKey={pageKey} pageKeys={[pageKey]} />}
            />
          );
        })}
        <Route path="gallery" element={<HomeGallery />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="header" element={<CollegeHeader />} />
        <Route path="college-status" element={<BottomInstitutional />} />

        {/* NAAC ============================================================ */}
        <Route path="extension-profile" element={<ExtensionProfileAdmin />} />
        <Route path="/admin/extension-profile" element={<ExtensionProfileAdmin />} />
        <Route path="/admin/extension-documents" element={<CriteriaExtensionDocumentsAdmin />} />
        <Route path="/admin/naac/best-practices" element={<BestPracticesAdmin />} />
        {/* ====================================================
            ADMIN → HOMEPAGE
        ==================================================== */}

        {/* ----------------------------------------------------
            COLLEGE HEADER
            URL: /admin/homepage/CollegeHeader
        ---------------------------------------------------- */}

        <Route
          path="homepage/CollegeHeader"
          element={<CollegeHeader />}
        />

        {/* ----------------------------------------------------
            HERO SLIDER
            URL: /admin/homepage/hero-slider
        ---------------------------------------------------- */}

        <Route
          path="homepage/hero-slider"
          element={<HeroSlider />}
        />

        {/* ----------------------------------------------------
            STATISTICS
            URL: /admin/homepage/statistics
        ---------------------------------------------------- */}

        <Route
          path="homepage/statistics"
          element={<HomeStatistics />}
        />

        {/* ----------------------------------------------------
            PRINCIPAL WELCOME
            URL: /admin/homepage/welcome
        ---------------------------------------------------- */}

        <Route
          path="homepage/welcome"
          element={<HomeWelcome />}
        />

        {/* ----------------------------------------------------
            ABOUT COLLEGE
            URL: /admin/homepage/aboutcollege
        ---------------------------------------------------- */}

        <Route
          path="homepage/aboutcollege"
          element={<AboutCollege />}
        />

        {/* ----------------------------------------------------
            EVENTS
            URL: /admin/homepage/events
        ---------------------------------------------------- */}

        <Route
          path="homepage/events"
          element={<HomeEvents />}
        />

        {/* ----------------------------------------------------
            ACHIEVEMENTS
            URL: /admin/homepage/achievements
        ---------------------------------------------------- */}

        <Route
          path="homepage/achievements"
          element={<Achievements />}
        />

        {/* ----------------------------------------------------
            YOUTUBE
            URL: /admin/homepage/youtube
        ---------------------------------------------------- */}

        <Route
          path="homepage/youtube"
          element={<HomeYoutube />}
        />

        {/* ----------------------------------------------------
            HOME PLACEMENTS
            URL: /admin/homepage/placements
        ---------------------------------------------------- */}

        <Route
          path="homepage/placements"
          element={<HomePlacements />}
        />

        {/* ----------------------------------------------------
            HOME GALLERY
            URL: /admin/homepage/gallery
        ---------------------------------------------------- */}

        <Route
          path="homepage/gallery"
          element={<HomeGallery />}
        />

        {/* ----------------------------------------------------
            QUICK LINKS
            URL: /admin/homepage/quick-links
        ---------------------------------------------------- */}

        <Route
          path="homepage/quick-links"
          element={<QuickLinks />}
        />

        {/* ----------------------------------------------------
            BREAKING NEWS
            URL: /admin/homepage/breaking-news
        ---------------------------------------------------- */}

        <Route
          path="homepage/breaking-news"
          element={<BreakingNews />}
        />

        {/* ----------------------------------------------------
            NEWS & NOTICES
            URL: /admin/homepage/news-notices
        ---------------------------------------------------- */}

        <Route
          path="homepage/news-notices"
          element={<NewsNotices />}
        />

        {/* ----------------------------------------------------
            BOTTOM INSTITUTIONAL STRIP
            URL: /admin/homepage/BottomInstitutional
        ---------------------------------------------------- */}

        <Route
          path="homepage/BottomInstitutional"
          element={<BottomInstitutional />}
        />

        {/* ----------------------------------------------------
            FOOTER
            URL: /admin/footer
        ---------------------------------------------------- */}

        <Route
          path="footer"
          element={<FooterAdmin />}
        />

      </Route>
    </Routes>
  );
}

export default App;
