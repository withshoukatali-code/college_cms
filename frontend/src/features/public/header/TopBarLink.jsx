import { Link, NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

function TopBarLink({
  to,
  children,
  primary = false,
}) {

  if (primary) {
    return (
      <Link
        to={to}
        className={cn(
          "inline-flex items-center",

          "rounded",

          "bg-emerald-600",

          "px-2.5",

          "py-[2px]",

          "text-[12px]",

          "font-semibold",

          "uppercase",

          "tracking-wide",

          "text-white",

          "shadow-sm",

          "ring-1 ring-emerald-400/30",

          "transition-all duration-200",

          "hover:bg-emerald-700",

          "hover:shadow-md",

          "hover:ring-emerald-300"
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(

          "inline-flex items-center",

          "rounded",

          "px-1.5",

          "py-[2px]",

          "text-[10px]",

          "lg:text-[11px]",

          "font-normal",

          "tracking-normal",

          "text-yellow-300",

          "transition-colors duration-200",

          isActive
            ? "text-white"
            : "hover:bg-white/5 hover:text-white"
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default TopBarLink;