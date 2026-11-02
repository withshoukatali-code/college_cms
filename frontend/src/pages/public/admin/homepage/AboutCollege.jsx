// import { useEffect, useState } from "react";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   Image as ImageIcon,
//   Eye,
//   EyeOff,
//   ArrowUp,
//   ArrowDown,
// } from "lucide-react";

// const API_URL = "http://localhost:5000/api/about-college";

// const emptyForm = {
//   title: "",
//   description: "",
//   image_url: "",
//   button_text: "Read More",
//   button_link: "/about-college",
//   is_active: 1,
//   display_order: 0,
// };

// const AboutCollege = () => {
//   const [items, setItems] = useState([]);
//   const [form, setForm] = useState(emptyForm);

//   const [editingId, setEditingId] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // =========================================================
//   // INITIAL LOAD
//   // =========================================================

//   useEffect(() => {
//     let cancelled = false;

//     const loadAboutCollege = async () => {
//       try {
//         const response = await fetch(`${API_URL}/admin`);

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch About College (${response.status})`
//           );
//         }

//         const data = await response.json();

//         console.log("About College API:", data);

//         if (!cancelled) {
//           setItems(Array.isArray(data.data) ? data.data : []);
//           setError("");
//         }
//       } catch (err) {
//         console.error("Failed to fetch About College:", err);

//         if (!cancelled) {
//           setError(
//             err.message ||
//               "Failed to load About College content."
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     loadAboutCollege();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // =========================================================
//   // REFRESH
//   // =========================================================

//   const refreshAboutCollege = async () => {
//     try {
//       const response = await fetch(`${API_URL}/admin`);

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch About College (${response.status})`
//         );
//       }

//       const data = await response.json();

//       setItems(Array.isArray(data.data) ? data.data : []);
//     } catch (err) {
//       console.error("Refresh error:", err);

//       setError(
//         err.message ||
//           "Failed to refresh About College."
//       );
//     }
//   };

//   // =========================================================
//   // FORM CHANGE
//   // =========================================================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =========================================================
//   // RESET
//   // =========================================================

//   const resetForm = () => {
//     setForm(emptyForm);
//     setEditingId(null);
//     setShowForm(false);
//   };

//   // =========================================================
//   // ADD
//   // =========================================================

//   const handleAdd = () => {
//     setError("");
//     setSuccess("");

//     setForm({
//       ...emptyForm,
//       display_order: items.length + 1,
//     });

//     setEditingId(null);
//     setShowForm(true);
//   };

//   // =========================================================
//   // EDIT
//   // =========================================================

//   const handleEdit = (item) => {
//     setError("");
//     setSuccess("");

//     setForm({
//       title: item.title || "",
//       description: item.description || "",
//       image_url: item.image_url || "",
//       button_text: item.button_text || "Read More",
//       button_link:
//         item.button_link || "/about-college",
//       is_active:
//         Number(item.is_active) === 1 ? 1 : 0,
//       display_order:
//         Number(item.display_order) || 0,
//     });

//     setEditingId(item.id);
//     setShowForm(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================================================
//   // SAVE
//   // =========================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!form.title.trim()) {
//       setError("Title is required.");
//       return;
//     }

//     if (!form.description.trim()) {
//       setError("Description is required.");
//       return;
//     }

//     const payload = {
//       title: form.title.trim(),
//       description: form.description.trim(),
//       image_url:
//         form.image_url.trim() || null,
//       button_text:
//         form.button_text.trim() || "Read More",
//       button_link:
//         form.button_link.trim() || "/about-college",
//       is_active: Number(form.is_active),
//       display_order:
//         Number(form.display_order) || 0,
//     };

//     try {
//       setSaving(true);

//       const url = editingId
//         ? `${API_URL}/admin/${editingId}`
//         : `${API_URL}/admin`;

//       const response = await fetch(url, {
//         method: editingId ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to save About College."
//         );
//       }

//       setSuccess(
//         editingId
//           ? "About College updated successfully."
//           : "About College added successfully."
//       );

