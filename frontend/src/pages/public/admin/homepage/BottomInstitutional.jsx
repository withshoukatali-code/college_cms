import React, { useEffect, useState } from "react";

const API_BASE =
    "http://localhost:5000/api/bottom-institutional-strip";

const emptyForm = {
    field_name: "",
    field_value: "",
    display_order: 1,
    is_active: 1,
};

function BottomInstitutional() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    // ============================================================
    // LOAD ALL ITEMS
    // ============================================================

    const loadItems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE}/all`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                const sorted = [...result.data].sort(
                    (a, b) =>
                        Number(a.display_order) -
                            Number(b.display_order) ||
                        Number(a.id) - Number(b.id)
                );

                setItems(sorted);
            } else {
                setItems([]);
            }
        } catch (err) {
            console.error("Load Bottom Strip Error:", err);
            setError("Unable to load institutional strip data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    // ============================================================
    // FORM HANDLERS
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const openAddForm = () => {
        setEditingId(null);

        setForm({
            ...emptyForm,
            display_order: items.length + 1,
        });

        setShowForm(true);
        setError("");
    };

    const openEditForm = (item) => {
        setEditingId(item.id);

        setForm({
            field_name: item.field_name || "",
            field_value: item.field_value || "",
            display_order: item.display_order || 1,
            is_active: Number(item.is_active) === 1 ? 1 : 0,
        });

        setShowForm(true);
        setError("");
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    // ============================================================
    // SAVE
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.field_name.trim()) {
            setError("Field name is required.");
            return;
        }

        if (!form.field_value.trim()) {
            setError("Field value is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                field_name: form.field_name.trim(),
                field_value: form.field_value.trim(),
                display_order: Number(form.display_order) || 0,
                is_active: Number(form.is_active),
            };

            const url = editingId
                ? `${API_BASE}/${editingId}`
                : API_BASE;

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
                    result.message || "Unable to save item."
                );
            }

            await loadItems();

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
        } catch (err) {
            console.error("Save Bottom Strip Error:", err);
            setError(err.message || "Unable to save item.");
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this institutional strip item?"
        );

        if (!confirmed) return;

        try {
            setError("");

            const response = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to delete item."
                );
            }

            await loadItems();
        } catch (err) {
            console.error("Delete Bottom Strip Error:", err);
            setError(err.message || "Unable to delete item.");
        }
    };

    // ============================================================
    // TOGGLE STATUS
    // ============================================================

    const toggleStatus = async (item) => {
        try {
            setError("");

            const response = await fetch(
                `${API_BASE}/${item.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        field_name: item.field_name,
                        field_value: item.field_value,
                        display_order: Number(
                            item.display_order
                        ),
                        is_active:
                            Number(item.is_active) === 1
                                ? 0
                                : 1,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Unable to update status."
                );
            }

            await loadItems();
        } catch (err) {
            console.error("Toggle Status Error:", err);
            setError(
                err.message ||
                    "Unable to update item status."
            );
        }
    };

    // ============================================================
    // MOVE ITEM UP
    // ============================================================

    const moveUp = async (index) => {
        if (index === 0) return;

        const current = items[index];
        const previous = items[index - 1];

        try {
            setError("");

            await Promise.all([
                fetch(
                    `${API_BASE}/reorder/${current.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            display_order:
                                previous.display_order,
                        }),
                    }
                ),

                fetch(
                    `${API_BASE}/reorder/${previous.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            display_order:
                                current.display_order,
                        }),
                    }
                ),
            ]);

            await loadItems();
        } catch (err) {
            console.error("Move Up Error:", err);
            setError("Unable to change item order.");
        }
    };

    // ============================================================
    // MOVE ITEM DOWN
    // ============================================================

    const moveDown = async (index) => {
        if (index === items.length - 1) return;

        const current = items[index];
        const next = items[index + 1];

        try {
            setError("");

            await Promise.all([
                fetch(
                    `${API_BASE}/reorder/${current.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            display_order:
                                next.display_order,
                        }),
                    }
                ),

                fetch(
                    `${API_BASE}/reorder/${next.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            display_order:
                                current.display_order,
                        }),
                    }
                ),
            ]);

            await loadItems();
        } catch (err) {
            console.error("Move Down Error:", err);
            setError("Unable to change item order.");
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="min-h-[400px] bg-slate-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F3262]" />

                        <p className="text-sm font-medium text-slate-600">
                            Loading institutional strip...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">

            <div className="mx-auto max-w-7xl">

                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#EEAD09]" />

                            <span className="text-xs font-semibold uppercase tracking-wider text-[#31557D]">
                                Homepage CMS
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-[#0F3262]">
                            Bottom Institutional Strip
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage the institutional information
                            displayed below the college header.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850]"
                    >
                        <span className="text-lg leading-none">
                            +
                        </span>

                        Add Institutional Item
                    </button>
                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* ==================================================
                    INFORMATION / STATS
                ================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Total Items
                        </p>

                        <p className="mt-2 text-2xl font-bold text-[#0F3262]">
                            {items.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Active Items
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {
                                items.filter(
                                    (item) =>
                                        Number(
                                            item.is_active
                                        ) === 1
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Public Display
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#31557D]">
                            Database Driven
                        </p>
                    </div>

                </div>

                {/* ==================================================
                    PREVIEW
                ================================================== */}

                <div className="mb-6 overflow-hidden rounded-xl border border-[#B8C9DC] shadow-sm">

                    <div className="flex items-center justify-between bg-[#0F3262] px-5 py-3">

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Public Strip Preview
                            </h2>

                            <p className="text-xs text-blue-100">
                                Active items are shown on the
                                homepage.
                            </p>
                        </div>

                    </div>

                    <div className="min-h-[52px] overflow-x-auto bg-[#DCE6F2]">

                        <div className="flex min-w-max items-center justify-center px-4">

                            {items
                                .filter(
                                    (item) =>
                                        Number(
                                            item.is_active
                                        ) === 1
                                )
                                .map((item, index, activeItems) => (
                                    <React.Fragment
                                        key={item.id}
                                    >
                                        <div className="flex items-center whitespace-nowrap px-5 py-3">

                                            <span className="text-[11px] font-semibold text-[#24496F]">
                                                {item.field_name}
                                            </span>

                                            <span className="ml-2 text-[11px] font-bold text-[#0F3262]">
                                                {item.field_value}
                                            </span>

                                        </div>

                                        {index <
                                            activeItems.length -
                                                1 && (
                                            <div className="h-5 w-px shrink-0 bg-[#A8BCD2]" />
                                        )}
                                    </React.Fragment>
                                ))}

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    DATA TABLE
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h2 className="text-base font-bold text-[#0F3262]">
                                Institutional Items
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Manage the content, order and
                                visibility of each item.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadItems}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Refresh
                        </button>

                    </div>

                    {items.length === 0 ? (
                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
                                —
                            </div>

                            <h3 className="text-base font-semibold text-slate-700">
                                No institutional items found
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Add your first institutional
                                information item.
                            </p>

                            <button
                                type="button"
                                onClick={openAddForm}
                                className="mt-5 rounded-lg bg-[#0F3262] px-5 py-2.5 text-sm font-semibold text-white"
                            >
                                Add Item
                            </button>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="w-20 px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            Order
                                        </th>

                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            Field Name
                                        </th>

                                        <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            Field Value
                                        </th>

                                        <th className="w-32 px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="w-44 px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {items.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                                        >

                                            {/* ORDER */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-2">

                                                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E8EEF6] text-xs font-bold text-[#0F3262]">
                                                        {index + 1}
                                                    </span>

                                                    <div className="flex flex-col">

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index ===
                                                                0
                                                            }
                                                            onClick={() =>
                                                                moveUp(
                                                                    index
                                                                )
                                                            }
                                                            className="text-[10px] font-bold text-slate-500 hover:text-[#0F3262] disabled:cursor-not-allowed disabled:opacity-20"
                                                        >
                                                            ▲
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                index ===
                                                                items.length -
                                                                    1
                                                            }
                                                            onClick={() =>
                                                                moveDown(
                                                                    index
                                                                )
                                                            }
                                                            className="text-[10px] font-bold text-slate-500 hover:text-[#0F3262] disabled:cursor-not-allowed disabled:opacity-20"
                                                        >
                                                            ▼
                                                        </button>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* NAME */}

                                            <td className="px-5 py-4">

                                                <p className="text-sm font-semibold text-[#24496F]">
                                                    {item.field_name}
                                                </p>

                                            </td>

                                            {/* VALUE */}

                                            <td className="px-5 py-4">

                                                <p className="text-sm font-bold text-[#0F3262]">
                                                    {item.field_value}
                                                </p>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-5 py-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleStatus(
                                                            item
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        Number(
                                                            item.is_active
                                                        ) === 1
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >

                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            Number(
                                                                item.is_active
                                                            ) === 1
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        }`}
                                                    />

                                                    {Number(
                                                        item.is_active
                                                    ) === 1
                                                        ? "Active"
                                                        : "Hidden"}

                                                </button>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditForm(
                                                                item
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-[#0F3262] transition hover:bg-[#E8EEF6]"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                    >
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

            {/* ======================================================
                ADD / EDIT MODAL
            ======================================================= */}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

                    <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0F3262] px-6 py-4">

                            <div>
                                <h2 className="text-base font-bold text-white">
                                    {editingId
                                        ? "Edit Institutional Item"
                                        : "Add Institutional Item"}
                                </h2>

                                <p className="mt-0.5 text-xs text-blue-100">
                                    Enter the information that
                                    should appear in the public
                                    institutional strip.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="text-xl text-white/80 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            {/* FIELD NAME */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Field Name
                                </label>

                                <input
                                    type="text"
                                    name="field_name"
                                    value={form.field_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Established"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F3262] focus:ring-2 focus:ring-[#0F3262]/10"
                                    required
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Example: Established, AISHE
                                    Code, UGC Recognized
                                </p>

                            </div>

                            {/* FIELD VALUE */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Field Value
                                </label>

                                <input
                                    type="text"
                                    name="field_value"
                                    value={form.field_value}
                                    onChange={handleChange}
                                    placeholder="e.g. 1965"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F3262] focus:ring-2 focus:ring-[#0F3262]/10"
                                    required
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    This value will be displayed
                                    beside the field name.
                                </p>

                            </div>

                            {/* ORDER + STATUS */}

                            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Display Order
                                    </label>

                                    <input
                                        type="number"
                                        name="display_order"
                                        value={
                                            form.display_order
                                        }
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F3262] focus:ring-2 focus:ring-[#0F3262]/10"
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
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F3262] focus:ring-2 focus:ring-[#0F3262]/10"
                                    >
                                        <option value={1}>
                                            Active
                                        </option>

                                        <option value={0}>
                                            Hidden
                                        </option>
                                    </select>

                                </div>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[#0F3262] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b2850] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                        ? "Update Item"
                                        : "Add Item"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default BottomInstitutional;