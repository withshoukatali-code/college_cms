import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BestPractices() {
  const [practices, setPractices] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [openPractice, setOpenPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD BEST PRACTICES
  ========================================================= */

  useEffect(() => {
    loadPractices();
  }, []);

  const loadPractices = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl =
        `${API_BASE}/api/naac/best-practices`;

      console.log(
        "BEST PRACTICES API:",
        apiUrl
      );

      const response = await fetch(apiUrl);

      console.log(
        "BEST PRACTICES STATUS:",
        response.status
      );

      const result = await response.json();

      console.log(
        "BEST PRACTICES RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `API request failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to load best practices"
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setPractices(data);

      if (data.length > 0) {
        const sortedData = [...data].sort(
          (a, b) =>
            Number(a.display_order || 0) -
            Number(b.display_order || 0)
        );

        const latestYear =
          sortedData[0].academic_year;

        setSelectedYear(latestYear);
        setOpenPractice(sortedData[0].id);
      } else {
        setSelectedYear("");
        setOpenPractice(null);
      }
    } catch (err) {
      console.error(
        "BEST PRACTICES ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load best practices"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ACADEMIC YEARS
  ========================================================= */

  const years = useMemo(() => {
    return [
      ...new Set(
        practices
          .map((item) => item.academic_year)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      String(b).localeCompare(String(a))
    );
  }, [practices]);

  /* =========================================================
     FILTER BY YEAR
  ========================================================= */

  const filteredPractices = useMemo(() => {
    return practices
      .filter(
        (item) =>
          item.academic_year === selectedYear
      )
      .sort(
        (a, b) =>
          Number(a.practice_number || 0) -
          Number(b.practice_number || 0)
      );
  }, [practices, selectedYear]);

  /* =========================================================
     FORMAT PRACTICE NUMBER
  ========================================================= */

  const formatPracticeNumber = (number) => {
    const n = Number(number);

    if (n === 1) return "I";
    if (n === 2) return "II";
    if (n === 3) return "III";
    if (n === 4) return "IV";
    if (n === 5) return "V";
    if (n === 6) return "VI";
    if (n === 7) return "VII";
    if (n === 8) return "VIII";
    if (n === 9) return "IX";
    if (n === 10) return "X";

    return n;
  };

  /* =========================================================
     NORMALIZE FILE URL
  ========================================================= */

  const getFileUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${API_BASE}${
      url.startsWith("/") ? "" : "/"
    }${url}`;
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <TopBar />
        <Navbar />

        <main className="min-h-[500px] bg-[#f7f9fc] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-[#123c69] rounded-full animate-spin mx-auto mb-4" />

            <p className="text-gray-500">
              Loading Best Practices...
            </p>
          </div>
        </main>

        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="bg-[#f7f9fc] min-h-screen">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="bg-[#102f58]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-[0.18em] mb-3">
                NAAC • Institutional Practices
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold text-white">
                Best Practices
              </h1>

              <p className="mt-4 text-blue-100 leading-7">
                Institutional best practices,
                initiatives, activities, outcomes
                and supporting evidence documented
                for quality assurance and
                accreditation.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* =================================================
              BREADCRUMB
          ================================================= */}
{/* 
          <div className="text-sm text-gray-500 mb-6">
            <Link
              to="/"
              className="hover:text-[#123c69]"
            >
              Home
            </Link>

            <span className="mx-2">
              /
            </span>

            <Link
              to="/naac"
              className="hover:text-[#123c69]"
            >
              NAAC
            </Link>

            <span className="mx-2">
              /
            </span>

            <span className="text-gray-800">
              Best Practices
            </span>
          </div> */}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 mb-6">
              {error}
            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!practices.length && !error && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Best Practices
              </h2>

              <p className="mt-2 text-gray-500">
                No best practices have been
                published yet.
              </p>
            </div>
          )}

          {/* =================================================
              DATA
          ================================================= */}

          {practices.length > 0 && (
            <>
              {/* =============================================
                  YEAR SELECTOR
              ============================================= */}

              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#102f58]">
                      Academic Year
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Select an academic year to
                      view its institutional best
                      practices.
                    </p>
                  </div>

                  <div className="relative w-full md:w-64">
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        const year =
                          e.target.value;

                        setSelectedYear(year);

                        const first =
                          practices
                            .filter(
                              (item) =>
                                item.academic_year ===
                                year
                            )
                            .sort(
                              (a, b) =>
                                Number(
                                  a.practice_number ||
                                    0
                                ) -
                                Number(
                                  b.practice_number ||
                                    0
                                )
                            )[0];

                        setOpenPractice(
                          first?.id || null
                        );
                      }}
                      className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#174f86]"
                    >
                      {years.map((year) => (
                        <option
                          key={year}
                          value={year}
                        >
                          {year}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* =============================================
                  PRACTICES
              ============================================= */}

              <div className="space-y-6">
                {filteredPractices.map(
                  (item) => {
                    const isOpen =
                      openPractice ===
                      item.id;

                    return (
                      <article
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                      >
                        {/* =================================
                            PRACTICE HEADER
                        ================================= */}

                        <button
                          type="button"
                          onClick={() =>
                            setOpenPractice(
                              isOpen
                                ? null
                                : item.id
                            )
                          }
                          className="w-full text-left px-6 py-5 hover:bg-gray-50 transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className="shrink-0 w-11 h-11 rounded-lg bg-[#102f58] text-white flex items-center justify-center font-semibold">
                              {formatPracticeNumber(
                                item.practice_number
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="text-xs uppercase tracking-wider font-semibold text-[#174f86]">
                                Best Practice{" "}
                                {formatPracticeNumber(
                                  item.practice_number
                                )}
                              </p>

                              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
                                {item.title}
                              </h2>

                              {item.short_description && (
                                <p className="text-gray-500 mt-2 leading-6">
                                  {
                                    item.short_description
                                  }
                                </p>
                              )}
                            </div>

                            <div className="text-gray-400 mt-2">
                              {isOpen ? (
                                <ChevronUp
                                  size={21}
                                />
                              ) : (
                                <ChevronDown
                                  size={21}
                                />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* =================================
                            PRACTICE CONTENT
                        ================================= */}

                        {isOpen && (
                          <div className="border-t border-gray-100 px-6 py-7">
                            <ContentSection
                              title="Objective of Practice"
                              text={
                                item.objectives
                              }
                            />

                            <ContentSection
                              title="Context"
                              text={item.context}
                            />

                            <ContentSection
                              title="The Practice"
                              text={
                                item.practice
                              }
                            />

                            <ContentSection
                              title="Outcomes & Impact"
                              text={
                                item.outcomes_impact
                              }
                            />

                            <ContentSection
                              title="Evidence of Success"
                              text={
                                item.evidence_of_success
                              }
                            />

                            <ContentSection
                              title="Problems Encountered"
                              text={
                                item.problems_encountered
                              }
                            />

                            <ContentSection
                              title="Resources Required"
                              text={
                                item.resources_required
                              }
                            />

                            <ContentSection
                              title="Beneficiaries"
                              text={
                                item.beneficiaries
                              }
                            />

                            {/* =================================
                                TEXT-BASED ACTIVITIES
                            ================================= */}

                            {item.activities &&
                              String(
                                item.activities
                              ).trim() && (
                                <ContentSection
                                  title="Activities / Implementation"
                                  text={
                                    item.activities
                                  }
                                />
                              )}

                            {/* =================================
                                ACTIVITY RECORDS
                            ================================= */}

                            {item.activityItems
                              ?.length > 0 && (
                              <div className="mt-8">
                                <SectionTitle>
                                  Activities &
                                  Initiatives
                                </SectionTitle>

                                <div className="grid md:grid-cols-2 gap-5">
                                  {item.activityItems.map(
                                    (
                                      activity
                                    ) => (
                                      <div
                                        key={
                                          activity.id
                                        }
                                        className="border border-gray-200 rounded-xl p-5"
                                      >
                                        <h4 className="font-semibold text-gray-800">
                                          {
                                            activity.activity_title
                                          }
                                        </h4>

                                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                                          {activity.activity_date && (
                                            <span className="inline-flex items-center gap-1">
                                              <CalendarDays
                                                size={
                                                  14
                                                }
                                              />

                                              {
                                                activity.activity_date
                                              }
                                            </span>
                                          )}

                                          {activity.participants !==
                                            null &&
                                            activity.participants !==
                                              undefined && (
                                              <span className="inline-flex items-center gap-1">
                                                <Users
                                                  size={
                                                    14
                                                  }
                                                />

                                                {
                                                  activity.participants
                                                }{" "}
                                                participants
                                              </span>
                                            )}
                                        </div>

                                        {activity.beneficiary_group && (
                                          <p className="text-sm text-gray-600 mt-3">
                                            <strong>
                                              Beneficiaries:
                                            </strong>{" "}
                                            {
                                              activity.beneficiary_group
                                            }
                                          </p>
                                        )}

                                        {activity.description && (
                                          <p className="text-sm text-gray-600 mt-3 leading-6 whitespace-pre-line">
                                            {
                                              activity.description
                                            }
                                          </p>
                                        )}

                                        {activity.outcomes && (
                                          <p className="text-sm text-gray-600 mt-3 leading-6 whitespace-pre-line">
                                            <strong>
                                              Outcomes:
                                            </strong>{" "}
                                            {
                                              activity.outcomes
                                            }
                                          </p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* =================================
                                PHOTOS
                            ================================= */}

                            {item.photoItems
                              ?.length > 0 && (
                              <div className="mt-9">
                                <SectionTitle>
                                  Photographs
                                </SectionTitle>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                  {item.photoItems.map(
                                    (
                                      photo
                                    ) => (
                                      <div
                                        key={
                                          photo.id
                                        }
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                      >
                                        <img
                                          src={getFileUrl(
                                            photo.image_url
                                          )}
                                          alt={
                                            photo.image_title ||
                                            photo.caption ||
                                            "Best Practice"
                                          }
                                          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                        />

                                        {(photo.image_title ||
                                          photo.caption) && (
                                          <div className="p-3">
                                            {photo.image_title && (
                                              <p className="text-sm font-medium text-gray-700">
                                                {
                                                  photo.image_title
                                                }
                                              </p>
                                            )}

                                            {photo.caption && (
                                              <p className="text-xs text-gray-500 mt-1">
                                                {
                                                  photo.caption
                                                }
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* =================================
                                DOCUMENTS
                            ================================= */}

                            {item.documentItems
                              ?.length > 0 && (
                              <div className="mt-9">
                                <SectionTitle>
                                  Supporting
                                  Documents
                                </SectionTitle>

                                <div className="grid md:grid-cols-2 gap-3">
                                  {item.documentItems.map(
                                    (
                                      document
                                    ) => (
                                      <a
                                        key={
                                          document.id
                                        }
                                        href={getFileUrl(
                                          document.file_url
                                        )}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 hover:border-[#174f86] hover:bg-blue-50/30 transition"
                                      >
                                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                          <FileText
                                            size={
                                              20
                                            }
                                          />
                                        </div>

                                        <div className="min-w-0">
                                          <p className="font-medium text-gray-800 truncate">
                                            {
                                              document.title
                                            }
                                          </p>

                                          {document.document_type && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              {
                                                document.document_type
                                              }
                                            </p>
                                          )}

                                          {document.file_name && (
                                            <p className="text-xs text-gray-400 mt-1 truncate">
                                              {
                                                document.file_name
                                              }
                                            </p>
                                          )}
                                        </div>
                                      </a>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* =================================
                                NO ADDITIONAL EVIDENCE
                            ================================= */}

                            {!item.photoItems
                              ?.length &&
                              !item.documentItems
                                ?.length &&
                              !item.activityItems
                                ?.length && (
                                <div className="mt-6 text-sm text-gray-400 flex items-center gap-2">
                                  <ImageIcon
                                    size={16}
                                  />

                                  Additional
                                  evidence will
                                  be published
                                  here when
                                  available.
                                </div>
                              )}
                          </div>
                        )}
                      </article>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

/* =========================================================
   CONTENT SECTION
========================================================= */

function ContentSection({
  title,
  text,
}) {
  if (
    !text ||
    !String(text).trim()
  ) {
    return null;
  }

  return (
    <section className="mb-7">
      <SectionTitle>
        {title}
      </SectionTitle>

      <div className="text-gray-600 leading-7 whitespace-pre-line">
        {text}
      </div>
    </section>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  children,
}) {
  return (
    <h3 className="text-lg font-semibold text-[#102f58] mb-3">
      {children}
    </h3>
  );
}