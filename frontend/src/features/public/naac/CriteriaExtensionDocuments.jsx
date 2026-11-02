import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL =
  `${API_BASE}/api/naac/extension-documents`;

const sidebarItems = [
  {
    title: "NAAC",
    path: "/naac",
  },
  {
    title: "NAAC Criteria",
    path: "/naac/criterion-1",
  },
  {
    title: "SSR",
    path: "/naac/ssr",
  },
  {
    title: "DVV",
    path: "/naac/dvv",
    children: [
      {
        title: "Extension Profile",
        path: "/extension-profile",
      },
      {
        title: "Criteria Extension Documents",
        path: "/extension-documents",
      },
    ],
  },
  {
    title: "AQAR",
    path: "/naac/aqar",
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

export default function CriteriaExtensionDocuments() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dvvOpen, setDvvOpen] = useState(true);

  const currentPath = "/extension-documents";

  // ==================================================
  // FETCH DOCUMENTS
  // ==================================================

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load Criteria Extension Documents."
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setRecords(data);
    } catch (err) {
      console.error(
        "CRITERIA EXTENSION DOCUMENTS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load Criteria Extension Documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // ACTIVE + SORTED RECORDS
  // ==================================================

  const activeRecords = useMemo(() => {
    return records
      .filter(
        (item) =>
          Number(item.is_active) === 1 ||
          item.is_active === true ||
          item.is_active === undefined ||
          item.is_active === null
      )
      .sort((a, b) => {
        const orderA = Number(
          a.display_order ?? 1
        );

        const orderB = Number(
          b.display_order ?? 1
        );

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return (
          Number(a.id ?? 0) -
          Number(b.id ?? 0)
        );
      });
  }, [records]);

  // ==================================================
  // FILE URL
  // ==================================================

  const getDocumentUrl = (file) => {
    if (!file) return null;

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    if (file.startsWith("/")) {
      return `${API_BASE}${file}`;
    }

    return `${API_BASE}/${file}`;
  };

  // ==================================================
  // SIDEBAR
  // ==================================================

  const renderSidebar = () => (
    <aside
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Sidebar heading */}
      <div
        className="
          border-b
          border-slate-200
          bg-slate-50
          px-5
          py-2
        "
      >
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-blue-400
          "
        >
          NAAC / Accreditation
        </p>

        <h2
          className="
            mt-1
            text-base
            font-bold
            text-slate-800
          "
        >
          Accreditation
        </h2>
      </div>

      {/* Sidebar */}
      <nav className="p-3">
        {sidebarItems.map((item) => {
          const hasChildren =
            Array.isArray(item.children) &&
            item.children.length > 0;

          const isActive =
            item.path === currentPath;

          if (hasChildren) {
            return (
              <div
                key={item.title}
                className="mb-1"
              >
                {/* DVV */}
                <div className="flex items-center">
                  <Link
                    to={item.path}
                    className="
                      flex
                      min-w-0
                      flex-1
                      items-center
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      hover:text-blue-400
                    "
                  >
                    DVV
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setDvvOpen(
                        (prev) => !prev
                      )
                    }
                    className="
                      rounded-md
                      p-2
                      text-slate-400
                      transition
                      hover:bg-blue-50
                      hover:text-blue-400
                    "
                    aria-label={
                      dvvOpen
                        ? "Collapse DVV"
                        : "Expand DVV"
                    }
                  >
                    {dvvOpen ? (
                      <ChevronDown
                        size={16}
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                      />
                    )}
                  </button>
                </div>

                {/* DVV CHILDREN */}
                {dvvOpen && (
                  <div
                    className="
                      ml-3
                      border-l
                      border-slate-200
                      pl-3
                    "
                  >
                    {item.children.map(
                      (child) => {
                        const childActive =
                          child.path ===
                          currentPath;

                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`
                              mb-1
                              flex
                              items-center
                              rounded-lg
                              border-l-2
                              px-3
                              py-2.5
                              text-[13px]
                              leading-5
                              transition
                              ${
                                childActive
                                  ? "border-blue-400 bg-blue-50 font-semibold text-blue-400"
                                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-blue-400"
                              }
                            `}
                          >
                            {child.title}
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                mb-1
                flex
                items-center
                rounded-lg
                border-l-2
                px-3
                py-2.5
                text-sm
                transition
                ${
                  isActive
                    ? "border-blue-400 bg-blue-50 font-semibold text-blue-400"
                    : "border-transparent font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-400"
                }
              `}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />

      <Navbar />

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >
          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-blue-400
            "
          >
            NAAC / DVV
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            Criteria Extension Documents
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-sm
              leading-6
              text-slate-600
              sm:text-base
            "
          >
            Supporting documents and evidence
            related to the extended NAAC criteria
            submitted for the DVV process.
          </p>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-7
            lg:flex-row
            lg:items-start
          "
        >
          {/* ==================================================
              CONTENT
          ================================================== */}

          <section
            className="
              order-1
              min-w-0
              flex-1
            "
          >
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              {/* Content heading */}
              <div
                className="
                  border-b
                  border-slate-200
                  px-5
                  py-5
                  sm:px-6
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-50
                      text-blue-400
                    "
                  >
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2
                      className="
                        text-lg
                        font-bold
                        text-slate-900
                      "
                    >
                      Criteria Extension Documents
                    </h2>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Documents submitted as
                      supporting evidence for
                      extended criteria.
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  LOADING
              ================================================== */}

              {loading && (
                <div
                  className="
                    px-5
                    py-14
                    text-center
                    sm:px-6
                  "
                >
                  <div
                    className="
                      mx-auto
                      h-8
                      w-8
                      animate-spin
                      rounded-full
                      border-2
                      border-slate-200
                      border-t-blue-400
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-sm
                      text-slate-500
                    "
                  >
                    Loading documents...
                  </p>
                </div>
              )}

              {/* ==================================================
                  ERROR
              ================================================== */}

              {!loading && error && (
                <div
                  className="
                    px-5
                    py-14
                    text-center
                    sm:px-6
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-red-50
                      text-red-500
                    "
                  >
                    <FileText size={22} />
                  </div>

                  <h3
                    className="
                      mt-4
                      text-base
                      font-semibold
                      text-slate-800
                    "
                  >
                    Unable to load documents
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-lg
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchDocuments}
                    className="
                      mt-5
                      rounded-lg
                      bg-blue-400
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-500
                    "
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* ==================================================
                  EMPTY
              ================================================== */}

              {!loading &&
                !error &&
                activeRecords.length ===
                  0 && (
                  <div
                    className="
                      px-5
                      py-14
                      text-center
                      sm:px-6
                    "
                  >
                    <FileText
                      size={32}
                      className="
                        mx-auto
                        text-slate-300
                      "
                    />

                    <h3
                      className="
                        mt-3
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      No documents available
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-400
                      "
                    >
                      Criteria Extension Documents
                      added through the administration
                      panel will appear here.
                    </p>
                  </div>
                )}

              {/* ==================================================
                  DESKTOP TABLE
              ================================================== */}

              {!loading &&
                !error &&
                activeRecords.length >
                  0 && (
                  <>
                    <div
                      className="
                        hidden
                        overflow-x-auto
                        md:block
                      "
                    >
                      <table
                        className="
                          w-full
                          min-w-[700px]
                          border-collapse
                        "
                      >
                        <thead>
                          <tr
                            className="
                              bg-slate-50
                            "
                          >
                            <th
                              className="
                                w-[120px]
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                                sm:px-6
                              "
                            >
                              Criterion
                            </th>

                            <th
                              className="
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                                sm:px-6
                              "
                            >
                              Document
                            </th>

                            <th
                              className="
                                w-[140px]
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                text-left
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                                sm:px-6
                              "
                            >
                              Academic Year
                            </th>

                            <th
                              className="
                                w-[120px]
                                border-b
                                border-slate-200
                                px-5
                                py-4
                                text-center
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-600
                                sm:px-6
                              "
                            >
                              View Doc.
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {activeRecords.map(
                            (
                              item,
                              index
                            ) => {
                              const documentUrl =
                                getDocumentUrl(
                                  item.document_file
                                );

                              return (
                                <tr
                                  key={
                                    item.id
                                  }
                                  className={`
                                    transition
                                    hover:bg-blue-50/30
                                    ${
                                      index !==
                                      activeRecords.length -
                                        1
                                        ? "border-b border-slate-100"
                                        : ""
                                    }
                                  `}
                                >
                                  {/* Criterion */}
                                  <td
                                    className="
                                      px-5
                                      py-4
                                      align-top
                                      sm:px-6
                                    "
                                  >
                                    <span
                                      className="
                                        font-bold
                                        text-blue-400
                                      "
                                    >
                                      {item.criterion_no ||
                                        "—"}
                                    </span>
                                  </td>

                                  {/* Document */}
                                  <td
                                    className="
                                      px-5
                                      py-4
                                      align-top
                                      sm:px-6
                                    "
                                  >
                                    <p
                                      className="
                                        text-sm
                                        font-semibold
                                        leading-6
                                        text-slate-700
                                      "
                                    >
                                      {item.document_title ||
                                        "Untitled document"}
                                    </p>

                                    {item.description && (
                                      <p
                                        className="
                                          mt-1
                                          text-xs
                                          leading-5
                                          text-slate-400
                                        "
                                      >
                                        {
                                          item.description
                                        }
                                      </p>
                                    )}

                                    {item.document_type && (
                                      <span
                                        className="
                                          mt-2
                                          inline-block
                                          rounded
                                          bg-slate-100
                                          px-2
                                          py-1
                                          text-[10px]
                                          font-semibold
                                          uppercase
                                          tracking-wide
                                          text-slate-500
                                        "
                                      >
                                        {
                                          item.document_type
                                        }
                                      </span>
                                    )}
                                  </td>

                                  {/* Academic Year */}
                                  <td
                                    className="
                                      px-5
                                      py-4
                                      align-top
                                      text-sm
                                      text-slate-600
                                      sm:px-6
                                    "
                                  >
                                    {item.academic_year ||
                                      "—"}
                                  </td>

                                  {/* Document */}
                                  <td
                                    className="
                                      px-5
                                      py-4
                                      text-center
                                      align-top
                                      sm:px-6
                                    "
                                  >
                                    {documentUrl ? (
                                      <a
                                        href={
                                          documentUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                          inline-flex
                                          items-center
                                          gap-1.5
                                          rounded-lg
                                          border
                                          border-blue-200
                                          bg-blue-50
                                          px-3
                                          py-2
                                          text-xs
                                          font-semibold
                                          text-blue-400
                                          transition
                                          hover:bg-blue-100
                                        "
                                      >
                                        <Download
                                          size={
                                            15
                                          }
                                        />
                                        View
                                      </a>
                                    ) : (
                                      <span
                                        className="
                                          text-xs
                                          text-slate-400
                                        "
                                      >
                                        —
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* ==================================================
                        MOBILE CARDS
                    ================================================== */}

                    <div
                      className="
                        divide-y
                        divide-slate-100
                        md:hidden
                      "
                    >
                      {activeRecords.map(
                        (item) => {
                          const documentUrl =
                            getDocumentUrl(
                              item.document_file
                            );

                          return (
                            <article
                              key={item.id}
                              className="p-5"
                            >
                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-4
                                "
                              >
                                <div>
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.16em]
                                      text-slate-400
                                    "
                                  >
                                    Criterion
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-lg
                                      font-bold
                                      text-blue-400
                                    "
                                  >
                                    {item.criterion_no ||
                                      "—"}
                                  </p>
                                </div>

                                {documentUrl && (
                                  <a
                                    href={
                                      documentUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                      inline-flex
                                      shrink-0
                                      items-center
                                      gap-1.5
                                      rounded-lg
                                      border
                                      border-blue-200
                                      bg-blue-50
                                      px-3
                                      py-2
                                      text-xs
                                      font-semibold
                                      text-blue-400
                                    "
                                  >
                                    <Download
                                      size={14}
                                    />
                                    View
                                  </a>
                                )}
                              </div>

                              <div className="mt-5">
                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-slate-400
                                  "
                                >
                                  Document
                                </p>

                                <h3
                                  className="
                                    mt-1.5
                                    text-sm
                                    font-bold
                                    leading-6
                                    text-slate-700
                                  "
                                >
                                  {item.document_title ||
                                    "Untitled document"}
                                </h3>
                              </div>

                              {item.academic_year && (
                                <div
                                  className="
                                    mt-4
                                  "
                                >
                                  <p
                                    className="
                                      text-[10px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.16em]
                                      text-slate-400
                                    "
                                  >
                                    Academic Year
                                  </p>

                                  <p
                                    className="
                                      mt-1
                                      text-sm
                                      text-slate-600
                                    "
                                  >
                                    {
                                      item.academic_year
                                    }
                                  </p>
                                </div>
                              )}

                              {item.description && (
                                <p
                                  className="
                                    mt-4
                                    text-xs
                                    leading-5
                                    text-slate-500
                                  "
                                >
                                  {
                                    item.description
                                  }
                                </p>
                              )}

                              {item.document_type && (
                                <span
                                  className="
                                    mt-4
                                    inline-block
                                    rounded
                                    bg-slate-100
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                  "
                                >
                                  {
                                    item.document_type
                                  }
                                </span>
                              )}
                            </article>
                          );
                        }
                      )}
                    </div>
                  </>
                )}
            </div>
          </section>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside
            className="
              order-2
              w-full
              lg:sticky
              lg:top-24
              lg:w-[270px]
              lg:shrink-0
            "
          >
            {renderSidebar()}
          </aside>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}