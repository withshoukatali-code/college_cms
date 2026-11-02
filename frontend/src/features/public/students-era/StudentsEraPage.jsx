import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Play,
  Search,
  UserRound,
} from "lucide-react";
import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";
import { pageMap } from "../StaticPage";
import { studentsEraPages } from "./studentsEraPages";

const configuredApiBase = import.meta.env.VITE_API_URL
  ?.replace(/\/+$/, "")
  .replace(/\/api$/i, "");
const API_BASE = configuredApiBase || (
  import.meta.env.DEV ? "http://localhost:5000" : window.location.origin
);
const accentByKind = {
  overview: "#0f3262",
  service: "#0f5d4f",
  activities: "#7c3aed",
  support: "#a33b62",
  fitness: "#167565",
  careers: "#a45a1b",
};
const isInactive = (item) => item?.is_active === false || item?.is_active === 0 || item?.is_active === "0";
const excludedSectionTitles = new Set(["volunteering", "outreach", "community development"]);
const excludedSectionTerms = ["performance", "competition", "student creativity"];
const byOrder = (left, right) => Number(left.display_order || 0) - Number(right.display_order || 0);
const defaultNccProfile = {
  name: "Lt. Dr. S. V. Patil",
  designation: "NCC Officer",
  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  pdf: "",
  qualification: "M.A., M.P.Ed., Ph.D.",
  experience: "10+ years in student leadership and training",
  specialisation: "Cadet training, discipline, and youth leadership",
};
const defaultStudentEraProfile = {
  name: "Lt. Dr. S. V. Patil",
  designation: "Student Development Coordinator",
  qualification: "M.A., M.P.Ed., Ph.D.",
  experience: "10+ years in student leadership and training",
  specialisation: "Cadet training, discipline, and youth leadership",
  pdf: "",
};
const studentEraDesignations = {
  "students-era-nss": "NSS Programme Officer",
  "students-era-cultural-activities": "Cultural Activities Coordinator",
  "students-era-womens-empowerment": "Women's Empowerment Coordinator",
  "students-era-sports": "Sports Coordinator",
  "students-era-gym": "Gym Instructor",
  "students-era-career-guidance": "Career Guidance and Counselling Coordinator",
  "students-era-seminars": "Seminar Coordinator",
  "students-era-placements": "Placement Officer",
};
const studentsEraHeaderBackground = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";
const nccGalleryImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
];
const nccVideoCards = [
  { title: "NCC Orientation Programme", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", thumbnail: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg" },
  { title: "Cadet Leadership Session", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg" },
  { title: "Campus Training Highlights", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", thumbnail: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg" },
];

function resolveFileUrl(value) {
  if (!value) return "";
  if (/^(https?:\/\/|blob:|data:)/i.test(value)) return value;
  const apiOrigin = new URL(API_BASE, window.location.origin).origin;
  return new URL(value.startsWith("/") ? value : `/${value}`, `${apiOrigin}/`).href;
}

function getYouTubeVideoId(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      return url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] || "";
    }
  } catch {
    return "";
  }
  return "";
}

function toVideoCard(resource) {
  const videoId = getYouTubeVideoId(resource.videoUrl);
  return {
    title: resource.title || "Student activity video",
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    description: resource.description,
  };
}

