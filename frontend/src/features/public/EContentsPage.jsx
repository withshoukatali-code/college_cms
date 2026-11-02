import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Search } from "lucide-react";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function SafeLink({ href, children, file = false }) {
  try {
    if (!["https:", "http:"].includes(new URL(href).protocol)) throw new Error("Invalid link");
  } catch {
    return <span className="text-sm text-slate-400">Not available</span>;
  }
  const Icon = file ? FileText : ExternalLink;
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f3262] hover:underline"><Icon size={16} />{children}</a>;
}

export default function EContentsPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All subjects");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/site-pages/e-contents`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load E-Contents.");
        return result.data.content;
      })
      .then((content) => { if (!cancelled) setPage(content); })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const resources = Array.isArray(page?.resources) ? page.resources : [];
  const subjects = useMemo(() => ["All subjects", ...new Set(resources.map((row) => row.subject?.trim()).filter(Boolean).sort())], [resources]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return resources.filter((row) => (subject === "All subjects" || row.subject === subject) && (!term || `${row.facultyName || ""} ${row.subject || ""}`.toLowerCase().includes(term)));
  }, [resources, query, subject]);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <TopBar /><Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-slate-200 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Digital Learning</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{page?.title || "E-Contents"}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{page?.description || "Faculty online classes and digital learning materials."}</p>
        </header>
        <section className="mt-8" aria-labelledby="econtents-table-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 id="econtents-table-heading" className="text-xl font-semibold text-slate-900">{page?.subtitle || "Online Classes Links"}</h2>
              <p className="mt-1 text-sm text-slate-500">{resources.length} faculty resource{resources.length === 1 ? "" : "s"}</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <label className="relative block"><span className="sr-only">Search faculty or subject</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search faculty or subject" className="w-full border border-slate-300 py-2 pl-9 pr-3 text-sm sm:w-64" /></label>
              <label><span className="sr-only">Filter by subject</span><select value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full border border-slate-300 bg-white px-3 py-2 text-sm sm:w-48">{subjects.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
          </div>
          {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading learning resources...</p> : error ? <p role="alert" className="py-8 text-sm text-red-700">{error}</p> : filtered.length ? (
            <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left">
              <thead><tr className="border-b border-slate-300 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600"><th className="w-16 px-4 py-3">No.</th><th className="px-4 py-3">Faculty name</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Online class</th><th className="px-4 py-3">Digital material</th></tr></thead>
              <tbody>{filtered.map((row, index) => <tr key={row.id || `${row.facultyName}-${index}`} className="border-b border-slate-200 align-top hover:bg-slate-50"><td className="px-4 py-4 text-sm tabular-nums text-slate-500">{index + 1}</td><th scope="row" className="px-4 py-4 text-sm font-semibold text-slate-900">{row.facultyName || "Faculty"}</th><td className="px-4 py-4 text-sm text-slate-700">{row.subject || "—"}</td><td className="px-4 py-4"><SafeLink href={row.classUrl}>Join class</SafeLink></td><td className="px-4 py-4"><SafeLink href={row.resourceUrl} file>Open material</SafeLink></td></tr>)}</tbody>
            </table></div>
          ) : <div className="border-b border-slate-200 py-14 text-center"><FileText size={28} className="mx-auto text-slate-400" /><h3 className="mt-3 text-base font-semibold text-slate-800">No online class links published</h3><p className="mt-1 text-sm text-slate-500">Faculty links and learning materials will appear here when added by the college.</p></div>}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
