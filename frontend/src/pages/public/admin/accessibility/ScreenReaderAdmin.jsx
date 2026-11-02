import { useEffect, useState } from "react";
import {
  Edit,
  ExternalLink,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = {
  name: "",
  website_url: "",
  access_type: "Free",
  description: "",
  display_order: 1,
  is_active: 1,
};

export default function ScreenReaderAdmin() {
  const [readers, setReaders] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReaders();
  }, []);

  const fetchReaders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/screen-readers/admin/all`
      );

      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to fetch screen readers"
        );
      }

      setReaders(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN SCREEN READERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load screen readers."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (reader) => {
    setEditingId(reader.id);

    setForm({
      name: reader.name || "",
      website_url: reader.website_url || "",
      access_type:
        reader.access_type || "Free",
      description:
        reader.description || "",
      display_order:
        reader.display_order || 1,
      is_active:
        Number(reader.is_active) === 1 ? 1 : 0,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Screen reader name is required.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing
          ? `${API_BASE}/api/screen-readers/${editingId}`
          : `${API_BASE}/api/screen-readers`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            website_url:
              form.website_url.trim(),
            access_type: form.access_type,
            description:
              form.description.trim(),
            display_order:
              Number(form.display_order) || 1,
            is_active:
              Number(form.is_active) === 1 ? 1 : 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to save screen reader"
        );
      }

      setSuccess(
        isEditing
          ? "Screen reader updated successfully."
          : "Screen reader added successfully."
      );

      resetForm();
      await fetchReaders();
    } catch (err) {
      console.error(
        "SAVE SCREEN READER ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save screen reader."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this screen reader?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/screen-readers/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to delete screen reader"
        );
      }

      setSuccess(
        "Screen reader deleted successfully."
      );

      await fetchReaders();
    } catch (err) {
      console.error(
        "DELETE SCREEN READER ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to delete screen reader."
      );
    }
  };

  const toggleStatus = async (reader) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/screen-readers/${reader.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: reader.name,
            website_url:
              reader.website_url || "",
            access_type:
              reader.access_type || "Free",
            description:
              reader.description || "",
            display_order:
              Number(reader.display_order) || 1,
            is_active:
              Number(reader.is_active) === 1
                ? 0
                : 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to update status"
        );
      }

      setSuccess("Status updated successfully.");

      await fetchReaders();
    } catch (err) {
      console.error(
        "TOGGLE SCREEN READER ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to update status."
      );
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Screen Reader Access
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage screen reader software displayed on
            the public accessibility page.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <Plus size={18} />
          Add Screen Reader
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm mb-8">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">
            {editingId
              ? "Edit Screen Reader"
              : "Add Screen Reader"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Screen Reader Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. NVDA"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Website URL
              </label>

              <input
                type="url"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Access Type
              </label>

              <select
                name="access_type"
                value={form.access_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Free">
                  Free
                </option>

                <option value="Commercial">
                  Commercial
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>

              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>

              <select
                name="is_active"
                value={form.is_active}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value={1}>
                  Published
                </option>

                <option value={0}>
                  Hidden
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : editingId
                ? "Update Screen Reader"
                : "Save Screen Reader"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Screen Readers
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {readers.length} record
              {readers.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchReaders}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading...
          </div>
        ) : readers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No screen readers added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-4 text-left">
                    #
                  </th>

                  <th className="px-5 py-4 text-left">
                    Screen Reader
                  </th>

                  <th className="px-5 py-4 text-left">
                    Access
                  </th>

                  <th className="px-5 py-4 text-left">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {readers.map((reader, index) => (
                  <tr
                    key={reader.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {reader.name}
                      </div>

                      {reader.website_url && (
                        <a
                          href={
                            reader.website_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-xs text-blue-700 hover:underline"
                        >
                          Website
                          <ExternalLink
                            size={12}
                          />
                        </a>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {reader.access_type}
                    </td>

                    <td className="px-5 py-4">
                      {reader.display_order}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(reader)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          Number(
                            reader.is_active
                          ) === 1
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {Number(
                          reader.is_active
                        ) === 1
                          ? "Published"
                          : "Hidden"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(reader)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Edit size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(reader.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}