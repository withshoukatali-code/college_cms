import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  ShieldCheck,
  BookOpen,
  BriefcaseBusiness,
  AlertTriangle,
  UserRound,
  ArrowUp,
  HeartHandshake,
  Eye,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PublicFooter = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [visitorCount, setVisitorCount] = useState(null);

  // Load footer information.
  useEffect(() => {
    let mounted = true;

    const loadFooter = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE}/footer`);

        if (!response.ok) {
          throw new Error(`Footer API error: ${response.status}`);
        }

        const result = await response.json();
        console.log("PUBLIC FOOTER RESPONSE:", result);

        // Support common API response formats.
        const footerData =
          result?.footer ||
          result?.data?.footer ||
          result?.data ||
          result?.record ||
          null;

        console.log("PUBLIC FOOTER DATA:", footerData);

        if (mounted) {
          setFooter(footerData);
        }
      } catch (error) {
        console.error("PUBLIC FOOTER ERROR:", error);

        if (mounted) {
          setFooter(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFooter();

    return () => {
      mounted = false;
    };
  }, []);

  // Record one visit per browser session.
  useEffect(() => {
    let mounted = true;

    const recordVisit = async () => {
      try {
        let visitorKey = sessionStorage.getItem("collegeVisitorSession");

        if (!visitorKey) {
          visitorKey =
            window.crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;

          sessionStorage.setItem("collegeVisitorSession", visitorKey);
        }

        const response = await fetch(`${API_BASE}/visitor-count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ visitorKey }),
        });

        const result = await response.json();

        if (response.ok && result.success && mounted) {
          setVisitorCount(Number(result.total) || 0);
        }
      } catch (error) {
        console.error("PUBLIC VISITOR COUNT ERROR:", error);
      }
    };

    recordVisit();

    return () => {
      mounted = false;
    };
  }, []);

  // Show the Back to Top button after scrolling.
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Loading skeleton.
  if (loading) {
    return (
      <footer className="border-t-4 border-[#c9a227] bg-[#0f3262] text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.5fr]">
            <div>
              <div className="h-7 w-72 rounded bg-white/10" />
              <div className="mt-4 h-4 w-full max-w-xl rounded bg-white/10" />
              <div className="mt-3 h-4 w-5/6 rounded bg-white/10" />
              <div className="mt-3 h-4 w-4/6 rounded bg-white/10" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 rounded-lg bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Do not render an empty footer when the API has no data.
  if (!footer) {
    console.warn("PublicFooter: No footer data available.");
    return null;
  }

  // Contact directory.
  const contacts = [
    {
      key: "principal",
      title: "Principal",
      name: footer.principal_name,
      designation: footer.principal_designation,
      mobile: footer.principal_mobile,
      icon: GraduationCap,
    },
    {
      key: "administration",
      title: "Administration",
      name: footer.administration_name,
      designation: footer.administration_designation,
      mobile: footer.administration_mobile,
      icon: Building2,
    },
    {
      key: "grievance",
      title: "Grievance",
      name: footer.grievance_name,
      designation: footer.grievance_designation,
      mobile: footer.grievance_mobile,
      icon: ShieldCheck,
    },
    {
      key: "facilitation",
      title: "Facilitation",
      name: footer.facilitation_name,
      designation: footer.facilitation_designation,
      mobile: footer.facilitation_mobile,
      icon: UserRound,
    },
    {
      key: "library",
      title: "Library",
      name: footer.library_name,
      designation: footer.library_designation,
      mobile: footer.library_mobile,
      icon: BookOpen,
    },
    {
      key: "placement",
      title: "Placement",
      name: footer.placement_name,
      designation: footer.placement_designation,
      mobile: footer.placement_mobile,
      icon: BriefcaseBusiness,
    },
    {
      key: "anti_ragging",
      title: "Anti-Ragging",
      name: footer.anti_ragging_name,
      designation: footer.anti_ragging_designation,
      mobile: footer.anti_ragging_mobile,
      icon: AlertTriangle,
    },
    {
      key: "women_harassment",
      title: "Women's Harassment / Prevention Cell",
      name: footer.women_harassment_name,
      designation: footer.women_harassment_designation,
      mobile: footer.women_harassment_mobile,
      icon: ShieldCheck,
    },
    {
      key: "women_empowerment",
      title: "Women Empowerment Cell",
      name: footer.women_empowerment_name,
      designation: footer.women_empowerment_designation,
      mobile: footer.women_empowerment_mobile,
      icon: HeartHandshake,
    },
  ];

  const visibleContacts = contacts.filter(
    (contact) =>
      contact.name || contact.designation || contact.mobile
  );

  return (
    <>
      <footer className="border-t-4 border-[#c9a227] bg-[#0f3262] text-white">
        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.5fr] lg:gap-12">
            {/* Left: College Information */}
            <div className="min-w-0">
              <div>
                {footer.college_name && (
                  <h2 className="text-xl font-semibold leading-tight text-[#d4af37] sm:text-2xl">
                    {footer.college_name}
                  </h2>
                )}

                {footer.tagline && (
                  <p className="mt-1 text-sm font-medium text-blue-100">
                    {footer.tagline}
                  </p>
                )}
              </div>

              {footer.description && (
                <p className="mt-5 max-w-xl text-sm leading-6 text-blue-100/85">
                  {footer.description}
                </p>
              )}

              {footer.affiliation && (
                <div className="mt-5 flex items-start gap-3">
                  <GraduationCap
                    size={17}
                    className="mt-0.5 shrink-0 text-[#d4af37]"
                  />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200/60">
                      Affiliated To
                    </p>
                    <p className="mt-1 text-sm leading-5 text-blue-100">
                      {footer.affiliation}
                    </p>
                  </div>
                </div>
              )}

              {(footer.established_year || footer.naac_grade) && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {footer.established_year && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200/60">
                        Established
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {footer.established_year}
                      </p>
                    </div>
                  )}

                  {footer.naac_grade && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200/60">
                        NAAC Grade
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#d4af37]">
                        {footer.naac_grade}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {footer.address && (
                <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#d4af37]"
                  />
                  <p className="text-sm leading-5 text-blue-100/90">
                    {footer.address}
                  </p>
                </div>
              )}

              {footer.phone && (
                <div className="mt-3 flex items-center gap-3">
                  <Phone
                    size={17}
                    className="shrink-0 text-[#d4af37]"
                  />
                  <a
                    href={`tel:${footer.phone}`}
                    className="text-sm text-blue-100 transition hover:text-white"
                  >
                    {footer.phone}
                  </a>
                </div>
              )}

              {footer.email && (
                <div className="mt-3 flex items-center gap-3 pb-2">
                  <Mail
                    size={17}
                    className="shrink-0 text-[#d4af37]"
                  />
                  <a
                    href={`mailto:${footer.email}`}
                    className="break-all text-sm text-blue-100 transition hover:text-white"
                  >
                    {footer.email}
                  </a>
                </div>
              )}
            </div>

            {/* Right: Contact Directory */}
            <div className="min-w-0">
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  Contact Directory
                </p>
                <h3 className="mt-1 text-2xl font-bold text-white">
                  Connect Us
                </h3>
                <div className="mt-2 h-0.5 w-12 bg-[#d4af37]" />
              </div>

              {visibleContacts.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleContacts.map((contact) => {
                    const Icon = contact.icon;

                    return (
                      <div
                        key={contact.key}
                        className="rounded-lg border border-white/10 bg-white/[0.06] p-3 transition duration-200 hover:border-[#d4af37]/40 hover:bg-white/[0.09]"
                      >
                        <div className="flex items-start gap-2.5">
                          <Icon
                            size={17}
                            className="mt-0.5 shrink-0 text-[#d4af37]"
                          />

                          <div className="min-w-0">
                            {contact.name && (
                              <p
                                className="mt-1 truncate text-sm font-semibold leading-5 text-white"
                                title={contact.name}
                              >
                                {contact.name}
                              </p>
                            )}

                            {contact.designation && (
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-blue-100/70">
                                {contact.designation}
                              </p>
                            )}

                            {contact.mobile && (
                              <a
                                href={`tel:${contact.mobile}`}
                                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-100/90 transition hover:text-[#d4af37]"
                              >
                                <Phone size={11} />
                                {contact.mobile}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5 text-sm text-blue-100/70">
                  Contact information will be available soon.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-[#d4af37]/20 bg-[#09284f]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p className="text-xs leading-5 text-blue-100/70">
              {footer.copyright_text ||
                "© 2026 Tuljabhavani College. All Rights Reserved."}
            </p>

            <p className="text-xs leading-5 text-blue-100/70">
              {footer.developer_text || "Designed & Developed by"}{" "}
              {footer.developer_name ? (
                footer.developer_url ? (
                  <a
                    href={footer.developer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#d4af37] transition hover:text-white"
                  >
                    {footer.developer_name}
                  </a>
                ) : (
                  <span className="font-semibold text-[#d4af37]">
                    {footer.developer_name}
                  </span>
                )
              ) : (
                <span className="font-semibold text-[#d4af37]">
                  Innovative Academy
                </span>
              )}
            </p>

            <div
              className="ml-auto inline-flex min-w-40 items-center justify-between gap-4 border border-[#d4af37]/50 bg-[#0f3262] px-4 py-2 text-right shadow-sm"
              aria-live="polite"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f3d46a]">
                <Eye size={15} />
                Visitors
              </span>
              <span className="min-w-10 text-lg font-bold tabular-nums text-white">
                {visitorCount === null
                  ? "—"
                  : visitorCount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      {showTop && (
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-[#0f3262] shadow-lg transition hover:-translate-y-1 hover:bg-white"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
};

export default PublicFooter;
