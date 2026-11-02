import { useEffect, useState } from "react";
import { BookOpen, Building2, GraduationCap, Microscope } from "lucide-react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SearchButton from "./SearchButton";
import { menuData } from "./MenuData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const departmentCategories = [
  { title: "Arts", icon: GraduationCap, matches: /social science|history|language|english|marathi|hindi|political|geography|economics/ },
  { title: "Science", icon: Microscope, matches: /physics|chemistry|biology|botany|zoology|mathematics|computer science/ },
  { title: "Commerce", icon: Building2, matches: /commerce|bba|b\.com|m\.com/ },
  { title: "Professional Courses", icon: BookOpen, matches: /professional|bca|data science/ },
];

function buildDepartmentColumns(departments) {
  const columns = departmentCategories.map((category) => ({
    title: category.title,
    icon: category.icon,
    items: [],
  }));

  departments.forEach((department) => {
    const name = String(department.name || "").trim();
    const slug = String(department.slug || "").trim();
    if (!name || !slug || Number(department.is_active) !== 1) return;

    const categoryIndex = departmentCategories.findIndex((category) =>
      category.matches.test(name.toLowerCase())
    );

    columns[categoryIndex < 0 ? 0 : categoryIndex].items.push({
      title: name,
      path: `/departments/${encodeURIComponent(slug)}`,
    });
  });

  return columns.filter((column) => column.items.length > 0);
}

function Navbar() {
  const [navigationItems, setNavigationItems] = useState(menuData);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/departments`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load departments");
        return response.json();
      })
      .then((result) => {
        const departments = Array.isArray(result?.departments)
          ? result.departments
          : [];
        const columns = buildDepartmentColumns(departments);

        if (!cancelled && columns.length > 0) {
          setNavigationItems((items) =>
            items.map((item) =>
              item.menuType === "departments"
                ? { ...item, columns }
                : item
            )
          );
        }
      })
      .catch((error) => {
        console.warn("Department navigation unavailable:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-[#0f3262]
        border-b
        border-[#023e92]
        shadow-md
      "
    >
      <div className="mx-auto flex h-12 max-w-screen-2xl items-center px-3 lg:px-6">

        {/* Menu occupies remaining width */}
        <div className="flex-1">
          <DesktopMenu items={navigationItems} />
        </div>

        <MobileMenu items={navigationItems} />

        {/* <SearchButton /> */}

      </div>
    </header>
  );
}

export default Navbar;