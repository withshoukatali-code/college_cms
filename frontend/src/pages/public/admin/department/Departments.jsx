import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopBar from "../../../../features/public/header/TopBar";
import Navbar from "../../../../features/public/navbar/Navbar";
import PublicFooter from "../../../../features/public/Footer/PublicFooter";
import {
    BookOpen,
    GraduationCap,
    Landmark,
    FlaskConical,
    RefreshCw,
    ArrowRight,
    Building2,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";

const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const loadDepartments = async () => {
    const response = await fetch(`${API_BASE}/api/departments`);
    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load departments");
    }

    return result.departments || [];
};

const Departments = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin/");

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await loadDepartments();

            const loadedDepartments = isAdmin
                ? result
                : result.filter(
                      (department) =>
                          Number(department.is_active) === 1
                  );

            setDepartments(loadedDepartments);
        } catch (err) {
            console.error(
                "PUBLIC DEPARTMENTS ERROR:",
                err
            );

            setError(
                err.message ||
                    "Unable to load departments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let current = true;
        loadDepartments()
            .then((result) => {
                if (!current) return;
                setDepartments(isAdmin
                    ? result
                    : result.filter((department) => Number(department.is_active) === 1));
                setError("");
            })
            .catch((err) => {
                if (current) setError(err.message || "Unable to load departments");
            })
            .finally(() => {
                if (current) setLoading(false);
            });
        return () => {
            current = false;
        };
    }, [isAdmin]);

    const deleteDepartment = async (department) => {
        if (
            !window.confirm(
                `Delete "${department.name}"? This cannot be undone.`
            )
        ) {
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE}/api/departments/${department.id}`,
                { method: "DELETE" }
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to delete department"
                );
            }

            setDepartments((previous) =>
                previous.filter((item) => item.id !== department.id)
            );
        } catch (err) {
            setError(err.message || "Unable to delete department");
        }
    };

    /*
     * -------------------------------------------------------
     * GROUP DEPARTMENTS
     * -------------------------------------------------------
     *
     * Current database has a "programme" field.
     *
     * We keep this flexible so values such as:
     *
     * UG - Arts
     * UG - Commerce
     * UG - Science
     * PG - Arts
     * PG - Commerce
     * PG - Science
     *
     * can be grouped automatically.
     *
     * If programme currently contains only "UG" or "PG",
     * the department is placed under that level and its
     * faculty is detected from the department information.
     */

    const getProgrammeInfo = (department) => {
        const programmeLevels = String(
            department.programme_levels || ""
        ).toLowerCase();
        const value = String(
            department.programme || ""
        )
            .trim()
            .toLowerCase();

        let level = "Undergraduate";
        let stream = "Other";

        if (programmeLevels.includes("pg")) {
            level = "Postgraduate";
        } else if (
            value.includes("pg") ||
            value.includes("post graduate") ||
            value.includes("postgraduate") ||
            value.includes("p.g")
        ) {
            level = "Postgraduate";
        } else if (
            value.includes("ug") ||
            value.includes("under graduate") ||
            value.includes("undergraduate") ||
            value.includes("u.g")
        ) {
            level = "Undergraduate";
        }

        if (value.includes("arts")) {
            stream = "Arts";
        } else if (value.includes("commerce")) {
            stream = "Commerce";
        } else if (value.includes("science")) {
            stream = "Science";
        }

        return {
            level,
            stream,
        };
    };

    const groupedDepartments = useMemo(() => {
        const structure = {
            Undergraduate: {
                Arts: [],
                Commerce: [],
                Science: [],
                Other: [],
            },
            Postgraduate: {
                Arts: [],
                Commerce: [],
                Science: [],
                Other: [],
            },
        };

        departments.forEach((department) => {
            const { level, stream } =
                getProgrammeInfo(department);

            if (!structure[level]) {
                structure[level] = {
                    Arts: [],
                    Commerce: [],
                    Science: [],
                    Other: [],
                };
            }

            if (!structure[level][stream]) {
                structure[level][stream] = [];
            }

            structure[level][stream].push(
                department
            );
        });

        return structure;
    }, [departments]);

    const streamConfig = [
        {
            key: "Arts",
            title: "Arts",
            description:
                "Humanities, languages, social sciences and related academic disciplines.",
            icon: BookOpen,
        },
        {
            key: "Commerce",
            title: "Commerce",
            description:
                "Commerce, business, management, accounting and related disciplines.",
            icon: Landmark,
        },
        {
            key: "Science",
            title: "Science",
            description:
                "Physical, chemical, mathematical and related scientific disciplines.",
            icon: FlaskConical,
        },
        {
            key: "Other",
            title: "Other Departments",
            description:
                "Departments and programmes with a custom academic classification.",
            icon: BookOpen,
        },
    ];

    const renderStream = (
        level,
        streamConfigItem
    ) => {
        const Icon = streamConfigItem.icon;

        const items =
            groupedDepartments[level]?.[
                streamConfigItem.key
            ] || [];

        if (items.length === 0) {
            return null;
        }

        return (
            <div
                key={streamConfigItem.key}
                className={`overflow-hidden border border-slate-200 bg-white ${isAdmin ? "" : "border-y"}`}
            >
                {/* Stream heading */}
                <div className={`border-b border-slate-100 bg-white ${isAdmin ? "px-4 py-3" : "px-5 py-6 md:px-6"}`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex shrink-0 items-center justify-center bg-[#0f3262] text-white ${isAdmin ? "h-8 w-8 rounded" : "h-11 w-11 rounded-full"}`}>
                            <Icon size={isAdmin ? 16 : 21} />
                        </div>

                        <div>
                            <h3 className={`${isAdmin ? "text-sm" : "text-lg"} font-bold text-slate-800`}>
                                {streamConfigItem.title}
                            </h3>

                            <p className={`mt-1 max-w-2xl text-slate-500 ${isAdmin ? "text-xs leading-5" : "text-sm leading-6"}`}>
                                {
                                    streamConfigItem.description
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Departments */}
                <div className="divide-y divide-slate-100">
                    {items.map((department) => (
                        <div
                            key={department.id}
                            className={`group flex items-center justify-between gap-3 transition hover:bg-blue-50/50 ${isAdmin ? "px-4 py-3" : "gap-4 px-5 py-4 md:px-6"}`}
                        >
                            <Link
                                to={
                                    isAdmin
                                        ? `/admin/departments/${department.id}`
                                        : `/departments/${department.slug}`
                                }
                                className={`flex min-w-0 flex-1 items-center ${isAdmin ? "gap-3" : "gap-4"}`}
                            >
                                {/* Department image */}
                                <div className={`shrink-0 overflow-hidden border border-slate-200 bg-slate-100 ${isAdmin ? "h-9 w-9 rounded" : "h-12 w-12 rounded-lg"}`}>
                                    {department.department_image ? (
                                        <img
                                            src={
                                                department.department_image
                                            }
                                            alt={
                                                department.name
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <Building2
                                                size={20}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                            <h4 className={`truncate font-semibold text-slate-800 transition group-hover:text-[#0f3262] ${isAdmin ? "text-sm" : "text-base"}`}>
                                        {
                                            department.name
                                        }
                                    </h4>

                                    {department.short_name && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                department.short_name
                                            }
                                        </p>
                                    )}

                                    {department.tagline && (
                                            <p className={`mt-1 line-clamp-1 text-slate-500 ${isAdmin ? "text-xs" : "text-sm"}`}>
                                            {
                                                department.tagline
                                            }
                                        </p>
                                    )}
                                </div>
                            </Link>

                            {isAdmin ? (
                                <div className="flex shrink-0 items-center gap-2">
                                    <Link
                                        to={`/admin/departments/${department.id}`}
                                        className={`inline-flex items-center gap-1.5 rounded border border-slate-200 font-semibold text-[#0f3262] hover:border-blue-200 hover:bg-blue-50 ${isAdmin ? "px-2.5 py-1.5 text-xs" : "rounded-lg px-3 py-2 text-sm"}`}
                                    >
                                        <Pencil size={15} />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => deleteDepartment(department)}
                                        className={`inline-flex items-center gap-1.5 border border-red-200 font-semibold text-red-600 hover:bg-red-50 ${isAdmin ? "rounded px-2.5 py-1.5 text-xs" : "rounded-lg px-3 py-2 text-sm"}`}
                                    >
                                        <Trash2 size={15} />
                                        <span className="hidden sm:inline">Delete</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0f3262]">
                                    <span className="hidden sm:inline">
                                        View Department
                                    </span>

                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderLevel = (
        level,
        title,
        description
    ) => {
        const levelDepartments =
            groupedDepartments[level];

        const hasDepartments =
            Object.values(
                levelDepartments || {}
            ).some(
                (items) => items.length > 0
            );

        return (
            <section className={isAdmin ? "mb-7" : "mb-14"}>
                {/* Level heading */}
                <div className={isAdmin ? "mb-3" : "mb-7"}>
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-[#0f3262]" />

                        {/* <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f3262]">
                            Academic Departments
                        </span> */}
                    </div>

                    <h2 className={`mt-2 font-bold text-slate-800 ${isAdmin ? "text-base" : "text-2xl md:text-3xl"}`}>
                        {title}
                    </h2>

                    <p className={`mt-1 max-w-3xl text-slate-500 ${isAdmin ? "text-xs leading-5" : "text-sm leading-6 md:text-base"}`}>
                        {description}
                    </p>
                </div>

                {hasDepartments ? (
                    <div className={`grid ${isAdmin ? "gap-3 lg:grid-cols-2" : "gap-6 lg:grid-cols-2"}`}>
                        {streamConfig.map(
                            (stream) =>
                                renderStream(
                                    level,
                                    stream
                                )
                        )}
                    </div>
                ) : (
                    <div className={`border border-dashed border-slate-300 bg-white text-center ${isAdmin ? "rounded px-4 py-8" : "rounded-2xl px-6 py-12"}`}>
                        <GraduationCap
                            size={36}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <p className="text-sm text-slate-500">
                            Academic departments will
                            be listed here.
                        </p>
                    </div>
                )}
            </section>
        );
    };

    return (
        <div className={isAdmin ? "min-h-full bg-slate-50" : "min-h-screen bg-white"}>
            {!isAdmin && <TopBar />}
            {!isAdmin && <Navbar />}
        <main>
            {/* =====================================================
                PAGE HEADER
            ====================================================== */}
            <section className={`border-b border-slate-200 ${isAdmin ? "bg-white" : "bg-[#f7f8f6]"}`}>
                <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 ${isAdmin ? "py-5" : "items-end gap-6 px-5 py-14 md:px-8 md:py-20"}`}>
                    <div className="max-w-3xl">
                        <div className={`flex items-center gap-3 ${isAdmin ? "mb-1" : "mb-4"}`}>
                            <div className="h-px w-10 bg-[#0f3262]" />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f3262]">
                                {isAdmin ? "Department Management" : "Academic community"}
                            </span>
                        </div>

                        <h1 className={`font-semibold text-[#102f58] ${isAdmin ? "text-xl" : "text-4xl md:text-6xl"}`}>
                            {isAdmin ? "Departments" : "Faculties & departments"}
                        </h1>

                        <p className={`max-w-2xl text-slate-600 ${isAdmin ? "mt-1 text-xs leading-5" : "mt-5 text-sm leading-7 md:text-base"}`}>
                            {isAdmin ? "Create, edit, and organize department information and programmes." : "Discover the people, programmes and disciplines that shape the academic life of Tuljabhavani College."}
                        </p>
                    </div>

                    {isAdmin && (
                        <Link
                            to="/admin/departments/new"
                            className="inline-flex shrink-0 items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0f3262] transition hover:bg-blue-50"
                        >
                            <Plus size={17} />
                            <span className="hidden sm:inline">Add Department</span>
                        </Link>
                    )}
                </div>
            </section>

            {!isAdmin && departments.length > 0 && (
                <nav aria-label="Department groups" className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-5 py-4 text-sm font-semibold text-[#0f3262] md:px-8">
                        {Object.entries(groupedDepartments).map(([level, streams]) =>
                            Object.entries(streams).some(([, items]) => items.length > 0) ? (
                                <a key={level} href={`#${level.toLowerCase()}`} className="whitespace-nowrap hover:text-amber-600">
                                    {level}
                                </a>
                            ) : null
                        )}
                    </div>
                </nav>
            )}

            {/* =====================================================
                BREADCRUMB
            ====================================================== */}
            {!isAdmin && <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-3 md:px-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            to="/"
                            className="transition hover:text-[#0f3262]"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="font-medium text-slate-700">
                            Departments
                        </span>
                    </div>
                </div>
            </div>}

            {/* =====================================================
                CONTENT
            ====================================================== */}
            <div className={`mx-auto max-w-7xl ${isAdmin ? "py-6" : "px-5 py-12 md:px-8 md:py-16"}`}>
                {/* Loading */}
                {loading && (
                    <div className={`border border-slate-200 bg-white text-center ${isAdmin ? "rounded px-4 py-8" : "rounded-2xl px-6 py-16 shadow-sm"}`}>
                        <RefreshCw
                            size={30}
                            className="mx-auto mb-4 animate-spin text-[#0f3262]"
                        />

                        <p className="text-sm text-slate-500">
                            Loading academic departments...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className={`border border-red-200 bg-red-50 text-center ${isAdmin ? "rounded px-4 py-6" : "rounded-2xl px-6 py-10"}`}>
                        <h2 className="font-semibold text-red-800">
                            Unable to load departments
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchDepartments}
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0f3262] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0b2850]"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    departments.length === 0 && (
                        <div className={`border border-dashed border-slate-300 bg-white text-center ${isAdmin ? "rounded px-4 py-8" : "rounded-2xl px-6 py-16"}`}>
                            <GraduationCap
                                size={42}
                                className="mx-auto mb-4 text-slate-300"
                            />

                            <h2 className={`${isAdmin ? "text-sm" : "text-lg"} font-semibold text-slate-700`}>
                                No departments available
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Academic departments will
                                appear here once published.
                            </p>
                        </div>
                    )}

                {/* Departments */}
                {!loading &&
                    !error &&
                    departments.length > 0 && (
                        <>
                            <div id="undergraduate">{renderLevel(
                                "Undergraduate",
                                "Undergraduate",
                                "Explore undergraduate departments and academic programmes offered across Arts, Commerce and Science."
                            )}</div>

                            <div id="postgraduate">{renderLevel(
                                "Postgraduate",
                                "Postgraduate",
                                "Explore postgraduate departments and advanced academic programmes offered by the college."
                            )}</div>
                        </>
                    )}
            </div>
        </main>
        {!isAdmin && <PublicFooter />}
        </div>
    );
};

export default Departments;