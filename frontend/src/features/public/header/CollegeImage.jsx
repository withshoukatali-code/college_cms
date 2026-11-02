function CollegeImage({ image }) {
  return (
    <div className="flex items-end">

      <img
        src={image}
        alt="College Campus"
        className="
          h-32
          w-64
          rounded-xl
          object-cover
          transition-all
          duration-500
          hover:scale-[1.02]
        "
      />

    </div>
  );
}

export default CollegeImage;