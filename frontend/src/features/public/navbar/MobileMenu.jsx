import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { menuData } from "./MenuData";

function MobileMenu({ items = menuData }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState("");

  const closeMenu = () => {
    setOpen(false);
    setExpanded("");
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((visible) => !visible)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center text-white hover:text-amber-300"
      >
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-white/15 bg-[#0f3262] px-4 py-3 shadow-2xl">
          <nav aria-label="Mobile navigation" className="divide-y divide-white/10">
            {items.map((item) => (
              <div key={item.id || item.title}>
                {item.type === "mega" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.title ? "" : item.title)}
                      className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-white"
                    >
                      {item.title}
                      <ChevronDown size={17} className={`transition-transform ${expanded === item.title ? "rotate-180" : ""}`} />
                    </button>
                    {expanded === item.title && (
                      <div className="space-y-4 pb-3 pl-3">
                        {item.columns?.map((column) => (
                          <div key={column.title}>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-300">{column.title}</p>
                            <div className="grid gap-1 sm:grid-cols-2">
                              {column.items?.map((child) => (
                                <Link key={child.title} to={child.path} onClick={closeMenu} className="py-1.5 text-sm text-blue-100 hover:text-white">
                                  {child.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} onClick={closeMenu} className="block py-3 text-sm font-semibold text-white hover:text-amber-300">
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
