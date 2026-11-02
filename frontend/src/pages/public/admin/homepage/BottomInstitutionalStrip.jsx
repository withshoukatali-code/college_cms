
// import { useEffect, useRef, useState } from "react";
// import {
//   Save,
//   Upload,
//   FileText,
//   ExternalLink,
//   Trash2,
//   RefreshCw,
//   CheckCircle2,
//   AlertCircle,
//   Power,
// } from "lucide-react";

// const API_BASE =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// const API_URL =
//   `${API_BASE}/bottom-institutional-strip`;

// const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

// const emptyForm = {
//   established: "",
//   ugc_recognized: "",
//   aishe_code: "",
//   ugc_2f_12b: "",
//   iso_certified: "",
//   is_active: 1,
// };

// const getFileUrl = (value) => {
//   if (!value) return "";

//   if (
//     value.startsWith("http://") ||
//     value.startsWith("https://") ||
//     value.startsWith("blob:") ||
//     value.startsWith("data:")
//   ) {
//     return value;
//   }

//   if (value.startsWith("/")) {
//     return `${SERVER_BASE}${value}`;
//   }

//   return `${SERVER_BASE}/${value}`;
// };

// const getFileName = (value) => {
//   if (!value) return "";

//   try {
//     return decodeURIComponent(
//       value.split("/").pop()
//     );
//   } catch {
//     return value.split("/").pop();
//   }
// };

// const BottomInstitutional = () => {
//   const [form, setForm] = useState(emptyForm);

//   const [recordId, setRecordId] = useState(null);

//   const [certificate, setCertificate] =
//     useState("");

//   const [certificateFile, setCertificateFile] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   const [removingCertificate, setRemovingCertificate] =
//     useState(false);

//   const [message, setMessage] =
//     useState("");

//   const [error, setError] =
//     useState("");

//   const fileInputRef = useRef(null);

