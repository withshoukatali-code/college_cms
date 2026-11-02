import { useEffect, useState } from "react";
import {
  ChevronDown,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NaacCriterionPage() {
  const { slug } = useParams();

  const [criterion, setCriterion] = useState(null);
  const [subcriteria, setSubcriteria] = useState([]);
  const [criteria, setCriteria] = useState([]);

  const [openId, setOpenId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCriterion() {
      try {
        setLoading(true);
        setError("");

        if (!slug) {
          throw new Error("Criterion slug is missing.");
        }

        const [detailResponse, criteriaResponse] =
          await Promise.all([
            fetch(
              `${API_BASE}/api/naac/criteria/${encodeURIComponent(
                slug
              )}`
            ),
            fetch(`${API_BASE}/api/naac/criteria`),
          ]);

        if (!detailResponse.ok) {
          throw new Error(
            `Criterion API error: ${detailResponse.status}`
          );
        }

        if (!criteriaResponse.ok) {
          throw new Error(
            `Criteria API error: ${criteriaResponse.status}`
          );
        }

        const detailResult = await detailResponse.json();
        const criteriaResult = await criteriaResponse.json();

        console.log(
          "NAAC DETAIL RESPONSE:",
          detailResult
        );

        console.log(
          "NAAC CRITERIA RESPONSE:",
          criteriaResult
        );

        if (!detailResult.success) {
          throw new Error(
            detailResult.message ||
              "Unable to load this NAAC criterion."
          );
        }

        /*
         * Support the common response structures:
         *
         * {
         *   success: true,
         *   criterion: {...},
         *   subcriteria: [...]
         * }
         *
         * OR
         *
         * {
         *   success: true,
         *   data: {
         *     criterion: {...},
         *     subcriteria: [...]
         *   }
         * }
         *
         * OR
         *
         * {
         *   success: true,
         *   data: {...criterion}
         * }
         */

        let criterionData = null;
        let subcriteriaData = [];

        if (detailResult.criterion) {
          criterionData = detailResult.criterion;
          subcriteriaData =
            detailResult.subcriteria || [];
        } else if (
          detailResult.data?.criterion
        ) {
          criterionData =
            detailResult.data.criterion;

          subcriteriaData =
            detailResult.data.subcriteria || [];
        } else if (detailResult.data) {
          criterionData = detailResult.data;

          subcriteriaData =
            detailResult.subcriteria ||
            detailResult.data.subcriteria ||
            [];
        }

        if (!criterionData) {
          throw new Error(
            "Criterion data was not returned by the API."
          );
        }

        if (!Array.isArray(subcriteriaData)) {
          subcriteriaData = [];
        }

        let criteriaData = [];

        if (
          Array.isArray(criteriaResult.criteria)
        ) {
          criteriaData = criteriaResult.criteria;
        } else if (
          Array.isArray(criteriaResult.data)
        ) {
          criteriaData = criteriaResult.data;
        }

        if (!cancelled) {
          setCriterion(criterionData);
          setSubcriteria(subcriteriaData);
          setCriteria(criteriaData);

          setOpenId(
            subcriteriaData.length > 0
              ? subcriteriaData[0].id
              : null
          );

          setLoading(false);
        }
      } catch (err) {
        console.error(
          "NAAC CRITERION ERROR:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load NAAC criterion."
          );

          setLoading(false);
        }
      }
    }

    loadCriterion();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /*
   * --------------------------------------------------
   * LOADING
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Navbar />

        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

          <p className="mt-5 text-sm font-medium text-slate-600">
            Loading criterion...
          </p>
        </div>

        <PublicFooter />
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * ERROR
   * --------------------------------------------------
   */

  if (error || !criterion) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Navbar />

        <div className="mx-auto max-w-3xl px-4 py-20">
          <div className="border border-red-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle
              size={42}
              className="mx-auto text-red-500"
            />

            <h1 className="mt-4 text-xl font-semibold text-slate-800">
              Unable to load criterion
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The requested NAAC criterion could not be found."}
            </p>

            <Link
              to="/naac"
              className="mt-6 inline-flex items-center rounded-md bg-[#102f58] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Back to NAAC Criteria
            </Link>
          </div>
        </div>

        <PublicFooter />
      </div>
    );
  }

  /*
   * Remove "Criteria 1 - " from heading
   */

  const cleanTitle = String(
    criterion.title || ""
  ).replace(
    /^Criteria\s*\d+\s*[-–—]\s*/i,
    ""
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <TopBar />

      <Navbar />

      <main>
        {/* -------------------------------------------
            PAGE HEADER
        -------------------------------------------- */}

        <section className="flex min-h-[150px] items-center bg-[#102f58] px-4 py-8 text-white sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Link
              to="/naac"
              className="text-sm font-medium text-amber-300 transition hover:text-white"
            >
              NAAC Criteria
            </Link>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              Criterion {criterion.criterion_number}
            </p>

            <h1 className="mt-1 max-w-4xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {cleanTitle}
            </h1>
          </div>
        </section>

        {/* -------------------------------------------
            CONTENT
        -------------------------------------------- */}

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          {/* MAIN CONTENT */}

          <section>
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
                Evidence and documentation
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-[#102f58]">
                Criterion Points
              </h2>

              {criterion.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {criterion.description}
                </p>
              )}
            </div>

            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              {/* TABLE HEADER */}

              <div className="hidden grid-cols-[110px_minmax(0,1fr)_120px_36px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid">
                <span>Code</span>

                <span>Criterion Point</span>

                <span>Documents</span>

                <span />
              </div>

              {/* SUBCRITERIA */}

              {subcriteria.length > 0 ? (
                subcriteria.map((item) => {
                  const isOpen =
                    openId === item.id;

                  const documents =
                    Array.isArray(
                      item.documents
                    )
                      ? item.documents
                      : [];

                  return (
                    <div
                      key={item.id}
                      className="border-b border-slate-200 last:border-b-0"
                    >
                      {/* ROW */}

                      <button
                        type="button"
                        onClick={() =>
                          setOpenId(
                            isOpen
                              ? null
                              : item.id
                          )
                        }
                        className="grid w-full grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 md:grid-cols-[110px_minmax(0,1fr)_120px_36px] md:gap-4 md:px-5"
                      >
                        <span className="font-mono text-sm font-bold text-amber-700">
                          {item.code}
                        </span>

                        <span className="min-w-0">
                          <strong className="block text-sm text-[#102f58] md:text-base">
                            {item.title}
                          </strong>

                          <span className="mt-1 block truncate text-xs text-slate-500 md:hidden">
                            {documents.length}{" "}
                            document
                            {documents.length ===
                            1
                              ? ""
                              : "s"}
                          </span>
                        </span>

                        <span className="hidden text-sm text-slate-500 md:block">
                          {documents.length}{" "}
                          file
                          {documents.length ===
                          1
                            ? ""
                            : "s"}
                        </span>

                        <ChevronDown
                          size={19}
                          className={`justify-self-end text-amber-600 transition-transform ${
                            isOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>

                      {/* EXPANDED CONTENT */}

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-[#fcfcfa] px-4 py-4 md:px-5 md:pl-[126px]">
                          {item.content && (
                            <div
                              className="prose max-w-none text-sm leading-7 text-slate-600"
                              dangerouslySetInnerHTML={{
                                __html:
                                  item.content,
                              }}
                            />
                          )}

                          <div className="mt-5 overflow-hidden border border-slate-300 bg-white">
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-slate-300 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                              <span>
                                Supporting
                                Document
                              </span>

                              <span>
                                Action
                              </span>
                            </div>

                            {documents.length >
                            0 ? (
                              documents.map(
                                (document) => {
                                  const fileUrl =
                                    document.file_url ||
                                    document.document_file ||
                                    document.file;

                                  const finalUrl =
                                    fileUrl?.startsWith(
                                      "http"
                                    )
                                      ? fileUrl
                                      : `${API_BASE}${fileUrl || ""}`;

                                  return (
                                    <a
                                      key={
                                        document.id
                                      }
                                      href={
                                        finalUrl
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-amber-50"
                                    >
                                      <span className="flex min-w-0 items-center gap-2 font-medium text-[#0f3262]">
                                        <FileText
                                          size={
                                            16
                                          }
                                          className="shrink-0 text-amber-600"
                                        />

                                        <span className="truncate">
                                          {document.title ||
                                            document.document_title ||
                                            "Supporting Document"}
                                        </span>
                                      </span>

                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f3262]">
                                        Open

                                        <Download
                                          size={
                                            14
                                          }
                                        />
                                      </span>
                                    </a>
                                  );
                                }
                              )
                            ) : (
                              <p className="px-4 py-5 text-sm text-slate-500">
                                No supporting
                                documents have
                                been published
                                yet.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <FileText
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    Criterion points will be
                    published here.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* SIDEBAR */}

          <aside className="h-fit border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
              Other Criteria
            </p>

            <div className="mt-4 space-y-1">
              {criteria.map((item) => {
                const isCurrent =
                  Number(item.id) ===
                  Number(criterion.id);

                const sidebarTitle = String(
                  item.title || ""
                ).replace(
                  /^Criteria\s*\d+\s*[-–—]\s*/i,
                  ""
                );

                return (
                  <Link
                    key={item.id}
                    to={`/naac/criteria/${encodeURIComponent(
                      item.slug || ""
                    )}`}
                    className={`block border-l-2 px-3 py-2 text-sm leading-5 transition ${
                      isCurrent
                        ? "border-amber-500 bg-amber-50 font-bold text-[#102f58]"
                        : "border-transparent text-slate-600 hover:border-amber-300 hover:bg-slate-50 hover:text-[#0f3262]"
                    }`}
                  >
                    Criterion{" "}
                    {item.criterion_number}

                    <span className="mt-0.5 block text-xs opacity-80">
                      {sidebarTitle}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* BACK LINK */}

            <div className="mt-6 border-t border-slate-200 pt-5">
              <Link
                to="/naac"
                className="text-sm font-semibold text-[#102f58] hover:text-amber-600"
              >
                ← Back to NAAC Criteria
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}