import { cn } from "@/utils/cn";
import { variants, padding } from "./variants";

function Card({
  children,
  header,
  footer,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-200 px-5 py-4">
          {header}
        </div>
      )}

      <div className={padding[size]}>
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-200 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;