//   /*
//   |--------------------------------------------------------------------------
//   | LOAD
//   |--------------------------------------------------------------------------
//   */

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/all?_=${Date.now()}`,
//         {
//           method: "GET",
//           cache: "no-store",
//           headers: {
//             Accept: "application/json",
//           },
//         }
//       );

//       const result = await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to load institutional strip."
//         );
//       }

//       const item =
//         Array.isArray(result.data) &&
//         result.data.length
//           ? result.data[0]
//           : null;

//       if (!item) {
//         setRecordId(null);
//         setForm(emptyForm);
//         setCertificate("");
//         return;
//       }

//       setRecordId(item.id);

//       setForm({
//         established:
//           item.established || "",

//         ugc_recognized:
//           item.ugc_recognized || "",

//         aishe_code:
//           item.aishe_code || "",

//         ugc_2f_12b:
//           item.ugc_2f_12b || "",

//         iso_certified:
//           item.iso_certified || "",

//         is_active:
//           Number(item.is_active) === 1
//             ? 1
//             : 0,
//       });

//       setCertificate(
//         item.naac_accreditation_certificate ||
//           ""
//       );

//       setCertificateFile(null);
//     } catch (err) {
//       console.error(
//         "Institutional Strip Load Error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to load institutional strip."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /*
//   |--------------------------------------------------------------------------
//   | CHANGE
//   |--------------------------------------------------------------------------
//   */

//   const handleChange = (event) => {
//     const { name, value } =
//       event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));

//     setMessage("");
//     setError("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | CERTIFICATE SELECT
//   |--------------------------------------------------------------------------
//   */

//   const handleCertificateChange = (
//     event
//   ) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) {
//       setCertificateFile(null);
//       return;
//     }

//     if (
//       file.type !== "application/pdf"
//     ) {
//       setError(
//         "Only PDF files are allowed."
//       );

//       event.target.value = "";
//       setCertificateFile(null);
//       return;
//     }

//     const maxSize =
//       50 * 1024 * 1024;

//     if (file.size > maxSize) {
//       setError(
//         "NAAC Accreditation Certificate must be 50 MB or smaller."
//       );

//       event.target.value = "";
//       setCertificateFile(null);
//       return;
//     }

//     setCertificateFile(file);
//     setMessage("");
//     setError("");
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | SAVE
//   |--------------------------------------------------------------------------
//   */

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       setSaving(true);
//       setMessage("");
//       setError("");

//       const formData =
//         new FormData();

//       formData.append(
//         "established",
//         form.established
//       );

//       formData.append(
//         "ugc_recognized",
//         form.ugc_recognized
//       );

//       formData.append(
//         "aishe_code",
//         form.aishe_code
//       );

//       formData.append(
//         "ugc_2f_12b",
//         form.ugc_2f_12b
//       );

//       formData.append(
//         "iso_certified",
//         form.iso_certified
//       );

//       formData.append(
//         "is_active",
//         String(form.is_active)
//       );

//       if (certificateFile) {
//         formData.append(
//           "naac_accreditation_certificate",
//           certificateFile
//         );
//       }

//       const response =
//         await fetch(API_URL, {
//           method: "POST",
//           body: formData,
//         });

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to save institutional strip."
//         );
//       }

//       setRecordId(
//         result.data?.id || recordId
//       );

//       setCertificate(
//         result.data
//           ?.naac_accreditation_certificate ||
//           certificate
//       );

//       setCertificateFile(null);

//       if (fileInputRef.current) {
//         fileInputRef.current.value =
//           "";
//       }

//       setMessage(
//         result.message ||
//           "Institutional strip saved successfully."
//       );

//       await fetchData();
//     } catch (err) {
//       console.error(
//         "Institutional Strip Save Error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to save institutional strip."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /*
//   |--------------------------------------------------------------------------
//   | REMOVE CERTIFICATE
//   |--------------------------------------------------------------------------
//   */

//   const handleRemoveCertificate =
//     async () => {
//       if (!recordId || !certificate) {
//         return;
//       }

//       const confirmed =
//         window.confirm(
//           "Remove the NAAC Accreditation Certificate?"
//         );

//       if (!confirmed) {
//         return;
//       }

//       try {
//         setRemovingCertificate(true);
//         setMessage("");
//         setError("");

//         const response =
//           await fetch(
//             `${API_URL}/${recordId}/certificate`,
//             {
//               method: "DELETE",
//             }
//           );

//         const result =
//           await response.json();

//         if (
//           !response.ok ||
//           !result.success
//         ) {
//           throw new Error(
//             result.message ||
//               "Failed to remove certificate."
//           );
//         }

//         setCertificate("");

//         setMessage(
//           result.message ||
//             "NAAC Accreditation Certificate removed."
//         );
//       } catch (err) {
//         console.error(
//           "Certificate Remove Error:",
//           err
//         );

//         setError(
//           err.message ||
//             "Failed to remove certificate."
//         );
//       } finally {
//         setRemovingCertificate(false);
//       }
//     };

//   /*
//   |--------------------------------------------------------------------------
//   | LOADING
//   |--------------------------------------------------------------------------
//   */

//   if (loading) {
//     return (
//       <div className="flex min-h-[420px] items-center justify-center">
//         <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
//           <RefreshCw
//             size={18}
//             className="animate-spin text-[#0f3262]"
//           />
//           Loading Institutional Strip...
//         </div>
//       </div>
//     );
//   }

//   /*
//   |--------------------------------------------------------------------------
//   | UI
//   |--------------------------------------------------------------------------
//   */

//   return (
//     <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">
//       {/* HEADER */}

//       <div
//         className="
//           overflow-hidden
//           rounded-2xl
//           border
//           border-slate-200
//           bg-white
//           shadow-sm
//         "
//       >
//         <div
//           className="
//             border-b
//             border-slate-200
//             bg-gradient-to-r
//             from-[#0f3262]
//             to-[#123f78]
//             px-5
//             py-5
//             text-white
//             sm:px-7
//           "
//         >
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">
//                 Public Website
//               </p>

//               <h1 className="mt-1 text-xl font-bold sm:text-2xl">
//                 Bottom Institutional Strip
//               </h1>

//               <p className="mt-1 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">
//                 Manage the institutional credentials
//                 displayed above the public footer.
//               </p>
//             </div>

//             <div
//               className={`
//                 inline-flex
//                 shrink-0
//                 items-center
//                 gap-1.5
//                 rounded-full
//                 px-3
//                 py-1.5
//                 text-[10px]
//                 font-bold
//                 ${
//                   Number(form.is_active) === 1
//                     ? "bg-emerald-400/15 text-emerald-100"
//                     : "bg-white/10 text-blue-100"
//                 }
//               `}
//             >
//               <span
//                 className={`
//                   h-1.5
//                   w-1.5
//                   rounded-full
//                   ${
//                     Number(form.is_active) === 1
//                       ? "bg-emerald-300"
//                       : "bg-slate-300"
//                   }
//                 `}
//               />

//               {Number(form.is_active) === 1
//                 ? "Active"
//                 : "Inactive"}
//             </div>
//           </div>
//         </div>

//         {/* FORM */}

//         <form
//           onSubmit={handleSubmit}
//           className="p-5 sm:p-7"
//         >
//           {/* MESSAGES */}

//           {message && (
//             <div
//               className="
//                 mb-5
//                 flex
//                 items-start
//                 gap-3
//                 rounded-xl
//                 border
//                 border-emerald-200
//                 bg-emerald-50
//                 px-4
//                 py-3
//                 text-sm
//                 text-emerald-700
//               "
//             >
//               <CheckCircle2
//                 size={18}
//                 className="mt-0.5 shrink-0"
//               />
//               <span>{message}</span>
//             </div>
//           )}

//           {error && (
//             <div
//               className="
//                 mb-5
//                 flex
//                 items-start
//                 gap-3
//                 rounded-xl
//                 border
//                 border-red-200
//                 bg-red-50
//                 px-4
//                 py-3
//                 text-sm
//                 text-red-700
//               "
//             >
//               <AlertCircle
//                 size={18}
//                 className="mt-0.5 shrink-0"
//               />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* INSTITUTIONAL INFORMATION */}

