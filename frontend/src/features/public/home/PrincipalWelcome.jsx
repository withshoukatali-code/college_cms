// // import { useEffect, useState } from "react";
// // import {
// //   ArrowRight,
// //   Quote,
// //   Trophy,
// //   Newspaper,
// //   UserRound,
// //   FileText,
// // } from "lucide-react";

// // const API_BASE = "http://localhost:5000";

// // const WELCOME_API = `${API_BASE}/api/home-welcome`;
// // const NEWS_API = `${API_BASE}/api/news-notices`;
// // const ACHIEVEMENTS_API = `${API_BASE}/api/achievements`;

// // // =========================================================
// // // API URL HELPER
// // // =========================================================

// // function getApiUrl(path) {
// //   if (!path) return "";

// //   if (
// //     path.startsWith("http://") ||
// //     path.startsWith("https://")
// //   ) {
// //     return path;
// //   }

// //   return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
// // }

// // // =========================================================
// // // NEWS / NOTICE ITEM
// // // =========================================================

// // function NewsNoticeItem({ item }) {
// //   const date = item.publish_date
// //     ? new Date(item.publish_date)
// //     : null;

// //   const day = date
// //     ? date.toLocaleDateString("en-IN", {
// //         day: "2-digit",
// //       })
// //     : "";

// //   const month = date
// //     ? date
// //         .toLocaleDateString("en-IN", {
// //           month: "short",
// //         })
// //         .toUpperCase()
// //     : "";

// //   const isNotice =
// //     item.category?.toLowerCase() === "notice";

// //   return (
// //     <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">
// //       {/* DATE */}
// //       <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
// //         <span className="text-sm font-bold leading-none">
// //           {day}
// //         </span>

// //         <span className="mt-1 text-[8px] font-bold tracking-wider text-blue-500">
// //           {month}
// //         </span>
// //       </div>

// //       {/* ICON */}
// //       <div
// //         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
// //           isNotice
// //             ? "bg-blue-50 text-[#0f3262]"
// //             : "bg-amber-50 text-amber-600"
// //         }`}
// //       >
// //         <Newspaper size={14} />
// //       </div>

// //       {/* DETAILS */}
// //       <div className="min-w-0 flex-1">
// //         {item.category && (
// //           <p
// //             className={`text-[8px] font-bold uppercase tracking-wider ${
// //               isNotice
// //                 ? "text-blue-600"
// //                 : "text-amber-600"
// //             }`}
// //           >
// //             {item.category}
// //           </p>
// //         )}

// //         <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-800">
// //           {item.title}
// //         </h4>

// //         {item.description && (
// //           <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-slate-500">
// //             {item.description}
// //           </p>
// //         )}

// //         {item.link && (
// //           <a
// //             href={getApiUrl(item.link)}
// //             className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#0f3262] px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#071f3d]"
// //           >
// //             Read More
// //             <ArrowRight size={10} />
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // =========================================================
// // // MAIN COMPONENT
// // // =========================================================

// // function PrincipalWelcome() {
// //   const [data, setData] = useState(null);

// //   const [newsNotices, setNewsNotices] = useState([]);
// //   const [achievements, setAchievements] = useState([]);

// //   const [loading, setLoading] = useState(true);
// //   const [newsLoading, setNewsLoading] = useState(true);
// //   const [achievementLoading, setAchievementLoading] =
// //     useState(true);

// //   // =========================================================
// //   // FETCH WELCOME + PRINCIPAL
// //   // =========================================================

// //   useEffect(() => {
// //     const fetchWelcome = async () => {
// //       try {
// //         const response = await fetch(
// //           `${WELCOME_API}?_=${Date.now()}`,
// //           {
// //             method: "GET",
// //             cache: "no-store",
// //             headers: {
// //               Accept: "application/json",
// //             },
// //           }
// //         );

// //         if (!response.ok) {
// //           throw new Error(
// //             `Home welcome request failed: ${response.status}`
// //           );
// //         }

// //         const result = await response.json();

// //         console.log(
// //           "HOME WELCOME API RESPONSE:",
// //           result
// //         );

// //         if (result.success && result.data) {
// //           setData(result.data);
// //         } else {
// //           setData(null);
// //         }
// //       } catch (error) {
// //         console.error(
// //           "Home welcome API error:",
// //           error
// //         );

// //         setData(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchWelcome();
// //   }, []);

// //   // =========================================================
// //   // FETCH NEWS
// //   // =========================================================

// //   useEffect(() => {
// //     const fetchNews = async () => {
// //       try {
// //         const response = await fetch(
// //           `${NEWS_API}?_=${Date.now()}`,
// //           {
// //             method: "GET",
// //             cache: "no-store",
// //             headers: {
// //               Accept: "application/json",
// //             },
// //           }
// //         );

// //         if (!response.ok) {
// //           throw new Error(
// //             `News request failed: ${response.status}`
// //           );
// //         }

// //         const result = await response.json();

// //         console.log(
// //           "NEWS & NOTICES HOMEPAGE API:",
// //           result
// //         );

// //         if (
// //           result.success &&
// //           Array.isArray(result.data)
// //         ) {
// //           setNewsNotices(result.data);
// //         } else {
// //           setNewsNotices([]);
// //         }
// //       } catch (error) {
// //         console.error(
// //           "News & Notices API error:",
// //           error
// //         );

// //         setNewsNotices([]);
// //       } finally {
// //         setNewsLoading(false);
// //       }
// //     };

// //     fetchNews();
// //   }, []);

// //   // =========================================================
// //   // FETCH ACHIEVEMENTS
// //   // =========================================================

// //   useEffect(() => {
// //     const fetchAchievements = async () => {
// //       try {
// //         const response = await fetch(
// //           `${ACHIEVEMENTS_API}?_=${Date.now()}`,
// //           {
// //             method: "GET",
// //             cache: "no-store",
// //             headers: {
// //               Accept: "application/json",
// //             },
// //           }
// //         );

// //         if (!response.ok) {
// //           throw new Error(
// //             `Achievements request failed: ${response.status}`
// //           );
// //         }

// //         const result = await response.json();

// //         console.log(
// //           "ACHIEVEMENTS HOMEPAGE API:",
// //           result
// //         );

// //         if (
// //           result.success &&
// //           Array.isArray(result.data)
// //         ) {
// //           setAchievements(result.data);
// //         } else {
// //           setAchievements([]);
// //         }
// //       } catch (error) {
// //         console.error(
// //           "Achievements API error:",
// //           error
// //         );

// //         setAchievements([]);
// //       } finally {
// //         setAchievementLoading(false);
// //       }
// //     };

// //     fetchAchievements();
// //   }, []);

// //   // =========================================================
// //   // LOADING
// //   // =========================================================

// //   if (loading) {
// //     return (
// //       <section className="py-8">
// //         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //           <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
// //             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

// //             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   // =========================================================
// //   // NO DATA
// //   // =========================================================

// //   if (!data) {
// //     return null;
// //   }

// //   // =========================================================
// //   // DATA
// //   // =========================================================

// //   const principalImage = getApiUrl(
// //     data.principal_photo
// //   );

// //   const principalProfilePdf = getApiUrl(
// //     data.principal_profile_pdf
// //   );

// //   const profileButtonText =
// //     data.principal_profile_button_text?.trim() ||
// //     "View Principal Profile";

// //   // =========================================================
// //   // UI
// //   // =========================================================

// //   return (
// //     <>
// //       {/* =====================================================
// //           NEWS SCROLL
// //       ====================================================== */}

// //       <style>{`
// //         .principal-news-scroll {
// //           height: 315px;
// //           overflow: hidden;
// //           position: relative;
// //         }

// //         .principal-news-track {
// //           display: flex;
// //           flex-direction: column;
// //           animation: principalNewsScroll 24s linear infinite;
// //           will-change: transform;
// //         }

// //         .principal-news-scroll:hover
// //         .principal-news-track {
// //           animation-play-state: paused;
// //         }

// //         @keyframes principalNewsScroll {
// //           0% {
// //             transform: translateY(0);
// //           }

// //           100% {
// //             transform: translateY(-50%);
// //           }
// //         }

// //         @media (prefers-reduced-motion: reduce) {
// //           .principal-news-track {
// //             animation: none;
// //           }
// //         }
// //       `}</style>

// //       <section className="py-7 sm:py-8">
// //         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// //           <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

// //             {/* =================================================
// //                 LEFT COLUMN
// //             ================================================= */}

