
import { useEffect, useState } from "react";
import {
  Save,
  Upload,
  Image as ImageIcon,
  UserRound,
  FileText,
  CheckCircle,
  AlertCircle,
  Newspaper,
  Trophy,
  ArrowRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-welcome";
const SERVER_URL = "http://localhost:5000";

function getApiUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${SERVER_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function WelcomePrincipal() {
  const [form, setForm] = useState({
    id: null,

    // Welcome
    welcome_title: "",

    // Principal
    principal_name: "",
    principal_designation: "",
    principal_photo: "",
    principal_message: "",

    // Principal profile
    principal_profile_pdf: "",
    principal_profile_button_text: "",

    // Card 1
    card_one_title: "",
    card_one_description: "",
    card_one_link: "",

    // Card 2
    card_two_title: "",
    card_two_description: "",
    card_two_link: "",

    // Card 3
    card_three_title: "",
    card_three_description: "",
    card_three_link: "",

    is_active: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWelcome();
  }, []);

  // =========================================================
  // FETCH
  // =========================================================

  const fetchWelcome = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to fetch welcome information"
        );
      }

      if (result.data) {
        const item = result.data;

        setForm({
          id: item.id ?? null,

          welcome_title:
            item.welcome_title || "",

          principal_name:
            item.principal_name || "",

          principal_designation:
            item.principal_designation || "",

          principal_photo:
            item.principal_photo || "",

          principal_message:
            item.principal_message || "",

          principal_profile_pdf:
            item.principal_profile_pdf || "",

          principal_profile_button_text:
            item.principal_profile_button_text ||
            "View Principal Profile",

          card_one_title:
            item.card_one_title || "News & Notices",

          card_one_description:
            item.card_one_description || "",

          card_one_link:
            item.card_one_link || "/news-notices",

          card_two_title:
            item.card_two_title || "Achievements",

          card_two_description:
            item.card_two_description || "",

          card_two_link:
            item.card_two_link || "/achievements",

          card_three_title:
            item.card_three_title ||
            "Principal's Profile",

          card_three_description:
            item.card_three_description || "",

          card_three_link:
            item.card_three_link || "",

          is_active:
            item.is_active ?? 1,
        });
      }
    } catch (err) {
      console.error("Home welcome fetch error:", err);

      setError(
        err.message ||
          "Unable to load welcome information"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // PRINCIPAL PHOTO UPLOAD
  // =========================================================

  const handlePrincipalPhoto = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingPhoto(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "principal_photo",
        file
      );

      const response = await fetch(
        `${API_URL}/upload-principal-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to upload principal photo"
        );
      }

      setForm((previous) => ({
        ...previous,
        principal_photo:
          result.data.image_url,
      }));

      setSuccess(
        "Principal photo uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Principal photo upload error:",
        err
      );

      setError(
        err.message ||
          "Failed to upload principal photo"
      );
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  // =========================================================
  // PRINCIPAL PROFILE PDF UPLOAD
  // =========================================================

  const handlePrincipalProfilePdf = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingPdf(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "principal_profile_pdf",
        file
      );

      const response = await fetch(
        `${API_URL}/upload-principal-profile`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to upload principal profile PDF"
        );
      }

      const pdfUrl =
        result.data?.pdf_url ||
        result.data?.file_url ||
        result.data?.principal_profile_pdf;

      if (!pdfUrl) {
        throw new Error(
          "PDF uploaded but no PDF URL was returned by the API."
        );
      }

      setForm((previous) => ({
        ...previous,
        principal_profile_pdf: pdfUrl,
      }));

      setSuccess(
        "Principal profile PDF uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Principal profile PDF upload error:",
        err
      );

      setError(
        err.message ||
          "Failed to upload principal profile PDF"
      );
    } finally {
      setUploadingPdf(false);
      event.target.value = "";
    }
  };

  // =========================================================
  // PHOTO URL
  // =========================================================

  const getImageUrl = () => {
    return getApiUrl(form.principal_photo);
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        welcome_title:
          form.welcome_title.trim(),

        principal_name:
          form.principal_name.trim(),

        principal_designation:
          form.principal_designation.trim(),

        principal_photo:
          form.principal_photo.trim(),

        principal_message:
          form.principal_message.trim(),

        principal_profile_pdf:
          form.principal_profile_pdf.trim(),

        principal_profile_button_text:
          form.principal_profile_button_text.trim(),

        card_one_title:
          form.card_one_title.trim(),

        card_one_description:
          form.card_one_description.trim(),

        card_one_link:
          form.card_one_link.trim(),

        card_two_title:
          form.card_two_title.trim(),

        card_two_description:
          form.card_two_description.trim(),

        card_two_link:
          form.card_two_link.trim(),

        card_three_title:
          form.card_three_title.trim(),

        card_three_description:
          form.card_three_description.trim(),

        card_three_link:
          form.card_three_link.trim(),

        is_active:
          Number(form.is_active),
      };

      let response;

      if (form.id) {
        response = await fetch(
          `${API_URL}/${form.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save information"
        );
      }

      if (result.data) {
        setForm((previous) => ({
          ...previous,
          id: result.data.id ?? previous.id,
          ...result.data,
        }));
      }

      setSuccess(
        "Welcome & Principal information saved successfully."
      );
    } catch (err) {
      console.error(
        "Home welcome save error:",
        err
      );

      setError(
        err.message ||
          "Failed to save information"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Loading welcome information...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="mx-auto max-w-5xl">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Homepage Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome & Principal
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage the homepage welcome section, principal
          message, profile and supporting information cards.
        </p>
      </div>

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ===================================================
            WELCOME TITLE
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                <ImageIcon size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Welcome Section
                </h2>

                <p className="text-xs text-slate-500">
                  Homepage section heading
                </p>
              </div>

            </div>
          </div>

          <div className="p-6">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Welcome Title
            </label>

            <input
              type="text"
              name="welcome_title"
              value={form.welcome_title}
              onChange={handleChange}
              placeholder="Welcome to Our College"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>
        </section>

        {/* ===================================================
            PRINCIPAL
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262]">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Principal Information
                </h2>

                <p className="text-xs text-slate-500">
                  Principal profile and message
                </p>
              </div>

            </div>

          </div>

          <div className="space-y-5 p-6">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Principal Name
              </label>

              <input
                type="text"
                name="principal_name"
                value={form.principal_name}
                onChange={handleChange}
                placeholder="Principal Name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DESIGNATION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Designation
              </label>

              <input
                type="text"
                name="principal_designation"
                value={form.principal_designation}
                onChange={handleChange}
                placeholder="Principal"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PHOTO */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Principal Photo
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                <label
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                    uploadingPhoto
                      ? "cursor-not-allowed bg-slate-400"
                      : "cursor-pointer bg-[#0f3262] hover:bg-[#0b2850]"
                  }`}
                >

                  <Upload size={18} />

                  {uploadingPhoto
                    ? "Uploading..."
                    : "Browse Photo"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingPhoto}
                    onChange={handlePrincipalPhoto}
                  />

                </label>

                {form.principal_photo && (
                  <span className="text-sm text-slate-500">
                    Photo uploaded
                  </span>
                )}

              </div>

              {form.principal_photo && (
                <div className="mt-5">
                  <img
                    src={getImageUrl()}
                    alt={
                      form.principal_name ||
                      "Principal"
                    }
                    className="h-40 w-40 rounded-2xl border border-slate-200 object-cover shadow-sm"
                  />
                </div>
              )}

            </div>

            {/* MESSAGE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Principal Message
              </label>

              <textarea
                name="principal_message"
                value={form.principal_message}
                onChange={handleChange}
                rows={7}
                placeholder="Enter principal's message..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>
        </section>

        {/* ===================================================
            PRINCIPAL PROFILE
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Principal Profile
                </h2>

                <p className="text-xs text-slate-500">
                  Upload the Principal profile PDF used by the homepage button.
                </p>
              </div>

            </div>

          </div>

          <div className="space-y-5 p-6">

            {/* BUTTON TEXT */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profile Button Text
              </label>

              <input
                type="text"
                name="principal_profile_button_text"
                value={
                  form.principal_profile_button_text
                }
                onChange={handleChange}
                placeholder="View Principal Profile"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* PDF */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Principal Profile PDF
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                <label
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                    uploadingPdf
                      ? "cursor-not-allowed bg-slate-400"
                      : "cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >

                  <Upload size={18} />

                  {uploadingPdf
                    ? "Uploading..."
                    : "Browse PDF"}

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={uploadingPdf}
                    onChange={
                      handlePrincipalProfilePdf
                    }
                  />

                </label>

                {form.principal_profile_pdf && (
                  <span className="text-sm text-emerald-600">
                    Profile PDF uploaded
                  </span>
                )}

              </div>

              {form.principal_profile_pdf && (
                <a
                  href={getApiUrl(
                    form.principal_profile_pdf
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Open Current Profile PDF
                  <ArrowRight size={14} />
                </a>
              )}

            </div>

          </div>
        </section>

        {/* ===================================================
            THREE CARDS
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0f3262]">
                <ArrowRight size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Homepage Cards
                </h2>

                <p className="text-xs text-slate-500">
                  Manage the three cards displayed below the Principal message.
                </p>
              </div>

            </div>

          </div>

          <div className="space-y-6 p-6">

            {/* CARD 1 */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-4 flex items-center gap-2">
                <Newspaper
                  size={17}
                  className="text-[#0f3262]"
                />

                <h3 className="font-bold text-slate-800">
                  Card One
                </h3>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  name="card_one_title"
                  value={form.card_one_title}
                  onChange={handleChange}
                  placeholder="News & Notices"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <textarea
                  name="card_one_description"
                  value={
                    form.card_one_description
                  }
                  onChange={handleChange}
                  rows={3}
                  placeholder="Latest college announcements and updates."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  type="text"
                  name="card_one_link"
                  value={form.card_one_link}
                  onChange={handleChange}
                  placeholder="/news-notices"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* CARD 2 */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-4 flex items-center gap-2">
                <Trophy
                  size={17}
                  className="text-amber-600"
                />

                <h3 className="font-bold text-slate-800">
                  Card Two
                </h3>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  name="card_two_title"
                  value={form.card_two_title}
                  onChange={handleChange}
                  placeholder="Achievements"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <textarea
                  name="card_two_description"
                  value={
                    form.card_two_description
                  }
                  onChange={handleChange}
                  rows={3}
                  placeholder="Celebrating the achievements of our college community."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  type="text"
                  name="card_two_link"
                  value={form.card_two_link}
                  onChange={handleChange}
                  placeholder="/achievements"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </div>

            {/* CARD 3 */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-4 flex items-center gap-2">
                <UserRound
                  size={17}
                  className="text-indigo-600"
                />

                <h3 className="font-bold text-slate-800">
                  Card Three
                </h3>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  name="card_three_title"
                  value={
                    form.card_three_title
                  }
                  onChange={handleChange}
                  placeholder="Principal's Profile"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <textarea
                  name="card_three_description"
                  value={
                    form.card_three_description
                  }
                  onChange={handleChange}
                  rows={3}
                  placeholder="View the Principal's profile and professional details."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  type="text"
                  name="card_three_link"
                  value={
                    form.card_three_link
                  }
                  onChange={handleChange}
                  placeholder="/principal-profile"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </div>

          </div>
        </section>

        {/* ===================================================
            ACTIVE
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="p-6">

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

              <input
                id="is_active"
                type="checkbox"
                checked={
                  Number(form.is_active) === 1
                }
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    is_active:
                      event.target.checked
                        ? 1
                        : 0,
                  }))
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <label
                htmlFor="is_active"
                className="text-sm font-medium text-slate-700"
              >
                Show this section on the public homepage
              </label>

            </div>

          </div>
        </section>

        {/* ===================================================
            SAVE
        ==================================================== */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={
              saving ||
              uploadingPhoto ||
              uploadingPdf
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2850] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>
    </div>
  );
}

export default WelcomePrincipal;

