export const studentsEraPages = [
  { pageKey: "students-era", route: "/students-era", title: "Overview", kind: "overview" },
  { pageKey: "students-era-ncc", route: "/students-era/ncc", title: "NCC", kind: "service" },
  { pageKey: "students-era-nss", route: "/students-era/nss", title: "NSS", kind: "service" },
  { pageKey: "students-era-cultural-activities", route: "/students-era/cultural-activities", title: "Cultural Activities", kind: "activities" },
  { pageKey: "students-era-womens-empowerment", route: "/students-era/womens-empowerment", title: "Women's Empowerment", kind: "support" },
  { pageKey: "students-era-sports", route: "/students-era/sports", title: "Sports", kind: "fitness" },
  { pageKey: "students-era-gym", route: "/students-era/gym", title: "Gym", kind: "fitness" },
  { pageKey: "students-era-career-guidance", route: "/students-era/career-guidance", title: "Career Guidance and Counselling", kind: "careers" },
  { pageKey: "students-era-seminars", route: "/students-era/seminars", title: "Seminars", kind: "activities" },
  { pageKey: "students-era-placements", route: "/students-era/placements", title: "Placements", kind: "careers" },
];

export const studentsEraPageKeys = studentsEraPages.map(({ pageKey }) => pageKey);
