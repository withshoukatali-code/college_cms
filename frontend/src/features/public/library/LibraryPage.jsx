import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Database,
  FileText,
  MonitorSmartphone,
  School,
  Users,
  LibraryBig,
  ArrowRight,
  Clock3,
  ExternalLink,
} from "lucide-react";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";
import { libraryDefaultContent, normalizeLibraryContent } from "./libraryContent";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const isInactive = (item) =>
  item.is_active === false || item.is_active === 0 || item.is_active === "0";

const byDisplayOrder = (left, right) =>
  Number(left.display_order || 0) - Number(right.display_order || 0);

function LibraryPage() {
  const [content, setContent] = useState(() => normalizeLibraryContent(libraryDefaultContent));
  const [selectedSectionId, setSelectedSectionId] = useState("our-library");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        let response = await fetch(`${API_BASE}/api/site-pages/library`);
        if (response.status === 404) {
          const seedResponse = await fetch(`${API_BASE}/api/site-pages/seed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pages: [{ page_key: "library", content: libraryDefaultContent }],
            }),
          });
          const seedResult = await seedResponse.json();
          if (!seedResponse.ok || !seedResult.success) {
            throw new Error(seedResult.message || "Unable to initialize library content.");
          }
          response = await fetch(`${API_BASE}/api/site-pages/library`);
        }

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load library content.");
        }
        if (!cancelled) {
          setContent(normalizeLibraryContent(result.data.content));
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Unable to load library content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = (content?.sections || [])
    .filter((section) => !isInactive(section))
    .sort(byDisplayOrder);
  const selectedSection = sections.find((section) => section.id === selectedSectionId) || sections[0];
  const items = (selectedSection?.items || [])
    .filter((item) => !isInactive(item))
    .sort(byDisplayOrder);

  const resolveDocumentUrl = (documentUrl) =>
    documentUrl?.startsWith("http://") || documentUrl?.startsWith("https://")
      ? documentUrl
      : documentUrl ? `${API_BASE}${documentUrl}` : "";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <TopBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0f3262] via-[#143f72] to-[#1e5da5] text-white shadow-xl shadow-slate-200">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                <LibraryBig size={16} />
                {content.hero?.eyebrow || "Our Library"}
              </div>

              <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {content.hero?.title || "Knowledge, access, and learning support for every learner"}
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                {content.hero?.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/departments"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f3262] transition hover:bg-slate-100"
                >
                  Explore Departments
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/e-contents"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  E-Resources
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white">Library Snapshot</h2>
              <div className="mt-5 space-y-4">
                {(content.hero?.stats || []).map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-blue-100">{stat.label}</span>
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-6">
          <nav
            aria-label="Library pages"
            className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-6"
          >
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Library pages</p>
            <label className="sr-only" htmlFor="library-page-select">Choose a Library page</label>
            <select
              id="library-page-select"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 lg:hidden"
              value={selectedSection?.id || ""}
              onChange={(event) => setSelectedSectionId(event.target.value)}
            >
              {sections.map((section) => <option key={section.id} value={section.id}>{section.title}</option>)}
            </select>
            <div className="hidden max-h-[70vh] space-y-1 overflow-y-auto lg:block">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  aria-current={selectedSection?.id === section.id ? "page" : undefined}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium leading-5 transition ${
                    selectedSection?.id === section.id
                      ? "bg-[#0f3262] font-semibold text-white"
                      : "text-slate-700 hover:bg-blue-50 hover:text-[#0f3262]"
                  }`}
                >
                  <span>{section.title}</span>
                  {selectedSection?.id === section.id && <ArrowRight size={15} className="shrink-0" />}
                </button>
              ))}
            </div>
          </nav>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {selectedSection ? (
              <>
                <header className="border-b border-slate-200 bg-gradient-to-r from-[#f1f6fc] via-white to-[#fff8ef] px-5 py-6 sm:px-8 sm:py-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a45a1b]">Library information</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0f3262] sm:text-3xl">{selectedSection.title}</h2>
                  {selectedSection.description && (
                    <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-600 sm:text-base">{selectedSection.description}</p>
                  )}
                </header>

                <div className="p-4 sm:p-7 lg:p-8">
                  {loading ? (
                    <p className="py-12 text-center text-sm text-slate-500">Loading library information...</p>
                  ) : error ? (
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
                  ) : items.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((item, index) => {
                        const documentUrl = resolveDocumentUrl(item.documentUrl);
                        const isHoursSection = selectedSection.id === "working-hours";
                        const Icon = isHoursSection ? Clock3 : [Users, BookOpen, MonitorSmartphone, Database, School, FileText][index % 6];
                        return (
                          <article key={`${selectedSection.id}-${item.title}-${index}`} className={`group flex h-full flex-col rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/5 sm:p-6 ${
                            isHoursSection
                              ? index % 2 === 0 ? "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white" : "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-white"
                              : "border-slate-200 bg-white hover:border-blue-200"
                          }`}>
                            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262] transition group-hover:bg-[#0f3262] group-hover:text-white">
                              <Icon size={20} />
                            </div>
                            <h3 className="text-lg font-bold leading-snug text-slate-900">{item.title}</h3>
                            {item.time && <p className="mt-2 text-xl font-bold tracking-tight text-[#0f3262] sm:text-2xl">{item.time}</p>}
                            {item.description && <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>}
                            {documentUrl && (
                              <a href={documentUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#0f3262] transition hover:bg-blue-100">
                                <FileText size={15} /> View document <ExternalLink size={14} />
                              </a>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      Information for this Library page will be added soon.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="p-8 text-center text-sm text-slate-500">No Library pages are currently published.</p>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export default LibraryPage;
