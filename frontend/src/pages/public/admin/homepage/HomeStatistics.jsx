import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-statistics";

const EMPTY_FORM = {
  label: "",
  value: "",
  description: "",
  display_order: 0,
  is_active: 1,
};

function HomeStatistics() {
  const [statistics, setStatistics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to load statistics."
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message || "Failed to load statistics."
        );
      }

      setStatistics(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error(
        "Statistics fetch error:",
        error
      );

      setError(
        error.message ||
          "Unable to load college statistics."
      );

      setStatistics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // OPEN ADD
  // ============================================================

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      display_order: statistics.length + 1,
    });

    setError("");
    setModalOpen(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      label: item.label ?? "",
      value: item.value ?? "",
      description: item.description ?? "",
      display_order:
        Number(item.display_order) || 0,
      is_active:
        Number(item.is_active) === 1 ? 1 : 0,
    });

    setError("");
    setModalOpen(true);
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.value.trim()) {
      setError("Statistic value is required.");
      return;
    }

    if (!form.label.trim()) {
      setError("Statistic label is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        label: form.label.trim(),
        value: form.value.trim(),
        description:
          form.description?.trim() || "",
        display_order:
          Number(form.display_order) || 0,
        is_active:
          Number(form.is_active) === 1 ? 1 : 0,
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Failed to save statistic."
        );
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await fetchStatistics();
    } catch (error) {
      console.error(
        "Save statistic error:",
        error
      );

      setError(
        error.message ||
          "Unable to save statistic."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

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

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Failed to delete statistic."
        );
      }

      await fetchStatistics();
    } catch (error) {
      console.error(
        "Delete statistic error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete statistic."
      );
    }
  };

  // ============================================================
  // TOGGLE ACTIVE
  // ============================================================

  const toggleStatus = async (item) => {
    try {
      setError("");

      const payload = {
        label: item.label ?? "",
        value: item.value ?? "",
        description:
          item.description ?? "",
        display_order:
          Number(item.display_order) || 0,
        is_active:
          Number(item.is_active) === 1
            ? 0
            : 1,
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

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Failed to update status."
        );
      }

      await fetchStatistics();
    } catch (error) {
      console.error(
        "Toggle statistic error:",
        error
      );

      setError(
        error.message ||
          "Unable to update statistic."
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                <BarChart3 size={24} />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading college statistics...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Homepage Management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              College Statistics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage the statistics displayed on the
              college homepage.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={fetchStatistics}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850]"
            >
              <Plus size={18} />
              Add Statistic
            </button>

          </div>
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && !modalOpen && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* ======================================================
            EMPTY
        ====================================================== */}

        {statistics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0f3262]">
              <BarChart3 size={28} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No statistics yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add statistics such as students,
              programmes, departments, years of
              excellence, or other institutional
              achievements.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2850]"
            >
              <Plus size={18} />
              Add First Statistic
            </button>

          </div>
        ) : (

          /* ====================================================
             STATISTICS GRID
          ==================================================== */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {statistics.map((item) => {

              const active =
                Number(item.is_active) === 1;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                      <BarChart3 size={21} />
                    </div>

                    <span
                      className={
                        active
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
                          : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
                      }
                    >
                      {active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="mt-6">

                    <p className="text-3xl font-bold tracking-tight text-[#0f3262]">
                      {item.value}
                    </p>

                    <h2 className="mt-2 text-base font-bold text-slate-900">
                      {item.label}
                    </h2>

                    {item.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    )}

                  </div>

                  {/* FOOTER */}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs font-medium text-slate-400">
                      Order {item.display_order}
                    </span>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(item)
                        }
                        title={
                          active
                            ? "Deactivate"
                            : "Activate"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <span className="text-sm">
                          {active ? "●" : "○"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(item)
                        }
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        title="Delete"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* ======================================================
            MODAL
        ====================================================== */}

        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* HEADER */}

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

                {/* VALUE */}

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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* LABEL */}

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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* DESCRIPTION */}

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
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* ORDER + STATUS */}

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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2850] disabled:cursor-not-allowed disabled:opacity-60"
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
    </div>
  );
}

export default HomeStatistics;