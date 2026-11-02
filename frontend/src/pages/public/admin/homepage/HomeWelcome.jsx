import { useEffect, useRef, useState } from "react";
import {
  Save,
  Image,
  FileText,
  Link2,
  RefreshCw,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-welcome";

const emptyForm = {
  welcome_title: "",
  principal_name: "",
  principal_designation: "",
  principal_photo: "",
  principal_message: "",
  principal_profile_pdf: "",
  principal_profile_button_text: "View Profile",

  card_one_title: "",
  card_one_description: "",
  card_one_link: "",

  card_two_title: "",
  card_two_description: "",
  card_two_link: "",

  card_three_title: "",
  card_three_description: "",
  card_three_link: "",

  is_active: 1,
};

function HomeWelcome() {
  const [form, setForm] = useState(emptyForm);

  const [recordId, setRecordId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // PHOTO
  // ============================================================

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const photoInputRef = useRef(null);

  // ============================================================
  // PDF
  // ============================================================

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const pdfInputRef = useRef(null);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchWelcome = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch Welcome & Principal");
      }

      const data = await response.json();

      let item = null;

      if (Array.isArray(data)) {
        item = data[0] || null;
      } else if (data?.data) {
        item = Array.isArray(data.data)
          ? data.data[0] || null
          : data.data;
      } else {
        item = data;
      }

      if (item && item.id) {
        setRecordId(item.id);

        setForm({
          welcome_title: item.welcome_title || "",
          principal_name: item.principal_name || "",
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
            "View Profile",

          card_one_title:
            item.card_one_title || "",

          card_one_description:
            item.card_one_description || "",

          card_one_link:
            item.card_one_link || "",

          card_two_title:
            item.card_two_title || "",

          card_two_description:
            item.card_two_description || "",

          card_two_link:
            item.card_two_link || "",

          card_three_title:
            item.card_three_title || "",

          card_three_description:
            item.card_three_description || "",

          card_three_link:
            item.card_three_link || "",

          is_active:
            Number(item.is_active) === 0 ? 0 : 1,
        });

        if (item.principal_photo) {
          setPhotoPreview(item.principal_photo);
        } else {
          setPhotoPreview("");
        }

        setPdfFile(null);
        setPdfName("");
      } else {
        setRecordId(null);
        setForm(emptyForm);
        setPhotoPreview("");
        setPdfFile(null);
        setPdfName("");
      }
    } catch (err) {
      console.error("Fetch home welcome error:", err);

      setError(
        err.message ||
          "Failed to load Welcome & Principal section."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWelcome();
  }, []);

  // ============================================================
  // TEXT CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // PHOTO CHANGE
  // ============================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Principal photo must be less than 5 MB."
      );
      return;
    }

    setPhotoFile(file);

    const previewUrl = URL.createObjectURL(file);

    setPhotoPreview(previewUrl);

    setError("");
    setSuccess("");
  };

  // ============================================================
  // REMOVE PHOTO
  // ============================================================

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");

    setForm((prev) => ({
      ...prev,
      principal_photo: "",
    }));

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  };

  // ============================================================
  // PDF CHANGE
  // ============================================================

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError(
        "Please select a valid PDF file."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Profile PDF must be less than 10 MB."
      );
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);

    setError("");
    setSuccess("");
  };

  // ============================================================
  // REMOVE PDF
  // ============================================================

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfName("");

    setForm((prev) => ({
      ...prev,
      principal_profile_pdf: "",
    }));

    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.welcome_title.trim()) {
      setError(
        "Please enter the welcome title."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      // ========================================================
      // BASIC
      // ========================================================

      formData.append(
        "welcome_title",
        form.welcome_title
      );

      formData.append(
        "principal_name",
        form.principal_name
      );

      formData.append(
        "principal_designation",
        form.principal_designation
      );

      formData.append(
        "principal_message",
        form.principal_message
      );

      formData.append(
        "principal_profile_button_text",
        form.principal_profile_button_text
      );

      // ========================================================
      // EXISTING PHOTO
      // ========================================================

      formData.append(
        "existing_principal_photo",
        form.principal_photo || ""
      );

      // ========================================================
      // NEW PHOTO
      // ========================================================

      if (photoFile) {
        formData.append(
          "principal_photo",
          photoFile
        );
      }

      // ========================================================
      // EXISTING PDF
      // ========================================================

      formData.append(
        "existing_principal_profile_pdf",
        form.principal_profile_pdf || ""
      );

      // ========================================================
      // NEW PDF
      // ========================================================

      if (pdfFile) {
        formData.append(
          "principal_profile_pdf",
          pdfFile
        );
      }

      // ========================================================
      // CARD ONE
      // ========================================================

      formData.append(
        "card_one_title",
        form.card_one_title
      );

      formData.append(
        "card_one_description",
        form.card_one_description
      );

      formData.append(
        "card_one_link",
        form.card_one_link
      );

      // ========================================================
      // CARD TWO
      // ========================================================

      formData.append(
        "card_two_title",
        form.card_two_title
      );

      formData.append(
        "card_two_description",
        form.card_two_description
      );

      formData.append(
        "card_two_link",
        form.card_two_link
      );

      // ========================================================
      // CARD THREE
      // ========================================================

      formData.append(
        "card_three_title",
        form.card_three_title
      );

      formData.append(
        "card_three_description",
        form.card_three_description
      );

      formData.append(
        "card_three_link",
        form.card_three_link
      );

      // ========================================================
      // ACTIVE
      // ========================================================

      formData.append(
        "is_active",
        String(Number(form.is_active))
      );

      // ========================================================
      // REQUEST
      // ========================================================

      const method = recordId
        ? "PUT"
        : "POST";

      const url = recordId
        ? `${API_URL}/${recordId}`
        : API_URL;

      const response = await fetch(url, {
        method,
        body: formData,
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update home welcome"
        );
      }

      const savedId =
        data?.id ||
        data?.data?.id ||
        recordId;

      if (savedId) {
        setRecordId(savedId);
      }

      setPhotoFile(null);
      setPdfFile(null);
      setPdfName("");

      setSuccess(
        recordId
          ? "Welcome & Principal updated successfully."
          : "Welcome & Principal created successfully."
      );

      await fetchWelcome();
    } catch (err) {
      console.error(
        "Save home welcome error:",
        err
      );

      setError(
        err.message ||
          "Failed to update home welcome."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RELOAD
  // ============================================================

  const handleReload = () => {
    setPhotoFile(null);
    setPdfFile(null);
    setPdfName("");

    fetchWelcome();
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <RefreshCw
              size={24}
              className="mx-auto mb-3 animate-spin text-slate-400"
            />

            <p className="text-sm text-slate-500">
              Loading Welcome & Principal...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Welcome & Principal
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage homepage welcome content,
              principal profile and supporting cards.
            </p>

          </div>

          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Reload
          </button>

        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            SUCCESS
        ====================================================== */}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          {/* ====================================================
              WELCOME
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Welcome Section
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Main welcome heading for the homepage.
              </p>

            </div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Welcome Title
            </label>

            <input
              type="text"
              name="welcome_title"
              value={form.welcome_title}
              onChange={handleChange}
              placeholder="Welcome to Our College"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

          </section>

          {/* ====================================================
              PRINCIPAL
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Principal Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage principal information, photo,
                message and profile PDF.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              {/* DESIGNATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Principal Designation
                </label>

                <input
                  type="text"
                  name="principal_designation"
                  value={form.principal_designation}
                  onChange={handleChange}
                  placeholder="Principal"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              {/* ==================================================
                  PHOTO
              ================================================== */}

              <div className="md:col-span-2">

                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Image size={17} />
                  Principal Photo
                </label>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                  {/* PREVIEW */}

                  <div>

                    {photoPreview ? (

                      <div className="relative">

                        <img
                          src={photoPreview}
                          alt="Principal"
                          className="h-40 w-40 rounded-2xl object-cover ring-1 ring-slate-200"
                        />

                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                          title="Remove photo"
                        >
                          <X size={16} />
                        </button>

                      </div>

                    ) : (

                      <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">

                        <div className="text-center">

                          <Image
                            size={32}
                            className="mx-auto text-slate-300"
                          />

                          <p className="mt-2 text-xs text-slate-400">
                            No photo
                          </p>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* UPLOAD */}

                  <div>

                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        photoInputRef.current?.click()
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Upload size={18} />
                      Browse Photo
                    </button>

                    <p className="mt-3 text-xs text-slate-400">
                      JPG, JPEG, PNG or WebP · Max 5 MB
                    </p>

                    {photoFile && (
                      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">

                        <p className="text-sm font-semibold text-emerald-700">
                          New photo selected
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-emerald-600">
                          {photoFile.name}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Principal Message
                </label>

                <textarea
                  name="principal_message"
                  value={form.principal_message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Principal's welcome message..."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              {/* ==================================================
                  PROFILE PDF
              ================================================== */}

              <div>

                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={17} />
                  Principal Profile PDF
                </label>

                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      pdfInputRef.current?.click()
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <Upload size={18} />
                    Browse PDF
                  </button>

                  {form.principal_profile_pdf && (
                    <a
                      href={form.principal_profile_pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink size={17} />
                      View Current
                    </a>
                  )}

                </div>

                {pdfFile && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-emerald-700">
                        New PDF selected
                      </p>

                      <p className="truncate text-xs text-emerald-600">
                        {pdfName}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X size={15} />
                    </button>

                  </div>
                )}

                {!pdfFile &&
                  !form.principal_profile_pdf && (
                    <p className="mt-3 text-xs text-slate-400">
                      No profile PDF selected.
                    </p>
                  )}

                <p className="mt-2 text-xs text-slate-400">
                  PDF only · Maximum 10 MB
                </p>

              </div>

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
                  placeholder="View Profile"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

            </div>

          </section>

          {/* ====================================================
              CARD ONE
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="mb-6 text-lg font-bold text-slate-900">
              Supporting Card 1
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  name="card_one_title"
                  value={form.card_one_title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} />
                  Link
                </label>

                <input
                  type="text"
                  name="card_one_link"
                  value={form.card_one_link}
                  onChange={handleChange}
                  placeholder="/about"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="card_one_description"
                  value={form.card_one_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

            </div>

          </section>

          {/* ====================================================
              CARD TWO
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="mb-6 text-lg font-bold text-slate-900">
              Supporting Card 2
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  name="card_two_title"
                  value={form.card_two_title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} />
                  Link
                </label>

                <input
                  type="text"
                  name="card_two_link"
                  value={form.card_two_link}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="card_two_description"
                  value={form.card_two_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

            </div>

          </section>

          {/* ====================================================
              CARD THREE
          ==================================================== */}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="mb-6 text-lg font-bold text-slate-900">
              Supporting Card 3
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  type="text"
                  name="card_three_title"
                  value={form.card_three_title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={16} />
                  Link
                </label>

                <input
                  type="text"
                  name="card_three_link"
                  value={form.card_three_link}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="card_three_description"
                  value={form.card_three_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

              </div>

            </div>

          </section>

          {/* ====================================================
              STATUS / SAVE
          ==================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <label className="inline-flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    Number(form.is_active) === 1
                  }
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Display Welcome & Principal section
                </span>

              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Save size={18} />

                {saving
                  ? "Saving..."
                  : recordId
                  ? "Update Section"
                  : "Create Section"}

              </button>

            </div>

          </section>

        </form>

      </div>

    </div>
  );
}

export default HomeWelcome;