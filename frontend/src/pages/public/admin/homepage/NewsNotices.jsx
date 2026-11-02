// import { useEffect, useState } from "react";
// import {
//   Bell,
//   Newspaper,
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   Eye,
//   EyeOff,
//   CalendarDays,
//   ExternalLink,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000";
// const API_URL = `${API_BASE}/api/news-notices`;

// const emptyForm = {
//   title: "",
//   category: "Notice",
//   description: "",
//   publish_date: "",
//   link: "",
//   display_order: 0,
//   is_active: 1,
// };

// function NewsNotices() {
//   const [items, setItems] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [showForm, setShowForm] = useState(false);

//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState(emptyForm);

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =====================================================
//   // FETCH ALL
//   // =====================================================

//   const fetchItems = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_URL}/all?_=${Date.now()}`,
//         {
//           cache: "no-store",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Request failed: ${response.status}`
//         );
//       }

//       const result = await response.json();

//       if (
//         result.success &&
//         Array.isArray(result.data)
//       ) {
//         setItems(result.data);
//       } else {
//         setItems([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load News & Notices.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // =====================================================
//   // FORM CHANGE
//   // =====================================================

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   };

//   // =====================================================
//   // OPEN ADD
//   // =====================================================

//   const handleAdd = () => {
//     setEditingId(null);
//     setForm({
//       ...emptyForm,
//       publish_date: new Date()
//         .toISOString()
//         .split("T")[0],
//     });

//     setMessage("");
//     setError("");
//     setShowForm(true);
//   };

//   // =====================================================
//   // OPEN EDIT
//   // =====================================================

//   const handleEdit = (item) => {
//     setEditingId(item.id);

//     setForm({
//       title: item.title || "",
//       category: item.category || "Notice",
//       description: item.description || "",
//       publish_date: item.publish_date
//         ? new Date(item.publish_date)
//             .toISOString()
//             .split("T")[0]
//         : "",
//       link: item.link || "",
//       display_order: item.display_order ?? 0,
//       is_active: item.is_active ? 1 : 0,
//     });

//     setMessage("");
//     setError("");
//     setShowForm(true);
//   };

//   // =====================================================
//   // CLOSE FORM
//   // =====================================================

//   const handleClose = () => {
//     if (saving) return;

//     setShowForm(false);
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   // =====================================================
//   // SAVE
//   // =====================================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setSaving(true);
//     setMessage("");
//     setError("");

//     try {
//       const method = editingId ? "PUT" : "POST";

//       const url = editingId
//         ? `${API_URL}/${editingId}`
//         : API_URL;

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           ...form,
//           display_order: Number(
//             form.display_order || 0
//           ),
//           is_active:
//             Number(form.is_active) === 1 ? 1 : 0,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to save News/Notice."
//         );
//       }

//       setMessage(
//         editingId
//           ? "News/Notice updated successfully."
//           : "News/Notice created successfully."
//       );

//       setShowForm(false);
//       setEditingId(null);
//       setForm(emptyForm);

//       await fetchItems();
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================================
//   // DELETE
//   // =====================================================

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to permanently delete this News/Notice?"
//     );

//     if (!confirmed) return;

//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(
//         `${API_URL}/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to delete News/Notice."
//         );
//       }

//       setMessage(
//         "News/Notice deleted successfully."
//       );

//       await fetchItems();
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     }
//   };

//   // =====================================================
//   // TOGGLE ACTIVE
//   // =====================================================

//   const handleToggle = async (item) => {
//     try {
//       const response = await fetch(
//         `${API_URL}/${item.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: item.title,
//             category: item.category,
//             description: item.description,
//             publish_date: item.publish_date
//               ? new Date(item.publish_date)
//                   .toISOString()
//                   .split("T")[0]
//               : null,
//             link: item.link,
//             display_order:
//               item.display_order ?? 0,
//             is_active: item.is_active ? 0 : 1,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to change status."
//         );
//       }

//       await fetchItems();
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     }
//   };

//   // =====================================================
//   // DATE
//   // =====================================================

//   const formatDate = (value) => {
//     if (!value) return "—";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//       return "—";
//     }

//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <div>
//         <div className="mb-8">
//           <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
//           <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-200" />
//         </div>

//         <div className="h-80 animate-pulse rounded-2xl bg-white" />
//       </div>
//     );
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="mx-auto max-w-7xl px-6">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

//         <div>
//           <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//             Homepage
//           </p>

//           <h1 className="mt-1 text-3xl font-bold text-slate-900">
//             News & Notices
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Manage announcements and important college
//             notices displayed on the homepage.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleAdd}
//           className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#071f3d]"
//         >
//           <Plus size={17} />
//           Add News / Notice
//         </button>

//       </div>

//       {/* =================================================
//           ALERTS
//       ================================================= */}

//       {message && (
//         <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </div>
//       )}

//       {/* =================================================
//           STATISTICS
//       ================================================= */}

//       <div className="mb-6 grid gap-4 sm:grid-cols-3">

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Total
//           </p>

//           <p className="mt-2 text-3xl font-bold text-[#0f3262]">
//             {items.length}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Active
//           </p>

//           <p className="mt-2 text-3xl font-bold text-emerald-600">
//             {
//               items.filter(
//                 (item) => Number(item.is_active) === 1
//               ).length
//             }
//           </p>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Inactive
//           </p>

