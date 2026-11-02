import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UsersRound } from "lucide-react";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const committeePages = [
  {
    key: "governing-management",
    label: "Governing Management Committee",
    path: "/about/governing-management-committee",
  },
  {
    key: "local-management",
    label: "Local Management Committee",
    path: "/about/local-management-committee",
  },
];

export default function ManagementCommitteePage({ committeeKey }) {
  const committee = committeePages.find((item) => item.key === committeeKey) || committeePages[0];
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`${API_BASE}/api/management-committees?committee_key=${encodeURIComponent(committee.key)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load committee members.");
        }
        setMembers(Array.isArray(result.data) ? result.data : []);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [committee.key]);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <TopBar />
      <Navbar />

      <main>
        <header className="border-b border-slate-200 bg-[#f6f8f7]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#946700]">College governance</p>
            <div className="mt-4 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#12345b] sm:text-4xl">
                  {committee.label}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Official membership and responsibilities of the college {committee.label.toLowerCase()}.
                </p>
              </div>
              <div className="flex items-center gap-3 border-l-2 border-[#e5ae25] pl-4 text-sm text-slate-600">
                <UsersRound size={20} className="text-[#12345b]" aria-hidden="true" />
                <span>{loading ? "Loading members" : `${members.length} published ${members.length === 1 ? "member" : "members"}`}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <nav aria-label="Management committee pages" className="mb-8 flex flex-wrap gap-x-8 gap-y-3 border-b border-slate-200">
            {committeePages.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                aria-current={item.key === committee.key ? "page" : undefined}
                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                  item.key === committee.key
                    ? "border-[#d9a31b] text-[#12345b]"
                    : "border-transparent text-slate-500 hover:text-[#12345b]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <section aria-labelledby="membership-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Membership register</p>
                <h2 id="membership-heading" className="mt-1 text-xl font-semibold text-slate-900">Committee members</h2>
              </div>
              <p className="text-sm text-slate-500">Listed in official display order</p>
            </div>

            <div className="overflow-x-auto border-y border-slate-300">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-[#f3f5f6] text-xs uppercase tracking-wide text-slate-600">
                  <tr>
                    <th scope="col" className="w-20 px-4 py-3 font-semibold">No.</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Member name</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Designation</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Representation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr><td colSpan="4" className="px-4 py-12 text-center text-slate-500">Loading committee register...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="4" role="alert" className="px-4 py-12 text-center text-red-700">{error}</td></tr>
                  ) : members.length ? members.map((member, index) => (
                    <tr key={member.id} className="align-top even:bg-slate-50/70">
                      <td className="px-4 py-4 tabular-nums text-slate-500">{index + 1}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{member.member_name}</td>
                      <td className="px-4 py-4 text-slate-700">{member.designation}</td>
                      <td className="px-4 py-4 text-slate-600">{member.representation || "—"}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-12 text-center">
                        <p className="font-semibold text-slate-800">No members have been published yet.</p>
                        <p className="mt-1 text-sm text-slate-500">The college office can add verified records through the admin panel.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}