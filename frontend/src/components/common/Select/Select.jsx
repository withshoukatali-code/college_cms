import { cn } from "@/utils/cn";
import { baseStyles, sizes, variants } from "./variants";

function Select({
  label,
  required = false,

  options = [],

  placeholder = "Select",

  size = "md",

  disabled = false,

  error = "",

  helperText = "",

  fullWidth = true,

  className = "",

  ...props
}) {
  const inputVariant = disabled
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

      <select
        disabled={disabled}
        className={cn(
          baseStyles,
          inputVariant,
          sizes[size],
          className
        )}
        {...props}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>

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

export default Select;