//           <p className="mt-2 text-3xl font-bold text-slate-400">
//             {
//               items.filter(
//                 (item) => Number(item.is_active) === 0
//               ).length
//             }
//           </p>
//         </div>

//       </div>

//       {/* =================================================
//           TABLE
//       ================================================= */}

//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="border-b border-slate-200 px-5 py-4">
//           <h2 className="font-bold text-slate-900">
//             All News & Notices
//           </h2>

//           <p className="mt-1 text-xs text-slate-500">
//             These records are controlled from the database.
//           </p>
//         </div>

//         {items.length === 0 ? (
//           <div className="px-6 py-16 text-center">

//             <Bell
//               size={32}
//               className="mx-auto text-slate-300"
//             />

//             <h3 className="mt-3 text-sm font-semibold text-slate-700">
//               No News or Notices
//             </h3>

//             <p className="mt-1 text-xs text-slate-400">
//               Create your first announcement.
//             </p>

//             <button
//               type="button"
//               onClick={handleAdd}
//               className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0f3262] px-4 py-2 text-xs font-semibold text-white"
//             >
//               <Plus size={14} />
//               Add News / Notice
//             </button>

//           </div>
//         ) : (
//           <div className="overflow-x-auto">

//             <table className="w-full min-w-[850px]">

//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50 text-left">

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Content
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Category
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Date
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Order
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Status
//                   </th>

//                   <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Actions
//                   </th>

//                 </tr>
//               </thead>

//               <tbody>

//                 {items.map((item) => {

//                   const isNotice =
//                     item.category?.toLowerCase() ===
//                     "notice";

//                   const active =
//                     Number(item.is_active) === 1;

//                   return (
//                     <tr
//                       key={item.id}
//                       className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50"
//                     >

//                       {/* CONTENT */}

//                       <td className="max-w-md px-5 py-4">

//                         <div className="flex gap-3">

//                           <div
//                             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
//                               isNotice
//                                 ? "bg-blue-50 text-[#0f3262]"
//                                 : "bg-amber-50 text-amber-600"
//                             }`}
//                           >
//                             {isNotice ? (
//                               <Bell size={16} />
//                             ) : (
//                               <Newspaper size={16} />
//                             )}
//                           </div>

//                           <div className="min-w-0">

//                             <p className="truncate text-sm font-bold text-slate-800">
//                               {item.title}
//                             </p>

//                             {item.description && (
//                               <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
//                                 {item.description}
//                               </p>
//                             )}

//                             {item.link && (
//                               <a
//                                 href={item.link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600"
//                               >
//                                 Link
//                                 <ExternalLink size={10} />
//                               </a>
//                             )}

//                           </div>

//                         </div>

//                       </td>

//                       {/* CATEGORY */}

//                       <td className="px-5 py-4">

//                         <span
//                           className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
//                             isNotice
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-amber-50 text-amber-600"
//                           }`}
//                         >
//                           {item.category || "News"}
//                         </span>

//                       </td>

//                       {/* DATE */}

//                       <td className="whitespace-nowrap px-5 py-4">

//                         <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
//                           <CalendarDays size={13} />
//                           {formatDate(item.publish_date)}
//                         </span>

//                       </td>

//                       {/* ORDER */}

//                       <td className="px-5 py-4 text-xs font-semibold text-slate-500">
//                         {item.display_order ?? 0}
//                       </td>

//                       {/* STATUS */}

//                       <td className="px-5 py-4">

//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleToggle(item)
//                           }
//                           className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
//                             active
//                               ? "bg-emerald-50 text-emerald-600"
//                               : "bg-slate-100 text-slate-400"
//                           }`}
//                         >
//                           {active ? (
//                             <>
//                               <Eye size={11} />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <EyeOff size={11} />
//                               Inactive
//                             </>
//                           )}
//                         </button>

//                       </td>

//                       {/* ACTIONS */}

//                       <td className="px-5 py-4">

//                         <div className="flex justify-end gap-2">

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleEdit(item)
//                             }
//                             className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                             title="Edit"
//                           >
//                             <Pencil size={14} />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleDelete(item.id)
//                             }
//                             className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
//                             title="Delete"
//                           >
//                             <Trash2 size={14} />
//                           </button>

//                         </div>

//                       </td>

//                     </tr>
//                   );
//                 })}

//               </tbody>

//             </table>

//           </div>
//         )}

//       </div>

//       {/* =================================================
//           FORM MODAL
//       ================================================= */}

//       {showForm && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

//             {/* MODAL HEADER */}

//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

//               <div>
//                 <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                   Homepage
//                 </p>

//                 <h2 className="mt-1 text-xl font-bold text-slate-900">
//                   {editingId
//                     ? "Edit News / Notice"
//                     : "Add News / Notice"}
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* FORM */}

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5 p-6"
//             >

//               {/* TITLE */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Title *
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter news or notice title"
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               {/* CATEGORY + DATE */}

//               <div className="grid gap-4 sm:grid-cols-2">

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Category
//                   </label>

//                   <select
//                     name="category"
//                     value={form.category}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   >
//                     <option value="Notice">
//                       Notice
//                     </option>

//                     <option value="News">
//                       News
//                     </option>

//                     <option value="Announcement">
//                       Announcement
//                     </option>

//                     <option value="Admission">
//                       Admission
//                     </option>

//                     <option value="Examination">
//                       Examination
//                     </option>

