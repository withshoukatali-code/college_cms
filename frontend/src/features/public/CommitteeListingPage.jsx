import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CommitteeListingPage() {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadCommittees = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/committees`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load committee documents.");
        }
        if (!cancelled) setCommittees(Array.isArray(result.data) ? result.data : []);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Unable to load committee documents.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCommittees();
    return () => {
      cancelled = true;
    };
  }, []);

  const getPdfUrl = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://")
      ? url
      : `${API_BASE}${url || ""}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <TopBar />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 border-b border-slate-200 bg-white px-5 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">Accreditation &amp; IQAC</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Committees</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">Committee information and official documents published by the institution.</p>
        </header>

        {loading ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading committees...</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
        ) : committees.length ? (
          <div className="space-y-3">
            {committees.map((committee) => {
              const fileUrl = committee.pdf_url ? getPdfUrl(committee.pdf_url) : "";
              return (
                <article key={committee.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="rounded-lg bg-blue-50 p-3 text-[#0f3262]"><FileText size={20} /></span>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900">
                        {fileUrl ? <a href={fileUrl} target="_blank" rel="noreferrer" className="hover:text-blue-800 hover:underline">{committee.committee_title}</a> : committee.committee_title}
                      </h2>
                      {committee.category && <p className="mt-1 text-xs font-medium text-slate-500">{committee.category}</p>}
                    </div>
                  </div>
                  {fileUrl && (
                    <div className="flex shrink-0 gap-2 sm:pl-4">
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink size={15} /> Open PDF</a>
                      <a href={fileUrl} download className="inline-flex items-center gap-2 bg-[#0f3262] px-3 py-2 text-sm font-semibold text-white hover:bg-[#19477f]"><Download size={15} /> Download</a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No committee documents have been published yet.</p>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
