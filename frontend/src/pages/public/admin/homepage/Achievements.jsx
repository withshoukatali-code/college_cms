// import { useEffect, useState } from "react";
// import {
//   Trophy,
//   Plus,
//   Pencil,
//   Trash2,
//   X,
//   Save,
// } from "lucide-react";

// const API = "http://localhost:5000/api/achievements";

// const emptyForm = {
//   title: "",
//   description: "",
//   achievement_type: "Institutional",
//   display_order: 0,
//   is_active: true,
// };

// function Achievements() {
//   const [achievements, setAchievements] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const fetchAchievements = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(`${API}/all`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch achievements");
//       }

//       const result = await response.json();

//       if (result.success) {
//         setAchievements(result.data);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch achievements");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAchievements();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const resetForm = () => {
//     setForm(emptyForm);
//     setEditingId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.title.trim()) {
//       setError("Achievement title is required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const method = editingId ? "PUT" : "POST";

//       const url = editingId
//         ? `${API}/${editingId}`
//         : API;

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...form,
//           display_order: Number(form.display_order) || 0,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to save achievement"
//         );
//       }

//       resetForm();
//       await fetchAchievements();
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to save achievement");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);

//     setForm({
//       title: item.title || "",
//       description: item.description || "",
//       achievement_type:
//         item.achievement_type || "Institutional",
//       display_order: item.display_order || 0,
//       is_active: Boolean(item.is_active),
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this achievement?"
//     );

//     if (!confirmed) return;

//     try {
//       const response = await fetch(`${API}/${id}`, {
//         method: "DELETE",
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to delete achievement"
//         );
//       }

//       await fetchAchievements();
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to delete achievement");
//     }
//   };

//   return (
//     <div className="mx-auto max-w-7xl px-6">

//       {/* Header */}
//       <div className="mb-8">
//         <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//           Homepage Management
//         </p>

//         <h1 className="mt-1 text-3xl font-bold text-slate-900">
//           Achievements
//         </h1>

//         <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//           Manage the achievements displayed in the homepage
//           achievements section.
//         </p>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Form */}
//       <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//         <div className="flex items-center justify-between">

//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
//               <Trophy size={21} />
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">
//                 {editingId
//                   ? "Edit Achievement"
//                   : "Add Achievement"}
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Homepage achievement information
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

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Title
//             </label>

//             <input
//               type="text"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               placeholder="Achievement title"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-semibold text-slate-700">
//               Description
//             </label>

//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Achievement description"
//               className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             />
//           </div>

//           <div className="grid gap-5 md:grid-cols-2">

//             <div>
//               <label className="text-sm font-semibold text-slate-700">
//                 Type
//               </label>

//               <select
//                 name="achievement_type"
//                 value={form.achievement_type}
//                 onChange={handleChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
//               >
//                 <option value="Institutional">
//                   Institutional
//                 </option>

//                 <option value="Student">
//                   Student
//                 </option>

//                 <option value="Academic">
//                   Academic
//                 </option>

//                 <option value="Research">
//                   Research
//                 </option>

//                 <option value="Sports">
//                   Sports
//                 </option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-slate-700">
//                 Display Order
//               </label>

//               <input
//                 type="number"
//                 name="display_order"
//                 value={form.display_order}
//                 onChange={handleChange}
//                 className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
//               />
//             </div>

//           </div>

//           <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
//             <input
//               type="checkbox"
//               name="is_active"
//               checked={form.is_active}
//               onChange={handleChange}
//               className="h-4 w-4"
//             />

//             Show on homepage
//           </label>

//           <div className="flex gap-3">

//             <button
//               type="submit"
//               disabled={saving}
//               className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16457f] disabled:opacity-50"
//             >
//               {editingId ? (
//                 <Save size={17} />
//               ) : (
//                 <Plus size={17} />
//               )}

//               {saving
//                 ? "Saving..."
//                 : editingId
//                 ? "Update Achievement"
//                 : "Add Achievement"}
//             </button>

//             {editingId && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//             )}

//           </div>

//         </form>
//       </div>

//       {/* List */}
//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

