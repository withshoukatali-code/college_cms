// import MegaMenuColumn from "./MegaMenuColumn";

// function MegaMenu({ columns }) {
//   return (
//     <div
//       className="
//         min-w-212.5
//         max-w-230
//         rounded-2xl
//         border
//         border-slate-200
//         bg-white
//         p-8
//         shadow-[0_20px_60px_rgba(15,23,42,0.18)]
//       "
//     >
//       <div className="grid grid-cols-3 gap-8">
//         {columns.map((column) => (
//           <MegaMenuColumn
//             key={column.title}
//             column={column}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MegaMenu;



import MegaMenuColumn from "./MegaMenuColumn";

function MegaMenu({ columns }) {
  return (
    <div
      className="
        relative
        min-w-212.5
        max-w-230
        overflow-visible
        rounded-3xl
        border
        border-white/70
        bg-white/95
        backdrop-blur-xl
        p-8
        ring-1
        ring-slate-100/80
        shadow-[0_12px_35px_rgba(15,23,42,0.08),0_30px_80px_rgba(15,23,42,0.18)]
      "
    >
      {/* Premium Pointer */}
      <div
        className="
          absolute
          -top-2.5
          left-10
          h-5
          w-5
          rotate-45
          rounded-sm
          border-l
          border-t
          border-slate-200
          bg-white
          shadow-sm
        "
      />

      {/* Premium Top Highlight */}
      <div
        className="
          absolute
          left-8
          right-8
          top-0
          h-px
          bg-linear-to-r
          from-transparent
          via-sky-300/70
          to-transparent
        "
      />

      <div className={`grid gap-8 ${columns.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
        {columns.map((column) => (
          <MegaMenuColumn
            key={column.title}
            column={column}
          />
        ))}
      </div>
    </div>
  );
}

export default MegaMenu;