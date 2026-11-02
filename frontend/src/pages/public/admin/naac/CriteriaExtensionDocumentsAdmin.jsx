import { useEffect, useRef, useState } from "react";
import {
  Edit,
  FileText,
  Plus,
  Trash2,
  Upload,
  X,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_URL =
  `${API_BASE}/api/naac/extension-profile`;

const initialForm = {
  extended_id: "",
  deviation_question: "",
  document_title: "",
  document_type: "",
  academic_year: "",
  description: "",
  display_order: 1,
  is_active: 1,
};

export default function ExtensionProfileAdmin() {
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [existingFile, setExistingFile] =
    useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  // --------------------------------------------------
  // FETCH
  // --------------------------------------------------

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to fetch Extension Profile."
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setRecords(data);
    } catch (err) {
      console.error(
        "FETCH EXTENSION PROFILE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load Extension Profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const resetForm = () => {
    setForm(initialForm);
    setSelectedFile(null);
    setExistingFile("");
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.id);

    setForm({
      extended_id:
        record.extended_id || "",

      deviation_question:
        record.deviation_question || "",

      document_title:
        record.document_title || "",

      document_type:
        record.document_type || "",

      academic_year:
        record.academic_year || "",

      description:
        record.description || "",

      display_order:
        record.display_order ?? 1,

      is_active:
        Number(record.is_active) === 1
          ? 1
          : 0,
    });

    setExistingFile(
      record.document_file || ""
    );

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ];

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      setError(
        "Only PDF, DOC, DOCX, XLS and XLSX files are allowed."
      );

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "File size must not exceed 10 MB."
      );

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    setError("");
    setSelectedFile(file);
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.extended_id.trim()) {
      setError(
        "Extended ID is required."
      );
      return;
    }

    if (
      !form.deviation_question.trim()
    ) {
      setError(
        "Deviation question is required."
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "extended_id",
        form.extended_id.trim()
      );

      formData.append(
        "deviation_question",
        form.deviation_question.trim()
      );

      formData.append(
        "document_title",
        form.document_title.trim()
      );

      formData.append(
        "document_type",
        form.document_type.trim()
      );

      formData.append(
        "academic_year",
        form.academic_year.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "display_order",
        String(form.display_order || 1)
      );

      formData.append(
        "is_active",
        String(
          Number(form.is_active) === 1
            ? 1
            : 0
        )
      );

      if (selectedFile) {
        formData.append(
          "document",
          selectedFile
        );
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to save Extension Profile."
        );
      }

      setSuccess(
        result?.message ||
          (editingId
            ? "Extension Profile updated successfully."
            : "Extension Profile added successfully.")
      );

      await fetchRecords();

      setTimeout(() => {
        setShowForm(false);
        resetForm();
        setSuccess("");
      }, 800);
    } catch (err) {
      console.error(
        "SAVE EXTENSION PROFILE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save Extension Profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Extension Profile record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to delete record."
        );
      }

      setRecords((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      setSuccess(
        result?.message ||
          "Extension Profile deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error(
        "DELETE EXTENSION PROFILE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // FILE URL
  // --------------------------------------------------

  const getFileUrl = (file) => {
    if (!file) return null;

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    if (file.startsWith("/")) {
      return `${API_BASE}${file}`;
    }

    return `${API_BASE}/${file}`;
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            NAAC / DVV
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Extension Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage extension profile questions
            and supporting documents.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingId
                  ? "Edit Extension Profile"
                  : "Add Extension Profile"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the extended question and
                supporting document.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              <X size={19} />
            </button>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            {/* Extended ID */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Extended ID{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="extended_id"
                value={form.extended_id}
                onChange={handleChange}
                placeholder="e.g. 1.1.1"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Academic Year
              </label>

              <input
                type="text"
                name="academic_year"
                value={form.academic_year}
                onChange={handleChange}
                placeholder="e.g. 2024-25"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Deviation Question */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Deviations of Extended
                Question{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                name="deviation_question"
                value={
                  form.deviation_question
                }
                onChange={handleChange}
                rows={4}
                placeholder="Enter the deviation / extended question"
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Document Title */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Document Title
              </label>

              <input
                type="text"
                name="document_title"
                value={form.document_title}
                onChange={handleChange}
                placeholder="Enter document title"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Document Type */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Document Type
              </label>

              <input
                type="text"
                name="document_type"
                value={form.document_type}
                onChange={handleChange}
                placeholder="e.g. PDF"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Display Order
              </label>

              <input
                type="number"
                min="1"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional description"
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* FILE */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Supporting Document
              </label>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    {selectedFile ? (
                      <>
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {(
                            selectedFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </>
                    ) : existingFile ? (
                      <>
                        <p className="text-sm font-semibold text-slate-700">
                          Existing document
                        </p>

                        <a
                          href={getFileUrl(
                            existingFile
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-500"
                        >
                          <Eye size={14} />
                          View current file
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No document selected
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-100"
                  >
                    <Upload size={17} />
                    Browse
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Allowed: PDF, DOC, DOCX, XLS,
                  XLSX. Maximum 10 MB.
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <label className="inline-flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    Number(form.is_active) === 1
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.checked
                        ? 1
                        : 0,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-400 focus:ring-blue-400"
                />

                <span className="text-sm text-slate-600">
                  Publish this record
                </span>
              </label>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {editingId ? (
                    <Edit size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {editingId
                    ? "Update Record"
                    : "Add Record"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Extension Profile Records
            </h2>

            <p className="text-xs text-slate-500">
              {records.length} record
              {records.length === 1
                ? ""
                : "s"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading Extension Profile...
            </p>
          </div>
        ) : records.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <FileText
              size={34}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 text-sm font-semibold text-slate-700">
              No Extension Profile
              records found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Click Add Record to create
              your first record.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-slate-200 px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Extended ID
                    </th>

                    <th className="border-b border-slate-200 px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Deviation / Question
                    </th>

                    <th className="border-b border-slate-200 px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Academic Year
                    </th>

                    <th className="border-b border-slate-200 px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="border-b border-slate-200 px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="border-b border-slate-200 px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => {
                    const fileUrl =
                      getFileUrl(
                        record.document_file
                      );

                    const active =
                      Number(
                        record.is_active
                      ) === 1;

                    return (
                      <tr
                        key={record.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4 align-top">
                          <span className="font-bold text-blue-400">
                            {record.extended_id ||
                              "—"}
                          </span>
                        </td>

                        <td className="max-w-[420px] px-5 py-4 align-top">
                          <p className="text-sm leading-6 text-slate-700">
                            {record.deviation_question ||
                              "—"}
                          </p>

                          {record.document_title && (
                            <p className="mt-2 text-xs font-semibold text-slate-500">
                              {
                                record.document_title
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4 align-top text-sm text-slate-600">
                          {record.academic_year ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-center align-top text-sm text-slate-600">
                          {record.display_order ||
                            1}
                        </td>

                        <td className="px-5 py-4 text-center align-top">
                          {active ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                              <Eye size={13} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                              <EyeOff
                                size={13}
                              />
                              Hidden
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center align-top">
                          <div className="flex items-center justify-center gap-2">
                            {fileUrl && (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View document"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-400"
                              >
                                <Download
                                  size={16}
                                />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  record
                                )
                              }
                              title="Edit"
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-400"
                            >
                              <Edit
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  record.id
                                )
                              }
                              disabled={
                                deletingId ===
                                record.id
                              }
                              title="Delete"
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                            >
                              {deletingId ===
                              record.id ? (
                                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {records.map((record) => {
                const fileUrl =
                  getFileUrl(
                    record.document_file
                  );

                const active =
                  Number(
                    record.is_active
                  ) === 1;

                return (
                  <article
                    key={record.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Extended ID
                        </p>

                        <p className="mt-1 text-lg font-bold text-blue-400">
                          {record.extended_id ||
                            "—"}
                        </p>
                      </div>

                      {active ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          Hidden
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Deviation / Question
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {record.deviation_question ||
                          "—"}
                      </p>
                    </div>

                    {record.document_title && (
                      <div className="mt-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Document
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {
                            record.document_title
                          }
                        </p>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Academic Year
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {record.academic_year ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Order
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {record.display_order ||
                            1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-400"
                        >
                          <Download
                            size={14}
                          />
                          View
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            record
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                      >
                        <Edit size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            record.id
                          )
                        }
                        disabled={
                          deletingId ===
                          record.id
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 disabled:opacity-50"
                      >
                        <Trash2
                          size={14}
                        />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}