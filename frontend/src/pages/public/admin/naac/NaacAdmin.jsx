import { useEffect, useState } from "react";
import { ExternalLink, FileText, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const EMPTY_CRITERION = { criterion_number: "", slug: "", title: "", description: "", display_order: 0, is_active: 1 };
const EMPTY_POINT = { code: "", title: "", content: "", display_order: 0 };

const request = async (url, options) => {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The request could not be completed.");
  }
  return result;
};

const toSlug = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function NaacAdmin() {
  const [criteria, setCriteria] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subcriteria, setSubcriteria] = useState([]);
  const [criterionForm, setCriterionForm] = useState(EMPTY_CRITERION);
  const [pointForm, setPointForm] = useState(EMPTY_POINT);
  const [editingCriterionId, setEditingCriterionId] = useState(null);
  const [editingPointId, setEditingPointId] = useState(null);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentOrder, setDocumentOrder] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCriteria = async (preferredId) => {
    const result = await request(`${API_BASE}/api/naac/criteria?include_inactive=1`);
    setCriteria(result.criteria || []);
    const nextSelected = (result.criteria || []).find((item) => item.id === preferredId)
      || (result.criteria || []).find((item) => item.id === selected?.id)
      || result.criteria?.[0]
      || null;
    setSelected(nextSelected);
    return nextSelected;
  };

  const loadSelected = async (criterion = selected) => {
    if (!criterion) {
      setSubcriteria([]);
      return;
    }
    const result = await request(`${API_BASE}/api/naac/criteria/${criterion.slug}?include_inactive=1`);
    setSubcriteria(result.subcriteria || []);
  };

  const refresh = async (criterionId = selected?.id) => {
    const nextSelected = await loadCriteria(criterionId);
    await loadSelected(nextSelected);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await request(`${API_BASE}/api/naac/criteria?include_inactive=1`);
        const first = result.criteria?.[0] || null;
        setCriteria(result.criteria || []);
        setSelected(first);
        if (first) {
          const details = await request(`${API_BASE}/api/naac/criteria/${first.slug}?include_inactive=1`);
          setSubcriteria(details.subcriteria || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const selectCriterion = async (criterion) => {
    setSelected(criterion);
    setEditingPointId(null);
    setPointForm(EMPTY_POINT);
    setError("");
    try {
      await loadSelected(criterion);
    } catch (err) {
      setError(err.message);
    }
  };

  const beginCriterionEdit = (criterion) => {
    setEditingCriterionId(criterion.id);
    setCriterionForm({
      criterion_number: criterion.criterion_number,
      slug: criterion.slug,
      title: criterion.title,
      description: criterion.description || "",
      display_order: criterion.display_order || 0,
      is_active: Number(criterion.is_active),
    });
    setError("");
    setMessage("");
  };

  const resetCriterionForm = () => {
    setEditingCriterionId(null);
    setCriterionForm(EMPTY_CRITERION);
  };

  const saveCriterion = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const wasEditing = Boolean(editingCriterionId);
      const payload = { ...criterionForm, criterion_number: Number(criterionForm.criterion_number), display_order: Number(criterionForm.display_order) || 0 };
      const url = editingCriterionId
        ? `${API_BASE}/api/naac/criteria/${editingCriterionId}`
        : `${API_BASE}/api/naac/criteria`;
      const saved = await request(url, {
        method: editingCriterionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      resetCriterionForm();
      await refresh(saved.id || editingCriterionId || null);
      setMessage(wasEditing ? "Criterion updated." : "Criterion created.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCriterion = async (criterion) => {
    if (!window.confirm(`Delete Criterion ${criterion.criterion_number} and all its points and documents?`)) return;
    setError("");
    try {
      await request(`${API_BASE}/api/naac/criteria/${criterion.id}`, { method: "DELETE" });
      if (editingCriterionId === criterion.id) resetCriterionForm();
      const next = await loadCriteria(null);
      await loadSelected(next);
      setMessage("Criterion deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  const savePoint = async (event) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const url = editingPointId
        ? `${API_BASE}/api/naac/subcriteria/${editingPointId}`
        : `${API_BASE}/api/naac/subcriteria`;
      await request(url, {
        method: editingPointId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pointForm, criterion_id: selected.id, display_order: Number(pointForm.display_order) || 0 }),
      });
      setPointForm(EMPTY_POINT);
      setEditingPointId(null);
      await loadSelected(selected);
      setMessage(editingPointId ? "Criterion point updated." : "Criterion point created.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editPoint = (point) => {
    setEditingPointId(point.id);
    setPointForm({ code: point.code, title: point.title, content: point.content || "", display_order: point.display_order || 0 });
  };

  const deletePoint = async (point) => {
    if (!window.confirm(`Delete criterion point ${point.code}? Its documents will also be removed.`)) return;
    setError("");
    try {
      await request(`${API_BASE}/api/naac/subcriteria/${point.id}`, { method: "DELETE" });
      await loadSelected(selected);
      setMessage("Criterion point deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  const saveDocument = async (event, pointId) => {
    event.preventDefault();
    if (!file && !editingDocumentId) {
      setError("Choose a PDF to upload.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      if (file) body.append("file", file);
      body.append("subcriterion_id", pointId);
      body.append("title", documentTitle.trim() || file?.name || "Document");
      body.append("display_order", String(Number(documentOrder) || 0));
      const url = editingDocumentId
        ? `${API_BASE}/api/naac/documents/${editingDocumentId}`
        : `${API_BASE}/api/naac/documents`;
      await request(url, { method: editingDocumentId ? "PUT" : "POST", body });
      setEditingDocumentId(null);
      setDocumentTitle("");
      setDocumentOrder(0);
      setFile(null);
      await loadSelected(selected);
      setMessage(editingDocumentId ? "Document updated." : "PDF uploaded.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const beginDocumentEdit = (document) => {
    setEditingDocumentId(document.id);
    setDocumentTitle(document.title || "");
    setDocumentOrder(document.display_order || 0);
    setFile(null);
  };

  const deleteDocument = async (document) => {
    if (!window.confirm(`Delete document "${document.title}"?`)) return;
    setError("");
    try {
      await request(`${API_BASE}/api/naac/documents/${document.id}`, { method: "DELETE" });
      await loadSelected(selected);
      setMessage("Document deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Accreditation</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">NAAC Criteria &amp; Documents</h1>
      </header>

      {(error || message) && (
        <div role={error ? "alert" : "status"} className={`border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <form onSubmit={saveCriterion} className="space-y-3 border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-slate-900">{editingCriterionId ? "Edit criterion" : "Add criterion"}</h2>
              {editingCriterionId && <button type="button" aria-label="Cancel criterion edit" onClick={resetCriterionForm} className="p-1 text-slate-500 hover:text-slate-900"><X size={17} /></button>}
            </div>
            <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-2">
              <label className="sr-only" htmlFor="criterion-number">Number</label>
              <input id="criterion-number" required type="number" min="1" value={criterionForm.criterion_number} onChange={(event) => setCriterionForm({ ...criterionForm, criterion_number: event.target.value })} placeholder="#" className="min-w-0 border border-slate-300 px-3 py-2 text-sm" />
              <label className="sr-only" htmlFor="criterion-title">Title</label>
              <input id="criterion-title" required value={criterionForm.title} onChange={(event) => {
                const title = event.target.value;
                setCriterionForm((previous) => ({ ...previous, title, slug: editingCriterionId && previous.slug ? previous.slug : toSlug(title) }));
              }} placeholder="Criterion title" className="min-w-0 border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <label className="sr-only" htmlFor="criterion-slug">URL slug</label>
            <input id="criterion-slug" required value={criterionForm.slug} onChange={(event) => setCriterionForm({ ...criterionForm, slug: toSlug(event.target.value) })} placeholder="criterion-slug" className="w-full border border-slate-300 px-3 py-2 text-sm" />
            <label className="sr-only" htmlFor="criterion-description">Description</label>
            <textarea id="criterion-description" rows="2" value={criterionForm.description} onChange={(event) => setCriterionForm({ ...criterionForm, description: event.target.value })} placeholder="Description" className="w-full border border-slate-300 px-3 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-600">Display order<input type="number" min="0" value={criterionForm.display_order} onChange={(event) => setCriterionForm({ ...criterionForm, display_order: event.target.value })} className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm" /></label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700"><input type="checkbox" checked={Number(criterionForm.is_active) === 1} onChange={(event) => setCriterionForm({ ...criterionForm, is_active: event.target.checked ? 1 : 0 })} /> Published</label>
            </div>
            <button disabled={saving} className="inline-flex w-full items-center justify-center gap-2 bg-[#0f3262] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {editingCriterionId ? <Save size={16} /> : <Plus size={16} />}{editingCriterionId ? "Save criterion" : "Create criterion"}
            </button>
          </form>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Criteria</h2>
            {loading ? <p className="px-2 py-4 text-sm text-slate-500">Loading criteria...</p> : criteria.map((criterion) => (
              <div key={criterion.id} className={`flex items-start gap-2 border p-3 ${selected?.id === criterion.id ? "border-[#0f3262] bg-blue-50" : "border-slate-200 bg-white"}`}>
                <button type="button" onClick={() => selectCriterion(criterion)} className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-semibold text-slate-800">Criterion {criterion.criterion_number}{Number(criterion.is_active) !== 1 && <span className="ml-2 text-xs font-normal text-amber-700">Unpublished</span>}</span>
                  <span className="mt-1 block text-xs text-slate-600">{criterion.title}</span>
                </button>
                <button type="button" aria-label={`Edit ${criterion.title}`} onClick={() => beginCriterionEdit(criterion)} className="p-1.5 text-slate-500 hover:text-blue-700"><Pencil size={15} /></button>
                <button type="button" aria-label={`Delete ${criterion.title}`} onClick={() => deleteCriterion(criterion)} className="p-1.5 text-slate-500 hover:text-red-700"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-6">
          {selected ? <>
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Criterion {selected.criterion_number}</p>
              <h2 className="mt-1 text-2xl font-bold text-[#102f58]">{selected.title}</h2>
              {selected.description && <p className="mt-2 text-sm text-slate-600">{selected.description}</p>}
            </div>

            <form onSubmit={savePoint} className="space-y-3 border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-[#102f58]">{editingPointId ? "Edit criterion point" : "Add criterion point"}</h3>
                {editingPointId && <button type="button" onClick={() => { setEditingPointId(null); setPointForm(EMPTY_POINT); }} className="text-sm text-slate-600 hover:text-slate-900">Cancel</button>}
              </div>
              <div className="grid gap-3 sm:grid-cols-[130px_minmax(0,1fr)_110px]">
                <label className="sr-only" htmlFor="point-code">Point code</label>
                <input id="point-code" required value={pointForm.code} onChange={(event) => setPointForm({ ...pointForm, code: event.target.value })} placeholder="1.1" className="border border-slate-300 px-3 py-2 text-sm" />
                <label className="sr-only" htmlFor="point-title">Point title</label>
                <input id="point-title" required value={pointForm.title} onChange={(event) => setPointForm({ ...pointForm, title: event.target.value })} placeholder="Criterion point title" className="min-w-0 border border-slate-300 px-3 py-2 text-sm" />
                <label className="sr-only" htmlFor="point-order">Display order</label>
                <input id="point-order" type="number" min="0" value={pointForm.display_order} onChange={(event) => setPointForm({ ...pointForm, display_order: event.target.value })} aria-label="Point display order" className="border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <label className="sr-only" htmlFor="point-content">Point description</label>
              <textarea id="point-content" rows="3" value={pointForm.content} onChange={(event) => setPointForm({ ...pointForm, content: event.target.value })} placeholder="Point description or evidence notes" className="w-full border border-slate-300 px-3 py-2 text-sm" />
              <button disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Save size={16} />{editingPointId ? "Update point" : "Add point"}</button>
            </form>

            <div className="space-y-4">
              {subcriteria.map((point) => (
                <article key={point.id} className="border border-slate-200 bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{point.code}</p>
                      <h3 className="mt-1 font-semibold text-slate-900">{point.title}</h3>
                      {point.content && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{point.content}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => editPoint(point)} aria-label={`Edit ${point.code}`} className="p-2 text-slate-500 hover:text-blue-700"><Pencil size={16} /></button>
                      <button type="button" onClick={() => deletePoint(point)} aria-label={`Delete ${point.code}`} className="p-2 text-slate-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    {(point.documents || []).map((document) => (
                      <div key={document.id} className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <FileText size={18} className="shrink-0 text-red-600" />
                        {editingDocumentId === document.id ? (
                          <form onSubmit={(event) => saveDocument(event, point.id)} className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            <input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} aria-label="Document title" className="min-w-[160px] flex-1 border border-slate-300 px-2 py-1.5 text-sm" />
                            <input type="number" min="0" value={documentOrder} onChange={(event) => setDocumentOrder(event.target.value)} aria-label="Document display order" className="w-20 border border-slate-300 px-2 py-1.5 text-sm" />
                            <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-blue-700"><Upload size={15} />Replace PDF<input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" /></label>
                            <button disabled={saving} aria-label="Save document" className="p-1.5 text-emerald-700"><Save size={16} /></button>
                            <button type="button" aria-label="Cancel document edit" onClick={() => { setEditingDocumentId(null); setDocumentTitle(""); setDocumentOrder(0); setFile(null); }} className="p-1.5 text-slate-500"><X size={16} /></button>
                          </form>
                        ) : <>
                          <a href={`${API_BASE}${document.file_url}`} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 hover:text-blue-700">{document.title || document.file_name}<ExternalLink size={13} className="ml-1 inline" /></a>
                          {Number(document.is_active) !== 1 && <span className="text-xs text-amber-700">Unpublished</span>}
                          <button type="button" onClick={() => beginDocumentEdit(document)} aria-label={`Edit ${document.title}`} className="p-1.5 text-slate-500 hover:text-blue-700"><Pencil size={15} /></button>
                          <button type="button" onClick={() => deleteDocument(document)} aria-label={`Delete ${document.title}`} className="p-1.5 text-slate-500 hover:text-red-700"><Trash2 size={15} /></button>
                        </>}
                      </div>
                    ))}

                    {!editingDocumentId && <form onSubmit={(event) => saveDocument(event, point.id)} className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Upload size={15} />{file?.name || "Choose PDF"}<input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" /></label>
                      <input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} placeholder="Document title" aria-label="New document title" className="min-w-[150px] flex-1 border border-slate-300 px-3 py-2 text-sm" />
                      <input type="number" min="0" value={documentOrder} onChange={(event) => setDocumentOrder(event.target.value)} aria-label="New document display order" className="w-20 border border-slate-300 px-3 py-2 text-sm" />
                      <button disabled={saving || !file} className="inline-flex items-center gap-2 bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Plus size={15} />Upload PDF</button>
                    </form>}
                  </div>
                </article>
              ))}
              {!subcriteria.length && <p className="border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">No criterion points have been added.</p>}
            </div>
          </> : !loading && <p className="border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">Create a criterion to start adding points and documents.</p>}
        </section>
      </div>
    </div>
  );
}