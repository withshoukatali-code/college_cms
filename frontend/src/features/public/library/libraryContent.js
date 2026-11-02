const makeSection = (section) => ({
  ...section,
  display_order: section.display_order ?? 0,
  is_active: section.is_active ?? 1,
  items: (section.items || []).map((item, index) => ({
    ...item,
    display_order: item.display_order ?? index + 1,
    is_active: item.is_active ?? 1,
  })),
});

export const libraryDefaultContent = {
  hero: {
    eyebrow: "Our Library",
    title: "Knowledge, access, and learning support for every learner",
    description: "The library was established in 1991 and continues to serve students, faculty, and researchers with a growing collection, digital tools, and a student-friendly learning environment.",
    stats: [
      { label: "Established", value: "1991" },
      { label: "Books / Volumes", value: "11,443+" },
      { label: "Automation", value: "2017-18" },
      { label: "Software", value: "SOUL 3.0" },
    ],
  },
  sections: [
    makeSection({
      id: "our-library",
      title: "Our Library",
      description: "The college library has served learners since the institution opened in 1991. It brings together print and digital resources in a welcoming environment for study and discovery.",
      display_order: 1,
      is_active: 1,
      items: [
        { title: "A place to learn", description: "A student-focused space for reading, reference, and academic exploration.", display_order: 1, is_active: 1 },
        { title: "A growing collection", description: "More than 11,443 volumes support learning across the college's academic disciplines.", display_order: 2, is_active: 1 },
      ],
    }),
    makeSection({
      id: "departmental-profile",
      title: "Departmental Profile",
      description: "An overview of the college library, its development, resources, and role in supporting teaching and learning.",
      display_order: 2,
      is_active: 1,
      items: [{ title: "Library profile", description: "Established with the college in 1991, the library continues to develop its collection and services for students and faculty.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "administration",
      title: "Administration",
      description: "Library administration and service information.",
      display_order: 3,
      is_active: 1,
      items: [{ title: "Librarian", description: "Mr. S. B. Shaiwale has led the library since 15 December 2008.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "advisory-committee",
      title: "Advisory Committee",
      description: "The Library Advisory Committee supports the planning and continuous improvement of library resources and services.",
      display_order: 4,
      is_active: 1,
      items: [{ title: "Committee information", description: "Add current committee members, responsibilities, and meeting information using Library Admin.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "library-staff",
      title: "Library Staff",
      description: "Meet the team supporting access to library resources and services.",
      display_order: 5,
      is_active: 1,
      items: [{ title: "Mr. S. B. Shaiwale", description: "Librarian since 15 December 2008.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "collection",
      title: "Collection",
      description: "Library holdings support curriculum learning, independent study, and research.",
      display_order: 6,
      is_active: 1,
      items: [{ title: "Books and volumes", description: "The library has more than 11,443 volumes. Use Library Admin to add collection categories and details.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "digital-library",
      title: "Jawahar Digital Library",
      description: "Digital resources extend learning beyond the shelves and support flexible access to academic information.",
      display_order: 7,
      is_active: 1,
      items: [{ title: "Digital learning", description: "Add digital library resources, access guidance, and related links using Library Admin.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "our-services",
      title: "Our Services",
      description: "Explore services that help students and faculty make effective use of the library.",
      display_order: 8,
      is_active: 1,
      items: [{ title: "Reading and circulation", description: "Library services support reading, circulation, and access to academic resources for the college community.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "best-practices",
      title: "Best Practices",
      description: "The library promotes an accessible, organized, and supportive environment for reading and learning.",
      display_order: 9,
      is_active: 1,
      items: [{ title: "A supportive learning environment", description: "Add the library's best practices and student initiatives using Library Admin.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "library-automation",
      title: "Library Automation",
      description: "Technology supports efficient organization and access to library resources.",
      display_order: 10,
      is_active: 1,
      items: [{ title: "SOUL 3.0", description: "The library has been automated since 2017-18 using SOUL 3.0.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "e-resources",
      title: "E-Resources",
      description: "Electronic resources provide additional avenues to explore academic information.",
      display_order: 11,
      is_active: 1,
      items: [{ title: "Online learning resources", description: "Add e-resource names, access instructions, and links using Library Admin.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "working-hours",
      title: "Working Hours",
      description: "Plan your visit with the library's reading-room and circulation timings.",
      display_order: 12,
      is_active: 1,
      items: [
        { title: "Reading Room", description: "", time: "9:00 a.m. to 5:00 p.m.", display_order: 1, is_active: 1 },
        { title: "Circulation", description: "", time: "10:00 a.m. to 4:00 p.m.", display_order: 2, is_active: 1 },
      ],
    }),
    makeSection({
      id: "vision",
      title: "Vision",
      description: "Library vision.",
      display_order: 13,
      is_active: 1,
      items: [{ title: "Our Vision", description: "To foster a culture of reading, learning, and informed inquiry through inclusive access to knowledge.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "mission",
      title: "Mission",
      description: "Library mission.",
      display_order: 14,
      is_active: 1,
      items: [{ title: "Our Mission", description: "To provide relevant learning resources and responsive services that support students, faculty, and research.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "objectives",
      title: "Objectives",
      description: "The library's objectives guide collection development and user services.",
      display_order: 15,
      is_active: 1,
      items: [{ title: "Learning support", description: "Organize and provide access to resources that support curriculum, independent learning, and academic growth.", display_order: 1, is_active: 1 }],
    }),
    makeSection({
      id: "library-rules",
      title: "Library Rules",
      description: "Library rules help maintain a welcoming and productive environment for all users.",
      display_order: 16,
      is_active: 1,
      items: [{ title: "Using the library", description: "Please respect the reading environment and follow the current library guidance provided by staff. Manage the detailed rules in Library Admin.", display_order: 1, is_active: 1 }],
    }),
  ],
};

const legacyServiceSectionIds = {
  "library staff": "library-staff",
  collection: "collection",
  "jawahar digital library": "digital-library",
  "library services": "our-services",
  "best practices": "best-practices",
  "library automation": "library-automation",
  "e-resources": "e-resources",
};

export function normalizeLibraryContent(content = {}) {
  const hero = {
    ...libraryDefaultContent.hero,
    ...(content.hero || {}),
    stats: Array.isArray(content.hero?.stats) ? content.hero.stats : libraryDefaultContent.hero.stats,
  };
  if (Array.isArray(content.sections)) {
    return { ...libraryDefaultContent, ...content, hero, sections: content.sections.map(makeSection) };
  }

  const sections = libraryDefaultContent.sections.map((section) => {
    const legacyService = (Array.isArray(content.services) ? content.services : []).find(
      (item) => legacyServiceSectionIds[String(item.title || "").toLowerCase()] === section.id
    );
    if (legacyService) {
      return makeSection({
        ...section,
        items: [{
          ...legacyService,
          description: legacyService.description || "",
          display_order: legacyService.display_order || 1,
          is_active: legacyService.is_active ?? 1,
        }],
      });
    }
    if (section.id === "working-hours" && Array.isArray(content.hours)) {
      return makeSection({
        ...section,
        items: content.hours.map((item, index) => ({
          ...item,
          description: item.description || "",
          display_order: item.display_order ?? index + 1,
          is_active: item.is_active ?? 1,
        })),
      });
    }
    return section;
  });

  return { ...libraryDefaultContent, ...content, hero, sections };
}
