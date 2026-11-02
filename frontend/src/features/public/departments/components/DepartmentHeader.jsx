import {
  BriefcaseBusiness,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  UsersRound,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const FALLBACK_DEPARTMENT_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=80";

const DepartmentHeader = ({ department }) => {
  const imagePath = department.department_image || department.department_image_url;
  const image = imagePath?.startsWith("http")
    ? imagePath
    : imagePath
      ? `${API_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
      : FALLBACK_DEPARTMENT_IMAGE;

  return (
    <header
      className="relative overflow-hidden bg-[#102f58] bg-cover bg-center text-white"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[#102f58]/55" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            {department.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-100">
            {department.established_year && <span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-amber-300" /> Established {department.established_year}</span>}
            {department.affiliation && <span className="border-l border-white/25 pl-3">{department.affiliation}</span>}
          </div>
        </div>
        <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[370px] lg:grid-cols-2">
          {[
            [GraduationCap, "Programmes", "Learning pathways"],
            [BriefcaseBusiness, "Placement", "Career readiness"],
            [FlaskConical, "Research", "Ideas into impact"],
            [UsersRound, "Faculty", "People who make learning happen"],
          ].map(([Icon, title, text]) => (
            <div key={title} className="border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <Icon size={18} className="text-amber-300" />
              <p className="mt-3 text-sm font-bold">{title}</p>
              <p className="mt-1 text-[11px] text-blue-100">{text}</p>
            </div>
          ))}
        </div>
        </div>
        <div className="mt-5 border border-amber-200 border-l-4 border-l-amber-400 bg-[#f2b441]/95 px-4 py-2.5 text-sm font-medium italic text-[#1e293b] shadow-[0_8px_20px_rgba(15,50,98,0.24)] sm:text-base">
          {department.tagline || "A place for thoughtful learning, meaningful research and confident futures."}
        </div>
      </div>
    </header>
  );
};

export default DepartmentHeader;