//           <div>
//             <div className="mb-4">
//               <h2 className="text-sm font-bold text-slate-800">
//                 Institutional Information
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 These values appear in the public
//                 institutional strip.
//               </p>
//             </div>

//             <div className="grid gap-5 sm:grid-cols-2">
//               {/* ESTABLISHED */}

//               <Field
//                 label="Established"
//                 name="established"
//                 value={form.established}
//                 onChange={handleChange}
//                 placeholder="e.g. 1962"
//               />

//               {/* UGC */}

//               <Field
//                 label="UGC Recognized"
//                 name="ugc_recognized"
//                 value={form.ugc_recognized}
//                 onChange={handleChange}
//                 placeholder="e.g. UGC Recognized"
//               />

//               {/* AISHE */}

//               <Field
//                 label="AISHE Code"
//                 name="aishe_code"
//                 value={form.aishe_code}
//                 onChange={handleChange}
//                 placeholder="e.g. C-00000"
//               />

//               {/* 2F / 12B */}

//               <Field
//                 label="2(f) / 12(B)"
//                 name="ugc_2f_12b"
//                 value={form.ugc_2f_12b}
//                 onChange={handleChange}
//                 placeholder="e.g. UGC Recognition"
//               />

//               {/* ISO */}

//               <Field
//                 label="ISO Certified"
//                 name="iso_certified"
//                 value={form.iso_certified}
//                 onChange={handleChange}
//                 placeholder="e.g. Quality Certified"
//               />
//             </div>
//           </div>

//           {/* CERTIFICATE */}

//           <div className="mt-8 border-t border-slate-200 pt-7">
//             <div className="mb-4">
//               <h2 className="text-sm font-bold text-slate-800">
//                 NAAC Accreditation Certificate
//               </h2>

//               <p className="mt-1 text-xs leading-5 text-slate-500">
//                 Upload the official NAAC Accreditation
//                 Certificate as a PDF. It will be
//                 available from the public institutional
//                 strip.
//               </p>
//             </div>

//             <div
//               className="
//                 rounded-2xl
//                 border
//                 border-dashed
//                 border-slate-300
//                 bg-slate-50
//                 p-5
//               "
//             >
//               {certificate ? (
//                 <div
//                   className="
//                     flex
//                     flex-col
//                     gap-4
//                     sm:flex-row
//                     sm:items-center
//                     sm:justify-between
//                   "
//                 >
//                   <div className="flex min-w-0 items-center gap-3">
//                     <div
//                       className="
//                         flex
//                         h-11
//                         w-11
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-xl
//                         bg-red-50
//                         text-red-600
//                       "
//                     >
//                       <FileText size={20} />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-slate-800">
//                         NAAC Accreditation Certificate
//                       </p>

//                       <p className="mt-1 truncate text-xs text-slate-500">
//                         {getFileName(
//                           certificate
//                         )}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <a
//                       href={getFileUrl(
//                         certificate
//                       )}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="
//                         inline-flex
//                         items-center
//                         gap-2
//                         rounded-lg
//                         border
//                         border-slate-200
//                         bg-white
//                         px-3
//                         py-2
//                         text-xs
//                         font-semibold
//                         text-[#0f3262]
//                         transition
//                         hover:border-[#0f3262]
//                       "
//                     >
//                       <ExternalLink
//                         size={14}
//                       />
//                       View PDF
//                     </a>

//                     <button
//                       type="button"
//                       onClick={
//                         handleRemoveCertificate
//                       }
//                       disabled={
//                         removingCertificate
//                       }
//                       className="
//                         inline-flex
//                         items-center
//                         gap-2
//                         rounded-lg
//                         border
//                         border-red-200
//                         bg-white
//                         px-3
//                         py-2
//                         text-xs
//                         font-semibold
//                         text-red-600
//                         transition
//                         hover:bg-red-50
//                         disabled:cursor-not-allowed
//                         disabled:opacity-50
//                       "
//                     >
//                       <Trash2
//                         size={14}
//                       />

//                       {removingCertificate
//                         ? "Removing..."
//                         : "Remove"}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <div
//                     className="
//                       mx-auto
//                       flex
//                       h-12
//                       w-12
//                       items-center
//                       justify-center
//                       rounded-xl
//                       bg-blue-50
//                       text-[#0f3262]
//                     "
//                   >
//                     <Upload size={21} />
//                   </div>

//                   <p className="mt-3 text-sm font-semibold text-slate-700">
//                     Upload NAAC Accreditation Certificate
//                   </p>

//                   <p className="mt-1 text-xs text-slate-400">
//                     PDF only · Maximum 50 MB
//                   </p>
//                 </div>
//               )}

//               <div className="mt-4">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="application/pdf,.pdf"
//                   onChange={
//                     handleCertificateChange
//                   }
//                   className="
//                     block
//                     w-full
//                     cursor-pointer
//                     rounded-lg
//                     border
//                     border-slate-200
//                     bg-white
//                     text-xs
//                     text-slate-600
//                     file:mr-3
//                     file:border-0
//                     file:bg-[#0f3262]
//                     file:px-4
//                     file:py-2.5
//                     file:text-xs
//                     file:font-semibold
//                     file:text-white
//                     hover:file:bg-[#123f78]
//                   "
//                 />
//               </div>

