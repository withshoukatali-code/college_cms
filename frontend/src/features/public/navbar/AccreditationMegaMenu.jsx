import AccreditationColumn from "./AccreditationColumn";


function AccreditationMegaMenu({ columns }) {

  return (

    <div
      className="
        w-250
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
          grid-cols-4
          gap-7
        "
      >

        {(columns || []).map((column) => (

          <AccreditationColumn
            key={column.title}
            column={column}
          />

        ))}

      </div>

    </div>

  );

}


export default AccreditationMegaMenu;