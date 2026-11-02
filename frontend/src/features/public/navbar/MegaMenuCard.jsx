import { Link } from "react-router-dom";

function MegaMenuCard({ item }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      className="
        group
        flex
        items-start
        gap-3
        rounded-lg
        px-2
        py-2
        transition-all
        duration-200
        hover:bg-slate-50
      "
    >
      {/* Icon */}
      <div
        className="
          mt-0.5
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-100
          text-[#0f3f83]
          transition-all
          duration-200
          group-hover:bg-[#037e5b]
          group-hover:text-white
        "
      >
        {Icon && <Icon size={18} strokeWidth={2} />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h4
          className="
            text-[14px]
            font-medium
            text-slate-800
            transition-colors
            duration-200
            group-hover:text-[#0b4ba5]
          "
        >
          {item.title}
        </h4>

        <p className="mt-1 text-[12px] leading-5 text-slate-500">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

export default MegaMenuCard;