// //             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

// //               {/* HEADER */}

// //               <div className="border-b border-slate-200 px-6 py-5">

// //                 {/* <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
// //                   Welcome
// //                 </p> */}

// //                 <h2 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
// //                   {data.welcome_title}
// //                 </h2>

// //               </div>

// //               {/* CONTENT */}

// //               <div className="px-6 py-6">

// //                 {/* =================================================
// //                     PRINCIPAL
// //                 ================================================= */}

// //                 <div className="flex gap-5 sm:gap-6">

// //                   {/* PHOTO */}

// //                   <div className="shrink-0">

// //                     {principalImage ? (
// //                       <img
// //                         src={principalImage}
// //                         alt={
// //                           data.principal_name ||
// //                           "Principal"
// //                         }
// //                         className="h-45 w-35 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-40 sm:w-32"
// //                         onError={(event) => {
// //                           event.currentTarget.style.display =
// //                             "none";
// //                         }}
// //                       />
// //                     ) : (
// //                       <div className="flex h-45 w-35 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-40 sm:w-32">
// //                         Principal
// //                       </div>
// //                     )}

// //                   </div>

// //                   {/* MESSAGE */}

// //                   <div className="min-w-0 flex-1">

// //                     <div className="flex items-center gap-2">

// //                       <Quote
// //                         size={18}
// //                         className="shrink-0 text-blue-600"
// //                       />

// //                       <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
// //                         Principal's Message
// //                       </p>

// //                     </div>

// //                     {data.principal_name && (
// //                       <h3 className="mt-2 text-lg font-bold text-slate-900">
// //                         {data.principal_name}
// //                       </h3>
// //                     )}

// //                     {data.principal_designation && (
// //                       <p className="mt-0.5 text-xs font-medium text-blue-600">
// //                         {data.principal_designation}
// //                       </p>
// //                     )}

// //                     {/* PRINCIPAL MESSAGE */}

// //                     {data.principal_message ? (
// //                       <div className="mt-3 text-sm leading-6 text-slate-600">
// //                         {data.principal_message
// //                           .split(/\n+/)
// //                           .filter(Boolean)
// //                           .map(
// //                             (paragraph, index) => (
// //                               <p
// //                                 key={index}
// //                                 className="mb-3 last:mb-0"
// //                               >
// //                                 {paragraph}
// //                               </p>
// //                             )
// //                           )}
// //                       </div>
// //                     ) : (
// //                       <p className="mt-3 text-sm leading-6 text-slate-400">
// //                         Principal's message will appear here.
// //                       </p>
// //                     )}


// //      {/* =================================================
// //                     PRINCIPAL PROFILE BUTTON
// //                 ================================================= */}

// //                 <div className="mt-5">

// //                   {principalProfilePdf ? (
// //                     <a
// //                       href={principalProfilePdf}
// //                       target="_blank"
// //                       rel="noopener noreferrer"
// //                       className="
// //                         inline-flex
// //                         items-center
// //                         gap-2
// //                         rounded-lg
// //                         bg-amber-500
// //                         px-5
// //                         py-2.5
// //                         text-xs
// //                         font-semibold
// //                         text-white
// //                         shadow-sm
// //                         transition-all
// //                         duration-200
// //                         hover:bg-[#071f3d]
// //                         hover:shadow-md
// //                       "
// //                     >
// //                       <FileText size={14} />

// //                       {profileButtonText}

// //                       <ArrowRight size={14} />
// //                     </a>
// //                   ) : (
// //                     <span
// //                       className="
// //                         inline-flex
// //                         cursor-not-allowed
// //                         items-center
// //                         gap-2
// //                         rounded-lg
// //                         bg-slate-300
// //                         px-5
// //                         py-2.5
// //                         text-xs
// //                         font-semibold
// //                         text-slate-600
// //                       "
// //                     >
// //                       <FileText size={14} />

// //                       {profileButtonText}

// //                       <ArrowRight size={14} />
// //                     </span>
// //                   )}

// //                 </div>
// //                   </div>

// //                 </div>

           

// //                 {/* =================================================
// //                     THREE CARDS
// //                 ================================================= */}

// //                 <div className="mt-7 grid gap-4 sm:grid-cols-3">

// //                   {/* CARD 1 */}

// //                   <a
// //                     href={
// //                       data.card_one_link ||
// //                       "/news-notices"
// //                     }
// //                     className="
// //                       group
// //                       rounded-xl
// //                       border
// //                       border-slate-200
// //                       bg-slate-50
// //                       p-4
// //                       transition-all
// //                       duration-200
// //                       hover:-translate-y-1
// //                       hover:border-blue-200
// //                       hover:bg-blue-50
// //                     "
// //                   >
// //                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0f3262]">
// //                       <Newspaper size={17} />
// //                     </div>

// //                     <h4 className="mt-3 text-sm font-bold text-slate-800">
// //                       {data.card_one_title ||
// //                         "News & Notices"}
// //                     </h4>

// //                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
// //                       {data.card_one_description ||
// //                         "Latest college announcements and updates."}
// //                     </p>

// //                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600">
// //                       View Updates
// //                       <ArrowRight size={11} />
// //                     </span>
// //                   </a>

// //                   {/* CARD 2 */}

// //                   <a
// //                     href={
// //                       data.card_two_link ||
// //                       "/achievements"
// //                     }
// //                     className="
// //                       group
// //                       rounded-xl
// //                       border
// //                       border-slate-200
// //                       bg-slate-50
// //                       p-4
// //                       transition-all
// //                       duration-200
// //                       hover:-translate-y-1
// //                       hover:border-amber-200
// //                       hover:bg-amber-50
// //                     "
// //                   >
// //                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
// //                       <Trophy size={17} />
// //                     </div>

// //                     <h4 className="mt-3 text-sm font-bold text-slate-800">
// //                       {data.card_two_title ||
// //                         "Achievements"}
// //                     </h4>

// //                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
// //                       {data.card_two_description ||
// //                         "Celebrating the achievements of our college community."}
// //                     </p>

// //                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
// //                       View Achievements
// //                       <ArrowRight size={11} />
// //                     </span>
// //                   </a>

// //                   {/* CARD 3 */}

// //                   <a
// //                     href={
// //                       principalProfilePdf ||
// //                       "#"
// //                     }
// //                     target={
// //                       principalProfilePdf
// //                         ? "_blank"
// //                         : undefined
// //                     }
// //                     rel={
// //                       principalProfilePdf
// //                         ? "noopener noreferrer"
// //                         : undefined
// //                     }
// //                     onClick={(event) => {
// //                       if (!principalProfilePdf) {
// //                         event.preventDefault();
// //                       }
// //                     }}
// //                     className={`
// //                       group
// //                       rounded-xl
// //                       border
// //                       border-slate-200
// //                       bg-slate-50
// //                       p-4
// //                       transition-all
// //                       duration-200
// //                       ${
// //                         principalProfilePdf
// //                           ? "hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
// //                           : "cursor-not-allowed opacity-70"
// //                       }
// //                     `}
// //                   >
// //                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
// //                       <UserRound size={17} />
// //                     </div>

// //                     <h4 className="mt-3 text-sm font-bold text-slate-800">
// //                       {data.card_three_title ||
// //                         "Principal's Profile"}
// //                     </h4>

// //                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
// //                       {data.card_three_description ||
// //                         "View the Principal's profile and professional details."}
// //                     </p>

// //                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
// //                       View Profile
// //                       <ArrowRight size={11} />
// //                     </span>
// //                   </a>

// //                 </div>

// //               </div>

// //             </div>

// //             {/* =================================================
// //                 RIGHT COLUMN
// //             ================================================= */}

// //             <div className="space-y-5">

// //               {/* =================================================
// //                   NEWS & NOTICES
// //               ================================================= */}

// //               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

// //                 <div className="flex items-center justify-between bg-[#0f3262] px-4 py-3 text-white">

// //                   <div className="flex items-center gap-2.5">

// //                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
// //                       <Newspaper size={17} />
// //                     </div>

// //                     <div>

// //                       <h3 className="text-sm font-bold">
// //                         News & Notices
// //                       </h3>

// //                       <p className="text-[10px] text-blue-200">
// //                         Latest college updates
// //                       </p>

// //                     </div>

// //                   </div>

