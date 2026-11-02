import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";
import { libraryDefaultContent, normalizeLibraryContent } from "../../../features/public/library/libraryContent";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LibraryAdmin() {
  const [content, setContent] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState("our-library");
  const [pendingPdfs, setPendingPdfs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadContent = async () => {
    let response = await fetch(`${API_BASE}/api/site-pages/library`);
    if (response.status === 404) {
      const seedResponse = await fetch(`${API_BASE}/api/site-pages/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: [{ page_key: "library", content: libraryDefaultContent }],
        }),
      });
      const seedResult = await seedResponse.json();
      if (!seedResponse.ok || !seedResult.success) {
        throw new Error(seedResult.message || "Unable to initialize library content.");
      }
      response = await fetch(`${API_BASE}/api/site-pages/library`);
    }

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load library content.");
    }
    setContent(normalizeLibraryContent(result.data.content));
  };

  useEffect(() => {
    let cancelled = false;
    loadContent()
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Unable to load library content.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = content?.sections || [];
  const selectedSectionIndex = sections.findIndex((section) => section.id === selectedSectionId);
  const selectedSection = selectedSectionIndex >= 0 ? sections[selectedSectionIndex] : sections[0];
  const selectedItems = selectedSection?.items || [];

  const updateContent = (field, value) => {
    setContent((current) => ({ ...current, [field]: value }));
  };

  const updateHero = (field, value) => {
    setContent((current) => ({ ...current, hero: { ...current.hero, [field]: value } }));
  };

  const updateHeroStat = (index, field, value) => {
    const stats = [...(content.hero?.stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    updateHero("stats", stats);
  };

  const updateSection = (field, value) => {
    const nextSections = [...sections];
    nextSections[selectedSectionIndex] = { ...selectedSection, [field]: value };
    updateContent("sections", nextSections);
  };

  const updateItem = (index, field, value) => {
    const items = [...selectedItems];
    items[index] = { ...items[index], [field]: value };
    updateSection("items", items);
  };

  const addSection = () => {
    const id = `library-page-${Date.now()}`;
    setContent((current) => ({
      ...current,
      sections: [...current.sections, {
        id,
        title: "New Library page",
        description: "",
        display_order: current.sections.length + 1,
        is_active: 1,
        items: [],
      }],
    }));
    setSelectedSectionId(id);
  };

  const deleteSection = () => {
    if (!selectedSection || !window.confirm(`Delete the "${selectedSection.title}" page and all its content?`)) return;
    const nextSections = sections.filter((section) => section.id !== selectedSection.id);
    setContent((current) => ({ ...current, sections: nextSections }));
    setPendingPdfs((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => !key.startsWith(`${selectedSection.id}:`))
    ));
    setSelectedSectionId(nextSections[0]?.id || "");
  };

  const addItem = () => {
    updateSection("items", [
      ...selectedItems,
      { title: "", description: "", time: "", display_order: selectedItems.length + 1, is_active: 1 },
    ]);
  };

  const deleteItem = (index) => {
    const nextItems = selectedItems.filter((_, itemIndex) => itemIndex !== index);
    updateSection("items", nextItems);
    const prefix = `${selectedSection.id}:`;
    setPendingPdfs((current) => {
      const next = {};
      Object.entries(current).forEach(([key, file]) => {
        if (!key.startsWith(prefix)) {
          next[key] = file;
          return;
        }
        const itemIndex = Number(key.slice(prefix.length));
        if (itemIndex < index) next[key] = file;
        if (itemIndex > index) next[`${prefix}${itemIndex - 1}`] = file;
      });
      return next;
    });
  };

  const saveContent = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/api/site-pages/library`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save library content.");
      }

      let savedContent = content;
      for (const [key, file] of Object.entries(pendingPdfs)) {
        const [sectionId, itemIndexValue] = key.split(":");
        const sectionIndex = savedContent.sections.findIndex((section) => section.id === sectionId);
        const itemIndex = Number(itemIndexValue);
        if (sectionIndex < 0 || !savedContent.sections[sectionIndex]?.items[itemIndex]) continue;

        const body = new FormData();
        body.append("document", file);
        const uploadResponse = await fetch(
          `${API_BASE}/api/site-pages/library/sections/${sectionIndex}/items/${itemIndex}/document`,
          { method: "POST", body }
        );
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.message || `Unable to upload the PDF for "${savedContent.sections[sectionIndex].items[itemIndex].title}".`);
        }

        const nextSections = [...savedContent.sections];
        const nextItems = [...nextSections[sectionIndex].items];
        nextItems[itemIndex] = { ...nextItems[itemIndex], documentUrl: uploadResult.documentUrl };
        nextSections[sectionIndex] = { ...nextSections[sectionIndex], items: nextItems };
        savedContent = { ...savedContent, sections: nextSections };
      }

      setContent(savedContent);
      setPendingPdfs({});
      setSuccess("Library pages and content saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save library content.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-center text-sm text-slate-500">Loading library content...</p>;
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Library pages</h1>
        <p className="mt-2 text-sm text-slate-600">Create and manage the Library sidebar pages and the content shown on each public page.</p>
      </header>

      {error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</p>}

      {content && (
        <div className="space-y-6">
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Library header content</h2>
              <p className="mt-1 text-sm text-slate-500">These database-managed values appear in the existing public Library header.</p>
            </div>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Eyebrow
              <input value={content.hero.eyebrow || ""} onChange={(event) => updateHero("eyebrow", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Heading
              <input value={content.hero.title || ""} onChange={(event) => updateHero("title", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-slate-700">Description
              <textarea rows={3} value={content.hero.description || ""} onChange={(event) => updateHero("description", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {(content.hero.stats || []).map((stat, index) => (
                <div key={`header-stat-${index}`} className="grid gap-2 rounded-lg border border-slate-100 p-3 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">Stat label
                    <input value={stat.label || ""} onChange={(event) => updateHeroStat(index, "label", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">Stat value
                    <input value={stat.value || ""} onChange={(event) => updateHeroStat(index, "value", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
            <section className="h-fit rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2 px-2 py-1">
                <h2 className="text-sm font-bold text-slate-800">Sidebar pages</h2>
                <button type="button" onClick={addSection} aria-label="Add Library page" className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-semibold text-[#0f3262] hover:bg-blue-100">
                  <Plus size={15} /> Add
                </button>
              </div>
              <div className="mt-2 max-h-[60vh] space-y-1 overflow-y-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm ${
                      selectedSection?.id === section.id ? "bg-[#0f3262] font-semibold text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{section.title || "Untitled page"}</span>
                    {section.is_active === 0 || section.is_active === "0" ? <span className="text-[10px]">Hidden</span> : null}
                  </button>
                ))}
              </div>
            </section>

            {selectedSection ? (
              <section className="min-w-0 space-y-5">
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Page details</h2>
                      <p className="mt-1 text-sm text-slate-500">The title is also used as the public sidebar label.</p>
                    </div>
                    <button type="button" onClick={deleteSection} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                      <Trash2 size={15} /> Delete page
                    </button>
                  </div>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">Page title
                    <input value={selectedSection.title || ""} onChange={(event) => updateSection("title", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-slate-700">Description
                    <textarea rows={3} value={selectedSection.description || ""} onChange={(event) => updateSection("description", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                  </label>
                  <div className="flex flex-wrap items-center gap-5">
                    <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
                      <input type="number" min="0" value={selectedSection.display_order ?? selectedSectionIndex + 1} onChange={(event) => updateSection("display_order", Number(event.target.value) || 0)} className="border border-slate-300 px-3 py-2 font-normal" />
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" checked={selectedSection.is_active !== false && selectedSection.is_active !== 0 && selectedSection.is_active !== "0"} onChange={(event) => updateSection("is_active", event.target.checked ? 1 : 0)} />
                      Show in public sidebar
                    </label>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Page content</h2>
                      <p className="mt-1 text-sm text-slate-500">Add cards, details, hours, and optional PDF documents.</p>
                    </div>
                    <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <Plus size={16} /> Add content
                    </button>
                  </div>

                  {selectedItems.map((item, index) => {
                    const pdfKey = `${selectedSection.id}:${index}`;
                    return (
                      <article key={`${selectedSection.id}-item-${index}`} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm font-semibold text-slate-700">Card heading
                          <input value={item.title || ""} onChange={(event) => updateItem(index, "title", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                        </label>
                        <label className="grid gap-1 text-sm font-semibold text-slate-700">Time (optional)
                          <input value={item.time || ""} onChange={(event) => updateItem(index, "time", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" placeholder="9:00 a.m. to 5:00 p.m." />
                        </label>
                        <label className="grid gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">Details
                          <textarea rows={3} value={item.description || ""} onChange={(event) => updateItem(index, "description", event.target.value)} className="border border-slate-300 px-3 py-2 font-normal" />
                        </label>
                        <label className="grid gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                          Related PDF (optional)
                          <span className="flex items-center gap-2">
                            <Upload size={15} className="shrink-0 text-slate-500" />
                            <input type="file" accept="application/pdf,.pdf" onChange={(event) => {
                              const file = event.target.files?.[0];
                              setPendingPdfs((current) => {
                                const next = { ...current };
                                if (file) next[pdfKey] = file;
                                else delete next[pdfKey];
                                return next;
                              });
                            }} className="min-w-0 text-sm font-normal text-slate-600 file:mr-3 file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0f3262]" />
                          </span>
                          <span className="font-normal text-slate-500">
                            {pendingPdfs[pdfKey]?.name || (item.documentUrl ? "An existing PDF will remain unless replaced." : "PDF only, up to 20 MB.")}
                          </span>
                        </label>
                        <label className="grid max-w-40 gap-1 text-sm font-semibold text-slate-700">Display order
                          <input type="number" min="0" value={item.display_order ?? index + 1} onChange={(event) => updateItem(index, "display_order", Number(event.target.value) || 0)} className="border border-slate-300 px-3 py-2 font-normal" />
                        </label>
                        <div className="flex items-center justify-between gap-3 sm:col-span-2">
                          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                            <input type="checkbox" checked={item.is_active !== false && item.is_active !== 0 && item.is_active !== "0"} onChange={(event) => updateItem(index, "is_active", event.target.checked ? 1 : 0)} />
                            Active on public page
                          </label>
                          <button type="button" onClick={() => deleteItem(index)} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                            <Trash2 size={15} /> Remove
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {!selectedItems.length && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">No content cards yet. Add one to publish information on this page.</p>}
                </section>
              </section>
            ) : (
              <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Create a Library page to get started.</p>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button type="button" onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19477f] disabled:opacity-60">
              {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
              Save Library pages
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