//       resetForm();

//       await refreshAboutCollege();
//     } catch (err) {
//       console.error("Save error:", err);

//       setError(
//         err.message ||
//           "Failed to save About College."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // DELETE
//   // =========================================================

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this About College content?"
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setError("");
//       setSuccess("");

//       const response = await fetch(
//         `${API_URL}/admin/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to delete About College."
//         );
//       }

//       setSuccess(
//         "About College deleted successfully."
//       );

//       if (editingId === id) {
//         resetForm();
//       }

//       await refreshAboutCollege();
//     } catch (err) {
//       console.error("Delete error:", err);

//       setError(
//         err.message ||
//           "Failed to delete About College."
//       );
//     }
//   };

//   // =========================================================
//   // TOGGLE ACTIVE
//   // =========================================================

//   const handleToggleActive = async (item) => {
//     try {
//       setError("");
//       setSuccess("");

//       const payload = {
//         title: item.title,
//         description: item.description,
//         image_url: item.image_url || null,
//         button_text:
//           item.button_text || "Read More",
//         button_link:
//           item.button_link || "/about-college",
//         is_active:
//           Number(item.is_active) === 1 ? 0 : 1,
//         display_order:
//           Number(item.display_order) || 0,
//       };

//       const response = await fetch(
//         `${API_URL}/admin/${item.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to update status."
//         );
//       }

//       setSuccess(
//         Number(item.is_active) === 1
//           ? "About College section hidden."
//           : "About College section activated."
//       );

//       await refreshAboutCollege();
//     } catch (err) {
//       console.error("Toggle error:", err);

//       setError(
//         err.message ||
//           "Failed to update status."
//       );
//     }
//   };

//   // =========================================================
//   // MOVE ORDER
//   // =========================================================

//   const moveItem = async (item, direction) => {
//     const sortedItems = [...items].sort(
//       (a, b) =>
//         Number(a.display_order) -
//         Number(b.display_order)
//     );

//     const currentIndex = sortedItems.findIndex(
//       (x) => x.id === item.id
//     );

//     if (currentIndex === -1) {
//       return;
//     }

//     const targetIndex =
//       direction === "up"
//         ? currentIndex - 1
//         : currentIndex + 1;

//     if (
//       targetIndex < 0 ||
//       targetIndex >= sortedItems.length
//     ) {
//       return;
//     }

//     const targetItem = sortedItems[targetIndex];

//     try {
//       setError("");
//       setSuccess("");

//       const updateItem = async (
//         id,
//         source,
//         order
//       ) => {
//         const response = await fetch(
//           `${API_URL}/admin/${id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               title: source.title,
//               description: source.description,
//               image_url:
//                 source.image_url || null,
//               button_text:
//                 source.button_text ||
//                 "Read More",
//               button_link:
//                 source.button_link ||
//                 "/about-college",
//               is_active:
//                 Number(source.is_active),
//               display_order: Number(order),
//             }),
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(
//             data.message ||
//               "Failed to update order."
//           );
//         }
//       };

//       await updateItem(
//         item.id,
//         item,
//         targetItem.display_order
//       );

//       await updateItem(
//         targetItem.id,
//         targetItem,
//         item.display_order
//       );

//       await refreshAboutCollege();
//     } catch (err) {
//       console.error("Move error:", err);

//       setError(
//         err.message ||
//           "Failed to change display order."
//       );
//     }
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <div className="min-h-[400px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 mx-auto mb-4 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />

//           <p className="text-sm text-slate-500">
//             Loading About College...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // PAGE
//   // =========================================================

//   return (
//     <div className="space-y-6">

//       {/* HEADER */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//         <div className="flex items-center gap-3">

//           <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
//             <ImageIcon size={22} />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               About College
//             </h1>

//             <p className="text-sm text-slate-500 mt-1">
//               Manage About College content displayed on the homepage.
//             </p>
//           </div>

//         </div>

//         <button
//           type="button"
//           onClick={handleAdd}
//           className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
//         >
//           <Plus size={18} />
//           Add About College
//         </button>

//       </div>

//       {/* SUCCESS */}

//       {success && (
//         <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
//           <span>{success}</span>

//           <button
//             type="button"
//             onClick={() => setSuccess("")}
//             className="p-1 rounded hover:bg-green-100"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* ERROR */}

//       {error && (
//         <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() => setError("")}
//             className="p-1 rounded hover:bg-red-100"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* FORM */}

//       {showForm && (
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

//           <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">

//             <div>
//               <h2 className="text-lg font-semibold text-slate-900">
//                 {editingId
//                   ? "Edit About College"
//                   : "Add About College"}
//               </h2>

//               <p className="text-xs text-slate-500 mt-1">
//                 Enter the homepage About College information.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={resetForm}
//               className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
//             >
//               <X size={20} />
//             </button>

//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="p-6 space-y-5"
//           >

//             {/* TITLE */}

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Title
//                 <span className="text-red-500 ml-1">
//                   *
//                 </span>
//               </label>

//               <input
//                 type="text"
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="About Our College"
//                 className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* DESCRIPTION */}

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Description
//                 <span className="text-red-500 ml-1">
//                   *
//                 </span>
//               </label>

//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 rows={8}
//                 placeholder="Enter About College description..."
//                 className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             {/* IMAGE */}

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Image URL
//               </label>

//               <input
//                 type="text"
//                 name="image_url"
//                 value={form.image_url}
//                 onChange={handleChange}
//                 placeholder="/uploads/about-college.jpg"
//                 className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />

//               {form.image_url && (
//                 <div className="mt-3">
//                   <img
//                     src={form.image_url}
//                     alt="About College Preview"
//                     className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200"
//                     onError={(e) => {
//                       e.currentTarget.style.display =
//                         "none";
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* BUTTON */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                   Button Text
//                 </label>

//                 <input
//                   type="text"
//                   name="button_text"
//                   value={form.button_text}
//                   onChange={handleChange}
//                   placeholder="Read More"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                   Button Link
//                 </label>

//                 <input
//                   type="text"
//                   name="button_link"
//                   value={form.button_link}
//                   onChange={handleChange}
//                   placeholder="/about-college"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//             </div>

//             {/* STATUS / ORDER */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                   Display Order
//                 </label>

//                 <input
//                   type="number"
//                   name="display_order"
//                   value={form.display_order}
//                   onChange={handleChange}
//                   min="0"
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                   Status
//                 </label>

//                 <select
//                   name="is_active"
//                   value={form.is_active}
//                   onChange={handleChange}
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value={1}>
//                     Active
//                   </option>

//                   <option value={0}>
//                     Inactive
//                   </option>
//                 </select>
//               </div>

//             </div>

//             {/* ACTIONS */}

//             <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">

//               <button
//                 type="button"
//                 onClick={resetForm}
//                 disabled={saving}
//                 className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium"
//               >
//                 <Save size={17} />

//                 {saving
//                   ? "Saving..."
//                   : editingId
//                   ? "Update About College"
//                   : "Save About College"}
//               </button>

//             </div>

//           </form>
//         </div>
//       )}

//       {/* EMPTY */}

//       {items.length === 0 && !showForm && (
//         <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">

//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
//             <ImageIcon size={28} />
//           </div>

//           <h2 className="text-lg font-semibold text-slate-800">
//             No About College Content
//           </h2>

//           <p className="text-sm text-slate-500 mt-2 mb-5">
//             Add content to display the About College section on your homepage.
//           </p>

//           <button
//             type="button"
//             onClick={handleAdd}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
//           >
//             <Plus size={18} />
//             Add About College
//           </button>

//         </div>
//       )}

//       {/* LIST */}

//       {items.length > 0 && (
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

//           <div className="px-6 py-4 border-b border-slate-200">
//             <h2 className="font-semibold text-slate-900">
//               About College Content
//             </h2>

//             <p className="text-xs text-slate-500 mt-1">
//               {items.length}{" "}
//               {items.length === 1
//                 ? "record"
//                 : "records"}
//             </p>
//           </div>

//           <div className="divide-y divide-slate-100">

//             {[...items]
//               .sort(
//                 (a, b) =>
//                   Number(a.display_order) -
//                   Number(b.display_order)
//               )
//               .map((item, index, sortedItems) => (

//                 <div
//                   key={item.id}
//                   className="p-5 hover:bg-slate-50 transition"
//                 >

//                   <div className="flex flex-col xl:flex-row gap-5">

//                     {/* IMAGE */}

//                     <div className="w-full xl:w-44 shrink-0">

//                       {item.image_url ? (
//                         <img
//                           src={item.image_url}
//                           alt={item.title}
//                           className="w-full h-28 object-cover rounded-lg border border-slate-200"
//                         />
//                       ) : (
//                         <div className="w-full h-28 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
//                           <ImageIcon size={28} />
//                         </div>
//                       )}

//                     </div>

//                     {/* CONTENT */}

//                     <div className="flex-1 min-w-0">

//                       <div className="flex flex-wrap items-center gap-2 mb-2">

//                         <h3 className="text-base font-semibold text-slate-900">
//                           {item.title}
//                         </h3>

//                         {Number(item.is_active) ===
//                         1 ? (
//                           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
//                             <Eye size={12} />
//                             Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
//                             <EyeOff size={12} />
//                             Inactive
//                           </span>
//                         )}

//                       </div>

//                       <p className="text-sm text-slate-600 leading-6 line-clamp-3">
//                         {item.description}
//                       </p>

//                       <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">

//                         <span>
//                           Order:{" "}
//                           <strong className="text-slate-600">
//                             {item.display_order}
//                           </strong>
//                         </span>

//                         {item.button_text && (
//                           <span>
//                             Button:{" "}
//                             <strong className="text-slate-600">
//                               {item.button_text}
//                             </strong>
//                           </span>
//                         )}

//                         {item.button_link && (
//                           <span>
//                             Link:{" "}
//                             <strong className="text-slate-600">
//                               {item.button_link}
//                             </strong>
//                           </span>
//                         )}

//                       </div>

//                     </div>

//                     {/* ACTIONS */}

//                     <div className="flex flex-wrap xl:flex-col items-center xl:items-end gap-2">

//                       <div className="flex gap-1">

//                         <button
//                           type="button"
//                           onClick={() =>
//                             moveItem(item, "up")
//                           }
//                           disabled={index === 0}
//                           title="Move Up"
//                           className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
//                         >
//                           <ArrowUp size={16} />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             moveItem(item, "down")
//                           }
//                           disabled={
//                             index ===
//                             sortedItems.length - 1
//                           }
//                           title="Move Down"
//                           className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
//                         >
//                           <ArrowDown size={16} />
//                         </button>

//                       </div>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleEdit(item)
//                         }
//                         className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium"
//                       >
//                         <Pencil size={15} />
//                         Edit
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleToggleActive(item)
//                         }
//                         className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
//                           Number(item.is_active) ===
//                           1
//                             ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
//                             : "bg-green-50 text-green-700 hover:bg-green-100"
//                         }`}
//                       >
//                         {Number(item.is_active) ===
//                         1 ? (
//                           <>
//                             <EyeOff size={15} />
//                             Hide
//                           </>
//                         ) : (
//                           <>
//                             <Eye size={15} />
//                             Activate
//                           </>
//                         )}
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleDelete(item.id)
//                         }
//                         className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
//                       >
//                         <Trash2 size={15} />
//                         Delete
//                       </button>

//                     </div>

//                   </div>

//                 </div>
//               ))}

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AboutCollege;



import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/about-college";
const API_BASE = "http://localhost:5000";

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  button_text: "Read More",
  button_link: "/about-college",
  is_active: 1,
  display_order: 0,
};

