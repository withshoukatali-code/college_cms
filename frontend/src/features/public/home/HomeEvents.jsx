import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays } from "lucide-react";

const API_URL = "http://localhost:5000/api/home-events";

function HomeEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch home events");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Home events API error:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!events.length) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#02aee8]">
              Campus Life
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Events & Activities
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Discover the academic, cultural, sports and student-development
              activities taking place across our college.
            </p>
          </div>

        </div>

        {/* =====================================================
            EVENTS
        ===================================================== */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {events.map((event) => (
            <article
              key={event.id}
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

              {/* Image */}

              <div className="relative h-52 overflow-hidden bg-slate-200">

                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Event Image
                  </div>
                )}

                {/* Date */}

                {event.event_date && (
                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-lg
                      bg-[#0f3262]/95
                      px-3
                      py-2
                      text-center
                      text-white
                      shadow-lg
                    "
                  >
                    <CalendarDays
                      size={15}
                      className="mx-auto mb-1 text-[#38d5ff]"
                    />

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                      {new Date(event.event_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}

              </div>

              {/* Content */}

              <div className="p-5">

                <h3 className="text-lg font-bold leading-snug text-slate-900">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {event.description}
                  </p>
                )}

                {event.button_text && event.button_link && (
                  <a
                    href={event.button_link}
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-[#0f3262]
                      transition
                      hover:text-[#02aee8]
                    "
                  >
                    {event.button_text}

                    <ArrowRight
                      size={16}
                      className="
                        transition
                        group-hover:translate-x-1
                      "
                    />
                  </a>
                )}

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default HomeEvents;