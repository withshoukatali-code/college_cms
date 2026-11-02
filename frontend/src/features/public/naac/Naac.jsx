import { useState } from "react";
import {
  Award,
  ChevronDown,
  ChevronRight,
  FileCheck,
  FileText,
  Landmark,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

export default function Naac() {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  /*
   * NAAC SIDEBAR
   *
   * DVV and its child pages have been completely removed.
   */
  const sidebarItems = [
    {
      title: "NAAC Overview",
      path: "/naac",
    },
    {
      title: "NAAC Criteria",
      path: "/naac/criteria",
    },
    {
      title: "SSR",
      path: "/naac/ssr",
    },
    {
      title: "AQAR",
      path: "/naac/aqar",
    },
    {
      title: "IQAC",
      path: "/iqac",
    },
    {
      title: "Best Practices",
      path: "/naac/best-practices",
    },
    {
      title: "NAAC Documents",
      path: "/naac/documents",
    },
    {
      title: "Certificates",
      path: "/naac/certificates",
    },
    {
      title: "Affiliation Documents",
      path: "/naac/affiliation",
    },
  ];

  /*
   * NAAC LANDING PAGE CARDS
   *
   * Self Study and DVV are removed.
   * IQAC and Best Practices are included.
   */
  const naacHighlights = [
    {
      title: "NAAC Criteria",
      description:
        "Explore the seven NAAC assessment criteria, their sub-criteria, supporting information and institutional quality indicators.",
      path: "/naac/criteria",
      icon: FileCheck,
      label: "Assessment Framework",
    },
    {
      title: "IQAC",
      description:
        "Internal Quality Assurance Cell, quality initiatives, meetings, reports and institutional quality improvement activities.",
      path: "/iqac",
      icon: Landmark,
      label: "Quality Assurance",
    },
    {
      title: "Best Practices",
      description:
        "Institutional best practices, initiatives, activities, outcomes, impact and supporting evidence.",
      path: "/naac/best-practices",
      icon: Award,
      label: "Institutional Quality",
    },
    {
      title: "AQAR",
      description:
        "Annual Quality Assurance Reports documenting institutional quality initiatives, academic progress and continuous improvement.",
      path: "/naac/aqar",
      icon: FileText,
      label: "Annual Reports",
    },
  ];

  const isActive = (item) => {
    const currentPath = location.pathname;

    if (item.path === "/naac") {
      return currentPath === "/naac";
    }

    if (item.path === "/naac/criteria") {
      return currentPath === "/naac/criteria" ||
        currentPath.startsWith("/naac/criteria/");
    }

    return currentPath === item.path;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <TopBar />
      <Navbar />

      {/* PAGE HEADER */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wider uppercase text-blue-700 mb-3">
              Accreditation & Quality Assurance
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
              NAAC Accreditation
            </h1>

            <div className="mt-4 h-1 w-16 bg-blue-700 rounded-full" />

            <p className="mt-5 text-base md:text-lg leading-8 text-slate-600">
              Access institutional information, NAAC criteria, quality
              assurance initiatives, annual quality reports, best practices
              and important accreditation documents.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT CONTENT */}
          <section className="lg:col-span-8">
            {/* INTRODUCTION */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-blue-700" />
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    National Assessment and Accreditation Council
                  </h2>

                  <p className="mt-4 text-sm md:text-base leading-7 text-slate-600">
                    This section provides access to the institution's
                    accreditation-related information and quality assurance
                    activities. The available resources cover NAAC criteria,
                    institutional quality initiatives, annual quality reports,
                    best practices and supporting institutional documents.
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACCESS */}
            <div className="mt-8">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-blue-700">
                    Explore
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                    Quick Access
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {naacHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-700 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-700 transition-colors duration-200">
                            <Icon className="w-5 h-5 text-blue-700 group-hover:text-white transition-colors duration-200" />
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-wider text-blue-700 font-semibold">
                              {item.label}
                            </p>

                            <h3 className="text-lg font-semibold text-slate-900 mt-1 group-hover:text-blue-800 transition-colors">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>

                      <p className="text-sm text-slate-600 mt-4 leading-6">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* QUALITY ASSURANCE INFORMATION */}
            <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Quality Assurance & Continuous Improvement
                  </h2>

                  <p className="mt-4 text-sm md:text-base leading-7 text-slate-600">
                    The institution's quality assurance framework brings
                    together academic planning, internal quality initiatives,
                    assessment and accreditation documentation, annual quality
                    reporting and institutional best practices.
                  </p>

                  <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
                    Use the sections above to access the relevant institutional
                    information and supporting documents maintained through the
                    College CMS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* SIDEBAR HEADER */}
                <div className="px-5 py-4 bg-slate-900">
                  <h2 className="text-base font-semibold text-white">
                    NAAC & Quality Assurance
                  </h2>

                  <p className="text-xs text-slate-300 mt-1">
                    Institutional accreditation resources
                  </p>
                </div>

                {/* SIDEBAR ITEMS */}
                <nav className="p-2">
                  {sidebarItems.map((item) => {
                    const active = isActive(item);
                    const hasChildren =
                      Array.isArray(item.children) &&
                      item.children.length > 0;

                    const menuOpen = !!openMenus[item.title];

                    return (
                      <div key={item.title}>
                        {hasChildren ? (
                          <>
                            <button
                              type="button"
                              onClick={() => toggleMenu(item.title)}
                              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                                active || menuOpen
                                  ? "bg-blue-50 text-blue-800"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                              }`}
                            >
                              <span>{item.title}</span>

                              {menuOpen ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>

                            {menuOpen && (
                              <div className="ml-4 mt-1 mb-1 border-l border-slate-200 pl-2">
                                {item.children.map((child) => {
                                  const childActive =
                                    location.pathname === child.path;

                                  return (
                                    <Link
                                      key={child.title}
                                      to={child.path}
                                      className={`block px-3 py-2.5 rounded-md text-sm transition ${
                                        childActive
                                          ? "bg-blue-50 text-blue-800 font-medium"
                                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-800"
                                      }`}
                                    >
                                      {child.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                              active
                                ? "bg-blue-50 text-blue-800"
                                : "text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                            }`}
                          >
                            <span>{item.title}</span>

                            <ChevronRight
                              className={`w-4 h-4 transition ${
                                active
                                  ? "text-blue-700"
                                  : "text-slate-300"
                              }`}
                            />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* SIDEBAR NOTE */}
              <div className="mt-5 bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider font-semibold text-blue-700">
                  Institutional Quality
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Access quality assurance initiatives, accreditation
                  information and institutional documents from the sections
                  provided above.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}