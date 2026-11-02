import { useEffect, useMemo, useState } from "react";
import { Building2, Coffee, Dumbbell, ImageOff, LibraryBig, MapPin, Monitor, Search, ShieldCheck, Users, Zap } from "lucide-react";
import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const iconByCategory = { Campus: MapPin, Learning: LibraryBig, Academic: Building2, Administration: Building2, "Student Life": Dumbbell, "Student Support": ShieldCheck, "Staff Support": Users };

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All facilities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/facilities`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load facilities.");
        return result.data;
      })
      .then((rows) => { if (!cancelled) setFacilities(Array.isArray(rows) ? rows : []); })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => ["All facilities", ...new Set(facilities.map((item) => item.category).filter(Boolean))], [facilities]);
  const visibleFacilities = useMemo(() => {
    const term = query.trim().toLowerCase();
    return facilities.filter((item) => {
      const matchesCategory = category === "All facilities" || item.category === category;
      const matchesQuery = !term || `${item.name} ${item.description} ${(item.features || []).join(" ")}`.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    }).sort((first, second) => {
      const priority = (item) => /computer laboratory/i.test(item.name) ? 0 : /iqac/i.test(item.name) ? 1 : 2;
      return priority(first) - priority(second) || Number(first.display_order || 0) - Number(second.display_order || 0);
    });
  }, [facilities, query, category]);

  const computerLab = visibleFacilities.find((facility) => /computer laboratory/i.test(facility.name));
  const otherFacilities = visibleFacilities.filter((facility) => facility.id !== computerLab?.id);
  const photoCount = facilities.filter((facility) => facility.image_url).length;
  const measuredCount = facilities.filter((facility) => facility.building_area_sq_ft || facility.open_area_sq_ft).length;

  const imageUrl = (facility) => facility.image_url?.startsWith("http")
    ? facility.image_url
    : facility.image_url
      ? `${API_BASE}${facility.image_url}`
      : "";

  const facilityPhoto = (facility, prominent = false) => {
    const image = imageUrl(facility);
    if (image) return <img src={image} alt={`${facility.name} facility`} className={`h-full w-full object-cover ${prominent ? "min-h-64" : "min-h-40"}`} />;
    const Icon = iconByCategory[facility.category] || Building2;
    return (
      <div className={`flex h-full min-h-40 flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-center ${prominent ? "min-h-64 p-8" : "p-5"}`}>
        <ImageOff size={prominent ? 32 : 24} className="text-slate-400" />
        <p className="mt-3 text-sm font-semibold text-slate-700">Facility photo needed</p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Upload a current photo of {facility.name} in Admin Facilities.</p>
      </div>
    );
  };

  const areaValue = (value) => value ? `${Number(value).toLocaleString()} sq ft` : "Awaiting measurement";
  const specificationValue = (value) => value === null || value === undefined || value === "" ? "Not entered" : value;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <TopBar />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Infrastructure audit</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Campus Infrastructure & Facilities</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Facility photographs, floor and open-area measurements, and equipment specifications are maintained here for review.</p>
        </header>

        <section aria-label="Infrastructure audit summary" className="grid border-b border-slate-200 sm:grid-cols-3">
          {[["Facilities", facilities.length], ["With photos", photoCount], ["Area records", measuredCount]].map(([label, value]) => (
            <div key={label} className="border-b border-slate-200 py-4 sm:border-b-0 sm:border-r sm:px-5 first:pl-0 last:border-r-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Facility register</h2>
              <p className="mt-1 text-sm text-slate-500">{visibleFacilities.length} records</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <label className="relative block"><span className="sr-only">Search facilities</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search facilities" className="w-full border border-slate-300 py-2 pl-9 pr-3 text-sm sm:w-64" /></label>
              <label><span className="sr-only">Filter facilities by category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full border border-slate-300 bg-white px-3 py-2 text-sm sm:w-48">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
          </div>

          {loading ? <p className="py-12 text-center text-sm text-slate-500">Loading facilities...</p> : error ? <p role="alert" className="py-8 text-sm text-red-700">{error}</p> : visibleFacilities.length ? (
            <div className="py-5">
              {computerLab && (
                <article className="mb-8 grid overflow-hidden border border-slate-300 bg-white lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="min-h-64">{facilityPhoto(computerLab, true)}</div>
                  <div className="p-5 sm:p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Priority infrastructure · {computerLab.category}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{computerLab.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{computerLab.description}</p>
                    <dl className="mt-5 grid gap-x-5 border-y border-slate-200 sm:grid-cols-2">
                      {[["Building area", areaValue(computerLab.building_area_sq_ft)], ["Open area", areaValue(computerLab.open_area_sq_ft)], ["Computers", specificationValue(computerLab.computer_count)], ["Configuration", specificationValue(computerLab.computer_configuration)], ["Projectors", specificationValue(computerLab.projector_count)], ["Smart boards", specificationValue(computerLab.smart_board_count)], ["Backup power", specificationValue(computerLab.backup_power)], ["Internet", specificationValue(computerLab.internet_details)]].map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-2 border-b border-slate-100 py-3 text-sm">
                          <dt className="font-medium text-slate-600">{label}</dt><dd className="break-words text-slate-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
                      <span className="inline-flex items-center gap-2"><Monitor size={16} /> Computer lab</span>
                      <span className="inline-flex items-center gap-2"><Zap size={16} /> Power and connectivity</span>
                    </div>
                  </div>
                </article>
              )}
              {otherFacilities.length > 0 && <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {otherFacilities.map((facility) => {
                  const measurements = [
                    ["Building area", areaValue(facility.building_area_sq_ft)],
                    ["Open area", areaValue(facility.open_area_sq_ft)],
                  ];
                  return <article key={facility.id} className="overflow-hidden border border-slate-200 bg-white">
                    <div className="aspect-[16/9]">{facilityPhoto(facility)}</div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{facility.category}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{facility.name}</h3>
                      {facility.description && <p className="mt-2 text-sm leading-6 text-slate-600">{facility.description}</p>}
                      <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{measurements.map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-2 text-sm"><dt className="text-slate-600">{label}</dt><dd className="text-right text-slate-900">{value}</dd></div>)}</dl>
                      {facility.features?.length > 0 && <ul className="mt-4 space-y-2">{facility.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><span className="text-[#0f3262]" aria-hidden="true">•</span>{feature}</li>)}</ul>}
                    </div>
                  </article>;
                })}
              </div>}
            </div>
          ) : <div className="border-b border-slate-200 py-14 text-center"><Coffee size={28} className="mx-auto text-slate-400" /><h3 className="mt-3 text-base font-semibold text-slate-800">No facilities found</h3><p className="mt-1 text-sm text-slate-500">Try another search or category.</p></div>}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
