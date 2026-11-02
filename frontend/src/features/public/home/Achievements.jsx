// import React from "react";
import { Trophy, Medal, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const achievements = [
  {
    icon: Trophy,
    title: "Academic Excellence",
    text: "Recognising outstanding academic performance and institutional excellence.",
  },
  {
    icon: Medal,
    title: "Student Achievements",
    text: "Celebrating students who excel in academic, cultural and co-curricular activities.",
  },
  {
    icon: Star,
    title: "Institutional Recognition",
    text: "Highlights of awards, recognitions and important institutional milestones.",
  },
];

const Achievements = () => {
  return (
    <section className="py-12 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto">

          <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Our Milestones
          </span>

          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Achievements & Recognition
          </h2>

          <p className="mt-4 text-slate-500 leading-7">
            A glimpse of achievements that reflect our commitment to
            academic quality and institutional development.
          </p>

        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          {achievements.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={index}
                className="
                  bg-white
                  rounded-2xl
                  border border-slate-200
                  p-7
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >

                <div className="
                  w-14 h-14
                  rounded-xl
                  bg-blue-50
                  text-blue-700
                  flex items-center justify-center
                ">
                  <Icon size={27} />
                </div>

                <h3 className="
                  mt-5
                  text-lg
                  font-bold
                  text-slate-800
                ">
                  {item.title}
                </h3>

                <p className="
                  mt-3
                  text-sm
                  text-slate-500
                  leading-6
                ">
                  {item.text}
                </p>

              </article>
            );
          })}

        </div>

        {/* View All */}
        <div className="text-center mt-9">

          <Link
            to="/achievements"
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
            View All Achievements
            <ArrowRight size={17} />
          </Link>

        </div>

      </div>
    </section>
  );
};

export default Achievements;