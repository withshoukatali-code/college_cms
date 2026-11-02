
import { useEffect, useRef, useState } from "react";
import {
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  Award,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API_URL = `${API_BASE}/api/college-header`;

/* ============================================================
   REUSABLE INPUT
   IMPORTANT:
   This component MUST stay outside CollegeHeader().
   This prevents textbox focus from being lost on every keystroke.
============================================================ */

function FormInput({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon = null,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            text-slate-800
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
            ${icon ? "pl-10" : ""}
          `}
        />
      </div>
    </div>
  );
}

/* ============================================================
   REUSABLE SECTION
   IMPORTANT:
   This component MUST stay outside CollegeHeader().
============================================================ */

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f3262] text-white">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-xs text-slate-500">
                {description}
              </p>
            )}
          </div>

        </div>
      </div>

      <div className="p-5">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   COLLEGE HEADER
============================================================ */

function CollegeHeader() {
  const logoInputRef = useRef(null);
  const campusInputRef = useRef(null);

  /* ============================================================
     DATA
  ============================================================ */

  const [data, setData] = useState({
    college_name: "",
    college_type: "Senior College",

    slogan: "",
    tagline: "",

    affiliation: "",
    affiliation_title: "Affiliation",
    university_name: "",

    established_year: "",

    phone: "",
    email: "",
    address: "",

    naac_grade: "",
    naac_cycle: "",
    naac_gpa: "",
    naac_title: "NAAC Accredited College",

    ugc_status: "",
    aishe_code: "",
    recognition_2f_12b: "",
    iso_certification: "",
    autonomous_status: "",

    website_url: "",
    google_map_link: "",

    logo_url: "",
    campus_image_url: "",

    show_header_image: 1,
    show_naac_card: 1,

    is_active: 1,
  });

  /* ============================================================
     MEDIA
  ============================================================ */

  const [logoPreview, setLogoPreview] = useState("");
  const [campusPreview, setCampusPreview] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [campusFile, setCampusFile] = useState(null);

  /* ============================================================
     STATUS
  ============================================================ */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCampus, setUploadingCampus] = useState(false);

  const [deletingLogo, setDeletingLogo] = useState(false);
  const [deletingCampus, setDeletingCampus] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ============================================================
     IMAGE URL
  ============================================================ */

  const getImageUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    if (url.startsWith("/")) {
      return `${API_BASE}${url}`;
    }

    return `${API_BASE}/${url}`;
  };

  /* ============================================================
     FETCH HEADER
  ============================================================ */

  const fetchHeader = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}?_=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Failed to fetch college header."
        );
      }

      const item = result.data || {};

      setData({
        college_name:
          item.college_name || "",

        college_type:
          item.college_type ||
          "Senior College",

        slogan:
          item.slogan || "",

        tagline:
          item.tagline || "",

        affiliation:
          item.affiliation || "",

        affiliation_title:
          item.affiliation_title ||
          "Affiliation",

        university_name:
          item.university_name || "",

        established_year:
          item.established_year || "",

        phone:
          item.phone || "",

        email:
          item.email || "",

        address:
          item.address || "",

        naac_grade:
          item.naac_grade || "",

        naac_cycle:
          item.naac_cycle || "",

        naac_gpa:
          item.naac_gpa ||
          item.naac_cgpa ||
          "",

        naac_title:
          item.naac_title ||
          "NAAC Accredited College",

        ugc_status:
          item.ugc_status || "",

        aishe_code:
          item.aishe_code || "",

        recognition_2f_12b:
          item.recognition_2f_12b || "",

        iso_certification:
          item.iso_certification || "",

        autonomous_status:
          item.autonomous_status || "",

        website_url:
          item.website_url || "",

        google_map_link:
          item.google_map_link || "",

        logo_url:
          item.logo_url || "",

        campus_image_url:
          item.campus_image_url || "",

        show_header_image:
          Number(
            item.show_header_image ?? 1
          ),

        show_naac_card:
          Number(
            item.show_naac_card ?? 1
          ),

        is_active:
          Number(
            item.is_active ?? 1
          ),
      });

      setLogoPreview(
        getImageUrl(item.logo_url)
      );

      setCampusPreview(
        getImageUrl(item.campus_image_url)
      );
    } catch (err) {
      console.error(
        "College Header Fetch Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load college header."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeader();
  }, []);

  /* ============================================================
     CHANGE
  ============================================================ */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  /* ============================================================
     LOGO SELECT
  ============================================================ */

  const handleLogoSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Logo must be JPG, JPEG, PNG or WEBP."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      setError(
        "Logo image must be below 20 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setMessage("");

    setLogoFile(file);

    setLogoPreview(
      URL.createObjectURL(file)
    );
  };

  /* ============================================================
     CAMPUS SELECT
  ============================================================ */

  const handleCampusSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Campus image must be JPG, JPEG, PNG or WEBP."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      20 * 1024 * 1024
    ) {
      setError(
        "Campus image must be below 20 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setMessage("");

    setCampusFile(file);

    setCampusPreview(
      URL.createObjectURL(file)
    );
  };

  /* ============================================================
     SAVE
  ============================================================ */

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        college_name:
          data.college_name,

        college_type:
          data.college_type,

        slogan:
          data.slogan,

        tagline:
          data.tagline,

        affiliation:
          data.affiliation,

        affiliation_title:
          data.affiliation_title,

        university_name:
          data.university_name,

        established_year:
          data.established_year,

        phone:
          data.phone,

        email:
          data.email,

        address:
          data.address,

        naac_grade:
          data.naac_grade,

        naac_cycle:
          data.naac_cycle,

        naac_gpa:
          data.naac_gpa,

        naac_title:
          data.naac_title,

        ugc_status:
          data.ugc_status,

        aishe_code:
          data.aishe_code,

        recognition_2f_12b:
          data.recognition_2f_12b,

        iso_certification:
          data.iso_certification,

        autonomous_status:
          data.autonomous_status,

        website_url:
          data.website_url,

        google_map_link:
          data.google_map_link,

        logo_url:
          data.logo_url,

        campus_image_url:
          data.campus_image_url,

        show_header_image:
          data.show_header_image,

        show_naac_card:
          data.show_naac_card,

        is_active:
          data.is_active,
      };

      const response = await fetch(
        API_URL,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to save college header."
        );
      }

      /* Upload logo */

      if (logoFile) {
        await uploadLogo();
      }

      /* Upload campus */

      if (campusFile) {
        await uploadCampus();
      }

      setLogoFile(null);
      setCampusFile(null);

      if (logoInputRef.current) {
        logoInputRef.current.value =
          "";
      }

      if (campusInputRef.current) {
        campusInputRef.current.value =
          "";
      }

      setMessage(
        "College header saved successfully."
      );

      await fetchHeader();
    } catch (err) {
      console.error(
        "College Header Save Error:",
        err
      );

      setError(
        err.message ||
          "Failed to save college header."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     UPLOAD LOGO
  ============================================================ */

  const uploadLogo = async () => {
    if (!logoFile) return;

    try {
      setUploadingLogo(true);

      const formData =
        new FormData();

      formData.append(
        "logo",
        logoFile
      );

      const response =
        await fetch(
          `${API_URL}/upload/logo`,
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to upload logo."
        );
      }

      setData((previous) => ({
        ...previous,
        logo_url:
          result.url || "",
      }));

      setLogoPreview(
        getImageUrl(result.url)
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  /* ============================================================
     UPLOAD CAMPUS
  ============================================================ */

  const uploadCampus = async () => {
    if (!campusFile) return;

    try {
      setUploadingCampus(true);

      const formData =
        new FormData();

      formData.append(
        "campus_image",
        campusFile
      );

      const response =
        await fetch(
          `${API_URL}/upload/campus`,
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to upload campus image."
        );
      }

      setData((previous) => ({
        ...previous,
        campus_image_url:
          result.url || "",
      }));

      setCampusPreview(
        getImageUrl(result.url)
      );
    } finally {
      setUploadingCampus(false);
    }
  };

  /* ============================================================
     DELETE LOGO
  ============================================================ */

  const deleteLogo = async () => {
    if (!logoPreview) return;

    if (
      !window.confirm(
        "Delete the college logo?"
      )
    ) {
      return;
    }

    try {
      setDeletingLogo(true);
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/logo`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to delete logo."
        );
      }

      setLogoPreview("");
      setLogoFile(null);

      setData((previous) => ({
        ...previous,
        logo_url: "",
      }));

      if (logoInputRef.current) {
        logoInputRef.current.value =
          "";
      }

      setMessage(
        "Logo deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Logo Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete logo."
      );
    } finally {
      setDeletingLogo(false);
    }
  };

  /* ============================================================
     DELETE CAMPUS
  ============================================================ */

  const deleteCampus = async () => {
    if (!campusPreview) return;

    if (
      !window.confirm(
        "Delete the campus image?"
      )
    ) {
      return;
    }

    try {
      setDeletingCampus(true);
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/campus`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Failed to delete campus image."
        );
      }

      setCampusPreview("");
      setCampusFile(null);

      setData((previous) => ({
        ...previous,
        campus_image_url: "",
      }));

      if (campusInputRef.current) {
        campusInputRef.current.value =
          "";
      }

      setMessage(
        "Campus image deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Campus Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete campus image."
      );
    } finally {
      setDeletingCampus(false);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">

          <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-6 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />

        </div>
      </div>
    );
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a77b14]">
                Homepage
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b2340] sm:text-3xl">
                College Header
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage college identity, contact,
                affiliation, NAAC accreditation and
                header media.
              </p>

            </div>

            <button
              type="button"
              onClick={fetchHeader}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-bold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">

        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl space-y-5 px-4 pb-28 pt-5 sm:px-6 lg:px-8">

        {/* ====================================================
            COLLEGE IDENTITY
        ==================================================== */}

        <FormSection
          icon={<Building2 size={20} />}
          title="College Identity"
          description="Primary information displayed in the public college header."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <FormInput
              label="College Name"
              name="college_name"
              value={data.college_name}
              onChange={handleChange}
              placeholder="Enter full college name"
            />

            <FormInput
              label="College Type"
              name="college_type"
              value={data.college_type}
              onChange={handleChange}
              placeholder="Senior College"
            />

            <FormInput
              label="Slogan"
              name="slogan"
              value={data.slogan}
              onChange={handleChange}
              placeholder="College slogan"
            />

            <FormInput
              label="Tagline"
              name="tagline"
              value={data.tagline}
              onChange={handleChange}
              placeholder="Short institutional tagline"
            />

          </div>

        </FormSection>

        {/* ====================================================
            CONTACT
        ==================================================== */}

        <FormSection
          icon={<Phone size={20} />}
          title="Address & Contact"
          description="Official contact information for the college."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={data.address}
                onChange={handleChange}
                rows={3}
                placeholder="Complete postal address"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

            <FormInput
              label="Phone"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Official contact number"
              icon={<Phone size={16} />}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Official college email"
              icon={<Mail size={16} />}
            />

          </div>

        </FormSection>

        {/* ====================================================
            AFFILIATION
        ==================================================== */}

        <FormSection
          icon={<GraduationCap size={20} />}
          title="Affiliation & Establishment"
          description="University affiliation and institutional establishment."
        >

          <div className="grid gap-5 md:grid-cols-2">

            <FormInput
              label="Affiliation"
              name="affiliation"
              value={data.affiliation}
              onChange={handleChange}
              placeholder="Affiliated to Shivaji University, Kolhapur"
            />

            <FormInput
              label="University Name"
              name="university_name"
              value={data.university_name}
              onChange={handleChange}
              placeholder="University name"
            />

            <FormInput
              label="Established Year"
              name="established_year"
              value={data.established_year}
              onChange={handleChange}
              placeholder="e.g. 1965"
            />

            <FormInput
              label="Affiliation Title"
              name="affiliation_title"
              value={data.affiliation_title}
              onChange={handleChange}
              placeholder="Affiliation"
            />

          </div>

        </FormSection>

        {/* ====================================================
            NAAC
        ==================================================== */}

        <FormSection
          icon={<Award size={20} />}
          title="NAAC Accreditation"
          description="Information displayed in the premium NAAC accreditation card."
        >

          <div className="rounded-2xl border border-[#d6b34c]/40 bg-[#071b34] p-5">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1d46c]">
                  Accreditation
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-white">
                  NAAC Recognition
                </h3>

              </div>

              <Award
                size={30}
                className="text-[#f1d46c]"
              />

            </div>

            <div className="grid gap-5 md:grid-cols-3">

              <div>

                <label className="mb-1.5 block text-xs font-bold text-slate-200">
                  NAAC Grade
                </label>

                <input
                  name="naac_grade"
                  value={data.naac_grade}
                  onChange={handleChange}
                  placeholder="A+"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-3
                    text-xl
                    font-black
                    text-[#f4d35e]
                    outline-none
                    placeholder:text-slate-500
                    focus:border-[#d8b548]
                  "
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-bold text-slate-200">
                  NAAC Cycle
                </label>

                <input
                  name="naac_cycle"
                  value={data.naac_cycle}
                  onChange={handleChange}
                  placeholder="Cycle IV"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-3
                    text-base
                    font-extrabold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-[#d8b548]
                  "
                />

              </div>

              <div>

                <label className="mb-1.5 block text-xs font-bold text-slate-200">
                  NAAC GPA
                </label>

                <input
                  name="naac_gpa"
                  value={data.naac_gpa}
                  onChange={handleChange}
                  placeholder="3.58"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-3
                    text-base
                    font-extrabold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-[#d8b548]
                  "
                />

              </div>

            </div>

            <div className="mt-5">

              <label className="mb-1.5 block text-xs font-bold text-slate-200">
                NAAC Card Title
              </label>

              <input
                name="naac_title"
                value={data.naac_title}
                onChange={handleChange}
                placeholder="NAAC Accredited College"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/15
                  bg-white/10
                  px-4
                  py-2.5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-slate-500
                  focus:border-[#d8b548]
                "
              />

            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-white">

              <input
                type="checkbox"
                name="show_naac_card"
                checked={
                  Number(
                    data.show_naac_card
                  ) === 1
                }
                onChange={handleChange}
                className="h-4 w-4"
              />

              Show NAAC Card

            </label>

          </div>

        </FormSection>

        {/* ====================================================
            BOTTOM STRIP
        ==================================================== */}

        {/* <FormSection
          icon={<ShieldCheck size={20} />}
          title="Bottom Institutional Strip"
          description="Important institutional recognition details displayed below the public header."
        >

          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

            <div className="flex items-start gap-3">

              <BadgeCheck
                size={20}
                className="mt-0.5 shrink-0 text-blue-700"
              />

              <div>

                <p className="text-sm font-bold text-blue-900">
                  NAAC-ready institutional information
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Use this section for statutory and
                  recognition information that is useful
                  on the public college website.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FormInput
              label="UGC Status"
              name="ugc_status"
              value={data.ugc_status}
              onChange={handleChange}
              placeholder="UGC Recognized"
            />

            <FormInput
              label="AISHE Code"
              name="aishe_code"
              value={data.aishe_code}
              onChange={handleChange}
              placeholder="AISHE Code"
            />

            <FormInput
              label="2(f) / 12(B)"
              name="recognition_2f_12b"
              value={data.recognition_2f_12b}
              onChange={handleChange}
              placeholder="UGC 2(f) / 12(B)"
            />

            <FormInput
              label="ISO Certification"
              name="iso_certification"
              value={data.iso_certification}
              onChange={handleChange}
              placeholder="ISO 9001:2015"
            />

            <FormInput
              label="Autonomous Status"
              name="autonomous_status"
              value={data.autonomous_status}
              onChange={handleChange}
              placeholder="Autonomous College"
            />

            <FormInput
              label="Website URL"
              name="website_url"
              value={data.website_url}
              onChange={handleChange}
              placeholder="https://..."
            />

          </div>

        </FormSection> */}

        {/* ====================================================
            HEADER MEDIA
        ==================================================== */}

        <FormSection
          icon={<ImageIcon size={20} />}
          title="Header Media"
          description="Manage the college logo and campus image."
        >

          <div className="grid gap-6 lg:grid-cols-2">

            {/* LOGO */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h3 className="font-extrabold text-slate-900">
                    College Logo
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP • Maximum 20 MB
                  </p>

                </div>

                <ImageIcon
                  size={20}
                  className="text-[#0f3262]"
                />

              </div>

              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-5">

                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="College Logo Preview"
                    className="max-h-[190px] max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-slate-400">

                    <ImageIcon
                      size={42}
                      className="mx-auto mb-2"
                    />

                    <p className="text-sm font-semibold">
                      No logo uploaded
                    </p>

                  </div>
                )}

              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoSelect}
                className="hidden"
              />

              <div className="mt-4 flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    logoInputRef.current?.click()
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0f3262]
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-[#092849]
                  "
                >
                  <Upload size={16} />
                  Browse / Upload
                </button>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={deleteLogo}
                    disabled={
                      deletingLogo
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-red-600
                      transition
                      hover:bg-red-100
                    "
                  >
                    <Trash2 size={16} />

                    {deletingLogo
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

              </div>

              {logoFile && (
                <p className="mt-3 text-xs font-semibold text-blue-600">
                  New logo selected. Click Save College Header to upload it.
                </p>
              )}

              {uploadingLogo && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Uploading logo...
                </p>
              )}

            </div>

            {/* CAMPUS */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

              <div className="mb-4 flex items-center justify-between">

                <div>

                  <h3 className="font-extrabold text-slate-900">
                    Campus Image
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP • Maximum 20 MB
                  </p>

                </div>

                <Building2
                  size={20}
                  className="text-[#0f3262]"
                />

              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">

                {campusPreview ? (
                  <img
                    src={campusPreview}
                    alt="Campus Preview"
                    className="h-[220px] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[220px] items-center justify-center text-slate-400">

                    <div className="text-center">

                      <Building2
                        size={42}
                        className="mx-auto mb-2"
                      />

                      <p className="text-sm font-semibold">
                        No campus image uploaded
                      </p>

                    </div>

                  </div>
                )}

              </div>

              <input
                ref={campusInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCampusSelect}
                className="hidden"
              />

              <div className="mt-4 flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    campusInputRef.current?.click()
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0f3262]
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-[#092849]
                  "
                >
                  <Upload size={16} />
                  Browse / Upload
                </button>

                {campusPreview && (
                  <button
                    type="button"
                    onClick={deleteCampus}
                    disabled={
                      deletingCampus
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-red-200
                      bg-red-50
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-red-600
                      transition
                      hover:bg-red-100
                    "
                  >
                    <Trash2 size={16} />

                    {deletingCampus
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                )}

              </div>

              {campusFile && (
                <p className="mt-3 text-xs font-semibold text-blue-600">
                  New campus image selected. Click Save College Header to upload it.
                </p>
              )}

              {uploadingCampus && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Uploading campus image...
                </p>
              )}

              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">

                <input
                  type="checkbox"
                  name="show_header_image"
                  checked={
                    Number(
                      data.show_header_image
                    ) === 1
                  }
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                {Number(
                  data.show_header_image
                ) === 1 ? (
                  <>
                    <Eye
                      size={16}
                      className="text-emerald-600"
                    />
                    Show campus image
                  </>
                ) : (
                  <>
                    <EyeOff
                      size={16}
                      className="text-slate-400"
                    />
                    Hide campus image
                  </>
                )}

              </label>

            </div>

          </div>

        </FormSection>

      </main>

      {/* ======================================================
          SAVE BAR
      ====================================================== */}

      <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="hidden text-sm text-slate-500 sm:block">
            Changes will appear on the public college header after saving.
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              uploadingLogo ||
              uploadingCampus
            }
            className="
              ml-auto
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0f3262]
              px-6
              py-3
              text-sm
              font-extrabold
              text-white
              shadow-md
              transition
              hover:bg-[#092849]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save College Header"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default CollegeHeader;

