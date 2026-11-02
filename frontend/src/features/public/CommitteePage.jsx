import { useEffect, useState } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const committeeDescriptions = {
  iqac: "Institutional quality assurance, planning, and continuous improvement.",
  "anti-ragging": "Campus discipline and a safe, respectful learning environment.",
  grievance: "A transparent channel for addressing student and staff concerns.",
  icc: "A safe and equitable campus environment for all members of the institution.",
  "sc-st": "Support and inclusion for Scheduled Caste and Scheduled Tribe communities.",
  obc: "Guidance and support for students from Other Backward Classes.",
  minority: "Support, access, and inclusion for students from minority communities.",
  divyang: "Accessibility and inclusive learning support across the institution.",
  "student-welfare": "Student well-being, support systems, and positive campus experiences.",
};

export default function CommitteePage({ slug }) {
  const [committee, setCommittee] = useState(null);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`${API_BASE}/api/committees/${encodeURIComponent(slug)}`),
      fetch(`${API_BASE}/api/site-pages/committees-${encodeURIComponent(slug)}`),
    ])
      .then(async ([committeeResponse, pageResponse]) => {
        const committeeResult = await committeeResponse.json();
        if (!committeeResponse.ok || !committeeResult.success) {
          throw new Error(committeeResult.message || "Unable to load committee information.");
        }
        const pageResult = pageResponse.ok ? await pageResponse.json() : null;
        return { committee: committeeResult.data, page: pageResult?.data?.content || null };
      })
      .then(({ committee: committeeData, page }) => {
        if (!cancelled) {
          setCommittee(committeeData);
          setPageContent(page);
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pdfUrl = committee?.pdf_url
    ? committee.pdf_url.startsWith("http")
      ? committee.pdf_url
      : `${API_BASE}${committee.pdf_url}`
    : "";

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <TopBar />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            College Committees
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            {pageContent?.title || committee?.committee_title || "Committee"}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            {pageContent?.description || committeeDescriptions[slug] || "Committee information and official documents."}
          </p>
          {pageContent?.highlights?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
              {pageContent.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </header>

        {pageContent?.sections?.length > 0 && (
          <section className="mb-8 grid gap-6 border-y border-slate-200 py-6 sm:grid-cols-2">
            {pageContent.sections.map((section) => (
              <article key={section.heading}>
                <h2 className="font-semibold text-slate-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.text}</p>
              </article>
            ))}
            {pageContent.cta?.to && pageContent.cta?.label && (
              <Link to={pageContent.cta.to} className="text-sm font-semibold text-blue-800 hover:underline">
                {pageContent.cta.label}
              </Link>
            )}
          </section>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            Loading committee document...
          </div>
        ) : error ? (
          <div className="border-y border-slate-200 py-10 text-sm text-slate-600">
            {error}
          </div>
        ) : pdfUrl ? (
          <section aria-label={`${committee.committee_title} PDF`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileText size={18} className="text-slate-500" />
                Official committee document
              </span>
              <div className="flex gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink size={16} /> Open PDF
                </a>
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0f3262] px-3 py-2 text-sm font-semibold text-white hover:bg-[#19477f]"
                >
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
            <iframe
              title={`${committee.committee_title} PDF viewer`}
              src={pdfUrl}
              className="h-[70vh] min-h-[520px] w-full border border-slate-200 bg-slate-50"
            />
          </section>
        ) : (
          <div className="flex min-h-64 items-center gap-4 border-y border-slate-200 py-10">
            <FileText size={26} className="shrink-0 text-slate-400" />
            <p className="text-sm text-slate-600">
              The committee PDF has not been published yet.
            </p>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}