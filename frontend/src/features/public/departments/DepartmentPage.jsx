import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TopBar from "../header/TopBar";
import Navbar from "../navbar/Navbar";
import PublicFooter from "../Footer/PublicFooter";
import DepartmentHeader from "./components/DepartmentHeader";
import DepartmentSidebar from "./components/DepartmentSidebar";
import DepartmentContent from "./components/DepartmentContent";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const DepartmentPage = () => {
  const { slug } = useParams();

  const [department, setDepartment] = useState(null);
  const [sections, setSections] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/departments/${slug}`
        );

        if (!response.ok) {
          throw new Error("Department not found");
        }

        const result = await response.json();

        /*
         * We support:
         * {
         *   success: true,
         *   department: {...},
         *   sections: [...]
         * }
         */

        const departmentData =
          result?.department ||
          result?.data?.department ||
          result?.data ||
          null;

        const sectionData =
          result?.sections ||
          result?.data?.sections ||
          [];

        if (!departmentData) {
          throw new Error("Department data not available");
        }

        setDepartment(departmentData);
        setSections(Array.isArray(sectionData) ? sectionData : []);

        try {
          const [programmeResponse, facultyResponse] = await Promise.all([
            fetch(`${API_BASE}/api/department-programmes/department/${departmentData.id}`),
            fetch(`${API_BASE}/api/department-faculty/department/${departmentData.id}`),
          ]);
          const [programmeResult, facultyResult] = await Promise.all([
            programmeResponse.json(),
            facultyResponse.json(),
          ]);
          setProgrammes(Array.isArray(programmeResult?.programmes) ? programmeResult.programmes : []);
          setFaculty(Array.isArray(facultyResult?.faculty) ? facultyResult.faculty : []);
        } catch (programmeError) {
          console.warn("Department programmes or faculty unavailable:", programmeError);
          setProgrammes([]);
          setFaculty([]);
        }
      } catch (err) {
        console.error("Department fetch error:", err);
        setError(err.message || "Unable to load department");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDepartment();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-[#0f3262] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-600 text-sm">
            Loading department...
          </p>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#0f3262] mb-2">
            Department Not Found
          </h2>

          <p className="text-slate-600 text-sm">
            {error || "The requested department could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      <TopBar />
      <Navbar />

      <main>
        <DepartmentHeader department={department} />

      {/* Main Department Layout */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <DepartmentContent
              department={department}
              sections={sections}
              programmes={programmes}
              faculty={faculty}
            />

            <DepartmentSidebar
              department={department}
              sections={sections}
              programmes={programmes}
            />

          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default DepartmentPage;