// //                   <a
// //                     href="/news-notices"
// //                     className="
// //                       rounded-md
// //                       bg-white/10
// //                       px-2.5
// //                       py-1.5
// //                       text-[10px]
// //                       font-semibold
// //                       text-white
// //                       transition
// //                       hover:bg-white/20
// //                     "
// //                   >
// //                     View All
// //                   </a>

// //                 </div>

// //                 <div className="principal-news-scroll">

// //                   {newsLoading ? (
// //                     <div className="space-y-3 p-4">

// //                       {[1, 2, 3, 4].map(
// //                         (item) => (
// //                           <div
// //                             key={item}
// //                             className="h-14 animate-pulse rounded-lg bg-slate-100"
// //                           />
// //                         )
// //                       )}

// //                     </div>
// //                   ) : newsNotices.length === 0 ? (
// //                     <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
// //                       No news or notices available.
// //                     </div>
// //                   ) : (
// //                     <div className="principal-news-track px-4">

// //                       {newsNotices.map(
// //                         (item, index) => (
// //                           <NewsNoticeItem
// //                             key={`first-${
// //                               item.id ?? index
// //                             }`}
// //                             item={item}
// //                           />
// //                         )
// //                       )}

// //                       {newsNotices.map(
// //                         (item, index) => (
// //                           <NewsNoticeItem
// //                             key={`second-${
// //                               item.id ?? index
// //                             }`}
// //                             item={item}
// //                           />
// //                         )
// //                       )}

// //                     </div>
// //                   )}

// //                 </div>

// //               </div>

// //               {/* =================================================
// //                   ACHIEVEMENTS
// //               ================================================= */}

// //               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

// //                 <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">

// //                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
// //                     <Trophy
// //                       size={17}
// //                       className="text-amber-600"
// //                     />
// //                   </div>

// //                   <div>

// //                     <h3 className="text-xl font-bold text-slate-800">
// //                       Achievements
// //                     </h3>

// //                     <p className="text-[10px] text-slate-500">
// //                       Celebrating excellence
// //                     </p>

// //                   </div>

// //                 </div>

// //                 <div>

// //                   {achievementLoading ? (
// //                     <div className="space-y-3 p-4">

// //                       {[1, 2, 3].map(
// //                         (item) => (
// //                           <div
// //                             key={item}
// //                             className="h-14 animate-pulse rounded-lg bg-slate-100"
// //                           />
// //                         )
// //                       )}

// //                     </div>
// //                   ) : achievements.length === 0 ? (
// //                     <div className="px-4 py-8 text-center text-sm text-slate-400">
// //                       No achievements available.
// //                     </div>
// //                   ) : (
// //                     achievements.map(
// //                       (achievement) => (
// //                         <div
// //                           key={achievement.id}
// //                           className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
// //                         >

// //                           <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50">
// //                             <Trophy
// //                               size={11}
// //                               className="text-amber-600"
// //                             />
// //                           </div>

// //                           <div className="min-w-0 flex-1">

// //                             {/* TYPE */}
// //                             {achievement.achievement_type && (
// //                               <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">
// //                                 {achievement.achievement_type}
// //                               </p>
// //                             )}

// //                             {/* TITLE */}
// //                             <h4 className="mt-0.5 text-xs font-bold text-slate-800">
// //                               {achievement.title}
// //                             </h4>

// //                             {/* DESCRIPTION */}
// //                             {achievement.description && (
// //                               <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
// //                                 {achievement.description}
// //                               </p>
// //                             )}

// //                           </div>

// //                         </div>
// //                       )
// //                     )
// //                   )}

// //                 </div>

// //               </div>

// //             </div>

// //           </div>

// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// // export default PrincipalWelcome;



// import { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   Quote,
//   Trophy,
//   Newspaper,
//   UserRound,
//   FileText,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000";

// const WELCOME_API = `${API_BASE}/api/home-welcome`;
// const NEWS_API = `${API_BASE}/api/news-notices`;
// const ACHIEVEMENTS_API = `${API_BASE}/api/achievements`;

// // =========================================================
// // API URL HELPER
// // =========================================================

// function getApiUrl(path) {
//   if (!path) return "";

//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return path;
//   }

//   return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
// }

// // =========================================================
// // NEWS / NOTICE ITEM
// // =========================================================

// function NewsNoticeItem({ item }) {
//   const date = item?.publish_date
//     ? new Date(item.publish_date)
//     : null;

//   const day =
//     date && !Number.isNaN(date.getTime())
//       ? date.toLocaleDateString("en-IN", {
//           day: "2-digit",
//         })
//       : "";

//   const month =
//     date && !Number.isNaN(date.getTime())
//       ? date
//           .toLocaleDateString("en-IN", {
//             month: "short",
//           })
//           .toUpperCase()
//       : "";

//   const isNotice =
//     item?.category?.toLowerCase() === "notice";

//   return (
//     <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">

//       {/* DATE */}

//       <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
//         <span className="text-sm font-bold leading-none">
//           {day}
//         </span>

//         <span className="mt-1 text-[8px] font-bold tracking-wider text-blue-500">
//           {month}
//         </span>
//       </div>

//       {/* ICON */}

//       <div
//         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
//           isNotice
//             ? "bg-blue-50 text-[#0f3262]"
//             : "bg-amber-50 text-amber-600"
//         }`}
//       >
//         <Newspaper size={14} />
//       </div>

//       {/* DETAILS */}

//       <div className="min-w-0 flex-1">

//         {item?.category && (
//           <p
//             className={`text-[8px] font-bold uppercase tracking-wider ${
//               isNotice
//                 ? "text-blue-600"
//                 : "text-amber-600"
//             }`}
//           >
//             {item.category}
//           </p>
//         )}

//         <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-800">
//           {item?.title || "Untitled Notice"}
//         </h4>

//         {item?.description && (
//           <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-slate-500">
//             {item.description}
//           </p>
//         )}

//         {/* {item?.link && (
//           // <a
//           //   href={getApiUrl(item.link)}
//           //   className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#0f3262] px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#071f3d]"
//           // >
//           //   Read More
//           //   <ArrowRight size={10} />
//           // </a>
//         )} */}

//       </div>
//     </div>
//   );
// }

// // =========================================================
// // MAIN COMPONENT
// // =========================================================

// function PrincipalWelcome() {
//   const [data, setData] = useState(null);

//   const [newsNotices, setNewsNotices] = useState([]);
//   const [achievements, setAchievements] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [newsLoading, setNewsLoading] = useState(true);
//   const [achievementLoading, setAchievementLoading] =
//     useState(true);

//   // =========================================================
//   // FETCH WELCOME + PRINCIPAL
//   // =========================================================

//   useEffect(() => {
//     const fetchWelcome = async () => {
//       try {
//         const response = await fetch(
//           `${WELCOME_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Home welcome request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "HOME WELCOME API RESPONSE:",
//           result
//         );

//         if (result.success && result.data) {
//           setData(result.data);
//         } else {
//           setData(null);
//         }
//       } catch (error) {
//         console.error(
//           "Home welcome API error:",
//           error
//         );

//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWelcome();
//   }, []);

//   // =========================================================
//   // FETCH NEWS
//   // =========================================================

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         setNewsLoading(true);

//         const response = await fetch(
//           `${NEWS_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `News request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "NEWS & NOTICES HOMEPAGE API:",
//           result
//         );

//         // =====================================================
//         // IMPORTANT:
//         // /api/news-notices RETURNS A DIRECT ARRAY
//         //
//         // [
//         //   {...},
//         //   {...}
//         // ]
//         // =====================================================

//         if (Array.isArray(result)) {
//           const sortedNews = [...result].sort(
//             (a, b) => {
//               const dateA = a?.publish_date
//                 ? new Date(
//                     a.publish_date
//                   ).getTime()
//                 : 0;

//               const dateB = b?.publish_date
//                 ? new Date(
//                     b.publish_date
//                   ).getTime()
//                 : 0;

//               return dateB - dateA;
//             }
//           );

//           setNewsNotices(sortedNews);
//         } else if (
//           result?.success &&
//           Array.isArray(result.data)
//         ) {
//           // Also support wrapped response
//           setNewsNotices(result.data);
//         } else {
//           setNewsNotices([]);
//         }
//       } catch (error) {
//         console.error(
//           "News & Notices API error:",
//           error
//         );

//         setNewsNotices([]);
//       } finally {
//         setNewsLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   // =========================================================
//   // FETCH ACHIEVEMENTS
//   // =========================================================

