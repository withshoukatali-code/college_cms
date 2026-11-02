import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DocumentListingPage({
  moduleKey,
  title,
  subtitle,
  description,
  categoryFilter,
}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/content-documents/${encodeURIComponent(moduleKey)}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load documents.");
        }
        if (!cancelled) setDocuments(Array.isArray(result.data) ? result.data : []);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Unable to load documents.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  const visibleDocuments = categoryFilter
    ? documents.filter((item) => item.category?.toLowerCase() === categoryFilter.toLowerCase())
    : documents;

  const resolvePdfUrl = (pdfUrl) =>
    pdfUrl?.startsWith("http://") || pdfUrl?.startsWith("https://")
      ? pdfUrl
      : `${API_BASE}${pdfUrl || ""}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <TopBar />
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">{subtitle}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>}
        </header>

        {loading ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading documents...</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
        ) : visibleDocuments.length ? (
          <div className="space-y-3">
            {visibleDocuments.map((item) => {
              const documentUrl = item.pdf_url || item.external_url;
              const fileUrl = documentUrl ? resolvePdfUrl(documentUrl) : "";
              const isUploadedPdf = Boolean(item.pdf_url);
              return (
                <article key={item.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="mt-0.5 rounded-lg bg-blue-50 p-3 text-[#0f3262]">
                      <FileText size={20} />
                    </span>
                    <div className="min-w-0">
                      {moduleKey === "feedback" && fileUrl ? (
                        <h2 className="text-base font-semibold leading-6 text-slate-900">
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="hover:text-blue-800 hover:underline">{item.title}</a>
                        </h2>
                      ) : (
                        <h2 className="text-base font-semibold leading-6 text-slate-900">{item.title}</h2>
                      )}
                      {(item.category || item.academic_year) && (
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {[item.category, item.academic_year].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}
                    </div>
                  </div>
                  {fileUrl && (
                    <div className="flex shrink-0 gap-2 sm:pl-4">
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        <ExternalLink size={15} /> {isUploadedPdf ? "Open PDF" : "Open link"}
                      </a>
                      {isUploadedPdf && (
                        <a href={fileUrl} download className="inline-flex items-center gap-2 bg-[#0f3262] px-3 py-2 text-sm font-semibold text-white hover:bg-[#19477f]">
                          <Download size={15} /> Download
                        </a>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No documents have been published here yet.
          </p>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