//         <div className="border-b border-slate-100 px-6 py-5">
//           <h2 className="text-lg font-bold text-slate-900">
//             Existing Achievements
//           </h2>

//           <p className="mt-1 text-sm text-slate-500">
//             {achievements.length} achievement
//             {achievements.length === 1 ? "" : "s"}
//           </p>
//         </div>

//         {loading ? (
//           <div className="space-y-3 p-6">
//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="h-20 animate-pulse rounded-xl bg-slate-100"
//               />
//             ))}
//           </div>
//         ) : achievements.length === 0 ? (
//           <div className="p-10 text-center text-sm text-slate-400">
//             No achievements found.
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-100">

//             {achievements.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex items-start justify-between gap-5 px-6 py-5"
//               >

//                 <div className="flex min-w-0 gap-4">

//                   <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
//                     <Trophy size={18} />
//                   </div>

//                   <div className="min-w-0">

//                     <div className="flex flex-wrap items-center gap-2">
//                       <h3 className="font-bold text-slate-900">
//                         {item.title}
//                       </h3>

//                       <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
//                         {item.achievement_type}
//                       </span>

//                       {!item.is_active && (
//                         <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
//                           Hidden
//                         </span>
//                       )}
//                     </div>

//                     <p className="mt-1 text-sm leading-6 text-slate-500">
//                       {item.description}
//                     </p>

//                     <p className="mt-2 text-[11px] text-slate-400">
//                       Display order: {item.display_order}
//                     </p>

//                   </div>

//                 </div>

//                 <div className="flex shrink-0 gap-2">

//                   <button
//                     type="button"
//                     onClick={() => handleEdit(item)}
//                     className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
//                   >
//                     <Pencil size={16} />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => handleDelete(item.id)}
//                     className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
//                   >
//                     <Trash2 size={16} />
//                   </button>

//                 </div>

//               </div>
//             ))}

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default Achievements;

//above code working fine 15/09/2026

import { useEffect, useState } from "react";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API = "http://localhost:5000/api/achievements";