//   useEffect(() => {
//     const fetchAchievements = async () => {
//       try {
//         const response = await fetch(
//           `${ACHIEVEMENTS_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Achievements request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "ACHIEVEMENTS HOMEPAGE API:",
//           result
//         );

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setAchievements(result.data);
//         } else if (Array.isArray(result)) {
//           setAchievements(result);
//         } else {
//           setAchievements([]);
//         }
//       } catch (error) {
//         console.error(
//           "Achievements API error:",
//           error
//         );

//         setAchievements([]);
//       } finally {
//         setAchievementLoading(false);
//       }
//     };

//     fetchAchievements();
//   }, []);

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <section className="py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//           <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

//             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

//             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

//           </div>
//         </div>
//       </section>
//     );
//   }

//   // =========================================================
//   // NO WELCOME DATA
//   // =========================================================

//   if (!data) {
//     return null;
//   }

//   // =========================================================
//   // DATA
//   // =========================================================

//   const principalImage = getApiUrl(
//     data.principal_photo
//   );

//   const principalProfilePdf = getApiUrl(
//     data.principal_profile_pdf
//   );

//   const profileButtonText =
//     data.principal_profile_button_text?.trim() ||
//     "View Principal Profile";

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <>
//       {/* =====================================================
//           NEWS SCROLL STYLE
//       ====================================================== */}

//       <style>{`
//         .principal-news-scroll {
//           height: 315px;
//           overflow: hidden;
//           position: relative;
//         }

//         .principal-news-track {
//           display: flex;
//           flex-direction: column;
//           animation: principalNewsScroll 24s linear infinite;
//           will-change: transform;
//         }

//         .principal-news-scroll:hover
//         .principal-news-track {
//           animation-play-state: paused;
//         }

//         @keyframes principalNewsScroll {
//           0% {
//             transform: translateY(0);
//           }

//           100% {
//             transform: translateY(-50%);
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .principal-news-track {
//             animation: none;
//           }
//         }
//       `}</style>

//       <section className="py-7 sm:py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//           <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

//             {/* =================================================
//                 LEFT COLUMN
//             ================================================= */}

//             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//               {/* HEADER */}

//               <div className="border-b border-slate-200 px-6 py-5">

//                 <h2 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
//                   {data.welcome_title}
//                 </h2>

//               </div>

//               {/* CONTENT */}

//               <div className="px-6 py-6">

//                 {/* PRINCIPAL */}

//                 <div className="flex gap-5 sm:gap-6">

//                   {/* PHOTO */}

//                   <div className="shrink-0">

//                     {principalImage ? (
//                       <img
//                         src={principalImage}
//                         alt={
//                           data.principal_name ||
//                           "Principal"
//                         }
//                         className="h-45 w-35 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-40 sm:w-32"
//                         onError={(event) => {
//                           event.currentTarget.style.display =
//                             "none";
//                         }}
//                       />
//                     ) : (
//                       <div className="flex h-45 w-35 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-40 sm:w-32">
//                         Principal
//                       </div>
//                     )}

//                   </div>

//                   {/* MESSAGE */}

//                   <div className="min-w-0 flex-1">

//                     <div className="flex items-center gap-2">

//                       <Quote
//                         size={18}
//                         className="shrink-0 text-blue-600"
//                       />

//                       <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                         Principal's Message
//                       </p>

//                     </div>

//                     {data.principal_name && (
//                       <h3 className="mt-2 text-lg font-bold text-slate-900">
//                         {data.principal_name}
//                       </h3>
//                     )}

//                     {data.principal_designation && (
//                       <p className="mt-0.5 text-xs font-medium text-blue-600">
//                         {data.principal_designation}
//                       </p>
//                     )}

//                     {data.principal_message ? (
//                       <div className="mt-3 text-sm leading-6 text-slate-600">
//                         {data.principal_message
//                           .split(/\n+/)
//                           .filter(Boolean)
//                           .map(
//                             (paragraph, index) => (
//                               <p
//                                 key={index}
//                                 className="mb-3 last:mb-0"
//                               >
//                                 {paragraph}
//                               </p>
//                             )
//                           )}
//                       </div>
//                     ) : (
//                       <p className="mt-3 text-sm leading-6 text-slate-400">
//                         Principal's message will appear here.
//                       </p>
//                     )}

//                     {/* PRINCIPAL PROFILE BUTTON */}

//                     <div className="mt-5">

//                       {principalProfilePdf ? (
//                         <a
//                           href={principalProfilePdf}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             rounded-lg
//                             bg-amber-500
//                             px-5
//                             py-2.5
//                             text-xs
//                             font-semibold
//                             text-white
//                             shadow-sm
//                             transition-all
//                             duration-200
//                             hover:bg-[#071f3d]
//                             hover:shadow-md
//                           "
//                         >
//                           <FileText size={14} />

//                           {profileButtonText}

//                           <ArrowRight size={14} />
//                         </a>
//                       ) : (
//                         <span
//                           className="
//                             inline-flex
//                             cursor-not-allowed
//                             items-center
//                             gap-2
//                             rounded-lg
//                             bg-slate-300
//                             px-5
//                             py-2.5
//                             text-xs
//                             font-semibold
//                             text-slate-600
//                           "
//                         >
//                           <FileText size={14} />

//                           {profileButtonText}

//                           <ArrowRight size={14} />
//                         </span>
//                       )}

//                     </div>

//                   </div>
//                 </div>

//                 {/* =================================================
//                     THREE CARDS
//                 ================================================= */}

//                 <div className="mt-7 grid gap-4 sm:grid-cols-3">

//                   {/* CARD 1 */}

//                   <a
//                     href={
//                       data.card_one_link ||
//                       "/news-notices"
//                     }
//                     className="
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       hover:-translate-y-1
//                       hover:border-blue-200
//                       hover:bg-blue-50
//                     "
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0f3262]">
//                       <Newspaper size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_one_title ||
//                         "News & Notices"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_one_description ||
//                         "Latest college announcements and updates."}
//                     </p>
// {/* 
//                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600">
//                       View Updates
//                       <ArrowRight size={11} />
//                     </span> */}
//                   </a>

//                   {/* CARD 2 */}

//                   <a
//                     href={
//                       data.card_two_link ||
//                       "/achievements"
//                     }
//                     className="
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       hover:-translate-y-1
//                       hover:border-amber-200
//                       hover:bg-amber-50
//                     "
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
//                       <Trophy size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_two_title ||
//                         "Achievements"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_two_description ||
//                         "Celebrating the achievements of our college community."}
//                     </p>

//                     {/* <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
//                       View Achievements
//                       <ArrowRight size={11} />
//                     </span> */}
//                   </a>

//                   {/* CARD 3 */}

