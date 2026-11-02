// import { useEffect, useState } from "react";
// import {
//   Image as ImageIcon,
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
//   Eye,
//   EyeOff,
//   ExternalLink,
// } from "lucide-react";

// const API = "http://localhost:5000/api/hero-slider";

// const emptyForm = {
//   title: "",
//   subtitle: "",
//   description: "",
//   image_url: "",
//   button_text: "",
//   button_link: "",
//   display_order: 0,
//   is_active: true,
// };

// function getImageUrl(path) {
//   if (!path) return "";

//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return path;
//   }

//   return `http://localhost:5000${
//     path.startsWith("/") ? "" : "/"
//   }${path}`;
// }

// function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [form, setForm] = useState(emptyForm);

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // =====================================================
//   // FETCH ALL SLIDES
//   // =====================================================

//   const fetchSlides = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API}/all?_=${Date.now()}`,
//         {
//           cache: "no-store",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch slides: ${response.status}`
//         );
//       }

//       const result = await response.json();

//       console.log("ADMIN HERO SLIDER API:", result);

//       if (
//         result.success &&
//         Array.isArray(result.data)
//       ) {
//         setSlides(result.data);
//       } else {
//         setSlides([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setError(
//         err.message ||
//           "Failed to fetch hero slider data."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSlides();
//   }, []);

//   // =====================================================
//   // FORM CHANGE
//   // =====================================================

//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//       type,
//       checked,
//     } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     }));
//   };

//   // =====================================================
//   // RESET
//   // =====================================================

//   const resetForm = () => {
//     setForm({
//       ...emptyForm,
//     });

//     setEditingId(null);
//     setError("");
//   };

//   // =====================================================
//   // SUBMIT
//   // =====================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!form.title.trim()) {
//       setError(
//         "Hero slide title is required."
//       );
//       return;
//     }

//     if (!form.image_url.trim()) {
//       setError(
//         "Hero slide image URL is required."
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const method = editingId
//         ? "PUT"
//         : "POST";

//       const url = editingId
//         ? `${API}/${editingId}`
//         : API;

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type":
//             "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           title: form.title.trim(),
//           subtitle:
//             form.subtitle.trim(),
//           description:
//             form.description.trim(),
//           image_url:
//             form.image_url.trim(),
//           button_text:
//             form.button_text.trim(),
//           button_link:
//             form.button_link.trim(),
//           display_order:
//             Number(form.display_order) || 0,
//           is_active:
//             Boolean(form.is_active),
//         }),
//       });

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to save hero slide."
//         );
//       }

//       setSuccess(
//         editingId
//           ? "Hero slide updated successfully."
//           : "Hero slide added successfully."
//       );

//       resetForm();

//       await fetchSlides();
//     } catch (err) {
//       console.error(err);

//       setError(
//         err.message ||
//           "Failed to save hero slide."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================================
//   // EDIT
//   // =====================================================

//   const handleEdit = (slide) => {
//     setEditingId(slide.id);

//     setForm({
//       title: slide.title || "",
//       subtitle:
//         slide.subtitle || "",
//       description:
//         slide.description || "",
//       image_url:
//         slide.image_url || "",
//       button_text:
//         slide.button_text || "",
//       button_link:
//         slide.button_link || "",
//       display_order:
//         slide.display_order ?? 0,
//       is_active:
//         Boolean(slide.is_active),
//     });

//     setError("");
//     setSuccess("");

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =====================================================
//   // DELETE
//   // =====================================================

//   const handleDelete = async (id) => {
//     const confirmed =
//       window.confirm(
//         "Are you sure you want to delete this hero slide?"
//       );

//     if (!confirmed) return;

//     try {
//       setError("");
//       setSuccess("");

//       const response =
//         await fetch(`${API}/${id}`, {
//           method: "DELETE",
//           headers: {
//             Accept:
//               "application/json",
//           },
//         });

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to delete hero slide."
//         );
//       }

//       setSuccess(
//         "Hero slide deleted successfully."
//       );

//       await fetchSlides();
//     } catch (err) {
//       console.error(err);

//       setError(
//         err.message ||
//           "Failed to delete hero slide."
//       );
//     }
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="mx-auto max-w-7xl">

//       {/* =================================================
//           PAGE HEADER
//       ================================================= */}

//       <div className="mb-8">

//         <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//           Homepage Management
//         </p>

//         <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
//           Hero Slider
//         </h1>

