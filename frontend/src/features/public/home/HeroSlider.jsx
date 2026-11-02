// import { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   Award,
//   BookOpen,
//   Users,
//   GraduationCap,
// } from "lucide-react";

// const HERO_API = "http://localhost:5000/api/hero-slider";
// const STATS_API = "http://localhost:5000/api/college-statistics";

// function getImageUrl(path) {
//   if (!path) return "";

//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return path;
//   }

//   return `http://localhost:5000${
//     path.startsWith("/") ? "" : "/"
//   }${path}`;
// }

// /* =========================================================
//    STAT ICON
// ========================================================= */

// function getStatIcon(icon) {
//   switch (icon?.toLowerCase()) {
//     case "award":
//       return Award;

//     case "book":
//       return BookOpen;

//     case "users":
//       return Users;

//     case "graduation-cap":
//       return GraduationCap;

//     default:
//       return Award;
//   }
// }

// /* =========================================================
//    HERO SLIDER
// ========================================================= */

// function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [statistics, setStatistics] = useState([]);

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(true);

//   /* =======================================================
//      FETCH HERO SLIDES
//   ======================================================= */

//   useEffect(() => {
//     const fetchSlides = async () => {
//       try {
//         const response = await fetch(
//           `${HERO_API}?_=${Date.now()}`,
//           {
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Hero slider request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log("PUBLIC HERO SLIDER API:", result);

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setSlides(result.data);
//         } else {
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error(
//           "Public Hero Slider error:",
//           error
//         );

//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlides();
//   }, []);

//   /* =======================================================
//      FETCH COLLEGE STATISTICS
//   ======================================================= */

//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         const response = await fetch(
//           `${STATS_API}?_=${Date.now()}`,
//           {
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `College statistics request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "COLLEGE STATISTICS API:",
//           result
//         );

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setStatistics(result.data);
//         } else {
//           setStatistics([]);
//         }
//       } catch (error) {
//         console.error(
//           "College statistics error:",
//           error
//         );

//         setStatistics([]);
//       } finally {
//         setStatsLoading(false);
//       }
//     };

//     fetchStatistics();
//   }, []);

//   /* =======================================================
//      AUTO SLIDE
//   ======================================================= */

//   useEffect(() => {
//     if (slides.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((previous) =>
//         previous === slides.length - 1
//           ? 0
//           : previous + 1
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   /* =======================================================
//      NAVIGATION
//   ======================================================= */

//   const previousSlide = () => {
//     if (!slides.length) return;

//     setCurrentSlide((previous) =>
//       previous === 0
//         ? slides.length - 1
//         : previous - 1
//     );
//   };

//   const nextSlide = () => {
//     if (!slides.length) return;

//     setCurrentSlide((previous) =>
//       previous === slides.length - 1
//         ? 0
//         : previous + 1
//     );
//   };

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (loading) {
//     return (
//       <section className="w-full">
//         <div className="h-[300px] w-full animate-pulse bg-slate-200" />
//       </section>
//     );
//   }

//   /* =======================================================
//      NO HERO SLIDES
//   ======================================================= */

//   if (slides.length === 0) {
//     return (
//       <section className="relative h-[300px] w-full overflow-hidden bg-[#0f3262]">

//         <div className="flex h-full items-center px-6 pb-16 sm:px-10 lg:px-16">

//           <div>
//             <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
//               Welcome to Our College
//             </h1>

//             <p className="mt-2 text-sm text-blue-100">
//               Excellence in Education
//             </p>
//           </div>

//         </div>

//         {/* STATISTICS */}
//         {!statsLoading && statistics.length > 0 && (
//           <StatisticsBar statistics={statistics} />
//         )}

//       </section>
//     );
//   }

//   const slide = slides[currentSlide];

//   return (
//     <section className="relative h-150 w-full overflow-hidden bg-slate-900">

//       {/* =================================================
//           HERO IMAGE
//       ================================================= */}

//       {slide.image_url && (
//         <img
//           src={getImageUrl(slide.image_url)}
//           alt={
//             slide.title ||
//             "College hero banner"
//           }
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       )}

//       {/* =================================================
//           IMAGE OVERLAY
//       ================================================= */}

//       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

//       {/* =================================================
//           HERO CONTENT
//       ================================================= */}

//       <div className="relative z-10 flex h-full items-center pb-16">

//         <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">

//           <div className="max-w-2xl">

//             {slide.subtitle && (
//               <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 sm:text-sm">
//                 {slide.subtitle}
//               </p>
//             )}

//             <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
//               {slide.title}
//             </h1>

//             {slide.description && (
//               <p className="mt-3 max-w-xl text-xs leading-5 text-white/80 sm:text-sm">
//                 {slide.description}
//               </p>
//             )}

//             {slide.button_text &&
//               slide.button_link && (
//                 <a
//                   href={slide.button_link}
//                   className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0f3262] shadow-lg transition hover:bg-blue-50"
//                 >
//                   {slide.button_text}
//                   <ArrowRight size={14} />
//                 </a>
//               )}

//           </div>

//         </div>

//       </div>

//       {/* =================================================
//           PREVIOUS BUTTON
//       ================================================= */}

//       {slides.length > 1 && (
//         <button
//           type="button"
//           onClick={previousSlide}
//           aria-label="Previous slide"
//           className="
//             absolute
//             left-4
//             top-1/2
//             z-20
//             flex
//             h-9
//             w-9
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full
//             bg-black/30
//             text-white
//             backdrop-blur-sm
//             transition
//             hover:bg-black/60
//           "
//         >
//           <ChevronLeft size={19} />
//         </button>
//       )}

//       {/* =================================================
//           NEXT BUTTON
//       ================================================= */}

//       {slides.length > 1 && (
//         <button
//           type="button"
//           onClick={nextSlide}
//           aria-label="Next slide"
//           className="
//             absolute
//             right-4
//             top-1/2
//             z-20
//             flex
//             h-9
//             w-9
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full
//             bg-black/30
//             text-white
//             backdrop-blur-sm
//             transition
//             hover:bg-black/60
//           "
//         >
//           <ChevronRight size={19} />
//         </button>
//       )}

//       {/* =================================================
//           SLIDER DOTS
//       ================================================= */}

//       {slides.length > 1 && (
//         <div className="absolute bottom-[68px] left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
//           {slides.map((item, index) => (
//             <button
//               key={item.id ?? index}
//               type="button"
//               onClick={() =>
//                 setCurrentSlide(index)
//               }
//               aria-label={`Go to slide ${index + 1}`}
//               className={`h-1.5 rounded-full transition-all duration-300 ${
//                 currentSlide === index
//                   ? "w-7 bg-white"
//                   : "w-1.5 bg-white/50 hover:bg-white/80"
//               }`}
//             />
//           ))}
//         </div>
//       )}

//       {/* =================================================
//           COLLEGE STATISTICS
//       ================================================= */}

//       {!statsLoading &&
//         statistics.length > 0 && (
//           <StatisticsBar
//             statistics={statistics}
//           />
//         )}

//     </section>
//   );
// }

// /* =========================================================
//    STATISTICS BAR
// ========================================================= */

// function StatisticsBar({ statistics }) {
//   return (
//     <div
//       className="
//         absolute
//         bottom-0
//         left-0
//         right-0
//         z-30
//         border-t
//         border-white/20
//         bg-red-800
//         backdrop-blur-md
//       "
//     >
//       <div
//         className="
//           mx-auto
//           grid
//           min-h-14.5
//           max-w-7xl
//           grid-cols-2
//           divide-x
//           divide-white/10
//           sm:grid-cols-4
//         "
//       >

//         {statistics.map((stat, index) => {
//           const Icon = getStatIcon(
//             stat.icon
//           );

//           return (
//             <div
//               key={stat.id ?? index}
//               className="
//                 flex
//                 items-center
//                 justify-center
//                 gap-2.5
//                 px-3
//                 py-2
//                 text-white
//               "
//             >

//               {/* ICON */}

//               <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cyan-300">
//                 <Icon size={16} />
//               </div>

//               {/* VALUE */}

//               <div className="text-center sm:text-left">

//                 <div className="text-lg font-extrabold leading-none sm:text-xl">
//                   {stat.value}
//                 </div>

//                 <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-blue-200 sm:text-[10px]">
//                   {stat.label}
//                 </div>

//               </div>

//             </div>
//           );
//         })}

//       </div>
//     </div>
//   );
// }

// export default HeroSlider;

// above code is working properly


// import { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   BarChart3,
// } from "lucide-react";

// const HERO_API = "http://localhost:5000/api/hero-slider";
// const STATS_API = "http://localhost:5000/api/home-statistics";

// function getImageUrl(path) {
//   if (!path) return "";

//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return path;
//   }

//   return `http://localhost:5000${
//     path.startsWith("/") ? "" : "/"
//   }${path}`;
// }

// /* =========================================================
//    HERO SLIDER
// ========================================================= */

// function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [statistics, setStatistics] = useState([]);

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(true);

//   /* =======================================================
//      FETCH HERO SLIDES
//   ======================================================= */

//   useEffect(() => {
//     const fetchSlides = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(
//           `${HERO_API}?_=${Date.now()}`,
//           {
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Hero slider request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log("PUBLIC HERO SLIDER API:", result);

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setSlides(result.data);
//         } else {
//           setSlides([]);
//         }
//       } catch (error) {
//         console.error(
//           "Public Hero Slider error:",
//           error
//         );

//         setSlides([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlides();
//   }, []);

//   /* =======================================================
//      FETCH COLLEGE STATISTICS
//   ======================================================= */

//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         setStatsLoading(true);

//         const response = await fetch(
//           `${STATS_API}?_=${Date.now()}`,
//           {
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `College statistics request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "PUBLIC COLLEGE STATISTICS API:",
//           result
//         );

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           // Only display active statistics
//           const activeStatistics = result.data
//             .filter(
//               (item) =>
//                 Number(item.is_active) === 1
//             )
//             .sort(
//               (a, b) =>
//                 Number(a.display_order || 0) -
//                 Number(b.display_order || 0)
//             );

//           setStatistics(activeStatistics);
//         } else {
//           setStatistics([]);
//         }
//       } catch (error) {
//         console.error(
//           "College statistics error:",
//           error
//         );

//         setStatistics([]);
//       } finally {
//         setStatsLoading(false);
//       }
//     };

//     fetchStatistics();
//   }, []);

//   /* =======================================================
//      AUTO SLIDE
//   ======================================================= */

//   useEffect(() => {
//     if (slides.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((previous) =>
//         previous === slides.length - 1
//           ? 0
//           : previous + 1
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   /* =======================================================
//      NAVIGATION
//   ======================================================= */

//   const previousSlide = () => {
//     if (!slides.length) return;

//     setCurrentSlide((previous) =>
//       previous === 0
//         ? slides.length - 1
//         : previous - 1
//     );
//   };

//   const nextSlide = () => {
//     if (!slides.length) return;

//     setCurrentSlide((previous) =>
//       previous === slides.length - 1
//         ? 0
//         : previous + 1
//     );
//   };

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (loading) {
//     return (
//       <section className="w-full">
//         <div className="h-150 w-full animate-pulse bg-slate-200" />
//       </section>
//     );
//   }

//   /* =======================================================
//      NO SLIDES
//   ======================================================= */

//   if (slides.length === 0) {
//     return (
//       <section className="relative h-150 w-full overflow-hidden bg-[#0f3262]">

//         <div className="flex h-full items-center pb-16 px-6 sm:px-10 lg:px-16">
//           <div>
//             <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
//               Welcome to Our College
//             </h1>

//             <p className="mt-2 text-sm text-blue-100">
//               Excellence in Education
//             </p>
//           </div>
//         </div>

//         {!statsLoading &&
//           statistics.length > 0 && (
//             <StatisticsBar
//               statistics={statistics}
//             />
//           )}

//       </section>
//     );
//   }

//   const slide = slides[currentSlide];

//   return (
//     <section className="relative h-100 w-full overflow-hidden bg-slate-900">

//       {/* =================================================
//           HERO IMAGE
//       ================================================= */}

//       {slide.image_url && (
//         <img
//           src={getImageUrl(slide.image_url)}
//           alt={
//             slide.title ||
//             "College hero banner"
//           }
//           className="absolute inset-0 h-full w-full object-cover"
//         />
//       )}

//       {/* =================================================
//           OVERLAY
//       ================================================= */}

//       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

//       {/* =================================================
//           HERO CONTENT
//       ================================================= */}

//       <div className="relative z-10 flex h-full items-center pb-16">

//         <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">

//           <div className="max-w-2xl">

//             {slide.subtitle && (
//               <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 sm:text-sm">
//                 {slide.subtitle}
//               </p>
//             )}

//             <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
//               {slide.title}
//             </h1>

//             {slide.description && (
//               <p className="mt-3 max-w-xl text-xs leading-5 text-white/80 sm:text-sm">
//                 {slide.description}
//               </p>
//             )}

//             {slide.button_text &&
//               slide.button_link && (
//                 <a
//                   href={slide.button_link}
//                   className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0f3262] shadow-lg transition hover:bg-blue-50"
//                 >
//                   {slide.button_text}
//                   <ArrowRight size={14} />
//                 </a>
//               )}

//           </div>

//         </div>

//       </div>

//       {/* =================================================
//           PREVIOUS
//       ================================================= */}

//       {slides.length > 1 && (
//         <button
//           type="button"
//           onClick={previousSlide}
//           aria-label="Previous slide"
//           className="
//             absolute
//             left-4
//             top-1/2
//             z-20
//             flex
//             h-9
//             w-9
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full
//             bg-black/30
//             text-white
//             backdrop-blur-sm
//             transition
//             hover:bg-black/60
//           "
//         >
//           <ChevronLeft size={19} />
//         </button>
//       )}

//       {/* =================================================
//           NEXT
//       ================================================= */}

//       {slides.length > 1 && (
//         <button
//           type="button"
//           onClick={nextSlide}
//           aria-label="Next slide"
//           className="
//             absolute
//             right-4
//             top-1/2
//             z-20
//             flex
//             h-9
//             w-9
//             -translate-y-1/2
//             items-center
//             justify-center
//             rounded-full
//             bg-black/30
//             text-white
//             backdrop-blur-sm
//             transition
//             hover:bg-black/60
//           "
//         >
//           <ChevronRight size={19} />
//         </button>
//       )}

//       {/* =================================================
//           SLIDER DOTS
//       ================================================= */}

//       {slides.length > 1 && (
//         <div className="absolute bottom-[62px] left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
//           {slides.map((item, index) => (
//             <button
//               key={item.id ?? index}
//               type="button"
//               onClick={() =>
//                 setCurrentSlide(index)
//               }
//               aria-label={`Go to slide ${index + 1}`}
//               className={`h-1.5 rounded-full transition-all duration-300 ${
//                 currentSlide === index
//                   ? "w-7 bg-white"
//                   : "w-1.5 bg-white/50 hover:bg-white/80"
//               }`}
//             />
//           ))}
//         </div>
//       )}

//       {/* =================================================
//           COLLEGE STATISTICS
//       ================================================= */}

//       {!statsLoading &&
//         statistics.length > 0 && (
//           <StatisticsBar
//             statistics={statistics}
//           />
//         )}

//     </section>
//   );
// }

// /* =========================================================
//    STATISTICS BAR
// ========================================================= */

// function StatisticsBar({ statistics }) {
//   return (
//     <div
//       className="
//         absolute
//         bottom-0
//         left-0
//         right-0
//         z-30
//         border-t
//         border-white/20
//         bg-red-800
//         backdrop-blur-md
//       "
//     >
//       <div
//         className="
//           mx-auto
//           grid
//           min-h-14.5
//           max-w-7xl
//           grid-cols-2
//           divide-x
//           divide-white/10
//           sm:grid-cols-4
//         "
//       >

//         {statistics.map((stat, index) => (
//           <div
//             key={stat.id ?? index}
//             className="
//               flex
//               items-center
//               justify-center
//               gap-2.5
//               px-3
//               py-2
//               text-white
//             "
//           >

//             {/* ICON */}

//             <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cyan-300 sm:flex">
//               <BarChart3 size={16} />
//             </div>

//             {/* VALUE + LABEL */}

//             <div className="text-center sm:text-left">

//               <div className="text-lg font-extrabold leading-none sm:text-xl">
//                 {stat.value}
//               </div>

//               <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-blue-200 sm:text-[10px]">
//                 {stat.label}
//               </div>

//               {stat.description && (
//                 <div className="hidden text-[9px] text-white/50 lg:block">
//                   {stat.description}
//                 </div>
//               )}

//             </div>

//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }

// export default HeroSlider;

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const HERO_API = "http://localhost:5000/api/hero-slider";
const STATS_API = "http://localhost:5000/api/home-statistics";

function getImageUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `http://localhost:5000${
    path.startsWith("/") ? "" : "/"
  }${path}`;
}

/* =========================================================
   HERO SLIDER
========================================================= */

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  /* =======================================================
     FETCH HERO SLIDES
  ======================================================= */

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${HERO_API}?_=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Hero slider request failed: ${response.status}`
          );
        }

        const result = await response.json();

        console.log("PUBLIC HERO SLIDER API:", result);

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          setSlides(result.data);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error(
          "Public Hero Slider error:",
          error
        );

        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  /* =======================================================
     FETCH HOME STATISTICS
  ======================================================= */

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);

        const response = await fetch(
          `${STATS_API}?_=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Home statistics request failed: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "PUBLIC HOME STATISTICS API:",
          result
        );

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          const activeStatistics = result.data
            .filter(
              (item) =>
                Number(item.is_active) === 1
            )
            .sort(
              (a, b) =>
                Number(a.display_order || 0) -
                Number(b.display_order || 0)
            );

          setStatistics(activeStatistics);
        } else {
          setStatistics([]);
        }
      } catch (error) {
        console.error(
          "Home statistics error:",
          error
        );

        setStatistics([]);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  /* =======================================================
     AUTO SLIDE
  ======================================================= */

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((previous) =>
        previous === slides.length - 1
          ? 0
          : previous + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const previousSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((previous) =>
      previous === 0
        ? slides.length - 1
        : previous - 1
    );
  };

  const nextSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((previous) =>
      previous === slides.length - 1
        ? 0
        : previous + 1
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="w-full">
        <div className="h-150 w-full animate-pulse bg-slate-200" />
      </section>
    );
  }

  /* =======================================================
     NO SLIDES
  ======================================================= */

  if (slides.length === 0) {
    return (
      <section className="relative h-150 w-full overflow-hidden bg-[#0f3262]">

        <div className="flex h-full items-center pb-16 px-6 sm:px-10 lg:px-16">
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Welcome to Our College
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Excellence in Education
            </p>
          </div>
        </div>

        {!statsLoading &&
          statistics.length > 0 && (
            <StatisticsBar
              statistics={statistics}
            />
          )}

      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative h-100 w-full overflow-hidden bg-slate-900">

      {/* =================================================
          HERO IMAGE
      ================================================= */}

      {slide.image_url && (
        <img
          src={getImageUrl(slide.image_url)}
          alt={
            slide.title ||
            "College hero banner"
          }
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* =================================================
          OVERLAY
      ================================================= */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div className="relative z-10 flex h-full items-center pb-16">

        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">

          <div className="max-w-2xl">

            {slide.subtitle && (
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 sm:text-sm">
                {slide.subtitle}
              </p>
            )}

            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>

            {slide.description && (
              <p className="mt-3 max-w-xl text-xs leading-5 text-white/80 sm:text-sm">
                {slide.description}
              </p>
            )}

            {slide.button_text &&
              slide.button_link && (
                <a
                  href={slide.button_link}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0f3262] shadow-lg transition hover:bg-blue-50"
                >
                  {slide.button_text}
                  <ArrowRight size={14} />
                </a>
              )}

          </div>

        </div>

      </div>

      {/* =================================================
          PREVIOUS
      ================================================= */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            absolute
            left-4
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/30
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/60
          "
        >
          <ChevronLeft size={19} />
        </button>
      )}

      {/* =================================================
          NEXT
      ================================================= */}

      {slides.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            absolute
            right-4
            top-1/2
            z-20
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-black/30
            text-white
            backdrop-blur-sm
            transition
            hover:bg-black/60
          "
        >
          <ChevronRight size={19} />
        </button>
      )}

      {/* =================================================
          SLIDER DOTS
      ================================================= */}

      {slides.length > 1 && (
        <div className="absolute bottom-[62px] left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {slides.map((item, index) => (
            <button
              key={item.id ?? index}
              type="button"
              onClick={() =>
                setCurrentSlide(index)
              }
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* =================================================
          HOME STATISTICS
      ================================================= */}

      {!statsLoading &&
        statistics.length > 0 && (
          <StatisticsBar
            statistics={statistics}
          />
        )}

    </section>
  );
}

/* =========================================================
   STATISTICS BAR
========================================================= */

function StatisticsBar({ statistics }) {
  return (
    <div
      className="
        absolute
        bottom-0
        left-0
        right-0
        z-30
        border-t
        border-white/20
        bg-red-800
        backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto
          grid
          min-h-14.5
          max-w-7xl
          grid-cols-2
          divide-x
          divide-white/10
          sm:grid-cols-4
        "
      >

        {statistics.map((stat, index) => (
          <div
            key={stat.id ?? index}
            className="
              flex
              items-center
              justify-center
              gap-2.5
              px-3
              py-2
              text-white
            "
          >

            {/* ICON */}

            <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-cyan-300 sm:flex">
              <BarChart3 size={16} />
            </div>

            {/* VALUE + TITLE */}

            <div className="text-center sm:text-left">

              <div className="text-lg font-extrabold leading-none sm:text-xl">
                {stat.value}
              </div>

              {/* IMPORTANT:
                  Database column is `title`, not `label`
              */}

              <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-blue-200 sm:text-[10px]">
                {stat.title}
              </div>

              {stat.description && (
                <div className="hidden text-[9px] text-white/50 lg:block">
                  {stat.description}
                </div>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default HeroSlider;