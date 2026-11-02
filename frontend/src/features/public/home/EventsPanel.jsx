import { Link } from "react-router-dom";
import { CalendarDays, ChevronRight } from "lucide-react";

const events = [
  {
    id: 1,
    date: "12 Aug",
    title: "National Seminar on Artificial Intelligence",
  },
  {
    id: 2,
    date: "15 Aug",
    title: "Independence Day Celebration",
  },
  {
    id: 3,
    date: "22 Aug",
    title: "Career Guidance Workshop",
  },
  {
    id: 4,
    date: "28 Aug",
    title: "Intercollegiate Cultural Festival",
  },
  {
    id: 5,
    date: "02 Sep",
    title: "Tree Plantation Drive",
  },
  {
    id: 6,
    date: "10 Sep",
    title: "Research Paper Presentation Competition",
  },
];

function EventsPanel() {
  return (
    <div
      className="
        h-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >
      {/* Heading */}

      <div className="mb-4 flex items-center gap-2">

        <CalendarDays
          size={20}
          className="text-[#eead09]"
        />

        <h2
          className="
            text-lg
            font-bold
            text-[#0f3262]
          "
        >
          Upcoming Events
        </h2>

      </div>

      {/* Scroll */}

      <div
        className="
          h-77.5
          space-y-3
          overflow-y-auto
          pr-2
        "
      >
        {events.map((item) => (
          <Link
            key={item.id}
            to={`/events/${item.id}`}
            className="
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
            <div
              className="
                text-xs
                font-semibold
                text-[#eead09]
              "
            >
              {item.date}
            </div>

            <div
              className="
                mt-1
                text-sm
                font-medium
                leading-6
                text-slate-700
              "
            >
              {item.title}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}

      <div className="mt-4">

        <Link
          to="/events"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#0f3262]
            transition
            hover:text-[#eead09]
          "
        >
          View All

          <ChevronRight size={16} />
        </Link>

      </div>
    </div>
  );
}

export default EventsPanel;