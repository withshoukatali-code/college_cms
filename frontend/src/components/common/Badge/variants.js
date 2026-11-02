export const variants = {
  primary: `
    bg-blue-700
    text-white
    hover:bg-blue-800
    focus:ring-2
    focus:ring-blue-300
  `,

  secondary: `
    bg-slate-800
    text-white
    hover:bg-slate-900
    focus:ring-2
    focus:ring-slate-300
  `,

  outline: `
    border
    border-slate-300
    bg-white
    text-slate-700
    hover:bg-slate-50
    focus:ring-2
    focus:ring-slate-300
  `,

  ghost: `
    bg-transparent
    text-slate-700
    hover:bg-slate-100
    focus:ring-2
    focus:ring-slate-300
  `,

  success: `
    bg-green-600
    text-white
    hover:bg-green-700
    focus:ring-2
    focus:ring-green-300
  `,

  danger: `
    bg-red-600
    text-white
    hover:bg-red-700
    focus:ring-2
    focus:ring-red-300
  `,
};

export const sizes = {
  sm: `
    h-8
    px-3
    text-xs
  `,

  md: `
    h-[38px]
    px-4
    text-[13px]
  `,

  lg: `
    h-11
    px-5
    text-sm
  `,
};

export const baseStyles = `
  inline-flex
  items-center
  justify-center
  gap-2

  rounded-[10px]

  font-medium

  transition-colors
  duration-200

  focus:outline-none

  disabled:cursor-not-allowed
  disabled:opacity-60

  select-none
  whitespace-nowrap
`;