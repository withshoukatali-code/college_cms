import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/college-header`;

function TopBar() {
  const [college, setCollege] = useState({});

  useEffect(() => {
    let mounted = true;

    fetch(API_URL)
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (mounted && result?.data) {
          setCollege(result.data);
        }
      })
      .catch((error) => console.error("Top bar college data error:", error));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="border-b border-slate-800 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800">
      <div className="mx-auto flex min-h-10 max-w-screen-2xl items-center justify-between gap-4 px-4 py-1.5 lg:px-8">
        <div className="min-w-0">
          <span className="max-w-full truncate text-base font-bold leading-tight tracking-tight text-white sm:text-xl">
            {college.college_name || "College Name"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-[11px] font-medium text-slate-300 sm:gap-5 sm:text-xs">
          {college.email && <a className="inline-flex max-w-[10rem] items-center gap-1.5 truncate hover:text-amber-300 sm:max-w-none" href={`mailto:${college.email}`}><Mail size={13} />{college.email}</a>}
          {college.phone && <a className="hidden items-center gap-1.5 whitespace-nowrap hover:text-amber-300 sm:inline-flex" href={`tel:${college.phone}`}><Phone size={13} />{college.phone}</a>}
        </div>

      </div>
    </section>
  );
}

export default TopBar;