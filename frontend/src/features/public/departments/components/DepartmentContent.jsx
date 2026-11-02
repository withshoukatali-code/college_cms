import { useEffect, useMemo, useState } from "react";
import { ChevronDown, UsersRound } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const temporaryEnglishContent = {
  about: `The Department of English creates an engaging environment for the study of language, literature and communication. Our teaching connects classic works with contemporary voices, helping students develop critical thinking, confident expression and an appreciation of culture.`,
  programmes: `The department offers undergraduate learning in English language and literature, supported by a broad curriculum that encourages reading, discussion, writing and independent thought.`,
  faculty: `Our faculty members bring together subject knowledge, mentoring and a student-centred approach to help learners grow academically and personally.`,
  research: `Research and project work explore literature, language, culture and society. Students are encouraged to take part in presentations, writing projects and academic activities.`,
  activities: `The department supports seminars, guest lectures, literary activities, competitions and other initiatives that connect classroom learning with the wider community.`,
  achievements: `The department celebrates student participation in university examinations, literary competitions, seminars, presentations and community-focused academic initiatives.`,
  highlights: `A supportive learning culture, active reading and discussion, confident communication, mentoring and opportunities to connect classroom knowledge with the wider world.`,
  objectives: `To develop strong language and communication skills, encourage critical and creative thinking, introduce students to diverse literary traditions and prepare learners for higher study and meaningful careers.`,
  subjects: `English language, communication skills, Indian and world literature, literary criticism, language studies, writing and practical communication.`,
  shortCourses: `Communication skills, spoken English, creative writing, soft skills, digital literacy and other value-added learning opportunities may be offered through the academic year.`,
  results: `The department reviews academic performance each year and uses student outcomes, progression and participation data to strengthen teaching and mentoring.`,
};

const galleryImages = [
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
];

const DepartmentContent = ({ department, sections, programmes, faculty = [] }) => {
  const staff = faculty;

  const { aboutSection, accordionSections } = useMemo(() => {
    const fallbackSections = [
      { key: "about", title: "About the Department", content: department.description || temporaryEnglishContent.about },
      { key: "programmes", title: "Programmes", content: temporaryEnglishContent.programmes },
      { key: "achievements", title: "Achievements of the Department", content: temporaryEnglishContent.achievements },
      { key: "highlights", title: "Highlights / Features of the Department", content: temporaryEnglishContent.highlights },
      { key: "objectives", title: "Objectives of the Department", content: temporaryEnglishContent.objectives },
      { key: "subjects", title: "Subjects Offered", content: temporaryEnglishContent.subjects },
      { key: "short-courses", title: "Short Term & Value Added Courses", content: temporaryEnglishContent.shortCourses },
      { key: "results", title: "Results of the Last 5 Years", content: temporaryEnglishContent.results },
      { key: "research", title: "Research and Projects", content: temporaryEnglishContent.research },
      { key: "activities", title: "Activities and Achievements", content: temporaryEnglishContent.activities },
      { key: "gallery", title: "Photo Gallery", content: "A glimpse of department learning, activities and campus life." },
    ];

    const databaseSections = sections.map((section) => ({
      key: section.section_key || String(section.id),
      title: section.title || "Department Information",
      content: section.content || "Department information will be published here.",
    }));
    const resolvedAboutSection = databaseSections.find((section) =>
      /^(about|department-about|about-department)$/i.test(section.key) ||
      /about the department/i.test(section.title)
    ) || fallbackSections[0];
    const databaseKeys = new Set(databaseSections.map((section) => section.key));

    return {
      aboutSection: resolvedAboutSection,
      accordionSections: [
        ...databaseSections.filter((section) => section.key !== resolvedAboutSection.key),
        ...fallbackSections.filter((section) => section.key !== "about" && !databaseKeys.has(section.key)),
      ],
    };
  }, [department.description, sections]);

  const [openSection, setOpenSection] = useState("");
  const [openProfile, setOpenProfile] = useState("");

  useEffect(() => {
    setOpenSection(accordionSections[0]?.key || "");
  }, [accordionSections, department.id]);

  return (
    <article className="min-w-0 text-slate-700">
      <section className="border-l-4 border-amber-400 bg-[#f5f3ee] px-6 py-6 shadow-sm sm:px-8" aria-labelledby="about-department-title">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">About the department</p>
        <h2 id="about-department-title" className="mt-2 font-serif text-3xl font-semibold text-[#102f58]">{aboutSection.title}</h2>
        <div className="prose mt-4 max-w-none font-serif text-[16px] leading-8 text-slate-700 prose-headings:text-[#102f58] prose-a:text-[#0f3262]" dangerouslySetInnerHTML={{ __html: aboutSection.content }} />
      </section>

      <section className="mt-10" aria-labelledby="faculty-title">
        <div className="flex items-center gap-3">
          <UsersRound size={22} className="text-amber-600" />
          <h2 id="faculty-title" className="text-2xl font-semibold text-[#102f58]">Faculty and staff</h2>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 py-2 sm:grid-cols-4">
          {staff.map((member) => (
            <div key={member.id || member.name} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_5px_18px_rgba(15,50,98,0.08)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_10px_24px_rgba(15,50,98,0.14)]">
              <div className="flex min-h-full flex-col items-start">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-blue-100 text-[#102f58] ring-4 ring-blue-50">
                  {member.photo_url ? <img src={member.photo_url.startsWith("http") ? member.photo_url : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${member.photo_url}`} alt={member.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><UsersRound size={20} /></div>}
                </div>
                <div className="mt-4 min-w-0">
                  <h3 className="font-bold leading-5 text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{member.designation || "Faculty Member"}</p>
                  {member.qualification && <p className="mt-1 text-xs text-slate-400">{member.qualification}</p>}
                  {Number(member.is_hod) === 1 && <p className="mt-1 text-xs font-semibold text-amber-700">Head of Department</p>}
                </div>
                <button type="button" onClick={() => setOpenProfile(openProfile === member.id ? "" : member.id)} className="mt-3 text-sm font-bold text-[#0f3262] hover:text-amber-600">
                  {openProfile === member.id ? "Hide Profile" : "View Profile"}
                </button>
                {openProfile === member.id && <p className="mt-2 text-sm leading-6 text-slate-500">{member.profile || `${member.name} contributes to teaching, mentoring and departmental activities.`}</p>}
              </div>
            </div>
          ))}
        </div>
        {staff.length === 0 && <p className="mt-4 border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">Faculty and staff profiles will be published here.</p>}
      </section>

      <section className="mt-10" aria-labelledby="department-information-title">
        <div className="flex items-end justify-between gap-4 border-b border-slate-300 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Explore</p>
            <h2 id="department-information-title" className="mt-2 text-2xl font-semibold text-[#102f58]">Department information</h2>
          </div>
          <span className="hidden text-sm text-slate-500 sm:block">Select a section</span>
        </div>

        <div className="divide-y divide-slate-300">
          {accordionSections.map((section) => {
            const isOpen = openSection === section.key;
            return (
              <div key={section.key} id={section.key}>
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? "" : section.key)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-[#102f58]"
                  aria-expanded={isOpen}
                  aria-controls={`department-section-${section.key}`}
                >
                  <span>{section.title}</span>
                  <ChevronDown size={20} className={`shrink-0 text-amber-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div id={`department-section-${section.key}`} className="pb-7 pr-4 text-[15px] leading-8 text-slate-600">
                    <div className="prose max-w-none overflow-x-auto prose-headings:text-[#102f58] prose-a:text-[#0f3262] [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-slate-400 [&_th]:border [&_th]:border-slate-400 [&_th]:bg-slate-100 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-400 [&_td]:px-2 [&_td]:py-1" dangerouslySetInnerHTML={{ __html: section.content }} />
                    {section.key === "programmes" && programmes.length > 0 && (
                      <ul className="mt-5 space-y-4">
                        {programmes.map((programme) => (
                          <li key={programme.id} className="border-l-2 border-amber-400 pl-4 text-slate-700">
                            <div>
                              <strong>{programme.programme_name}</strong>
                              {programme.programme_level && <span className="ml-2 text-sm text-slate-500">{programme.programme_level}</span>}
                            </div>
                            {programme.syllabus_content && (
                              <div
                                className="prose mt-3 max-w-none overflow-x-auto text-sm prose-th:border prose-th:border-slate-300 prose-th:bg-slate-50 prose-th:px-2 prose-th:py-1 prose-td:border prose-td:border-slate-300 prose-td:px-2 prose-td:py-1"
                                dangerouslySetInnerHTML={{ __html: programme.syllabus_content }}
                              />
                            )}
                            {programme.syllabus_url && (
                              <a
                                href={programme.syllabus_url.startsWith("http") ? programme.syllabus_url : `${API_BASE}${programme.syllabus_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block text-xs font-semibold text-[#0f3262] hover:text-amber-700"
                              >
                                View syllabus PDF
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.key === "gallery" && (
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {galleryImages.map((image, index) => (
                          <img key={image} src={image} alt={`Department activity ${index + 1}`} className="h-28 w-full object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </article>
  );
};

export default DepartmentContent;
