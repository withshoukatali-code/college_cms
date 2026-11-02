import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Megaphone,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/breaking-news";

const emptyForm = {
  title: "",
  category: "News",
  publish_date: "",
  is_breaking: 1,
  is_active: 1,
};

function formatDate(date) {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toInputDate(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BreakingNews() {
  const [news, setNews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH
  // =====================================================

  const fetchNews = async () => {
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
          result.message || "Failed to fetch breaking news"
        );
      }

      setNews(result.data || []);
    } catch (err) {
      console.error("Breaking News Admin Error:", err);

      setError(
        err.message || "Unable to load breaking news"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD
  // =====================================================

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      publish_date: new Date()
        .toISOString()
        .slice(0, 10),
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      category: item.category || "News",
      publish_date: toInputDate(item.publish_date),
      is_breaking: item.is_breaking ? 1 : 0,
      is_active: item.is_active ? 1 : 0,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // =====================================================
  // CLOSE
  // =====================================================

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
      setError("News title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || "News",
        publish_date:
          form.publish_date || null,
        is_breaking: Number(form.is_breaking),
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
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save breaking news"
        );
      }

      setSuccess(
        editingId
          ? "Breaking news updated successfully."
          : "Breaking news created successfully."
      );

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      await fetchNews();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to save breaking news"
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
      "Are you sure you want to delete this breaking news?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete breaking news"
        );
      }

      setSuccess(
        "Breaking news deleted successfully."
      );

      await fetchNews();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to delete breaking news"
      );
    }
  };

  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================

  const toggleActive = async (item) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        title: item.title,
        category: item.category || "News",
        publish_date: toInputDate(item.publish_date),
        is_breaking: item.is_breaking ? 1 : 0,
        is_active: item.is_active ? 0 : 1,
      };

      const response = await fetch(
        `${API_URL}/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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

      await fetchNews();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to update status"
      );
    }
  };

  // =====================================================
  // TOGGLE BREAKING
  // =====================================================

  const toggleBreaking = async (item) => {
    try {
      setError("");
      setSuccess("");

      const payload = {
        title: item.title,
        category: item.category || "News",
        publish_date: toInputDate(item.publish_date),
        is_breaking: item.is_breaking ? 0 : 1,
        is_active: item.is_active ? 1 : 0,
      };

      const response = await fetch(
        `${API_URL}/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update breaking status"
        );
      }

      await fetchNews();
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Unable to update breaking status"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Megaphone className="mx-auto text-[#0f3262]" size={32} />

          <p className="mt-4 text-sm text-slate-500">
            Loading breaking news...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
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
            Breaking News
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the news items displayed in the homepage
            breaking-news ticker.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850]"
        >
          <Plus size={18} />
          Add Breaking News
        </button>

      </div>

      {/* SUCCESS */}

      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* ERROR */}

      {error && !modalOpen && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {news.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Megaphone size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No breaking news
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Add a news item and mark it as breaking news
            to display it in the homepage ticker.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add First News
          </button>

        </div>
      ) : (

        /* TABLE */

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    News
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Publish Date
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Breaking
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {news.map((item) => (

                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-start gap-3">

                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
                          <Megaphone size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {item.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {item.category || "News"}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {formatDate(item.publish_date)}
                    </td>

                    <td className="px-6 py-5 text-center">

                      <button
                        type="button"
                        onClick={() => toggleBreaking(item)}
                        title={
                          item.is_breaking
                            ? "Remove from breaking news"
                            : "Mark as breaking news"
                        }
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${
                          item.is_breaking
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.is_breaking
                          ? "Breaking"
                          : "Normal"}
                      </button>

                    </td>

                    <td className="px-6 py-5 text-center">

                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        title={
                          item.is_active
                            ? "Deactivate"
                            : "Activate"
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          item.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.is_active ? (
                          <>
                            <Eye size={13} />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={13} />
                            Inactive
                          </>
                        )}
                      </button>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
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

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingId
                    ? "Edit Breaking News"
                    : "Add Breaking News"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage the homepage ticker item.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
                  News Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Admission forms are now available..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Admission"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* DATE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Publish Date
                </label>

                <input
                  type="date"
                  name="publish_date"
                  value={form.publish_date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* OPTIONS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Breaking Status
                  </label>

                  <select
                    name="is_breaking"
                    value={form.is_breaking}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={1}>
                      Breaking News
                    </option>

                    <option value={0}>
                      Normal News
                    </option>

                  </select>

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
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2850] disabled:opacity-60"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update News"
                    : "Save News"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default BreakingNews;