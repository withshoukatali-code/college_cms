import {
  Home,
  Building2,
  FileText,
  Image,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";

const cards = [
  {
    title: "Homepage",
    description:
      "Manage slider, welcome message, principal, events and achievements.",
    icon: Home,
    path: "/admin/homepage",
  },
  {
    title: "Departments",
    description:
      "Create and manage college departments and their information.",
    icon: Building2,
    path: "/admin/departments",
  },
  // {
  //   title: "News & Notices",
  //   description:
  //     "Manage college news, notices, announcements and important updates.",
  //   icon: Bell,
  //   path: "/admin/news-notices",
  // },
  // {
  //   title: "Events",
  //   description:
  //     "Manage upcoming events and college activities.",
  //   icon: CalendarDays,
  //   path: "/admin/events",
  // },
  {
    title: "NAAC Criteria & Documents",
    description:
      "Manage criteria, criterion points and supporting documents.",
    icon: FileText,
    path: "/admin/accreditation/criteria",
  },
  {
    title: "Gallery",
    description:
      "Manage campus, events and institutional photographs.",
    icon: Image,
    path: "/admin/gallery",
  },
  {
    title: "Library",
    description: "Manage Library Services & Facilities and working hours.",
    icon: BookOpen,
    path: "/admin/library",
  },
  {
    title: "Founder Page",
    description: "Manage the founder's profile, biography, image, and documents.",
    icon: FileText,
    path: "/admin/founder",
  },
  {
    title: "Students' Era",
    description: "Manage the overview and dedicated content pages for each student section.",
    icon: BookOpen,
    path: "/admin/students-era/overview",
  },
  {
    title: "Website Pages",
    description: "Manage Founder, Sanstha, Students' Era and other page content.",
    icon: FileText,
    path: "/admin/pages",
  },
  {
    title: "Feedback Documents",
    description: "Manage feedback titles, categories and PDF uploads.",
    icon: FileText,
    path: "/admin/feedback",
  },
  {
    title: "Audit Documents",
    description: "Manage audit reports and associated PDF files.",
    icon: FileText,
    path: "/admin/audit",
  },
];

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* =====================================================
          HEADING
      ====================================================== */}

      <div className="mb-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome to College CMS
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your college website, academic information,
          accreditation content and institutional records from one place.
        </p>

      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* HOMEPAGE */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Homepage Sections
          </p>

          <div className="mt-3 flex items-end justify-between">

            <span className="text-3xl font-bold text-[#0f3262]">
              8
            </span>

            <TrendingUp
              size={20}
              className="text-emerald-500"
            />

          </div>

        </div>

        {/* DEPARTMENTS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Departments
          </p>

          <div className="mt-3 text-3xl font-bold text-[#0f3262]">
            0
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Database controlled
          </p>

        </div>

        {/* EVENTS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Events
          </p>

          <div className="mt-3 text-3xl font-bold text-[#0f3262]">
            0
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Database controlled
          </p>

        </div>

        {/* DOCUMENTS */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Documents
          </p>

          <div className="mt-3 text-3xl font-bold text-[#0f3262]">
            0
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Database controlled
          </p>

        </div>

      </div>

      {/* =====================================================
          MANAGEMENT HEADER
      ====================================================== */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a section to manage
          </p>

        </div>

      </div>

      {/* =====================================================
          MANAGEMENT CARDS
      ====================================================== */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <Link
              key={card.path}
              to={card.path}
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-md
              "
            >

              {/* ICON + ARROW */}

              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-[#0f3262]
                  "
                >
                  <Icon size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="
                    text-slate-300
                    transition
                    group-hover:translate-x-1
                    group-hover:text-blue-600
                  "
                />

              </div>

              {/* TITLE */}

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {card.title}
              </h3>

              {/* DESCRIPTION */}

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>

            </Link>
          );

        })}

      </div>

    </div>
  );
}

export default AdminDashboard;