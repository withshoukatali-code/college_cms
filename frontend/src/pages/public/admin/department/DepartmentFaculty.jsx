import { useEffect, useState } from "react";
import { Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const EMPTY_FORM = {
  name: "",
  designation: "",
  qualification: "",
  specialization: "",
  experience: "",
  email: "",
  phone: "",
  profile: "",
  is_hod: 0,
  display_order: 0,
  is_active: 1,
};

const fetchFaculty = async (departmentId) => {
  const response = await fetch(`${API_BASE}/api/department-faculty/department/${departmentId}?include_inactive=1`);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Unable to load department faculty.");
  return result.faculty || [];
};

const DepartmentFaculty = ({ departmentId }) => {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;
    fetchFaculty(departmentId)
      .then((result) => {
        if (current) setFaculty(result);
      })
      .catch((err) => {
        if (current) setError(err.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [departmentId]);

  const refreshFaculty = async () => {
    try {
      setFaculty(await fetchFaculty(departmentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPhoto(null);
    setResume(null);
    setEditingId(null);
  };

  const editFaculty = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || "",
      designation: member.designation || "",
      qualification: member.qualification || "",
      specialization: member.specialization || "",
      experience: member.experience || "",
      email: member.email || "",
      phone: member.phone || "",
      profile: member.profile || "",
      is_hod: Number(member.is_hod) === 1 ? 1 : 0,
      display_order: member.display_order || 0,
      is_active: Number(member.is_active) === 1 ? 1 : 0,
    });
    setPhoto(null);
    setResume(null);
    setError("");
    setMessage("");
  };

  const saveFaculty = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = new FormData();
      body.append("department_id", String(departmentId));
      Object.entries(form).forEach(([key, value]) => body.append(key, String(value)));
      if (photo) body.append("photo", photo);
      if (resume) body.append("resume", resume);
      const response = await fetch(
        editingId
          ? `${API_BASE}/api/department-faculty/${editingId}`
          : `${API_BASE}/api/department-faculty`,
        { method: editingId ? "PUT" : "POST", body }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save faculty member.");
      const wasEditing = Boolean(editingId);
      resetForm();
      await refreshFaculty();
      setMessage(wasEditing ? "Faculty member updated." : "Faculty member added.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFaculty = async (member) => {
    if (!window.confirm(`Delete ${member.name} from this department?`)) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/department-faculty/${member.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete faculty member.");
      if (editingId === member.id) resetForm();
      await refreshFaculty();
      setMessage("Faculty member deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mt-6 border border-slate-200 bg-white">
      <header className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Faculty and Staff</h2>
        <p className="mt-1 text-xs text-slate-500">Published profiles appear on the public department page.</p>
      </header>

      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="space-y-3">
          {error && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{error}</p>}
          {message && <p role="status" className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{message}</p>}
          {loading ? <p className="py-5 text-xs text-slate-500">Loading faculty...</p> : faculty.map((member) => (
            <article key={member.id} className="flex items-start gap-3 border border-slate-200 p-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {member.photo_url && <img src={`${API_BASE}${member.photo_url}`} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
                  {Number(member.is_hod) === 1 && <span className="text-[11px] font-medium text-blue-700">Head of Department</span>}
                  {Number(member.is_active) !== 1 && <span className="text-[11px] font-medium text-amber-700">Unpublished</span>}
                </div>
                <p className="mt-0.5 text-xs text-slate-600">{member.designation || "Faculty Member"}{member.qualification ? ` · ${member.qualification}` : ""}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{member.profile}</p>
              </div>
              <button type="button" aria-label={`Edit ${member.name}`} onClick={() => editFaculty(member)} className="p-1.5 text-slate-500 hover:text-blue-700"><Pencil size={15} /></button>
              <button type="button" aria-label={`Delete ${member.name}`} onClick={() => deleteFaculty(member)} className="p-1.5 text-slate-500 hover:text-red-700"><Trash2 size={15} /></button>
            </article>
          ))}
          {!loading && faculty.length === 0 && <p className="border border-dashed border-slate-300 px-4 py-8 text-center text-xs text-slate-500">No faculty profiles have been added.</p>}
        </div>

        <form onSubmit={saveFaculty} className="space-y-3 border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{editingId ? "Edit faculty profile" : "Add faculty profile"}</h3>
            {editingId && <button type="button" aria-label="Cancel faculty edit" onClick={resetForm} className="p-1 text-slate-500"><X size={16} /></button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-medium text-slate-600">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Designation<input value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Qualification<input value={form.qualification} onChange={(event) => setForm({ ...form, qualification: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Specialization<input value={form.specialization} onChange={(event) => setForm({ ...form, specialization: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Experience<input value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
            <label className="text-xs font-medium text-slate-600">Display order<input type="number" min="0" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
          </div>
          <label className="block text-xs font-medium text-slate-600">Profile<textarea rows="3" value={form.profile} onChange={(event) => setForm({ ...form, profile: event.target.value })} className="mt-1 w-full border border-slate-300 px-2.5 py-2 text-xs" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-xs text-slate-700"><Upload size={14} />{photo?.name || "Choose photo"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] || null)} className="sr-only" /></label>
            <label className="flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-xs text-slate-700"><Upload size={14} />{resume?.name || "Choose resume PDF"}<input type="file" accept="application/pdf,.pdf" onChange={(event) => setResume(event.target.files?.[0] || null)} className="sr-only" /></label>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-700">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={Number(form.is_hod) === 1} onChange={(event) => setForm({ ...form, is_hod: event.target.checked ? 1 : 0 })} />Head of Department</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={Number(form.is_active) === 1} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} />Published</label>
          </div>
          <button disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">{editingId ? <Save size={14} /> : <Plus size={14} />}{editingId ? "Save profile" : "Add profile"}</button>
        </form>
      </div>
    </section>
  );
};

export default DepartmentFaculty;
