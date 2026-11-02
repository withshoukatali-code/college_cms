import NavItem from "./NavItem";
import { menuData } from "./MenuData";

function DesktopMenu({ items = menuData }) {
  return (
   <nav className="hidden lg:flex items-center gap-1 relative">
      {items.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </nav>
  );
}

export default DesktopMenu;