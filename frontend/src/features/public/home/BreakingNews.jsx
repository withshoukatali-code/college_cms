import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

const API_URL = "http://localhost:5000/api/breaking-news";

function BreakingNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}?_=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        console.log("PUBLIC BREAKING NEWS:", result);

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch breaking news"
          );
        }

        setNews(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error(
          "Breaking News Fetch Error:",
          error
        );

        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);

  if (loading || news.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-slate-200 bg-[#eead09]">
      <div className="mx-auto flex h-8 max-w-7xl items-center overflow-hidden">

        {/* =================================================
            LABEL
        ================================================= */}

        <div
          className="
            flex
            h-full
            shrink-0
            items-center
            gap-2
            bg-[#07690f]
            px-6
            font-semibold
            tracking-wide
            text-white
          "
        >
          <Megaphone size={18} />

          <span>Breaking News</span>
        </div>

        {/* =================================================
            MARQUEE
        ================================================= */}

        <div className="relative flex-1 overflow-hidden">
          <div className="breaking-marquee whitespace-nowrap">

            {news.concat(news).map((item, index) => (
              <span
                key={`${item.id}-${index}`}
                className="
                  mx-10
                  inline-block
                  text-[12px]
                  font-medium
                  text-slate-900
                "
              >
                <span className="mr-2">
                  ●
                </span>

                {item.title}
              </span>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}

export default BreakingNews;