//                     <option value="Event">
//                       Event
//                     </option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Publish Date
//                   </label>

//                   <input
//                     type="date"
//                     name="publish_date"
//                     value={form.publish_date}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//               </div>

//               {/* DESCRIPTION */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Description
//                 </label>

//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   rows={5}
//                   placeholder="Enter description..."
//                   className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               {/* LINK */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Link
//                 </label>

//                 <input
//                   type="text"
//                   name="link"
//                   value={form.link}
//                   onChange={handleChange}
//                   placeholder="/downloads/notice.pdf or https://..."
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               {/* ORDER + STATUS */}

//               <div className="grid gap-4 sm:grid-cols-2">

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Display Order
//                   </label>

//                   <input
//                     type="number"
//                     name="display_order"
//                     value={form.display_order}
//                     onChange={handleChange}
//                     min="0"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Status
//                   </label>

//                   <select
//                     name="is_active"
//                     value={form.is_active}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   >
//                     <option value={1}>
//                       Active — Show on Homepage
//                     </option>

//                     <option value={0}>
//                       Inactive — Hide
//                     </option>
//                   </select>
//                 </div>

//               </div>

//               {/* BUTTONS */}

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   disabled={saving}
//                   className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#071f3d] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <Save size={16} />

//                   {saving
//                     ? "Saving..."
//                     : editingId
//                     ? "Update"
//                     : "Publish"}
//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default NewsNotices;




// import { useEffect, useState } from "react";
// import {
//   Bell,
//   Newspaper,
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   Eye,
//   EyeOff,
//   CalendarDays,
//   ExternalLink,
//   FolderOpen,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000";
// const API_URL = `${API_BASE}/api/news-notices`;
// const BROWSE_API_URL = `${API_BASE}/api/files`;

// const emptyForm = {
//   title: "",
//   category: "Notice",
//   description: "",
//   publish_date: "",
//   link: "",
//   display_order: 0,
//   is_active: 1,
// };

// function NewsNotices() {
//   const [items, setItems] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [showForm, setShowForm] = useState(false);
//   const [showBrowse, setShowBrowse] = useState(false);

//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState(emptyForm);

//   const [browseFiles, setBrowseFiles] = useState([]);
//   const [browseLoading, setBrowseLoading] = useState(false);

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =====================================================
//   // FETCH ALL NEWS / NOTICES
//   // =====================================================

//   const fetchItems = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/all?_=${Date.now()}`,
//         {
//           cache: "no-store",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Request failed: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success && Array.isArray(result.data)) {
//         setItems(result.data);
//       } else {
//         setItems([]);
//       }
//     } catch (err) {
//       console.error("News Notices API error:", err);
//       setError("Failed to load News & Notices.");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   // =====================================================
//   // FORM CHANGE
//   // =====================================================

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   };

//   // =====================================================
//   // ADD
//   // =====================================================

//   const handleAdd = () => {
//     setEditingId(null);

//     setForm({
//       ...emptyForm,
//       publish_date: new Date()
//         .toISOString()
//         .split("T")[0],
//     });

//     setMessage("");
//     setError("");
//     setShowBrowse(false);
//     setShowForm(true);
//   };

//   // =====================================================
//   // EDIT
//   // =====================================================

//   const handleEdit = (item) => {
//     setEditingId(item.id);

//     setForm({
//       title: item.title || "",
//       category: item.category || "Notice",
//       description: item.description || "",
//       publish_date: item.publish_date
//         ? new Date(item.publish_date)
//             .toISOString()
//             .split("T")[0]
//         : "",
//       link: item.link || "",
//       display_order: item.display_order ?? 0,
//       is_active: Number(item.is_active) === 1 ? 1 : 0,
//     });

//     setMessage("");
//     setError("");
//     setShowBrowse(false);
//     setShowForm(true);
//   };

//   // =====================================================
//   // CLOSE FORM
//   // =====================================================

//   const handleClose = () => {
//     if (saving) return;

