import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  TrendingUp,
  Users,
  Award,
  ArrowUpRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-placements";

const getLogoUrl = (logo) => {
  if (!logo) return "";

  if (
    logo.startsWith("http") ||
    logo.startsWith("data:") ||
    logo.startsWith("blob:")
  ) {
    return logo;
  }

  return `http://localhost:5000${logo}`;
};

const PlacementPartners = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch placement partners");
        }

        const data = await response.json();

        setPlacements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Placement partners fetch error:", error);
        setPlacements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  if (loading || !placements.length) {
    return null;
  }

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Our Placement Partners
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Our students connect with leading organizations through campus
            recruitment and career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {placements.map((company) => (
            <div
              key={company.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-1 bg-blue-600" />

              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {company.company_logo ? (
                        <img
                          src={getLogoUrl(company.company_logo)}
                          alt={`${company.company_name} logo`}
                          className="h-full w-full object-contain p-1.5"
                          loading="lazy"
                        />
                      ) : (
                        <BriefcaseBusiness
                          size={21}
                          className="text-slate-300"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                        {company.company_name}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Placement Partner
                      </p>
                    </div>
                  </div>

                  {company.company_website && (
                    <a
                      href={company.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${company.company_name}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <Award size={14} />
                    </div>

                    <span className="text-[11px] text-slate-600">
                      Highest Package
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {company.highest_package !== null &&
                    company.highest_package !== undefined &&
                    company.highest_package !== ""
                      ? `₹${Number(company.highest_package).toFixed(2)} LPA`
                      : "—"}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 divide-x divide-slate-100">
                  <div className="pr-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <TrendingUp size={13} className="text-blue-500" />

                      <span className="text-[10px] text-slate-400">
                        Average
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      {company.average_package !== null &&
                      company.average_package !== undefined &&
                      company.average_package !== ""
                        ? `₹${Number(company.average_package).toFixed(2)} LPA`
                        : "—"}
                    </p>
                  </div>

                  <div className="pl-3">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Users size={13} className="text-emerald-500" />

                      <span className="text-[10px] text-slate-400">
                        Students Placed
                      </span>
                    </div>

                    <p className="text-xl font-bold text-blue-950">
                      {company.students_placed !== null &&
                      company.students_placed !== undefined &&
                      company.students_placed !== ""
                        ? company.students_placed
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        <div className="mt-7 text-center">
          <p className="text-[11px] text-slate-400">
            Placement information represents aggregate institutional data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlacementPartners;