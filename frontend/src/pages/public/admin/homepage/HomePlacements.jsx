
// import { useEffect, useRef, useState } from "react";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   BriefcaseBusiness,
//   ExternalLink,
//   Image as ImageIcon,
// } from "lucide-react";

// const API_URL = "http://localhost:5000/api/home-placements";

// const emptyForm = {
//   company_name: "",
//   company_logo: "",
//   highest_package: "",
//   average_package: "",
//   students_placed: "",
//   company_website: "",
//   display_order: 0,
//   is_active: true,
// };

// const HomePartner = () => {
//   const [partners, setPartners] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);

//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const logoInputRef = useRef(null);
//   /*
//   =========================================================
//   FETCH PARTNERS
//   =========================================================
//   */

//   const fetchPartners = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/admin`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch placement partners");
//       }

//       const data = await response.json();

//       setPartners(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Fetch placement partners error:", error);

//       alert("Failed to load placement partners.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPartners();
//   }, []);

//   /*
//   =========================================================
//   HANDLE INPUT
//   =========================================================
//   */

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };


//   const handleLogoFileChange = (event) => {
//     const file = event.target.files?.[0];

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image file.");
//       event.target.value = "";
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       alert("Please select an image smaller than 2 MB.");
//       event.target.value = "";
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       setForm((previous) => ({
//         ...previous,
//         company_logo: reader.result,
//       }));
//     };

//     reader.readAsDataURL(file);
//   };
//   /*  
//   =========================================================
//   OPEN ADD FORM
//   =========================================================
//   */

//   const openAddForm = () => {
//     setEditingId(null);
//     setForm(emptyForm);
//     setShowForm(true);
//   };

//   /*
//   =========================================================
//   OPEN EDIT FORM
//   =========================================================
//   */

//   const openEditForm = (partner) => {
//     setEditingId(partner.id);

//     setForm({
//       company_name: partner.company_name || "",
//       company_logo: partner.company_logo || "",
//       highest_package: partner.highest_package ?? "",
//       average_package: partner.average_package ?? "",
//       students_placed: partner.students_placed ?? "",
//       company_website: partner.company_website || "",
//       display_order: partner.display_order ?? 0,
//       is_active: Boolean(partner.is_active),
//     });

//     setShowForm(true);
//   };

//   /*
//   =========================================================
//   CLOSE FORM
//   =========================================================
//   */

//   const closeForm = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setForm(emptyForm);
//   };

//   /*
//   =========================================================
//   SAVE PARTNER
//   =========================================================
//   */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.company_name.trim()) {
//       alert("Company name is required.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         company_name: form.company_name.trim(),

//         company_logo: form.company_logo.trim() || null,

//         highest_package:
//           form.highest_package === ""
//             ? null
//             : Number(form.highest_package),

//         average_package:
//           form.average_package === ""
//             ? null
//             : Number(form.average_package),

//         students_placed:
//           form.students_placed === ""
//             ? null
//             : Number(form.students_placed),

//         company_website:
//           form.company_website.trim() || null,

//         display_order:
//           Number(form.display_order) || 0,

//         is_active: form.is_active ? 1 : 0,
//       };

//       const url = editingId
//         ? `${API_URL}/admin/${editingId}`
//         : `${API_URL}/admin`;

//       const method = editingId ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to save placement partner"
//         );
//       }

//       closeForm();

//       await fetchPartners();
//     } catch (error) {
//       console.error("Save placement partner error:", error);

//       alert(error.message || "Failed to save placement partner.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   /*
//   =========================================================
//   DELETE PARTNER
//   =========================================================
//   */

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this placement partner?"
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/admin/${id}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to delete placement partner"
//         );
//       }

//       await fetchPartners();
//     } catch (error) {
//       console.error("Delete placement partner error:", error);

//       alert(error.message || "Failed to delete placement partner.");
//     }
//   };

//   /*
//   =========================================================
//   RENDER
//   =========================================================
//   */

//   return (
//     <div className="p-6">

//       {/* =====================================================
//           PAGE HEADER
//       ====================================================== */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//         <div className="flex items-center gap-3">

//           <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
//             <BriefcaseBusiness size={22} />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold text-slate-900">
//               Placement Partners
//             </h1>

//             <p className="text-sm text-slate-500 mt-1">
//               Manage companies associated with college placements.
//             </p>
//           </div>

//         </div>

//         <button
//           type="button"
//           onClick={openAddForm}
//           className="
//             inline-flex
//             items-center
//             justify-center
//             gap-2
//             px-5
//             py-2.5
//             rounded-xl
//             bg-slate-900
//             text-white
//             font-semibold
//             hover:bg-slate-800
//             transition
//           "
//         >
//           <Plus size={18} />
//           Add Placement Partner
//         </button>

//       </div>


//       {/* =====================================================
//           ADD / EDIT FORM
//       ====================================================== */}

//       {showForm && (
//         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">

//           {/* Form Header */}

//           <div className="flex items-center justify-between mb-6">

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 {editingId
//                   ? "Edit Placement Partner"
//                   : "Add Placement Partner"}
//               </h2>

//               <p className="text-sm text-slate-500 mt-1">
//                 Enter company placement information.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={closeForm}
//               className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
//             >
//               <X size={20} />
//             </button>

//           </div>


//           <form onSubmit={handleSubmit}>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               {/* =================================================
//                   COMPANY NAME
//               ================================================== */}

//               <div className="md:col-span-2">

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Company Name *
//                 </label>

//                 <input
//                   type="text"
//                   name="company_name"
//                   value={form.company_name}
//                   onChange={handleChange}
//                   placeholder="e.g. TCS"
//                   required
//                   className="
//                     w-full
//                     px-4
//                     py-3
//                     border
//                     border-slate-300
//                     rounded-xl
//                     outline-none
//                     focus:ring-2
//                     focus:ring-blue-500
//                   "
//                 />

//               </div>


//               {/* =================================================
//                   COMPANY LOGO
//               ================================================== */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Company Logo
//                 </label>

//                 <div className="flex flex-col gap-3 sm:flex-row">
//                   <div className="relative flex-1">
//                     <ImageIcon
//                       size={18}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                     />

//                     <input
//                       type="text"
//                       name="company_logo"
//                       value={form.company_logo}
//                       onChange={handleChange}
//                       placeholder="Paste a logo URL or choose an image"
//                       className="
//           w-full
//           pl-10
//           pr-4
//           py-3
//           border
//           border-slate-300
//           rounded-xl
//           outline-none
//           focus:ring-2
//           focus:ring-blue-500
//         "
//                     />
//                   </div>

//                   <input
//                     ref={logoInputRef}
//                     type="file"
//                     accept="image/png,image/jpeg,image/webp,image/svg+xml"
//                     onChange={handleLogoFileChange}
//                     className="hidden"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => logoInputRef.current?.click()}
//                     className="
//         inline-flex
//         items-center
//         justify-center
//         gap-2
//         rounded-xl
//         border
//         border-slate-300
//         bg-white
//         px-4
//         py-3
//         text-sm
//         font-semibold
//         text-slate-700
//         transition
//         hover:bg-slate-50
//       "
//                   >
//                     <ImageIcon size={18} />
//                     Browse
//                   </button>
//                 </div>

//                 <p className="text-xs text-slate-400 mt-2">
//                   Paste a public image URL or browse for a PNG, JPG, WebP, or SVG logo.
//                 </p>

//                 {form.company_logo && (
//                   <div className="mt-3 flex items-center gap-3">
//                     <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
//                       <img
//                         src={form.company_logo}
//                         alt="Company logo preview"
//                         className="w-full h-full object-contain p-2"
//                         onError={(event) => {
//                           event.currentTarget.style.display = "none";
//                         }}
//                       />
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setForm((previous) => ({
//                           ...previous,
//                           company_logo: "",
//                         }))
//                       }
//                       className="text-sm font-semibold text-red-600 hover:text-red-700"
//                     >
//                       Remove logo
//                     </button>
//                   </div>
//                 )}
//               </div>


//               {/* =================================================
//                   HIGHEST PACKAGE
//               ================================================== */}

//               <div>

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Highest Package (LPA)
//                 </label>

//                 <input
//                   type="number"
//                   name="highest_package"
//                   value={form.highest_package}
//                   onChange={handleChange}
//                   placeholder="e.g. 7.50"
//                   min="0"
//                   step="0.01"
//                   className="
//                     w-full
//                     px-4
//                     py-3
//                     border
//                     border-slate-300
//                     rounded-xl
//                     outline-none
//                     focus:ring-2
//                     focus:ring-blue-500
//                   "
//                 />

//               </div>


//               {/* =================================================
//                   AVERAGE PACKAGE
//               ================================================== */}

//               <div>

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Average Package (LPA)
//                 </label>

//                 <input
//                   type="number"
//                   name="average_package"
//                   value={form.average_package}
//                   onChange={handleChange}
//                   placeholder="e.g. 4.20"
//                   min="0"
//                   step="0.01"
//                   className="
//                     w-full
//                     px-4
//                     py-3
//                     border
//                     border-slate-300
//                     rounded-xl
//                     outline-none
//                     focus:ring-2
//                     focus:ring-blue-500
//                   "
//                 />

//               </div>


//               {/* =================================================
//                   STUDENTS PLACED
//               ================================================== */}

//               <div>

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Students Placed
//                 </label>

//                 <input
//                   type="number"
//                   name="students_placed"
//                   value={form.students_placed}
//                   onChange={handleChange}
//                   placeholder="e.g. 32"
//                   min="0"
//                   step="1"
//                   className="
//                     w-full
//                     px-4
//                     py-3
//                     border
//                     border-slate-300
//                     rounded-xl
//                     outline-none
//                     focus:ring-2
//                     focus:ring-blue-500
//                   "
//                 />

//               </div>


//               {/* =================================================
//                   WEBSITE
//               ================================================== */}

//               <div>

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Company Website
//                 </label>

//                 <div className="relative">

//                   <ExternalLink
//                     size={17}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   />

//                   <input
//                     type="url"
//                     name="company_website"
//                     value={form.company_website}
//                     onChange={handleChange}
//                     placeholder="https://www.example.com"
//                     className="
//                       w-full
//                       pl-10
//                       pr-4
//                       py-3
//                       border
//                       border-slate-300
//                       rounded-xl
//                       outline-none
//                       focus:ring-2
//                       focus:ring-blue-500
//                     "
//                   />

//                 </div>

//               </div>


//               {/* =================================================
//                   DISPLAY ORDER
//               ================================================== */}

//               <div>

//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Display Order
//                 </label>

//                 <input
//                   type="number"
//                   name="display_order"
//                   value={form.display_order}
//                   onChange={handleChange}
//                   min="0"
//                   step="1"
//                   className="
//                     w-full
//                     px-4
//                     py-3
//                     border
//                     border-slate-300
//                     rounded-xl
//                     outline-none
//                     focus:ring-2
//                     focus:ring-blue-500
//                   "
//                 />

//               </div>


//               {/* =================================================
//                   ACTIVE
//               ================================================== */}

//               <div className="flex items-center">

//                 <label className="inline-flex items-center gap-3 cursor-pointer">

//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     checked={form.is_active}
//                     onChange={handleChange}
//                     className="w-4 h-4 rounded"
//                   />

//                   <span className="text-sm font-semibold text-slate-700">
//                     Show on homepage
//                   </span>

//                 </label>

//               </div>

//             </div>


//             {/* =================================================
//                 FORM BUTTONS
//             ================================================== */}

//             <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 className="
//                   px-5
//                   py-2.5
//                   rounded-xl
//                   border
//                   border-slate-300
//                   text-slate-700
//                   font-semibold
//                   hover:bg-slate-50
//                   transition
//                 "
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="
//                   inline-flex
//                   items-center
//                   gap-2
//                   px-5
//                   py-2.5
//                   rounded-xl
//                   bg-slate-900
//                   text-white
//                   font-semibold
//                   hover:bg-slate-800
//                   disabled:opacity-50
//                   transition
//                 "
//               >
//                 <Save size={18} />

//                 {saving
//                   ? "Saving..."
//                   : editingId
//                     ? "Update Partner"
//                     : "Save Partner"}
//               </button>

//             </div>

//           </form>

//         </div>
//       )}


//       {/* =====================================================
//           PARTNERS TABLE
//       ====================================================== */}

//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

//         {loading ? (

//           <div className="p-10 text-center text-slate-500">
//             Loading placement partners...
//           </div>

//         ) : partners.length === 0 ? (

//           <div className="p-10 text-center">

//             <BriefcaseBusiness
//               size={40}
//               className="mx-auto text-slate-300 mb-3"
//             />

//             <p className="text-slate-500">
//               No placement partners found.
//             </p>

//             <button
//               type="button"
//               onClick={openAddForm}
//               className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
//             >
//               Add your first placement partner
//             </button>

//           </div>

//         ) : (

//           <div className="overflow-x-auto">

//             <table className="w-full">

//               <thead className="bg-slate-50 border-b border-slate-200">

//                 <tr>

//                   <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Company
//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Highest
//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Average
//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Students
//                   </th>

//                   <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Status
//                   </th>

//                   <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600">
//                     Actions
//                   </th>

//                 </tr>

//               </thead>

//               <tbody className="divide-y divide-slate-100">

//                 {partners.map((partner) => (

//                   <tr
//                     key={partner.id}
//                     className="hover:bg-slate-50 transition"
//                   >

//                     {/* =================================================
//                         COMPANY
//                     ================================================== */}

//                     <td className="px-5 py-4">

//                       <div className="flex items-center gap-3">

//                         <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">

//                           {partner.company_logo ? (

//                             <img
//                               src={partner.company_logo}
//                               alt={`${partner.company_name} logo`}
//                               className="w-full h-full object-contain p-1.5"
//                             />

//                           ) : (

//                             <BriefcaseBusiness
//                               size={19}
//                               className="text-slate-300"
//                             />

//                           )}

//                         </div>

//                         <div>

//                           <p className="font-semibold text-sm text-slate-900">
//                             {partner.company_name}
//                           </p>

//                           {partner.company_website && (
//                             <a
//                               href={partner.company_website}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-xs text-blue-600 hover:underline"
//                             >
//                               Visit website
//                             </a>
//                           )}

//                         </div>

//                       </div>

//                     </td>


//                     {/* =================================================
//                         HIGHEST
//                     ================================================== */}

//                     <td className="px-5 py-4 text-sm font-semibold text-slate-700">

//                       {partner.highest_package !== null &&
//                         partner.highest_package !== undefined
//                         ? `₹${Number(partner.highest_package).toFixed(2)} LPA`
//                         : "—"}

//                     </td>


//                     {/* =================================================
//                         AVERAGE
//                     ================================================== */}

//                     <td className="px-5 py-4 text-sm text-slate-700">

//                       {partner.average_package !== null &&
//                         partner.average_package !== undefined
//                         ? `₹${Number(partner.average_package).toFixed(2)} LPA`
//                         : "—"}

//                     </td>


//                     {/* =================================================
//                         STUDENTS
//                     ================================================== */}

//                     <td className="px-5 py-4 text-sm font-semibold text-slate-700">

//                       {partner.students_placed !== null &&
//                         partner.students_placed !== undefined
//                         ? partner.students_placed
//                         : "—"}

//                     </td>


//                     {/* =================================================
//                         STATUS
//                     ================================================== */}

//                     <td className="px-5 py-4">

//                       {partner.is_active ? (

//                         <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
//                           Active
//                         </span>

//                       ) : (

//                         <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
//                           Inactive
//                         </span>

//                       )}

//                     </td>


//                     {/* =================================================
//                         ACTIONS
//                     ================================================== */}

//                     <td className="px-5 py-4">

//                       <div className="flex justify-end gap-1.5">

//                         <button
//                           type="button"
//                           onClick={() => openEditForm(partner)}
//                           title="Edit"
//                           className="
//                             p-2
//                             rounded-lg
//                             text-blue-600
//                             hover:bg-blue-50
//                             transition
//                           "
//                         >
//                           <Pencil size={17} />
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => handleDelete(partner.id)}
//                           title="Delete"
//                           className="
//                             p-2
//                             rounded-lg
//                             text-red-600
//                             hover:bg-red-50
//                             transition
//                           "
//                         >
//                           <Trash2 size={17} />
//                         </button>

//                       </div>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//     </div>
//   );
// };

// export default HomePartner;


import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-placements";
const ADMIN_API_URL = `${API_URL}/admin`;

const emptyForm = {
  company_name: "",
  company_logo: "",
  highest_package: "",
  average_package: "",
  students_placed: "",
  company_website: "",
  display_order: 0,
  is_active: true,
};

const logoUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

const readJson = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("The server returned an invalid response.");
  }
};

const HomePartner = () => {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const logoInputRef = useRef(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(ADMIN_API_URL);
      const result = await readJson(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch partners.");
      }

      setPartners(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setPartners([]);
      setError(requestError.message || "Failed to load partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setError("");

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (partner) => {
    setEditingId(partner.id);
    setLogoFile(null);

    setForm({
      company_name: partner.company_name || "",
      company_logo: partner.company_logo || "",
      highest_package: partner.highest_package ?? "",
      average_package: partner.average_package ?? "",
      students_placed: partner.students_placed ?? "",
      company_website: partner.company_website || "",
      display_order: partner.display_order ?? 0,
      is_active: Number(partner.is_active) === 1,
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    resetForm();
    setShowForm(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo image must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    setLogoFile(file);

    setForm((previous) => ({
      ...previous,
      company_logo: URL.createObjectURL(file),
    }));
  };

  const removeLogo = () => {
    setLogoFile(null);

    setForm((previous) => ({
      ...previous,
      company_logo: "",
    }));

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.company_name.trim()) {
      setError("Company name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();

      payload.append("company_name", form.company_name.trim());
      payload.append("highest_package", form.highest_package || "");
      payload.append("average_package", form.average_package || "");
      payload.append("students_placed", form.students_placed || "");
      payload.append("company_website", form.company_website.trim());
      payload.append("display_order", form.display_order || "0");
      payload.append("is_active", form.is_active ? "1" : "0");

      if (logoFile) {
        payload.append("company_logo", logoFile);
      } else {
        payload.append(
          "company_logo_url",
          form.company_logo.startsWith("blob:")
            ? ""
            : form.company_logo.trim()
        );
      }

      if (editingId && !form.company_logo) {
        payload.append("remove_logo", "1");
      }

      const url = editingId
        ? `${ADMIN_API_URL}/${editingId}`
        : ADMIN_API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: payload,
      });

      const result = await readJson(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save partner.");
      }

      closeForm();
      await fetchPartners();
    } catch (requestError) {
      setError(requestError.message || "Failed to save partner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement partner?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${ADMIN_API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await readJson(response);

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete partner.");
      }

      await fetchPartners();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete partner.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Placement Partners
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage companies associated with college placements.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Placement Partner
        </button>
      </div>

      {error && !showForm && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Placement Partner" : "Add Placement Partner"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add the company details and logo.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. TCS"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Logo
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    name="company_logo"
                    value={form.company_logo}
                    onChange={handleChange}
                    placeholder="Paste a public logo URL"
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ImageIcon size={18} />
                    Browse
                  </button>
                </div>

                {form.company_logo && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={logoUrl(form.company_logo)}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeLogo}
                      className="text-sm font-semibold text-red-600"
                    >
                      Remove logo
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Highest Package (LPA)
                </label>
                <input
                  type="number"
                  name="highest_package"
                  value={form.highest_package}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Average Package (LPA)
                </label>
                <input
                  type="number"
                  name="average_package"
                  value={form.average_package}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Students Placed
                </label>
                <input
                  type="number"
                  name="students_placed"
                  value={form.students_placed}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Website
                </label>
                <input
                  type="url"
                  name="company_website"
                  value={form.company_website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-3 pt-7 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                Show on homepage
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
              >
                <Save size={18} />
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Partner"
                    : "Save Partner"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading...</div>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No placement partners found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-600">
                    Company
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-600">
                    Highest
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-600">
                    Average
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-600">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {partner.company_logo ? (
                            <img
                              src={logoUrl(partner.company_logo)}
                              alt={`${partner.company_name} logo`}
                              className="h-full w-full object-contain p-1.5"
                            />
                          ) : (
                            <BriefcaseBusiness
                              size={19}
                              className="text-slate-300"
                            />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {partner.company_name}
                          </p>
                          {partner.company_website && (
                            <a
                              href={partner.company_website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Visit website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {partner.highest_package != null
                        ? `₹${Number(partner.highest_package).toFixed(2)} LPA`
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {partner.average_package != null
                        ? `₹${Number(partner.average_package).toFixed(2)} LPA`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          Number(partner.is_active) === 1
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {Number(partner.is_active) === 1
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(partner)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(partner.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={17} />
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
};

export default HomePartner;