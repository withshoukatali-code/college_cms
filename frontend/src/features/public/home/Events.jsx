// import { useEffect, useState } from "react";
// import { CalendarDays, ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const API_URL = "http://localhost:5000/api/home-events";

// const fallbackImages = [
//   "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b",
//   "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//   "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
// ];

// const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(API_URL);

//         if (!response.ok) {
//           throw new Error("Failed to fetch events");
//         }

//         const result = await response.json();

//         if (result.success && Array.isArray(result.data)) {
//           setEvents(result.data);
//         } else {
//           setEvents([]);
//         }
//       } catch (error) {
//         console.error("Events API error:", error);
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <section className="bg-white py-16 sm:py-20">
//       <div className="mx-auto max-w-7xl px-5 lg:px-8">

//         {/* =====================================================
//             SECTION HEADING
//         ===================================================== */}

//         <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

//           <div>
//             <span
//               className="
//                 text-sm
//                 font-semibold
//                 uppercase
//                 tracking-wide
//                 text-blue-700
//               "
//             >
//               Campus Life
//             </span>

//             <h2
//               className="
//                 mt-2
//                 text-2xl
//                 font-bold
//                 text-slate-900
//                 sm:text-4xl
//               "
//             >
//               Activities & Events
//             </h2>

//             <p
//               className="
//                 mt-3
//                 max-w-2xl
//                 text-slate-500
//               "
//             >
//               Stay connected with academic activities, campus
//               programmes, seminars and important institutional events.
//             </p>
//           </div>

//           <Link
//             to="/events"
//             className="
//               inline-flex
//               items-center
//               gap-2
//               text-sm
//               font-semibold
//               text-blue-700
//               hover:text-blue-800
//             "
//           >
//             View All Events
//             <ArrowRight size={17} />
//           </Link>

//         </div>

//         {/* =====================================================
//             LOADING
//         ===================================================== */}

//         {loading && (
//           <div className="grid gap-6 md:grid-cols-3">

//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="
//                   h-[330px]
//                   animate-pulse
//                   rounded-2xl
//                   bg-slate-100
//                 "
//               />
//             ))}

//           </div>
//         )}

//         {/* =====================================================
//             EVENTS
//         ===================================================== */}

//         {!loading && events.length > 0 && (
//           <div className="grid gap-6 md:grid-cols-3">

//             {events.map((event, index) => {

//               const eventDate = event.event_date
//                 ? new Date(event.event_date)
//                 : null;

//               const date = eventDate
//                 ? eventDate.toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                   })
//                 : "";

//               const month = eventDate
//                 ? eventDate
//                     .toLocaleDateString("en-IN", {
//                       month: "short",
//                     })
//                     .toUpperCase()
//                 : "";

//               return (
//                 <article
//                   key={event.id}
//                   className="
//                     group
//                     overflow-hidden
//                     rounded-2xl
//                     border
//                     border-slate-200
//                     bg-white
//                     transition-all
//                     duration-300
//                     hover:-translate-y-1
//                     hover:shadow-xl
//                   "
//                 >

//                   {/* =================================================
//                       EVENT IMAGE
//                   ================================================= */}

//                   <div className="aspect-video overflow-hidden bg-slate-100">

//                     {event.image_url ? (
//                       <img
//                         src={event.image_url}
//                         alt={event.title}
//                         className="
//                           h-full
//                           w-full
//                           object-cover
//                           transition
//                           duration-500
//                           group-hover:scale-105
//                         "
//                       />
//                     ) : (
//                       <img
//                         src={fallbackImages[index % fallbackImages.length]}
//                         alt={event.title}
//                         className="
//                           h-full
//                           w-full
//                           object-cover
//                           transition
//                           duration-500
//                           group-hover:scale-105
//                         "
//                       />
//                     )}

//                   </div>

//                   {/* =================================================
//                       EVENT DETAILS
//                   ================================================= */}

//                   <div className="p-5">

//                     <div className="flex gap-4">

//                       {/* Date */}

//                       <div
//                         className="
//                           flex
//                           h-14
//                           w-14
//                           shrink-0
//                           flex-col
//                           items-center
//                           justify-center
//                           rounded-xl
//                           bg-blue-50
//                           text-blue-700
//                         "
//                       >

//                         <span
//                           className="
//                             text-xl
//                             font-bold
//                             leading-none
//                           "
//                         >
//                           {date}
//                         </span>

//                         <span
//                           className="
//                             mt-1
//                             text-[10px]
//                             font-bold
//                           "
//                         >
//                           {month}
//                         </span>

//                       </div>

//                       {/* Title */}

//                       <div className="min-w-0">

//                         {event.category && (
//                           <span
//                             className="
//                               text-xs
//                               font-semibold
//                               text-blue-700
//                             "
//                           >
//                             {event.category}
//                           </span>
//                         )}

//                         <h3
//                           className="
//                             mt-1
//                             font-semibold
//                             leading-6
//                             text-slate-800
//                           "
//                         >
//                           {event.title}
//                         </h3>

//                       </div>

//                     </div>

//                     {/* Bottom */}

//                     <div
//                       className="
//                         mt-5
//                         flex
//                         items-center
//                         gap-2
//                         border-t
//                         border-slate-100
//                         pt-4
//                         text-xs
//                         text-slate-500
//                       "
//                     >
//                       <CalendarDays size={15} />

//                       Upcoming Event
//                     </div>

//                   </div>

//                 </article>
//               );
//             })}

//           </div>
//         )}

//         {/* =====================================================
//             EMPTY STATE
//         ===================================================== */}

