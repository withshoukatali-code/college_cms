
import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    Clock3,
    Eye,
    EyeOff,
    FileText,
    GraduationCap,
    Layers3,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    Upload,
    Users,
    X,
} from "lucide-react";

const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const fetchProgrammes = async (departmentId) => {
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
        throw new Error("A valid department ID is required.");
    }
    const response = await fetch(`${API_BASE}/api/department-programmes/department/${departmentId}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result?.message || "Unable to load programmes.");
    const data = result?.programmes || result?.data || [];
    return Array.isArray(data) ? data : [];
};

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
    programme_level: "UG",
    programme_name: "",
    programme_code: "",
    duration: "",
    intake_capacity: "",
    eligibility: "",
    description: "",
    syllabus_url: "",
    syllabus_content: "",
    display_order: 0,
    is_active: 1,
};

/* =========================================================
   PROGRAMME LEVELS
========================================================= */

const PROGRAMME_LEVELS = [
    {
        value: "UG",
        label: "Undergraduate",
        short: "UG",
    },
    {
        value: "PG",
        label: "Postgraduate",
        short: "PG",
    },
    {
        value: "PhD",
        label: "Doctoral / Ph.D.",
        short: "PhD",
    },
    {
        value: "Certificate",
        label: "Certificate",
        short: "Certificate",
    },
    {
        value: "Diploma",
        label: "Diploma",
        short: "Diploma",
    },
    {
        value: "Other",
        label: "Other",
        short: "Other",
    },
];

const SYLLABUS_TAGS = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "BLOCKQUOTE", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TH", "TD", "SPAN", "DIV"]);

const sanitizePastedSyllabus = (html) => {
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const cleanNode = (node) => {
        [...node.children].forEach((child) => {
            if (["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(child.tagName)) {
                child.remove();
                return;
            }
            cleanNode(child);
            if (!SYLLABUS_TAGS.has(child.tagName)) {
                child.replaceWith(...child.childNodes);
                return;
            }
            [...child.attributes].forEach((attribute) => {
                const allowed = ["colspan", "rowspan", "scope"].includes(attribute.name.toLowerCase());
                if (!allowed) child.removeAttribute(attribute.name);
            });
        });
    };
    cleanNode(parsed.body);
    return parsed.body.innerHTML;
};

const SyllabusContentEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const handlePaste = (event) => {
        event.preventDefault();
        const clipboardHtml = event.clipboardData.getData("text/html");
        const clipboardText = event.clipboardData.getData("text/plain");
        const safeHtml = clipboardHtml
            ? sanitizePastedSyllabus(clipboardHtml)
            : clipboardText.split(/\r?\n/).map((line) => `<p>${line.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character])}</p>`).join("");
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        if (!editor.contains(range.commonAncestorContainer)) {
            range.selectNodeContents(editor);
            range.collapse(false);
        }
        range.deleteContents();
        const fragment = range.createContextualFragment(safeHtml);
        const lastNode = fragment.lastChild;
        range.insertNode(fragment);
        if (lastNode) {
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        onChange(editor.innerHTML);
    };

    return (
        <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(event) => onChange(event.currentTarget.innerHTML)}
            onPaste={handlePaste}
            className="min-h-40 overflow-x-auto border border-slate-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-blue-600 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-50 [&_th]:px-2 [&_th]:py-1"
            aria-label="Syllabus content editor"
        />
    );
};

/* =========================================================
   HELPERS
========================================================= */

const getLevelLabel = (level) => {
    const item = PROGRAMME_LEVELS.find(
        (entry) => entry.value === level
    );

    return item ? item.label : level || "Programme";
};

const getLevelShort = (level) => {
    const item = PROGRAMME_LEVELS.find(
        (entry) => entry.value === level
    );

    return item ? item.short : level || "Programme";
};

const getFileName = (url) => {
    if (!url) {
        return "";
    }

    try {
        return decodeURIComponent(
            url.split("/").pop().split("?")[0]
        );
    } catch {
        return url.split("/").pop();
    }
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const DepartmentProgrammes = ({
    departmentId,
    departmentName = "Department",
}) => {
    const numericDepartmentId = Number(departmentId);

    /* =====================================================
       STATE
    ===================================================== */

    const [programmes, setProgrammes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        ...EMPTY_FORM,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =====================================================
       LOAD PROGRAMMES
    ===================================================== */

    const loadProgrammes = async () => {
        try {
            setLoading(true);
            setError("");
            setProgrammes(await fetchProgrammes(numericDepartmentId));
        } catch (err) {
            console.error(
                "LOAD PROGRAMMES ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to load academic programmes."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        let current = true;
        fetchProgrammes(numericDepartmentId)
            .then((rows) => {
                if (current) setProgrammes(rows);
            })
            .catch((err) => {
                if (current) setError(err.message || "Unable to load academic programmes.");
            })
            .finally(() => {
                if (current) setLoading(false);
            });
        return () => {
            current = false;
        };
    }, [numericDepartmentId]);

    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => {
            setSuccess("");
        }, 3500);

        return () => clearTimeout(timer);
    }, [success]);

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = useMemo(() => {
        const total = programmes.length;

        let published = 0;
        let hidden = 0;
        let ug = 0;
        let pg = 0;

        programmes.forEach((programme) => {
            if (Number(programme.is_active) === 1) {
                published += 1;
            } else {
                hidden += 1;
            }

            if (programme.programme_level === "UG") {
                ug += 1;
            }

            if (programme.programme_level === "PG") {
                pg += 1;
            }
        });

        return {
            total,
            published,
            hidden,
            ug,
            pg,
        };
    }, [programmes]);

    /* =====================================================
       GROUP PROGRAMMES
    ===================================================== */

    const groupedProgrammes = useMemo(() => {
        const groups = {};

        programmes.forEach((programme) => {
            const level =
                programme.programme_level || "Other";

            if (!groups[level]) {
                groups[level] = [];
            }

            groups[level].push(programme);
        });

        Object.keys(groups).forEach((level) => {
            groups[level].sort((a, b) => {
                const orderA = Number(
                    a.display_order || 0
                );

                const orderB = Number(
                    b.display_order || 0
                );

                if (orderA !== orderB) {
                    return orderA - orderB;
                }

                return String(
                    a.programme_name || ""
                ).localeCompare(
                    String(b.programme_name || "")
                );
            });
        });

        const order = [
            "UG",
            "PG",
            "PhD",
            "Certificate",
            "Diploma",
            "Other",
        ];

        return Object.entries(groups).sort(
            ([levelA], [levelB]) => {
                const indexA =
                    order.indexOf(levelA);

                const indexB =
                    order.indexOf(levelB);

                const safeA =
                    indexA === -1 ? 999 : indexA;

                const safeB =
                    indexB === -1 ? 999 : indexB;

                return safeA - safeB;
            }
        );
    }, [programmes]);

    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    /* =====================================================
       OPEN ADD FORM
    ===================================================== */

    const openAddForm = () => {
        setEditingId(null);

        setForm({
            programme_level: "UG",
            programme_name: "",
            programme_code: "",
            duration: "",
            intake_capacity: "",
            eligibility: "",
            description: "",
            syllabus_url: "",
            syllabus_content: "",
            display_order:
                programmes.length + 1,
            is_active: 1,
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    /* =====================================================
       OPEN EDIT FORM
    ===================================================== */

    const openEditForm = (programme) => {
        setEditingId(programme.id);

        setForm({
            programme_level:
                programme.programme_level || "UG",

            programme_name:
                programme.programme_name || "",

            programme_code:
                programme.programme_code || "",

            duration:
                programme.duration || "",

            intake_capacity:
                programme.intake_capacity === null ||
                programme.intake_capacity === undefined
                    ? ""
                    : programme.intake_capacity,

            eligibility:
                programme.eligibility || "",

            description:
                programme.description || "",

            syllabus_url:
                programme.syllabus_url || "",

            syllabus_content:
                programme.syllabus_content || "",

            display_order:
                programme.display_order === null ||
                programme.display_order === undefined
                    ? 0
                    : programme.display_order,

            is_active:
                Number(programme.is_active) === 1
                    ? 1
                    : 0,
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    };

    /* =====================================================
       CLOSE FORM
    ===================================================== */

    const closeForm = () => {
        if (saving || uploading) {
            return;
        }

        setShowForm(false);
        setEditingId(null);

        setForm({
            ...EMPTY_FORM,
        });

        setError("");
    };

    /* =====================================================
       TOGGLE FORM PUBLICATION STATUS
    ===================================================== */

    const handleFormStatusToggle = () => {
        if (form.is_active === 1) {
            setForm({
                ...form,
                is_active: 0,
            });
        } else {
            setForm({
                ...form,
                is_active: 1,
            });
        }
    };

    /* =====================================================
       SAVE PROGRAMME
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !Number.isInteger(numericDepartmentId) ||
            numericDepartmentId <= 0
        ) {
            setError(
                "Department ID is missing. Save the department first."
            );
            return;
        }

        if (
            !form.programme_name ||
            !form.programme_name.trim()
        ) {
            setError(
                "Programme name is required."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                department_id:
                    numericDepartmentId,

                programme_level:
                    form.programme_level,

                programme_name:
                    form.programme_name.trim(),

                programme_code:
                    form.programme_code &&
                    form.programme_code.trim()
                        ? form.programme_code.trim()
                        : null,

                duration:
                    form.duration &&
                    form.duration.trim()
                        ? form.duration.trim()
                        : null,

                intake_capacity:
                    form.intake_capacity === ""
                        ? null
                        : Number(
                              form.intake_capacity
                          ),

                eligibility:
                    form.eligibility &&
                    form.eligibility.trim()
                        ? form.eligibility.trim()
                        : null,

                description:
                    form.description &&
                    form.description.trim()
                        ? form.description.trim()
                        : null,

                syllabus_url:
                    form.syllabus_url &&
                    form.syllabus_url.trim()
                        ? form.syllabus_url.trim()
                        : null,

                syllabus_content:
                    form.syllabus_content || "",

                display_order:
                    form.display_order === ""
                        ? 0
                        : Number(
                              form.display_order
                          ),

                is_active:
                    form.is_active === 1
                        ? 1
                        : 0,
            };

            let url = "";
            let method = "";

            if (editingId) {
                url =
                    `${API_BASE}/api/department-programmes/` +
                    editingId;

                method = "PUT";
            } else {
                url =
                    `${API_BASE}/api/department-programmes`;

                method = "POST";
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result =
                await response.json();

            if (
                !response.ok ||
                result?.success === false
            ) {
                throw new Error(
                    result?.message ||
                        "Unable to save programme."
                );
            }

            if (editingId) {
                setSuccess(
                    "Programme updated successfully."
                );
            } else {
                setSuccess(
                    "Programme added successfully."
                );
            }

            setShowForm(false);
            setEditingId(null);

            setForm({
                ...EMPTY_FORM,
            });

            await loadProgrammes();
        } catch (err) {
            console.error(
                "SAVE PROGRAMME ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to save programme."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       UPLOAD SYLLABUS
    ===================================================== */

    const handleSyllabusUpload = async (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            file.type !==
                "application/pdf" &&
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {
            setError(
                "Only PDF files are allowed."
            );

            event.target.value = "";
            return;
        }

        const maximumSize =
            20 * 1024 * 1024;

        if (file.size > maximumSize) {
            setError(
                "Syllabus PDF must be 20 MB or smaller."
            );

            event.target.value = "";
            return;
        }

        try {
            setUploading(true);
            setError("");

            const formData =
                new FormData();

            formData.append(
                "syllabus",
                file
            );

            const response = await fetch(
                `${API_BASE}/api/department-programmes/upload-syllabus`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                result?.success === false
            ) {
                throw new Error(
                    result?.message ||
                        "Unable to upload syllabus."
                );
            }

            const uploadedUrl =
                result?.url ||
                result?.fileUrl ||
                result?.syllabus_url;

            if (!uploadedUrl) {
                throw new Error(
                    "Upload completed but the server did not return a file URL."
                );
            }

            setForm({
                ...form,
                syllabus_url:
                    uploadedUrl,
            });

            setSuccess(
                "Syllabus PDF uploaded successfully."
            );
        } catch (err) {
            console.error(
                "SYLLABUS UPLOAD ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to upload syllabus PDF."
            );
        } finally {
            setUploading(false);
            event.target.value = "";
        }
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (
        id,
        programmeName
    ) => {
        const confirmed =
            window.confirm(
                `Delete "${programmeName}"?\n\nThis action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/department-programmes/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                result?.success === false
            ) {
                throw new Error(
                    result?.message ||
                        "Unable to delete programme."
                );
            }

            setSuccess(
                "Programme deleted successfully."
            );

            await loadProgrammes();
        } catch (err) {
            console.error(
                "DELETE PROGRAMME ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to delete programme."
            );
        } finally {
            setDeletingId(null);
        }
    };

    /* =====================================================
       TOGGLE PUBLISHED / HIDDEN
    ===================================================== */

    const handleToggle = async (
        programme
    ) => {
        try {
            setTogglingId(programme.id);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/department-programmes/${programme.id}/toggle`,
                {
                    method: "PATCH",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                result?.success === false
            ) {
                throw new Error(
                    result?.message ||
                        "Unable to update programme status."
                );
            }

            if (
                Number(
                    programme.is_active
                ) === 1
            ) {
                setSuccess(
                    "Programme hidden."
                );
            } else {
                setSuccess(
                    "Programme published."
                );
            }

            await loadProgrammes();
        } catch (err) {
            console.error(
                "TOGGLE PROGRAMME ERROR:",
                err
            );

            setError(
                err?.message ||
                    "Unable to update programme status."
            );
        } finally {
            setTogglingId(null);
        }
    };

    /* =====================================================
       INVALID DEPARTMENT
    ===================================================== */

    if (
        !Number.isInteger(
            numericDepartmentId
        ) ||
        numericDepartmentId <= 0
    ) {
        return (
            <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-red-100 p-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-red-900">
                            Academic Programmes unavailable
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-red-700">
                            Save the department first.
                            A valid department ID is
                            required before programmes
                            can be added.
                        </p>
                    </div>

                </div>
            </section>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <section className="mt-10 border-t border-slate-200 pt-10">

            {/* =================================================
               HEADER
            ================================================= */}

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <div className="mb-2 flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                            <BookOpen className="h-5 w-5 text-blue-700" />
                        </div>

                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                            Academic Structure
                        </span>

                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Academic Programmes
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage the academic programmes
                        offered by{" "}
                        <span className="font-semibold text-slate-700">
                            {departmentName}
                        </span>
                        .
                    </p>

                </div>

                <button
                    type="button"
                    onClick={openAddForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Programme
                </button>

            </div>

            {/* =================================================
               SUCCESS
            ================================================= */}

            {success && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">

                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                    <span className="flex-1">
                        {success}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>

                </div>
            )}

            {/* =================================================
               ERROR
            ================================================= */}

            {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">

                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <span className="flex-1">
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>

                </div>
            )}

            {/* =================================================
               SUMMARY
            ================================================= */}

            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">

                <SummaryCard
                    icon={Layers3}
                    label="Total Programmes"
                    value={summary.total}
                />

                <SummaryCard
                    icon={CheckCircle2}
                    label="Published"
                    value={summary.published}
                    subtle="Visible"
                />

                <SummaryCard
                    icon={EyeOff}
                    label="Draft / Hidden"
                    value={summary.hidden}
                    subtle="Not visible"
                />

                <SummaryCard
                    icon={GraduationCap}
                    label="UG / PG"
                    value={
                        `${summary.ug} / ${summary.pg}`
                    }
                    subtle="Programmes"
                />

            </div>

            {/* =================================================
               LOADING
            ================================================= */}

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10">

                    <div className="flex flex-col items-center justify-center text-center">

                        <RefreshCw className="h-7 w-7 animate-spin text-blue-700" />

                        <p className="mt-4 text-sm font-semibold text-slate-700">
                            Loading academic programmes...
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Please wait
                        </p>

                    </div>

                </div>
            ) : programmes.length === 0 ? (
                /* =================================================
                   EMPTY
                ================================================= */

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <GraduationCap className="h-8 w-8 text-slate-400" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-800">
                        No academic programmes added
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Add the programmes offered by
                        this department, such as
                        B.A., B.Com., B.Sc., M.A.
                        or other recognised programmes.
                    </p>

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#0f3262] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f3262] transition hover:bg-blue-50"
                    >
                        <Plus className="h-4 w-4" />
                        Add First Programme
                    </button>

                </div>
            ) : (
                /* =================================================
                   PROGRAMME GROUPS
                ================================================= */

                <div className="space-y-8">

                    {groupedProgrammes.map(
                        ([level, items]) => (
                            <div key={level}>

                                {/* Group heading */}

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#0f3262] px-2 text-xs font-bold text-white">
                                        {getLevelShort(
                                            level
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">
                                            {getLevelLabel(
                                                level
                                            )}
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            {items.length}{" "}
                                            {items.length ===
                                            1
                                                ? "programme"
                                                : "programmes"}
                                        </p>
                                    </div>

                                    <div className="ml-auto h-px flex-1 bg-slate-200" />

                                </div>

                                {/* Programme cards */}

                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                                    {items.map(
                                        (
                                            programme
                                        ) => (
                                            <ProgrammeCard
                                                key={
                                                    programme.id
                                                }
                                                programme={
                                                    programme
                                                }
                                                onEdit={
                                                    openEditForm
                                                }
                                                onDelete={
                                                    handleDelete
                                                }
                                                onToggle={
                                                    handleToggle
                                                }
                                                deletingId={
                                                    deletingId
                                                }
                                                togglingId={
                                                    togglingId
                                                }
                                            />
                                        )
                                    )}

                                </div>

                            </div>
                        )
                    )}

                </div>
            )}

            {/* =================================================
               ADD / EDIT MODAL
            ================================================= */}

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div
                        className="absolute inset-0"
                        onClick={closeForm}
                    />

                    <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal header */}

                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f3262]">

                                    {editingId ? (
                                        <Pencil className="h-5 w-5 text-white" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-white" />
                                    )}

                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {editingId
                                            ? "Edit Programme"
                                            : "Add Academic Programme"}
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        {departmentName}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={
                                    saving ||
                                    uploading
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        {/* Modal form */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="overflow-y-auto"
                        >

                            <div className="space-y-6 p-6">

                                {/* Programme information */}

                                <div>

                                    <div className="mb-4 flex items-center gap-2">

                                        <div className="h-5 w-1 rounded-full bg-blue-700" />

                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                                            Programme Information
                                        </h4>

                                    </div>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        <FormField
                                            label="Programme Level"
                                            required
                                        >
                                            <select
                                                name="programme_level"
                                                value={
                                                    form.programme_level
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="input"
                                            >
                                                {PROGRAMME_LEVELS.map(
                                                    (
                                                        level
                                                    ) => (
                                                        <option
                                                            key={
                                                                level.value
                                                            }
                                                            value={
                                                                level.value
                                                            }
                                                        >
                                                            {
                                                                level.label
                                                            }{" "}
                                                            (
                                                            {
                                                                level.short
                                                            }
                                                            )
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </FormField>

                                        <FormField
                                            label="Programme Name"
                                            required
                                        >
                                            <input
                                                type="text"
                                                name="programme_name"
                                                value={
                                                    form.programme_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="e.g. Bachelor of Arts"
                                                className="input"
                                                required
                                            />
                                        </FormField>

                                        <FormField label="Programme Code">
                                            <input
                                                type="text"
                                                name="programme_code"
                                                value={
                                                    form.programme_code
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="e.g. BA-ENG"
                                                className="input"
                                            />
                                        </FormField>

                                        <FormField label="Duration">
                                            <div className="relative">

                                                <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={
                                                        form.duration
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="e.g. 3 Years"
                                                    className="input pl-10"
                                                />

                                            </div>
                                        </FormField>

                                        <FormField label="Intake Capacity">
                                            <div className="relative">

                                                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <input
                                                    type="number"
                                                    min="0"
                                                    name="intake_capacity"
                                                    value={
                                                        form.intake_capacity
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="e.g. 120"
                                                    className="input pl-10"
                                                />

                                            </div>
                                        </FormField>

                                        <FormField label="Display Order">
                                            <input
                                                type="number"
                                                min="0"
                                                name="display_order"
                                                value={
                                                    form.display_order
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="input"
                                            />
                                        </FormField>

                                    </div>

                                </div>

                                {/* Eligibility */}

                                <FormField label="Eligibility">

                                    <textarea
                                        name="eligibility"
                                        value={
                                            form.eligibility
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                        placeholder="Enter eligibility requirements..."
                                        className="textarea"
                                    />

                                </FormField>

                                {/* Description */}

                                <FormField label="Programme Description">

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        placeholder="Brief description of the programme..."
                                        className="textarea"
                                    />

                                </FormField>

                                <div className="space-y-2 border border-slate-200 p-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-800">Syllabus content</h4>
                                        <p className="mt-1 text-xs text-slate-500">Paste a table from Word into the editor, then save the programme.</p>
                                    </div>
                                    <SyllabusContentEditor
                                        value={form.syllabus_content}
                                        onChange={(syllabus_content) => setForm((previous) => ({ ...previous, syllabus_content }))}
                                    />
                                </div>

                                {/* Syllabus PDF */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <div className="mb-4 flex items-start gap-3">

                                        <div className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-slate-200">
                                            <FileText className="h-5 w-5 text-blue-700" />
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">
                                                Syllabus Document
                                            </h4>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Upload the approved
                                                syllabus in PDF
                                                format. Maximum
                                                size: 20 MB.
                                            </p>
                                        </div>

                                    </div>

                                    {form.syllabus_url && (
                                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">

                                            <FileText className="h-5 w-5 shrink-0 text-emerald-600" />

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-medium text-emerald-800">
                                                    {getFileName(
                                                        form.syllabus_url
                                                    )}
                                                </p>

                                                <a
                                                    href={
                                                        form.syllabus_url.startsWith(
                                                            "http"
                                                        )
                                                            ? form.syllabus_url
                                                            : `${API_BASE}${form.syllabus_url}`
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs font-medium text-emerald-700 hover:underline"
                                                >
                                                    View current syllabus
                                                </a>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setForm(
                                                        {
                                                            ...form,
                                                            syllabus_url:
                                                                "",
                                                        }
                                                    )
                                                }
                                                className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>

                                        </div>
                                    )}

                                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">

                                        {uploading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Uploading PDF...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4" />

                                                {form.syllabus_url
                                                    ? "Replace Syllabus PDF"
                                                    : "Upload Syllabus PDF"}
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={
                                                handleSyllabusUpload
                                            }
                                            disabled={
                                                uploading ||
                                                saving
                                            }
                                            className="hidden"
                                        />

                                    </label>

                                </div>

                                {/* Publication status */}

                                <div className="rounded-xl border border-slate-200 p-5">

                                    <div className="flex items-center justify-between gap-4">

                                        <div>

                                            <h4 className="text-sm font-bold text-slate-800">
                                                Publication Status
                                            </h4>

                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Published programmes
                                                can be displayed
                                                on the public
                                                department page.
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                handleFormStatusToggle
                                            }
                                            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                                                form.is_active ===
                                                1
                                                    ? "bg-[#0f3262]"
                                                    : "bg-slate-300"
                                            }`}
                                        >

                                            <span
                                                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                                    form.is_active ===
                                                    1
                                                        ? "left-6"
                                                        : "left-1"
                                                }`}
                                            />

                                        </button>

                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-xs font-medium">

                                        {form.is_active ===
                                        1 ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                                                <span className="text-emerald-700">
                                                    Published
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-4 w-4 text-slate-500" />

                                                <span className="text-slate-500">
                                                    Hidden / Draft
                                                </span>
                                            </>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* Modal footer */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving ||
                                        uploading
                                    }
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploading
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850] disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />

                                            {editingId
                                                ? "Update Programme"
                                                : "Save Programme"}
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* =================================================
               LOCAL INPUT STYLES
            ================================================= */}

            <style>{`
                .input {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid rgb(203 213 225);
                    background: white;
                    padding: 0.7rem 0.85rem;
                    font-size: 0.875rem;
                    color: rgb(15 23 42);
                    outline: none;
                    transition:
                        border-color 150ms,
                        box-shadow 150ms;
                }

                .input::placeholder,
                .textarea::placeholder {
                    color: rgb(148 163 184);
                }

                .input:focus,
                .textarea:focus {
                    border-color: rgb(59 130 246);
                    box-shadow:
                        0 0 0 3px
                        rgb(59 130 246 / 0.10);
                }

                .textarea {
                    width: 100%;
                    resize: vertical;
                    border-radius: 0.75rem;
                    border: 1px solid rgb(203 213 225);
                    background: white;
                    padding: 0.75rem 0.85rem;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    color: rgb(15 23 42);
                    outline: none;
                    transition:
                        border-color 150ms,
                        box-shadow 150ms;
                }
            `}</style>

        </section>
    );
};

/* =============================================================
   SUMMARY CARD
============================================================= */

const SummaryCard = ({
    icon: Icon,
    label,
    value,
    subtle,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                    <Icon className="h-4 w-4 text-[#0f3262]" />
                </div>

                {subtle && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {subtle}
                    </span>
                )}

            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                {value}
            </p>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
                {label}
            </p>

        </div>
    );
};

/* =============================================================
   FORM FIELD
============================================================= */

const FormField = ({
    label,
    required = false,
    children,
}) => {
    return (
        <div>

            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    );
};

/* =============================================================
   PROGRAMME CARD
============================================================= */

const ProgrammeCard = ({
    programme,
    onEdit,
    onDelete,
    onToggle,
    deletingId,
    togglingId,
}) => {
    const isActive =
        Number(programme.is_active) === 1;

    const isDeleting =
        deletingId === programme.id;

    const isToggling =
        togglingId === programme.id;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">

            {/* Top institutional line */}

            <div className="h-1 bg-[#0f3262]" />

            <div className="p-5">

                {/* Programme heading */}

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                        <GraduationCap className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                            <h4 className="text-base font-bold leading-6 text-slate-900">
                                {programme.programme_name ||
                                    "Unnamed Programme"}
                            </h4>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {isActive
                                    ? "Published"
                                    : "Hidden"}
                            </span>

                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                            <span className="font-semibold text-blue-700">
                                {getLevelShort(
                                    programme.programme_level
                                )}
                            </span>

                            {programme.programme_code && (
                                <>
                                    <span className="text-slate-300">
                                        •
                                    </span>

                                    <span>
                                        Code:{" "}
                                        <span className="font-medium text-slate-700">
                                            {
                                                programme.programme_code
                                            }
                                        </span>
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                </div>

                {/* Programme details */}

                {(programme.duration ||
                    programme.intake_capacity !==
                        null &&
                    programme.intake_capacity !==
                        undefined &&
                    programme.intake_capacity !==
                        "") && (
                    <div className="mt-5 grid grid-cols-2 gap-2">

                        {programme.duration && (
                            <InfoItem
                                icon={Clock3}
                                label="Duration"
                                value={
                                    programme.duration
                                }
                            />
                        )}

                        {programme.intake_capacity !==
                            null &&
                            programme.intake_capacity !==
                                undefined &&
                            programme.intake_capacity !==
                                "" && (
                                <InfoItem
                                    icon={Users}
                                    label="Intake"
                                    value={
                                        programme.intake_capacity
                                    }
                                />
                            )}

                    </div>
                )}

                {/* Eligibility */}

                {programme.eligibility && (
                    <div className="mt-4 border-t border-slate-100 pt-4">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Eligibility
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                            {
                                programme.eligibility
                            }
                        </p>

                    </div>
                )}

                {/* Description */}

                {programme.description && (
                    <div className="mt-4">

                        <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                            {
                                programme.description
                            }
                        </p>

                    </div>
                )}

                {/* Syllabus */}

                {programme.syllabus_url && (
                    <div className="mt-4">

                        <a
                            href={
                                programme.syllabus_url.startsWith(
                                    "http"
                                )
                                    ? programme.syllabus_url
                                    : `${API_BASE}${programme.syllabus_url}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                            <FileText className="h-4 w-4" />
                            View Syllabus PDF
                        </a>

                    </div>
                )}

                {/* Actions */}

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        Order:{" "}
                        {programme.display_order ??
                            0}
                    </div>

                    <div className="flex items-center gap-1">

                        {/* Publish / Hide */}

                        <button
                            type="button"
                            onClick={() =>
                                onToggle(
                                    programme
                                )
                            }
                            disabled={
                                isToggling ||
                                isDeleting
                            }
                            title={
                                isActive
                                    ? "Hide programme"
                                    : "Publish programme"
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0f3262] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isToggling ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : isActive ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>

                        {/* Edit */}

                        <button
                            type="button"
                            onClick={() =>
                                onEdit(
                                    programme
                                )
                            }
                            disabled={
                                isDeleting ||
                                isToggling
                            }
                            title="Edit programme"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete */}

                        <button
                            type="button"
                            onClick={() =>
                                onDelete(
                                    programme.id,
                                    programme.programme_name
                                )
                            }
                            disabled={
                                isDeleting ||
                                isToggling
                            }
                            title="Delete programme"
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </button>

                    </div>

                </div>

            </div>

        </article>
    );
};

/* =============================================================
   INFO ITEM
============================================================= */

const InfoItem = ({
    icon: Icon,
    label,
    value,
}) => {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">

            <div className="flex items-center gap-2">

                <Icon className="h-3.5 w-3.5 text-slate-400" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                </span>

            </div>

            <p className="mt-1 text-xs font-semibold text-slate-700">
                {value}
            </p>

        </div>
    );
};

export default DepartmentProgrammes;