const AboutCollege = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    return `${API_BASE}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadAboutCollege = async () => {
      try {
        const response = await fetch(`${API_URL}/admin`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch About College (${response.status})`
          );
        }

        const data = await response.json();

        console.log("About College API:", data);

        if (!cancelled) {
          setItems(Array.isArray(data.data) ? data.data : []);
          setError("");
        }
      } catch (err) {
        console.error("Failed to fetch About College:", err);

        if (!cancelled) {
          setError(
            err.message || "Failed to load About College content."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAboutCollege();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // REFRESH
  // =========================================================

  const refreshAboutCollege = async () => {
    try {
      const response = await fetch(`${API_URL}/admin`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch About College (${response.status})`
        );
      }

      const data = await response.json();

      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Refresh error:", err);

      setError(
        err.message || "Failed to refresh About College."
      );
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // BROWSE IMAGE
  // =========================================================

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // -------------------------------------------------------
    // VALIDATE TYPE
    // -------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, JPEG, PNG, or WEBP image."
      );

      e.target.value = "";
      return;
    }

    // -------------------------------------------------------
    // VALIDATE SIZE
    // -------------------------------------------------------

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");

      e.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);

    // Remove previous object URL
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreview = URL.createObjectURL(file);

    setPreviewUrl(localPreview);
  };

  // =========================================================
  // REMOVE SELECTED IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setForm((prev) => ({
      ...prev,
      image_url: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = () => {
    setError("");
    setSuccess("");

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setForm({
      ...emptyForm,
      display_order: items.length + 1,
    });

    setSelectedFile(null);
    setPreviewUrl("");
    setEditingId(null);
    setShowForm(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (item) => {
    setError("");
    setSuccess("");

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);

    setForm({
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url || "",
      button_text: item.button_text || "Read More",
      button_link:
        item.button_link || "/about-college",
      is_active:
        Number(item.is_active) === 1 ? 1 : 0,
      display_order:
        Number(item.display_order) || 0,
    });

    setPreviewUrl(
      item.image_url
        ? getImageUrl(item.image_url)
        : ""
    );

    setEditingId(item.id);
    setShowForm(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------------
      // FORM DATA
      // -----------------------------------------------------

      const body = new FormData();

      body.append(
        "title",
        form.title.trim()
      );

      body.append(
        "description",
        form.description.trim()
      );

      body.append(
        "button_text",
        form.button_text.trim() || "Read More"
      );

      body.append(
        "button_link",
        form.button_link.trim() || "/about-college"
      );

      body.append(
        "is_active",
        String(Number(form.is_active))
      );

      body.append(
        "display_order",
        String(Number(form.display_order) || 0)
      );

      // -----------------------------------------------------
      // EXISTING IMAGE
      // -----------------------------------------------------

      if (form.image_url) {
        body.append(
          "existing_image",
          form.image_url
        );
      }

      // -----------------------------------------------------
      // NEW IMAGE
      // -----------------------------------------------------

      if (selectedFile) {
        body.append(
          "file",
          selectedFile
        );
      }

      // -----------------------------------------------------
      // URL
      // -----------------------------------------------------

      const url = editingId
        ? `${API_URL}/admin/${editingId}`
        : `${API_URL}/admin`;

      // -----------------------------------------------------
      // REQUEST
      // -----------------------------------------------------

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body,
      });

      const data = await response
        .json()
        .catch(() => ({}));

      console.log(
        "About College save response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to save About College."
        );
      }

      setSuccess(
        editingId
          ? "About College updated successfully."
          : "About College added successfully."
      );

      resetForm();

      await refreshAboutCollege();
    } catch (err) {
      console.error("Save error:", err);

      setError(
        err.message ||
          "Failed to save About College."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this About College content?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/admin/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete About College."
        );
      }

      setSuccess(
        "About College deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await refreshAboutCollege();
    } catch (err) {
      console.error("Delete error:", err);

      setError(
        err.message ||
          "Failed to delete About College."
      );
    }
  };

  // =========================================================
  // TOGGLE ACTIVE
  // =========================================================

  const handleToggleActive = async (item) => {
    try {
      setError("");
      setSuccess("");

      const body = new FormData();

      body.append(
        "title",
        item.title || ""
      );

      body.append(
        "description",
        item.description || ""
      );

      body.append(
        "button_text",
        item.button_text || "Read More"
      );

      body.append(
        "button_link",
        item.button_link || "/about-college"
      );

      body.append(
        "is_active",
        Number(item.is_active) === 1
          ? "0"
          : "1"
      );

      body.append(
        "display_order",
        String(
          Number(item.display_order) || 0
        )
      );

      if (item.image_url) {
        body.append(
          "existing_image",
          item.image_url
        );
      }

      const response = await fetch(
        `${API_URL}/admin/${item.id}`,
        {
          method: "PUT",
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status."
        );
      }

      setSuccess(
        Number(item.is_active) === 1
          ? "About College section hidden."
          : "About College section activated."
      );

      await refreshAboutCollege();
    } catch (err) {
      console.error("Toggle error:", err);

      setError(
        err.message ||
          "Failed to update status."
      );
    }
  };

  // =========================================================
  // MOVE ORDER
  // =========================================================

  const moveItem = async (item, direction) => {
    const sortedItems = [...items].sort(
      (a, b) =>
        Number(a.display_order) -
        Number(b.display_order)
    );

    const currentIndex = sortedItems.findIndex(
      (x) => x.id === item.id
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= sortedItems.length
    ) {
      return;
    }

    const targetItem =
      sortedItems[targetIndex];

    try {
      setError("");
      setSuccess("");

      const updateItem = async (
        id,
        source,
        order
      ) => {
        const body = new FormData();

        body.append(
          "title",
          source.title || ""
        );

        body.append(
          "description",
          source.description || ""
        );

        body.append(
          "button_text",
          source.button_text || "Read More"
        );

        body.append(
          "button_link",
          source.button_link || "/about-college"
        );

        body.append(
          "is_active",
          String(
            Number(source.is_active) === 1
              ? 1
              : 0
          )
        );

        body.append(
          "display_order",
          String(Number(order))
        );

        if (source.image_url) {
          body.append(
            "existing_image",
            source.image_url
          );
        }

        const response = await fetch(
          `${API_URL}/admin/${id}`,
          {
            method: "PUT",
            body,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update order."
          );
        }
      };

      await updateItem(
        item.id,
        item,
        targetItem.display_order
      );

      await updateItem(
        targetItem.id,
        targetItem,
        item.display_order
      );

      setSuccess(
        "Display order updated successfully."
      );

      await refreshAboutCollege();
    } catch (err) {
      console.error("Move error:", err);

      setError(
        err.message ||
          "Failed to change display order."
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />

          <p className="text-sm text-slate-500">
            Loading About College...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ImageIcon size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              About College
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage About College content displayed on the homepage.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} />
          Add About College
        </button>

      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="p-1 rounded hover:bg-green-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="p-1 rounded hover:bg-red-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          {/* FORM HEADER */}

          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId
                  ? "Edit About College"
                  : "Add About College"}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Enter the homepage About College information.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
          >

            {/* =================================================
                TITLE
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Title
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="About Our College"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={8}
                placeholder="Enter About College description..."
                className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm outline-none resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* =================================================
                IMAGE UPLOAD
            ================================================= */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                College Image
              </label>

              {/* HIDDEN FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* UPLOAD AREA */}

              <div className="flex flex-col md:flex-row gap-4">

                {/* PREVIEW */}

                <div className="w-full md:w-64">

                  {previewUrl ? (
                    <div className="relative">

                      <img
                        src={previewUrl}
                        alt="About College Preview"
                        className="w-full h-40 object-cover rounded-xl border border-slate-200 bg-slate-100"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>

                    </div>
                  ) : (
                    <div className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400">

                      <ImageIcon size={32} />

                      <span className="text-xs mt-2">
                        No image selected
                      </span>

                    </div>
                  )}

                </div>

                {/* BROWSE */}

                <div className="flex-1">

                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f3262] hover:bg-[#0b2850] text-white rounded-lg text-sm font-medium transition shadow-sm"
                  >
                    <Upload size={17} />
                    Browse Image
                  </button>

                  <p className="mt-3 text-xs text-slate-500">
                    Select an image from your computer.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Supported: JPG, JPEG, PNG, WEBP
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Maximum size: 10 MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">

                      <p className="text-xs font-medium text-blue-800">
                        Selected image
                      </p>

                      <p className="text-xs text-blue-600 mt-1 break-all">
                        {selectedFile.name}
                      </p>

                      <p className="text-[11px] text-blue-500 mt-1">
                        {(
                          selectedFile.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                BUTTON
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Button Text
                </label>

                <input
                  type="text"
                  name="button_text"
                  value={form.button_text}
                  onChange={handleChange}
                  placeholder="Read More"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Button Link
                </label>

                <input
                  type="text"
                  name="button_link"
                  value={form.button_link}
                  onChange={handleChange}
                  placeholder="/about-college"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

            </div>

            {/* =================================================
                STATUS / ORDER
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium"
              >
                <Save size={17} />

                {saving
                  ? "Uploading..."
                  : editingId
                  ? "Update About College"
                  : "Save About College"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {items.length === 0 && !showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <ImageIcon size={28} />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            No About College Content
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-5">
            Add content to display the About College section on your homepage.
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={18} />
            Add About College
          </button>

        </div>
      )}

      {/* =====================================================
          LIST
      ===================================================== */}

      {items.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="px-6 py-4 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              About College Content
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {items.length}{" "}
              {items.length === 1
                ? "record"
                : "records"}
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            {[...items]
              .sort(
                (a, b) =>
                  Number(a.display_order) -
                  Number(b.display_order)
              )
              .map(
                (
                  item,
                  index,
                  sortedItems
                ) => (

                  <div
                    key={item.id}
                    className="p-5 hover:bg-slate-50 transition"
                  >

                    <div className="flex flex-col xl:flex-row gap-5">

                      {/* IMAGE */}

                      <div className="w-full xl:w-44 shrink-0">

                        {item.image_url ? (
                          <img
                            src={getImageUrl(
                              item.image_url
                            )}
                            alt={item.title}
                            className="w-full h-28 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-28 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon size={28} />
                          </div>
                        )}

                      </div>

                      {/* CONTENT */}

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-2 mb-2">

                          <h3 className="text-base font-semibold text-slate-900">
                            {item.title}
                          </h3>

                          {Number(
                            item.is_active
                          ) === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                              <Eye size={12} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                              <EyeOff size={12} />
                              Inactive
                            </span>
                          )}

                        </div>

                        <p className="text-sm text-slate-600 leading-6 line-clamp-3">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">

                          <span>
                            Order:{" "}
                            <strong className="text-slate-600">
                              {item.display_order}
                            </strong>
                          </span>

                          {item.button_text && (
                            <span>
                              Button:{" "}
                              <strong className="text-slate-600">
                                {item.button_text}
                              </strong>
                            </span>
                          )}

                          {item.button_link && (
                            <span>
                              Link:{" "}
                              <strong className="text-slate-600">
                                {item.button_link}
                              </strong>
                            </span>
                          )}

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap xl:flex-col items-center xl:items-end gap-2">

                        <div className="flex gap-1">

                          <button
                            type="button"
                            onClick={() =>
                              moveItem(
                                item,
                                "up"
                              )
                            }
                            disabled={
                              index === 0
                            }
                            title="Move Up"
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveItem(
                                item,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                              sortedItems.length -
                                1
                            }
                            title="Move Down"
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown size={16} />
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-medium"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(
                              item
                            )
                          }
                          className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                            Number(
                              item.is_active
                            ) === 1
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {Number(
                            item.is_active
                          ) === 1 ? (
                            <>
                              <EyeOff
                                size={15}
                              />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye
                                size={15}
                              />
                              Activate
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AboutCollege;

