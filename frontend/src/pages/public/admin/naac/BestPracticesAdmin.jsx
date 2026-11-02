import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  CalendarDays,
  Users,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
  academic_year: "",
  practice_number: 1,
  title: "",
  short_description: "",
  objectives: "",
  context: "",
  practice: "",
  activities: "",
  outcomes_impact: "",
  evidence_of_success: "",
  problems_encountered: "",
  resources_required: "",
  beneficiaries: "",
  display_order: 1,
  is_active: 1,
};

const EMPTY_ACTIVITY = {
  activity_title: "",
  description: "",
  activity_date: "",
  participants: "",
  beneficiary_group: "",
  outcomes: "",
  display_order: 1,
  is_active: 1,
};

export default function BestPracticesAdmin() {
  const [practices, setPractices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [expandedPractice, setExpandedPractice] =
    useState(null);

  const [activities, setActivities] = useState({});
  const [photos, setPhotos] = useState({});
  const [documents, setDocuments] = useState({});

  const [loadingChildren, setLoadingChildren] =
    useState({});

  const [showActivityForm, setShowActivityForm] =
    useState(null);

  const [editingActivity, setEditingActivity] =
    useState(null);

  const [activityForm, setActivityForm] =
    useState(EMPTY_ACTIVITY);

  const [photoForms, setPhotoForms] =
    useState({});

  const [documentForms, setDocumentForms] =
    useState({});

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    loadPractices();
  }, []);

  const loadPractices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to load best practices"
        );
      }

      setPractices(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      console.error(
        "LOAD BEST PRACTICES ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load best practices"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3500);
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const sortedPractices = useMemo(() => {
    return [...practices].sort((a, b) => {
      const yearCompare = String(
        b.academic_year || ""
      ).localeCompare(
        String(a.academic_year || "")
      );

      if (yearCompare !== 0) {
        return yearCompare;
      }

      return (
        Number(a.practice_number || 0) -
        Number(b.practice_number || 0)
      );
    });
  }, [practices]);

  /* =========================================================
     START ADD
  ========================================================= */

  const startAdd = () => {
    clearMessages();

    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      display_order:
        practices.length + 1,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     START EDIT
  ========================================================= */

  const startEdit = (item) => {
    clearMessages();

    setEditingId(item.id);

    setForm({
      academic_year:
        item.academic_year || "",
      practice_number:
        item.practice_number || 1,
      title: item.title || "",
      short_description:
        item.short_description || "",
      objectives:
        item.objectives || "",
      context: item.context || "",
      practice: item.practice || "",
      activities:
        item.activities || "",
      outcomes_impact:
        item.outcomes_impact || "",
      evidence_of_success:
        item.evidence_of_success || "",
      problems_encountered:
        item.problems_encountered || "",
      resources_required:
        item.resources_required || "",
      beneficiaries:
        item.beneficiaries || "",
      display_order:
        item.display_order || 1,
      is_active:
        Number(item.is_active) === 1 ? 1 : 0,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     CANCEL FORM
  ========================================================= */

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  /* =========================================================
     SAVE BEST PRACTICE
  ========================================================= */

  const savePractice = async (event) => {
    event.preventDefault();

    clearMessages();

    if (
      !form.academic_year.trim() ||
      !form.title.trim()
    ) {
      setError(
        "Academic year and title are required."
      );

      return;
    }

    try {
      setSaving(true);

      const method = editingId
        ? "PUT"
        : "POST";

      const url = editingId
        ? `${API_BASE}/api/naac/best-practices/${editingId}`
        : `${API_BASE}/api/naac/best-practices`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year:
            form.academic_year.trim(),

          practice_number:
            Number(form.practice_number) || 1,

          title: form.title.trim(),

          short_description:
            form.short_description.trim(),

          objectives:
            form.objectives.trim(),

          context:
            form.context.trim(),

          practice:
            form.practice.trim(),

          activities:
            form.activities.trim(),

          outcomes_impact:
            form.outcomes_impact.trim(),

          evidence_of_success:
            form.evidence_of_success.trim(),

          problems_encountered:
            form.problems_encountered.trim(),

          resources_required:
            form.resources_required.trim(),

          beneficiaries:
            form.beneficiaries.trim(),

          display_order:
            Number(form.display_order) || 1,

          is_active:
            Number(form.is_active) === 1
              ? 1
              : 0,
        }),
      });

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to save best practice"
        );
      }

      showSuccess(
        editingId
          ? "Best practice updated successfully."
          : "Best practice created successfully."
      );

      cancelForm();

      await loadPractices();
    } catch (err) {
      console.error(
        "SAVE BEST PRACTICE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save best practice"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DELETE BEST PRACTICE
  ========================================================= */

  const deletePractice = async (id) => {
    const confirmed = window.confirm(
      "Delete this Best Practice?\n\nThis will also delete its activities, photographs and supporting documents."
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to delete best practice"
        );
      }

      showSuccess(
        "Best practice deleted successfully."
      );

      setExpandedPractice(null);

      await loadPractices();
    } catch (err) {
      console.error(
        "DELETE BEST PRACTICE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete best practice"
      );
    }
  };

  /* =========================================================
     LOAD CHILD DATA
  ========================================================= */

  const loadChildData = async (practiceId) => {
    try {
      setLoadingChildren((previous) => ({
        ...previous,
        [practiceId]: true,
      }));

      const [
        activitiesResponse,
        photosResponse,
        documentsResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE}/api/naac/best-practices/${practiceId}/activities`
        ),
        fetch(
          `${API_BASE}/api/naac/best-practices/${practiceId}/photos`
        ),
        fetch(
          `${API_BASE}/api/naac/best-practices/${practiceId}/documents`
        ),
      ]);

      const [
        activitiesResult,
        photosResult,
        documentsResult,
      ] = await Promise.all([
        activitiesResponse.json(),
        photosResponse.json(),
        documentsResponse.json(),
      ]);

      if (
        !activitiesResponse.ok ||
        !activitiesResult.success
      ) {
        throw new Error(
          activitiesResult?.message ||
            "Unable to load activities"
        );
      }

      if (
        !photosResponse.ok ||
        !photosResult.success
      ) {
        throw new Error(
          photosResult?.message ||
            "Unable to load photos"
        );
      }

      if (
        !documentsResponse.ok ||
        !documentsResult.success
      ) {
        throw new Error(
          documentsResult?.message ||
            "Unable to load documents"
        );
      }

      setActivities((previous) => ({
        ...previous,
        [practiceId]:
          Array.isArray(
            activitiesResult.data
          )
            ? activitiesResult.data
            : [],
      }));

      setPhotos((previous) => ({
        ...previous,
        [practiceId]:
          Array.isArray(
            photosResult.data
          )
            ? photosResult.data
            : [],
      }));

      setDocuments((previous) => ({
        ...previous,
        [practiceId]:
          Array.isArray(
            documentsResult.data
          )
            ? documentsResult.data
            : [],
      }));
    } catch (err) {
      console.error(
        "LOAD CHILD DATA ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load related data"
      );
    } finally {
      setLoadingChildren((previous) => ({
        ...previous,
        [practiceId]: false,
      }));
    }
  };

  /* =========================================================
     EXPAND / COLLAPSE
  ========================================================= */

  const togglePractice = async (id) => {
    clearMessages();

    if (expandedPractice === id) {
      setExpandedPractice(null);
      return;
    }

    setExpandedPractice(id);

    await loadChildData(id);
  };

  /* =========================================================
     ACTIVITY FORM
  ========================================================= */

  const openAddActivity = (practiceId) => {
    setEditingActivity(null);

    setActivityForm({
      ...EMPTY_ACTIVITY,
      display_order:
        (activities[practiceId]?.length || 0) +
        1,
    });

    setShowActivityForm(practiceId);
  };

  const openEditActivity = (
    practiceId,
    activity
  ) => {
    setEditingActivity(activity.id);

    setActivityForm({
      activity_title:
        activity.activity_title || "",
      description:
        activity.description || "",
      activity_date:
        activity.activity_date || "",
      participants:
        activity.participants ?? "",
      beneficiary_group:
        activity.beneficiary_group || "",
      outcomes:
        activity.outcomes || "",
      display_order:
        activity.display_order || 1,
      is_active:
        Number(activity.is_active) === 1
          ? 1
          : 0,
    });

    setShowActivityForm(practiceId);
  };

  const cancelActivity = () => {
    setShowActivityForm(null);
    setEditingActivity(null);
    setActivityForm(EMPTY_ACTIVITY);
  };

  /* =========================================================
     SAVE ACTIVITY
  ========================================================= */

  const saveActivity = async (
    event,
    practiceId
  ) => {
    event.preventDefault();

    if (
      !activityForm.activity_title.trim()
    ) {
      setError(
        "Activity title is required."
      );

      return;
    }

    try {
      clearMessages();

      const method = editingActivity
        ? "PUT"
        : "POST";

      const url = editingActivity
        ? `${API_BASE}/api/naac/best-practices/${practiceId}/activities/${editingActivity}`
        : `${API_BASE}/api/naac/best-practices/${practiceId}/activities`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activity_title:
            activityForm.activity_title.trim(),

          description:
            activityForm.description.trim(),

          activity_date:
            activityForm.activity_date.trim(),

          participants:
            activityForm.participants === ""
              ? null
              : Number(
                  activityForm.participants
                ),

          beneficiary_group:
            activityForm.beneficiary_group.trim(),

          outcomes:
            activityForm.outcomes.trim(),

          display_order:
            Number(
              activityForm.display_order
            ) || 1,

          is_active:
            Number(
              activityForm.is_active
            ) === 1
              ? 1
              : 0,
        }),
      });

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to save activity"
        );
      }

      showSuccess(
        editingActivity
          ? "Activity updated successfully."
          : "Activity added successfully."
      );

      cancelActivity();

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "SAVE ACTIVITY ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save activity"
      );
    }
  };

  /* =========================================================
     DELETE ACTIVITY
  ========================================================= */

  const deleteActivity = async (
    practiceId,
    activityId
  ) => {
    const confirmed = window.confirm(
      "Delete this activity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${practiceId}/activities/${activityId}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to delete activity"
        );
      }

      showSuccess(
        "Activity deleted successfully."
      );

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "DELETE ACTIVITY ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete activity"
      );
    }
  };

  /* =========================================================
     PHOTO FORM
  ========================================================= */

  const getPhotoForm = (practiceId) => {
    return (
      photoForms[practiceId] || {
        activity_id: "",
        image_title: "",
        caption: "",
        display_order:
          (photos[practiceId]?.length || 0) +
          1,
        is_active: 1,
        file: null,
      }
    );
  };

  const updatePhotoForm = (
    practiceId,
    field,
    value
  ) => {
    setPhotoForms((previous) => ({
      ...previous,
      [practiceId]: {
        ...getPhotoForm(practiceId),
        [field]: value,
      },
    }));
  };

  /* =========================================================
     UPLOAD PHOTO
  ========================================================= */

  const uploadPhoto = async (
    event,
    practiceId
  ) => {
    event.preventDefault();

    const data =
      getPhotoForm(practiceId);

    if (!data.file) {
      setError(
        "Please select an image."
      );

      return;
    }

    try {
      clearMessages();

      const formData = new FormData();

      formData.append(
        "image",
        data.file
      );

      if (data.activity_id) {
        formData.append(
          "activity_id",
          data.activity_id
        );
      }

      formData.append(
        "image_title",
        data.image_title || ""
      );

      formData.append(
        "caption",
        data.caption || ""
      );

      formData.append(
        "display_order",
        Number(
          data.display_order
        ) || 1
      );

      formData.append(
        "is_active",
        Number(data.is_active) === 1
          ? "1"
          : "0"
      );

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${practiceId}/photos`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to upload photo"
        );
      }

      showSuccess(
        "Photo uploaded successfully."
      );

      setPhotoForms((previous) => ({
        ...previous,
        [practiceId]: {
          activity_id: "",
          image_title: "",
          caption: "",
          display_order:
            (photos[practiceId]?.length ||
              0) + 2,
          is_active: 1,
          file: null,
        },
      }));

      const fileInput =
        document.getElementById(
          `photo-${practiceId}`
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "UPLOAD PHOTO ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to upload photo"
      );
    }
  };

  /* =========================================================
     DELETE PHOTO
  ========================================================= */

  const deletePhoto = async (
    practiceId,
    photoId
  ) => {
    const confirmed = window.confirm(
      "Delete this photograph?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${practiceId}/photos/${photoId}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to delete photo"
        );
      }

      showSuccess(
        "Photo deleted successfully."
      );

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "DELETE PHOTO ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete photo"
      );
    }
  };

  /* =========================================================
     DOCUMENT FORM
  ========================================================= */

  const getDocumentForm = (
    practiceId
  ) => {
    return (
      documentForms[practiceId] || {
        activity_id: "",
        title: "",
        document_type: "Evidence",
        display_order:
          (documents[practiceId]?.length ||
            0) + 1,
        is_active: 1,
        file: null,
      }
    );
  };

  const updateDocumentForm = (
    practiceId,
    field,
    value
  ) => {
    setDocumentForms((previous) => ({
      ...previous,
      [practiceId]: {
        ...getDocumentForm(practiceId),
        [field]: value,
      },
    }));
  };

  /* =========================================================
     UPLOAD DOCUMENT
  ========================================================= */

  const uploadDocument = async (
    event,
    practiceId
  ) => {
    event.preventDefault();

    const data =
      getDocumentForm(practiceId);

    if (!data.file) {
      setError(
        "Please select a PDF/document."
      );

      return;
    }

    if (!data.title.trim()) {
      setError(
        "Document title is required."
      );

      return;
    }

    try {
      clearMessages();

      const formData = new FormData();

      formData.append(
        "document",
        data.file
      );

      if (data.activity_id) {
        formData.append(
          "activity_id",
          data.activity_id
        );
      }

      formData.append(
        "title",
        data.title.trim()
      );

      formData.append(
        "document_type",
        data.document_type ||
          "Evidence"
      );

      formData.append(
        "display_order",
        Number(
          data.display_order
        ) || 1
      );

      formData.append(
        "is_active",
        Number(data.is_active) === 1
          ? "1"
          : "0"
      );

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${practiceId}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to upload document"
        );
      }

      showSuccess(
        "Document uploaded successfully."
      );

      setDocumentForms((previous) => ({
        ...previous,
        [practiceId]: {
          activity_id: "",
          title: "",
          document_type: "Evidence",
          display_order:
            (documents[
              practiceId
            ]?.length || 0) + 2,
          is_active: 1,
          file: null,
        },
      }));

      const fileInput =
        document.getElementById(
          `document-${practiceId}`
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "UPLOAD DOCUMENT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to upload document"
      );
    }
  };

  /* =========================================================
     DELETE DOCUMENT
  ========================================================= */

  const deleteDocument = async (
    practiceId,
    documentId
  ) => {
    const confirmed = window.confirm(
      "Delete this supporting document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      const response = await fetch(
        `${API_BASE}/api/naac/best-practices/${practiceId}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message ||
            "Unable to delete document"
        );
      }

      showSuccess(
        "Document deleted successfully."
      );

      await loadChildData(practiceId);
    } catch (err) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete document"
      );
    }
  };

  /* =========================================================
     FILE URL
  ========================================================= */

  const getFileUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${API_BASE}${
      url.startsWith("/")
        ? ""
        : "/"
    }${url}`;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="bg-[#102f58] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-[0.18em]">
                NAAC Management
              </p>

              <h1 className="text-2xl md:text-3xl font-semibold mt-1">
                Best Practices
              </h1>

              <p className="text-blue-100 text-sm mt-2">
                Manage institutional best practices,
                activities, photographs and supporting
                documents.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadPractices}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
              >
                <RefreshCw size={17} />
                Refresh
              </button>

              <button
                type="button"
                onClick={startAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#102f58] hover:bg-blue-50 rounded-lg text-sm font-semibold transition"
              >
                <Plus size={18} />
                Add Best Practice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            <p className="text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="text-red-500 hover:text-red-700"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            {success}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        {showForm && (
          <form
            onSubmit={savePractice}
            className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#102f58]">
                  {editingId
                    ? "Edit Best Practice"
                    : "Add Best Practice"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter the institutional best
                  practice information.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* ===========================================
                  BASIC INFORMATION
              =========================================== */}

              <div className="grid md:grid-cols-4 gap-5">
                <FormField
                  label="Academic Year"
                  required
                >
                  <input
                    type="text"
                    value={form.academic_year}
                    onChange={(e) =>
                      updateForm(
                        "academic_year",
                        e.target.value
                      )
                    }
                    placeholder="2025-26"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Practice Number"
                >
                  <input
                    type="number"
                    min="1"
                    value={
                      form.practice_number
                    }
                    onChange={(e) =>
                      updateForm(
                        "practice_number",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Display Order"
                >
                  <input
                    type="number"
                    min="1"
                    value={
                      form.display_order
                    }
                    onChange={(e) =>
                      updateForm(
                        "display_order",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    value={form.is_active}
                    onChange={(e) =>
                      updateForm(
                        "is_active",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className={inputClass}
                  >
                    <option value={1}>
                      Active
                    </option>
                    <option value={0}>
                      Inactive
                    </option>
                  </select>
                </FormField>
              </div>

              <div className="mt-5">
                <FormField
                  label="Practice Title"
                  required
                >
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      updateForm(
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Enter Best Practice title"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="mt-5">
                <FormField label="Short Description">
                  <textarea
                    rows={3}
                    value={
                      form.short_description
                    }
                    onChange={(e) =>
                      updateForm(
                        "short_description",
                        e.target.value
                      )
                    }
                    placeholder="Brief description of the best practice"
                    className={textareaClass}
                  />
                </FormField>
              </div>

              {/* ===========================================
                  MAIN NAAC CONTENT
              =========================================== */}

              <div className="grid md:grid-cols-2 gap-5 mt-6">
                <TextAreaField
                  label="Objectives"
                  value={form.objectives}
                  onChange={(value) =>
                    updateForm(
                      "objectives",
                      value
                    )
                  }
                  placeholder="Objectives of the practice"
                />

                <TextAreaField
                  label="Context"
                  value={form.context}
                  onChange={(value) =>
                    updateForm(
                      "context",
                      value
                    )
                  }
                  placeholder="Context in which the practice was initiated"
                />

                <TextAreaField
                  label="The Practice"
                  value={form.practice}
                  onChange={(value) =>
                    updateForm(
                      "practice",
                      value
                    )
                  }
                  placeholder="Detailed description of the practice"
                  rows={6}
                />

                <TextAreaField
                  label="Activities / Implementation"
                  value={form.activities}
                  onChange={(value) =>
                    updateForm(
                      "activities",
                      value
                    )
                  }
                  placeholder="Activities and implementation process"
                  rows={6}
                />

                <TextAreaField
                  label="Outcomes & Impact"
                  value={
                    form.outcomes_impact
                  }
                  onChange={(value) =>
                    updateForm(
                      "outcomes_impact",
                      value
                    )
                  }
                  placeholder="Outcomes and impact"
                />

                <TextAreaField
                  label="Evidence of Success"
                  value={
                    form.evidence_of_success
                  }
                  onChange={(value) =>
                    updateForm(
                      "evidence_of_success",
                      value
                    )
                  }
                  placeholder="Evidence demonstrating success"
                />

                <TextAreaField
                  label="Problems Encountered"
                  value={
                    form.problems_encountered
                  }
                  onChange={(value) =>
                    updateForm(
                      "problems_encountered",
                      value
                    )
                  }
                  placeholder="Problems or challenges encountered"
                />

                <TextAreaField
                  label="Resources Required"
                  value={
                    form.resources_required
                  }
                  onChange={(value) =>
                    updateForm(
                      "resources_required",
                      value
                    )
                  }
                  placeholder="Human, financial, infrastructure or other resources"
                />

                <TextAreaField
                  label="Beneficiaries"
                  value={
                    form.beneficiaries
                  }
                  onChange={(value) =>
                    updateForm(
                      "beneficiaries",
                      value
                    )
                  }
                  placeholder="Beneficiaries of the practice"
                />
              </div>

              {/* ===========================================
                  ACTIONS
              =========================================== */}

              <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#174f86] hover:bg-[#123c69] disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Best Practice"
                    : "Save Best Practice"}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                >
                  <X size={17} />
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =================================================
            LIST HEADER
        ================================================= */}

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#102f58]">
              Published Best Practices
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {practices.length}{" "}
              {practices.length === 1
                ? "practice"
                : "practices"}{" "}
              found
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#174f86] hover:bg-[#123c69] text-white rounded-lg text-sm font-semibold"
            >
              <Plus size={17} />
              Add Best Practice
            </button>
          )}
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <RefreshCw
              size={28}
              className="animate-spin mx-auto text-[#174f86] mb-3"
            />

            <p className="text-gray-500">
              Loading best practices...
            </p>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          practices.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FileText
                size={42}
                className="mx-auto text-gray-300 mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                No Best Practices
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Add your first institutional
                best practice.
              </p>

              <button
                type="button"
                onClick={startAdd}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#174f86] text-white rounded-lg text-sm font-semibold"
              >
                <Plus size={17} />
                Add Best Practice
              </button>
            </div>
          )}

        {/* =================================================
            PRACTICE LIST
        ================================================= */}

        {!loading &&
          sortedPractices.length > 0 && (
            <div className="space-y-5">
              {sortedPractices.map(
                (item) => {
                  const isExpanded =
                    expandedPractice ===
                    item.id;

                  const itemActivities =
                    activities[
                      item.id
                    ] || [];

                  const itemPhotos =
                    photos[item.id] ||
                    [];

                  const itemDocuments =
                    documents[
                      item.id
                    ] || [];

                  return (
                    <article
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                    >
                      {/* =================================
                          PRACTICE HEADER
                      ================================= */}

                      <div className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              togglePractice(
                                item.id
                              )
                            }
                            className="flex-1 text-left"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-11 h-11 shrink-0 rounded-lg bg-[#102f58] text-white flex items-center justify-center font-semibold">
                                {item.practice_number ||
                                  1}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-[#174f86]">
                                    {item.academic_year}
                                  </span>

                                  {Number(
                                    item.is_active
                                  ) === 1 ? (
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                                      <Eye
                                        size={12}
                                      />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                      <EyeOff
                                        size={12}
                                      />
                                      Inactive
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-1">
                                  {
                                    item.title
                                  }
                                </h3>

                                {item.short_description && (
                                  <p className="text-sm text-gray-500 mt-2 leading-6">
                                    {
                                      item.short_description
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>

                          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                togglePractice(
                                  item.id
                                )
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp
                                    size={16}
                                  />
                                  Close
                                </>
                              ) : (
                                <>
                                  <ChevronDown
                                    size={16}
                                  />
                                  Manage
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  item
                                )
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-sm"
                            >
                              <Edit
                                size={16}
                              />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deletePractice(
                                  item.id
                                )
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                            >
                              <Trash2
                                size={16}
                              />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* =================================
                          EXPANDED MANAGEMENT
                      ================================= */}

                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-[#fafbfd] p-5">
                          {loadingChildren[
                            item.id
                          ] ? (
                            <div className="py-10 text-center">
                              <RefreshCw
                                size={24}
                                className="animate-spin mx-auto text-[#174f86] mb-2"
                              />

                              <p className="text-sm text-gray-500">
                                Loading activities,
                                photos and
                                documents...
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-7">
                              {/* ==========================
                                  ACTIVITIES
                              ========================== */}

                              <ManagementSection
                                icon={
                                  <CalendarDays
                                    size={19}
                                  />
                                }
                                title="Activities & Initiatives"
                                count={
                                  itemActivities.length
                                }
                                action={
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openAddActivity(
                                        item.id
                                      )
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-[#174f86] hover:bg-[#123c69] text-white rounded-lg text-sm font-medium"
                                  >
                                    <Plus
                                      size={
                                        16
                                      }
                                    />
                                    Add Activity
                                  </button>
                                }
                              >
                                {showActivityForm ===
                                  item.id && (
                                  <ActivityForm
                                    form={
                                      activityForm
                                    }
                                    setForm={
                                      setActivityForm
                                    }
                                    editing={
                                      editingActivity
                                    }
                                    onSubmit={(
                                      e
                                    ) =>
                                      saveActivity(
                                        e,
                                        item.id
                                      )
                                    }
                                    onCancel={
                                      cancelActivity
                                    }
                                  />
                                )}

                                {itemActivities.length ===
                                0 ? (
                                  <EmptyChild
                                    text="No activities added yet."
                                  />
                                ) : (
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {itemActivities.map(
                                      (
                                        activity
                                      ) => (
                                        <div
                                          key={
                                            activity.id
                                          }
                                          className="bg-white border border-gray-200 rounded-lg p-4"
                                        >
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <h4 className="font-semibold text-gray-800">
                                                {
                                                  activity.activity_title
                                                }
                                              </h4>

                                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                                {activity.activity_date && (
                                                  <span className="inline-flex items-center gap-1">
                                                    <CalendarDays
                                                      size={
                                                        13
                                                      }
                                                    />
                                                    {
                                                      activity.activity_date
                                                    }
                                                  </span>
                                                )}

                                                {activity.participants !==
                                                  null &&
                                                  activity.participants !==
                                                    undefined && (
                                                    <span className="inline-flex items-center gap-1">
                                                      <Users
                                                        size={
                                                          13
                                                        }
                                                      />
                                                      {
                                                        activity.participants
                                                      }{" "}
                                                      participants
                                                    </span>
                                                  )}
                                              </div>
                                            </div>

                                            <div className="flex gap-1">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  openEditActivity(
                                                    item.id,
                                                    activity
                                                  )
                                                }
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                              >
                                                <Edit
                                                  size={
                                                    15
                                                  }
                                                />
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  deleteActivity(
                                                    item.id,
                                                    activity.id
                                                  )
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                              >
                                                <Trash2
                                                  size={
                                                    15
                                                  }
                                                />
                                              </button>
                                            </div>
                                          </div>

                                          {activity.beneficiary_group && (
                                            <p className="text-sm text-gray-600 mt-3">
                                              <strong>
                                                Beneficiaries:
                                              </strong>{" "}
                                              {
                                                activity.beneficiary_group
                                              }
                                            </p>
                                          )}

                                          {activity.description && (
                                            <p className="text-sm text-gray-600 mt-3 whitespace-pre-line leading-6">
                                              {
                                                activity.description
                                              }
                                            </p>
                                          )}

                                          {activity.outcomes && (
                                            <p className="text-sm text-gray-600 mt-3 whitespace-pre-line leading-6">
                                              <strong>
                                                Outcomes:
                                              </strong>{" "}
                                              {
                                                activity.outcomes
                                              }
                                            </p>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </ManagementSection>

                              {/* ==========================
                                  PHOTOGRAPHS
                              ========================== */}

                              <ManagementSection
                                icon={
                                  <ImageIcon
                                    size={19}
                                  />
                                }
                                title="Photographs"
                                count={
                                  itemPhotos.length
                                }
                              >
                                <PhotoUploadForm
                                  practiceId={
                                    item.id
                                  }
                                  activities={
                                    itemActivities
                                  }
                                  form={getPhotoForm(
                                    item.id
                                  )}
                                  updateForm={
                                    updatePhotoForm
                                  }
                                  onSubmit={
                                    uploadPhoto
                                  }
                                />

                                {itemPhotos.length ===
                                0 ? (
                                  <EmptyChild
                                    text="No photographs uploaded yet."
                                  />
                                ) : (
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {itemPhotos.map(
                                      (
                                        photo
                                      ) => (
                                        <div
                                          key={
                                            photo.id
                                          }
                                          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                          <img
                                            src={getFileUrl(
                                              photo.image_url
                                            )}
                                            alt={
                                              photo.image_title ||
                                              "Best Practice"
                                            }
                                            className="w-full h-40 object-cover"
                                          />

                                          <div className="p-3">
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="min-w-0">
                                                {photo.image_title && (
                                                  <p className="font-medium text-sm text-gray-800 truncate">
                                                    {
                                                      photo.image_title
                                                    }
                                                  </p>
                                                )}

                                                {photo.caption && (
                                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {
                                                      photo.caption
                                                    }
                                                  </p>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  deletePhoto(
                                                    item.id,
                                                    photo.id
                                                  )
                                                }
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded shrink-0"
                                              >
                                                <Trash2
                                                  size={
                                                    15
                                                  }
                                                />
                                              </button>
                                            </div>

                                            {photo.activity_id && (
                                              <p className="text-[11px] text-gray-400 mt-2">
                                                Activity
                                                linked
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </ManagementSection>

                              {/* ==========================
                                  DOCUMENTS
                              ========================== */}

                              <ManagementSection
                                icon={
                                  <FileText
                                    size={19}
                                  />
                                }
                                title="Supporting Documents / PDFs"
                                count={
                                  itemDocuments.length
                                }
                              >
                                <DocumentUploadForm
                                  practiceId={
                                    item.id
                                  }
                                  activities={
                                    itemActivities
                                  }
                                  form={getDocumentForm(
                                    item.id
                                  )}
                                  updateForm={
                                    updateDocumentForm
                                  }
                                  onSubmit={
                                    uploadDocument
                                  }
                                />

                                {itemDocuments.length ===
                                0 ? (
                                  <EmptyChild
                                    text="No supporting documents uploaded yet."
                                  />
                                ) : (
                                  <div className="grid md:grid-cols-2 gap-3">
                                    {itemDocuments.map(
                                      (
                                        document
                                      ) => (
                                        <div
                                          key={
                                            document.id
                                          }
                                          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3"
                                        >
                                          <div className="w-11 h-11 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                            <FileText
                                              size={
                                                21
                                              }
                                            />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm text-gray-800 truncate">
                                              {
                                                document.title
                                              }
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                              {
                                                document.document_type
                                              }
                                            </p>

                                            {document.file_name && (
                                              <p className="text-xs text-gray-400 mt-1 truncate">
                                                {
                                                  document.file_name
                                                }
                                              </p>
                                            )}

                                            <a
                                              href={getFileUrl(
                                                document.file_url
                                              )}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="inline-flex items-center gap-1 text-xs text-[#174f86] hover:underline mt-2"
                                            >
                                              <ExternalLink
                                                size={
                                                  12
                                                }
                                              />
                                              View
                                            </a>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              deleteDocument(
                                                item.id,
                                                document.id
                                              )
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded shrink-0"
                                          >
                                            <Trash2
                                              size={
                                                16
                                              }
                                            />
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </ManagementSection>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
      </div>
    </div>
  );
}

/* ===========================================================
   FORM FIELD
=========================================================== */

function FormField({
  label,
  required = false,
  children,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* ===========================================================
   TEXT AREA FIELD
=========================================================== */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}) {
  return (
    <FormField label={label}>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={textareaClass}
      />
    </FormField>
  );
}

/* ===========================================================
   ACTIVITY FORM
=========================================================== */

function ActivityForm({
  form,
  setForm,
  editing,
  onSubmit,
  onCancel,
}) {
  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 mb-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-[#102f58]">
          {editing
            ? "Edit Activity"
            : "Add Activity"}
        </h4>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-gray-400 hover:text-gray-700"
        >
          <X size={17} />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Activity Title"
          required
        >
          <input
            type="text"
            value={form.activity_title}
            onChange={(e) =>
              update(
                "activity_title",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Activity title"
          />
        </FormField>

        <FormField label="Activity Date">
          <input
            type="text"
            value={form.activity_date}
            onChange={(e) =>
              update(
                "activity_date",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="e.g. 15 January 2026"
          />
        </FormField>

        <FormField label="Participants">
          <input
            type="number"
            min="0"
            value={form.participants}
            onChange={(e) =>
              update(
                "participants",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Number of participants"
          />
        </FormField>

        <FormField label="Beneficiary Group">
          <input
            type="text"
            value={
              form.beneficiary_group
            }
            onChange={(e) =>
              update(
                "beneficiary_group",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Students / Community / Faculty etc."
          />
        </FormField>

        <FormField label="Display Order">
          <input
            type="number"
            min="1"
            value={form.display_order}
            onChange={(e) =>
              update(
                "display_order",
                e.target.value
              )
            }
            className={inputClass}
          />
        </FormField>

        <FormField label="Status">
          <select
            value={form.is_active}
            onChange={(e) =>
              update(
                "is_active",
                Number(
                  e.target.value
                )
              )
            }
            className={inputClass}
          >
            <option value={1}>
              Active
            </option>

            <option value={0}>
              Inactive
            </option>
          </select>
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                update(
                  "description",
                  e.target.value
                )
              }
              className={textareaClass}
              placeholder="Describe the activity"
            />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label="Outcomes">
            <textarea
              rows={3}
              value={form.outcomes}
              onChange={(e) =>
                update(
                  "outcomes",
                  e.target.value
                )
              }
              className={textareaClass}
              placeholder="Activity outcomes"
            />
          </FormField>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#174f86] text-white rounded-lg text-sm font-medium"
        >
          <Save size={15} />

          {editing
            ? "Update Activity"
            : "Save Activity"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ===========================================================
   PHOTO UPLOAD FORM
=========================================================== */

function PhotoUploadForm({
  practiceId,
  activities,
  form,
  updateForm,
  onSubmit,
}) {
  return (
    <form
      onSubmit={(e) =>
        onSubmit(e, practiceId)
      }
      className="bg-white border border-gray-200 rounded-lg p-5 mb-5"
    >
      <h4 className="font-semibold text-gray-800 mb-4">
        Upload Photograph
      </h4>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="Image">
          <input
            id={`photo-${practiceId}`}
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateForm(
                practiceId,
                "file",
                e.target.files?.[0] ||
                  null
              )
            }
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg file:mr-3 file:py-2.5 file:px-3 file:border-0 file:bg-gray-100 file:text-gray-700"
          />
        </FormField>

        <FormField label="Image Title">
          <input
            type="text"
            value={
              form.image_title
            }
            onChange={(e) =>
              updateForm(
                practiceId,
                "image_title",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Image title"
          />
        </FormField>

        <FormField label="Caption">
          <input
            type="text"
            value={form.caption}
            onChange={(e) =>
              updateForm(
                practiceId,
                "caption",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Photo caption"
          />
        </FormField>

        <FormField label="Activity">
          <select
            value={
              form.activity_id
            }
            onChange={(e) =>
              updateForm(
                practiceId,
                "activity_id",
                e.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              General Practice
            </option>

            {activities.map(
              (activity) => (
                <option
                  key={activity.id}
                  value={activity.id}
                >
                  {
                    activity.activity_title
                  }
                </option>
              )
            )}
          </select>
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#174f86] hover:bg-[#123c69] text-white rounded-lg text-sm font-medium"
        >
          <Upload size={16} />
          Upload Photo
        </button>
      </div>
    </form>
  );
}

/* ===========================================================
   DOCUMENT UPLOAD FORM
=========================================================== */

function DocumentUploadForm({
  practiceId,
  activities,
  form,
  updateForm,
  onSubmit,
}) {
  return (
    <form
      onSubmit={(e) =>
        onSubmit(e, practiceId)
      }
      className="bg-white border border-gray-200 rounded-lg p-5 mb-5"
    >
      <h4 className="font-semibold text-gray-800 mb-4">
        Upload Supporting Document
      </h4>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="PDF / Document">
          <input
            id={`document-${practiceId}`}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={(e) =>
              updateForm(
                practiceId,
                "file",
                e.target.files?.[0] ||
                  null
              )
            }
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg file:mr-3 file:py-2.5 file:px-3 file:border-0 file:bg-gray-100 file:text-gray-700"
          />
        </FormField>

        <FormField
          label="Document Title"
          required
        >
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              updateForm(
                practiceId,
                "title",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Document title"
          />
        </FormField>

        <FormField label="Document Type">
          <input
            type="text"
            value={
              form.document_type
            }
            onChange={(e) =>
              updateForm(
                practiceId,
                "document_type",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="Evidence / Report / Certificate"
          />
        </FormField>

        <FormField label="Activity">
          <select
            value={
              form.activity_id
            }
            onChange={(e) =>
              updateForm(
                practiceId,
                "activity_id",
                e.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              General Practice
            </option>

            {activities.map(
              (activity) => (
                <option
                  key={activity.id}
                  value={activity.id}
                >
                  {
                    activity.activity_title
                  }
                </option>
              )
            )}
          </select>
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#174f86] hover:bg-[#123c69] text-white rounded-lg text-sm font-medium"
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>
    </form>
  );
}

/* ===========================================================
   MANAGEMENT SECTION
=========================================================== */

function ManagementSection({
  icon,
  title,
  count,
  action,
  children,
}) {
  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#174f86] flex items-center justify-center">
            {icon}
          </div>

          <div>
            <h3 className="font-semibold text-[#102f58]">
              {title}
            </h3>

            <p className="text-xs text-gray-500">
              {count}{" "}
              {count === 1
                ? "item"
                : "items"}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/* ===========================================================
   EMPTY CHILD
=========================================================== */

function EmptyChild({ text }) {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-lg px-5 py-8 text-center">
      <p className="text-sm text-gray-500">
        {text}
      </p>
    </div>
  );
}

/* ===========================================================
   STYLES
=========================================================== */

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#174f86]";

const textareaClass =
  "w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#174f86] resize-y";