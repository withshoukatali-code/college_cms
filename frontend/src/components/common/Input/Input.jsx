import { cn } from "@/utils/cn";
import { baseStyles, sizes, variants } from "./variants";

function Input({
  label,
  placeholder = "",
  type = "text",

  size = "md",

  required = false,

  disabled = false,

  readOnly = false,

  error = "",

  helperText = "",

  leftIcon,

  rightIcon,

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

      {/* Label */}

      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Input */}

      <div className="relative">

        {leftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            baseStyles,
            inputVariant,
            sizes[size],

            leftIcon && "pl-10",

            rightIcon && "pr-10",

            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}

      </div>

      {/* Helper */}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {/* Error */}

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}

export default Input;