//                   <a
//                     href={
//                       principalProfilePdf ||
//                       "#"
//                     }
//                     target={
//                       principalProfilePdf
//                         ? "_blank"
//                         : undefined
//                     }
//                     rel={
//                       principalProfilePdf
//                         ? "noopener noreferrer"
//                         : undefined
//                     }
//                     onClick={(event) => {
//                       if (!principalProfilePdf) {
//                         event.preventDefault();
//                       }
//                     }}
//                     className={`
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       ${
//                         principalProfilePdf
//                           ? "hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
//                           : "cursor-not-allowed opacity-70"
//                       }
//                     `}
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
//                       <UserRound size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_three_title ||
//                         "Principal's Profile"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_three_description ||
//                         "View the Principal's profile and professional details."}
//                     </p>

//                     {/* <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
//                       View Profile
//                       <ArrowRight size={11} />
//                     </span> */}
//                   </a>

//                 </div>
//               </div>
//             </div>

//             {/* =================================================
//                 RIGHT COLUMN
//             ================================================= */}

//             <div className="space-y-5">

//               {/* =================================================
//                   NEWS & NOTICES
//               ================================================= */}

//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//                 <div className="flex items-center justify-between bg-[#0f3262] px-4 py-3 text-white">

//                   <div className="flex items-center gap-2.5">

//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
//                       <Newspaper size={17} />
//                     </div>

//                     <div>
//                       <h3 className="text-sm font-bold">
//                         News & Notices
//                       </h3>

//                       <p className="text-[10px] text-blue-200">
//                         Latest college updates
//                       </p>
//                     </div>

//                   </div>

//                   {/* <a
//                     href="/news-notices"
//                     className="
//                       rounded-md
//                       bg-white/10
//                       px-2.5
//                       py-1.5
//                       text-[10px]
//                       font-semibold
//                       text-white
//                       transition
//                       hover:bg-white/20
//                     "
//                   >
//                     View All
//                   </a> */}

//                 </div>

//                 <div className="principal-news-scroll">

//                   {/* LOADING */}

//                   {newsLoading ? (
//                     <div className="space-y-3 p-4">

//                       {[1, 2, 3, 4].map(
//                         (item) => (
//                           <div
//                             key={item}
//                             className="h-14 animate-pulse rounded-lg bg-slate-100"
//                           />
//                         )
//                       )}

//                     </div>
//                   ) : newsNotices.length === 0 ? (
//                     <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
//                       No news or notices available.
//                     </div>
//                   ) : (
//                     <div className="principal-news-track px-4">

//                       {/* FIRST COPY */}

//                       {newsNotices.map(
//                         (item, index) => (
//                           <NewsNoticeItem
//                             key={`first-${item.id ?? index}`}
//                             item={item}
//                           />
//                         )
//                       )}

//                       {/* SECOND COPY FOR CONTINUOUS SCROLL */}

//                       {newsNotices.map(
//                         (item, index) => (
//                           <NewsNoticeItem
//                             key={`second-${item.id ?? index}`}
//                             item={item}
//                           />
//                         )
//                       )}

//                     </div>
//                   )}

//                 </div>
//               </div>

//               {/* =================================================
//                   ACHIEVEMENTS
//               ================================================= */}

//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//                 <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">

//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
//                     <Trophy
//                       size={17}
//                       className="text-amber-600"
//                     />
//                   </div>

//                   <div>
//                     <h3 className="text-xl font-bold text-slate-800">
//                       Achievements
//                     </h3>

//                     <p className="text-[10px] text-slate-500">
//                       Celebrating excellence
//                     </p>
//                   </div>

//                 </div>

//                 <div>

//                   {achievementLoading ? (
//                     <div className="space-y-3 p-4">

//                       {[1, 2, 3].map(
//                         (item) => (
//                           <div
//                             key={item}
//                             className="h-14 animate-pulse rounded-lg bg-slate-100"
//                           />
//                         )
//                       )}

//                     </div>
//                   ) : achievements.length === 0 ? (
//                     <div className="px-4 py-8 text-center text-sm text-slate-400">
//                       No achievements available.
//                     </div>
//                   ) : (
//                     achievements.map(
//                       (achievement) => (
//                         <div
//                           key={achievement.id}
//                           className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
//                         >

//                           <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50">
//                             <Trophy
//                               size={11}
//                               className="text-amber-600"
//                             />
//                           </div>

//                           <div className="min-w-0 flex-1">

//                             {achievement.achievement_type && (
//                               <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">
//                                 {achievement.achievement_type}
//                               </p>
//                             )}

//                             <h4 className="mt-0.5 text-xs font-bold text-slate-800">
//                               {achievement.title}
//                             </h4>

//                             {achievement.description && (
//                               <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
//                                 {achievement.description}
//                               </p>
//                             )}

//                           </div>

//                         </div>
//                       )
//                     )
//                   )}

//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default PrincipalWelcome;



// import { useEffect, useState } from "react";
// import {
//   ArrowRight,
//   Quote,
//   Trophy,
//   Newspaper,
//   UserRound,
//   FileText,
// } from "lucide-react";

// const API_BASE = "http://localhost:5000";

// const WELCOME_API = `${API_BASE}/api/home-welcome`;
// const NEWS_API = `${API_BASE}/api/news-notices`;
// const ACHIEVEMENTS_API = `${API_BASE}/api/achievements`;

// // =========================================================
// // API URL HELPER
// // =========================================================

// function getApiUrl(path) {
//   if (!path) return "";

//   if (
//     path.startsWith("http://") ||
//     path.startsWith("https://")
//   ) {
//     return path;
//   }

//   return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
// }

// // =========================================================
// // NEWS / NOTICE ITEM
// // =========================================================

// function NewsNoticeItem({ item }) {
//   const date = item.publish_date
//     ? new Date(item.publish_date)
//     : null;

//   const day = date
//     ? date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//       })
//     : "";

//   const month = date
//     ? date
//         .toLocaleDateString("en-IN", {
//           month: "short",
//         })
//         .toUpperCase()
//     : "";

//   const isNotice =
//     item.category?.toLowerCase() === "notice";

//   return (
//     <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">
//       {/* DATE */}
//       <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
//         <span className="text-sm font-bold leading-none">
//           {day}
//         </span>

//         <span className="mt-1 text-[8px] font-bold tracking-wider text-blue-500">
//           {month}
//         </span>
//       </div>

//       {/* ICON */}
//       <div
//         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
//           isNotice
//             ? "bg-blue-50 text-[#0f3262]"
//             : "bg-amber-50 text-amber-600"
//         }`}
//       >
//         <Newspaper size={14} />
//       </div>

//       {/* DETAILS */}
//       <div className="min-w-0 flex-1">
//         {item.category && (
//           <p
//             className={`text-[8px] font-bold uppercase tracking-wider ${
//               isNotice
//                 ? "text-blue-600"
//                 : "text-amber-600"
//             }`}
//           >
//             {item.category}
//           </p>
//         )}

//         <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-800">
//           {item.title}
//         </h4>

//         {item.description && (
//           <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-slate-500">
//             {item.description}
//           </p>
//         )}

//         {item.link && (
//           <a
//             href={getApiUrl(item.link)}
//             className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#0f3262] px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#071f3d]"
//           >
//             Read More
//             <ArrowRight size={10} />
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }

// // =========================================================
// // MAIN COMPONENT
// // =========================================================

// function PrincipalWelcome() {
//   const [data, setData] = useState(null);

//   const [newsNotices, setNewsNotices] = useState([]);
//   const [achievements, setAchievements] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [newsLoading, setNewsLoading] = useState(true);
//   const [achievementLoading, setAchievementLoading] =
//     useState(true);

//   // =========================================================
//   // FETCH WELCOME + PRINCIPAL
//   // =========================================================

//   useEffect(() => {
//     const fetchWelcome = async () => {
//       try {
//         const response = await fetch(
//           `${WELCOME_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Home welcome request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "HOME WELCOME API RESPONSE:",
//           result
//         );

//         if (result.success && result.data) {
//           setData(result.data);
//         } else {
//           setData(null);
//         }
//       } catch (error) {
//         console.error(
//           "Home welcome API error:",
//           error
//         );

//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWelcome();
//   }, []);

