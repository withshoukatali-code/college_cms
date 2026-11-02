import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  academic_year: "",
  document_title: "",
  document_type: "AQAR",
  description: "",
  display_order: 1,
  is_active: 1,
  document: null,
};

const documentTypes = [
  "AQAR",
  "Supporting Document",
  "Annexure",
  "Other",
];

export default function AqarAdmin() {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/naac/aqar`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to load AQAR documents."
        );
      }

      setDocuments(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "AQAR ADMIN FETCH ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load AQAR documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target;

    if (type === "file") {
      setForm((previous) => ({
        ...previous,
        [name]: files?.[0] || null,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    setEditingId(null);

    setForm({
      ...initialForm,
    });

    const fileInput =
      document.getElementById(
        "aqar-document-file"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      academic_year:
        item.academic_year || "",

      document_title:
        item.document_title || "",

      document_type:
        item.document_type || "AQAR",

      description:
        item.description || "",

      display_order:
        item.display_order ?? 1,

      is_active:
        Number(item.is_active) === 1 ? 1 : 0,

      document: null,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.academic_year.trim()) {
        throw new Error(
          "Please enter academic year."
        );
      }

      if (!form.document_title.trim()) {
        throw new Error(
          "Please enter document title."
        );
      }

      if (!editingId && !form.document) {
        throw new Error(
          "Please select an AQAR document."
        );
      }

      const formData = new FormData();

      formData.append(
        "academic_year",
        form.academic_year.trim()
      );

      formData.append(
        "document_title",
        form.document_title.trim()
      );

      formData.append(
        "document_type",
        form.document_type || "AQAR"
      );

      formData.append(
        "description",
        form.description?.trim() || ""
      );

      formData.append(
        "display_order",
        String(
          form.display_order || 1
        )
      );

      formData.append(
        "is_active",
        String(
          Number(form.is_active) === 1
            ? 1
            : 0
        )
      );

      if (form.document) {
        formData.append(
          "document",
          form.document
        );
      }

      const url = editingId
        ? `${API_BASE}/api/naac/aqar/${editingId}`
        : `${API_BASE}/api/naac/aqar`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to save AQAR document."
        );
      }

      setSuccess(
        editingId
          ? "AQAR document updated successfully."
          : "AQAR document added successfully."
      );

      resetForm();

      await fetchDocuments();
    } catch (err) {
      console.error(
        "AQAR ADMIN SAVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save AQAR document."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this AQAR document? The uploaded file will also be deleted."
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE}/api/naac/aqar/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Delete failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to delete AQAR document."
        );
      }

      setSuccess(
        "AQAR document deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchDocuments();
    } catch (err) {
      console.error(
        "AQAR ADMIN DELETE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to delete AQAR document."
      );
    }
  };

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  const handleToggleStatus = async (item) => {
    try {
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "academic_year",
        item.academic_year || ""
      );

      formData.append(
        "document_title",
        item.document_title || ""
      );

      formData.append(
        "document_type",
        item.document_type || "AQAR"
      );

      formData.append(
        "description",
        item.description || ""
      );

      formData.append(
        "display_order",
        String(
          item.display_order || 1
        )
      );

      formData.append(
        "is_active",
        Number(item.is_active) === 1
          ? "0"
          : "1"
      );

      const response = await fetch(
        `${API_BASE}/api/naac/aqar/${item.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to change document status."
        );
      }

      setSuccess(
        "AQAR document status updated."
      );

      await fetchDocuments();
    } catch (err) {
      console.error(
        "AQAR STATUS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to change document status."
      );
    }
  };

  /* =======================================================
     FILE URL
  ======================================================= */

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return `${API_BASE}${filePath}`;
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                NAAC
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                AQAR Documents
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage Annual Quality Assurance
                Reports and supporting documents.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <Plus size={17} />

              Add AQAR Document
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Error
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {success}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="ml-auto"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <section className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingId
                    ? "Edit AQAR Document"
                    : "Add AQAR Document"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload the official AQAR report or
                  supporting document.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <X size={16} />

                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Academic Year */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Academic Year
                  <span className="text-red-500">
                    {" "}
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="academic_year"
                  value={form.academic_year}
                  onChange={handleChange}
                  placeholder="e.g. 2025-26"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Document Type */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Document Type
                </label>

                <select
                  name="document_type"
                  value={form.document_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {documentTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Document Title */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Document Title
                  <span className="text-red-500">
                    {" "}
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="document_title"
                  value={
                    form.document_title
                  }
                  onChange={handleChange}
                  placeholder="Annual Quality Assurance Report 2025-26"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Brief description of the AQAR document..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Display Order */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  min="1"
                  value={form.display_order}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* File */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  AQAR Document
                  {!editingId && (
                    <span className="text-red-500">
                      {" "}
                      *
                    </span>
                  )}
                </label>

                <input
                  id="aqar-document-file"
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  PDF, DOC, DOCX, XLS or XLSX. Maximum
                  size: 10 MB.
                </p>

                {editingId &&
                  !form.document && (
                    <p className="mt-1 text-xs text-blue-600">
                      Leave empty to keep the existing
                      document.
                    </p>
                  )}
              </div>

              {/* Active */}

              <div className="md:col-span-2">
                <label className="inline-flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={
                      Number(
                        form.is_active
                      ) === 1
                    }
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />

                  <span className="text-sm font-semibold text-gray-700">
                    Publish this document
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle
                      size={17}
                    />

                    {editingId
                      ? "Update Document"
                      : "Save Document"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <X size={17} />

                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* =================================================
            DOCUMENT LIST
        ================================================= */}

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AQAR Documents
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {documents.length} document
                {documents.length !== 1
                  ? "s"
                  : ""}{" "}
                found.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDocuments}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />

              Refresh
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                Loading documents...
              </p>
            </div>
          ) : documents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-base font-semibold text-gray-800">
                No AQAR documents found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first AQAR document using the
                form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {documents.map((item) => {
                const fileUrl =
                  getFileUrl(
                    item.document_file
                  );

                const active =
                  Number(
                    item.is_active
                  ) === 1;

                return (
                  <div
                    key={item.id}
                    className="px-6 py-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* DOCUMENT INFO */}

                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          <FileText
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {
                                item.document_title
                              }
                            </h3>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {
                                item.document_type
                              }
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {active
                                ? "Published"
                                : "Hidden"}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                            <span>
                              Academic Year:{" "}
                              <strong className="text-gray-700">
                                {
                                  item.academic_year
                                }
                              </strong>
                            </span>

                            <span>
                              Order:{" "}
                              <strong className="text-gray-700">
                                {
                                  item.display_order
                                }
                              </strong>
                            </span>

                            <span>
                              Added:{" "}
                              <strong className="text-gray-700">
                                {formatDate(
                                  item.created_at
                                )}
                              </strong>
                            </span>
                          </div>

                          {item.description && (
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                              {
                                item.description
                              }
                            </p>
                          )}

                          {item.document_file && (
                            <p className="mt-2 break-all text-xs text-gray-400">
                              {
                                item.document_file
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Download
                              size={16}
                            />

                            Open
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(
                              item
                            )
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                            active
                              ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {active
                            ? "Hide"
                            : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <Edit size={16} />

                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                        >
                          <Trash2
                            size={16}
                          />

                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}