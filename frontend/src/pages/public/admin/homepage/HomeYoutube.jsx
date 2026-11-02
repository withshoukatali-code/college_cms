
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

// ============================================================
// API CONFIG
// ============================================================

const API_BASE_URL = "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/home-youtube`;

// ============================================================
// YOUTUBE HELPERS
// ============================================================

function getYouTubeId(url = "") {
  if (!url) return "";

  const value = url.trim();

  // https://www.youtube.com/watch?v=XXXXXXXXXXX
  const watchMatch = value.match(
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
  );

  if (watchMatch?.[1]) {
    return watchMatch[1];
  }

  // https://youtu.be/XXXXXXXXXXX
  const shortMatch = value.match(
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  // https://www.youtube.com/embed/XXXXXXXXXXX
  const embedMatch = value.match(
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );

  if (embedMatch?.[1]) {
    return embedMatch[1];
  }

  // https://www.youtube.com/shorts/XXXXXXXXXXX
  const shortsMatch = value.match(
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );

  if (shortsMatch?.[1]) {
    return shortsMatch[1];
  }

  // https://www.youtube.com/live/XXXXXXXXXXX
  const liveMatch = value.match(
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/
  );

  if (liveMatch?.[1]) {
    return liveMatch[1];
  }

  return "";
}

// ============================================================
// YOUTUBE THUMBNAIL
// ============================================================

function getYouTubeThumbnail(videoUrl = "") {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return "";
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ============================================================
// YOUTUBE EMBED
// ============================================================

function getYouTubeEmbedUrl(videoUrl = "") {
  const videoId = getYouTubeId(videoUrl);

  if (!videoId) {
    return "";
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

// ============================================================
// DEFAULT FORM
// ============================================================

const EMPTY_FORM = {
  title: "",
  description: "",
  video_url: "",
  thumbnail_url: "",
  button_text: "Watch Video",
  button_link: "",
  display_order: 0,
  is_active: 1,
};

// ============================================================
// YOUTUBE BADGE
// ============================================================

function YouTubeBadge({ size = "normal" }) {
  const small = size === "small";

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-red-600 font-bold text-white shadow-sm ${
        small
          ? "h-9 w-9 text-[9px]"
          : "h-11 w-11 text-[10px]"
      }`}
    >
      YT
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function HomeYoutube() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  // ==========================================================
  // FETCH VIDEOS
  // ==========================================================

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/all`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load YouTube videos."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to load YouTube videos."
        );
      }

      setVideos(
        Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        "HomeYoutube GET error:",
        err
      );

      setError(
        err?.message ||
          "Unable to connect to the YouTube API."
      );

      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    fetchVideos();
  }, []);

  // ==========================================================
  // CLEAR SUCCESS MESSAGE
  // ==========================================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [success]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredVideos = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return videos;
    }

    return videos.filter((video) => {
      const title = String(
        video.title || ""
      ).toLowerCase();

      const description = String(
        video.description || ""
      ).toLowerCase();

      const url = String(
        video.video_url || ""
      ).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        url.includes(query)
      );
    });
  }, [videos, search]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  // ==========================================================
  // VIDEO URL CHANGE
  // ==========================================================

  const handleVideoUrlChange = (
    event
  ) => {
    const value = event.target.value;

    const thumbnail =
      getYouTubeThumbnail(value);

    setForm((previous) => ({
      ...previous,

      video_url: value,

      thumbnail_url: thumbnail,

      button_link: value,
    }));
  };

  // ==========================================================
  // ADD FORM
  // ==========================================================

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");

    setSuccess("");

    setShowForm(true);
  };

  // ==========================================================
  // EDIT FORM
  // ==========================================================

  const openEditForm = (video) => {
    const thumbnail =
      video.thumbnail_url ||
      getYouTubeThumbnail(
        video.video_url
      );

    setEditingId(video.id);

    setForm({
      title: video.title || "",

      description:
        video.description || "",

      video_url:
        video.video_url || "",

      thumbnail_url:
        thumbnail || "",

      button_text:
        video.button_text ||
        "Watch Video",

      button_link:
        video.button_link ||
        video.video_url ||
        "",

      display_order:
        video.display_order ?? 0,

      is_active:
        Number(video.is_active) === 1
          ? 1
          : 0,
    });

    setError("");

    setSuccess("");

    setShowForm(true);
  };

  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);

    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });
  };

  // ==========================================================
  // VALIDATE
  // ==========================================================

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Please enter a video title.";
    }

    if (!form.video_url.trim()) {
      return "Please enter a YouTube video URL.";
    }

    const videoId =
      getYouTubeId(form.video_url);

    if (!videoId) {
      return "Please enter a valid YouTube URL.";
    }

    return "";
  };

  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const videoId =
        getYouTubeId(
          form.video_url
        );

      const thumbnail =
        form.thumbnail_url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      const payload = {
        title: form.title.trim(),

        description:
          form.description?.trim() || "",

        video_url:
          form.video_url.trim(),

        thumbnail_url: thumbnail,

        button_text:
          form.button_text?.trim() ||
          "Watch Video",

        button_link:
          form.button_link?.trim() ||
          form.video_url.trim(),

        display_order:
          Number(
            form.display_order
          ) || 0,

        is_active:
          Number(form.is_active) === 1
            ? 1
            : 0,
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save video."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to save video."
        );
      }

      setSuccess(
        editingId
          ? "YouTube video updated successfully."
          : "YouTube video added successfully."
      );

      closeForm();

      await fetchVideos();
    } catch (err) {
      console.error(
        "HomeYoutube SAVE error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save video."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this YouTube video?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete video."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to delete video."
        );
      }

      setSuccess(
        "YouTube video deleted successfully."
      );

      await fetchVideos();
    } catch (err) {
      console.error(
        "HomeYoutube DELETE error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete video."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // TOGGLE ACTIVE
  // ==========================================================

  const handleToggleActive = async (
    video
  ) => {
    try {
      setError("");

      setSuccess("");

      const newStatus =
        Number(video.is_active) === 1
          ? 0
          : 1;

      const videoId =
        getYouTubeId(
          video.video_url
        );

      const payload = {
        title: video.title || "",

        description:
          video.description || "",

        video_url:
          video.video_url || "",

        thumbnail_url:
          video.thumbnail_url ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,

        button_text:
          video.button_text ||
          "Watch Video",

        button_link:
          video.button_link ||
          video.video_url ||
          "",

        display_order:
          Number(
            video.display_order
          ) || 0,

        is_active: newStatus,
      };

      const response =
        await fetch(
          `${API_URL}/${video.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update status."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update status."
        );
      }

      setSuccess(
        newStatus === 1
          ? "Video activated."
          : "Video deactivated."
      );

      await fetchVideos();
    } catch (err) {
      console.error(
        "HomeYoutube STATUS error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update status."
      );
    }
  };

  // ==========================================================
  // PREVIEW
  // ==========================================================

  const previewThumbnail =
    form.thumbnail_url ||
    getYouTubeThumbnail(
      form.video_url
    );

  const previewEmbed =
    getYouTubeEmbedUrl(
      form.video_url
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <YouTubeBadge />

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              YouTube Videos
            </h1>

            <p className="text-sm text-slate-500">
              Manage videos displayed on the homepage.
            </p>
          </div>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchVideos}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={18} />

            Add Video
          </button>

        </div>

      </div>

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search videos..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

          </div>

          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredVideos.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {videos.length}
            </span>{" "}
            videos
          </div>

        </div>

      </div>

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <RefreshCw
            size={30}
            className="mx-auto mb-3 animate-spin text-slate-400"
          />

          <p className="text-sm text-slate-500">
            Loading YouTube videos...
          </p>

        </div>

      ) : filteredVideos.length === 0 ? (

        /* ====================================================
           EMPTY
        ==================================================== */

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <YouTubeBadge size="small" />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            {search
              ? "No videos found"
              : "No YouTube videos yet"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {search
              ? "Try a different search."
              : "Add your first YouTube video to the homepage."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={openAddForm}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={17} />

              Add Video
            </button>
          )}

        </div>

      ) : (

        /* ====================================================
           VIDEO GRID
        ==================================================== */

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredVideos.map(
            (video) => {

              const thumbnail =
                video.thumbnail_url ||
                getYouTubeThumbnail(
                  video.video_url
                );

              const videoId =
                getYouTubeId(
                  video.video_url
                );

              const isActive =
                Number(
                  video.is_active
                ) === 1;

              return (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* ========================================
                      THUMBNAIL
                  ======================================== */}

                  <div className="relative aspect-video bg-slate-100">

                    {thumbnail ? (

                      <img
                        src={thumbnail}
                        alt={
                          video.title ||
                          "YouTube video"
                        }
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">
                        <YouTubeBadge />
                      </div>

                    )}

                    {/* PLAY BUTTON */}

                    {videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center"
                        title="Open YouTube video"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg transition hover:scale-105">
                          PLAY
                        </span>
                      </a>
                    )}

                    {/* STATUS */}

                    <div className="absolute right-3 top-3">

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                          isActive
                            ? "bg-green-600 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* ORDER */}

                    <div className="absolute bottom-3 left-3">

                      <span className="rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                        Order:{" "}
                        {video.display_order ??
                          0}
                      </span>

                    </div>

                  </div>

                  {/* ========================================
                      CONTENT
                  ======================================== */}

                  <div className="p-4">

                    <h2 className="line-clamp-2 min-h-[48px] text-base font-bold text-slate-900">
                      {video.title ||
                        "Untitled Video"}
                    </h2>

                    {video.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                        {video.description}
                      </p>
                    )}

                    <div className="mt-3 truncate rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      {video.video_url}
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleActive(
                            video
                          )
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >

                        {isActive ? (
                          <>
                            <EyeOff
                              size={16}
                            />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye
                              size={16}
                            />
                            Show
                          </>
                        )}

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            video
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        <Pencil
                          size={16}
                        />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            video.id
                          )
                        }
                        disabled={
                          deletingId ===
                          video.id
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        title="Delete"
                      >

                        {deletingId ===
                        video.id ? (
                          <RefreshCw
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2
                            size={16}
                          />
                        )}

                      </button>

                    </div>

                    {/* OPEN */}

                    {videoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Open on YouTube

                        <ExternalLink
                          size={13}
                        />
                      </a>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">

              <div className="flex items-center gap-3">

                <YouTubeBadge />

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId
                      ? "Edit YouTube Video"
                      : "Add YouTube Video"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    Enter the YouTube video information.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="p-5"
            >

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* ============================================
                    LEFT
                ============================================ */}

                <div className="space-y-5">

                  {/* TITLE */}

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Video Title
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter video title"
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      rows={5}
                      placeholder="Enter video description"
                      className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                  </div>

                  {/* URL */}

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      YouTube Video URL
                      <span className="text-red-500">
                        {" "}*
                      </span>
                    </label>

                    <input
                      type="url"
                      name="video_url"
                      value={
                        form.video_url
                      }
                      onChange={
                        handleVideoUrlChange
                      }
                      placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Thumbnail is generated automatically from the YouTube URL.
                    </p>

                  </div>

                  {/* BUTTON + ORDER */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Button Text
                      </label>

                      <input
                        type="text"
                        name="button_text"
                        value={
                          form.button_text
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Watch Video"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Display Order
                      </label>

                      <input
                        type="number"
                        name="display_order"
                        value={
                          form.display_order
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      />

                    </div>

                  </div>

                  {/* ACTIVE */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        Number(
                          form.is_active
                        ) === 1
                      }
                      onChange={
                        handleChange
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <div>

                      <div className="text-sm font-semibold text-slate-800">
                        Display on homepage
                      </div>

                      <div className="text-xs text-slate-500">
                        Active videos are available for the public homepage.
                      </div>

                    </div>

                  </label>

                </div>

                {/* ============================================
                    RIGHT
                ============================================ */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Thumbnail Preview
                  </label>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                    {previewThumbnail ? (

                      <img
                        src={
                          previewThumbnail
                        }
                        alt="YouTube thumbnail preview"
                        className="aspect-video w-full object-cover"
                      />

                    ) : (

                      <div className="flex aspect-video flex-col items-center justify-center text-slate-400">

                        <YouTubeBadge />

                        <p className="mt-3 text-sm">
                          Thumbnail Preview
                        </p>

                        <p className="mt-1 text-xs">
                          Enter a valid YouTube URL
                        </p>

                      </div>

                    )}

                  </div>

                  {/* VIDEO PREVIEW */}

                  {previewEmbed && (

                    <div className="mt-5">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Video Preview
                      </label>

                      <div className="overflow-hidden rounded-xl bg-black">

                        <iframe
                          src={
                            previewEmbed
                          }
                          title="YouTube video preview"
                          className="aspect-video w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />

                      </div>

                    </div>

                  )}

                  {/* GENERATED THUMBNAIL */}

                  {previewThumbnail && (

                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">

                      <p className="text-xs font-semibold text-slate-700">
                        Thumbnail URL
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-500">
                        {previewThumbnail}
                      </p>

                    </div>

                  )}

                </div>

              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {saving ? (

                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>

                  ) : (

                    <>
                      <Save size={17} />

                      {editingId
                        ? "Update Video"
                        : "Save Video"}
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