function NccResourceSection({ title, description, resources }) {
  return (
    <section aria-label={title}>
      <div className="border-b-2 border-[#0f3262] pb-3">
        <h2 className="text-lg font-bold text-[#0f3262]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {resources.length ? (
        <ul className="divide-y divide-slate-200">
          {resources.map((resource) => (
            <li key={`${resource.sourceIndex}-${resource.title}`} className="py-4">
              <div className="flex items-start gap-3">
                {resource.imageUrl && (
                  <img
                    src={resolveFileUrl(resource.imageUrl)}
                    alt={resource.title || `${title} item`}
                    loading="lazy"
                    className="size-16 shrink-0 bg-slate-100 object-cover"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-6 text-slate-900">{resource.title}</h3>
                  {resource.academicYear && <p className="mt-0.5 text-xs font-semibold text-amber-700">{resource.academicYear}</p>}
                  {resource.description && <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>}
                  {resource.outcome && <p className="mt-2 text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-600">Outcome:</span> {resource.outcome}</p>}
                  {getYouTubeVideoId(resource.videoUrl) && (
                    <a href={toVideoCard(resource).url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f3262] hover:underline">
                      <Play size={14} fill="currentColor" /> Watch video <ArrowRight size={14} />
                    </a>
                  )}
                  {resource.pdfUrl && (
                    <a href={resolveFileUrl(resource.pdfUrl)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f3262] hover:underline">
                      <FileText size={15} /> {resource.pdfTitle || "View report"} <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-b border-slate-200 py-4 text-sm text-slate-500">No {title.toLowerCase()} have been published yet.</p>
      )}
    </section>
  );
}

function PhotoGallerySection({ title, images }) {
  return (
    <section className="border-t border-slate-200 pt-7 pb-10 lg:pb-14">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#eead09]">Photo Gallery</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0f3262]">{title}</h2>
      </div>
      {images.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={`${image.src}-${index}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <img src={resolveFileUrl(image.src)} alt={image.title || `${title} ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
      ) : (
        <p className="border-y border-slate-200 py-8 text-center text-sm text-slate-500">No photos have been published yet.</p>
      )}
    </section>
  );
}

function VideoGallerySection({ title, videos }) {
  return (
    <section className="border-t border-slate-200 pt-7 pb-14">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#eead09]">Video Gallery</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0f3262]">{title}</h2>
      </div>
      {videos.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {videos.map((video) => (
            <a key={`${video.url}-${video.title}`} href={video.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative">
                <img src={video.thumbnail} alt={video.title} loading="lazy" className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[#0f3262] shadow-lg">
                    <Play size={18} fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-sm font-bold text-slate-900">{video.title}</h3>
                {video.description && <p className="mt-1.5 text-xs leading-5 text-slate-500">{video.description}</p>}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="border-y border-slate-200 py-8 text-center text-sm text-slate-500">No videos have been published yet.</p>
      )}
    </section>
  );
}

function StudentsEraPage({ pageKey }) {
  const config = studentsEraPages.find((item) => item.pageKey === pageKey) || studentsEraPages[0];
  const fallback = pageMap[pageKey] || pageMap["students-era"];
  const [page, setPage] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceQuery, setResourceQuery] = useState("");
  const accent = accentByKind[config.kind] || accentByKind.overview;
  const pageHeroImage = resolveFileUrl(page.heroImage || studentsEraHeaderBackground);

  useEffect(() => {
    let cancelled = false;
    const loadPage = async () => {
      try {
        let response = await fetch(`${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`);
        if (response.status === 404) {
          const seedResponse = await fetch(`${API_BASE}/api/site-pages/seed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pages: [{ page_key: pageKey, content: fallback }] }),
          });
          const seedResult = await seedResponse.json();
          if (!seedResponse.ok || !seedResult.success) {
            throw new Error(seedResult.message || "Unable to initialize this student page.");
          }
          response = await fetch(`${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`);
        }

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load this student page.");
        }

        const saved = result.data.content || {};
        const useSavedCollections = Number(saved.contentVersion || 0) >= (pageKey === "students-era-ncc" ? 3 : 2);
        if (!cancelled) {
          setPage({
            ...fallback,
            ...saved,
            highlights: useSavedCollections && Array.isArray(saved.highlights)
              ? saved.highlights
              : Array.isArray(saved.highlights) && saved.highlights.length
                ? saved.highlights
                : fallback.highlights || [],
            sections: useSavedCollections && Array.isArray(saved.sections)
              ? saved.sections
              : Array.isArray(saved.sections) && saved.sections.length
                ? saved.sections
                : fallback.sections || [],
            resources: Array.isArray(saved.resources) ? saved.resources : fallback.resources || [],
          });
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Unable to load this student page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    setPage(fallback);
    setLoading(true);
    setError("");
    loadPage();
    return () => {
      cancelled = true;
    };
  }, [pageKey, fallback]);

  const sections = (page.sections || [])
    .filter((section) => {
      const heading = String(section.heading || "").trim().toLowerCase();
      return !isInactive(section)
        && !excludedSectionTitles.has(heading)
        && !heading.startsWith("about ")
        && !excludedSectionTerms.some((term) => heading.includes(term));
    })
    .sort(byOrder);
  const highlights = (page.highlights || []).filter((highlight) => {
    const value = String(highlight || "").trim().toLowerCase();
    return !excludedSectionTerms.some((term) => value.includes(term));
  });
  const resources = (page.resources || [])
    .map((resource, index) => ({ ...resource, sourceIndex: index }))
    .filter((resource) => !isInactive(resource))
    .sort(byOrder);
  const documents = resources.filter((resource) => resource.pdfUrl);
  const visibleDocuments = useMemo(() => documents.filter((resource) => {
    const query = resourceQuery.trim().toLowerCase();
    const matchesText = !query || [resource.title, resource.description, resource.pdfTitle]
      .some((value) => String(value || "").toLowerCase().includes(query));
    return matchesText;
  }), [documents, resourceQuery]);
  const videoResources = resources.filter((resource) => getYouTubeVideoId(resource.videoUrl));

  if (pageKey === "students-era-ncc") {
    const activities = resources.filter((resource) => resource.category !== "report");
    const reports = resources.filter((resource) => resource.category === "report");
    const profile = { ...defaultNccProfile, ...(page.profile || {}) };
    const profileDetails = [
      ["Designation", profile.designation],
      ["Qualification", profile.qualification],
      ["Experience", profile.experience],
      ["Specialisation", profile.specialisation],
    ].filter(([, value]) => value);
    const profileLink = profile.pdf ? resolveFileUrl(profile.pdf) : "";
    const activityImages = resources
      .filter((resource) => resource.imageUrl && resource.category !== "report")
      .map((resource) => ({ src: resource.imageUrl, title: resource.title }));
    const galleryImages = activityImages.length
      ? activityImages
      : nccGalleryImages.map((src, index) => ({ src, title: `NCC gallery ${index + 1}` }));
    const galleryVideos = videoResources.length ? videoResources.map(toVideoCard) : nccVideoCards;

    return (
      <div className="min-h-screen bg-white text-slate-800">
        <TopBar />
        <Navbar />

        <header
          className="mb-[30px] border-b border-[#0b2444] bg-cover bg-center bg-no-repeat text-white"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(11,36,68,0.88), rgba(17,76,118,0.75)), url(${pageHeroImage})`,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-blue-100">
              <Link to="/students-era" className="hover:text-amber-300">Students' Era</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white">NCC</span>
            </nav>
            <div className="max-w-4xl border-l-4 border-amber-400 pl-5 sm:pl-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Student development · NCC</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{page.title || config.title}</h1>
              {page.subtitle && <p className="mt-2 text-base font-semibold text-blue-100">{page.subtitle}</p>}
              {page.description && <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base">{page.description}</p>}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" aria-hidden="true" />
        </header>

        <main className="mx-auto grid max-w-7xl items-start gap-x-10 gap-y-8 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:pb-10">
          <div className="min-w-0">
            <section className="mb-6 grid items-start gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 pt-[30px] shadow-[0_15px_40px_rgba(15,23,42,0.08)] sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
              <div className="flex flex-col justify-start">
                <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Building leadership through discipline, duty and unity</h2>
                <p className="mt-4 mb-6 text-sm leading-7 text-slate-600 sm:text-base">
                  The National Cadet Corps develops character, comradeship, discipline, leadership and social responsibility among students. Through training camps, community service, drills and national events, cadets sharpen their confidence while engaging with values that prepare them for both personal and civic life.
                </p>
              </div>

              <div className="relative flex items-center">
                <img
                  src={pageHeroImage}
                  alt="NCC training and leadership activities"
                  className="h-[187px] w-full rounded-2xl object-cover shadow-sm"
                />
              </div>
            </section>

            <article className="min-w-0">
              {loading && <p className="py-4 text-sm text-slate-500">Loading NCC information...</p>}
              {error && <p role="alert" className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              {sections.map((section, index) => (
                <section key={`${section.heading}-${index}`} className={`border-b border-slate-200 py-6 first:pt-0 sm:py-8 ${index === 0 ? "sm:pt-0" : ""}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-7 w-1 shrink-0 bg-amber-500" aria-hidden="true" />
                    <h2 className="text-xl font-bold tracking-tight text-[#0f3262] sm:text-2xl">{section.heading || `NCC Information ${index + 1}`}</h2>
                  </div>
                  {section.text && <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{section.text}</p>}
                  {Array.isArray(section.items) && section.items.length > 0 && (
                    <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {section.items.filter(Boolean).map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {highlights.length > 0 && (
                <section className="py-6 sm:py-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-7 w-1 shrink-0 bg-amber-500" aria-hidden="true" />
                    <h2 className="text-xl font-bold tracking-tight text-[#0f3262] sm:text-2xl">Awards and Achievements</h2>
                  </div>
                  <ul className="divide-y divide-slate-200 border-y border-slate-200">
                    {highlights.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex gap-4 py-4">
                        <span className="font-serif text-sm font-bold text-amber-700">{String(index + 1).padStart(2, "0")}</span>
                        <span className="text-sm leading-7 text-slate-700 sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
            <PhotoGallerySection title="NCC moments from campus life" images={galleryImages} />
            <VideoGallerySection title="NCC highlights and training videos" videos={galleryVideos} />
          </div>

          <aside className="space-y-8">
            <section id="ncc-profile" className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0f3262]">{profile.name || "NCC Head of Department"}</h2>
              {profile.designation && <p className="mt-1 text-sm font-medium text-[#0f3262]">{profile.designation}</p>}
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Head of Department</p>
              {profile.photo ? (
                <img src={resolveFileUrl(profile.photo)} alt={profile.name || "NCC Head of Department"} className="mt-4 aspect-[4/3] w-full rounded-xl bg-slate-200 object-cover" />
              ) : (
                <div className="mt-4 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#e8eef5] text-[#0f3262]" aria-label="Head of Department photo not available">
                  <UserRound size={48} strokeWidth={1.2} />
                </div>
              )}
              {profileDetails.length > 0 && (
                <dl className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                  {profileDetails.filter(([label]) => label !== "Designation").map(([label, value]) => (
                    <div key={label} className="py-2.5">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                      <dd className="mt-1 text-sm leading-5 text-slate-700">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {profileLink && (
                <a href={profileLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f3262] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#071f3d]">
                  <FileText size={16} /> View Profile
                </a>
              )}
            </section>
            <NccResourceSection
              title="Activities"
              description="Training, camps, events, and cadet participation."
              resources={activities}
            />
            <NccResourceSection
              title="Reports"
              description="Year-wise activity reports and supporting evidence."
              resources={reports}
            />
          </aside>
        </main>

        <PublicFooter />
      </div>
    );
  }

  const profile = {
    ...defaultStudentEraProfile,
    ...(page.profile || {}),
    name: page.profile?.name || defaultStudentEraProfile.name,
    designation: page.profile?.designation || studentEraDesignations[pageKey] || defaultStudentEraProfile.designation,
    qualification: page.profile?.qualification || defaultStudentEraProfile.qualification,
    experience: page.profile?.experience || defaultStudentEraProfile.experience,
    specialisation: page.profile?.specialisation || defaultStudentEraProfile.specialisation,
    pdf: page.profile?.pdf || defaultStudentEraProfile.pdf,
  };
  const genericProfileDetails = [
    ["Designation", profile.designation],
    ["Qualification", profile.qualification],
    ["Experience", profile.experience],
    ["Specialisation", profile.specialisation],
  ].filter(([, value]) => value);
  const genericProfileLink = profile.pdf ? (profile.pdf.startsWith("#") ? profile.pdf : resolveFileUrl(profile.pdf)) : "#page-profile";
  const isGenericProfileAnchor = typeof profile.pdf === "string" && profile.pdf.startsWith("#");
  const genericFeatureImage = resources.find((resource) => resource.imageUrl)?.imageUrl || pageHeroImage;
  const galleryImages = resources.filter((resource) => resource.imageUrl).map((resource) => ({ src: resource.imageUrl, title: resource.title }));
  const galleryVideos = videoResources.map(toVideoCard);
  const activities = resources.filter((resource) => resource.category !== "report");
  const reports = resources.filter((resource) => resource.category === "report");

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <TopBar />
      <Navbar />

      <header
        className="mb-[30px] border-b border-[#0b2444] bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(11,36,68,0.88), rgba(17,76,118,0.75)), url(${pageHeroImage})`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-0 sm:px-6 sm:pt-10 sm:pb-0 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-blue-100">
            <Link to="/students-era" className="hover:text-amber-300">Students' Era</Link>
            {pageKey !== "students-era" && <span className="mx-2 text-blue-300">/</span>}
            {pageKey !== "students-era" && <span className="text-white">{page.title || config.title}</span>}
          </nav>
          <div className="max-w-4xl border-l-4 border-amber-400 pl-5 sm:pl-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Student life and development</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{page.title || config.title}</h1>
            {page.subtitle && <p className="mt-2 text-base font-semibold text-blue-100">{page.subtitle}</p>}
            {page.description && <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-50 sm:text-base">{page.description}</p>}
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" aria-hidden="true" />
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-x-10 gap-y-8 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:pb-10">
        <div className="min-w-0">
          <section className="mb-6 grid items-start gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 pt-[30px] shadow-[0_15px_40px_rgba(15,23,42,0.08)] sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
            <div className="flex flex-col justify-start">
              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{page.subtitle || "Student growth and engagement"}</h2>
              {page.description && (
                <p className="mt-4 mb-6 text-sm leading-7 text-slate-600 sm:text-base">{page.description}</p>
              )}
            </div>

            <div className="relative min-h-[187px]">
              <img src={resolveFileUrl(genericFeatureImage)} alt={page.title || config.title} className="h-[187px] w-full rounded-2xl object-cover shadow-sm" />
            </div>
          </section>

          <div className="min-w-0">
          {loading && <p className="py-4 text-sm text-slate-500">Loading student information...</p>}
          {error && <p role="alert" className="mb-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {highlights.length > 0 && (
            <section aria-label="Highlights" className="mb-8 border-y border-slate-200 py-4">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {config.kind === "overview" && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-[#0f3262]">Explore student life</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">Choose a Students' Era area to view its information, activities, and resources.</p>
              <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                {studentsEraPages.filter((item) => item.pageKey !== "students-era").map((item) => (
                  <li key={item.pageKey}>
                    <Link to={item.route} className="group flex items-center justify-between gap-4 py-4 text-sm font-semibold text-slate-800 transition hover:text-[#0f3262]">
                      {item.title}
                      <ArrowRight size={16} className="shrink-0 transition group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`} className={`border-t border-slate-200 py-7 first:border-t-0 first:pt-0 sm:py-8 ${index === 0 ? "sm:pt-0" : ""}`}>
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-1 h-7 w-1 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{section.heading || `Information ${index + 1}`}</h2>
              </div>
              {section.text && <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{section.text}</p>}
              {Array.isArray(section.items) && section.items.length > 0 && (
                <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {section.items.filter(Boolean).map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {documents.length > 0 && (
            <section className="border-t border-slate-200 py-7 sm:py-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Documents and resources</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Browse related student documents and resources.</p>
                </div>
                <label className="relative min-w-56 flex-1 sm:max-w-xs">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search documents</span>
                  <input value={resourceQuery} onChange={(event) => setResourceQuery(event.target.value)} placeholder="Search documents" className="w-full border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0f3262]" />
                </label>
              </div>
              <p className="mt-4 text-xs text-slate-500">{visibleDocuments.length} of {documents.length} documents</p>

              {visibleDocuments.length ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {visibleDocuments.map((resource) => (
                    <article key={`${resource.sourceIndex}-${resource.title}`} className="border-b border-slate-200 pb-5">
                      <h3 className="mt-4 text-base font-bold text-slate-900">{resource.title}</h3>
                      {resource.description && <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>}
                      {resource.pdfUrl && (
                        <a href={resolveFileUrl(resource.pdfUrl)} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0f3262] hover:underline">
                          <FileText size={16} /> {resource.pdfTitle || "View document"}
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-5 border-y border-slate-200 py-8 text-center text-sm text-slate-500">No matching documents found.</p>
              )}
            </section>
          )}
          </div>
          <PhotoGallerySection title={`${page.title || config.title} activities and events`} images={galleryImages} />
          <VideoGallerySection title={`${page.title || config.title} videos`} videos={galleryVideos} />
        </div>

        <aside className="space-y-8">
          <section id="page-profile" className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h2 className="mt-1 text-lg font-bold text-[#0f3262]">{profile.name || "Department Lead"}</h2>
            {profile.designation && <p className="mt-1 text-sm font-medium text-[#0f3262]">{profile.designation}</p>}
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Head of Department</p>
            {profile.photo ? (
              <img src={resolveFileUrl(profile.photo)} alt={profile.name || page.title || config.title} className="mt-4 aspect-[4/3] w-full rounded-xl bg-slate-200 object-cover" />
            ) : (
              <div className="mt-4 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#e8eef5] text-[#0f3262]" aria-label="Profile image not available">
                <UserRound size={46} strokeWidth={1.2} />
              </div>
            )}
            {genericProfileDetails.length > 0 && (
              <dl className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {genericProfileDetails.filter(([label]) => label !== "Designation").map(([label, value]) => (
                  <div key={label} className="py-2.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-1 text-sm leading-5 text-slate-700">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {profile.pdf && (
              <a href={genericProfileLink} target={isGenericProfileAnchor ? undefined : "_blank"} rel={isGenericProfileAnchor ? undefined : "noreferrer"} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f3262] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#071f3d]">
                <FileText size={16} /> View Profile
              </a>
            )}
          </section>
          <NccResourceSection
            title="Activities"
            description="Events, programmes, and student participation."
            resources={activities}
          />
          <NccResourceSection
            title="Reports"
            description="Reports and supporting documents."
            resources={reports}
          />
        </aside>
      </main>
      <PublicFooter />
    </div>
  );
}

export default StudentsEraPage;
