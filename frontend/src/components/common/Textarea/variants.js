export const variants = {
  default: `
    border
    border-slate-300
    bg-white
    text-slate-800
    placeholder:text-slate-400

    focus:border-blue-600
    focus:ring-2
    focus:ring-blue-200
  `,

  error: `
    border
    border-red-500

    focus:border-red-600
    focus:ring-2
    focus:ring-red-200
  `,

  disabled: `
    border
    border-slate-200
    bg-slate-100
    text-slate-400
    cursor-not-allowed
  `,
};

export const sizes = {
  sm: "min-h-[80px] px-3 py-2 text-xs",

  md: "min-h-[110px] px-4 py-3 text-sm",

  lg: "min-h-[140px] px-5 py-4 text-sm",
};

export const baseStyles = `
  w-full
  rounded-[10px]
  outline-none
  resize-none
  transition-all
  duration-200
`;