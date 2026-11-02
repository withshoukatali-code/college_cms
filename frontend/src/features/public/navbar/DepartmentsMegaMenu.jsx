import DepartmentColumn from "./DepartmentColumn";


function DepartmentsMegaMenu({ columns }) {

  return (

    <div
      className="
        w-fit
        max-w-[calc(100vw-2rem)]
        rounded-lg
        border
        border-white/70
        bg-white/95
        backdrop-blur-xl
        p-6
         -translate-x-1/4
        shadow-[0_20px_60px_rgba(15,23,42,0.18)]
      "
    >


      <div
        className="
          grid
          gap-6
        "
        style={{
          gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(190px, 1fr))`,
        }}
      >

        {
          columns.map((column)=>(
            <DepartmentColumn
              key={column.title}
              column={column}
            />
          ))
        }


      </div>


    </div>

  );

}


export default DepartmentsMegaMenu;