
import { ArrowRight, Building2, Award, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function AboutCollege() {

  return (
    <section className="py-12 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <div className="relative">
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80"
                alt="College campus"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Accreditation Badge */}
            <div className="
              absolute
              -bottom-5
              right-5
              bg-white
              rounded-xl
              shadow-xl
              border
              border-slate-100
              p-4
              w-52
            ">
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10
                  rounded-lg
                  bg-blue-50
                  text-blue-700
                  flex
                  items-center
                  justify-center
                ">
                  <Award size={21} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Accreditation
                  </p>

                  <p className="font-bold text-slate-800 text-sm">
                    NAAC Accredited
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>

            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 uppercase tracking-wide">
              <span className="w-8 h-px bg-blue-700" />
              About the College
            </div>

            <h2 className="
              mt-4
              text-3xl
              sm:text-4xl
              font-bold
              tracking-tight
              text-slate-900
            ">
              Building Knowledge,
              <span className="text-blue-700">
                {" "}Character & Excellence
              </span>
            </h2>

            <p className="
              mt-5
              text-slate-600
              leading-7
            ">
              Discover our institution, academic programmes,
              departments, achievements and commitment to quality
              higher education.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">

              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <Building2
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  Institution
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  About our college
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <BookOpen
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  Academics
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Programmes & departments
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <Award
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  Excellence
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Quality & achievements
                </p>
              </div>

            </div>

            <Link
              to="/about"
              className="
                inline-flex
                items-center
                gap-2
                mt-8
                px-5
                py-3
                rounded-lg
                bg-blue-700
                text-white
                text-sm
                font-semibold
                hover:bg-blue-800
                transition
              "
            >
              Discover More
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
};


export default AboutCollege;