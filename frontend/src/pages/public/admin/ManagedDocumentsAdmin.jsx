import { useEffect, useState } from "react";
import { FileText, LoaderCircle, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const emptyDocument = {
  title: "",
  description: "",
  category: "",
  academic_year: "",
  external_url: "",
  display_order: 0,
  is_active: 1,
};

export default function ManagedDocumentsAdmin({ moduleKey, title, requiresPdf = false }) {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState(emptyDocument);
  const [selectedId, setSelectedId] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDocuments = async () => {
    const response = await fetch(`${API_BASE}/api/content-documents/${encodeURIComponent(moduleKey)}?includeInactive=1`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load documents.");
    }
    setDocuments(Array.isArray(result.data) ? result.data : []);
  };

  useEffect(() => {
    let cancelled = false;
    loadDocuments()
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load documents.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  const clearForm = () => {
    setForm(emptyDocument);
    setSelectedId(null);
    setPdf(null);
  };

  const editDocument = (item) => {
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      academic_year: item.academic_year || "",
      external_url: item.external_url || "",
      display_order: item.display_order ?? 0,
      is_active: item.is_active === 0 || item.is_active === "0" ? 0 : 1,
    });
    setSelectedId(item.id);
    setPdf(null);
    setError("");
    setSuccess("");
  };

  const saveDocument = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (pdf) body.append("pdf", pdf);
      const endpoint = `${API_BASE}/api/content-documents/${encodeURIComponent(moduleKey)}${selectedId ? `/${selectedId}` : ""}`;
      const response = await fetch(endpoint, { method: selectedId ? "PUT" : "POST", body });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save document.");
      }
      await loadDocuments();
      setSuccess(selectedId ? "Document updated." : "Document added.");
      clearForm();
    } catch (saveError) {
      setError(saveError.message || "Unable to save document.");
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/content-documents/${encodeURIComponent(moduleKey)}/${item.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete document.");
      }
      await loadDocuments();
      if (selectedId === item.id) clearForm();
      setSuccess("Document deleted.");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete document.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content management</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
      </header>

      {error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Published and inactive items</h2>
          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">Loading documents...</p>
          ) : documents.length ? (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {documents.map((item) => (
                <article key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{[item.category, item.academic_year, item.is_active ? "Active" : "Inactive"].filter(Boolean).join(" · ")}</p>
                    {(item.pdf_url || item.external_url) && <p className="mt-1 inline-flex items-center gap-1 text-xs text-blue-800"><FileText size={13} /> {item.pdf_url ? "PDF attached" : "External link attached"}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => editDocument(item)} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Pencil size={15} /> Edit</button>
                    <button type="button" onClick={() => deleteDocument(item)} className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 size={15} /> Delete</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No items have been added.</p>
          )}
        </section>

        <form onSubmit={saveDocument} className="h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">{selectedId ? "Edit item" : "Add item"}</h2>
            {selectedId && <button type="button" onClick={clearForm} aria-label="Cancel edit" className="rounded p-1 text-slate-500 hover:bg-slate-100"><X size={18} /></button>}
          </div>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Title
            <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Description
            <textarea rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Category
              <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Academic year
              <input value={form.academic_year} onChange={(event) => setForm((current) => ({ ...current, academic_year: event.target.value }))} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
          </div>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">External document URL
            <input type="url" value={form.external_url} onChange={(event) => setForm((current) => ({ ...current, external_url: event.target.value }))} placeholder="https://..." className="border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
            <input type="number" min="0" value={form.display_order} onChange={(event) => setForm((current) => ({ ...current, display_order: Number(event.target.value) || 0 }))} className="border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.is_active === 1} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked ? 1 : 0 }))} />
            Active on public page
          </label>
          <div className="space-y-2 border-t border-slate-100 pt-4">
            {selectedId && (documents.find((item) => item.id === selectedId)?.pdf_url || documents.find((item) => item.id === selectedId)?.external_url) && !pdf && (
              <p className="text-xs text-slate-500">An existing document link will be kept unless replaced below.</p>
            )}
            <label className="flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Upload size={16} />
              <span className="truncate">{pdf?.name || (requiresPdf ? "Choose PDF (required)" : "Choose PDF (optional)")}</span>
              <input key={pdf?.name || "empty"} type="file" accept="application/pdf,.pdf" required={requiresPdf && !selectedId && !pdf && !form.external_url} className="sr-only" onChange={(event) => setPdf(event.target.files?.[0] || null)} />
            </label>
            <p className="text-xs text-slate-500">PDF only, up to 20 MB. Selecting a file replaces the current document.</p>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            {selectedId ? (
              <button type="button" onClick={clearForm} className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            ) : (
              <button type="button" onClick={clearForm} className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Plus size={15} /> Clear</button>
            )}
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-4 py-2 text-sm font-semibold text-white hover:bg-[#19477f] disabled:opacity-60">
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
              {selectedId ? "Save changes" : "Add item"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