//     setShowForm(false);
//     setShowBrowse(false);
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   // =====================================================
//   // SAVE
//   // =====================================================

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!form.title.trim()) {
//       setError("Please enter a title.");
//       return;
//     }

//     setSaving(true);
//     setMessage("");
//     setError("");

//     try {
//       const method = editingId ? "PUT" : "POST";

//       const url = editingId
//         ? `${API_URL}/${editingId}`
//         : API_URL;

//       const payload = {
//         title: form.title.trim(),
//         category: form.category || "Notice",
//         description: form.description.trim(),
//         publish_date: form.publish_date || null,
//         link: form.link.trim(),
//         display_order: Number(form.display_order || 0),
//         is_active:
//           Number(form.is_active) === 1 ? 1 : 0,
//       };

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to save News / Notice."
//         );
//       }

//       setMessage(
//         editingId
//           ? "News / Notice updated successfully."
//           : "News / Notice created successfully."
//       );

//       setShowForm(false);
//       setShowBrowse(false);
//       setEditingId(null);
//       setForm(emptyForm);

//       await fetchItems();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================================
//   // DELETE
//   // =====================================================

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to permanently delete this News / Notice?"
//     );

//     if (!confirmed) return;

//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(
//         `${API_URL}/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to delete News / Notice."
//         );
//       }

//       setMessage(
//         "News / Notice deleted successfully."
//       );

//       await fetchItems();
//     } catch (err) {
//       console.error("Delete error:", err);
//       setError(err.message);
//     }
//   };

//   // =====================================================
//   // TOGGLE ACTIVE
//   // =====================================================

//   const handleToggle = async (item) => {
//     try {
//       setError("");

//       const response = await fetch(
//         `${API_URL}/${item.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },
//           body: JSON.stringify({
//             title: item.title || "",
//             category: item.category || "Notice",
//             description: item.description || "",
//             publish_date: item.publish_date
//               ? new Date(item.publish_date)
//                   .toISOString()
//                   .split("T")[0]
//               : null,
//             link: item.link || "",
//             display_order:
//               item.display_order ?? 0,
//             is_active:
//               Number(item.is_active) === 1 ? 0 : 1,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to change status."
//         );
//       }

//       await fetchItems();
//     } catch (err) {
//       console.error("Toggle error:", err);
//       setError(err.message);
//     }
//   };

//   // =====================================================
//   // BROWSE FILES
//   // =====================================================

//   const openBrowse = async () => {
//     setShowBrowse(true);
//     setBrowseLoading(true);
//     setError("");

//     try {
//       const response = await fetch(
//         `${BROWSE_API_URL}?_=${Date.now()}`,
//         {
//           cache: "no-store",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Browse request failed: ${response.status}`
//         );
//       }

//       const result = await response.json();

//       if (
//         result.success &&
//         Array.isArray(result.data)
//       ) {
//         setBrowseFiles(result.data);
//       } else {
//         setBrowseFiles([]);
//       }
//     } catch (err) {
//       console.error("Browse error:", err);

//       /*
//        * If the generic file API does not exist,
//        * the user can still manually enter a link.
//        */
//       setBrowseFiles([]);
//       setError(
//         "Unable to load uploaded files. You can still enter the file URL manually."
//       );
//     } finally {
//       setBrowseLoading(false);
//     }
//   };

//   // =====================================================
//   // SELECT BROWSED FILE
//   // =====================================================

//   const selectFile = (file) => {
//     const selectedUrl =
//       file.url ||
//       file.file_url ||
//       file.path ||
//       file.file_path ||
//       "";

//     if (!selectedUrl) {
//       return;
//     }

//     setForm((current) => ({
//       ...current,
//       link: selectedUrl,
//     }));

//     setShowBrowse(false);
//     setMessage("File selected successfully.");
//   };

//   // =====================================================
//   // REMOVE LINK
//   // =====================================================

//   const clearLink = () => {
//     setForm((current) => ({
//       ...current,
//       link: "",
//     }));
//   };

//   // =====================================================
//   // DATE FORMAT
//   // =====================================================

//   const formatDate = (value) => {
//     if (!value) return "—";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//       return "—";
//     }

//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // =====================================================
//   // FILE NAME
//   // =====================================================

//   const getFileName = (file) => {
//     return (
//       file.name ||
//       file.filename ||
//       file.file_name ||
//       file.originalname ||
//       "Uploaded File"
//     );
//   };

//   // =====================================================
//   // FILE URL
//   // =====================================================

//   const getFileUrl = (file) => {
//     return (
//       file.url ||
//       file.file_url ||
//       file.path ||
//       file.file_path ||
//       ""
//     );
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <div>
//         <div className="mb-8">
//           <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
//           <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-200" />
//         </div>

//         <div className="h-80 animate-pulse rounded-2xl bg-white" />
//       </div>
//     );
//   }

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="mx-auto max-w-7xl px-6">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

//         <div>
//           <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//             Homepage
//           </p>

//           <h1 className="mt-1 text-3xl font-bold text-slate-900">
//             News & Notices
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Manage announcements and important college
//             notices displayed on the homepage.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleAdd}
//           className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#071f3d]"
//         >
//           <Plus size={17} />
//           Add News / Notice
//         </button>

//       </div>

//       {/* =================================================
//           ALERTS
//       ================================================= */}

//       {message && (
//         <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </div>
//       )}

//       {/* =================================================
//           STATISTICS
//       ================================================= */}

//       <div className="mb-6 grid gap-4 sm:grid-cols-3">

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Total
//           </p>

//           <p className="mt-2 text-3xl font-bold text-[#0f3262]">
//             {items.length}
//           </p>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Active
//           </p>

//           <p className="mt-2 text-3xl font-bold text-emerald-600">
//             {
//               items.filter(
//                 (item) =>
//                   Number(item.is_active) === 1
//               ).length
//             }
//           </p>
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             Inactive
//           </p>

//           <p className="mt-2 text-3xl font-bold text-slate-400">
//             {
//               items.filter(
//                 (item) =>
//                   Number(item.is_active) === 0
//               ).length
//             }
//           </p>
//         </div>

//       </div>

//       {/* =================================================
//           TABLE
//       ================================================= */}

//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="border-b border-slate-200 px-5 py-4">
//           <h2 className="font-bold text-slate-900">
//             All News & Notices
//           </h2>

//           <p className="mt-1 text-xs text-slate-500">
//             These records are controlled from the database.
//           </p>
//         </div>

//         {items.length === 0 ? (
//           <div className="px-6 py-16 text-center">

//             <Bell
//               size={32}
//               className="mx-auto text-slate-300"
//             />

//             <h3 className="mt-3 text-sm font-semibold text-slate-700">
//               No News or Notices
//             </h3>

//             <p className="mt-1 text-xs text-slate-400">
//               Create your first announcement.
//             </p>

//             <button
//               type="button"
//               onClick={handleAdd}
//               className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0f3262] px-4 py-2 text-xs font-semibold text-white"
//             >
//               <Plus size={14} />
//               Add News / Notice
//             </button>

//           </div>
//         ) : (
//           <div className="overflow-x-auto">

//             <table className="w-full min-w-[850px]">

//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50 text-left">

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Content
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Category
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Date
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Order
//                   </th>

//                   <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Status
//                   </th>

//                   <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                     Actions
//                   </th>

//                 </tr>
//               </thead>

//               <tbody>

//                 {items.map((item) => {

//                   const isNotice =
//                     item.category?.toLowerCase() ===
//                     "notice";

//                   const active =
//                     Number(item.is_active) === 1;

//                   return (
//                     <tr
//                       key={item.id}
//                       className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50"
//                     >

//                       {/* CONTENT */}

//                       <td className="max-w-md px-5 py-4">

//                         <div className="flex gap-3">

//                           <div
//                             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
//                               isNotice
//                                 ? "bg-blue-50 text-[#0f3262]"
//                                 : "bg-amber-50 text-amber-600"
//                             }`}
//                           >
//                             {isNotice ? (
//                               <Bell size={16} />
//                             ) : (
//                               <Newspaper size={16} />
//                             )}
//                           </div>

//                           <div className="min-w-0">

//                             <p className="truncate text-sm font-bold text-slate-800">
//                               {item.title}
//                             </p>

//                             {item.description && (
//                               <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
//                                 {item.description}
//                               </p>
//                             )}

//                             {item.link && (
//                               <a
//                                 href={
//                                   item.link.startsWith(
//                                     "http"
//                                   )
//                                     ? item.link
//                                     : `${API_BASE}${item.link}`
//                                 }
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600"
//                               >
//                                 Open Link
//                                 <ExternalLink size={10} />
//                               </a>
//                             )}

//                           </div>

//                         </div>

//                       </td>

//                       {/* CATEGORY */}

//                       <td className="px-5 py-4">

//                         <span
//                           className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
//                             isNotice
//                               ? "bg-blue-50 text-blue-600"
//                               : "bg-amber-50 text-amber-600"
//                           }`}
//                         >
//                           {item.category || "News"}
//                         </span>

//                       </td>

//                       {/* DATE */}

//                       <td className="whitespace-nowrap px-5 py-4">

//                         <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
//                           <CalendarDays size={13} />
//                           {formatDate(item.publish_date)}
//                         </span>

//                       </td>

//                       {/* ORDER */}

//                       <td className="px-5 py-4 text-xs font-semibold text-slate-500">
//                         {item.display_order ?? 0}
//                       </td>

//                       {/* STATUS */}

//                       <td className="px-5 py-4">

//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleToggle(item)
//                           }
//                           className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${
//                             active
//                               ? "bg-emerald-50 text-emerald-600"
//                               : "bg-slate-100 text-slate-400"
//                           }`}
//                         >
//                           {active ? (
//                             <>
//                               <Eye size={11} />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <EyeOff size={11} />
//                               Inactive
//                             </>
//                           )}
//                         </button>

//                       </td>

//                       {/* ACTIONS */}

//                       <td className="px-5 py-4">

//                         <div className="flex justify-end gap-2">

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleEdit(item)
//                             }
//                             className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
//                             title="Edit"
//                           >
//                             <Pencil size={14} />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleDelete(item.id)
//                             }
//                             className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
//                             title="Delete"
//                           >
//                             <Trash2 size={14} />
//                           </button>

//                         </div>

//                       </td>

//                     </tr>
//                   );
//                 })}

//               </tbody>

//             </table>

//           </div>
//         )}

//       </div>

//       {/* =================================================
//           FORM MODAL
//       ================================================= */}

//       {showForm && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">

//           <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

//             {/* MODAL HEADER */}

//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

//               <div>
//                 <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                   Homepage
//                 </p>

//                 <h2 className="mt-1 text-xl font-bold text-slate-900">
//                   {editingId
//                     ? "Edit News / Notice"
//                     : "Add News / Notice"}
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* FORM */}

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5 p-6"
//             >

