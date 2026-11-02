import { Link } from "react-router-dom";

function CollegeLogo({ logo, collegeName }) {
  return (
    <Link
      to="/"
      aria-label={collegeName}
      className="
        flex
        shrink-0
        items-center
        justify-center
      "
    >
      <img
        src={logo}
        alt={collegeName}
        className="
          h-26
          w-26
          object-contain
          transition-transform
          duration-300
          hover:scale-105
        "
      />
    </Link>
  );
}

export default CollegeLogo;