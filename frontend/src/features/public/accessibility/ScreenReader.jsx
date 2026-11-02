import { useEffect, useState } from "react";
import {
  Accessibility,
  ExternalLink,
  Monitor,
  ShieldCheck,
} from "lucide-react";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ScreenReader() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchScreenReaders();
  }, []);

  const fetchScreenReaders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/screen-readers`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Unable to load screen reader information"
        );
      }

      setReaders(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "SCREEN READER PAGE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load screen reader information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      {/* Page Banner */}
      {/* <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Accessibility size={26} />
            </div>

            {/* <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Accessibility
              </p>

              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-800">
                Screen Reader Access
              </h1>
            </div> */}
          {/* </div>
        </div>
      </section> */} 

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main */}
          <div className="lg:col-span-8">
            <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
              
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="text-blue-700"
                    size={23}
                  />

                  <h2 className="text-xl font-semibold text-slate-800">
                    Screen Reader Information
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-600 leading-7 mb-6">
                  This website is designed to provide
                  accessible information to users with
                  visual impairments. The following screen
                  reader applications may be used to access
                  the information available on this website.
                </p>

                {loading && (
                  <div className="py-10 text-center text-slate-500">
                    Loading screen reader information...
                  </div>
                )}

                {!loading && error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                  </div>
                )}

                {!loading &&
                  !error &&
                  readers.length === 0 && (
                    <div className="py-10 text-center text-slate-500">
                      No screen reader information
                      available.
                    </div>
                  )}

                {!loading &&
                  !error &&
                  readers.length > 0 && (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200">
                            <th className="px-5 py-4 text-left font-semibold text-slate-700">
                              Screen Reader
                            </th>

                            <th className="px-5 py-4 text-left font-semibold text-slate-700">
                              Website
                            </th>

                            <th className="px-5 py-4 text-left font-semibold text-slate-700 whitespace-nowrap">
                              Access
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {readers.map((reader) => (
                            <tr
                              key={reader.id}
                              className="border-b last:border-b-0 border-slate-200 hover:bg-slate-50 transition"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-start gap-3">
                                  <Monitor
                                    size={19}
                                    className="mt-0.5 text-blue-700 shrink-0"
                                  />

                                  <div>
                                    <div className="font-semibold text-slate-800">
                                      {reader.name}
                                    </div>

                                    {reader.description && (
                                      <p className="mt-1 text-sm text-slate-500 leading-6">
                                        {reader.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                {reader.website_url ? (
                                  <a
                                    href={
                                      reader.website_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-900 hover:underline"
                                  >
                                    Visit Website
                                    <ExternalLink
                                      size={15}
                                    />
                                  </a>
                                ) : (
                                  <span className="text-slate-400">
                                    —
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    reader.access_type ===
                                    "Free"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {reader.access_type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-5">
                  <p className="text-sm leading-6 text-slate-600">
                    Availability, licensing and features of
                    third-party screen reader software may
                    change. Please refer to the respective
                    provider's website for the latest
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {/* <aside className="lg:col-span-4">
            <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800">
                  Accessibility
                </h3>
              </div>

              {/* <div className="p-3">
                <a
                  href="/screen-reader"
                  className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-blue-700 font-semibold"
                >
                  <span>Screen Reader Access</span>
                </a>
              </div> */}
            {/* </div>
          </aside> */} 
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}