//         {!loading && events.length === 0 && (
//           <div
//             className="
//               rounded-2xl
//               border
//               border-dashed
//               border-slate-300
//               bg-slate-50
//               px-6
//               py-12
//               text-center
//             "
//           >
//             <CalendarDays
//               size={36}
//               className="mx-auto text-slate-300"
//             />

//             <p className="mt-3 text-sm text-slate-500">
//               No upcoming events available.
//             </p>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default Events;



import { useEffect, useState } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/home-events";
const SERVER_URL = "http://localhost:5000";

// ============================================================
// FALLBACK IMAGES
// ============================================================

const fallbackImages = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
];

// ============================================================
// IMAGE URL HELPER
// ============================================================

const getImageUrl = (imageUrl, fallbackIndex = 0) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return fallbackImages[fallbackIndex % fallbackImages.length];
  }

  const cleanUrl = imageUrl.trim();

  // Full URL
  if (
    cleanUrl.startsWith("http://") ||
    cleanUrl.startsWith("https://")
  ) {
    return cleanUrl;
  }

  // Relative upload path
  if (cleanUrl.startsWith("/")) {
    return `${SERVER_URL}${cleanUrl}`;
  }

  // Relative path without /
  return `${SERVER_URL}/${cleanUrl}`;
};

// ============================================================
// EVENTS COMPONENT
// ============================================================

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // FETCH EVENTS
  // ==========================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events:", API_URL);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Events API failed: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        console.log("Events API response:", result);

        if (result.success && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          console.warn("Invalid events API response:", result);
          setEvents([]);
        }
      } catch (error) {
        console.error("Events API error:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ==========================================================
  // IMAGE ERROR HANDLER
  // ==========================================================

  const handleImageError = (e, index) => {
    console.error("Event image failed:", e.currentTarget.src);

    // Prevent infinite onError loop
    if (!e.currentTarget.dataset.fallbackApplied) {
      e.currentTarget.dataset.fallbackApplied = "true";
      e.currentTarget.src =
        fallbackImages[index % fallbackImages.length];
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* ====================================================
            SECTION HEADING
        ==================================================== */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-blue-700
              "
            >
              Campus Life
            </span>

            <h2
              className="
                mt-2
                text-xl
                font-bold
                text-slate-900
                sm:text-2xl
              "
            >
              Activities & Events
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-slate-500
              "
            >
              Stay connected with academic activities, campus
              programmes, seminars and important institutional events.
            </p>
          </div>

          {/* <Link
            to="/events"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-700
              hover:text-blue-800
            "
          >
            View All Events
            <ArrowRight size={17} />
          </Link> */}

        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="grid gap-6 md:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-[330px]
                  animate-pulse
                  rounded-2xl
                  bg-slate-100
                "
              />
            ))}

          </div>
        )}

        {/* ====================================================
            EVENTS
        ==================================================== */}

        {!loading && events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">

            {events.map((event, index) => {

              // ------------------------------------------------
              // DATE
              // ------------------------------------------------

              const eventDate = event.event_date
                ? new Date(event.event_date)
                : null;

              const validDate =
                eventDate && !isNaN(eventDate.getTime());

              const date = validDate
                ? eventDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                  })
                : "";

              const month = validDate
                ? eventDate
                    .toLocaleDateString("en-IN", {
                      month: "short",
                    })
                    .toUpperCase()
                : "";

              // ------------------------------------------------
              // IMAGE
              // ------------------------------------------------

              const imageUrl = getImageUrl(
                event.image_url,
                index
              );

              console.log(
                `Event ${event.id} image:`,
                event.image_url,
                "=>",
                imageUrl
              );

              return (
                <article
                  key={event.id}
                  className="
                    group
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >

                  {/* =================================================
                      EVENT IMAGE
                  ================================================= */}

                  <div className="aspect-video overflow-hidden bg-slate-100">

                    <img
                      src={imageUrl}
                      alt={event.title || "College event"}
                      onError={(e) =>
                        handleImageError(e, index)
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                    />

                  </div>

                  {/* =================================================
                      EVENT DETAILS
                  ================================================= */}

                  <div className="p-5">

                    <div className="flex gap-4">

                      {/* DATE */}

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          flex-col
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-700
                        "
                      >

                        <span
                          className="
                            text-xl
                            font-bold
                            leading-none
                          "
                        >
                          {date || "--"}
                        </span>

                        <span
                          className="
                            mt-1
                            text-[10px]
                            font-bold
                          "
                        >
                          {month || "DATE"}
                        </span>

                      </div>

                      {/* TITLE */}

                      <div className="min-w-0">

                        {event.category && (
                          <span
                            className="
                              text-xs
                              font-semibold
                              text-blue-700
                            "
                          >
                            {event.category}
                          </span>
                        )}

                        <h3
                          className="
                            mt-1
                            font-semibold
                            leading-6
                            text-slate-800
                          "
                        >
                          {event.title}
                        </h3>

                      </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {event.description && (
                      <p
                        className="
                          mt-4
                          line-clamp-2
                          text-sm
                          leading-6
                          text-slate-500
                        "
                      >
                        {event.description}
                      </p>
                    )}

                    {/* =================================================
                        BOTTOM
                    ================================================= */}

                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        border-t
                        border-slate-100
                        pt-4
                        text-xs
                        text-slate-500
                      "
                    >
                      <CalendarDays size={15} />

                      Upcoming Event
                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!loading && events.length === 0 && (
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

            <CalendarDays
              size={36}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              No upcoming events available.
            </p>

          </div>
        )}

      </div>
    </section>
  );
};

export default Events;

