import { cn } from "@/utils/cn";
import { baseStyles, sizes, variants } from "./variants";

function Textarea({
  label,

  required = false,

  placeholder = "",

  size = "md",

  disabled = false,

  readOnly = false,

  helperText = "",

  error = "",

  fullWidth = true,

  className = "",

  ...props
}) {
  const textareaVariant = disabled
    ? variants.disabled
    : error
    ? variants.error
    : variants.default;

  return (
    <div className={cn(fullWidth && "w-full")}>

      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <textarea
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          baseStyles,
          textareaVariant,
          sizes[size],
          className
        )}
        {...props}
      />

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

export default Textarea;