//   // =========================================================
//   // FETCH NEWS
//   // =========================================================

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await fetch(
//           `${NEWS_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `News request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "NEWS & NOTICES HOMEPAGE API:",
//           result
//         );

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setNewsNotices(result.data);
//         } else {
//           setNewsNotices([]);
//         }
//       } catch (error) {
//         console.error(
//           "News & Notices API error:",
//           error
//         );

//         setNewsNotices([]);
//       } finally {
//         setNewsLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   // =========================================================
//   // FETCH ACHIEVEMENTS
//   // =========================================================

//   useEffect(() => {
//     const fetchAchievements = async () => {
//       try {
//         const response = await fetch(
//           `${ACHIEVEMENTS_API}?_=${Date.now()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Achievements request failed: ${response.status}`
//           );
//         }

//         const result = await response.json();

//         console.log(
//           "ACHIEVEMENTS HOMEPAGE API:",
//           result
//         );

//         if (
//           result.success &&
//           Array.isArray(result.data)
//         ) {
//           setAchievements(result.data);
//         } else {
//           setAchievements([]);
//         }
//       } catch (error) {
//         console.error(
//           "Achievements API error:",
//           error
//         );

//         setAchievements([]);
//       } finally {
//         setAchievementLoading(false);
//       }
//     };

//     fetchAchievements();
//   }, []);

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <section className="py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
//             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

//             <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // =========================================================
//   // NO DATA
//   // =========================================================

//   if (!data) {
//     return null;
//   }

//   // =========================================================
//   // DATA
//   // =========================================================

//   const principalImage = getApiUrl(
//     data.principal_photo
//   );

//   const principalProfilePdf = getApiUrl(
//     data.principal_profile_pdf
//   );

//   const profileButtonText =
//     data.principal_profile_button_text?.trim() ||
//     "View Principal Profile";

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <>
//       {/* =====================================================
//           NEWS SCROLL
//       ====================================================== */}

//       <style>{`
//         .principal-news-scroll {
//           height: 315px;
//           overflow: hidden;
//           position: relative;
//         }

//         .principal-news-track {
//           display: flex;
//           flex-direction: column;
//           animation: principalNewsScroll 24s linear infinite;
//           will-change: transform;
//         }

//         .principal-news-scroll:hover
//         .principal-news-track {
//           animation-play-state: paused;
//         }

//         @keyframes principalNewsScroll {
//           0% {
//             transform: translateY(0);
//           }

//           100% {
//             transform: translateY(-50%);
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .principal-news-track {
//             animation: none;
//           }
//         }
//       `}</style>

//       <section className="py-7 sm:py-8">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//           <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

//             {/* =================================================
//                 LEFT COLUMN
//             ================================================= */}

//             <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//               {/* HEADER */}

//               <div className="border-b border-slate-200 px-6 py-5">

//                 {/* <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                   Welcome
//                 </p> */}

//                 <h2 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
//                   {data.welcome_title}
//                 </h2>

//               </div>

//               {/* CONTENT */}

//               <div className="px-6 py-6">

//                 {/* =================================================
//                     PRINCIPAL
//                 ================================================= */}

//                 <div className="flex gap-5 sm:gap-6">

//                   {/* PHOTO */}

//                   <div className="shrink-0">

//                     {principalImage ? (
//                       <img
//                         src={principalImage}
//                         alt={
//                           data.principal_name ||
//                           "Principal"
//                         }
//                         className="h-45 w-35 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-40 sm:w-32"
//                         onError={(event) => {
//                           event.currentTarget.style.display =
//                             "none";
//                         }}
//                       />
//                     ) : (
//                       <div className="flex h-45 w-35 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-40 sm:w-32">
//                         Principal
//                       </div>
//                     )}

//                   </div>

//                   {/* MESSAGE */}

//                   <div className="min-w-0 flex-1">

//                     <div className="flex items-center gap-2">

//                       <Quote
//                         size={18}
//                         className="shrink-0 text-blue-600"
//                       />

//                       <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                         Principal's Message
//                       </p>

//                     </div>

//                     {data.principal_name && (
//                       <h3 className="mt-2 text-lg font-bold text-slate-900">
//                         {data.principal_name}
//                       </h3>
//                     )}

//                     {data.principal_designation && (
//                       <p className="mt-0.5 text-xs font-medium text-blue-600">
//                         {data.principal_designation}
//                       </p>
//                     )}

//                     {/* PRINCIPAL MESSAGE */}

//                     {data.principal_message ? (
//                       <div className="mt-3 text-sm leading-6 text-slate-600">
//                         {data.principal_message
//                           .split(/\n+/)
//                           .filter(Boolean)
//                           .map(
//                             (paragraph, index) => (
//                               <p
//                                 key={index}
//                                 className="mb-3 last:mb-0"
//                               >
//                                 {paragraph}
//                               </p>
//                             )
//                           )}
//                       </div>
//                     ) : (
//                       <p className="mt-3 text-sm leading-6 text-slate-400">
//                         Principal's message will appear here.
//                       </p>
//                     )}


//      {/* =================================================
//                     PRINCIPAL PROFILE BUTTON
//                 ================================================= */}

//                 <div className="mt-5">

//                   {principalProfilePdf ? (
//                     <a
//                       href={principalProfilePdf}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="
//                         inline-flex
//                         items-center
//                         gap-2
//                         rounded-lg
//                         bg-amber-500
//                         px-5
//                         py-2.5
//                         text-xs
//                         font-semibold
//                         text-white
//                         shadow-sm
//                         transition-all
//                         duration-200
//                         hover:bg-[#071f3d]
//                         hover:shadow-md
//                       "
//                     >
//                       <FileText size={14} />

//                       {profileButtonText}

//                       <ArrowRight size={14} />
//                     </a>
//                   ) : (
//                     <span
//                       className="
//                         inline-flex
//                         cursor-not-allowed
//                         items-center
//                         gap-2
//                         rounded-lg
//                         bg-slate-300
//                         px-5
//                         py-2.5
//                         text-xs
//                         font-semibold
//                         text-slate-600
//                       "
//                     >
//                       <FileText size={14} />

//                       {profileButtonText}

//                       <ArrowRight size={14} />
//                     </span>
//                   )}

//                 </div>
//                   </div>

//                 </div>

           

//                 {/* =================================================
//                     THREE CARDS
//                 ================================================= */}

//                 <div className="mt-7 grid gap-4 sm:grid-cols-3">

//                   {/* CARD 1 */}

//                   <a
//                     href={
//                       data.card_one_link ||
//                       "/news-notices"
//                     }
//                     className="
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       hover:-translate-y-1
//                       hover:border-blue-200
//                       hover:bg-blue-50
//                     "
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0f3262]">
//                       <Newspaper size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_one_title ||
//                         "News & Notices"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_one_description ||
//                         "Latest college announcements and updates."}
//                     </p>

//                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600">
//                       View Updates
//                       <ArrowRight size={11} />
//                     </span>
//                   </a>

//                   {/* CARD 2 */}

//                   <a
//                     href={
//                       data.card_two_link ||
//                       "/achievements"
//                     }
//                     className="
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       hover:-translate-y-1
//                       hover:border-amber-200
//                       hover:bg-amber-50
//                     "
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
//                       <Trophy size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_two_title ||
//                         "Achievements"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_two_description ||
//                         "Celebrating the achievements of our college community."}
//                     </p>

//                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
//                       View Achievements
//                       <ArrowRight size={11} />
//                     </span>
//                   </a>

//                   {/* CARD 3 */}

//                   <a
//                     href={
//                       principalProfilePdf ||
//                       "#"
//                     }
//                     target={
//                       principalProfilePdf
//                         ? "_blank"
//                         : undefined
//                     }
//                     rel={
//                       principalProfilePdf
//                         ? "noopener noreferrer"
//                         : undefined
//                     }
//                     onClick={(event) => {
//                       if (!principalProfilePdf) {
//                         event.preventDefault();
//                       }
//                     }}
//                     className={`
//                       group
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-slate-50
//                       p-4
//                       transition-all
//                       duration-200
//                       ${
//                         principalProfilePdf
//                           ? "hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
//                           : "cursor-not-allowed opacity-70"
//                       }
//                     `}
//                   >
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
//                       <UserRound size={17} />
//                     </div>

//                     <h4 className="mt-3 text-sm font-bold text-slate-800">
//                       {data.card_three_title ||
//                         "Principal's Profile"}
//                     </h4>

//                     <p className="mt-1 text-[10px] leading-4 text-slate-500">
//                       {data.card_three_description ||
//                         "View the Principal's profile and professional details."}
//                     </p>

//                     <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
//                       View Profile
//                       <ArrowRight size={11} />
//                     </span>
//                   </a>

//                 </div>

//               </div>

//             </div>

//             {/* =================================================
//                 RIGHT COLUMN
//             ================================================= */}

//             <div className="space-y-5">

//               {/* =================================================
//                   NEWS & NOTICES
//               ================================================= */}

//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//                 <div className="flex items-center justify-between bg-[#0f3262] px-4 py-3 text-white">

//                   <div className="flex items-center gap-2.5">

//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
//                       <Newspaper size={17} />
//                     </div>

//                     <div>

//                       <h3 className="text-sm font-bold">
//                         News & Notices
//                       </h3>

//                       <p className="text-[10px] text-blue-200">
//                         Latest college updates
//                       </p>

//                     </div>

//                   </div>

//                   <a
//                     href="/news-notices"
//                     className="
//                       rounded-md
//                       bg-white/10
//                       px-2.5
//                       py-1.5
//                       text-[10px]
//                       font-semibold
//                       text-white
//                       transition
//                       hover:bg-white/20
//                     "
//                   >
//                     View All
//                   </a>

//                 </div>

//                 <div className="principal-news-scroll">

//                   {newsLoading ? (
//                     <div className="space-y-3 p-4">

//                       {[1, 2, 3, 4].map(
//                         (item) => (
//                           <div
//                             key={item}
//                             className="h-14 animate-pulse rounded-lg bg-slate-100"
//                           />
//                         )
//                       )}

//                     </div>
//                   ) : newsNotices.length === 0 ? (
//                     <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
//                       No news or notices available.
//                     </div>
//                   ) : (
//                     <div className="principal-news-track px-4">

//                       {newsNotices.map(
//                         (item, index) => (
//                           <NewsNoticeItem
//                             key={`first-${
//                               item.id ?? index
//                             }`}
//                             item={item}
//                           />
//                         )
//                       )}

//                       {newsNotices.map(
//                         (item, index) => (
//                           <NewsNoticeItem
//                             key={`second-${
//                               item.id ?? index
//                             }`}
//                             item={item}
//                           />
//                         )
//                       )}

//                     </div>
//                   )}

//                 </div>

//               </div>

//               {/* =================================================
//                   ACHIEVEMENTS
//               ================================================= */}

//               <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

//                 <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3">

//                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
//                     <Trophy
//                       size={17}
//                       className="text-amber-600"
//                     />
//                   </div>

//                   <div>

//                     <h3 className="text-xl font-bold text-slate-800">
//                       Achievements
//                     </h3>

//                     <p className="text-[10px] text-slate-500">
//                       Celebrating excellence
//                     </p>

//                   </div>

//                 </div>

//                 <div>

//                   {achievementLoading ? (
//                     <div className="space-y-3 p-4">

//                       {[1, 2, 3].map(
//                         (item) => (
//                           <div
//                             key={item}
//                             className="h-14 animate-pulse rounded-lg bg-slate-100"
//                           />
//                         )
//                       )}

//                     </div>
//                   ) : achievements.length === 0 ? (
//                     <div className="px-4 py-8 text-center text-sm text-slate-400">
//                       No achievements available.
//                     </div>
//                   ) : (
//                     achievements.map(
//                       (achievement) => (
//                         <div
//                           key={achievement.id}
//                           className="flex gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
//                         >

//                           <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50">
//                             <Trophy
//                               size={11}
//                               className="text-amber-600"
//                             />
//                           </div>

//                           <div className="min-w-0 flex-1">

//                             {/* TYPE */}
//                             {achievement.achievement_type && (
//                               <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">
//                                 {achievement.achievement_type}
//                               </p>
//                             )}

//                             {/* TITLE */}
//                             <h4 className="mt-0.5 text-xs font-bold text-slate-800">
//                               {achievement.title}
//                             </h4>

//                             {/* DESCRIPTION */}
//                             {achievement.description && (
//                               <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
//                                 {achievement.description}
//                               </p>
//                             )}

//                           </div>

//                         </div>
//                       )
//                     )
//                   )}

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       </section>
//     </>
//   );
// }

// export default PrincipalWelcome;



import { useEffect, useState } from "react";
import {
  ArrowRight,
  Quote,
  Trophy,
  Newspaper,
  UserRound,
  FileText,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const WELCOME_API = `${API_BASE}/api/home-welcome`;
const NEWS_API = `${API_BASE}/api/news-notices`;
const ACHIEVEMENTS_API = `${API_BASE}/api/achievements`;

// =========================================================
// API URL HELPER
// =========================================================

function getApiUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// =========================================================
// NEWS / NOTICE ITEM
// =========================================================

function NewsNoticeItem({ item }) {
  const date = item?.publish_date
    ? new Date(item.publish_date)
    : null;

  const day =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-IN", {
          day: "2-digit",
        })
      : "";

  const month =
    date && !Number.isNaN(date.getTime())
      ? date
          .toLocaleDateString("en-IN", {
            month: "short",
          })
          .toUpperCase()
      : "";

  const isNotice =
    item?.category?.toLowerCase() === "notice";

  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 last:border-b-0">

      {/* DATE */}

      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-[#0f3262]">
        <span className="text-sm font-bold leading-none">
          {day}
        </span>

        <span className="mt-1 text-[8px] font-bold tracking-wider text-blue-500">
          {month}
        </span>
      </div>

      {/* ICON */}

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isNotice
            ? "bg-blue-50 text-[#0f3262]"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        <Newspaper size={14} />
      </div>

      {/* DETAILS */}

      <div className="min-w-0 flex-1">

        {item?.category && (
          <p
            className={`text-[8px] font-bold uppercase tracking-wider ${
              isNotice
                ? "text-blue-600"
                : "text-amber-600"
            }`}
          >
            {item.category}
          </p>
        )}

        <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-800">
          {item?.title || "Untitled Notice"}
        </h4>

        {item?.description && (
          <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-slate-500">
            {item.description}
          </p>
        )}

        {/* {item?.link && (
          // <a
          //   href={getApiUrl(item.link)}
          //   className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#0f3262] px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#071f3d]"
          // >
          //   Read More
          //   <ArrowRight size={10} />
          // </a>
        )} */}

      </div>
    </div>
  );
}


