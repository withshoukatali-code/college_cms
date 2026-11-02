function NaacCard({
  grade,
  cycle,
  cgpa,
}) {
  return (

    <div
      className="
        w-50
        overflow-hidden
        rounded-2xl
        border
        border-emerald-300
        bg-linear-to-br
        from-violet-500-100
        via-blue-200
        to-emerald-300
        shadow-lg
      "
    >

      {/* Top Bar */}

      <div
        className="
          h-1
          bg-linear-to-r
          from-emerald-700
          via-emerald-500
          to-emerald-700
        "
      />

      <div className="px-4 py-2 text-center">

        {/* Stars */}

        {/* <div
          className="
            mb-1
            flex
            justify-center
           
            text-xl
        text-amber-500
          "
        >
          ★ ★ ★ ★ ★
        </div> */}

        {/* Title */}

        <p
          className="
            text-[14px]
            font-bold
            tracking-widest
            uppercase
          text-emerald-800
          "
        >
          NAAC ACCREDITED
        </p>

        {/* Grade */}

        <h2
          className="
            mt-1
            font-manrope
            text-4xl
            font-extrabold
            tracking-tight
            leading-none
            text-blue-950
          "
        >
          {grade}
        </h2>

        {/* Cycle */}

        <p
          className="
            mt-1
            text-sm
            font-semibold
           text-red-500
          "
        >
          {cycle}
        </p>

        {/* CGPA */}

        <p
          className="
            mt-1
            text-sm
            font-bold
            text-slate-900
          "
        >
          {cgpa}
        </p>

      </div>

    </div>

  );
}

export default NaacCard;