const emptyForm = {
  title: "",
  description: "",
  achievement_type: "Institutional",
  display_order: 0,
  is_active: true,
};

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     FETCH ACHIEVEMENTS
  ========================================================= */

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/all`);

      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }

      const result = await response.json();

      console.log("ACHIEVEMENTS API RESPONSE:", result);

      let data = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (
        result?.success &&
        Array.isArray(result.data)
      ) {
        data = result.data;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      }

      data.sort(
        (a, b) =>
          Number(a?.display_order || 0) -
          Number(b?.display_order || 0)
      );

      setAchievements(data);
    } catch (err) {
      console.error("FETCH ACHIEVEMENTS ERROR:", err);
      setError("Failed to fetch achievements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

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
          : value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setError("");
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!form.title.trim()) {
      setError(
        "Achievement title is required."
      );
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

      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim(),

        achievement_type:
          form.achievement_type,

        display_order:
          Number(form.display_order) || 0,

        is_active:
          form.is_active ? 1 : 0,
      };

      console.log(
        "SAVING ACHIEVEMENT:",
        payload
      );

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

      console.log(
        "SAVE ACHIEVEMENT RESPONSE:",
        result
      );

      if (
        !response.ok ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
            "Failed to save achievement."
        );
      }

      /* -----------------------------------------
         SUCCESS MESSAGE
      ----------------------------------------- */

      setMessage(
        editingId
          ? "Achievement updated successfully."
          : "Achievement added successfully."
      );

      /* -----------------------------------------
         RESET FORM
      ----------------------------------------- */

      resetForm();

      /* -----------------------------------------
         REFRESH LIST
      ----------------------------------------- */

      await fetchAchievements();

      /* -----------------------------------------
         CLEAR MESSAGE
      ----------------------------------------- */

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(
        "SAVE ACHIEVEMENT ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to save achievement."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (item) => {
    setMessage("");
    setError("");

    setEditingId(item.id);

    setForm({
      title:
        item.title || "",

      description:
        item.description || "",

      achievement_type:
        item.achievement_type ||
        "Institutional",

      display_order:
        Number(item.display_order) || 0,

      is_active:
        Boolean(
          Number(item.is_active)
        ),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this achievement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      const response =
        await fetch(
          `${API}/${id}`,
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
            "Failed to delete achievement."
        );
      }

      setMessage(
        "Achievement deleted successfully."
      );

      await fetchAchievements();

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(
        "DELETE ACHIEVEMENT ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to delete achievement."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Homepage Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Achievements
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage the achievements displayed
            in the homepage achievements section.
          </p>

        </div>

        {/* NEW BUTTON */}

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16457f]"
          >
            <Plus size={17} />
            New Achievement
          </button>
        )}

      </div>


      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

          <CheckCircle2
            size={18}
            className="shrink-0"
          />

          <span>
            {message}
          </span>

        </div>
      )}


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <AlertCircle
            size={18}
            className="shrink-0"
          />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =====================================================
          FORM
      ===================================================== */}

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* FORM HEADER */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trophy size={21} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {editingId
                  ? "Edit Achievement"
                  : "Add Achievement"}
              </h2>

              <p className="text-sm text-slate-500">
                Homepage achievement information
              </p>

            </div>

          </div>


          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              title="Cancel editing"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          )}

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* TITLE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Title
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Achievement title"
              disabled={saving}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
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
              placeholder="Achievement description"
              disabled={saving}
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />

          </div>


          {/* TYPE + ORDER */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* TYPE */}

            <div>

              <label className="text-sm font-semibold text-slate-700">
                Type
              </label>

              <select
                name="achievement_type"
                value={
                  form.achievement_type
                }
                onChange={handleChange}
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >

                <option value="Institutional">
                  Institutional
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Research">
                  Research
                </option>

                <option value="Sports">
                  Sports
                </option>

              </select>

            </div>


            {/* DISPLAY ORDER */}

            <div>

              <label className="text-sm font-semibold text-slate-700">
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
                disabled={saving}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              <p className="mt-1 text-[11px] text-slate-400">
                Lower numbers appear first.
              </p>

            </div>

          </div>


          {/* ACTIVE */}

          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={saving}
              className="h-4 w-4 rounded border-slate-300"
            />

            <span>
              Show on homepage
            </span>

          </label>


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-3 pt-2">

            <button
              type="submit"
              disabled={
                saving ||
                !form.title.trim()
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16457f] disabled:cursor-not-allowed disabled:opacity-50"
            >

              {saving ? (
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
              ) : editingId ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {saving
                ? "Saving..."
                : editingId
                ? "Update Achievement"
                : "Add Achievement"}

            </button>


            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =====================================================
          EXISTING ACHIEVEMENTS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Existing Achievements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {achievements.length} achievement
              {achievements.length === 1
                ? ""
                : "s"}
            </p>

          </div>

          <button
            type="button"
            onClick={fetchAchievements}
            disabled={loading}
            title="Refresh achievements"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#0f3262] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </button>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="space-y-3 p-6">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              )
            )}

          </div>


        ) : achievements.length === 0 ? (

          /* EMPTY */

          <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Trophy size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No achievements found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add your first achievement using
              the form above.
            </p>

          </div>


        ) : (

          /* LIST */

          <div className="divide-y divide-slate-100">

            {achievements.map(
              (item) => (

                <div
                  key={item.id}
                  className="flex items-start justify-between gap-5 px-6 py-5 transition hover:bg-slate-50/60"
                >

                  {/* CONTENT */}

                  <div className="flex min-w-0 gap-4">

                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Trophy size={18} />
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                          {item.achievement_type ||
                            "Institutional"}
                        </span>

                        {Number(
                            item.is_active
                          ) ? (

                          <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                            Active
                          </span>

                        ) : (

                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                            Hidden
                          </span>

                        )}

                      </div>


                      {item.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>
                      )}


                      <p className="mt-2 text-[11px] text-slate-400">
                        Display order:{" "}
                        {item.display_order ??
                          0}
                      </p>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(item)
                      }
                      title="Edit achievement"
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      disabled={
                        deletingId ===
                        item.id
                      }
                      title="Delete achievement"
                      className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {deletingId ===
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

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Achievements;