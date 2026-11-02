import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";


function AccreditationItem({ item }) {

  return (

    <Link
      to={item.path}
      className="
        group
        flex
        items-center
        justify-between
        rounded-lg
        px-2
        py-1.5
        text-[13px]
        font-medium
        text-slate-600
        transition-all
        duration-200
        hover:bg-slate-50
        hover:text-[#eead09]
      "
    >

      <span>
        {item.title}
      </span>


      <ChevronRight
        size={14}
        className="
          -translate-x-1
          opacity-0
          transition-all
          duration-200
          group-hover:translate-x-0
          group-hover:opacity-100
        "
      />

    </Link>

  );

}


export default AccreditationItem;