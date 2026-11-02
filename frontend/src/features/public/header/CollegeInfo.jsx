function CollegeInfo({
  tagline,
  collegeName,
  affiliation,
  address,
}) {
  return (
    <div className="min-w-0">

      {/* Tagline */}

      <p
        className="
          font-inter
          text-[11px]
          italic
          tracking-wide
          text-slate-500
        "
      >
        {tagline}
      </p>

      {/* College Name */}

      <h1
        className="
          mt-1
          font-manrope
          text-[31px]
          font-black
          leading-none
          tracking-tight
         text-blue-950
        "
      >
        {collegeName}
      </h1>

      {/* Affiliation */}

      <p
        className="
          mt-2
          text-sm
          font-semibold
          text-slate-700
        "
      >
        {affiliation}
      </p>

      {/* Address */}

      <p
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        {address}
      </p>

    </div>
  );
}

export default CollegeInfo;