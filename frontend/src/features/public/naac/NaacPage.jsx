import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NaacPage() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCriteria = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/naac/criteria`
        );

        if (!response.ok) {
          throw new Error("Unable to load NAAC criteria.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Unable to load NAAC criteria."
          );
        }

        const sortedCriteria = [...(result.criteria || [])].sort(
          (a, b) =>
            Number(a.criterion_number) -
            Number(b.criterion_number)
        );

        setCriteria(sortedCriteria);
      } catch (err) {
        console.error("NAAC criteria error:", err);
        setError(
          err.message || "Unable to load NAAC criteria."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCriteria();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />

      <Navbar />

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            NAAC / Accreditation
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            NAAC Criteria
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Explore the criterion-wise information, quality
            initiatives, institutional practices, and supporting
            documentation maintained by the college for NAAC
            accreditation.
          </p>
        </div>
      </section>

      {/* =====================================================
          CRITERIA
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading NAAC criteria...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && criteria.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            No NAAC criteria available.
          </div>
        )}

        {!loading && !error && criteria.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {criteria.map((criterion) => {
              const slug = String(
                criterion.slug || ""
              ).trim();

              if (!slug) {
                return null;
              }

              const criterionUrl =
                `/naac/criteria/${encodeURIComponent(slug)}`;

              return (
                <div
                  key={criterion.id}
                  className="group relative flex min-h-[185px] flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4f86] hover:shadow-lg"
                >
                  {/* Top Accent */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#102f58] via-[#1d5b96] to-amber-400" />

                  <div className="flex flex-1 flex-col px-6 py-6">
                    {/* Number + Title */}
                    <div className="mb-3 flex items-start gap-3">
                      <span className="shrink-0 rounded-md bg-[#102f58] px-3 py-1 text-sm font-bold text-white">
                        {criterion.criterion_number}
                      </span>

                      <h2 className="text-lg font-bold leading-7 text-[#102f58] transition-colors group-hover:text-[#174f86]">
                        {criterion.title}
                      </h2>
                    </div>

                    {/* Description */}
                    {criterion.description && (
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {criterion.description}
                      </p>
                    )}

                    {/* Button */}
                    <div className="mt-auto pt-5">
                      <Link
                        to={criterionUrl}
                        className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2.5 text-sm font-semibold text-blue-950 shadow-sm transition-all duration-200 hover:bg-[#174f86] hover:shadow-md"
                      >
                        View Criterion

                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}