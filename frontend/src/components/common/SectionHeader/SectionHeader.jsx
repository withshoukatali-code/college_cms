import { cn } from "@/utils/cn";
import { alignments, spacing, titleSizes } from "./variants";

function SectionHeader({
  title,
  subtitle,
  action,
  align = "left",
  size = "md",
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:flex-row md:items-end md:justify-between",
        spacing[size],
        className
      )}
    >
      <div className={cn("flex flex-col", alignments[align])}>
        <h2
          className={cn(
            titleSizes[size],
            "font-semibold tracking-tight text-slate-900"
          )}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="mt-3 md:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;