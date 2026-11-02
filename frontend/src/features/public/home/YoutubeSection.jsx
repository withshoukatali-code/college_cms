import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, ArrowRight } from "lucide-react";

const API_URL = "http://localhost:5000/api/youtube";

function YoutubeSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch YouTube videos");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setVideos(result.data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("YouTube API error:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#eead09]
              "
            >
              Videos
            </span>

            <h2
              className="
                mt-3
                text-2xl
                font-bold
                text-[#0f3262]
              "
            >
              Explore Our College
            </h2>
          </div>

          {/* <Link
            to="/videos"
            className="
              hidden
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#0f3262]
              transition
              hover:text-[#eead09]
              md:flex
            "
          >
            View All
            <ArrowRight size={18} />
          </Link> */}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-[310px]
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                "
              />
            ))}
          </div>
        )}

        {/* Videos */}
        {!loading && videos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                {/* Thumbnail */}
                <div className="relative">

                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="
                        h-52
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-52
                        w-full
                        items-center
                        justify-center
                        bg-slate-100
                        text-sm
                        text-slate-400
                      "
                    >
                      Video Thumbnail
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/25
                      transition
                      group-hover:bg-black/40
                    "
                  >
                    <PlayCircle
                      size={65}
                      className="
                        text-white
                        transition
                        duration-300
                        group-hover:scale-110
                      "
                    />
                  </div>

                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="
                      text-base
                      font-semibold
                      leading-6
                      text-[#0f3262]
                    "
                  >
                    {video.title}
                  </h3>

                  {video.description && (
                    <p
                      className="
                        mt-2
                        line-clamp-2
                        text-sm
                        leading-5
                        text-slate-500
                      "
                    >
                      {video.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && videos.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              px-6
              py-12
              text-center
            "
          >
            <PlayCircle
              size={36}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              No videos available at the moment.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default YoutubeSection;