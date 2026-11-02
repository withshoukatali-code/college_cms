// import MegaMenuCard from "./MegaMenuCard";

// function MegaMenuColumn({ column }) {
//   return (
//     <div>
//       <div className="mb-5">
//         <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#05be8a]">
//           {column.title}
//         </h3>

//         <div className="mt-2 h-0.5 w-12 rounded-full bg-[#e9aa0a]" />
//       </div>

//       <div className="space-y-2">
//         {column.items.map((item) => (
//           <MegaMenuCard key={item.title} item={item} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MegaMenuColumn;


import MegaMenuCard from "./MegaMenuCard";

function MegaMenuColumn({ column }) {
 
     if (!column) return null;
const Icon = column.icon;
  return (
    <div className="min-w-0">
     
<h3
  className="
    mb-4
    flex
    items-center
    gap-2
    text-[15px]
    font-semibold
    tracking-wide
    text-[#0f3262]
  "
>
  {Icon && (
    <Icon
      size={18}
      strokeWidth={2.2}
      className="text-[#0f3262]"
    />
  )}

  {column.title}
</h3>

<div
    className="
      mt-2
      h-0.5
      w-22
      rounded-full
      bg-[#eead09]
    "
  />
      <div className="space-y-1">
        {(column.items || []).map((item) => (
          <MegaMenuCard
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </div>
  );

}

export default MegaMenuColumn;