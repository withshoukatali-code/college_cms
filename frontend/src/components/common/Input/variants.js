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
    bg-white
    text-slate-800

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
  sm: "h-[34px] px-3 text-xs",

  md: "h-10 px-4 text-sm",

  lg: "h-[46px] px-5 text-sm",
};

export const baseStyles = `
  w-full
  rounded-[10px]
  outline-none
  transition-all
  duration-200
`;