//         <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//           Create and manage the homepage
//           hero banners displayed on the
//           public website.
//         </p>

//       </div>

//       {/* =================================================
//           ALERTS
//       ================================================= */}

//       {error && (
//         <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
//           <span>{error}</span>

//           <button
//             type="button"
//             onClick={() =>
//               setError("")
//             }
//             className="text-red-400 hover:text-red-600"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {success && (
//         <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
//           {success}
//         </div>
//       )}

//       {/* =================================================
//           FORM
//       ================================================= */}

//       <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//         <div className="flex items-center justify-between">

//           <div className="flex items-center gap-3">

//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
//               <ImageIcon size={21} />
//             </div>

//             <div>

//               <h2 className="text-lg font-bold text-slate-900">
//                 {editingId
//                   ? "Edit Hero Slide"
//                   : "Add Hero Slide"}
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Homepage banner information
//               </p>

//             </div>

//           </div>

//           {editingId && (
//             <button
//               type="button"
//               onClick={resetForm}
//               className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
//             >
//               <X size={19} />
//             </button>
//           )}

//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 space-y-5"
//         >

//           {/* TITLE */}

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Title
//             </label>

//             <input
//               type="text"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               placeholder="Welcome to Our College"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* SUBTITLE */}

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Subtitle
//             </label>

//             <input
//               type="text"
//               name="subtitle"
//               value={form.subtitle}
//               onChange={handleChange}
//               placeholder="Excellence in Education"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* DESCRIPTION */}

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Description
//             </label>

//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Short description for this banner"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           {/* IMAGE */}

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Image URL
//             </label>

//             <input
//               type="text"
//               name="image_url"
//               value={form.image_url}
//               onChange={handleChange}
//               placeholder="/uploads/hero-slider/banner.jpg"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />

//             {form.image_url && (
//               <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

//                 <img
//                   src={getImageUrl(
//                     form.image_url
//                   )}
//                   alt="Hero preview"
//                   className="h-48 w-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.style.display =
//                       "none";
//                   }}
//                 />

//               </div>
//             )}
//           </div>

//           {/* BUTTON */}

//           <div className="grid gap-5 md:grid-cols-2">

//             <div>

//               <label className="text-sm font-semibold text-slate-700">
//                 Button Text
//               </label>

//               <input
//                 type="text"
//                 name="button_text"
//                 value={form.button_text}
//                 onChange={handleChange}
//                 placeholder="Learn More"
//                 className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//             </div>

//             <div>

//               <label className="text-sm font-semibold text-slate-700">
//                 Button Link
//               </label>

//               <input
//                 type="text"
//                 name="button_link"
//                 value={form.button_link}
//                 onChange={handleChange}
//                 placeholder="/about"
//                 className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//             </div>

//           </div>

//           {/* ORDER + ACTIVE */}

//           <div className="grid gap-5 md:grid-cols-2">

//             <div>

//               <label className="text-sm font-semibold text-slate-700">
//                 Display Order
//               </label>

//               <input
//                 type="number"
//                 name="display_order"
//                 value={form.display_order}
//                 onChange={handleChange}
//                 min="0"
//                 className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//               />

//             </div>

//             <div className="flex items-end">

//               <label className="flex cursor-pointer items-center gap-3 pb-3 text-sm font-medium text-slate-700">

//                 <input
//                   type="checkbox"
//                   name="is_active"
//                   checked={form.is_active}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-slate-300"
//                 />

//                 Show on homepage

//               </label>

//             </div>

//           </div>

//           {/* ACTIONS */}

//           <div className="flex gap-3">

//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16457f] disabled:cursor-not-allowed disabled:opacity-50"
//             >

//               {editingId ? (
//                 <Save size={17} />
//               ) : (
//                 <Plus size={17} />
//               )}

//               {saving
//                 ? "Saving..."
//                 : editingId
//                 ? "Update Hero Slide"
//                 : "Add Hero Slide"}

//             </button>

//             {editingId && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//             )}

//           </div>

//         </form>
//       </div>

//       {/* =================================================
//           EXISTING SLIDES
//       ================================================= */}

//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

//           <div>

//             <h2 className="text-lg font-bold text-slate-900">
//               Existing Hero Slides
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               {slides.length} slide
//               {slides.length === 1
//                 ? ""
//                 : "s"}
//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               resetForm();

