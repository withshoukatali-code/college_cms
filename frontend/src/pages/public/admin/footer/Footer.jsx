import React, { useEffect, useState } from "react";
import {
  Save,
  Trash2,
  Plus,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  UserRound,
  GraduationCap,
  Building2,
  ShieldCheck,
  BookOpen,
  BriefcaseBusiness,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

const EMPTY_FORM = {
  college_name: "",
  tagline: "",
  description: "",
  affiliation: "",
  established_year: "",
  naac_grade: "",

  address: "",
  phone: "",
  email: "",
  logo: "",

  principal_name: "",
  principal_designation: "",
  principal_mobile: "",

  administration_name: "",
  administration_designation: "",
  administration_mobile: "",

  grievance_name: "",
  grievance_designation: "",
  grievance_mobile: "",

  facilitation_name: "",
  facilitation_designation: "",
  facilitation_mobile: "",

  library_name: "",
  library_designation: "",
  library_mobile: "",

  placement_name: "",
  placement_designation: "",
  placement_mobile: "",

  anti_ragging_name: "",
  anti_ragging_designation: "",
  anti_ragging_mobile: "",

  copyright_text: "",
  developer_name: "",
  developer_text: "",
  developer_url: "",

  is_active: 1,
};

/* =========================================================
   IMAGE URL HELPER
========================================================= */

const getImageUrl = (path) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:image/")
  ) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${SERVER_BASE}${path}`;
  }

  return `${SERVER_BASE}/${path}`;
};

/* =========================================================
   COMMON COMPONENTS
========================================================= */

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "#eef4fb",
          color: "#0f3262",
        }}
      >
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full
          px-3.5
          py-2.5
          rounded-lg
          border border-slate-300
          bg-white
          text-sm
          text-slate-800
          outline-none
          transition
          focus:border-[#0f3262]
          focus:ring-2
          focus:ring-[#0f3262]/10
          disabled:bg-slate-100
          disabled:cursor-not-allowed
        "
      />
    </div>
  );
};

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="
          w-full
          px-3.5
          py-2.5
          rounded-lg
          border border-slate-300
          bg-white
          text-sm
          text-slate-800
          outline-none
          transition
          resize-y
          focus:border-[#0f3262]
          focus:ring-2
          focus:ring-[#0f3262]/10
        "
      />
    </div>
  );
};

/* =========================================================
   CONTACT SECTION
   IMPORTANT:
   This component MUST stay outside Footer()
   to prevent focus loss.
========================================================= */

const ContactSection = ({
  title,
  description,
  icon: Icon,
  prefix,
  form,
  onChange,
}) => {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: "#f5f8fc",
            color: "#0f3262",
          }}
        >
          <Icon size={18} />
        </div>

        <div>
          <h3 className="font-bold text-slate-800">
            {title}
          </h3>

          {description && (
            <p className="text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field
          label="Name"
          name={`${prefix}_name`}
          value={form[`${prefix}_name`]}
          onChange={onChange}
          placeholder="Enter name"
        />

        <Field
          label="Designation"
          name={`${prefix}_designation`}
          value={form[`${prefix}_designation`]}
          onChange={onChange}
          placeholder="Enter designation"
        />

        <Field
          label="Mobile"
          name={`${prefix}_mobile`}
          value={form[`${prefix}_mobile`]}
          onChange={onChange}
          placeholder="Enter mobile number"
          type="tel"
        />
      </div>
    </div>
  );
};

/* =========================================================
   MAIN FOOTER ADMIN
========================================================= */

const Footer = () => {
  const [footer, setFooter] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [logoPreview, setLogoPreview] = useState("");

  const [isDirty, setIsDirty] = useState(false);

  /* =======================================================
     MESSAGE
  ======================================================= */

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  /* =======================================================
     NORMALIZE SERVER DATA
  ======================================================= */

  const normalizeFooter = (data) => {
    if (!data) {
      return {
        ...EMPTY_FORM,
      };
    }

    return {
      ...EMPTY_FORM,
      ...data,
      is_active:
        data.is_active === 0 ||
        data.is_active === "0"
          ? 0
          : 1,
    };
  };

  /* =======================================================
     FETCH FOOTER
  ======================================================= */

  const fetchFooter = async (force = false) => {
    if (isDirty && !force) {
      const confirmed = window.confirm(
        "You have unsaved changes. Refreshing will discard them. Continue?"
      );

      if (!confirmed) return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/footer/admin`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load footer"
        );
      }

      const data =
        result?.data ||
        result?.footer ||
        result;

      if (data && data.id) {
        const normalized = normalizeFooter(data);

        setFooter(normalized);
        setForm(normalized);

        setLogoPreview(
          normalized.logo
            ? getImageUrl(normalized.logo)
            : ""
        );
      } else {
        setFooter(null);
        setForm({
          ...EMPTY_FORM,
        });
        setLogoPreview("");
      }

      setIsDirty(false);
    } catch (error) {
      console.error("Footer fetch error:", error);

      showMessage(
        error.message || "Unable to load footer",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchFooter(true);
  }, []);

  /* =======================================================
     FORM CHANGE
  ======================================================= */

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
            ? 1
            : 0
          : value,
    }));

    setIsDirty(true);
  };

  /* =======================================================
     LOGO UPLOAD
  ======================================================= */

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const maxSize = 50 * 1024 * 1024;

    if (file.size > maxSize) {
      showMessage(
        "Logo file must be smaller than 50 MB.",
        "error"
      );

      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage(
        "Please select a valid image file.",
        "error"
      );

      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;

      setForm((previous) => ({
        ...previous,
        logo: dataUrl,
      }));

      setLogoPreview(dataUrl);
      setIsDirty(true);
    };

    reader.onerror = () => {
      showMessage(
        "Unable to read logo file.",
        "error"
      );
    };

    reader.readAsDataURL(file);
  };

  /* =======================================================
     REMOVE LOGO
  ======================================================= */

  const handleRemoveLogo = () => {
    setForm((previous) => ({
      ...previous,
      logo: "",
    }));

    setLogoPreview("");
    setIsDirty(true);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.college_name.trim()) {
      showMessage(
        "College name is required.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      const isUpdate = Boolean(footer?.id);

      const url = isUpdate
        ? `${API_BASE}/footer/${footer.id}`
        : `${API_BASE}/footer`;

      const method = isUpdate
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save footer."
        );
      }

      const saved =
        result?.data ||
        result?.footer;

      if (saved) {
        const normalized =
          normalizeFooter(saved);

        setFooter(normalized);
        setForm(normalized);

        setLogoPreview(
          normalized.logo
            ? getImageUrl(normalized.logo)
            : ""
        );
      }

      setIsDirty(false);

      showMessage(
        isUpdate
          ? "Footer updated successfully."
          : "Footer created successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Footer save error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to save footer.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    if (!footer?.id) {
      showMessage(
        "There is no footer record to delete.",
        "error"
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete the footer? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE}/footer/${footer.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete footer."
        );
      }

      setFooter(null);
      setForm({
        ...EMPTY_FORM,
      });
      setLogoPreview("");
      setIsDirty(false);

      showMessage(
        "Footer deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Footer delete error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to delete footer.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     TOGGLE ACTIVE
  ======================================================= */

  const handleToggle = async () => {
    if (!footer?.id) return;

    const newStatus =
      Number(form.is_active) === 1
        ? 0
        : 1;

    try {
      const response = await fetch(
        `${API_BASE}/footer/${footer.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update footer status."
        );
      }

      const updated =
        result?.data ||
        result?.footer;

      if (updated) {
        const normalized =
          normalizeFooter(updated);

        setFooter(normalized);
        setForm(normalized);

        setLogoPreview(
          normalized.logo
            ? getImageUrl(normalized.logo)
            : ""
        );
      } else {
        setForm((previous) => ({
          ...previous,
          is_active: newStatus,
        }));
      }

      setIsDirty(false);

      showMessage(
        newStatus
          ? "Footer activated."
          : "Footer deactivated.",
        "success"
      );
    } catch (error) {
      console.error(
        "Footer toggle error:",
        error
      );

      showMessage(
        error.message ||
          "Unable to update footer status.",
        "error"
      );
    }
  };

  /* =======================================================
     NEW FOOTER
  ======================================================= */

  const handleNew = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Create a new footer form and discard them?"
      );

      if (!confirmed) return;
    }

    setFooter(null);
    setForm({
      ...EMPTY_FORM,
    });
    setLogoPreview("");
    setIsDirty(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-5">
            <div className="h-10 bg-slate-200 rounded-lg w-72" />
            <div className="h-32 bg-white rounded-xl border border-slate-200" />
            <div className="h-64 bg-white rounded-xl border border-slate-200" />
            <div className="h-64 bg-white rounded-xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 pb-28">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    background: "#0f3262",
                    color: "white",
                  }}
                >
                  <Building2 size={22} />
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    Footer Management
                  </h1>

                  <p className="text-sm text-slate-500">
                    Manage college footer information,
                    contacts and developer details.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">

              {footer?.id && (
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold border transition ${
                    Number(form.is_active) === 1
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {Number(form.is_active) === 1 ? (
                    <>
                      <CheckCircle2 size={17} />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle size={17} />
                      Inactive
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => fetchFooter(false)}
                className="
                  inline-flex items-center gap-2
                  px-3.5 py-2
                  rounded-lg
                  border border-slate-300
                  bg-white
                  text-slate-700
                  text-sm font-semibold
                  hover:bg-slate-50
                "
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              <button
                type="button"
                onClick={handleNew}
                className="
                  inline-flex items-center gap-2
                  px-3.5 py-2
                  rounded-lg
                  text-white
                  text-sm font-semibold
                  bg-[#0f3262]
                  hover:bg-[#0b2850]
                "
              >
                <Plus size={17} />
                New
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div
            className={`mb-5 px-4 py-3 rounded-lg border flex items-center gap-3 ${
              messageType === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {messageType === "error" ? (
              <XCircle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <span className="text-sm font-medium">
              {message}
            </span>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          {/* ===============================================
              COLLEGE INFORMATION
          =============================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <SectionHeader
              icon={GraduationCap}
              title="College Information"
              description="Basic information displayed in the public footer."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field
                label="College Name"
                name="college_name"
                value={form.college_name}
                onChange={handleChange}
                placeholder="Enter college name"
                required
              />

              <Field
                label="Tagline"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Knowledge, Character and Service"
              />

              <Field
                label="Affiliation"
                name="affiliation"
                value={form.affiliation}
                onChange={handleChange}
                placeholder="Enter university affiliation"
              />

              <Field
                label="Established Year"
                name="established_year"
                value={form.established_year}
                onChange={handleChange}
                placeholder="1965"
              />

              <Field
                label="NAAC Grade"
                name="naac_grade"
                value={form.naac_grade}
                onChange={handleChange}
                placeholder="A+"
              />

              <div className="md:col-span-2">
                <TextArea
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter footer description..."
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* ===============================================
              CONTACT & LOGO
          =============================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <SectionHeader
              icon={MapPin}
              title="Contact & Logo"
              description="Main college contact information and footer logo."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              <div className="lg:col-span-2 space-y-5">

                <TextArea
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter complete college address"
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                  />

                  <Field
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="office@college.edu"
                    type="email"
                  />
                </div>
              </div>

              {/* LOGO */}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Footer Logo
                </label>

                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50">

                  <div className="h-40 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Footer Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon
                          size={34}
                          className="mx-auto mb-2"
                        />
                        <p className="text-xs">
                          No logo selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">

                    <label
                      className="
                        cursor-pointer
                        inline-flex items-center gap-2
                        px-3 py-2
                        rounded-lg
                        bg-[#0f3262]
                        text-white
                        text-sm font-semibold
                        hover:bg-[#0b2850]
                      "
                    >
                      <Upload size={16} />
                      Upload Logo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="
                          inline-flex items-center gap-2
                          px-3 py-2
                          rounded-lg
                          bg-red-50
                          text-red-700
                          border border-red-200
                          text-sm font-semibold
                        "
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Maximum size: 50 MB. Image formats only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================
              CONTACT DIRECTORY
          =============================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <SectionHeader
              icon={Phone}
              title="Contact Directory"
              description="Manage important contact persons displayed in the footer."
            />

            <div className="space-y-4">

              <ContactSection
                title="Principal"
                description="Principal contact"
                icon={UserRound}
                prefix="principal"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Administration"
                description="Administration office contact"
                icon={Building2}
                prefix="administration"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Grievance"
                description="Grievance redressal contact"
                icon={AlertTriangle}
                prefix="grievance"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Facilitation"
                description="Student facilitation contact"
                icon={ShieldCheck}
                prefix="facilitation"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Library"
                description="Library contact"
                icon={BookOpen}
                prefix="library"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Placement"
                description="Placement cell contact"
                icon={BriefcaseBusiness}
                prefix="placement"
                form={form}
                onChange={handleChange}
              />

              <ContactSection
                title="Anti-Ragging"
                description="Anti-ragging contact"
                icon={ShieldCheck}
                prefix="anti_ragging"
                form={form}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ===============================================
              COPYRIGHT
          =============================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
            <SectionHeader
              icon={Mail}
              title="Copyright & Developer"
              description="Footer copyright and development credit."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field
                label="Copyright Text"
                name="copyright_text"
                value={form.copyright_text}
                onChange={handleChange}
                placeholder="© 2026 Tuljabhavani College. All Rights Reserved."
              />

              <Field
                label="Developer Name"
                name="developer_name"
                value={form.developer_name}
                onChange={handleChange}
                placeholder="Innovative Academy"
              />

              <Field
                label="Developer Text"
                name="developer_text"
                value={form.developer_text}
                onChange={handleChange}
                placeholder="Designed & Developed by Innovative Academy"
              />

              <Field
                label="Developer URL"
                name="developer_url"
                value={form.developer_url}
                onChange={handleChange}
                placeholder="https://example.com"
                type="url"
              />
            </div>
          </div>

          {/* ===============================================
              STICKY ACTION BAR
          =============================================== */}

          <div
            className="
              fixed
              bottom-0
              left-0
              right-0
              z-40
              bg-white
              border-t
              border-slate-200
              shadow-lg
            "
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div className="text-sm text-slate-500">
                {isDirty ? (
                  <span className="text-amber-600 font-medium">
                    Unsaved changes
                  </span>
                ) : footer?.id ? (
                  <span>
                    Footer ID: {footer.id}
                  </span>
                ) : (
                  <span>
                    New footer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">

                {footer?.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting || saving}
                    className="
                      inline-flex items-center gap-2
                      px-4 py-2.5
                      rounded-lg
                      bg-red-50
                      text-red-700
                      border border-red-200
                      text-sm font-semibold
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={17} />

                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving || deleting}
                  className="
                    inline-flex items-center gap-2
                    px-5 py-2.5
                    rounded-lg
                    bg-[#0f3262]
                    text-white
                    text-sm font-semibold
                    hover:bg-[#0b2850]
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : footer?.id
                    ? "Update Footer"
                    : "Create Footer"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Footer;