import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const DUMMY_HOD_IMAGE = "https://i.pravatar.cc/160?img=12";

const DepartmentSidebar = ({ department, sections, programmes }) => {
  const [showHodProfile, setShowHodProfile] = useState(false);
  const sectionLinks = sections.filter((section) => section.title);
  const hodImagePath = department.hod_image;
  const hodImage = hodImagePath
    ? hodImagePath.startsWith("http")
      ? hodImagePath
      : `${API_BASE}${hodImagePath.startsWith("/") ? "" : "/"}${hodImagePath}`
    : DUMMY_HOD_IMAGE;
  const hodName = department.hod_name || "Dr. Priya Deshmukh";
  const hodDesignation = department.hod_designation || "Head of Department";
  const hodQualification = department.hod_qualification || "M.A., Ph.D.";
  const activitySections = sections.filter((section) =>
    /activity|event|achievement|highlight/i.test(
      `${section.section_key} ${section.title}`
    )
  );
  const resourceDefinitions = [
    {
      title: "Research Areas",
      pattern: /research[_ -]?areas?|areas[_ -]?of[_ -]?research/i,
    },
    {
      title: "Research Projects",
      pattern: /research[_ -]?projects?|projects[_ -]?and[_ -]?research/i,
    },
    {
      title: "Publications",
      pattern: /publications?|research[_ -]?publications?/i,
    },
    {
      title: "Faculty Research Interests",
      pattern: /faculty[_ -]?research[_ -]?interests?|research[_ -]?interests?/i,
    },
  ];
  const resourceLinks = resourceDefinitions
    .map((resource) => {
      const section = sections.find((item) =>
        resource.pattern.test(`${item.section_key || ""} ${item.title || ""}`)
      );

      return section
        ? {
            ...resource,
            href: `#${section.section_key || section.id}`,
          }
        : null;
    })
    .filter(Boolean);
  const sidebarLinks = [
    programmes.length > 0 && {
      href: "#programmes",
      title: "Academic Programmes",
      description: `${programmes.length} programme${programmes.length === 1 ? "" : "s"} available`,
      className: "bg-amber-50 ring-amber-100",
    },
    activitySections.length > 0 && {
      href: `#${activitySections[0].section_key || activitySections[0].id}`,
      title: "Activities & Events",
      description: "Department initiatives and achievements",
      className: "bg-blue-50 ring-blue-100",
    },
  ].filter(Boolean);

  return (
    <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
        <div className="bg-linear-to-br from-[#102f58] to-[#174d83] px-5 py-3 text-white">
          <h2 className="text-lg font-bold">Head of Department</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-amber-100 bg-slate-100 shadow-md">
              <img src={hodImage} alt={hodName} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{hodName}</h3>
              {hodDesignation !== "Head of Department" && (
                <p className="mt-1 text-sm font-medium text-[#0f3262]">{hodDesignation}</p>
              )}
              <p className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">{hodQualification}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHodProfile((visible) => !visible)}
            className="mt-5 inline-flex w-full items-center justify-between border-t border-slate-100 pt-4 text-left text-sm font-bold text-[#0f3262] transition hover:text-amber-600"
          >
            <span>{showHodProfile ? "Hide HOD profile" : "Browse HOD profile"}</span>
            <ChevronDown size={17} className={`transition-transform ${showHodProfile ? "rotate-180" : ""}`} />
          </button>
          {showHodProfile && (
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
              {department.hod_profile || `${hodName} leads the department's academic, research and student development activities.`}
            </p>
          )}
        </div>
      </section>

      {sidebarLinks.length > 0 && (
        <section className="grid gap-3">
          {sidebarLinks.map((link) => (
            <a key={link.title} href={link.href} className={`group rounded-2xl p-5 ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${link.className}`}>
              <p className="text-sm font-bold text-slate-900">{link.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{link.description}</p>
            </a>
          ))}
        </section>
      )}

      {resourceLinks.length > 0 && (
        <nav className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Department resources">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#102f58]">Department Resources</p>
          <ul className="mt-3 space-y-2">
            {resourceLinks.map((resource) => (
              <li key={resource.title}>
                <a className="flex items-center justify-between gap-2 text-sm font-medium text-[#0f3262] hover:text-amber-600" href={resource.href}>
                  {resource.title}
                  <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {sectionLinks.length > 0 && (
        <nav className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Department sections">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
          <ul className="mt-3 space-y-2">
            {sectionLinks.map((section) => (
              <li key={section.id || section.section_key}>
                <a className="flex items-center justify-between gap-2 text-sm text-[#0f3262] hover:text-[#eead09]" href={`#${section.section_key}`}>
                  {section.title}
                  <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {activitySections.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#102f58]">Latest activity</h2><p className="mt-3 text-sm leading-6 text-slate-600">{activitySections[0].title}</p></div>}
    </aside>
  );
};

export default DepartmentSidebar;
