import IqacColumn from "./IqacColumn";

function IqacMegaMenu({ columns }) {
  return (
    <div
      className="
        w-210
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-7
        shadow-[0_20px_60px_rgba(15,23,42,0.18)]
      "
    >
      <div
        className="
          grid
          grid-cols-3
          gap-7
        "
      >
        {columns.map((column) => (
          <IqacColumn
            key={column.title}
            column={column}
          />
        ))}
      </div>
    </div>
  );
}

export default IqacMegaMenu;