import AccreditationItem from "./AccreditationItem";


function AccreditationColumn({ column }) {

  const Icon = column.icon;


  return (

    <div className="min-w-0">

      <div className="mb-4">

        <h3
          className="
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
            w-14
            rounded-full
            bg-linear-to-r
            from-[#eead09]
            to-[#f6d365]
          "
        />

      </div>


      <div className="space-y-1">

        {(column.items || []).map((item) => (

          <AccreditationItem
            key={item.title}
            item={item}
          />

        ))}

      </div>

    </div>

  );

}


export default AccreditationColumn;