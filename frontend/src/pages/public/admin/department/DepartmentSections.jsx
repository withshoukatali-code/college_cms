import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const EMPTY_SECTION = { section_key: "", title: "", content: "", display_order: 0, is_active: 1 };
const CONTENT_TAGS = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "DIV", "EM", "H1", "H2", "H3", "H4", "H5", "H6",
  "I", "LI", "OL", "P", "S", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TFOOT",
  "TH", "THEAD", "TR", "U", "UL",
]);
const CONTENT_TAG_PATTERN = /<\/?(?:a|b|blockquote|br|div|em|h[1-6]|i|li|ol|p|s|span|strong|table|tbody|td|tfoot|th|thead|tr|u|ul)\b/i;
const PASTED_STYLE_PROPERTIES = new Set([
  "background-color",
  "border",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-style",
  "border-bottom-width",
  "border-color",
  "border-left",
  "border-left-color",
  "border-left-style",
  "border-left-width",
  "border-right",
  "border-right-color",
  "border-right-style",
  "border-right-width",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-style",
  "border-top-width",
  "border-width",
  "color",
  "text-align",
  "vertical-align",
]);

const toKey = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]);

const sanitizePastedStyle = (styleText) => {
  const parsedStyle = document.createElement("span").style;
  parsedStyle.cssText = styleText;
  const safeStyle = [];
  for (const property of PASTED_STYLE_PROPERTIES) {
    let value = parsedStyle.getPropertyValue(property).trim();
    if (!value) continue;
    value = value.replace(/\bwindowtext\b/gi, "#000000").replace(/\bwindow\b/gi, "#ffffff");
    const isColor = ["background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color"].includes(property);
    if (isColor && !CSS.supports("color", value)) continue;
    if (property.startsWith("border") && !isColor && !CSS.supports(property, value)) continue;
    if (property === "text-align" && !["left", "right", "center", "justify", "start", "end"].includes(value.toLowerCase())) continue;
    if (property === "vertical-align" && !["baseline", "top", "middle", "bottom", "text-top", "text-bottom"].includes(value.toLowerCase())) continue;
    safeStyle.push(`${property}:${value}`);
  }
  return safeStyle.join(";");
};

const sanitizeSectionHtml = (html) => {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const cleanNode = (node) => {
    [...node.children].forEach((child) => {
      if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH"].includes(child.tagName)) {
        child.remove();
        return;
      }
      cleanNode(child);
      if (!CONTENT_TAGS.has(child.tagName)) {
        child.replaceWith(...child.childNodes);
        return;
      }
      [...child.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        if (["colspan", "rowspan"].includes(name) && /^\d+$/.test(attribute.value)) return;
        if (child.tagName === "A" && name === "href" &&
          /^(https?:|mailto:|\/(?!\/)|#)/i.test(attribute.value.trim())) return;
        if (name === "style") {
          const safeStyle = sanitizePastedStyle(attribute.value);
          if (safeStyle) child.setAttribute("style", safeStyle);
          else child.removeAttribute("style");
          return;
        }
        child.removeAttribute(attribute.name);
      });
    });
  };
  cleanNode(parsed.body);
  return parsed.body.innerHTML;
};

const contentToEditorHtml = (content) => {
  if (!content) return "";
  if (CONTENT_TAG_PATTERN.test(content)) return sanitizeSectionHtml(content);
  return content.split(/\r?\n/).map((line) => `<p>${escapeHtml(line)}</p>`).join("");
};

const plainTextToHtml = (text) => {
  const rows = text.replace(/\r/g, "").split("\n");
  while (rows.length && rows[rows.length - 1] === "") rows.pop();
  if (rows.some((row) => row.includes("\t"))) {
    const cells = rows.map((row) => row.split("\t"));
    const columnCount = Math.max(...cells.map((row) => row.length));
    if (columnCount > 1) {
      return `<table><tbody>${cells.map((row) =>
        `<tr>${Array.from({ length: columnCount }, (_, index) => `<td>${escapeHtml(row[index] || "")}</td>`).join("")}</tr>`
      ).join("")}</tbody></table>`;
    }
  }
  return rows.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
};

const SectionContentEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const html = contentToEditorHtml(value || "");
      if (editorRef.current.innerHTML !== html) editorRef.current.innerHTML = html;
    }
  }, [value]);

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardHtml = event.clipboardData.getData("text/html");
    const clipboardText = event.clipboardData.getData("text/plain");
    const pastedHtml = clipboardHtml
      ? sanitizeSectionHtml(clipboardHtml)
      : plainTextToHtml(clipboardText);
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    range.deleteContents();
    const fragment = range.createContextualFragment(pastedHtml);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    onChange(editor.innerHTML);
  };

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="Section content"
      aria-multiline="true"
      onInput={(event) => onChange(event.currentTarget.innerHTML)}
      onPaste={handlePaste}
      className="mt-1 min-h-40 w-full overflow-x-auto border border-slate-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-blue-600 [&_a]:text-blue-700 [&_ol]:list-decimal [&_ol]:pl-6 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-slate-400 [&_td]:border [&_td]:border-slate-400 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-400 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_ul]:list-disc [&_ul]:pl-6"
      data-placeholder="Paste or type text; Word tables are supported."
    />
  );
};

