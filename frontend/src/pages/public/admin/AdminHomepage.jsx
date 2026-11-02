import {
  Images,
  BarChart3,
  MessageSquareText,
  CalendarDays,
  Trophy,
  UserRound,
  Newspaper,
  PlayCircle,
  Image,
  BriefcaseBusiness,
  Link2,
  Megaphone,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const sections = [
  {
    title: "Hero Slider",
    description:
      "Add, edit, delete and reorder homepage slider banners.",
    icon: Images,
    path: "/admin/homepage/hero-slider",
  },
  {
    title: "College Statistics",
    description:
      "Manage the statistics displayed below the homepage hero.",
    icon: BarChart3,
    path: "/admin/homepage/statistics",
  },
  {
    title: "Welcome & Principal",
    description:
      "Update welcome content, principal message and homepage introduction.",
    icon: MessageSquareText,
    path: "/admin/homepage/welcome",
  },
  {
    title: "About College",
    description:
      "Manage College Information.",
    icon: UserRound,
    path: "/admin/homepage/aboutcollege",
  },
  {
    title: "News & Notices",
    description:
      "Manage news, notices, announcements and important homepage updates.",
    icon: Newspaper,
    path: "/admin/homepage/news-notices",
  },
  {
    title: "Events & Activities",
    description:
      "Manage academic activities, campus programmes, seminars and events.",
    icon: CalendarDays,
    path: "/admin/homepage/events",
  },
 {
  title: "Achievements",
  description:
    "Add and manage institutional and student achievements.",
  icon: Trophy,
  path: "/admin/homepage/achievements",
},
  {
    title: "YouTube Videos",
    description:
      "Manage YouTube videos displayed in the homepage video section.",
    icon: PlayCircle,
    path: "/admin/homepage/youtube",
  },
  {
    title: "Gallery",
    description:
      "Upload, edit and manage photographs displayed in the homepage gallery.",
    icon: Image,
    path: "/admin/homepage/gallery",
  },
  {
    title: "Placement Partners",
    description:
      "Manage recruiters, placement records, student photographs and company details.",
    icon: BriefcaseBusiness,
    path: "/admin/homepage/placements",
  },
  {
    title: "Quick Links",
    description:
      "Manage the Explore the College links displayed on the homepage.",
    icon: Link2,
    path: "/admin/homepage/quick-links",
  },
  {
    title: "Breaking News",
    description:
      "Manage scrolling announcements displayed in the homepage breaking-news bar.",
    icon: Megaphone,
    path: "/admin/homepage/breaking-news",
  },
];

function AdminHomepage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Homepage Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Manage Homepage
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Control the content displayed on your public college homepage.
          Manage banners, news, events, videos, gallery, placements and
          other homepage sections from one place.
        </p>
      </div>

      {/* Homepage Sections */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.path}
              to={section.path}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              {/* Icon and Arrow */}
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0f3262] transition group-hover:bg-blue-100">
                  <Icon size={21} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </div>

              {/* Title */}
              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {section.title}
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {section.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AdminHomepage;