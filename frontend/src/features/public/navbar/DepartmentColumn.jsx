import IqacItem from "./IqacItem";

function IqacColumn({ column }) {
  
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
          <IqacItem
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

export default IqacColumn;