//               {/* TITLE */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Title *
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter news or notice title"
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               {/* CATEGORY + DATE */}

//               <div className="grid gap-4 sm:grid-cols-2">

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Category
//                   </label>

//                   <select
//                     name="category"
//                     value={form.category}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   >
//                     <option value="Notice">
//                       Notice
//                     </option>

//                     <option value="News">
//                       News
//                     </option>

//                     <option value="Announcement">
//                       Announcement
//                     </option>

//                     <option value="Admission">
//                       Admission
//                     </option>

//                     <option value="Examination">
//                       Examination
//                     </option>

//                     <option value="Event">
//                       Event
//                     </option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Publish Date
//                   </label>

//                   <input
//                     type="date"
//                     name="publish_date"
//                     value={form.publish_date}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//               </div>

//               {/* DESCRIPTION */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Description
//                 </label>

//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   rows={5}
//                   placeholder="Enter description..."
//                   className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               {/* LINK + BROWSE */}

//               <div>
//                 <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                   Document / Link
//                 </label>

//                 <div className="flex gap-2">

//                   <input
//                     type="text"
//                     name="link"
//                     value={form.link}
//                     onChange={handleChange}
//                     placeholder="/uploads/notices/notice.pdf or https://..."
//                     className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />

//                   <button
//                     type="button"
//                     onClick={openBrowse}
//                     className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
//                   >
//                     <FolderOpen size={16} />
//                     Browse
//                   </button>

