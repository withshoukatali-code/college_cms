import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Award,
  Library,
  Download,
  BookOpen,
  Users,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/quick-links";

const iconMap = {
  GraduationCap,
  Building2,
  ShieldCheck,
  Award,
  Library,
  Download,
  BookOpen,
  Users,
};

function QuickLinks() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchQuickLinks = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        console.log("Quick Links API:", result);

        if (result.success && Array.isArray(result.data)) {
          setLinks(result.data);
        }
      } catch (error) {
        console.error("Quick Links Fetch Error:", error);
      }
    };

    fetchQuickLinks();
  }, []);

  return (
    <section className="bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}

        <div className="text-center">
          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-[#0f3262]
              sm:text-4xl
            "
          >
            Explore the College
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Quickly access important academic, administrative and
            institutional resources.
          </p>
        </div>

        {/* Quick Links */}

        <div
          className="
            mt-8
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-4
            lg:grid-cols-8
          "
        >
          {links.map((item) => {
            const Icon = iconMap[item.icon] || BookOpen;

            return (
              <Link
                key={item.id}
                to={item.path}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  text-center
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1.5
                  hover:border-[#eead09]
                  hover:shadow-lg
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#1e69f5]
                    transition-all
                    duration-300
                    group-hover:bg-[#ffd901]
                  "
                >
                  <Icon
                    size={27}
                    strokeWidth={1.8}
                    className="text-white"
                  />
                </div>

                <h3
                  className="
                    mt-3
                    text-[13px]
                    font-semibold
                    leading-5
                    text-[#0f3262]
                  "
                >
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}

        {links.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            No quick links available.
          </p>
        )}

      </div>
    </section>
  );
}

export default QuickLinks;