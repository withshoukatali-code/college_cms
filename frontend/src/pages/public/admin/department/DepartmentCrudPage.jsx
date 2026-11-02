import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import DepartmentFaculty from "./DepartmentFaculty";
import DepartmentProfile from "./DepartmentProfile";
import DepartmentProgrammes from "./DepartmentProgrammes";
import DepartmentSections from "./DepartmentSections";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resources = {
  profiles: { title: "Department Profiles", description: "Manage the overview, vision, contact information and publication state for each department." },
  programmes: { title: "Academic Programmes", description: "Manage programme records and syllabus content for each department." },
  sections: { title: "Department Page Sections", description: "Manage the content sections displayed on each public department page." },
  faculty: { title: "Faculty and Staff", description: "Manage staff profiles, photos, resumes, HOD designation and publication state." },
};

const DepartmentCrudPage = ({ resource }) => {
  const config = resources[resource];
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    fetch(`${API_BASE}/api/departments`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load departments.");
        return result.departments || [];
      })
      .then((rows) => {
        if (!current) return;
        setDepartments(rows);
        if (rows.length) setDepartmentId(String(rows[0].id));
      })
      .catch((err) => {
        if (current) setError(err.message);
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    return () => { current = false; };
  }, []);

  const department = departments.find((item) => String(item.id) === departmentId);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Department Management</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <label className="w-full text-xs font-medium text-slate-600 sm:max-w-xs">
          Select department
          <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} disabled={loading || !departments.length} className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
            {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
      </header>

      {loading && <p className="py-8 text-sm text-slate-500">Loading departments...</p>}
      {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
      {!loading && !error && !departments.length && <div className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><Building2 size={26} className="mx-auto text-slate-400" /><p className="mt-3 text-sm font-medium text-slate-700">Create a department first</p><a href="/admin/departments/new" className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline">Add Department</a></div>}
      {department && resource === "profiles" && <DepartmentProfile key={department.id} departmentId={Number(department.id)} />}
      {department && resource === "programmes" && <DepartmentProgrammes key={department.id} departmentId={Number(department.id)} departmentName={department.name} />}
      {department && resource === "sections" && <DepartmentSections key={department.id} departmentId={Number(department.id)} />}
      {department && resource === "faculty" && <DepartmentFaculty key={department.id} departmentId={Number(department.id)} />}
    </div>
  );
};

export default DepartmentCrudPage;
