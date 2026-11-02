
import { useEffect, useRef, useState } from "react";
import {
  Images,
  Upload,
  Pencil,
  Trash2,
  X,
  Save,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:5000";
const API_URL = `${API_BASE}/api/home-gallery`;

const emptyForm = {
  title: "",
  alt_text: "",
  display_order: 1,
  is_active: true,
  image: null,
};

function getImageUrl(value) {
  if (!value) return "";

  const url = String(value).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE}/${url.replace(/^\/+/, "")}`;
}

function HomeGallery() {
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ADMIN GALLERY
  // =========================================================

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/admin`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load homepage gallery."
        );
      }

      setImages(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Home Gallery fetch error:", err);

      setError(
        err.message || "Failed to load homepage gallery."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // BROWSE
  // =========================================================

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must not exceed 10 MB.");

      e.target.value = "";
      return;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const localPreview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(localPreview);
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setForm({
      ...emptyForm,
      display_order: images.length + 1,
    });

    setPreview("");
    setEditingId(null);
    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (image) => {
    setMessage("");
    setError("");

    setEditingId(image.id);

    setForm({
      title: image.title || "",
      alt_text: image.alt_text || "",
      display_order: image.display_order || 1,
      is_active:
        Number(image.is_active) === 1 ||
        image.is_active === true,
      image: null,
    });

    setPreview(getImageUrl(image.image_url));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
      `${API_URL}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to upload image."
      );
    }

    return result.data;
  };

  // =========================================================
  // ADD / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!editingId && !form.image) {
      setError("Please browse and select an image.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = "";

      // =====================================================
      // ADD NEW IMAGE
      // =====================================================

      if (!editingId) {
        // First upload physical image
        const uploadResult = await uploadImage(form.image);

        imageUrl = uploadResult.image_url;

        // Then create database record
        const response = await fetch(
          `${API_URL}/admin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: form.title.trim(),
              image_url: imageUrl,
              alt_text: form.alt_text.trim(),
              display_order:
                Number(form.display_order) || 1,
              is_active: form.is_active ? 1 : 0,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to save gallery image."
          );
        }

        setMessage(
          "Gallery image uploaded successfully."
        );
      }

      // =====================================================
      // UPDATE EXISTING IMAGE
      // =====================================================

      else {
        const existingImage = images.find(
          (item) => Number(item.id) === Number(editingId)
        );

        if (!existingImage) {
          throw new Error("Gallery image not found.");
        }

        imageUrl = existingImage.image_url;

        // If a new image was selected, upload it first
        if (form.image) {
          const uploadResult = await uploadImage(
            form.image
          );

          imageUrl = uploadResult.image_url;
        }

        // Update database record
        const response = await fetch(
          `${API_URL}/admin/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: form.title.trim(),
              image_url: imageUrl,
              alt_text: form.alt_text.trim(),
              display_order:
                Number(form.display_order) || 1,
              is_active: form.is_active ? 1 : 0,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to update gallery image."
          );
        }

        setMessage(
          "Gallery image updated successfully."
        );
      }

      resetForm();

      await fetchGallery();
    } catch (err) {
      console.error("Home Gallery save error:", err);

      setError(
        err.message ||
          "Failed to save gallery image."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this gallery image?"
      )
    ) {
      return;
    }

    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      const response = await fetch(
        `${API_URL}/admin/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete image."
        );
      }

      if (editingId === id) {
        resetForm();
      }

      setMessage(
        "Gallery image deleted successfully."
      );

      await fetchGallery();
    } catch (err) {
      console.error("Delete error:", err);

      setError(
        err.message ||
          "Failed to delete image."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // ACTIVE TOGGLE
  // =========================================================

  const handleToggle = async (image) => {
    setMessage("");
    setError("");

    try {
      const active =
        Number(image.is_active) === 1 ||
        image.is_active === true;

      const response = await fetch(
        `${API_URL}/admin/${image.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: image.title || "",
            image_url: image.image_url,
            alt_text: image.alt_text || "",
            display_order:
              Number(image.display_order) || 1,
            is_active: active ? 0 : 1,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update status."
        );
      }

      setMessage(
        active
          ? "Image hidden from homepage."
          : "Image is now visible on homepage."
      );

      await fetchGallery();
    } catch (err) {
      console.error("Toggle error:", err);

      setError(
        err.message ||
          "Failed to update image status."
      );
    }
  };

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-5 lg:p-7">

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f3262] text-white">
            <Images size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Home Gallery
            </h1>

            <p className="text-sm text-slate-500">
              Manage images displayed on the homepage.
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchGallery}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>

      </div>

      {/* MESSAGES */}

      {message && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ADD / EDIT */}

      <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingId
                ? "Edit Gallery Image"
                : "Add Homepage Gallery Image"}
            </h2>

            <p className="text-sm text-slate-500">
              Upload and manage homepage gallery images.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              <X size={16} />
              Cancel
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* IMAGE */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gallery Image
                {!editingId && (
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                )}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                  <img
                    src={preview}
                    alt="Preview"
                    className="aspect-[4/3] w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="absolute bottom-3 left-3 right-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#0f3262] shadow-lg"
                  >
                    <Upload size={16} />

                    {editingId
                      ? "Replace Image"
                      : "Change Image"}
                  </button>

                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBrowse}
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-[#0f3262] hover:bg-slate-100"
                >

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0f3262] shadow-sm">
                    <Upload size={22} />
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    Browse Image
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    JPG, PNG, WEBP up to 10 MB
                  </span>

                </button>
              )}

            </div>

            {/* DETAILS */}

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Annual Function"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Alt Text
                </label>

                <input
                  name="alt_text"
                  value={form.alt_text}
                  onChange={handleChange}
                  placeholder="Describe the image"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0f3262] focus:ring-2 focus:ring-[#0f3262]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Type
                </label>

                <input
                  value="Homepage Gallery"
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Display Order
                </label>

                <input
                  name="display_order"
                  type="number"
                  min="1"
                  value={form.display_order}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0f3262]"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#0f3262]"
                />

                Show on homepage

              </label>

              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b2850] disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <Save size={17} />
                      Update Image
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Image
                    </>
                  )}

                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                )}

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* EXISTING */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Existing Homepage Gallery
            </h2>

            <p className="text-sm text-slate-500">
              {images.length}{" "}
              {images.length === 1
                ? "image"
                : "images"}{" "}
              available
            </p>
          </div>

          <Images
            size={20}
            className="text-slate-400"
          />

        </div>

        {loading ? (
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-100" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}

          </div>
        ) : images.length === 0 ? (
          <div className="px-5 py-16 text-center">

            <Images
              size={35}
              className="mx-auto mb-3 text-slate-300"
            />

            <h3 className="font-semibold text-slate-800">
              No gallery images
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Upload your first homepage gallery image above.
            </p>

          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">

            {images.map((image) => {

              const active =
                Number(image.is_active) === 1 ||
                image.is_active === true;

              const imageUrl =
                getImageUrl(image.image_url);

              return (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-md"
                >

                  <div className="group relative aspect-[4/3] overflow-hidden bg-slate-100">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          image.alt_text ||
                          image.title ||
                          "Homepage gallery"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Images
                          size={35}
                          className="text-slate-300"
                        />
                      </div>
                    )}

                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white ${
                        active
                          ? "bg-emerald-500"
                          : "bg-slate-600"
                      }`}
                    >
                      {active ? (
                        <Eye size={12} />
                      ) : (
                        <EyeOff size={12} />
                      )}

                      {active
                        ? "Visible"
                        : "Hidden"}
                    </span>

                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow">

                      <GripVertical size={12} />

                      {image.display_order || 1}

                    </span>

                  </div>

                  <div className="p-4">

                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {image.title ||
                        "Untitled Image"}
                    </h3>

                    {image.alt_text && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {image.alt_text}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(image)
                        }
                        className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {active ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}

                        {active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(image)
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-50 px-2 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(image.id)
                        }
                        disabled={
                          deletingId === image.id
                        }
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-50 px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deletingId === image.id ? (
                          <RefreshCw
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}

                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default HomeGallery;

