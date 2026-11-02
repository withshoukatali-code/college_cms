import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-events";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  event_date: "",
  image_url: "",
  button_text: "",
  button_link: "",
  display_order: 0,
  is_active: "1",
};

const imageUrl = (value) => {
  if (!value) return "";

  if (
    value.startsWith("http") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
};

function HomeEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const imageInputRef = useRef(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch events.");
      }

      setEvents(Array.isArray(result.data) ? result.data : []);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const openAddModal = () => {
    resetForm();

    setForm({
      ...emptyForm,
      display_order: events.length + 1,
    });

    setError("");
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingId(event.id);
    setImageFile(null);

    setForm({
      title: event.title || "",
      category: event.category || "",
      description: event.description || "",
      event_date: event.event_date
        ? String(event.event_date).substring(0, 10)
        : "",
      image_url: event.image_url || "",
      button_text: event.button_text || "",
      button_link: event.button_link || "",
      display_order: event.display_order ?? 0,
      is_active: Number(event.is_active) === 1 ? "1" : "0",
    });

    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    resetForm();
    setError("");
    setModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Event image must be smaller than 3 MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);

    setForm((previous) => ({
      ...previous,
      image_url: URL.createObjectURL(file),
    }));
  };

  const removeImage = () => {
    setImageFile(null);

    setForm((previous) => ({
      ...previous,
      image_url: "",
    }));

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = new FormData();

      payload.append("title", form.title.trim());
      payload.append("category", form.category.trim());
      payload.append("description", form.description.trim());
      payload.append("event_date", form.event_date);
      payload.append("button_text", form.button_text.trim());
      payload.append("button_link", form.button_link.trim());
      payload.append("display_order", form.display_order || "0");
      payload.append("is_active", form.is_active);

      if (imageFile) {
        payload.append("image", imageFile);
      } else {
        payload.append(
          "image_url",
          form.image_url.startsWith("blob:")
            ? ""
            : form.image_url.trim()
        );
      }

      if (editingId && !form.image_url) {
        payload.append("remove_image", "1");
      }

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          body: payload,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save event.");
      }

      closeModal();
      await fetchEvents();
    } catch (requestError) {
      setError(requestError.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this homepage event?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete event.");
      }

      await fetchEvents();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete event.");
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading events...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Homepage Management
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Events
          </h1>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {error && !modalOpen && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {events.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No homepage events found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {events.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-16 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {item.image_url ? (
                          <img
                            src={imageUrl(item.image_url)}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <CalendarDays className="text-slate-300" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.category || "No category"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  <td className="p-4">
                    <span
                      className={
                        Number(item.is_active) === 1
                          ? "rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
                          : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                      }
                    >
                      {Number(item.is_active) === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Event" : "Add Event"}
              </h2>

              <button type="button" onClick={closeModal}>
                <X className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event Title *"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />

                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Description"
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Event Image
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="Paste a public image URL"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3"
                  />

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700"
                  >
                    <ImageIcon size={18} />
                    Browse
                  </button>
                </div>

                {form.image_url && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={imageUrl(form.image_url)}
                      alt="Event preview"
                      className="h-40 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="m-3 text-sm font-semibold text-red-600"
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="button_text"
                  value={form.button_text}
                  onChange={handleChange}
                  placeholder="Button Text"
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />

                <input
                  type="text"
                  name="button_link"
                  value={form.button_link}
                  onChange={handleChange}
                  placeholder="/events"
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                  min="0"
                  className="rounded-xl border border-slate-200 px-4 py-3"
                />

                <select
                  name="is_active"
                  value={form.is_active}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeEvents;

