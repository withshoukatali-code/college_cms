import { cn } from "@/utils/cn";
import { sizes, variants } from "./variants";

function Loader({
  variant = "spinner",
  size = "md",
  text = "",
  className = "",
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {variant === "spinner" && (
        <div
          className={cn(
            variants.spinner,
            sizes[size].spinner
          )}
        />
      )}

      {variant === "dots" && (
        <div className={variants.dots}>
          <span
            className={cn(
              "animate-bounce rounded-full bg-blue-700",
              sizes[size].dot
            )}
          />
          <span
            className={cn(
              "animate-bounce rounded-full bg-blue-700 delay-100",
              sizes[size].dot
            )}
          />
          <span
            className={cn(
              "animate-bounce rounded-full bg-blue-700 delay-200",
              sizes[size].dot
            )}
          />
        </div>
      )}

      {variant === "pulse" && (
        <div
          className={cn(
            variants.pulse,
            "h-10 w-40"
          )}
        />
      )}

      {text && (
        <p className="text-sm text-slate-600">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;