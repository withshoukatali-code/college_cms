import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import MegaMenu from "./MegaMenu";
import DepartmentsMegaMenu from "./DepartmentsMegaMenu";
import IqacMegaMenu from "./IqacMegaMenu";
import AccreditationMegaMenu from "./AccreditationMegaMenu";


function NavItem({ item }) {

  if (item.type === "mega") {

    let MenuComponent = MegaMenu;


    if (item.menuType === "departments") {
      MenuComponent = DepartmentsMegaMenu;
    }


    if (item.menuType === "iqac") {
      MenuComponent = IqacMegaMenu;
    }


if (item.menuType === "accreditation") {
  MenuComponent = AccreditationMegaMenu;
}

    return (

      <div className="group relative flex h-full items-center">


        <button
          className="
            flex
            items-center
            gap-1
            px-3
            py-3
            text-[13px]
            font-medium
            tracking-wide
            text-white
            transition
            duration-300
            hover:text-[#eead09]
          "
        >

          {item.title}


          <ChevronDown
            size={15}
            className="
              transition-transform
              duration-300
              group-hover:rotate-180
            "
          />

        </button>



        <div
  className="
    invisible
    absolute
    top-full
    mt-1
    z-50
    opacity-0
    transition-all
    duration-300
    group-hover:visible
    group-hover:opacity-100
  "
  style={{
    left: item.menuOffset || "0px",
  }}
>
  <MenuComponent columns={item.columns} />
</div>


      </div>

    );

  }



  return (

    <Link
      to={item.path}
      className="
        px-3
        py-3
        text-[13px]
        font-medium
        tracking-wide
        text-white
        transition
        duration-300
        hover:text-[#eead09]
      "
    >

      {item.title}

    </Link>

  );

}


export default NavItem;