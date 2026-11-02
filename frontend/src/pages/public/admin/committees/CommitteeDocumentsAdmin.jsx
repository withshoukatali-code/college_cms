import { useEffect, useState } from "react";
import { ExternalLink, FileText, LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const emptyCommittee = { committee_title: "", category: "", display_order: 0, is_active: 1 };

export default function CommitteeDocumentsAdmin() {
  const [committees, setCommittees] = useState([]);
  const [files, setFiles] = useState({});
  const [newCommittee, setNewCommittee] = useState(emptyCommittee);
  const [newPdf, setNewPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCommittees = async () => {
    const response = await fetch(`${API_BASE}/api/committees?includeInactive=1`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load committee documents.");
    }
    setCommittees(Array.isArray(result.data) ? result.data : []);
  };

  useEffect(() => {
    let cancelled = false;
    loadCommittees()
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Unable to load committee documents.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getFileUrl = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://") ? url : `${API_BASE}${url || ""}`;

  const updateCommittee = (slug, field, value) => {
    setCommittees((current) => current.map((committee) =>
      committee.committee_slug === slug ? { ...committee, [field]: value } : committee
    ));
  };

  const saveCommittee = async (committee) => {
    setSavingSlug(committee.committee_slug);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      body.append("committee_title", committee.committee_title);
      body.append("category", committee.category || "");
      body.append("display_order", committee.display_order ?? 0);
      body.append("is_active", committee.is_active ? 1 : 0);
      if (files[committee.committee_slug]) body.append("pdf", files[committee.committee_slug]);
      const response = await fetch(`${API_BASE}/api/committees/${encodeURIComponent(committee.committee_slug)}`, { method: "PUT", body });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save committee.");
      }
      setFiles((current) => {
        const updated = { ...current };
        delete updated[committee.committee_slug];
        return updated;
      });
      await loadCommittees();
      setSuccess(`${committee.committee_title} saved.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to save committee.");
    } finally {
      setSavingSlug("");
    }
  };

  const removePdf = async (committee) => {
    if (!window.confirm(`Remove the PDF for ${committee.committee_title}?`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/committees/${encodeURIComponent(committee.committee_slug)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to remove PDF.");
      await loadCommittees();
      setSuccess(`${committee.committee_title} PDF removed.`);
    } catch (requestError) {
      setError(requestError.message || "Unable to remove PDF.");
    }
  };

  const deleteCommittee = async (committee) => {
    if (!window.confirm(`Delete "${committee.committee_title}"? This will remove its uploaded PDF.`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/committees/${encodeURIComponent(committee.committee_slug)}/item`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete committee.");
      await loadCommittees();
      setSuccess("Committee deleted.");
    } catch (requestError) {
      setError(requestError.message || "Unable to delete committee.");
    }
  };

  const createCommittee = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      Object.entries(newCommittee).forEach(([key, value]) => body.append(key, value));
      if (newPdf) body.append("pdf", newPdf);
      const response = await fetch(`${API_BASE}/api/committees`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to add committee.");
      setNewCommittee(emptyCommittee);
      setNewPdf(null);
      await loadCommittees();
      setSuccess("Committee added.");
    } catch (requestError) {
      setError(requestError.message || "Unable to add committee.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-7 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content management</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Accreditation &amp; IQAC Committees</h1>
      </header>

      {error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      <form onSubmit={createCommittee} className="mb-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <h2 className="text-lg font-semibold text-slate-900 md:col-span-2">Add committee</h2>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">Committee title
          <input required value={newCommittee.committee_title} onChange={(event) => setNewCommittee((current) => ({ ...current, committee_title: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-slate-700">Category
          <input value={newCommittee.category} onChange={(event) => setNewCommittee((current) => ({ ...current, category: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
          <input type="number" min="0" value={newCommittee.display_order} onChange={(event) => setNewCommittee((current) => ({ ...current, display_order: Number(event.target.value) || 0 }))} className="border border-slate-300 px-3 py-2 font-normal" />
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={newCommittee.is_active === 1} onChange={(event) => setNewCommittee((current) => ({ ...current, is_active: event.target.checked ? 1 : 0 }))} />
          Active
        </label>
        <label className="flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 md:col-span-2">
          <Upload size={16} /> {newPdf?.name || "Choose optional committee PDF"}
          <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => setNewPdf(event.target.files?.[0] || null)} />
        </label>
        <button type="submit" disabled={creating} className="inline-flex w-fit items-center gap-2 bg-[#0f3262] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {creating ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />} Add committee
        </button>
      </form>

      {loading ? (
        <p className="py-12 text-center text-sm text-slate-500">Loading committee records...</p>
      ) : (
        <div className="space-y-4">
          {committees.map((committee) => {
            const slug = committee.committee_slug;
            const busy = savingSlug === slug;
            return (
              <section key={slug} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold text-slate-700">Committee title
                  <input value={committee.committee_title || ""} onChange={(event) => updateCommittee(slug, "committee_title", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                </label>
                <label className="grid gap-1 text-sm font-semibold text-slate-700">Category
                  <input value={committee.category || ""} onChange={(event) => updateCommittee(slug, "category", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                </label>
                <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
                  <input type="number" min="0" value={committee.display_order ?? 0} onChange={(event) => updateCommittee(slug, "display_order", Number(event.target.value) || 0)} className="border border-slate-300 px-3 py-2 font-normal" />
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={committee.is_active === 1 || committee.is_active === true} onChange={(event) => updateCommittee(slug, "is_active", event.target.checked ? 1 : 0)} />
                  Active on public page
                </label>
                {committee.pdf_url ? (
                  <a href={getFileUrl(committee.pdf_url)} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-sm text-blue-800 hover:underline">
                    <FileText size={16} /> Current PDF <ExternalLink size={14} />
                  </a>
                ) : <p className="text-sm text-slate-500">No PDF uploaded</p>}
                <label className="flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <Upload size={16} /> <span className="truncate">{files[slug]?.name || "Choose PDF to upload / replace"}</span>
                  <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => setFiles((current) => ({ ...current, [slug]: event.target.files?.[0] }))} />
                </label>
                <div className="flex flex-wrap gap-2 md:col-span-2">
                  <button type="button" onClick={() => saveCommittee(committee)} disabled={busy} className="inline-flex items-center gap-2 bg-[#0f3262] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save committee
                  </button>
                  {committee.pdf_url && <button type="button" onClick={() => removePdf(committee)} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Trash2 size={16} /> Remove PDF</button>}
                  {!committee.is_default && <button type="button" onClick={() => deleteCommittee(committee)} className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 size={16} /> Delete committee</button>}
                </div>
              </section>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-xs text-slate-500">PDF files up to 20 MB are accepted. Default committee entries may be deactivated but cannot be deleted.</p>
    </main>
  );
}
