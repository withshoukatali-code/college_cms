import { useEffect, useState } from "react";
import { ExternalLink, FileText, LoaderCircle, Save, Search, Upload } from "lucide-react";
import { normalizeFounderContent, pageMap } from "../../../features/public/StaticPage";

const configuredApiBase = import.meta.env.VITE_API_URL
  ?.replace(/\/+$/, "")
  .replace(/\/api$/i, "");
const API_BASE = configuredApiBase || (
  import.meta.env.DEV ? "http://localhost:5000" : window.location.origin
);
const pageDefaults = Object.entries(pageMap).map(([page_key, content]) => ({ page_key, content }));
const excludedStudentSectionTitles = new Set(["volunteering", "outreach", "community development"]);
const isExcludedStudentSection = (section) =>
  excludedStudentSectionTitles.has(String(section?.heading || "").trim().toLowerCase());
const profileFields = [
  ["name", "Coordinator name"],
  ["designation", "Designation"],
  ["qualification", "Qualification"],
  ["department", "Department"],
  ["phone", "Contact number"],
  ["email", "Email"],
  ["experience", "Experience"],
  ["majorResearchSubject", "Major Research Subject"],
  ["research", "Research / Publications"],
];
const founderProfileFields = [
  ["name", "Founder name"],
  ["designation", "Role / designation"],
  ["birthplace", "Birthplace"],
  ["education", "Education"],
  ["recognition", "Recognition"],
];