const fetchSections = async (departmentId) => {
  const response = await fetch(`${API_BASE}/api/departments/${departmentId}/sections`);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Unable to load department sections.");
  return result.sections || [];
};

const DepartmentSections = ({ departmentId }) => {
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState(EMPTY_SECTION);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;
    fetchSections(departmentId)
      .then((loadedSections) => {
        if (current) setSections(loadedSections);
      })
      .catch((err) => {
        if (current) setError(err.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [departmentId]);

  const loadSections = async () => {
    try {
      setError("");
      setSections(await fetchSections(departmentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_SECTION);
    setEditingId(null);
  };

  const saveSection = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        editingId
          ? `${API_BASE}/api/departments/${departmentId}/sections/${editingId}`
          : `${API_BASE}/api/departments/${departmentId}/sections`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, display_order: Number(form.display_order) || 0 }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save department section.");
      const wasEditing = Boolean(editingId);
      resetForm();
      await loadSections();
      setMessage(wasEditing ? "Department page section updated." : "Department page section added.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const editSection = (section) => {
    setEditingId(section.id);
    setForm({
      section_key: section.section_key || "",
      title: section.title || "",
      content: section.content || "",
      display_order: section.display_order || 0,
      is_active: Number(section.is_active),
    });
    setError("");
  };

  const deleteSection = async (section) => {
    if (!window.confirm(`Delete the "${section.title}" section?`)) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/departments/${departmentId}/sections/${section.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete department section.");
      if (editingId === section.id) resetForm();
      await loadSections();
      setMessage("Department page section deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mt-8 border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="font-bold text-slate-900">Department Page Sections</h2>
        <p className="mt-1 text-sm text-slate-500">Manage the content sections shown on the public department page.</p>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="space-y-3">
          {error && <p role="alert" className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          {message && <p role="status" className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
          {loading ? <p className="py-5 text-sm text-slate-500">Loading sections...</p> : sections.map((section) => (
            <article key={section.id} className="flex items-start gap-3 border border-slate-200 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{section.title}</h3>
                  {Number(section.is_active) !== 1 && <span className="text-xs font-medium text-amber-700">Unpublished</span>}
                </div>
                <p className="mt-1 text-xs text-slate-500">#{section.section_key} · Order {section.display_order}</p>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">
                  {new DOMParser().parseFromString(section.content || "", "text/html").body.textContent}
                </p>
              </div>
              <button type="button" onClick={() => editSection(section)} aria-label={`Edit ${section.title}`} className="p-1.5 text-slate-500 hover:text-blue-700"><Pencil size={16} /></button>
              <button type="button" onClick={() => deleteSection(section)} aria-label={`Delete ${section.title}`} className="p-1.5 text-slate-500 hover:text-red-700"><Trash2 size={16} /></button>
            </article>
          ))}
          {!loading && sections.length === 0 && <p className="border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">No page sections yet.</p>}
        </div>

        <form onSubmit={saveSection} className="space-y-3 border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-900">{editingId ? "Edit section" : "Add section"}</h3>
            {editingId && <button type="button" aria-label="Cancel section edit" onClick={resetForm} className="p-1 text-slate-500 hover:text-slate-900"><X size={17} /></button>}
          </div>
          <label className="block text-xs font-medium text-slate-600">Title<input required value={form.title} onChange={(event) => {
            const title = event.target.value;
            setForm((previous) => ({ ...previous, title, section_key: editingId && previous.section_key ? previous.section_key : toKey(title) }));
          }} className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm" /></label>
          <label className="block text-xs font-medium text-slate-600">Section key<input required value={form.section_key} onChange={(event) => setForm({ ...form, section_key: toKey(event.target.value) })} placeholder="about" className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm" /></label>
          <div className="block text-xs font-medium text-slate-600">
            <span>Content</span>
            <SectionContentEditor value={form.content} onChange={(content) => setForm((previous) => ({ ...previous, content }))} />
            <p className="mt-1 text-xs font-normal text-slate-500">Paste formatted text or a table copied from Word. Plain tab-separated tables are also supported.</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-medium text-slate-600">Display order<input type="number" min="0" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: event.target.value })} className="mt-1 block w-24 border border-slate-300 px-3 py-2 text-sm" /></label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={Number(form.is_active) === 1} onChange={(event) => setForm({ ...form, is_active: event.target.checked ? 1 : 0 })} />Published</label>
          </div>
          <button disabled={saving} className="inline-flex items-center gap-2 bg-[#0f3262] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{editingId ? <Save size={16} /> : <Plus size={16} />}{editingId ? "Save changes" : "Create section"}</button>
        </form>
      </div>
    </section>
  );
};

export default DepartmentSections;
