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
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

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
   IQAC PAGE
========================================================= */

export default function IQAC() {
  const [meetings, setMeetings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [openYear, setOpenYear] =
    useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/api/site-pages/iqac-minutes`)
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (mounted && result?.success) setPageInfo(result.data.content);
      })
      .catch((pageError) => console.error("IQAC PAGE CONTENT ERROR:", pageError));
    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     FETCH MEETINGS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/iqac/meetings`
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Request failed with status ${response.status}`
          );
        }

        if (result?.success !== true) {
          throw new Error(
            result?.message ||
              "Unable to load IQAC meetings."
          );
        }

        const activeMeetings =
          Array.isArray(result.data)
            ? result.data.filter(
                (item) =>
                  Number(item.is_active) ===
                  1
              )
            : [];

        if (!mounted) return;

        setMeetings(activeMeetings);

        if (activeMeetings.length > 0) {
          setOpenYear(
            activeMeetings[0]
              .academic_year
          );
        }
      } catch (err) {
        console.error(
          "IQAC PUBLIC ERROR:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load IQAC meetings."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchMeetings();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     GROUP MEETINGS
  ======================================================= */

  const groupedMeetings = useMemo(() => {
    const groups = {};

    meetings.forEach((meeting) => {
      const year =
        meeting.academic_year ||
        "Other";

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(meeting);
    });

    Object.keys(groups).forEach(
      (year) => {
        groups[year].sort(
          (a, b) =>
            Number(
              a.display_order || 0
            ) -
              Number(
                b.display_order || 0
              ) ||
            Number(b.id || 0) -
              Number(a.id || 0)
        );
      }
    );

    return Object.entries(
      groups
    ).sort(([a], [b]) =>
      b.localeCompare(a)
    );
  }, [meetings]);

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
     DATE
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "";

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  return (
    <>
      <TopBar />
      <Navbar />

      {/* =================================================
          BANNER
      ================================================= */}

      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {pageInfo?.subtitle || "Meeting records"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {pageInfo?.title || "IQAC Meetings"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {pageInfo?.description || "Browse IQAC meeting records, minutes, and related documents."}
          </p>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* ===========================================
                CONTENT
            =========================================== */}

            <section>
              {/* MEETINGS */}

              <div className="mt-8">
                <div className="mb-6">
                  {/* <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    IQAC Records
                  </p> */}

                  <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                    IQAC Meetings
                  </h2>

                  <div className="mt-3 h-1 w-14 rounded-full bg-blue-700" />
                </div>

                {loading && (
                  <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

                    <p className="mt-4 text-sm text-gray-500">
                      Loading IQAC meetings...
                    </p>
                  </div>
                )}

                {!loading && error && (
                  <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    <AlertCircle
                      size={20}
                      className="shrink-0"
                    />

                    <div>
                      <p className="font-semibold">
                        Unable to load IQAC
                        meetings
                      </p>

                      <p className="mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {!loading &&
                  !error &&
                  groupedMeetings.length ===
                    0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                      <FileText
                        size={42}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="mt-4 text-lg font-semibold text-gray-800">
                        No IQAC meeting
                        documents available
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Meeting records will
                        appear here once they
                        are published.
                      </p>
                    </div>
                  )}

                {!loading &&
                  !error &&
                  groupedMeetings.length >
                    0 && (
                    <div className="space-y-4">
                      {groupedMeetings.map(
                        ([
                          year,
                          yearMeetings,
                        ]) => {
                          const isOpen =
                            openYear ===
                            year;

                          return (
                            <div
                              key={year}
                              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenYear(
                                    isOpen
                                      ? null
                                      : year
                                  )
                                }
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-blue-50"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                    <FolderOpen
                                      size={
                                        19
                                      }
                                    />
                                  </div>

                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      Academic
                                      Year{" "}
                                      {
                                        year
                                      }
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                      {
                                        yearMeetings.length
                                      }{" "}
                                      meeting
                                      {yearMeetings.length !==
                                      1
                                        ? "s"
                                        : ""}
                                    </p>
                                  </div>
                                </div>

                                <ChevronDown
                                  size={
                                    20
                                  }
                                  className={`text-gray-500 transition-transform ${
                                    isOpen
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>

                              {isOpen && (
                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                  {yearMeetings.map(
                                    (
                                      meeting
                                    ) => {
                                      const fileUrl =
                                        getFileUrl(
                                          meeting.document_file
                                        );

                                      return (
                                        <div
                                          key={
                                            meeting.id
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
                                                  meeting.meeting_title
                                                }
                                              </h3>

                                              {meeting.meeting_date && (
                                                <p className="mt-1 text-xs font-medium text-blue-600">
                                                  Meeting
                                                  Date:{" "}
                                                  {formatDate(
                                                    meeting.meeting_date
                                                  )}
                                                </p>
                                              )}

                                              {meeting.description && (
                                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                                  {
                                                    meeting.description
                                                  }
                                                </p>
                                              )}
                                            </div>
                                          </div>

                                          {fileUrl && (
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

                                              View
                                              /
                                              Download
                                            </a>
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            </section>

            {/* ===========================================
                SIDEBAR
            =========================================== */}

            <aside>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="bg-blue-900 px-5 py-4">
                  <h2 className="font-semibold text-white">
                    NAAC
                  </h2>

                  <p className="mt-1 text-xs text-blue-200">
                    Quality Assurance
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
                  />

                  <SidebarLink
                    to="/iqac"
                    label="IQAC"
                    active
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