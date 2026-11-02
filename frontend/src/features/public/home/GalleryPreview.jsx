import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Images,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/home-gallery";
const SERVER_URL = "http://localhost:5000";

function getImageUrl(value) {
  if (!value) return "";

  const url = String(value).trim();

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${SERVER_URL}/${url.replace(/^\/+/, "")}`;
}

function GalleryPreview() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load gallery"
          );
        }

        setImages(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error(
          "Homepage gallery error:",
          error
        );

        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  return (
    <section className="bg-white py-12 sm:py-16">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#eead09]">
              <Images size={14} />
              Campus Gallery
            </span>

            <h2 className="mt-2 text-xl font-bold text-[#0f3262] sm:text-2xl">
              Life at Our Campus
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              A glimpse of campus life, events and activities.
            </p>

          </div>

          <Link
            to="/gallery"
            className="hidden items-center gap-2 text-sm font-semibold text-[#0f3262] hover:text-[#eead09] md:flex"
          >
            View Gallery
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100"
                />
              )
            )}

          </div>
        )}

        {/* GALLERY */}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

            {images
              .filter(
                (image) =>
                  Number(image.is_active) === 1 ||
                  image.is_active === true
              )
              .slice(0, 8)
              .map((image) => {

                const imageUrl =
                  getImageUrl(
                    image.image_url
                  );

                return (
                  <Link
                    key={image.id}
                    to="/gallery"
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100"
                  >

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={
                          image.alt_text ||
                          image.title ||
                          "College campus"
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(event) => {
                          console.error(
                            "Homepage gallery image failed:",
                            imageUrl
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Images size={32} />
                      </div>
                    )}

                    {/* OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                    {/* TITLE */}

                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                        <p className="truncate text-xs font-semibold text-white">
                          {image.title}
                        </p>

                      </div>
                    )}

                  </Link>
                );
              })}

          </div>
        )}

        {/* EMPTY */}

        {!loading && images.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

            <Images
              size={34}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm text-slate-500">
              No homepage gallery images available.
            </p>

          </div>
        )}

        {/* MOBILE */}

        <div className="mt-7 text-center md:hidden">

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f3262] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0b2850]"
          >
            View Gallery
            <ArrowRight size={17} />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default GalleryPreview;