//                 </div>

//                 {form.link && (
//                   <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">

//                     <span className="max-w-[80%] truncate text-xs text-slate-500">
//                       {form.link}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={clearLink}
//                       className="text-xs font-semibold text-red-500 hover:text-red-700"
//                     >
//                       Remove
//                     </button>

//                   </div>
//                 )}

//                 <p className="mt-1.5 text-[11px] text-slate-400">
//                   Use Browse to select an already uploaded PDF/document,
//                   or enter a URL manually.
//                 </p>
//               </div>

//               {/* ORDER + STATUS */}

//               <div className="grid gap-4 sm:grid-cols-2">

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Display Order
//                   </label>

//                   <input
//                     type="number"
//                     name="display_order"
//                     value={form.display_order}
//                     onChange={handleChange}
//                     min="0"
//                     className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-xs font-bold text-slate-700">
//                     Status
//                   </label>

//                   <select
//                     name="is_active"
//                     value={form.is_active}
//                     onChange={handleChange}
//                     className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                   >
//                     <option value={1}>
//                       Active — Show on Homepage
//                     </option>

//                     <option value={0}>
//                       Inactive — Hide
//                     </option>
//                   </select>
//                 </div>

//               </div>

//               {/* BUTTONS */}

//               <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   disabled={saving}
//                   className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#071f3d] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <Save size={16} />

//                   {saving
//                     ? "Saving..."
//                     : editingId
//                     ? "Update"
//                     : "Publish"}
//                 </button>

//               </div>

//             </form>

//           </div>
//         </div>
//       )}

//       {/* =================================================
//           BROWSE MODAL
//       ================================================= */}

//       {showBrowse && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4">

//           <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

//             {/* HEADER */}

//             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

//               <div>
//                 <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                   Media / Documents
//                 </p>

//                 <h2 className="mt-1 text-xl font-bold text-slate-900">
//                   Browse Files
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowBrowse(false)}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* FILE LIST */}

//             <div className="max-h-[60vh] overflow-y-auto p-6">

//               {browseLoading ? (
//                 <div className="space-y-3">

//                   {[1, 2, 3, 4].map((item) => (
//                     <div
//                       key={item}
//                       className="h-16 animate-pulse rounded-xl bg-slate-100"
//                     />
//                   ))}

//                 </div>
//               ) : browseFiles.length === 0 ? (
//                 <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

//                   <FolderOpen
//                     size={36}
//                     className="mx-auto text-slate-300"
//                   />

//                   <h3 className="mt-3 text-sm font-semibold text-slate-700">
//                     No uploaded files found
//                   </h3>

//                   <p className="mt-1 text-xs text-slate-400">
//                     Upload a document first or enter its URL manually.
//                   </p>

//                 </div>
//               ) : (
//                 <div className="space-y-2">

//                   {browseFiles.map((file, index) => {

//                     const fileUrl = getFileUrl(file);
//                     const fileName = getFileName(file);

//                     return (
//                       <button
//                         key={
//                           file.id ??
//                           fileUrl ??
//                           index
//                         }
//                         type="button"
//                         onClick={() =>
//                           selectFile(file)
//                         }
//                         className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
//                       >

//                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
//                           <FolderOpen size={19} />
//                         </div>

//                         <div className="min-w-0 flex-1">

//                           <p className="truncate text-sm font-semibold text-slate-800">
//                             {fileName}
//                           </p>

//                           {fileUrl && (
//                             <p className="mt-1 truncate text-[11px] text-slate-400">
//                               {fileUrl}
//                             </p>
//                           )}

//                         </div>

//                         <span className="shrink-0 rounded-lg bg-[#0f3262] px-3 py-2 text-xs font-semibold text-white">
//                           Select
//                         </span>

//                       </button>
//                     );
//                   })}

//                 </div>
//               )}

//             </div>

//             {/* FOOTER */}

//             <div className="flex justify-end border-t border-slate-200 px-6 py-4">

//               <button
//                 type="button"
//                 onClick={() => setShowBrowse(false)}
//                 className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 Close
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }

// export default NewsNotices;



import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  CalendarDays,
  ExternalLink,
  FolderOpen,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API_URL = `${API_BASE}/api/news-notices`;

const initialForm = {
  title: "",
  category: "News",
  description: "",
  publish_date: "",
  link: "",
  display_order: 0,
  is_active: 1,
  is_breaking: 0,
};