//               {certificateFile && (
//                 <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
//                   <CheckCircle2
//                     size={14}
//                   />

//                   New file selected:
//                   <span className="truncate">
//                     {certificateFile.name}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* STATUS */}

//           <div className="mt-8 border-t border-slate-200 pt-7">
//             <div className="flex items-center justify-between gap-5">
//               <div>
//                 <h2 className="text-sm font-bold text-slate-800">
//                   Public Display
//                 </h2>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Turn the complete institutional strip
//                   on or off.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setForm((current) => ({
//                     ...current,
//                     is_active:
//                       Number(
//                         current.is_active
//                       ) === 1
//                         ? 0
//                         : 1,
//                   }))
//                 }
//                 className={`
//                   inline-flex
//                   items-center
//                   gap-2
//                   rounded-full
//                   px-4
//                   py-2
//                   text-xs
//                   font-bold
//                   transition
//                   ${
//                     Number(form.is_active) === 1
//                       ? "bg-emerald-50 text-emerald-700"
//                       : "bg-slate-100 text-slate-500"
//                   }
//                 `}
//               >
//                 <Power size={14} />

//                 {Number(form.is_active) === 1
//                   ? "Active"
//                   : "Inactive"}
//               </button>
//             </div>
//           </div>

//           {/* SAVE */}

//           <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
//             <button
//               type="submit"
//               disabled={saving}
//               className="
//                 inline-flex
//                 items-center
//                 gap-2
//                 rounded-xl
//                 bg-[#0f3262]
//                 px-5
//                 py-3
//                 text-sm
//                 font-bold
//                 text-white
//                 shadow-sm
//                 transition
//                 hover:bg-[#123f78]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-60
//               "
//             >
//               {saving ? (
//                 <>
//                   <RefreshCw
//                     size={16}
//                     className="animate-spin"
//                   />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   Save Institutional Strip
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* PUBLIC PREVIEW */}

//       <div
//         className="
//           overflow-hidden
//           rounded-2xl
//           border
//           border-slate-200
//           bg-white
//           shadow-sm
//         "
//       >
//         <div className="border-b border-slate-200 px-5 py-4">
//           <h2 className="text-sm font-bold text-slate-800">
//             Public Strip Preview
//           </h2>

//           <p className="mt-1 text-xs text-slate-500">
//             The public website displays only the
//             configured values.
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <div className="min-w-[720px] bg-[#f7f9fc]">
//             <div className="grid grid-cols-6 divide-x divide-[#dfe5ed]">
//               <PreviewItem
//                 label="Established"
//                 value={form.established}
//               />

//               <PreviewItem
//                 label="UGC Recognized"
//                 value={form.ugc_recognized}
//               />

//               <PreviewItem
//                 label="AISHE Code"
//                 value={form.aishe_code}
//               />

//               <PreviewItem
//                 label="2(f) / 12(B)"
//                 value={form.ugc_2f_12b}
//               />

//               <PreviewItem
//                 label="ISO Certified"
//                 value={form.iso_certified}
//               />

//               <PreviewItem
//                 label="NAAC Accreditation"
//                 value={
//                   certificate
//                     ? "Certificate ↗"
//                     : "Not Uploaded"
//                 }
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /*
// |--------------------------------------------------------------------------
// | FIELD
// |--------------------------------------------------------------------------
// */

// const Field = ({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
// }) => {
//   return (
//     <div>
//       <label
//         htmlFor={name}
//         className="mb-2 block text-xs font-bold text-slate-700"
//       >
//         {label}
//       </label>

//       <input
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="
//           w-full
//           rounded-xl
//           border
//           border-slate-200
//           bg-white
//           px-4
//           py-3
//           text-sm
//           text-slate-800
//           outline-none
//           transition
//           placeholder:text-slate-300
//           focus:border-[#0f3262]
//           focus:ring-2
//           focus:ring-[#0f3262]/10
//         "
//       />
//     </div>
//   );
// };

// /*
// |--------------------------------------------------------------------------
// | PREVIEW ITEM
// |--------------------------------------------------------------------------
// */

// const PreviewItem = ({
//   label,
//   value,
// }) => {
//   return (
//     <div className="min-h-[76px] px-3 py-4 text-center">
//       <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#0f3262]">
//         {label}
//       </div>

//       <div className="mt-1 text-xs font-bold text-slate-700">
//         {value?.trim()
//           ? value
//           : "Not configured"}
//       </div>
//     </div>
//   );
// };

// export default BottomInstitutional;



import React, { useEffect, useRef, useState } from "react";
import {
    Plus,
    Save,
    Upload,
    FileText,
    ExternalLink,
    Trash2,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Power,
    ChevronUp,
    ChevronDown,
    Pencil,
    X,
} from "lucide-react";