export default function SitePagesAdmin({ initialPageKey = "iqac-coordinator", pageKeys = null }) {
  const [pages, setPages] = useState([]);
  const [selectedKey, setSelectedKey] = useState(initialPageKey);
  const [content, setContent] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [profilePdf, setProfilePdf] = useState(null);
  const [pagePdf, setPagePdf] = useState(null);
  const [resourceFiles, setResourceFiles] = useState({});
  const [sectionQuery, setSectionQuery] = useState("");
  const [sectionStatus, setSectionStatus] = useState("all");
  const [resourceQuery, setResourceQuery] = useState("");
  const [resourceStatus, setResourceStatus] = useState("all");
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isStudentsEraPage = selectedKey.startsWith("students-era");
  const isNccPage = selectedKey === "students-era-ncc";

  const loadPages = async () => {
    const response = await fetch(`${API_BASE}/api/site-pages`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load site pages.");
    }
    const loadedPages = Array.isArray(result.data) ? result.data : [];
    setPages(loadedPages);
    return loadedPages;
  };

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/site-pages/seed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pages: pageDefaults }),
        });
        if (!response.ok) throw new Error("Unable to initialize page content.");
        await loadPages();
      } catch (loadError) {
        if (!cancelled) setError(loadError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    initialize();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSelectedKey(initialPageKey);
  }, [initialPageKey]);

  useEffect(() => {
    const record = pages.find((item) => item.page_key === selectedKey);
    const defaultContent = pageMap[selectedKey] || {};
    let pageContent = record?.content
      ? { ...defaultContent, ...record.content, resources: record.content.resources || defaultContent.resources || [] }
      : defaultContent;
    if (selectedKey.startsWith("students-era") && Number(pageContent.contentVersion || 0) < 2) {
      pageContent = {
        ...pageContent,
        contentVersion: 2,
        highlights: Array.isArray(pageContent.highlights) && pageContent.highlights.length
          ? pageContent.highlights
          : defaultContent.highlights || [],
        sections: Array.isArray(pageContent.sections) && pageContent.sections.length
          ? pageContent.sections.filter((section) => !isExcludedStudentSection(section))
          : defaultContent.sections || [],
        resources: Array.isArray(pageContent.resources) ? pageContent.resources : [],
      };
    }
    if (selectedKey.startsWith("students-era")) {
      pageContent.sections = (pageContent.sections || []).filter((section) => !isExcludedStudentSection(section));
    }
    if (selectedKey === "students-era-ncc" && Number(pageContent.contentVersion || 0) < 3) {
      pageContent = {
        ...pageContent,
        contentVersion: 3,
        highlights: defaultContent.highlights || [],
        sections: defaultContent.sections || [],
        resources: Array.isArray(pageContent.resources) ? pageContent.resources : [],
      };
    }
    setContent(selectedKey === "founder" ? normalizeFounderContent(pageContent) : pageContent);
    setHeroImageFile(null);
    setPhoto(null);
    setProfilePdf(null);
    setPagePdf(null);
    setResourceFiles({});
  }, [pages, selectedKey]);

  const update = (field, value) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const updateProfile = (field, value) => {
    setContent((current) => ({
      ...current,
      profile: { ...(current.profile || {}), [field]: value },
    }));
  };

  const uploadFile = async (endpoint, fieldName, file, fallbackMessage) => {
    const formData = new FormData();
    formData.append(fieldName, file);
    const response = await fetch(`${API_BASE}/api/site-pages${endpoint}`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || fallbackMessage);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    let contentSaved = false;
    let uploadFailed = false;
    let uploadedFileCount = 0;
    try {
      if (isStudentsEraPage && !validateStudentsEraContent(content)) {
        setSaving(false);
        return;
      }
      const contentToSave = isStudentsEraPage ? { ...content, contentVersion: isNccPage ? 3 : 2 } : content;
      const response = await fetch(`${API_BASE}/api/site-pages/${selectedKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSave }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save page.");
      contentSaved = true;

      const selectedUploads = [];
      if (isStudentsEraPage && heroImageFile) {
        selectedUploads.push({
          endpoint: `/${selectedKey}/hero-image`,
          fieldName: "photo",
          file: heroImageFile,
          clear: () => setHeroImageFile(null),
        });
      }
      if (photo) {
        selectedUploads.push({
          endpoint: `/${selectedKey}/photo`,
          fieldName: "photo",
          file: photo,
          clear: () => setPhoto(null),
        });
      }
      if (profilePdf) {
        selectedUploads.push({
          endpoint: `/${selectedKey}/profile-pdf`,
          fieldName: "document",
          file: profilePdf,
          clear: () => setProfilePdf(null),
        });
      }
      if (pagePdf) {
        selectedUploads.push({
          endpoint: `/${selectedKey}/document`,
          fieldName: "document",
          file: pagePdf,
          clear: () => setPagePdf(null),
        });
      }
      if (isStudentsEraPage) {
        for (const [fileKey, file] of Object.entries(resourceFiles)) {
          if (!file) continue;
          const separatorIndex = fileKey.indexOf("-");
          const index = fileKey.slice(0, separatorIndex);
          const asset = fileKey.slice(separatorIndex + 1);
          selectedUploads.push({
            endpoint: `/${selectedKey}/resources/${index}/${asset === "imageUrl" ? "photo" : "document"}`,
            fieldName: asset === "imageUrl" ? "photo" : "document",
            file,
            clear: () => setResourceFiles((current) => {
              const updated = { ...current };
              delete updated[fileKey];
              return updated;
            }),
          });
        }
      }

      for (const upload of selectedUploads) {
        try {
          await uploadFile(upload.endpoint, upload.fieldName, upload.file, "Unable to upload selected file.");
          upload.clear();
          uploadedFileCount += 1;
        } catch (uploadError) {
          uploadFailed = true;
          throw new Error(
            `Page content saved, but "${upload.file.name}" was not uploaded: ${uploadError.message}`,
            { cause: uploadError }
          );
        }
      }

      await loadPages();
      setSuccess(selectedUploads.length ? "Page content and selected files saved." : "Page content saved.");
    } catch (saveError) {
      if (uploadedFileCount > 0) {
        try {
          await loadPages();
        } catch (refreshError) {
          setError(`${saveError.message} The page could not be refreshed: ${refreshError.message}`);
          return;
        }
      }
      setError(contentSaved && !uploadFailed
        ? `Page content saved, but the page could not be refreshed: ${saveError.message}`
        : saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await uploadFile(`/${selectedKey}/photo`, "photo", photo, "Unable to upload photo.");
      await loadPages();
      setPhoto(null);
      setSuccess(selectedKey === "founder" ? "Founder photo uploaded." : isStudentsEraPage ? "Leader photo uploaded." : "Coordinator photo uploaded.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadHeroImage = async () => {
    if (!heroImageFile) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await uploadFile(`/${selectedKey}/hero-image`, "photo", heroImageFile, "Unable to upload hero image.");
      await loadPages();
      setHeroImageFile(null);
      setSuccess("Hero image uploaded.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadProfilePdf = async () => {
    if (!profilePdf) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await uploadFile(`/${selectedKey}/profile-pdf`, "document", profilePdf, "Unable to upload profile PDF.");
      await loadPages();
      setProfilePdf(null);
      setSuccess(selectedKey === "founder" ? "Founder document uploaded." : isStudentsEraPage ? "Leader profile PDF uploaded." : "Coordinator profile PDF uploaded.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadPagePdf = async () => {
    if (!pagePdf) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await uploadFile(`/${selectedKey}/document`, "document", pagePdf, "Unable to upload PDF.");
      await loadPages();
      setPagePdf(null);
      setSuccess("SSR PDF uploaded.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSaving(false);
    }
  };

  const validateStudentsEraContent = (studentPage) => {
    if (!studentPage.title?.trim()) {
      setError("Enter a page title before saving.");
      return false;
    }
    const heroImage = String(studentPage.heroImage || "").trim();
    if (heroImage && !heroImage.startsWith("/")) {
      try {
        const url = new URL(heroImage);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error();
      } catch {
        setError("Enter a valid HTTP(S) URL or uploaded path for the hero image.");
        return false;
      }
    }
    for (const [index, section] of (studentPage.sections || []).entries()) {
      if (isExcludedStudentSection(section)) {
        setError(`Remove the excluded "${section.heading}" section before saving.`);
        return false;
      }
      if (!section.heading?.trim()) {
        setError(`Enter a heading for section ${index + 1}.`);
        return false;
      }
    }
    for (const [index, resource] of (studentPage.resources || []).entries()) {
      if (!resource.title?.trim()) {
        setError(`Enter a title for resource ${index + 1}.`);
        return false;
      }
      if (isStudentsEraPage && !["activity", "report"].includes(resource.category || "activity")) {
        setError(`Choose Activities or Reports for item ${index + 1}.`);
        return false;
      }
      for (const [field, label] of [["imageUrl", "image"], ["pdfUrl", "PDF"]]) {
        const value = String(resource[field] || "").trim();
        if (!value || value.startsWith("/")) continue;
        try {
          const url = new URL(value);
          if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        } catch {
          setError(`Enter a valid HTTP(S) URL or uploaded path for the ${label} in resource ${index + 1}.`);
          return false;
        }
      }
      const videoUrl = String(resource.videoUrl || "").trim();
      if (videoUrl) {
        try {
          const url = new URL(videoUrl);
          const host = url.hostname.replace(/^www\./, "").toLowerCase();
          const videoId = host === "youtu.be"
            ? url.pathname.split("/").filter(Boolean)[0]
            : ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
              ? url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
              : "";
          if (!["http:", "https:"].includes(url.protocol) || !videoId) throw new Error();
        } catch {
          setError(`Enter a valid YouTube video URL for resource ${index + 1}.`);
          return false;
        }
      }
    }
    return true;
  };

  const uploadResourceAsset = async (index, asset) => {
    const fileKey = `${index}-${asset}`;
    const file = resourceFiles[fileKey];
    if (!file) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (isStudentsEraPage && !validateStudentsEraContent(content)) {
        setSaving(false);
        return;
      }
      const contentToSave = isStudentsEraPage ? { ...content, contentVersion: isNccPage ? 3 : 2 } : content;
      const saveResponse = await fetch(`${API_BASE}/api/site-pages/${selectedKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentToSave }),
      });
      const saveResult = await saveResponse.json();
      if (!saveResponse.ok || !saveResult.success) {
        throw new Error(saveResult.message || "Save the page resource before uploading its file.");
      }

      const assetType = asset === "imageUrl" ? "photo" : "document";
      await uploadFile(
        `/${selectedKey}/resources/${index}/${assetType}`,
        asset === "imageUrl" ? "photo" : "document",
        file,
        "Unable to upload resource file."
      );
      await loadPages();
      setResourceFiles((current) => {
        const updated = { ...current };
        delete updated[fileKey];
        return updated;
      });
      setSuccess(asset === "imageUrl" ? "Gallery image uploaded." : "Resource PDF uploaded.");
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload resource file.");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (index, field, value) => {
    const sections = [...(content.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    update("sections", sections);
  };

  const updateResource = (index, field, value) => {
    const resources = [...(content.resources || [])];
    resources[index] = { ...resources[index], [field]: value };
    update("resources", resources);
  };
  const addStudentResource = (title, category) => {
    const resources = content.resources || [];
    update("resources", [
      ...resources,
      {
        title,
        description: "",
        imageUrl: "",
        videoUrl: "",
        pdfTitle: "",
        pdfUrl: "",
        category,
        ...(isNccPage ? { academicYear: "", outcome: "" } : {}),
        display_order: resources.length + 1,
        is_active: 1,
      },
    ]);
  };
  const filteredSections = (content?.sections || [])
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => {
      const query = sectionQuery.trim().toLowerCase();
      const matchesQuery = !query || [section.heading, section.text, ...(section.items || [])]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const active = section.is_active !== false && section.is_active !== 0 && section.is_active !== "0";
      return matchesQuery && (sectionStatus === "all" || (sectionStatus === "active" ? active : !active));
    });
  const filteredResources = (content?.resources || [])
    .map((resource, index) => ({ resource, index }))
    .filter(({ resource }) => {
      const query = resourceQuery.trim().toLowerCase();
      const matchesQuery = !query || [resource.title, resource.description, resource.videoUrl, resource.pdfTitle, resource.academicYear, resource.outcome, resource.category]
        .some((value) => String(value || "").toLowerCase().includes(query));
      const active = resource.is_active !== false && resource.is_active !== 0 && resource.is_active !== "0";
      const matchesCategory = !isStudentsEraPage || resourceCategoryFilter === "all"
        || (resource.category || "activity") === resourceCategoryFilter;
      return matchesQuery && matchesCategory && (resourceStatus === "all" || (resourceStatus === "active" ? active : !active));
    });
  const activeProfileFields = selectedKey === "founder"
    ? founderProfileFields
    : isNccPage
      ? [["name", "Head of Department name"], ["designation", "Designation"], ["qualification", "Qualification"], ["experience", "Experience"], ["specialisation", "Specialisation"]]
    : isStudentsEraPage
      ? [["name", "Leader name"], ["designation", "Designation"], ["qualification", "Qualification"], ["experience", "Experience"], ["specialisation", "Specialisation"]]
      : profileFields;
  const availablePages = pageKeys ? pages.filter((item) => pageKeys.includes(item.page_key)) : pages;

  if (loading) {
    return <div className="flex min-h-80 items-center justify-center text-sm text-slate-500">Loading page content...</div>;
  }

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website content</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {pageKeys?.includes("founder")
              ? "Manage Founder Page"
              : isStudentsEraPage
                ? `Manage ${content?.title || pageMap[selectedKey]?.title || "Students' Era Page"}`
                : "Manage Pages"}
          </h1>
        </div>
        {(!pageKeys || pageKeys.length > 1) && (
          <label className="grid gap-1 text-xs font-semibold text-slate-600">
            Select page
            <select value={selectedKey} onChange={(event) => setSelectedKey(event.target.value)} className="min-w-64 border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800">
              {(pageKeys ? pageKeys.map((key) => pages.find((item) => item.page_key === key) || { page_key: key, content: pageMap[key] || {} }) : availablePages).map((item) => <option key={item.page_key} value={item.page_key}>{item.content.title || item.page_key}</option>)}
            </select>
          </label>
        )}
      </header>

      {error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      {content && (
        <div className="space-y-8">
          <section className="grid gap-4 border-b border-slate-200 pb-7 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Page title
              <input value={content.title || ""} onChange={(event) => update("title", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Subtitle
              <input value={content.subtitle || ""} onChange={(event) => update("subtitle", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">Introduction
              <textarea rows={3} value={content.description || ""} onChange={(event) => update("description", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            {selectedKey !== "naac-ssr" && (
              <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">{isNccPage ? "Awards and achievements, one per line" : "Highlights, one per line"}
                <textarea rows={3} value={(content.highlights || []).join("\n")} onChange={(event) => update("highlights", event.target.value.split("\n").filter((item) => item.trim()))} className="border border-slate-300 px-3 py-2 font-normal" />
              </label>
            )}
          </section>

          {isStudentsEraPage && (
            <section className="space-y-4 border-b border-slate-200 pb-7">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Hero image</h2>
                <p className="mt-1 text-sm text-slate-500">This image appears behind the page title and introduction.</p>
              </div>
              {content.heroImage && (
                <img
                  src={content.heroImage.startsWith("http") ? content.heroImage : `${API_BASE}${content.heroImage}`}
                  alt={`${content.title || "Page"} hero preview`}
                  className="h-32 w-full max-w-xl border border-slate-200 object-cover"
                />
              )}
              <label className="grid max-w-xl gap-1 text-sm font-semibold text-slate-700">Hero image URL or uploaded path
                <input value={content.heroImage || ""} onChange={(event) => update("heroImage", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {heroImageFile?.name || "Choose hero image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setHeroImageFile(event.target.files?.[0] || null)} />
                </label>
                <button type="button" onClick={uploadHeroImage} disabled={!heroImageFile || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                  <Upload size={16} /> Upload hero image
                </button>
              </div>
              <p className="text-xs text-slate-500">JPG, PNG, or WebP, up to 5 MB.</p>
            </section>
          )}

          {(selectedKey === "iqac-coordinator" || selectedKey === "founder" || isStudentsEraPage) && (
            <section className="space-y-4 border-b border-slate-200 pb-7">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{isNccPage ? "NCC Head of Department" : isStudentsEraPage ? "Leader Profile" : selectedKey === "founder" ? "Founder Profile" : "Coordinator Profile"}</h2>
                <p className="mt-1 text-sm text-slate-500">These details appear on the public {isNccPage ? "NCC Head of Department profile" : isStudentsEraPage ? "leader profile" : selectedKey === "founder" ? "Founder" : "Coordinator"} page.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeProfileFields.map(([field, label]) => (
                  <label key={field} className="grid gap-1 text-sm font-semibold text-slate-700">{label}
                    <input value={content.profile?.[field] || ""} onChange={(event) => updateProfile(field, event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                ))}
              </div>
              {content.profile?.photo && <img src={content.profile.photo.startsWith("http") ? content.profile.photo : `${API_BASE}${content.profile.photo}`} alt={content.profile?.name || (isNccPage ? "NCC Head of Department" : isStudentsEraPage ? "Leader profile" : selectedKey === "founder" ? "Founder profile" : "Coordinator profile")} className="h-24 w-24 border border-slate-200 object-cover" />}
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {photo?.name || `Choose ${isNccPage ? "HOD" : isStudentsEraPage ? "leader" : selectedKey === "founder" ? "founder" : "coordinator"} photo`}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
                </label>
                <button type="button" onClick={uploadPhoto} disabled={!photo || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                  <Upload size={16} /> Upload {isNccPage ? "HOD photo" : isStudentsEraPage ? "leader photo" : "photo"}
                </button>
              </div>
              <p className="text-xs text-slate-500">JPG, PNG, or WebP, up to 5 MB.</p>
              {content.profile?.pdf && (
                <a
                  href={content.profile.pdf.startsWith("http") ? content.profile.pdf : `${API_BASE}${content.profile.pdf}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline"
                >
                  <FileText size={16} /> Current {isNccPage ? "HOD profile PDF" : isStudentsEraPage ? "leader profile PDF" : selectedKey === "founder" ? "founder document" : "coordinator profile PDF"} <ExternalLink size={14} />
                </a>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {profilePdf?.name || `Choose ${isNccPage ? "HOD " : isStudentsEraPage ? "leader " : ""}profile PDF`}
                  <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => setProfilePdf(event.target.files?.[0] || null)} />
                </label>
                <button type="button" onClick={uploadProfilePdf} disabled={!profilePdf || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                  <Upload size={16} /> Upload {isNccPage ? "HOD profile PDF" : isStudentsEraPage ? "leader profile PDF" : selectedKey === "founder" ? "founder document" : "profile PDF"}
                </button>
              </div>
              <p className="text-xs text-slate-500">PDF only, up to 20 MB.</p>
            </section>
          )}

          {isStudentsEraPage && (
            <section className="space-y-4 border-b border-slate-200 pb-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{isNccPage ? "NCC Activities and Reports" : "Activities, Reports, and Media"}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {isNccPage
                      ? "Keep dated activity records, participation/outcomes, photographs, and supporting reports for NAAC evidence."
                      : "Add photos, YouTube video links, or reports. New items appear below with their upload and editing controls."}
                  </p>
                </div>
                {isNccPage ? (
                  <button type="button" onClick={() => addStudentResource("", "activity")} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Add activity or report
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => addStudentResource("New photo", "activity")} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add photo</button>
                    <button type="button" onClick={() => addStudentResource("New video", "activity")} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add YouTube video</button>
                    <button type="button" onClick={() => addStudentResource("New report", "report")} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add report</button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="relative min-w-56 flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search images, videos, and documents</span>
                  <input value={resourceQuery} onChange={(event) => setResourceQuery(event.target.value)} placeholder="Search images, videos, and documents" className="w-full border border-slate-300 py-2 pl-9 pr-3 text-sm" />
                </label>
                <select aria-label="Filter resources by status" value={resourceStatus} onChange={(event) => setResourceStatus(event.target.value)} className="border border-slate-300 bg-white px-3 py-2 text-sm">
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {isStudentsEraPage && (
                  <select aria-label="Filter student resources by category" value={resourceCategoryFilter} onChange={(event) => setResourceCategoryFilter(event.target.value)} className="border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="all">Activities and reports</option>
                    <option value="activity">Activities</option>
                    <option value="report">Reports</option>
                  </select>
                )}
                <span className="self-center text-xs text-slate-500">{filteredResources.length} of {(content.resources || []).length} items</span>
              </div>
              {filteredResources.map(({ resource, index }) => (
                <div key={`students-resource-${index}`} className="grid gap-3 border-l-2 border-slate-300 pl-4 md:grid-cols-2">
                  {isStudentsEraPage && (
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">Sidebar section
                      <select value={resource.category || "activity"} onChange={(event) => updateResource(index, "category", event.target.value)} className="border border-slate-300 bg-white px-3 py-2 font-normal">
                        <option value="activity">Activity</option>
                        <option value="report">Report</option>
                      </select>
                    </label>
                  )}
                  {[
                    ["title", "Item title"],
                    ...(isNccPage ? [["academicYear", "Academic year"], ["outcome", "Participation / outcome"]] : []),
                    ["description", "Description"],
                    ["imageUrl", "Image URL or uploaded image path"],
                    ["videoUrl", "YouTube video URL"],
                    ["pdfTitle", "PDF link title"],
                    ["pdfUrl", "PDF URL or uploaded document path"],
                  ].map(([field, label]) => (
                    <label key={field} className="grid gap-1 text-sm font-semibold text-slate-700">{label}
                      <input value={resource[field] || ""} onChange={(event) => updateResource(index, field, event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                    </label>
                  ))}
                  {resource.imageUrl && (
                    <a href={resource.imageUrl.startsWith("http") ? resource.imageUrl : `${API_BASE}${resource.imageUrl}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-800 hover:underline md:col-span-2">View current image</a>
                  )}
                  <div className="flex flex-wrap items-center gap-2 md:col-span-2">
                    <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      {resourceFiles[`${index}-imageUrl`]?.name || "Choose image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setResourceFiles((current) => ({ ...current, [`${index}-imageUrl`]: event.target.files?.[0] || null }))} />
                    </label>
                    <button type="button" onClick={() => uploadResourceAsset(index, "imageUrl")} disabled={!resourceFiles[`${index}-imageUrl`] || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                      <Upload size={15} /> Upload image
                    </button>
                    {resource.pdfUrl && (
                      <a href={resource.pdfUrl.startsWith("http") ? resource.pdfUrl : `${API_BASE}${resource.pdfUrl}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-800 hover:underline">View current PDF</a>
                    )}
                    <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      {resourceFiles[`${index}-pdfUrl`]?.name || "Choose PDF"}
                      <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => setResourceFiles((current) => ({ ...current, [`${index}-pdfUrl`]: event.target.files?.[0] || null }))} />
                    </label>
                    <button type="button" onClick={() => uploadResourceAsset(index, "pdfUrl")} disabled={!resourceFiles[`${index}-pdfUrl`] || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                      <Upload size={15} /> Upload PDF
                    </button>
                  </div>
                  <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
                    <input type="number" value={resource.display_order ?? index + 1} onChange={(event) => updateResource(index, "display_order", Number(event.target.value) || 0)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" checked={resource.is_active !== false && resource.is_active !== 0 && resource.is_active !== "0"} onChange={(event) => updateResource(index, "is_active", event.target.checked ? 1 : 0)} />
                      Active
                    </label>
                    <button type="button" onClick={() => update("resources", content.resources.filter((_, resourceIndex) => resourceIndex !== index))} className="px-2 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Remove item</button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {selectedKey === "naac-ssr" && (
            <section className="space-y-4 border-b border-slate-200 pb-7">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">SSR PDF</h2>
                <p className="mt-1 text-sm text-slate-500">The public SSR page contains the report link and View AQAR navigation.</p>
              </div>
              {content.pdfUrl && (
                <a href={content.pdfUrl.startsWith("http") ? content.pdfUrl : `${API_BASE}${content.pdfUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline">
                  <FileText size={16} /> Current SSR PDF <ExternalLink size={14} />
                </a>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  {pagePdf?.name || "Choose SSR PDF"}
                  <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => setPagePdf(event.target.files?.[0] || null)} />
                </label>
                <button type="button" onClick={uploadPagePdf} disabled={!pagePdf || saving} className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
                  <Upload size={16} /> Upload SSR PDF
                </button>
              </div>
              <p className="text-xs text-slate-500">PDF only, up to 20 MB.</p>
            </section>
          )}

          {selectedKey === "e-contents" && (
            <section className="space-y-4 border-b border-slate-200 pb-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Online class resources</h2>
                  <p className="mt-1 text-sm text-slate-500">Add faculty rows with their class and learning-material links.</p>
                </div>
                <button type="button" onClick={() => update("resources", [...(content.resources || []), { facultyName: "", subject: "", classUrl: "", resourceUrl: "" }])} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add faculty resource</button>
              </div>
              {(content.resources || []).map((resource, index) => (
                <div key={resource.id || index} className="grid gap-3 border-l-2 border-slate-300 pl-4 md:grid-cols-2">
                  {[["facultyName", "Faculty name"], ["subject", "Subject"], ["classUrl", "Online class URL"], ["resourceUrl", "Digital material URL"]].map(([field, label]) => (
                    <label key={field} className="grid gap-1 text-sm font-semibold text-slate-700">{label}
                      <input value={resource[field] || ""} onChange={(event) => updateResource(index, field, event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                    </label>
                  ))}
                  <button type="button" onClick={() => update("resources", content.resources.filter((_, rowIndex) => rowIndex !== index))} className="justify-self-start px-2 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Remove resource</button>
                </div>
              ))}
            </section>
          )}

          {selectedKey !== "naac-ssr" && (
          <section className="space-y-4 border-b border-slate-200 pb-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Page sections</h2>
                <p className="mt-1 text-sm text-slate-500">Edit the page content, order, and publication status.</p>
              </div>
              <button type="button" onClick={() => update("sections", [...(content.sections || []), { heading: "New section", text: "", items: [], display_order: (content.sections || []).length + 1, is_active: 1 }])} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Add section</button>
            </div>
            {isStudentsEraPage && (
              <div className="flex flex-wrap gap-3">
                <label className="relative min-w-56 flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search page sections</span>
                  <input value={sectionQuery} onChange={(event) => setSectionQuery(event.target.value)} placeholder="Search page sections" className="w-full border border-slate-300 py-2 pl-9 pr-3 text-sm" />
                </label>
                <select aria-label="Filter sections by status" value={sectionStatus} onChange={(event) => setSectionStatus(event.target.value)} className="border border-slate-300 bg-white px-3 py-2 text-sm">
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className="self-center text-xs text-slate-500">{filteredSections.length} of {(content.sections || []).length} sections</span>
              </div>
            )}
            {(isStudentsEraPage ? filteredSections : (content.sections || []).map((section, index) => ({ section, index }))).map(({ section, index }) => (
              <div key={`${selectedKey}-${index}`} className="grid gap-3 border-l-2 border-slate-300 pl-4 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">Section heading
                    <input value={section.heading || ""} onChange={(event) => updateSection(index, "heading", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">Section text
                    <textarea rows={3} value={section.text || ""} onChange={(event) => updateSection(index, "text", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  {isStudentsEraPage && (
                    <>
                      <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">List items, one per line
                        <textarea rows={3} value={(section.items || []).join("\n")} onChange={(event) => updateSection(index, "items", event.target.value.split("\n").filter((item) => item.trim()))} className="border border-slate-300 px-3 py-2 font-normal" />
                      </label>
                      <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
                        <input type="number" value={section.display_order ?? index + 1} onChange={(event) => updateSection(index, "display_order", Number(event.target.value) || 0)} className="border border-slate-300 px-3 py-2 font-normal" />
                      </label>
                      <label className="inline-flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={section.is_active !== false && section.is_active !== 0 && section.is_active !== "0"} onChange={(event) => updateSection(index, "is_active", event.target.checked ? 1 : 0)} />
                        Active
                      </label>
                    </>
                  )}
                </div>
                <button type="button" onClick={() => update("sections", content.sections.filter((_, sectionIndex) => sectionIndex !== index))} className="self-start px-2 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Remove</button>
              </div>
            ))}
          </section>
          )}

          <section className="grid gap-4 border-b border-slate-200 pb-7 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Call-to-action label
              <input value={content.cta?.label || ""} onChange={(event) => update("cta", { ...(content.cta || {}), label: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Call-to-action URL
              <input value={content.cta?.url || content.cta?.to || ""} onChange={(event) => update("cta", { ...(content.cta || {}), url: event.target.value })} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
          </section>

          <div className="flex justify-end">
            <button type="button" onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19477f] disabled:opacity-60">
              {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
              Save page
            </button>
          </div>
          <p className="text-right text-xs text-slate-500">Save page also uploads any files you have selected.</p>
        </div>
      )}
    </main>
  );
}