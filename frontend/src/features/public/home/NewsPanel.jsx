// import { Link } from "react-router-dom";
// import { Newspaper, ChevronRight } from "lucide-react";

// const news = [
//   {
//     id: 1,
//     date: "08 Aug",
//     title: "Admissions Open for Academic Year 2026–27",
//   },
//   {
//     id: 2,
//     date: "06 Aug",
//     title: "Scholarship Application Last Date Extended",
//   },
//   {
//     id: 3,
//     date: "04 Aug",
//     title: "Internal Examination Timetable Published",
//   },
//   {
//     id: 4,
//     date: "02 Aug",
//     title: "NSS Special Camp Registration Started",
//   },
//   {
//     id: 5,
//     date: "30 Jul",
//     title: "University Circular for Semester Examination",
//   },
//   {
//     id: 6,
//     date: "28 Jul",
//     title: "Placement Drive for Final Year Students",
//   },
// ];

// function NewsPanel() {
//   return (
//     <div
//       className="
//         h-full
//         rounded-3xl
//         border
//         border-slate-200
//         bg-white
//         p-5
//         shadow-sm
//       "
//     >
//       {/* Heading */}

//       <div className="mb-4 flex items-center gap-2">

//         <Newspaper
//           size={20}
//           className="text-[#eead09]"
//         />

//         <h2
//           className="
//             text-lg
//             font-bold
//             text-[#0f3262]
//           "
//         >
//           Latest News
//         </h2>

//       </div>

//       {/* Scroll */}

//       <div
//         className="
//           h-77.5
//           space-y-3
//           overflow-y-auto
//           pr-2
//         "
//       >
//         {news.map((item) => (
//           <Link
//             key={item.id}
//             to={`/news/${item.id}`}
//             className="
//               block
//               rounded-xl
//               border
//               border-slate-100
//               p-3
//               transition
//               hover:border-[#eead09]
//               hover:bg-slate-50
//             "
//           >
//             <div
//               className="
//                 text-xs
//                 font-semibold
//                 text-[#eead09]
//               "
//             >
//               {item.date}
//             </div>

//             <div
//               className="
//                 mt-1
//                 text-sm
//                 font-medium
//                 leading-6
//                 text-slate-700
//               "
//             >
//               {item.title}
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Footer */}

//       <div className="mt-4">

//         <Link
//           to="/news"
//           className="
//             inline-flex
//             items-center
//             gap-2
//             text-sm
//             font-semibold
//             text-[#0f3262]
//             transition
//             hover:text-[#eead09]
//           "
//         >
//           View All

//           <ChevronRight size={16} />
//         </Link>

//       </div>
//     </div>
//   );
// }

// export default NewsPanel;



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/news-notices";

function NewsPanel() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      console.log("NEWS API RESPONSE:", result);

      // Your API returns a direct array
      if (!Array.isArray(result)) {
        throw new Error("News API did not return an array");
      }

      // Sort latest first
      const sortedNews = [...result].sort((a, b) => {
        return (
          new Date(b.publish_date).getTime() -
          new Date(a.publish_date).getTime()
        );
      });

      // Latest 6
      setNews(sortedNews.slice(0, 6));
    } catch (error) {
      console.error("NewsPanel error:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // ============================================================
  // GET LINK
  // ============================================================

  const getLink = (item) => {
    if (item?.link && item.link.trim() !== "") {
      return item.link;
    }

    return "/news";
  };

  return (
    <div
      className="
        h-full
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          bg-[#0f3262]
          px-5
          py-4
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white/10
              text-white
            "
          >
            <Newspaper size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-white">
              News & Notices
            </h2>

            <p className="text-xs text-white/75">
              Latest college updates
            </p>
          </div>

        </div>
{/* 
        <Link
          to="/news"
          className="
            flex
            items-center
            gap-1
            rounded-lg
            bg-white/10
            px-3
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-white/20
          "
        >
          View All
          <ChevronRight size={14} />
        </Link> */}
      </div>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <div className="p-4">

        {/* ====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            className="
              flex
              h-72
              items-center
              justify-center
            "
          >
            <div className="text-center">

              <RefreshCw
                size={25}
                className="
                  mx-auto
                  animate-spin
                  text-[#0f3262]
                "
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading news...
              </p>

            </div>
          </div>
        )}

        {/* ====================================================
            NEWS LIST
        ===================================================== */}

        {!loading && news.length > 0 && (
          <div
            className="
              h-72
              space-y-2
              overflow-y-auto
              pr-1
            "
          >
            {news.map((item) => (
              <Link
                key={item.id}
                to={getLink(item)}
                className="
                  group
                  block
                  rounded-xl
                  border
                  border-slate-100
                  p-3
                  transition
                  hover:border-[#eead09]
                  hover:bg-slate-50
                "
              >
                <div className="flex items-start gap-3">

                  {/* ==================================================
                      DATE
                  =================================================== */}

                  <div
                    className="
                      min-w-[58px]
                      rounded-lg
                      bg-[#fff8e5]
                      px-2
                      py-2
                      text-center
                    "
                  >
                    <div
                      className="
                        text-xs
                        font-bold
                        text-[#eead09]
                      "
                    >
                      {formatDate(item.publish_date)}
                    </div>
                  </div>

                  {/* ==================================================
                      CONTENT
                  =================================================== */}

                  <div className="min-w-0 flex-1">

                    <div
                      className="
                        line-clamp-2
                        text-sm
                        font-semibold
                        leading-5
                        text-slate-700
                        transition
                        group-hover:text-[#0f3262]
                      "
                    >
                      {item.title || "Untitled Notice"}
                    </div>

                    <div
                      className="
                        mt-1
                        text-[11px]
                        font-medium
                        uppercase
                        text-slate-400
                      "
                    >
                      {item.category || "News"}
                    </div>

                  </div>

                  {/* ==================================================
                      ARROW
                  =================================================== */}

                  <ChevronRight
                    size={16}
                    className="
                      mt-1
                      shrink-0
                      text-slate-300
                      transition
                      group-hover:text-[#0f3262]
                    "
                  />

                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ====================================================
            EMPTY
        ===================================================== */}

        {!loading && news.length === 0 && (
          <div
            className="
              flex
              h-72
              items-center
              justify-center
              text-center
            "
          >
            <div>

              <Newspaper
                size={34}
                className="mx-auto text-slate-300"
              />

              <p
                className="
                  mt-3
                  text-sm
                  text-slate-400
                "
              >
                No news or notices available.
              </p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default NewsPanel;

