
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Award,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/about-college";

const fallbackData = {
  title: "Building Knowledge,",
  title_highlight: "Character & Excellence",
  description:
    "Discover our institution, academic programmes, departments, achievements and commitment to quality higher education.",
  image_url:
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=80",
  image_alt: "College campus",

  accreditation_label: "Accreditation",
  accreditation_text: "NAAC Accredited",

  highlight1_title: "Institution",
  highlight1_description: "About our college",

  highlight2_title: "Academics",
  highlight2_description: "Programmes & departments",

  highlight3_title: "Excellence",
  highlight3_description: "Quality & achievements",

  button_text: "Discover More",
  button_link: "/about",
};

const AboutPreview = () => {
  const [about, setAbout] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAboutCollege = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch About College (${response.status})`
          );
        }

        const result = await response.json();

        console.log("Public About College API:", result);

        if (!cancelled && result?.success) {
          /*
           * API returns:
           * {
           *   success: true,
           *   data: [...]
           * }
           */

          const item = Array.isArray(result.data)
            ? result.data[0]
            : result.data;

          if (item) {
            setAbout({
              ...fallbackData,
              ...item,
            });
          }
        }
      } catch (error) {
        console.error(
          "Failed to load About College:",
          error
        );

        /*
         * Keep fallback content if API is unavailable.
         */
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAboutCollege();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // IMAGE URL
  // ============================================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return fallbackData.image_url;
    }

    /*
     * Full external URL
     */
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    /*
     * Backend uploaded image
     */
    if (imageUrl.startsWith("/")) {
      return `http://localhost:5000${imageUrl}`;
    }

    return `http://localhost:5000/${imageUrl}`;
  };

  // ============================================================
  // BUTTON LINK
  // ============================================================

  const renderButton = () => {
    const link = about.button_link || "/about";
    const text = about.button_text || "Discover More";

    /*
     * External URL
     */
    if (
      link.startsWith("http://") ||
      link.startsWith("https://")
    ) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
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
          {text}
          <ArrowRight size={17} />
        </a>
      );
    }

    /*
     * Internal React route
     */
    return (
      <Link
        to={link}
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
        {text}
        <ArrowRight size={17} />
      </Link>
    );
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <section className="py-12 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* =====================================================
              IMAGE
          ===================================================== */}

          <div className="relative">

            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-200">

              <img
                src={getImageUrl(about.image_url)}
                alt={
                  about.image_alt ||
                  "College campus"
                }
                className="
                  w-full
                  h-full
                  object-cover
                "
                onError={(e) => {
                  e.currentTarget.src =
                    fallbackData.image_url;
                }}
              />

            </div>

            {/* ===================================================
                ACCREDITATION BADGE
            =================================================== */}

            <div
              className="
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
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-blue-50
                    text-blue-700
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Award size={21} />
                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    {about.accreditation_label ||
                      "Accreditation"}
                  </p>

                  <p className="font-bold text-slate-800 text-sm">
                    {about.accreditation_text ||
                      "NAAC Accredited"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div>

            {/* Section Label */}

            <div
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-blue-700
                uppercase
                tracking-wide
              "
            >
              <span className="w-8 h-px bg-blue-700" />

              About the College
            </div>

            {/* ===================================================
                TITLE
            =================================================== */}

            <h2
              className="
                mt-4
                text-2xl
                sm:text-3xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >

              {about.title}

              {about.title_highlight && (
                <span className="text-blue-700">
                  {" "}
                  {about.title_highlight}
                </span>
              )}

            </h2>

            {/* ===================================================
                DESCRIPTION
            =================================================== */}

            <p
              className="
                mt-5
                text-slate-600
                leading-7
              "
            >
              {about.description}
            </p>

            {/* ===================================================
                HIGHLIGHTS
            =================================================== */}

            <div
              className="
                grid
                sm:grid-cols-3
                gap-4
                mt-8
              "
            >

              {/* INSTITUTION */}

              <div
                className="
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                  p-4
                "
              >

                <Building2
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  {about.highlight1_title ||
                    "Institution"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {about.highlight1_description ||
                    "About our college"}
                </p>

              </div>

              {/* ACADEMICS */}

              <div
                className="
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                  p-4
                "
              >

                <BookOpen
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  {about.highlight2_title ||
                    "Academics"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {about.highlight2_description ||
                    "Programmes & departments"}
                </p>

              </div>

              {/* EXCELLENCE */}

              <div
                className="
                  rounded-xl
                  bg-white
                  border
                  border-slate-200
                  p-4
                "
              >

                <Award
                  size={22}
                  className="text-blue-700"
                />

                <p className="mt-3 font-semibold text-slate-800">
                  {about.highlight3_title ||
                    "Excellence"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {about.highlight3_description ||
                    "Quality & achievements"}
                </p>

              </div>

            </div>

            {/* ===================================================
                BUTTON
            =================================================== */}

            {renderButton()}

          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutPreview;

