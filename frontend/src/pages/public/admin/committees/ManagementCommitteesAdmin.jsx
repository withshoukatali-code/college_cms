import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const committees = [
  { key: "governing-management", label: "Governing Management Committee" },
  { key: "local-management", label: "Local Management Committee" },
];
const emptyForm = { member_name: "", designation: "", representation: "", display_order: 0, is_active: 1 };

async function requestMembers(committeeKey) {
  const response = await fetch(`${API_BASE}/api/management-committees?committee_key=${encodeURIComponent(committeeKey)}&includeInactive=1`);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Unable to load committee members.");
  return Array.isArray(result.data) ? result.data : [];
}

export default function ManagementCommitteesAdmin() {
  const [committeeKey, setCommitteeKey] = useState(committees[0].key);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const selectedCommittee = committees.find((item) => item.key === committeeKey) || committees[0];

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    requestMembers(committeeKey)
      .then((rows) => {
        if (!controller.signal.aborted) setMembers(rows);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [committeeKey]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const selectCommittee = (key) => {
    setCommitteeKey(key);
    setError("");
    setSuccess("");
    resetForm();
  };

  const editMember = (member) => {
    setEditingId(member.id);
    setForm({
      member_name: member.member_name || "",
      designation: member.designation || "",
      representation: member.representation || "",
      display_order: Number(member.display_order) || 0,
      is_active: Number(member.is_active) === 0 ? 0 : 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveMember = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        editingId ? `${API_BASE}/api/management-committees/${editingId}` : `${API_BASE}/api/management-committees`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, committee_key: committeeKey }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save committee member.");
      setSuccess(editingId ? "Member updated." : "Member added.");
      resetForm();
      setMembers(await requestMembers(committeeKey));
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (member) => {
    if (!window.confirm(`Delete ${member.member_name} from ${selectedCommittee.label}?`)) return;
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/management-committees/${member.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete committee member.");
      setSuccess("Member deleted.");
      if (editingId === member.id) resetForm();
      setMembers(await requestMembers(committeeKey));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-7 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Governance content</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Management Committees</h1>
            <p className="mt-1 text-sm text-slate-600">Maintain the published member registers for both committees.</p>
          </div>
          <span className="text-sm tabular-nums text-slate-500">{members.length} records</span>
        </div>
      </header>

      {error && <p role="alert" className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {success && <p role="status" className="mb-4 border-l-4 border-emerald-600 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      <div role="tablist" aria-label="Choose management committee" className="mb-7 flex flex-wrap border-b border-slate-200">
        {committees.map((committee) => (
          <button
            key={committee.key}
            type="button"
            role="tab"
            aria-selected={committee.key === committeeKey}
            onClick={() => selectCommittee(committee.key)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${committee.key === committeeKey ? "border-[#d9a31b] text-[#12345b]" : "border-transparent text-slate-500 hover:text-slate-900"}`}
          >
            {committee.label}
          </button>
        ))}
      </div>

      <form onSubmit={saveMember} className="mb-8 border-b border-slate-200 pb-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{selectedCommittee.label}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{editingId ? "Edit member" : "Add member"}</h2>
          </div>
          {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"><X size={16} /> Cancel</button>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Member name<input required maxLength={255} value={form.member_name} onChange={(event) => setForm({ ...form, member_name: event.target.value })} className="min-w-0 border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Designation<input required maxLength={255} value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} className="min-w-0 border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Representation<input maxLength={255} value={form.representation} onChange={(event) => setForm({ ...form, representation: event.target.value })} className="min-w-0 border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">Display order<input type="number" min="0" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: event.target.value })} className="min-w-0 border border-slate-300 px-3 py-2 font-normal" /></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={Number(form.is_active) === 1} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} /> Published on public page</label>
          <button type="submit" disabled={saving} className="ml-auto inline-flex items-center gap-2 bg-[#12345b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4a78] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <LoaderCircle size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />}
            {editingId ? "Save changes" : "Add member"}
          </button>
        </div>
      </form>

      <section aria-labelledby="member-list-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 id="member-list-heading" className="text-lg font-semibold text-slate-900">{selectedCommittee.label}</h2>
          <p className="text-sm text-slate-500">Drag-free ordering: lower display numbers appear first.</p>
        </div>
        <div className="overflow-x-auto border-y border-slate-300">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Order</th>
                <th scope="col" className="px-4 py-3 font-semibold">Member</th>
                <th scope="col" className="px-4 py-3 font-semibold">Designation</th>
                <th scope="col" className="px-4 py-3 font-semibold">Representation</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">Loading members...</td></tr>
              ) : members.length ? members.map((member) => (
                <tr key={member.id} className="align-middle even:bg-slate-50/70">
                  <td className="px-4 py-3 tabular-nums text-slate-500">{member.display_order}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{member.member_name}</td>
                  <td className="px-4 py-3 text-slate-700">{member.designation}</td>
                  <td className="px-4 py-3 text-slate-600">{member.representation || "—"}</td>
                  <td className="px-4 py-3"><span className={Number(member.is_active) === 1 ? "text-emerald-700" : "text-slate-500"}>{Number(member.is_active) === 1 ? "Published" : "Draft"}</span></td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => editMember(member)} className="border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-white">Edit</button><button type="button" onClick={() => deleteMember(member)} aria-label={`Delete ${member.member_name}`} className="inline-flex h-8 w-8 items-center justify-center border border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-700"><Trash2 size={15} /></button></div></td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">No records in this committee yet. Add verified member details above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}