import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    Save,
    RefreshCw,
    BookOpen,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import DepartmentProgrammes from "./DepartmentProgrammes";
import DepartmentSections from "./DepartmentSections";
import DepartmentFaculty from "./DepartmentFaculty";

const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
    name: "",
    slug: "",
    short_name: "",
    department_image: "",
    tagline: "",
    description: "",
    established_year: "",
    programme: "",
    affiliation: "",
    hod_name: "",
    hod_designation: "Head of Department",
    hod_qualification: "",
    hod_image: "",
    hod_profile: "",
    display_order: 0,
    is_active: 1,
};

const DepartmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY_FORM);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
     * Important:
     * After creating a department, we use the returned ID
     * so that Programmes can immediately be managed.
     */
    const [departmentId, setDepartmentId] = useState(
        isEdit && !isNaN(Number(id)) ? Number(id) : null
    );

    /* =========================================================
       FETCH DEPARTMENT FOR EDIT
    ========================================================= */

    useEffect(() => {
        if (!isEdit) return undefined;

        let current = true;
        fetch(`${API_BASE}/api/departments/id/${id}`)
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load department");
                }
                return data.department;
            })
            .then((department) => {
                if (!current) return;
                setError("");
                setSuccess("");
                setForm({
                name: department.name || "",
                slug: department.slug || "",
                short_name: department.short_name || "",
                department_image: department.department_image || "",
                tagline: department.tagline || "",
                description: department.description || "",
                established_year:
                    department.established_year || "",
                programme: department.programme || "",
                affiliation: department.affiliation || "",
                hod_name: department.hod_name || "",
                hod_designation:
                    department.hod_designation ||
                    "Head of Department",
                hod_qualification:
                    department.hod_qualification || "",
                hod_image: department.hod_image || "",
                hod_profile: department.hod_profile || "",
                display_order:
                    department.display_order ?? 0,
                is_active:
                    Number(department.is_active) === 1 ? 1 : 0,
                });
                setDepartmentId(Number(department.id));
            })
            .catch((err) => {
                if (!current) return;
                console.error("FETCH DEPARTMENT ERROR:", err);
                setError(err.message || "Unable to load department");
            })
            .finally(() => {
                if (current) setLoading(false);
            });

        return () => {
            current = false;
        };
    }, [id, isEdit]);

    /* =========================================================
       INPUT HANDLER
    ========================================================= */

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                        ? 1
                        : 0
                    : name === "slug"
                      ? generateSlug(value)
                      : value,
        }));

        setError("");
        setSuccess("");
    };

    /* =========================================================
       AUTO SLUG
    ========================================================= */

    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((previous) => ({
            ...previous,
            name: value,
            slug: !isEdit ? generateSlug(value) : previous.slug,
        }));

        setError("");
        setSuccess("");
    };

    /* =========================================================
       SAVE
    ========================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Department name is required.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                slug: isEdit
                    ? form.slug.trim() || generateSlug(form.name)
                    : generateSlug(form.name),
                short_name: form.short_name.trim(),

                department_image:
                    form.department_image || null,

                tagline: form.tagline.trim() || null,

                description:
                    form.description.trim() || null,

                established_year:
                    form.established_year || null,

                programme:
                    form.programme.trim() || null,

                affiliation:
                    form.affiliation.trim() || null,

                hod_name:
                    form.hod_name.trim() || null,

                hod_designation:
                    form.hod_designation.trim() || null,

                hod_qualification:
                    form.hod_qualification.trim() || null,

                hod_image:
                    form.hod_image || null,

                hod_profile:
                    form.hod_profile.trim() || null,

                display_order:
                    Number(form.display_order) || 0,

                is_active:
                    Number(form.is_active) === 1 ? 1 : 0,
            };

            const url = isEdit
                ? `${API_BASE}/api/departments/${id}`
                : `${API_BASE}/api/departments`;

            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        `Failed to ${
                            isEdit ? "update" : "create"
                        } department`
                );
            }

            /*
             * API returns the saved department.
             *
             * This is especially important for NEW departments:
             * the generated database ID is required by
             * DepartmentProgrammes.
             */
            const savedDepartment =
                data.department || data.data;

            const savedId = Number(
                savedDepartment?.id ||
                    data.id ||
                    data.department_id
            );

            if (!savedId) {
                throw new Error(
                    "Department saved, but no department ID was returned by the server."
                );
            }

            setDepartmentId(savedId);

            setSuccess(
                isEdit
                    ? "Department updated successfully."
                    : "Department created successfully. You can now add programmes."
            );

            /*
             * For a newly created department, change the browser
             * URL to the edit route without leaving the page.
             */
            if (!isEdit) {
                navigate(`/admin/departments/${savedId}`, {
                    replace: true,
                });
            }
        } catch (err) {
            console.error("SAVE DEPARTMENT ERROR:", err);

            setError(
                err.message || "Unable to save department."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Loading department...</span>
                </div>
            </div>
        );
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="min-h-screen bg-slate-50 py-0">
            <div className="mx-auto max-w-7xl">

                {/* =================================================
                   HEADER
                ================================================== */}

                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/departments")
                        }
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Departments
                    </button>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building2 className="h-4 w-4" />
                                <span>Departments</span>
                                <span>/</span>
                                <span>
                                    {isEdit
                                        ? "Edit Department"
                                        : "Create Department"}
                                </span>
                            </div>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {isEdit
                                    ? "Edit Department"
                                    : "Create Department"}
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage the department's core academic
                                and institutional information.
                            </p>
                        </div>

                        {departmentId && (
                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <div className="text-xs uppercase tracking-wide text-slate-400">
                                    Department ID
                                </div>

                                <div className="mt-1 text-lg font-bold text-slate-800">
                                    #{departmentId}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* =================================================
                   ALERTS
                ================================================== */}

                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="font-semibold text-red-800">
                                Unable to save department
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                        <div>
                            <p className="font-semibold text-emerald-800">
                                Success
                            </p>

                            <p className="mt-1 text-sm text-emerald-700">
                                {success}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================================
                   DEPARTMENT FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* =================================================
                       BASIC INFORMATION
                    ================================================== */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <Building2 className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Department Information
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Basic identity and academic
                                        classification
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">

                            {/* Department Name */}

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Department Name
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Department of English"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                            </div>

                            {/* Short Name */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Short Name / Code
                                </label>

                                <input
                                    type="text"
                                    name="short_name"
                                    value={form.short_name}
                                    onChange={handleChange}
                                    placeholder="e.g. ENG"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Slug */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    URL Slug
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="generated-from-department-name"
                                    readOnly={!isEdit}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${isEdit ? "border-slate-300" : "border-slate-200 bg-slate-50"}`}
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    {isEdit ? "Used for the public department URL. Editing is available after creation." : "Generated automatically from the department name."}
                                </p>
                            </div>

                            {/* Established Year */}

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Established Year
                                </label>

                                <input
                                    type="text"
                                    name="established_year"
                                    value={form.established_year}
                                    onChange={handleChange}
                                    placeholder="e.g. 1965"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Display Order */}

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
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Existing Programme */}

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Programme
                                </label>

                                <input
                                    type="text"
                                    name="programme"
                                    value={form.programme}
                                    onChange={handleChange}
                                    placeholder="e.g. B.A. / M.A."
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Kept for compatibility with existing
                                    department data.
                                </p>
                            </div>

                            {/* Affiliation */}

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Affiliation
                                </label>

                                <input
                                    type="text"
                                    name="affiliation"
                                    value={form.affiliation}
                                    onChange={handleChange}
                                    placeholder="e.g. Dr. Babasaheb Ambedkar Marathwada University"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Tagline */}

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Department Tagline
                                </label>

                                <input
                                    type="text"
                                    name="tagline"
                                    value={form.tagline}
                                    onChange={handleChange}
                                    placeholder="A short academic identity for the department"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Description */}

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Department Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Enter a brief description of the department..."
                                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                       HOD BASIC INFORMATION
                    ================================================== */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4 md:px-6">
                            <h2 className="font-bold text-slate-900">
                                Department Head Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                This HOD information appears in the public department sidebar.
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    HOD Name
                                </label>

                                <input
                                    type="text"
                                    name="hod_name"
                                    value={form.hod_name}
                                    onChange={handleChange}
                                    placeholder="Enter HOD name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    HOD Designation
                                </label>

                                <input
                                    type="text"
                                    name="hod_designation"
                                    value={form.hod_designation}
                                    onChange={handleChange}
                                    placeholder="Head of Department"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    HOD Qualification
                                </label>

                                <input
                                    type="text"
                                    name="hod_qualification"
                                    value={form.hod_qualification}
                                    onChange={handleChange}
                                    placeholder="e.g. M.A., Ph.D., NET"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    HOD Profile
                                </label>

                                <textarea
                                    name="hod_profile"
                                    value={form.hod_profile}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Short professional profile..."
                                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                    </section>

                    {/* =================================================
                       STATUS
                    ================================================== */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Department Status
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Inactive departments will not appear
                                    on the public website.
                                </p>
                            </div>

                            <label className="inline-flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        Number(form.is_active) === 1
                                    }
                                    onChange={handleChange}
                                    className="h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                                />

                                <span className="text-sm font-semibold text-slate-700">
                                    Active Department
                                </span>
                            </label>
                        </div>
                    </section>

                    {/* =================================================
                       SAVE BUTTON
                    ================================================== */}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/departments")
                            }
                            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {isEdit
                                        ? "Update Department"
                                        : "Create Department"}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* =================================================
                   PROGRAMMES
                   ONLY AVAILABLE AFTER DEPARTMENT HAS AN ID
                ================================================== */}

                {departmentId && (
                    <section className="mt-8">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                                <BookOpen className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Academic Programmes
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Manage programmes offered by this
                                    department.
                                </p>
                            </div>
                        </div>

                        <DepartmentProgrammes
                            departmentId={departmentId}
                            departmentName={form.name}
                        />
                    </section>
                )}

                {departmentId && (
                    <DepartmentSections departmentId={departmentId} />
                )}

                {departmentId && (
                    <DepartmentFaculty departmentId={departmentId} />
                )}
            </div>
        </div>
    );
};

export default DepartmentForm;