const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const API_URL =
    `${API_BASE}/bottom-institutional-strip`;

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

const emptyItem = {
    field_name: "",
    field_value: "",
    display_order: 0,
    is_active: 1,
};

const getFileUrl = (value) => {
    if (!value) return "";

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("blob:") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return `${SERVER_BASE}${value}`;
    }

    return `${SERVER_BASE}/${value}`;
};

const getFileName = (value) => {
    if (!value) return "";

    try {
        return decodeURIComponent(value.split("/").pop());
    } catch {
        return value.split("/").pop();
    }
};

const BottomInstitutional = () => {
    const [items, setItems] = useState([]);

    const [certificate, setCertificate] = useState("");
    const [certificateFile, setCertificateFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [removingId, setRemovingId] = useState(null);
    const [removingCertificate, setRemovingCertificate] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [newItem, setNewItem] = useState(emptyItem);

    const [globalActive, setGlobalActive] = useState(1);

    const certificateInputRef = useRef(null);

    // --------------------------------------------------------------------------
    // LOAD DATA
    // --------------------------------------------------------------------------

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/all?_=${Date.now()}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to load institutional strip."
                );
            }

            const data = Array.isArray(result.data)
                ? result.data
                : [];

            setItems(
                data.map((item, index) => ({
                    ...item,
                    display_order:
                        Number(item.display_order) || index,
                    is_active:
                        Number(item.is_active) === 1 ? 1 : 0,
                }))
            );

            // Determine overall status from records
            if (data.length > 0) {
                setGlobalActive(
                    data.some(
                        (item) =>
                            Number(item.is_active) === 1
                    )
                        ? 1
                        : 0
                );
            }

            // Certificate may exist on the returned record
            const certificateRecord = data.find(
                (item) =>
                    item.naac_accreditation_certificate
            );

            if (certificateRecord) {
                setCertificate(
                    certificateRecord.naac_accreditation_certificate ||
                        ""
                );
            } else {
                setCertificate("");
            }

            setCertificateFile(null);
        } catch (err) {
            console.error(
                "Institutional Strip Load Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to load institutional strip."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --------------------------------------------------------------------------
    // ADD ITEM
    // --------------------------------------------------------------------------

    const handleAddItem = async () => {
        if (!newItem.field_name.trim()) {
            setError("Please enter a field name.");
            return;
        }

        if (!newItem.field_value.trim()) {
            setError("Please enter a field value.");
            return;
        }

        try {
            setAdding(true);
            setMessage("");
            setError("");

            const payload = {
                field_name: newItem.field_name.trim(),
                field_value: newItem.field_value.trim(),
                display_order: items.length,
                is_active: Number(newItem.is_active),
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to add institutional item."
                );
            }

            setNewItem({
                ...emptyItem,
                display_order: items.length + 1,
            });

            setMessage(
                result.message ||
                    "Institutional item added successfully."
            );

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Item Add Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to add institutional item."
            );
        } finally {
            setAdding(false);
        }
    };

    // --------------------------------------------------------------------------
    // UPDATE ITEM
    // --------------------------------------------------------------------------

    const handleEditChange = (id, field, value) => {
        setItems((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );

        setMessage("");
        setError("");
    };

    const handleSaveItem = async (item) => {
        if (!item.field_name?.trim()) {
            setError("Field name cannot be empty.");
            return;
        }

        if (!item.field_value?.trim()) {
            setError("Field value cannot be empty.");
            return;
        }

        try {
            setEditingId(item.id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/${item.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        field_name:
                            item.field_name.trim(),
                        field_value:
                            item.field_value.trim(),
                        display_order:
                            Number(item.display_order) || 0,
                        is_active:
                            Number(item.is_active) === 1
                                ? 1
                                : 0,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to update item."
                );
            }

            setMessage(
                result.message ||
                    "Institutional item updated successfully."
            );

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Item Update Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to update institutional item."
            );
        } finally {
            setEditingId(null);
        }
    };

    // --------------------------------------------------------------------------
    // DELETE ITEM
    // --------------------------------------------------------------------------

    const handleDeleteItem = async (item) => {
        const confirmed = window.confirm(
            `Delete "${item.field_name}"?`
        );

        if (!confirmed) return;

        try {
            setRemovingId(item.id);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/${item.id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to delete item."
                );
            }

            setMessage(
                result.message ||
                    "Institutional item deleted successfully."
            );

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Item Delete Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to delete institutional item."
            );
        } finally {
            setRemovingId(null);
        }
    };

    // --------------------------------------------------------------------------
    // TOGGLE ITEM
    // --------------------------------------------------------------------------

    const handleToggleItem = async (item) => {
        try {
            setMessage("");
            setError("");

            const newStatus =
                Number(item.is_active) === 1 ? 0 : 1;

            const response = await fetch(
                `${API_URL}/${item.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        field_name: item.field_name,
                        field_value: item.field_value,
                        display_order:
                            Number(item.display_order) || 0,
                        is_active: newStatus,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to change item status."
                );
            }

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Item Status Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to change item status."
            );
        }
    };

    // --------------------------------------------------------------------------
    // MOVE ITEM
    // --------------------------------------------------------------------------

    const handleMove = async (item, direction) => {
        const sortedItems = [...items].sort(
            (a, b) =>
                Number(a.display_order) -
                Number(b.display_order)
        );

        const currentIndex = sortedItems.findIndex(
            (entry) => entry.id === item.id
        );

        const targetIndex =
            direction === "up"
                ? currentIndex - 1
                : currentIndex + 1;

        if (
            currentIndex < 0 ||
            targetIndex < 0 ||
            targetIndex >= sortedItems.length
        ) {
            return;
        }

        const target = sortedItems[targetIndex];

        try {
            setMessage("");
            setError("");

            // Swap display orders
            const firstOrder =
                Number(item.display_order) || currentIndex;

            const secondOrder =
                Number(target.display_order) ||
                targetIndex;

            const firstResponse = await fetch(
                `${API_URL}/reorder/${item.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        display_order: secondOrder,
                    }),
                }
            );

            const firstResult =
                await firstResponse.json();

            if (
                !firstResponse.ok ||
                !firstResult.success
            ) {
                throw new Error(
                    firstResult.message ||
                        "Failed to reorder item."
                );
            }

            const secondResponse = await fetch(
                `${API_URL}/reorder/${target.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        display_order: firstOrder,
                    }),
                }
            );

            const secondResult =
                await secondResponse.json();

            if (
                !secondResponse.ok ||
                !secondResult.success
            ) {
                throw new Error(
                    secondResult.message ||
                        "Failed to reorder item."
                );
            }

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Item Reorder Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to reorder item."
            );
        }
    };

    // --------------------------------------------------------------------------
    // GLOBAL STATUS
    // --------------------------------------------------------------------------

    const handleGlobalStatus = async () => {
        const newStatus =
            Number(globalActive) === 1 ? 0 : 1;

        try {
            setMessage("");
            setError("");

            const activeItems = items;

            for (const item of activeItems) {
                await fetch(`${API_URL}/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        field_name: item.field_name,
                        field_value: item.field_value,
                        display_order:
                            Number(item.display_order) || 0,
                        is_active: newStatus,
                    }),
                });
            }

            setGlobalActive(newStatus);

            setMessage(
                newStatus === 1
                    ? "Institutional strip activated."
                    : "Institutional strip deactivated."
            );

            await fetchData();
        } catch (err) {
            console.error(
                "Institutional Strip Status Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to change strip status."
            );
        }
    };

    // --------------------------------------------------------------------------
    // CERTIFICATE SELECT
    // --------------------------------------------------------------------------

    const handleCertificateChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            setCertificateFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            event.target.value = "";
            setCertificateFile(null);
            return;
        }

        const maxSize = 50 * 1024 * 1024;

        if (file.size > maxSize) {
            setError(
                "NAAC Accreditation Certificate must be 50 MB or smaller."
            );
            event.target.value = "";
            setCertificateFile(null);
            return;
        }

        setCertificateFile(file);
        setMessage("");
        setError("");
    };

    // --------------------------------------------------------------------------
    // CERTIFICATE UPLOAD
    // --------------------------------------------------------------------------

    const handleCertificateUpload = async () => {
        if (!certificateFile) {
            setError(
                "Please select a PDF certificate first."
            );
            return;
        }

        /*
         * Certificate upload requires an existing record.
         * We use the first item because the certificate
         * belongs to the institutional strip itself.
         */
        const record = items[0];

        if (!record?.id) {
            setError(
                "Please add at least one institutional item before uploading the certificate."
            );
            return;
        }

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const formData = new FormData();

            formData.append(
                "naac_accreditation_certificate",
                certificateFile
            );

            const response = await fetch(
                `${API_URL}/${record.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to upload certificate."
                );
            }

            setCertificate(
                result.data
                    ?.naac_accreditation_certificate ||
                    certificate
            );

            setCertificateFile(null);

            if (certificateInputRef.current) {
                certificateInputRef.current.value = "";
            }

            setMessage(
                result.message ||
                    "NAAC Accreditation Certificate uploaded successfully."
            );

            await fetchData();
        } catch (err) {
            console.error(
                "Certificate Upload Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to upload certificate."
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------------------------------
    // REMOVE CERTIFICATE
    // --------------------------------------------------------------------------

    const handleRemoveCertificate = async () => {
        if (!certificate) return;

        const record = items[0];

        if (!record?.id) return;

        const confirmed = window.confirm(
            "Remove the NAAC Accreditation Certificate?"
        );

        if (!confirmed) return;

        try {
            setRemovingCertificate(true);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/${record.id}/certificate`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Failed to remove certificate."
                );
            }

            setCertificate("");

            setMessage(
                result.message ||
                    "NAAC Accreditation Certificate removed."
            );
        } catch (err) {
            console.error(
                "Certificate Remove Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to remove certificate."
            );
        } finally {
            setRemovingCertificate(false);
        }
    };

    // --------------------------------------------------------------------------
    // LOADING
    // --------------------------------------------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-[420px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <RefreshCw
                        size={18}
                        className="animate-spin text-[#0f3262]"
                    />
                    Loading Institutional Strip...
                </div>
            </div>
        );
    }

    // --------------------------------------------------------------------------
    // UI
    // --------------------------------------------------------------------------

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6">

            {/* ================================================================
                HEADER
            ================================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="bg-gradient-to-r from-[#0f3262] to-[#123f78] px-5 py-6 text-white sm:px-7">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                                Public Website
                            </p>

                            <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                                Bottom Institutional Strip
                            </h1>

                            <p className="mt-1 max-w-2xl text-xs leading-5 text-blue-100 sm:text-sm">
                                Add and manage institutional
                                information displayed above
                                the public footer.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleGlobalStatus}
                            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                                Number(globalActive) === 1
                                    ? "bg-emerald-400/15 text-emerald-100"
                                    : "bg-white/10 text-blue-100"
                            }`}
                        >
                            <Power size={14} />

                            {Number(globalActive) === 1
                                ? "Strip Active"
                                : "Strip Inactive"}
                        </button>

                    </div>

                </div>

                {/* ============================================================
                    MESSAGES
                ============================================================= */}

                <div className="p-5 sm:p-7">

                    {message && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <span>{error}</span>
                        </div>
                    )}

                    {/* ========================================================
                        ADD NEW ITEM
                    ========================================================= */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Add Institutional Information
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Create any field you want
                                    to display in the public
                                    strip.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 shadow-sm">
                                <Plus size={14} />
                                New Item
                            </div>

                        </div>

                        <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_auto]">

                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700">
                                    Field Name
                                </label>

                                <input
                                    type="text"
                                    value={newItem.field_name}
                                    onChange={(e) =>
                                        setNewItem(
                                            (current) => ({
                                                ...current,
                                                field_name:
                                                    e.target.value,
                                            })
                                        )
                                    }
                                    placeholder="e.g. NAAC Grade"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700">
                                    Field Value
                                </label>

                                <input
                                    type="text"
                                    value={newItem.field_value}
                                    onChange={(e) =>
                                        setNewItem(
                                            (current) => ({
                                                ...current,
                                                field_value:
                                                    e.target.value,
                                            })
                                        )
                                    }
                                    placeholder="e.g. A+"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                                />
                            </div>

                            <div className="flex items-end">

                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={adding}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123f78] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                                >
                                    {adding ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Add Item
                                        </>
                                    )}
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ========================================================
                        CURRENT ITEMS
                    ========================================================= */}

                    <div className="mt-8">

                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <h2 className="text-sm font-bold text-slate-800">
                                    Institutional Information
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage the fields currently
                                    displayed on the public
                                    institutional strip.
                                </p>
                            </div>

                            <div className="text-xs font-semibold text-slate-400">
                                {items.length}{" "}
                                {items.length === 1
                                    ? "item"
                                    : "items"}
                            </div>

                        </div>

                        {items.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                                    <FileText size={21} />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-700">
                                    No institutional information
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add your first item above.
                                </p>

                            </div>
                        ) : (
                            <div className="space-y-3">

                                {[...items]
                                    .sort(
                                        (a, b) =>
                                            Number(
                                                a.display_order
                                            ) -
                                            Number(
                                                b.display_order
                                            )
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                                        >

                                            <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto]">

                                                {/* FIELD NAME */}

                                                <div>
                                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Field Name
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            item.field_name ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                item.id,
                                                                "field_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                                                    />
                                                </div>

                                                {/* FIELD VALUE */}

                                                <div>
                                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Field Value
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            item.field_value ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                item.id,
                                                                "field_value",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                                                    />
                                                </div>

                                                {/* ACTIONS */}

                                                <div className="flex items-end gap-2">

                                                    <button
                                                        type="button"
                                                        title="Move Up"
                                                        disabled={
                                                            index === 0
                                                        }
                                                        onClick={() =>
                                                            handleMove(
                                                                item,
                                                                "up"
                                                            )
                                                        }
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#0f3262] hover:text-[#0f3262] disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ChevronUp
                                                            size={17}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Move Down"
                                                        disabled={
                                                            index ===
                                                            items.length -
                                                                1
                                                        }
                                                        onClick={() =>
                                                            handleMove(
                                                                item,
                                                                "down"
                                                            )
                                                        }
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#0f3262] hover:text-[#0f3262] disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ChevronDown
                                                            size={17}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title={
                                                            Number(
                                                                item.is_active
                                                            ) === 1
                                                                ? "Hide"
                                                                : "Show"
                                                        }
                                                        onClick={() =>
                                                            handleToggleItem(
                                                                item
                                                            )
                                                        }
                                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition ${
                                                            Number(
                                                                item.is_active
                                                            ) === 1
                                                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                        }`}
                                                    >
                                                        <Power
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Save"
                                                        onClick={() =>
                                                            handleSaveItem(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            editingId ===
                                                            item.id
                                                        }
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f3262] text-white transition hover:bg-[#123f78] disabled:opacity-50"
                                                    >
                                                        {editingId ===
                                                        item.id ? (
                                                            <RefreshCw
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Save
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            removingId ===
                                                            item.id
                                                        }
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {removingId ===
                                                        item.id ? (
                                                            <RefreshCw
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>

                                                </div>

                                            </div>

                                            {/* ITEM STATUS */}

                                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">

                                                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                    Display Order:{" "}
                                                    {index + 1}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleItem(
                                                            item
                                                        )
                                                    }
                                                    className={`text-[10px] font-bold uppercase tracking-wider ${
                                                        Number(
                                                            item.is_active
                                                        ) === 1
                                                            ? "text-emerald-600"
                                                            : "text-slate-400"
                                                    }`}
                                                >
                                                    {Number(
                                                        item.is_active
                                                    ) === 1
                                                        ? "Visible on Website"
                                                        : "Hidden from Website"}
                                                </button>

                                            </div>

                                        </div>
                                    ))}

                            </div>
                        )}

                    </div>

                    {/* ========================================================
                        CERTIFICATE
                    ========================================================= */}

                    <div className="mt-8 border-t border-slate-200 pt-7">

                        <div className="mb-4">

                            <h2 className="text-sm font-bold text-slate-800">
                                NAAC Accreditation Certificate
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Upload the official NAAC
                                Accreditation Certificate as
                                a PDF. The certificate can be
                                opened from the public
                                institutional strip.
                            </p>

                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">

                            {certificate ? (
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="flex min-w-0 items-center gap-3">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                            <FileText size={20} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-sm font-semibold text-slate-800">
                                                NAAC Accreditation
                                                Certificate
                                            </p>

                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                {getFileName(
                                                    certificate
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex flex-wrap gap-2">

                                        <a
                                            href={getFileUrl(
                                                certificate
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0f3262] transition hover:border-[#0f3262]"
                                        >
                                            <ExternalLink
                                                size={14}
                                            />
                                            View PDF
                                        </a>

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveCertificate
                                            }
                                            disabled={
                                                removingCertificate
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2
                                                size={14}
                                            />

                                            {removingCertificate
                                                ? "Removing..."
                                                : "Remove"}
                                        </button>

                                    </div>

                                </div>
                            ) : (
                                <div className="text-center">

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                                        <Upload size={21} />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-slate-700">
                                        Upload NAAC Accreditation
                                        Certificate
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        PDF only · Maximum 50 MB
                                    </p>

                                </div>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                                <input
                                    ref={certificateInputRef}
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={
                                        handleCertificateChange
                                    }
                                    className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-xs text-slate-600 file:mr-3 file:border-0 file:bg-[#0f3262] file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#123f78]"
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleCertificateUpload
                                    }
                                    disabled={
                                        saving ||
                                        !certificateFile
                                    }
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0f3262] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#123f78] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw
                                                size={15}
                                                className="animate-spin"
                                            />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={15} />
                                            Upload Certificate
                                        </>
                                    )}
                                </button>

                            </div>

                            {certificateFile && (
                                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
                                    <CheckCircle2 size={14} />

                                    New file selected:

                                    <span className="truncate">
                                        {certificateFile.name}
                                    </span>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================================
                PUBLIC PREVIEW
            ================================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-5 py-4">

                    <h2 className="text-sm font-bold text-slate-800">
                        Public Strip Preview
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        This preview automatically reflects
                        the fields configured above.
                    </p>

                </div>

                <div className="overflow-x-auto">

                    <div className="min-w-[720px] bg-[#DCE6F2]">

                        {items.filter(
                            (item) =>
                                Number(item.is_active) === 1
                        ).length === 0 ? (
                            <div className="px-6 py-8 text-center text-xs text-slate-500">
                                No active institutional
                                information is currently
                                configured.
                            </div>
                        ) : (
                            <div className="flex min-h-[48px] items-center justify-center">

                                {items
                                    .filter(
                                        (item) =>
                                            Number(
                                                item.is_active
                                            ) === 1
                                    )
                                    .sort(
                                        (a, b) =>
                                            Number(
                                                a.display_order
                                            ) -
                                            Number(
                                                b.display_order
                                            )
                                    )
                                    .map(
                                        (
                                            item,
                                            index,
                                            activeItems
                                        ) => (
                                            <React.Fragment
                                                key={
                                                    item.id
                                                }
                                            >

                                                <div className="flex items-center whitespace-nowrap px-5 py-2">

                                                    <span className="text-[11px] font-semibold text-[#24496F]">
                                                        {
                                                            item.field_name
                                                        }
                                                    </span>

                                                    <span className="ml-2 text-[11px] font-bold text-[#0F3262]">
                                                        {
                                                            item.field_value
                                                        }
                                                    </span>

                                                </div>

                                                {index !==
                                                    activeItems.length -
                                                        1 && (
                                                    <div className="h-5 w-px shrink-0 bg-[#A8BCD2]" />
                                                )}

                                            </React.Fragment>
                                        )
                                    )}

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BottomInstitutional;