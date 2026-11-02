import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Link2,
  GripVertical,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/quick-links";

const emptyForm = {
  title: "",
  path: "",
  icon: "BookOpen",
  sort_order: 0,
  is_active: 1,
};

const iconOptions = [
  "GraduationCap",
  "Building2",
  "ShieldCheck",
  "Award",
  "Library",
  "Download",
  "BookOpen",
  "Users",
];

function QuickLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH
  // =====================================================

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin?_=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch quick links"
        );
      }

      setLinks(result.data || []);
    } catch (err) {
      console.error("Quick Links Admin Fetch Error:", err);

      setError(
        err.message || "Unable to load quick links"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // =====================================================
  // FORM
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: links.length + 1,
    });

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      path: item.path || "",
      icon: item.icon || "BookOpen",
      sort_order: item.sort_order ?? 0,
      is_active: item.is_active ? 1 : 0,
    });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.path.trim()) {
      setError("Path is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        path: form.path.trim(),
        icon: form.icon.trim(),
        sort_order: Number(form.sort_order) || 0,
        is_active: Number(form.is_active),
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save quick link"
        );
      }

      closeModal();
      await fetchLinks();
    } catch (err) {
      console.error("Quick Links Save Error:", err);

      setError(
        err.message || "Unable to save quick link"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quick link?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete quick link"
        );
      }

      await fetchLinks();
    } catch (err) {
      console.error("Quick Links Delete Error:", err);

      setError(
        err.message || "Unable to delete quick link"
      );
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const toggleStatus = async (item) => {
    try {
      setError("");

      const payload = {
        title: item.title,
        path: item.path,
        icon: item.icon || "BookOpen",
        sort_order: item.sort_order,
        is_active: item.is_active ? 0 : 1,
      };

      const response = await fetch(
        `${API_URL}/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update status"
        );
      }

      await fetchLinks();
    } catch (err) {
      console.error("Quick Links Status Error:", err);

      setError(
        err.message || "Unable to update status"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading quick links...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl px-6">

      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Homepage Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quick Links
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the important links displayed in the
            homepage Explore the College section.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850]"
        >
          <Plus size={18} />
          Add Quick Link
        </button>

      </div>

      {/* ERROR */}

      {error && !modalOpen && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0f3262]">
            <Link2 size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No quick links yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add important academic and institutional links
            for the homepage.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add First Quick Link
          </button>

        </div>
      ) : (

        /* LIST */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Title
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Path
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Icon
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {links.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <GripVertical
                          size={16}
                          className="text-slate-300"
                        />

                        {item.sort_order}
                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <div className="font-semibold text-slate-900">
                        {item.title}
                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <code className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.path}
                      </code>

                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0f3262]">
                        {item.icon || "BookOpen"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <button
                        type="button"
                        onClick={() => toggleStatus(item)}
                        className={
                          item.is_active
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                        }
                      >
                        {item.is_active
                          ? "Active"
                          : "Inactive"}
                      </button>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =================================================
          MODAL
      ================================================= */}

      {modalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingId
                    ? "Edit Quick Link"
                    : "Add Quick Link"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Configure a homepage quick link.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Programmes"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

              {/* PATH */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Path
                </label>

                <input
                  type="text"
                  name="path"
                  value={form.path}
                  onChange={handleChange}
                  placeholder="/academics/programmes"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-1 text-xs text-slate-400">
                  Example: /library or /departments
                </p>

              </div>

              {/* ICON */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Icon
                </label>

                <select
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {iconOptions.map((icon) => (
                    <option
                      key={icon}
                      value={icon}
                    >
                      {icon}
                    </option>
                  ))}
                </select>

              </div>

              {/* ORDER + STATUS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="is_active"
                    value={form.is_active}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={1}>
                      Active
                    </option>

                    <option value={0}>
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b2850] disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Quick Link"
                    : "Save Quick Link"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default QuickLinks;