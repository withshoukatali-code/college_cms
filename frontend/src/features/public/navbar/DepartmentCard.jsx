import { Link } from "react-router-dom";

function DepartmentCard({ department }) {
  return (
    <Link
      to={department.path}
      className="
        block
        rounded-lg
        px-1
        py-1
        text-[13px]
        font-medium
        text-slate-700
        transition-all
        duration-200
        hover:bg-cyan-50
        hover:text-[#0b4ba5]
      "
    >
      {department.title}
    </Link>
  );
}

export default DepartmentCard;