// =========================================================
// ACHIEVEMENT ITEM
// =========================================================

function AchievementItem({ achievement }) {
  return (
    <div className="border-b border-slate-100 px-1 py-3 last:border-b-0">

      <div className="flex gap-3">

        {/* ICON */}

        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50">
          <Trophy
            size={12}
            className="text-amber-600"
          />
        </div>


        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          {/* TYPE */}

          {achievement?.achievement_type && (
            <p className="mb-1 text-[8px] font-bold uppercase tracking-wider text-amber-600">
              {achievement.achievement_type}
            </p>
          )}


          {/* TITLE WITH BACKGROUND */}

          <h4 className="inline-block rounded-md bg-amber-50 px-2 py-1 text-xs font-bold leading-5 text-[#0f3262]">
            {achievement?.title ||
              "Achievement"}
          </h4>


          {/* DESCRIPTION */}

          {achievement?.description && (
            <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
              {achievement.description}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function PrincipalWelcome() {
  const [data, setData] = useState(null);

  const [newsNotices, setNewsNotices] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [achievementLoading, setAchievementLoading] =
    useState(true);

  // =========================================================
  // FETCH WELCOME + PRINCIPAL
  // =========================================================

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const response = await fetch(
          `${WELCOME_API}?_=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Home welcome request failed: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "HOME WELCOME API RESPONSE:",
          result
        );

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error(
          "Home welcome API error:",
          error
        );

        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcome();
  }, []);

  // =========================================================
  // FETCH NEWS
  // =========================================================

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);

        const response = await fetch(
          `${NEWS_API}?_=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `News request failed: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "NEWS & NOTICES HOMEPAGE API:",
          result
        );

        // =====================================================
        // IMPORTANT:
        // /api/news-notices RETURNS A DIRECT ARRAY
        //
        // [
        //   {...},
        //   {...}
        // ]
        // =====================================================

        if (Array.isArray(result)) {
          const sortedNews = [...result].sort(
            (a, b) => {
              const dateA = a?.publish_date
                ? new Date(
                    a.publish_date
                  ).getTime()
                : 0;

              const dateB = b?.publish_date
                ? new Date(
                    b.publish_date
                  ).getTime()
                : 0;

              return dateB - dateA;
            }
          );

          setNewsNotices(sortedNews);
        } else if (
          result?.success &&
          Array.isArray(result.data)
        ) {
          // Also support wrapped response
          setNewsNotices(result.data);
        } else {
          setNewsNotices([]);
        }
      } catch (error) {
        console.error(
          "News & Notices API error:",
          error
        );

        setNewsNotices([]);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // =========================================================
  // FETCH ACHIEVEMENTS
  // =========================================================

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          `${ACHIEVEMENTS_API}?_=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Achievements request failed: ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "ACHIEVEMENTS HOMEPAGE API:",
          result
        );

        if (
          result.success &&
          Array.isArray(result.data)
        ) {
          setAchievements(result.data);
        } else if (Array.isArray(result)) {
          setAchievements(result);
        } else {
          setAchievements([]);
        }
      } catch (error) {
        console.error(
          "Achievements API error:",
          error
        );

        setAchievements([]);
      } finally {
        setAchievementLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

            <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

            <div className="h-[430px] animate-pulse rounded-2xl bg-slate-100" />

          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // NO WELCOME DATA
  // =========================================================

  if (!data) {
    return null;
  }

  // =========================================================
  // DATA
  // =========================================================

  const principalImage = getApiUrl(
    data.principal_photo
  );

  const principalProfilePdf = getApiUrl(
    data.principal_profile_pdf
  );

  const profileButtonText =
    data.principal_profile_button_text?.trim() ||
    "View Principal Profile";

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {/* =====================================================
          NEWS SCROLL STYLE
      ====================================================== */}
<style>{`
  /* =====================================================
     NEWS SCROLL
  ===================================================== */

  .principal-news-scroll {
    height: 315px;
    overflow: hidden;
    position: relative;
  }

  .principal-news-track {
    display: flex;
    flex-direction: column;
    animation: principalNewsScroll 24s linear infinite;
    will-change: transform;
  }

  .principal-news-scroll:hover
  .principal-news-track {
    animation-play-state: paused;
  }

  @keyframes principalNewsScroll {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-50%);
    }
  }


  /* =====================================================
     ACHIEVEMENT SCROLL
  ===================================================== */

  .principal-achievement-scroll {
    height: 315px;
    overflow: hidden;
    position: relative;
  }

  .principal-achievement-track {
    display: flex;
    flex-direction: column;
    animation: principalAchievementScroll 26s linear infinite;
    will-change: transform;
  }

  .principal-achievement-scroll:hover
  .principal-achievement-track {
    animation-play-state: paused;
  }

  @keyframes principalAchievementScroll {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-50%);
    }
  }


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  @media (prefers-reduced-motion: reduce) {

    .principal-news-track,
    .principal-achievement-track {
      animation: none;
    }

  }
`}</style>

      <section className="py-7 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">

            {/* =================================================
                LEFT COLUMN
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* HEADER */}

              <div className="border-b border-slate-200 px-6 py-5">

                <h2 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                  {data.welcome_title}
                </h2>

              </div>

              {/* CONTENT */}

              <div className="px-6 py-6">

                {/* PRINCIPAL */}

                <div className="flex gap-5 sm:gap-6">

                  {/* PHOTO */}

                  <div className="shrink-0">

                    {principalImage ? (
                      <img
                        src={principalImage}
                        alt={
                          data.principal_name ||
                          "Principal"
                        }
                        className="h-45 w-35 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-40 sm:w-32"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-45 w-35 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400 sm:h-40 sm:w-32">
                        Principal
                      </div>
                    )}

                  </div>

                  {/* MESSAGE */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <Quote
                        size={18}
                        className="shrink-0 text-blue-600"
                      />

                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Principal's Message
                      </p>

                    </div>

                    {data.principal_name && (
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {data.principal_name}
                      </h3>
                    )}

                    {data.principal_designation && (
                      <p className="mt-0.5 text-xs font-medium text-blue-600">
                        {data.principal_designation}
                      </p>
                    )}

                    {data.principal_message ? (
                      <div className="mt-3 text-sm leading-6 text-slate-600">
                        {data.principal_message
                          .split(/\n+/)
                          .filter(Boolean)
                          .map(
                            (paragraph, index) => (
                              <p
                                key={index}
                                className="mb-3 last:mb-0"
                              >
                                {paragraph}
                              </p>
                            )
                          )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Principal's message will appear here.
                      </p>
                    )}

                    {/* PRINCIPAL PROFILE BUTTON */}

                    <div className="mt-5">

                      {principalProfilePdf ? (
                        <a
                          href={principalProfilePdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            bg-amber-500
                            px-5
                            py-2.5
                            text-xs
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:bg-[#071f3d]
                            hover:shadow-md
                          "
                        >
                          <FileText size={14} />

                          {profileButtonText}

                          <ArrowRight size={14} />
                        </a>
                      ) : (
                        <span
                          className="
                            inline-flex
                            cursor-not-allowed
                            items-center
                            gap-2
                            rounded-lg
                            bg-slate-300
                            px-5
                            py-2.5
                            text-xs
                            font-semibold
                            text-slate-600
                          "
                        >
                          <FileText size={14} />

                          {profileButtonText}

                          <ArrowRight size={14} />
                        </span>
                      )}

                    </div>

                  </div>
                </div>

                {/* =================================================
                    THREE CARDS
                ================================================= */}

                <div className="mt-7 grid gap-4 sm:grid-cols-3">

                  {/* CARD 1 */}

                  <a
                    href={
                      data.card_one_link ||
                      "/news-notices"
                    }
                    className="
                      group
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:border-blue-200
                      hover:bg-blue-50
                    "
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0f3262]">
                      <Newspaper size={17} />
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-800">
                      {data.card_one_title ||
                        "News & Notices"}
                    </h4>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {data.card_one_description ||
                        "Latest college announcements and updates."}
                    </p>
{/* 
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600">
                      View Updates
                      <ArrowRight size={11} />
                    </span> */}
                  </a>

                  {/* CARD 2 */}

                  <a
                    href={
                      data.card_two_link ||
                      "/achievements"
                    }
                    className="
                      group
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:border-amber-200
                      hover:bg-amber-50
                    "
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Trophy size={17} />
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-800">
                      {data.card_two_title ||
                        "Achievements"}
                    </h4>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {data.card_two_description ||
                        "Celebrating the achievements of our college community."}
                    </p>

                    {/* <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                      View Achievements
                      <ArrowRight size={11} />
                    </span> */}
                  </a>

                  {/* CARD 3 */}

                  <a
                    href={
                      principalProfilePdf ||
                      "#"
                    }
                    target={
                      principalProfilePdf
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      principalProfilePdf
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={(event) => {
                      if (!principalProfilePdf) {
                        event.preventDefault();
                      }
                    }}
                    className={`
                      group
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      transition-all
                      duration-200
                      ${
                        principalProfilePdf
                          ? "hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50"
                          : "cursor-not-allowed opacity-70"
                      }
                    `}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <UserRound size={17} />
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-800">
                      {data.card_three_title ||
                        "Principal's Profile"}
                    </h4>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      {data.card_three_description ||
                        "View the Principal's profile and professional details."}
                    </p>

                    {/* <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                      View Profile
                      <ArrowRight size={11} />
                    </span> */}
                  </a>

                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="space-y-5">

              {/* =================================================
                  NEWS & NOTICES
              ================================================= */}

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between bg-[#0f3262] px-4 py-3 text-white">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                      <Newspaper size={17} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold">
                        News & Notices
                      </h3>

                      <p className="text-[10px] text-blue-200">
                        Latest college updates
                      </p>
                    </div>

                  </div>

                  {/* <a
                    href="/news-notices"
                    className="
                      rounded-md
                      bg-white/10
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/20
                    "
                  >
                    View All
                  </a> */}

                </div>

                <div className="principal-news-scroll">

                  {/* LOADING */}

                  {newsLoading ? (
                    <div className="space-y-3 p-4">

                      {[1, 2, 3, 4].map(
                        (item) => (
                          <div
                            key={item}
                            className="h-14 animate-pulse rounded-lg bg-slate-100"
                          />
                        )
                      )}

                    </div>
                  ) : newsNotices.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
                      No news or notices available.
                    </div>
                  ) : (
                    <div className="principal-news-track px-4">

                      {/* FIRST COPY */}

                      {newsNotices.map(
                        (item, index) => (
                          <NewsNoticeItem
                            key={`first-${item.id ?? index}`}
                            item={item}
                          />
                        )
                      )}

                      {/* SECOND COPY FOR CONTINUOUS SCROLL */}

                      {newsNotices.map(
                        (item, index) => (
                          <NewsNoticeItem
                            key={`second-${item.id ?? index}`}
                            item={item}
                          />
                        )
                      )}

                    </div>
                  )}

                </div>
              </div>
{/* =================================================
    ACHIEVEMENTS
================================================= */}

<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

  {/* HEADER */}

  <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3 bg-blue-300">

    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
      <Trophy
        size={17}
        className="text-amber-600"
      />
    </div>

    <div>

      <h3 className="text-xl font-bold text-slate-800">
        Achievements
      </h3>

      <p className="text-[10px] text-slate-500">
        Celebrating excellence
      </p>

    </div>

  </div>


  {/* ACHIEVEMENT SCROLL */}

  <div className="principal-achievement-scroll">

    {/* LOADING */}

    {achievementLoading ? (

      <div className="space-y-3 p-4">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-14 animate-pulse rounded-lg bg-slate-100"
          />
        ))}

      </div>

    ) : achievements.length === 0 ? (

      /* NO DATA */

      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-400">
        No achievements available.
      </div>

    ) : (

      /* =================================================
         CONTINUOUS SCROLL TRACK
      ================================================= */

      <div className="principal-achievement-track px-4">

        {/* FIRST COPY */}

        {achievements.map(
          (achievement, index) => (
            <AchievementItem
              key={`first-${achievement.id ?? index}`}
              achievement={achievement}
            />
          )
        )}

        {/* SECOND COPY */}

        {achievements.map(
          (achievement, index) => (
            <AchievementItem
              key={`second-${achievement.id ?? index}`}
              achievement={achievement}
            />
          )
        )}

      </div>

    )}

  </div>

</div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PrincipalWelcome;

