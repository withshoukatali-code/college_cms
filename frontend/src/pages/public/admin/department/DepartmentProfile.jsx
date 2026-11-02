import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const EMPTY_PROFILE = {
  established_year: "",
  short_description: "",
  about_department: "",
  vision: "",
  mission: "",
  department_image_url: "",
  email: "",
  phone: "",
  office_location: "",
  is_active: 1,
};

const DepartmentProfile = ({ departmentId }) => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;
    fetch(`${API_BASE}/api/department-profile/department/${departmentId}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load department profile.");
        return result.profile;
      })
      .then((record) => {
        if (!current) return;
        setProfile(record);
        setForm(record ? {
          established_year: record.established_year || "",
          short_description: record.short_description || "",
          about_department: record.about_department || "",
          vision: record.vision || "",
          mission: record.mission || "",
          department_image_url: record.department_image_url || "",
          email: record.email || "",
          phone: record.phone || "",
          office_location: record.office_location || "",
          is_active: Number(record.is_active) === 1 ? 1 : 0,
        } : EMPTY_PROFILE);
      })
      .catch((err) => {
        if (current) setError(err.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, [departmentId]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        profile
          ? `${API_BASE}/api/department-profile/${profile.id}`
          : `${API_BASE}/api/department-profile`,
        {
          method: profile ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, department_id: departmentId }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save department profile.");
      setProfile((previous) => previous ? { ...previous, ...form } : { ...form, id: result.profile_id });
      setMessage(profile ? "Profile updated." : "Profile created.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!profile || !window.confirm("Delete this department profile?")) return;
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/department-profile/${profile.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete profile.");
      setProfile(null);
      setForm(EMPTY_PROFILE);
      setMessage("Profile deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  const inputClass = "mt-1 w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600";
  const fields = [
    ["established_year", "Established year"],
    ["short_description", "Short description"],
    ["about_department", "About department"],
    ["vision", "Vision"],
    ["mission", "Mission"],
    ["department_image_url", "Department image URL"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["office_location", "Office location"],
  ];

  if (loading) return <p className="p-5 text-sm text-slate-500">Loading department profile...</p>;

  return (
    <form onSubmit={save} className="space-y-4 border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Department Profile</h2>
        <p className="mt-1 text-xs text-slate-500">{profile ? "Edit or delete the department profile." : "No profile exists yet. Create one for this department."}</p>
      </div>
      {error && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([name, label]) => (
          <label key={name} className="text-xs font-medium text-slate-600">
            {label}
            {name === "about_department" || name === "short_description" || name === "vision" || name === "mission" ? (
              <textarea rows={name === "about_department" ? 5 : 3} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className={inputClass} />
            ) : (
              <input type={name === "email" ? "email" : "text"} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className={inputClass} />
            )}
          </label>
        ))}
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={Number(form.is_active) === 1} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} />Published</label>
      <div className="flex flex-wrap gap-2">
        <button disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Save size={15} />{saving ? "Saving..." : profile ? "Save profile" : "Create profile"}</button>
        {profile && <button type="button" onClick={remove} className="inline-flex items-center gap-2 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 size={15} />Delete profile</button>}
      </div>
    </form>
  );
};

export default DepartmentProfile;