//               window.scrollTo({
//                 top: 0,
//                 behavior: "smooth",
//               });
//             }}
//             className="hidden items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 sm:inline-flex"
//           >
//             <Plus size={15} />
//             Add Slide
//           </button>

//         </div>

//         {/* LOADING */}

//         {loading ? (
//           <div className="space-y-3 p-6">

//             {[1, 2, 3].map(
//               (item) => (
//                 <div
//                   key={item}
//                   className="h-28 animate-pulse rounded-xl bg-slate-100"
//                 />
//               )
//             )}

//           </div>
//         ) : slides.length === 0 ? (

//           <div className="p-12 text-center">

//             <ImageIcon
//               size={32}
//               className="mx-auto text-slate-300"
//             />

//             <p className="mt-3 text-sm font-medium text-slate-500">
//               No hero slides found.
//             </p>

//             <p className="mt-1 text-xs text-slate-400">
//               Add your first homepage hero slide above.
//             </p>

//           </div>

//         ) : (

//           <div className="divide-y divide-slate-100">

//             {slides.map(
//               (slide) => (
//                 <div
//                   key={slide.id}
//                   className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between"
//                 >

//                   {/* IMAGE + DETAILS */}

//                   <div className="flex min-w-0 gap-4">

//                     <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">

//                       {slide.image_url ? (
//                         <img
//                           src={getImageUrl(
//                             slide.image_url
//                           )}
//                           alt={
//                             slide.title ||
//                             "Hero slide"
//                           }
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full items-center justify-center text-slate-300">
//                           <ImageIcon size={25} />
//                         </div>
//                       )}

//                     </div>

//                     <div className="min-w-0">

//                       <div className="flex flex-wrap items-center gap-2">

//                         <h3 className="font-bold text-slate-900">
//                           {slide.title}
//                         </h3>

//                         {slide.is_active ? (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
//                             <Eye size={11} />
//                             Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
//                             <EyeOff size={11} />
//                             Hidden
//                           </span>
//                         )}

//                       </div>

//                       {slide.subtitle && (
//                         <p className="mt-1 text-sm font-medium text-blue-600">
//                           {slide.subtitle}
//                         </p>
//                       )}

//                       {slide.description && (
//                         <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
//                           {slide.description}
//                         </p>
//                       )}

//                       <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">

//                         <span>
//                           Order:{" "}
//                           {slide.display_order}
//                         </span>

//                         {slide.button_text && (
//                           <span className="text-blue-500">
//                             Button:{" "}
//                             {slide.button_text}
//                           </span>
//                         )}

//                       </div>

//                     </div>

//                   </div>

//                   {/* ACTIONS */}

//                   <div className="flex shrink-0 gap-2">

//                     {slide.button_link && (
//                       <a
//                         href={
//                           slide.button_link
//                         }
//                         target="_blank"
//                         rel="noreferrer"
//                         className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:bg-slate-50 hover:text-blue-600"
//                         title="Open link"
//                       >
//                         <ExternalLink
//                           size={16}
//                         />
//                       </a>
//                     )}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleEdit(
//                           slide
//                         )
//                       }
//                       className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
//                       title="Edit"
//                     >
//                       <Pencil size={16} />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleDelete(
//                           slide.id
//                         )
//                       }
//                       className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
//                       title="Delete"
//                     >
//                       <Trash2 size={16} />
//                     </button>

//                   </div>

//                 </div>
//               )
//             )}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// }

// export default HeroSlider;



import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

const API = "http://localhost:5000/api/hero-slider";
const UPLOAD_API = "http://localhost:5000/api/hero-slider/upload";
const API_BASE = "http://localhost:5000";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  button_text: "",
  button_link: "",
  display_order: 0,
  is_active: true,
};

function getImageUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // =====================================================
  // FETCH SLIDES
  // =====================================================

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/all?_=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch hero slides: ${response.status}`
        );
      }

      const result = await response.json();

      console.log("HERO SLIDER ADMIN API:", result);

      if (
        result.success &&
        Array.isArray(result.data)
      ) {
        setSlides(result.data);
      } else {
        setSlides([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hero slider data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        UPLOAD_API,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      console.log(
        "HERO IMAGE UPLOAD:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to upload image."
        );
      }

      setForm((previous) => ({
        ...previous,
        image_url: result.image_url,
      }));

      setSuccess(
        "Hero image uploaded successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to upload hero image."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Hero slide title is required.");
      return;
    }

    if (!form.image_url.trim()) {
      setError("Please browse and upload a hero image.");
      return;
    }

    try {
      setSaving(true);

      const method = editingId
        ? "PUT"
        : "POST";

      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            subtitle: form.subtitle.trim(),
            description: form.description.trim(),
            image_url: form.image_url.trim(),
            button_text: form.button_text.trim(),
            button_link: form.button_link.trim(),
            display_order:
              Number(form.display_order) || 0,
            is_active:
              Boolean(form.is_active),
          }),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to save hero slide."
        );
      }

      setSuccess(
        editingId
          ? "Hero slide updated successfully."
          : "Hero slide added successfully."
      );

      setForm(emptyForm);
      setEditingId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchSlides();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save hero slide."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (slide) => {
    setEditingId(slide.id);

    setForm({
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      image_url: slide.image_url || "",
      button_text: slide.button_text || "",
      button_link: slide.button_link || "",
      display_order:
        slide.display_order ?? 0,
      is_active:
        Boolean(slide.is_active),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero slide?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete hero slide."
        );
      }

      setSuccess(
        "Hero slide deleted successfully."
      );

      await fetchSlides();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete hero slide."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mx-auto max-w-7xl px-6">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Homepage Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Hero Slider
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage homepage hero banners,
          images, content and call-to-action
          buttons.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
          {success}
        </div>
      )}

      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
              <ImageIcon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingId
                  ? "Edit Hero Slide"
                  : "Add Hero Slide"}
              </h2>

              <p className="text-sm text-slate-500">
                Homepage banner information
              </p>
            </div>

          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* TITLE */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Welcome to Our College"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* SUBTITLE */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Subtitle
            </label>

            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="Excellence in Education"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short description for this banner"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Hero Image
            </label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploading}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:border-blue-300
                  hover:bg-blue-50
                  hover:text-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Upload size={17} />

                {uploading
                  ? "Uploading..."
                  : "Browse Image"}
              </button>

              {form.image_url && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                  <Eye size={15} />
                  Image selected
                </div>
              )}

            </div>

            <p className="mt-2 text-xs text-slate-400">
              JPG, PNG or WebP. Maximum size 5 MB.
            </p>

            {/* IMAGE PREVIEW */}

            {form.image_url && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">

                <img
                  src={getImageUrl(
                    form.image_url
                  )}
                  alt="Hero preview"
                  className="h-56 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

          </div>

          {/* BUTTON */}

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Button Text
              </label>

              <input
                type="text"
                name="button_text"
                value={form.button_text}
                onChange={handleChange}
                placeholder="Learn More"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Button Link
              </label>

              <input
                type="text"
                name="button_link"
                value={form.button_link}
                onChange={handleChange}
                placeholder="/about"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* ORDER + ACTIVE */}

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Display Order
              </label>

              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-end">

              <label className="flex items-center gap-3 pb-3 text-sm font-medium text-slate-700">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                />

                Show on homepage

              </label>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={
                saving ||
                uploading
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#0f3262]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#16457f]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {editingId ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {saving
                ? "Saving..."
                : editingId
                ? "Update Hero Slide"
                : "Add Hero Slide"}

            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* =====================================================
          EXISTING SLIDES
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">
            Existing Hero Slides
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {slides.length} slide
            {slides.length === 1 ? "" : "s"}
          </p>

        </div>

        {loading ? (
          <div className="space-y-3 p-6">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl bg-slate-100"
              />
            ))}

          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center">

            <ImageIcon
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No hero slides found.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {slides.map((slide) => (

              <div
                key={slide.id}
                className="flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between"
              >

                {/* IMAGE + DETAILS */}

                <div className="flex min-w-0 gap-4">

                  <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                    {slide.image_url ? (
                      <img
                        src={getImageUrl(
                          slide.image_url
                        )}
                        alt={
                          slide.title ||
                          "Hero slide"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ImageIcon size={25} />
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-bold text-slate-900">
                        {slide.title}
                      </h3>

                      {slide.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                          <Eye size={11} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                          <EyeOff size={11} />
                          Hidden
                        </span>
                      )}

                    </div>

                    {slide.subtitle && (
                      <p className="mt-1 text-sm text-slate-500">
                        {slide.subtitle}
                      </p>
                    )}

                    <p className="mt-2 text-[11px] text-slate-400">
                      Display order:{" "}
                      {slide.display_order}
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="flex shrink-0 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(slide)
                    }
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(slide.id)
                    }
                    className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default HeroSlider;