export default function NewsNotices() {
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD
  // ============================================================

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      console.log("News Notices:", data);

      if (!response.ok) {
        throw new Error(
          data.message ||
            `HTTP ${response.status}`
        );
      }

      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data.data)) {
        setItems(data.data);
      } else if (Array.isArray(data.rows)) {
        setItems(data.rows);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load News & Notices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ============================================================
  // RESET
  // ============================================================

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // ADD
  // ============================================================

  const openAddForm = () => {
    resetForm();

    setForm({
      ...initialForm,
      publish_date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // ============================================================
  // EDIT
  // ============================================================

  const openEditForm = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      category:
        item.category === "Notice"
          ? "Notice"
          : "News",
      description: item.description || "",
      publish_date: item.publish_date
        ? String(item.publish_date).substring(0, 10)
        : "",
      link: item.link || "",
      display_order:
        item.display_order ?? 0,
      is_active:
        Number(item.is_active) === 1
          ? 1
          : 0,
      is_breaking:
        Number(item.is_breaking) === 1
          ? 1
          : 0,
    });

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  // ============================================================
  // CHANGE
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : name === "display_order"
          ? Number(value)
          : value,
    }));
  };

  // ============================================================
  // BROWSE
  // ============================================================

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }

    try {
      setSaving(true);

      const body = new FormData();

      body.append(
        "title",
        form.title.trim()
      );

      body.append(
        "category",
        form.category
      );

      body.append(
        "description",
        form.description || ""
      );

      body.append(
        "publish_date",
        form.publish_date || ""
      );

      body.append(
        "link",
        form.link || ""
      );

      body.append(
        "display_order",
        String(form.display_order ?? 0)
      );

      body.append(
        "is_active",
        String(form.is_active)
      );

      body.append(
        "is_breaking",
        String(form.is_breaking)
      );

      if (selectedFile) {
        body.append(
          "file",
          selectedFile
        );
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId
          ? "PUT"
          : "POST",
        body,
      });

      const data =
        await response
          .json()
          .catch(() => ({}));

      console.log(
        "Save response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to save News / Notice."
        );
      }

      setSuccess(
        editingId
          ? "News / Notice updated successfully."
          : "News / Notice created successfully."
      );

      setShowForm(false);
      resetForm();

      await loadItems();
    } catch (err) {
      console.error(
        "Save error:",
        err
      );

      setError(
        err.message ||
          "Failed to save News / Notice."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this News / Notice?"
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to delete."
        );
      }

      setSuccess(
        "News / Notice deleted successfully."
      );

      await loadItems();
    } catch (err) {
      console.error(
        "Delete error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete."
      );
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const toggleActive = async (item) => {
    try {
      setError("");
      setSuccess("");

      const body = new FormData();

      body.append(
        "title",
        item.title || ""
      );

      body.append(
        "category",
        item.category === "Notice"
          ? "Notice"
          : "News"
      );

      body.append(
        "description",
        item.description || ""
      );

      body.append(
        "publish_date",
        item.publish_date
          ? String(
              item.publish_date
            ).substring(0, 10)
          : ""
      );

      body.append(
        "link",
        item.link || ""
      );

      body.append(
        "display_order",
        String(
          item.display_order ?? 0
        )
      );

      body.append(
        "is_active",
        Number(item.is_active) === 1
          ? "0"
          : "1"
      );

      body.append(
        "is_breaking",
        Number(item.is_breaking) === 1
          ? "1"
          : "0"
      );

      const response = await fetch(
        `${API_URL}/${item.id}`,
        {
          method: "PUT",
          body,
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to change status."
        );
      }

      await loadItems();
    } catch (err) {
      console.error(
        "Status error:",
        err
      );

      setError(
        err.message ||
          "Failed to change status."
      );
    }
  };

  // ============================================================
  // BREAKING STATUS
  // ============================================================

  const toggleBreaking = async (item) => {
    try {
      setError("");
      setSuccess("");

      const body = new FormData();

      body.append(
        "title",
        item.title || ""
      );

      body.append(
        "category",
        item.category === "Notice"
          ? "Notice"
          : "News"
      );

      body.append(
        "description",
        item.description || ""
      );

      body.append(
        "publish_date",
        item.publish_date
          ? String(
              item.publish_date
            ).substring(0, 10)
          : ""
      );

      body.append(
        "link",
        item.link || ""
      );

      body.append(
        "display_order",
        String(
          item.display_order ?? 0
        )
      );

      body.append(
        "is_active",
        String(
          item.is_active ?? 1
        )
      );

      body.append(
        "is_breaking",
        Number(item.is_breaking) === 1
          ? "0"
          : "1"
      );

      const response = await fetch(
        `${API_URL}/${item.id}`,
        {
          method: "PUT",
          body,
        }
      );

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to change breaking status."
        );
      }

      await loadItems();
    } catch (err) {
      console.error(
        "Breaking status error:",
        err
      );

      setError(
        err.message ||
          "Failed to change breaking status."
      );
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date).substring(
        0,
        10
      );
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

  // ============================================================
  // ATTACHMENT URL
  // ============================================================

  const getAttachmentUrl = (attachment) => {
    if (!attachment) return null;

    if (
      attachment.startsWith("http://") ||
      attachment.startsWith("https://")
    ) {
      return attachment;
    }

    return `${API_BASE}${
      attachment.startsWith("/")
        ? attachment
        : `/${attachment}`
    }`;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Newspaper size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                News & Notices
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage college news and notices.
              </p>
            </div>

          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={loadItems}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus size={18} />

              Add News / Notice
            </button>

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p className="font-semibold">
                Error
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">

            <CheckCircle2 size={18} />

            <div className="flex-1">
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {success}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSuccess("")
              }
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* FORM */}

        {showForm && (
          <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="font-bold text-slate-900">
                  {editingId
                    ? "Edit News / Notice"
                    : "Add News / Notice"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter news or notice information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* TITLE */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter title"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="News">
                      News
                    </option>

                    <option value="Notice">
                      Notice
                    </option>
                  </select>

                </div>

                {/* DATE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Publish Date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      name="publish_date"
                      value={
                        form.publish_date
                      }
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter description..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* LINK */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    External Link
                  </label>

                  <div className="relative">

                    <ExternalLink
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      name="link"
                      value={form.link}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* ORDER */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Display Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="display_order"
                    value={
                      form.display_order
                    }
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* FILE */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Attachment
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  />

                  <div className="flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                        <FileText size={21} />
                      </div>

                      <div className="min-w-0">

                        {selectedFile ? (
                          <>
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {
                                selectedFile.name
                              }
                            </p>

                            <p className="text-xs text-slate-500">
                              {(
                                selectedFile.size /
                                1024
                              ).toFixed(
                                1
                              )}{" "}
                              KB
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-slate-500">
                            {editingId
                              ? "Choose a new attachment"
                              : "No attachment selected"}
                          </p>
                        )}

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleBrowse
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
                    >
                      <FolderOpen
                        size={18}
                      />

                      Browse
                    </button>

                  </div>

                </div>

                {/* ACTIVE */}

                <div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        Number(
                          form.is_active
                        ) === 1
                      }
                      onChange={
                        handleChange
                      }
                      className="h-4 w-4"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        Active
                      </span>

                      <span className="block text-xs text-slate-500">
                        Show on website
                      </span>
                    </span>

                  </label>

                </div>

                {/* BREAKING */}

                <div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <input
                      type="checkbox"
                      name="is_breaking"
                      checked={
                        Number(
                          form.is_breaking
                        ) === 1
                      }
                      onChange={
                        handleChange
                      }
                      className="h-4 w-4"
                    />

                    <span className="flex items-center gap-2">
                      <Megaphone
                        size={16}
                        className="text-red-600"
                      />

                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Breaking News
                        </span>

                        <span className="block text-xs text-slate-500">
                          Show in breaking-news ticker
                        </span>
                      </span>
                    </span>

                  </label>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
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
                      <Save size={17} />

                      {editingId
                        ? "Update"
                        : "Save"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="font-bold text-slate-900">
                All News & Notices
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {items.length} item
                {items.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <Bell
              size={20}
              className="text-blue-700"
            />

          </div>

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[250px] items-center justify-center">

              <div className="text-center">

                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-blue-700"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading News & Notices...
                </p>

              </div>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            items.length === 0 && (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                <Newspaper
                  size={40}
                  className="text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-800">
                  No News or Notices
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add your first News or Notice.
                </p>

              </div>
            )}

          {/* TABLE */}

          {!loading &&
            items.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        #
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        News / Notice
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        Date
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        Breaking
                      </th>

                      <th className="px-5 py-3 text-xs font-bold uppercase text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {items.map(
                      (item, index) => {

                        const attachmentUrl =
                          getAttachmentUrl(
                            item.attachment
                          );

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                              {index + 1}
                            </td>

                            <td className="max-w-[420px] px-5 py-4">

                              <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                  <Newspaper
                                    size={18}
                                  />
                                </div>

                                <div className="min-w-0">

                                  <p className="truncate font-semibold text-slate-800">
                                    {
                                      item.title
                                    }
                                  </p>

                                  {item.description && (
                                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                      {
                                        item.description
                                      }
                                    </p>
                                  )}

                                  {attachmentUrl && (
                                    <a
                                      href={
                                        attachmentUrl
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                                    >
                                      <FileText
                                        size={
                                          13
                                        }
                                      />

                                      Attachment

                                      <ExternalLink
                                        size={
                                          11
                                        }
                                      />
                                    </a>
                                  )}

                                </div>

                              </div>

                            </td>

                            <td className="px-5 py-4">

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                  item.category ===
                                  "Notice"
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {
                                  item.category
                                }
                              </span>

                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                              {formatDate(
                                item.publish_date
                              )}
                            </td>

                            <td className="px-5 py-4">

                              <button
                                type="button"
                                onClick={() =>
                                  toggleBreaking(
                                    item
                                  )
                                }
                                className={
                                  Number(
                                    item.is_breaking
                                  ) === 1
                                    ? "inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                                    : "inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
                                }
                              >
                                <Megaphone
                                  size={13}
                                />

                                {Number(
                                  item.is_breaking
                                ) === 1
                                  ? "Breaking"
                                  : "Normal"}
                              </button>

                            </td>

                            <td className="px-5 py-4">

                              <button
                                type="button"
                                onClick={() =>
                                  toggleActive(
                                    item
                                  )
                                }
                                className={
                                  Number(
                                    item.is_active
                                  ) === 1
                                    ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                                    : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
                                }
                              >
                                {Number(
                                  item.is_active
                                ) === 1 ? (
                                  <Eye
                                    size={
                                      14
                                    }
                                  />
                                ) : (
                                  <EyeOff
                                    size={
                                      14
                                    }
                                  />
                                )}

                                {Number(
                                  item.is_active
                                ) === 1
                                  ? "Active"
                                  : "Inactive"}
                              </button>

                            </td>

                            <td className="px-5 py-4">

                              <div className="flex justify-end gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditForm(
                                      item
                                    )
                                  }
                                  title="Edit"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                  <Pencil
                                    size={
                                      16
                                    }
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      item.id
                                    )
                                  }
                                  title="Delete"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2
                                    size={
                                      16
                                    }
                                  />
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

        </div>

      </div>
    </div>
  );
}

