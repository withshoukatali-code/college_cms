import { useEffect, useState } from "react";
import { Building2, Edit3, LoaderCircle, Plus, Save, Trash2, Upload, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const emptyFacility = {
  name: "", category: "Campus", description: "", features: [], image_url: "",
  building_area_sq_ft: "", open_area_sq_ft: "", computer_count: "",
  computer_configuration: "", projector_count: "", smart_board_count: "",
  backup_power: "", internet_details: "", display_order: 0, is_active: 1,
};

export default function FacilitiesAdmin() {
  const [facilities, setFacilities] = useState([]);
  const [form, setForm] = useState(emptyFacility);
  const [featuresText, setFeaturesText] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFacilities = async () => {
    const response = await fetch(`${API_BASE}/api/facilities?includeInactive=1`);
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || "Unable to load facilities.");
    setFacilities(Array.isArray(result.data) ? result.data : []);
  };

  useEffect(() => {
    loadFacilities().catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyFacility);
    setFeaturesText("");
    setImage(null);
    const fileInput = document.getElementById("facility-image");
    if (fileInput) fileInput.value = "";
  };

  const editFacility = (facility) => {
    setEditingId(facility.id);
    setForm({ ...facility, is_active: Number(facility.is_active) });
    setFeaturesText((facility.features || []).join("\n"));
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveFacility = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("category", form.category.trim());
      data.append("description", form.description.trim());
      data.append("features", JSON.stringify(featuresText.split("\n").map((item) => item.trim()).filter(Boolean)));
      ["building_area_sq_ft", "open_area_sq_ft", "computer_count", "computer_configuration", "projector_count", "smart_board_count", "backup_power", "internet_details"].forEach((field) => data.append(field, form[field] ?? ""));
      data.append("display_order", String(form.display_order || 0));
      data.append("is_active", String(form.is_active ? 1 : 0));
      if (image) data.append("image", image);
      const url = editingId ? `${API_BASE}/api/facilities/${editingId}` : `${API_BASE}/api/facilities`;
      const response = await fetch(url, { method: editingId ? "PUT" : "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save facility.");
      setSuccess(editingId ? "Facility updated." : "Facility added.");
      resetForm();
      await loadFacilities();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFacility = async (facility) => {
    if (!window.confirm(`Delete ${facility.name}?`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/facilities/${facility.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete facility.");
      if (editingId === facility.id) resetForm();
      setSuccess("Facility deleted.");
      await loadFacilities();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const imageUrl = form.image_url?.startsWith("http") ? form.image_url : form.image_url ? `${API_BASE}${form.image_url}` : "";

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 border-b border-slate-200 pb-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Campus content</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Manage Facilities</h1></header>
      {error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      <form onSubmit={saveFacility} className="mb-8 space-y-4 border-b border-slate-200 pb-7">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">{editingId ? "Edit facility" : "Add facility"}</h2>{editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><X size={16} /> Cancel</button>}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Facility name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">Description<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Building area (sq ft)<input type="number" min="0" step="0.01" value={form.building_area_sq_ft ?? ""} onChange={(event) => setForm({ ...form, building_area_sq_ft: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Open area (sq ft)<input type="number" min="0" step="0.01" value={form.open_area_sq_ft ?? ""} onChange={(event) => setForm({ ...form, open_area_sq_ft: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Number of computers<input type="number" min="0" step="1" value={form.computer_count ?? ""} onChange={(event) => setForm({ ...form, computer_count: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Projectors<input type="number" min="0" step="1" value={form.projector_count ?? ""} onChange={(event) => setForm({ ...form, projector_count: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Smart boards<input type="number" min="0" step="1" value={form.smart_board_count ?? ""} onChange={(event) => setForm({ ...form, smart_board_count: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">Computer configuration<textarea rows={2} value={form.computer_configuration || ""} onChange={(event) => setForm({ ...form, computer_configuration: event.target.value })} placeholder="CPU, RAM, storage, operating system" className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Backup power<textarea rows={2} value={form.backup_power || ""} onChange={(event) => setForm({ ...form, backup_power: event.target.value })} placeholder="UPS / inverter / generator details" className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Internet details<textarea rows={2} value={form.internet_details || ""} onChange={(event) => setForm({ ...form, internet_details: event.target.value })} placeholder="Connection type, speed, coverage" className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">Facilities / equipment, one per line<textarea rows={4} value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} placeholder="Computers\nProjector\nBackup power\nInternet connectivity" className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Display order<input type="number" min="0" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={Number(form.is_active) === 1} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} /> Published</label>
        </div>
        {imageUrl && <img src={imageUrl} alt="Current facility" className="h-28 w-48 border border-slate-200 object-cover" />}
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{image?.name || "Choose facility image"}<input id="facility-image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setImage(event.target.files?.[0] || null)} /></label>
          <span className="text-xs text-slate-500">Optional JPG, PNG, or WebP, up to 8 MB.</span>
          <button type="submit" disabled={saving} className="ml-auto inline-flex items-center gap-2 bg-[#0f3262] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19477f] disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />}{editingId ? "Save changes" : "Add facility"}</button>
        </div>
      </form>

      <section><h2 className="mb-4 text-lg font-semibold text-slate-900">Facilities ({facilities.length})</h2>{loading ? <p className="py-8 text-sm text-slate-500">Loading facilities...</p> : <div className="divide-y divide-slate-200 border-y border-slate-200">{facilities.map((facility) => <article key={facility.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="flex min-w-0 items-center gap-3">{facility.image_url ? <img src={facility.image_url.startsWith("http") ? facility.image_url : `${API_BASE}${facility.image_url}`} alt="" className="h-14 w-20 shrink-0 border border-slate-200 object-cover" /> : <div className="flex h-14 w-20 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-400"><Building2 size={20} /></div>}<div className="min-w-0"><h3 className="font-semibold text-slate-900">{facility.name}</h3><p className="text-sm text-slate-500">{facility.category} · {Number(facility.is_active) === 1 ? "Published" : "Draft"}</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => editFacility(facility)} aria-label={`Edit ${facility.name}`} className="inline-flex h-10 items-center gap-2 border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Edit3 size={15} /> Edit</button><button type="button" onClick={() => deleteFacility(facility)} aria-label={`Delete ${facility.name}`} className="inline-flex h-10 w-10 items-center justify-center border border-slate-300 text-slate-600 hover:text-red-700"><Trash2 size={16} /></button></div></article>)}</div>}</section>
    </main>
  );
}
