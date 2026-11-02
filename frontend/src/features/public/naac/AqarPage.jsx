import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Download,
  FileText,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SidebarLink({
  to,
  label,
  active = false,
}) {
  return (
    <Link
      to={to}
      className={`block border-b border-gray-100 px-4 py-3 text-sm transition ${
        active
          ? "bg-blue-50 font-semibold text-blue-700"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      {label}
    </Link>
  );
}

/* =========================================================
   AQAR PAGE
========================================================= */

export default function AqarPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openYear, setOpenYear] = useState(null);

  /* =======================================================
     FETCH DOCUMENTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/naac/aqar`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `API request failed with status ${response.status}`
          );
        }

        if (result?.success !== true) {
          throw new Error(
            result?.message ||
              "Unable to load AQAR documents."
          );
        }

        const activeDocuments =
          Array.isArray(result.data)
            ? result.data.filter(
                (item) =>
                  Number(item.is_active) === 1
              )
            : [];

        if (!mounted) return;

        setDocuments(activeDocuments);

        if (activeDocuments.length > 0) {
          const firstYear =
            activeDocuments[0].academic_year;

          setOpenYear(firstYear);
        } else {
          setOpenYear(null);
        }
      } catch (err) {
        console.error(
          "AQAR PUBLIC PAGE ERROR:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load AQAR documents."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDocuments();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     GROUP BY ACADEMIC YEAR
  ======================================================= */

  const groupedDocuments = useMemo(() => {
    const groups = {};

    documents.forEach((document) => {
      const year =
        document.academic_year || "Other";

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(document);
    });

    Object.keys(groups).forEach((year) => {
      groups[year].sort(
        (a, b) =>
          Number(a.display_order || 0) -
            Number(b.display_order || 0) ||
          Number(a.id || 0) -
            Number(b.id || 0)
      );
    });

    return Object.entries(groups).sort(
      ([yearA], [yearB]) =>
        yearB.localeCompare(yearA)
    );
  }, [documents]);

  /* =======================================================
     FILE URL
  ======================================================= */

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `${API_BASE}${filePath}`;
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <>
        <TopBar />
        <Navbar />

        <main className="min-h-[60vh] bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

            <p className="mt-4 text-sm text-gray-600">
              Loading AQAR documents...
            </p>
          </div>
        </main>

        <PublicFooter />
      </>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <>
      <TopBar />
      <Navbar />

      {/* ===================================================
          PAGE BANNER
      =================================================== */}

      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              NAAC Accreditation
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Annual Quality Assurance Report
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Annual Quality Assurance Reports and
              supporting documents of the institution.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* =============================================
                DOCUMENTS
            ============================================= */}

            <section>
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Quality Assurance
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  AQAR Reports
                </h2>

                <div className="mt-3 h-1 w-14 rounded-full bg-blue-700" />
              </div>

              {error && (
                <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Unable to load AQAR documents
                    </p>

                    <p className="mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {!error &&
                groupedDocuments.length === 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <FolderOpen
                      size={42}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="mt-4 text-lg font-semibold text-gray-800">
                      No AQAR documents available
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      AQAR reports will appear here
                      once they are published by the
                      institution.
                    </p>
                  </div>
                )}

              <div className="space-y-4">
                {groupedDocuments.map(
                  ([year, yearDocuments]) => {
                    const isOpen =
                      openYear === year;

                    return (
                      <div
                        key={year}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                      >
                        {/* YEAR HEADER */}

                        <button
                          type="button"
                          onClick={() =>
                            setOpenYear(
                              isOpen ? null : year
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <FolderOpen
                                size={19}
                              />
                            </div>

                            <div>
                              <p className="text-base font-semibold text-gray-900">
                                Academic Year{" "}
                                {year}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {yearDocuments.length}{" "}
                                document
                                {yearDocuments.length !==
                                1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <ChevronDown
                            size={20}
                            className={`shrink-0 text-gray-500 transition-transform ${
                              isOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {/* DOCUMENT LIST */}

                        {isOpen && (
                          <div className="border-t border-gray-100">
                            <div className="divide-y divide-gray-100">
                              {yearDocuments.map(
                                (document) => {
                                  const fileUrl =
                                    getFileUrl(
                                      document.document_file
                                    );

                                  return (
                                    <div
                                      key={
                                        document.id
                                      }
                                      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                      <div className="flex min-w-0 gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                          <FileText
                                            size={
                                              21
                                            }
                                          />
                                        </div>

                                        <div className="min-w-0">
                                          <h3 className="font-semibold text-gray-900">
                                            {
                                              document.document_title
                                            }
                                          </h3>

                                          {document.document_type && (
                                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-600">
                                              {
                                                document.document_type
                                              }
                                            </p>
                                          )}

                                          {document.description && (
                                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                              {
                                                document.description
                                              }
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {fileUrl ? (
                                        <a
                                          href={
                                            fileUrl
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                                        >
                                          <Download
                                            size={
                                              17
                                            }
                                          />

                                          View /
                                          Download
                                        </a>
                                      ) : (
                                        <span className="inline-flex shrink-0 items-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500">
                                          Document
                                          unavailable
                                        </span>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* =============================================
                SIDEBAR
            ============================================= */}

            <aside>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="bg-blue-900 px-5 py-4">
                  <h2 className="text-base font-semibold text-white">
                    NAAC
                  </h2>

                  <p className="mt-1 text-xs text-blue-200">
                    Accreditation Information
                  </p>
                </div>

                <nav>
                  <SidebarLink
                    to="/naac"
                    label="NAAC Overview"
                  />

                  <SidebarLink
                    to="/naac/criteria"
                    label="NAAC Criteria"
                  />

                  <SidebarLink
                    to="/naac/ssr"
                    label="SSR"
                  />

                  <SidebarLink
                    to="/naac/aqar"
                    label="AQAR"
                    active
                  />

                  <SidebarLink
                    to="/iqac"
                    label="IQAC"
                  />

                  <SidebarLink
                    to="/naac/best-practices"
                    label="Best Practices"
                  />

                  <SidebarLink
                    to="/naac/documents"
                    label="NAAC Documents"
                  />

                  <SidebarLink
                    to="/naac/certificates"
                    label="Certificates"
                  />

                  <SidebarLink
                    to="/naac/affiliation"
                    label="Affiliation Documents"
                  />
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}