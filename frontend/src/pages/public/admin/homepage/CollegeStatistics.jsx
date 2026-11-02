import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  BarChart3,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-statistics";

const emptyForm = {
  label: "",
  value: "",
  description: "",
  display_order: 0,
  is_active: 1,
};

function CollegeStatistics() {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------
  // Fetch statistics
  // ---------------------------------------

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch statistics"
        );
      }

      setStatistics(result.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load college statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // ---------------------------------------
  // Form
  // ---------------------------------------

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
      display_order: statistics.length + 1,
    });

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      label: item.label || "",
      value: item.value || "",
      description: item.description || "",
      display_order: item.display_order ?? 0,
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

  // ---------------------------------------
  // Save
  // ---------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.label.trim()) {
      setError("Statistic label is required.");
      return;
    }

    if (!form.value.trim()) {
      setError("Statistic value is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        label: form.label.trim(),
        value: form.value.trim(),
        description: form.description.trim(),
        display_order: Number(form.display_order) || 0,
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
          result.message || "Failed to save statistic"
        );
      }

      closeModal();
      await fetchStatistics();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to save statistic"
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------------------
  // Delete
  // ---------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this statistic?"
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
          result.message || "Failed to delete statistic"
        );
      }

      await fetchStatistics();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to delete statistic"
      );
    }
  };

  // ---------------------------------------
  // Toggle status
  // ---------------------------------------

  const toggleStatus = async (item) => {
    try {
      setError("");

      const payload = {
        label: item.label,
        value: item.value,
        description: item.description || "",
        display_order: item.display_order,
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

      await fetchStatistics();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to update status"
      );
    }
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading college statistics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Homepage Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            College Statistics
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the statistics displayed below the homepage hero section.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850]"
        >
          <Plus size={18} />
          Add Statistic
        </button>

      </div>


      {/* Error */}

      {error && !modalOpen && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Empty */}

      {statistics.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0f3262]">
            <BarChart3 size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No statistics yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add statistics such as programmes, students, departments or years of excellence.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Add First Statistic
          </button>

        </div>
      ) : (

        /* Statistics Grid */

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {statistics.map((item) => (

            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                  <BarChart3 size={21} />
                </div>

                <span
                  className={
                    item.is_active
                      ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                      : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500"
                  }
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>

              </div>


              <div className="mt-5">

                <p className="text-3xl font-bold text-[#0f3262]">
                  {item.value}
                </p>

                <h2 className="mt-2 text-base font-bold text-slate-900">
                  {item.label}
                </h2>

                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

              </div>


              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                <span className="text-xs text-slate-400">
                  Order: {item.display_order}
                </span>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => toggleStatus(item)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    title={
                      item.is_active
                        ? "Deactivate"
                        : "Activate"
                    }
                  >
                    {item.is_active ? (
                      "●"
                    ) : (
                      "○"
                    )}
                  </button>

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
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}


      {/* Modal */}

      {modalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingId
                    ? "Edit Statistic"
                    : "Add Statistic"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Configure a homepage statistic.
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


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}


              {/* Value */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Value
                </label>

                <input
                  type="text"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  placeholder="50+"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>


              {/* Label */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Label
                </label>

                <input
                  type="text"
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  placeholder="Years of Excellence"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />

              </div>


              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Institutional experience and academic excellence."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Order + Status */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
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


              {/* Buttons */}

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
                    ? "Update Statistic"
                    : "Save Statistic"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default CollegeStatistics;