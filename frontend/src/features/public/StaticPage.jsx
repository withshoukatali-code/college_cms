// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpRight, Download, FileText, Mail, Phone, UserRound } from "lucide-react";
// import TopBar from "./header/TopBar";
// import Navbar from "./navbar/Navbar";
//     contentVersion: 2,
// import PublicFooter from "./Footer/PublicFooter";
//     subtitle: "Environmental sustainability and NAAC documentation",
// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
//       "A green and environmental audit helps a senior college review its environmental footprint, document sustainable campus practices, and track improvements with verifiable evidence.",
//     highlights: ["NAAC Criterion 7.1.3", "Environmental stewardship", "Evidence-led improvement"],
//   about: { accent: "#0f3262" },
//   admissions: { accent: "#0f5d4f" },
//         heading: "Areas for review",
//         text: "Review green cover and biodiversity, water conservation, rainwater harvesting, waste segregation and disposal, plastic reduction, sanitation, sustainable transport, and environmental awareness across campus.",
//   default: { accent: "#0f3262" },
// };
//         heading: "Evidence for accreditation",
//         text: "Maintain the dated audit report, auditor details, scope and methodology, findings, campus photographs, relevant certificates, awareness activity records, and supporting policies or committee minutes.",
//   about: {
//     title: "Sanstha Overview",
//         heading: "Action and follow-up",
//         text: "Record each recommendation with an action owner, target date, progress, and closure evidence. Use the review to guide practical improvements and subsequent audit cycles.",
//       "Founded in 1954 by late Shikshanmaharshi Dr. Bapuji Salunkhe, the Sanstha works to extend education to rural and economically weaker communities across Maharashtra and Karnataka.",
//     highlights: ["Established in 1954", "330+ education and cultural centres", "About 2 lakh students", "14 districts across two states"],
//     cta: { label: "View Energy Audit", to: "/iqac/energy-audit" },
//       {
//         heading: "A movement for accessible education",
//     contentVersion: 2,
//         text: "The Sanstha was established by late Shikshanmaharshi Dr. Bapuji Salunkhe and named after Shri Swami Vivekananda. Its work focuses especially on learners in rural, remote and economically weaker communities.",
//     subtitle: "Energy conservation and NAAC Criterion 7.1.2",
//       {
//       "An energy audit documents energy use, conservation measures, and opportunities to improve efficiency in classrooms, laboratories, offices, and other college facilities.",
//     highlights: ["NAAC Criterion 7.1.2", "Energy conservation", "Consumption and savings evidence"],
//       },
//       {
//         heading: "Audit scope",
//         text: "Record the audit period, buildings and systems reviewed, electricity consumption, major equipment, operating schedules, and the methods used to identify energy-saving opportunities.",
//       },
//     ],
//         heading: "Conservation measures",
//         text: "Document applicable measures such as LED lighting, efficient equipment, switching and maintenance practices, energy monitoring, and any installed renewable or alternate energy systems. Include capacity and commissioning details where relevant.",
//       to: "https://www.vivekanandshikshansanstha.edu.in/",
//       external: true,
//         heading: "NAAC evidence",
//         text: "Keep the signed audit report, utility bills or meter records, equipment and renewable-energy details, before-and-after comparisons where available, photographs, and action taken on audit recommendations.",
//   founder: {
//     title: "Founder's Message",
//     cta: { label: "View Green Audit", to: "/iqac/green-audit" },
//     description:
//       "Dr. Bapuji Salunkhe, born Govindrao Dnyanojirao Salunkhe, devoted his life to widening access to education and building an institution rooted in knowledge, service and character.",
//     photo: "https://tuljabhavanicollege.org.in/wp-content/uploads/2023/07/download.jpg",
//     photoSource: "https://tuljabhavanicollege.org.in/founder/",
//   const themeMap = {
//     about: { accent: "#0f3262" },
//     admissions: { accent: "#0f5d4f" },
//     academics: { accent: "#5a2e88" },
//     research: { accent: "#2a3e8f" },
//     default: { accent: "#0f3262" },
//   };

//   export const pageMap = {
//     about: {
//       title: "Sanstha Overview",
//       subtitle: "Shri Swami Vivekanand Shikshan Sanstha, Kolhapur",
//       description: "Founded in 1954 by late Shikshanmaharshi Dr. Bapuji Salunkhe, the Sanstha works to extend education to rural and economically weaker communities across Maharashtra and Karnataka.",
//       highlights: ["Established in 1954", "330+ education and cultural centres", "About 2 lakh students", "14 districts across two states"],
//       sections: [
//         { heading: "A movement for accessible education", text: "The Sanstha was established by late Shikshanmaharshi Dr. Bapuji Salunkhe and named after Shri Swami Vivekananda. Its work focuses especially on learners in rural, remote and economically weaker communities." },
//         { heading: "A wide educational network", text: "The institution reports more than 330 educational and cultural centres and about two lakh students. Its network includes high schools, training colleges, arts, commerce and science colleges, junior colleges, B.Ed. colleges, a law college, hostels and a residential school." },
//         { heading: "Knowledge, science and culture", text: "The founder's motto, 'Education for the spread of knowledge, science and good culture,' places learning alongside character, integrity, service and social responsibility." },
//       ],
//       cta: { label: "Explore Swami Vivekanand Sanstha Kolhapur", to: "https://www.vivekanandshikshansanstha.edu.in/", external: true },
//     },
//     founder: {
//       title: "Founder's Message",
//       subtitle: "Late Shikshanmaharshi Dr. Bapuji Salunkhe",
//       description: "Dr. Bapuji Salunkhe, born Govindrao Dnyanojirao Salunkhe, devoted his life to widening access to education and building an institution rooted in knowledge, service and character.",
//       photo: "https://tuljabhavanicollege.org.in/wp-content/uploads/2023/07/download.jpg",
//       photoAlt: "Portrait of Dr. Bapuji Salunkhe, founder of Shri Swami Vivekanand Shikshan Sanstha",
//       photoSource: "https://tuljabhavanicollege.org.in/founder/",
//       highlights: ["Founded the Sanstha in 1954", "Educationist and freedom movement participant", "Dalit Mitra award recipient"],
//       sections: [
//         { heading: "Early life and education", text: "Born in Rampur in the Patan region of Satara district, Bapuji continued his studies despite losing both parents in childhood. He completed a B.A. in 1945 and teacher training in 1949." },
//         { heading: "An educator shaped by public service", text: "Bapuji began his education career in 1940 and later served as a teacher and headmaster. His work was interrupted by participation in the Quit India movement; he continued serving education communities before beginning a new institution with his colleagues." },
//         { heading: "Founding the Sanstha", text: "On 19 October 1954, Bapuji laid the foundation of a new educational institution with his colleagues. Named after Shri Swami Vivekananda, the Sanstha was registered in December 1954 and began its educational work in June 1955." },
//         { heading: "A philosophy of knowledge and character", text: "Bapuji's educational philosophy joined knowledge and its practical use with truth, morality, integrity, service and dedication. His work was recognized with the Dalit Mitra award from the Government of Maharashtra and an honorary D.Litt. from Shivaji University, Kolhapur." },
//       ],
//       cta: { label: "View Sanstha Overview", to: "/about" },
//     },
//     chairman: {
//       title: "Chairman's Message",
//       subtitle: "Leadership and vision",
//       description: "I take immense pride in introducing Tuljabhavani College, Tuljapure, a distinguished institution committed to quality education and holistic student development.",
//       highlights: ["Student growth", "Institutional values", "Academic progress"],
//       sections: [
//         { heading: "Leadership", text: "The institution continues to uphold the ideals of discipline, integrity and excellence in every aspect of campus life and academic experience." },
//         { heading: "Mission", text: "We work to ensure that each learner receives opportunities to flourish academically, socially and professionally while preparing for life beyond graduation." },
//       ],
//       cta: { label: "Meet the Principal", to: "/about/principal" },
//     },
//     principal: {
//       title: "Principal's Desk",
//       subtitle: "Academic leadership",
//       description: "The college is proud to be a centre of learning, service and opportunity for students from diverse backgrounds, and we remain committed to progressive teaching and student welfare.",
//       highlights: ["Academic leadership", "Student welfare", "Quality learning"],
//       sections: [
//         { heading: "Welcome", text: "We welcome students to a campus that combines academic commitment with personal growth, discipline, and active participation in all spheres of education." },
//         { heading: "Commitment", text: "Our focus remains on improving pedagogy, empowering students, and strengthening institutional practices that support a vibrant education ecosystem." },
//       ],
//       cta: { label: "Explore Programs", to: "/programmes" },
//     },
//       },
//       {
//         heading: "Commerce Stream",
//         text: "The commerce curriculum focuses on accounting, business, management, finance and applied skills relevant to modern industry and entrepreneurship.",
//       },
//       {
//         heading: "Science Stream",
//         text: "Science programmes in Physics, Chemistry, Botany, Zoology, Mathematics and Computer Science build analytical thinking and research-oriented capabilities.",
//       },
//       {
//         heading: "Post Graduate & Skill Support",
//         text: "The institution supports higher learning and skill enhancement through academic guidance, department learning and practical exposure.",
//       },
//     ],
//     cta: { label: "Explore Departments", to: "/departments" },
//   },
//   gallery: {
//     title: "College Gallery",
//     subtitle: "Capturing moments of excellence, growth and achievement",
//     description:
//       "The gallery reflects the academic, cultural, sports and campus life that define the vibrant student experience at the college.",
//     highlights: ["Campus life", "Academic excellence", "Events & ceremonies", "Facilities"],
//     sections: [
//       {
//         heading: "Campus Life",
//         text: "From classrooms to collaborative learning spaces, the campus creates a welcoming environment for growth, leadership and friendship.",
//       },
//       {
//         heading: "Academic Excellence",
//         text: "The gallery captures academic activities, classroom engagement, seminars, student participation and learning experiences across departments.",
//       },
//       {
//         heading: "Events & Ceremonies",
//         text: "Cultural events, celebrations and institutional programmes showcase the energetic and participative spirit of the college community.",
//       },
//       {
//         heading: "Facilities",
//         text: "Campus facilities including laboratories, libraries, sports spaces and learning areas are part of the college’s rich academic ecosystem.",
//       },
//     ],
//     cta: { label: "Back to Home", to: "/" },
//   },
//   "useful-links": {
//     title: "Useful Links",
//     subtitle: "Quick access to important resources",
//     description:
//       "These links provide access to academic notifications, forms, schemes, alumni support, and student-focused institutional resources.",
//     highlights: ["Academic notifications", "Forms", "Student services", "Schemes"],
//     sections: [
//       {
//         heading: "Academic & Institutional Resources",
//         text: "Access academic notices, forms, admissions-related documents, faculty development information and educational initiatives that support campus life.",
//       },
//       {
//         heading: "Student Support & Schemes",
//         text: "Useful links include welfare, learning and support programmes such as Vidya Vistar, DBT Star College, UGC Paramarsh and student learning resources.",
//       },
//     ],
//     cta: { label: "View Admissions", to: "/admissions" },
//   },
//   admissions: {
//     title: "Admissions",
//     subtitle: "Admission Information",
//     description:
//       "Our admissions process is transparent, student-friendly, and aligned with the latest academic requirements.",
//     highlights: ["Merit-based process", "Guided counseling", "Simple applications"],
//     sections: [
//       {
//         heading: "How to Apply",
//         text: "Students can complete the application process through the official admissions portal and contact the academic office for support.",
//       },
//       {
//         heading: "Eligibility",
//         text: "Eligibility criteria vary by programme and are announced with the admission notification for each academic year.",
//       },
//       {
//         heading: "Support",
//         text: "Our academic advisors and admissions support team assist students with enrollment, documentation, and course selection.",
//       },
//     ],
//     cta: { label: "View Admission Process", to: "/admissions/process" },
//   },
//   "admissions-process": {
//     title: "Admission Process",
//     subtitle: "Step-by-step guidance",
//     description:
//       "The admission process includes application submission, document verification, merit screening, and enrollment guidance.",
//     highlights: ["Application steps", "Document review", "Enrollment support"],
//     sections: [
//       {
//         heading: "Stage 1",
//         text: "Review notifications, eligibility, and programme details. Prepare all required documents before applying.",
//       },
//       {
//         heading: "Stage 2",
//         text: "Submit the online or offline application form and complete the registration process in time.",
//       },
//       {
//         heading: "Stage 3",
//         text: "The college reviews the application, communicates the outcome, and guides students through admission formalities.",
//       },
//     ],
//     cta: { label: "Back to Admissions", to: "/admissions" },
//   },
//   "academics-programmes": {
//     title: "Academic Programmes",
//     subtitle: "Programmes & offerings",
//     description:
//       "We offer a wide variety of undergraduate and postgraduate programmes designed for academic depth and employability.",
//     highlights: ["UG & PG options", "Career-focused learning", "Interdisciplinary study"],
//     sections: [
//       {
//         heading: "Curriculum",
//         text: "Academic programmes blend classroom learning with projects, field exposure, practical lab work, and skill development.",
//       },
//       {
//         heading: "Student Development",
//         text: "Students receive mentoring, co-curricular opportunities, and academic support throughout their learning journey.",
//       },
//       {
//         heading: "Career Readiness",
//         text: "The curriculum is shaped to improve research aptitude, communication, critical analysis, and industry readiness.",
//       },
//     ],
//     cta: { label: "View Departments", to: "/departments" },
//   },
//   "academics-calendar": {
//     title: "Academic Calendar",
//     subtitle: "Academic schedule",
//     description:
//       "The academic calendar outlines key dates for teaching, examinations, evaluation, and institutional activities.",
//     highlights: ["Semester plan", "Examination dates", "Institutional events"],
//     sections: [
//       {
//         heading: "Academic Cycle",
//         text: "The academic year is organized into term periods with schedules for teaching, assessments, and breaks.",
//       },
//       {
//         heading: "Planning",
//         text: "Students and faculty can use the calendar to track deadlines, internal assessments, and important academic milestones.",
//       },
//       {
//         heading: "Updates",
//         text: "Any schedule revisions are communicated through official notices, the college portal, and departmental channels.",
//       },
//     ],
//     cta: { label: "Back to Academics", to: "/academics/programmes" },
//   },
//   examinations: {
//     title: "Examinations",
//     subtitle: "Assessment and evaluation",
//     description:
//       "Examinations are designed to assess academic progress fairly and consistently across all programmes.",
//     highlights: ["Internal evaluation", "University norms", "Transparent process"],
//     sections: [
//       {
//         heading: "Examination Framework",
//         text: "The institution follows prescribed university and statutory guidelines for assessment, moderation, and results.",
//       },
//       {
//         heading: "Support",
//         text: "Students can access timetable information, notices, and administrative guidance for examinations and revaluation matters.",
//       },
//       {
//         heading: "Academic Integrity",
//         text: "Academic ethics, fair practice, and equal opportunity remain central to the evaluation process.",
//       },
//     ],
//     cta: { label: "View Results", to: "/results" },
//   },
//   timetable: {
//     title: "Time Table",
//     subtitle: "Class and schedule information",
//     description:
//       "The timetable provides structured class schedules for all departments and programmes across the institution.",
//     highlights: ["Department schedules", "Regular updates", "Easy access"],
//     sections: [
//       {
//         heading: "Schedule Planning",
//         text: "Timetables are prepared to optimize classroom use, faculty planning, and student convenience.",
//       },
//       {
//         heading: "Department Access",
//         text: "Students can view time table information through department office communication and the central academic notices.",
//       },
//       {
//         heading: "Academic Discipline",
//         text: "Regular attendance and adherence to the timetable help maintain a disciplined learning environment.",
//       },
//     ],
//     cta: { label: "Check Academic Calendar", to: "/academics/calendar" },
//   },
//   results: {
//     title: "Results",
//     subtitle: "Performance and outcomes",
//     description:
//       "Results reflect the academic performance of students and help guide future learning and career plans.",
//     highlights: ["Updated outcomes", "Progress tracking", "Recognition of excellence"],
//     sections: [
//       {
//         heading: "Publication",
//         text: "Results are declared as per university and institutional schedules, and are communicated through official channels.",
//       },
//       {
//         heading: "Academic Guidance",
//         text: "Students are encouraged to review results and consult faculty mentors for improvement and academic planning.",
//       },
//       {
//         heading: "Support",
//         text: "Queries, grievances, and revaluation requests are handled through the prescribed academic procedure.",
//       },
//     ],
//     cta: { label: "View Examinations", to: "/examinations" },
//   },
//   library: {
//     title: "Library",
//     subtitle: "Knowledge resources",
//     description:
//       "The library supports teaching, learning, research, and intellectual growth with a broad collection of resources.",
//     highlights: ["Print & digital access", "Research support", "Reading culture"],
//     sections: [
//       {
//         heading: "Collections",
//         text: "The library offers academic books, journals, reference materials, and digital resources for students and faculty.",
//       },
//       {
//         heading: "Services",
//         text: "Students benefit from reading space, reference assistance, borrowing services, and information support.",
//       },
//       {
//         heading: "Learning Environment",
//         text: "The library fosters a disciplined, quiet, and intellectually stimulating environment for study and exploration.",
//       },
//     ],
//     cta: { label: "Explore Research", to: "/research" },
//   },
//   research: {
//     title: "Research",
//     subtitle: "Innovation and inquiry",
//     description:
//       "Research and innovation are integral to the college’s academic mission and its contribution to society.",
//     highlights: ["Innovation culture", "Faculty inquiry", "Student participation"],
//     sections: [
//       {
//         heading: "Research Culture",
//         text: "Students and faculty engage in inquiry-based learning, projects, and scholarly activities across disciplines.",
//       },
//       {
//         heading: "Support ",
//         text: "Research guidance, facilitation, and collaborative academic initiatives help build a strong research ecosystem.",
//       },
//       {
//         heading: "Outreach",
//         text: "The college promotes research that connects academic learning with community needs and sustainable development.",
//       },
//     ],
//     cta: { label: "View Library", to: "/library" },
//   },
//   downloads: {
//     title: "Downloads",
//     subtitle: "Forms and resources",
//     description:
//       "The download section provides access to forms, notices, academic documents, and institutional resources.",
//     highlights: ["Notices", "Forms", "Institutional documents"],
//     sections: [
//       {
//         heading: "Useful Materials",
//         text: "Students and stakeholders can access key information including notices, guidelines, and forms for academic use.",
//       },
//       {
//         heading: "Academic Access",
//         text: "The section supports efficient communication by giving quick access to essential documents and announcements.",
//       },
//       {
//         heading: "Ease of Access",
//         text: "Important resources are organized for clarity so that users can quickly find the information they need.",
//       },
//     ],
//     cta: { label: "Back to Home", to: "/" },
//   },
//   "students-era": {
//     title: "Students' Era",
//     subtitle: "Student life and engagement",
//     description:
//       "Students’ Era reflects the vibrant campus life, leadership, participation, and student-led initiatives within the institution.",
//     highlights: ["Campus engagement", "Youth leadership", "Student activities"],
//     sections: [
//       {
//         heading: "Campus Participation",
//         text: "Students are encouraged to take part in clubs, events, competitions, and outreach activities that build confidence and leadership.",
//       },
//       {
//         heading: "Well-being",
//         text: "The campus creates a supportive ecosystem for personal growth, teamwork, and holistic student development.",
//       },
//       {
//         heading: "Opportunities",
//         text: "Students are given opportunities to develop practical skills through events, workshops, and extracurricular engagement.",
//       },
//     ],
//     cta: { label: "Explore Admissions", to: "/admissions" },
//   },
//   "students-era-cultural-activities": {
//     title: "Cultural Activities",
//     subtitle: "Arts, expression, and campus events",
//     description: "Discover cultural programmes, performances, competitions, and student-led creative activities.",
//     highlights: ["Performances", "Competitions", "Student creativity"],
//     sections: [
//       { heading: "College Events", text: "Add cultural festivals, celebrations, performances, and annual events." },
//       { heading: "Student Participation", text: "Share competitions, student achievements, clubs, and creative programmes." },
//     ],
//   },
//   "students-era-womens-empowerment": {
//     title: "Women’s Empowerment",
//     subtitle: "Leadership, opportunity, and support",
//     description: "Explore programmes and initiatives that support women’s participation, confidence, safety, and leadership on campus.",
//     highlights: ["Leadership", "Equal opportunity", "Student support"],
//     sections: [
//       { heading: "Programmes", text: "Add workshops, awareness events, mentoring, and development activities organized for students." },
//       { heading: "Participation and Outcomes", text: "Share student participation, achievements, support resources, and programme outcomes." },
//     ],
//   },
//   "students-era-sports": {
//     title: "Sports",
//     subtitle: "Fitness, teamwork, and achievement",
//     description: "Find information about sports facilities, teams, competitions, and student achievements.",
//     highlights: ["Teams", "Competition", "Student achievement"],
//     sections: [
//       { heading: "Sports and Activities", text: "Add sports offered, training schedules, teams, and participation details." },
//       { heading: "Achievements", text: "Publish competition results, awards, and student sporting achievements." },
//     ],
//   },
//   "students-era-gym": {
//     title: "Gym",
//     subtitle: "Fitness and well-being",
//     description: "Explore the college gym and fitness facilities available to students.",
//     highlights: ["Fitness", "Well-being", "Student recreation"],
//     sections: [
//       { heading: "Facilities", text: "Add the gym opening details, available equipment, access guidance, and safety information." },
//       { heading: "Student Access", text: "Publish timings, eligibility, and contact details for students using the gym." },
//     ],
//   },
//   "students-era-career-guidance": {
//     title: "Career Guidance and Counselling",
//     subtitle: "Planning, preparation, and support",
//     description: "Find career guidance, counselling, and preparation support available to students.",
//     highlights: ["Career planning", "Counselling", "Employability"],
//     sections: [
//       { heading: "Guidance Services", text: "Add information about career counselling, aptitude guidance, and academic or career planning support." },
//       { heading: "Workshops and Preparation", text: "Publish workshops, interview preparation, competitive-exam guidance, and student resources." },
//     ],
//   },
//   "students-era-seminars": {
//     title: "Seminars",
//     subtitle: "Academic talks and learning events",
//     description: "Browse seminars, guest lectures, workshops, and academic events hosted by the college.",
//     highlights: ["Guest lectures", "Workshops", "Academic exchange"],
//     sections: [
//       { heading: "Upcoming Seminars", text: "Add upcoming seminar dates, speakers, venues, and registration details." },
//       { heading: "Past Events", text: "Document previous seminars, participation, and key outcomes." },
//     ],
//   },
//   "students-era-placements": {
//     title: "Placements",
//     subtitle: "Career pathways and opportunities",
//     description: "Learn about placement support, employer engagement, and career opportunities for students.",
//     highlights: ["Career readiness", "Employer connections", "Student opportunities"],
//     sections: [
//       { heading: "Placement Support", text: "Add placement-cell services, training, and guidance offered to students." },
//       { heading: "Recruitment and Outcomes", text: "Publish employer visits, current opportunities, and verified placement outcomes." },
//     ],
//   },
//   alumni: {
//     title: "Alumni Association",
//     subtitle: "Stay connected. Give back. Grow together.",
//     description:
//       "The Alumni Association connects former students with the college and one another through shared experiences, mentorship, events, and continued involvement in campus life.",
//     highlights: ["Alumni network", "Mentorship", "Events"],
//     sections: [
//       {
//         heading: "Alumni Association",
//         text: "Former students can stay connected, share their experiences, and contribute to the continuing growth of the college.",
//       },
//       {
//         heading: "Registration and Documents",
//         text: "Publish alumni association registration details and official certificates or documents here.",
//       },
//       {
//         heading: "Alumni Events",
//         text: "Share alumni meetings, reunions, guest sessions, and upcoming events with former students.",
//       },
//     ],
//   },
//   "e-contents": {
//     title: "E-Contents",
//     subtitle: "Online Classes Links",
//     description: "Find faculty online classroom links and digital learning materials by teacher or subject.",
//     resources: [],
//   },
//   "screen-reader": {
//     title: "Screen Reader Access",
//     subtitle: "Accessibility support",
//     description:
//       "The college is committed to digital accessibility and provides screen reader support for a more inclusive experience.",
//     highlights: ["Accessibility", "Inclusive access", "Reader support"],
//     sections: [
//       {
//         heading: "Accessibility Commitment",
//         text: "We aim to ensure our website and resources remain accessible to students and visitors using assistive technologies.",
//       },
//       {
//         heading: "Support Options",
//         text: "Users can access compatible technologies and tools that improve readability, navigation, and digital access.",
//       },
//       {
//         heading: "Inclusive Education",
//         text: "Accessible learning spaces help ensure equal opportunities for all students in academic and institutional processes.",
//       },
//     ],
//     cta: { label: "Back to Home", to: "/" },
//   },
//   "iqac-about": {
//     title: "About IQAC",
//     subtitle: "Internal Quality Assurance Cell",
//     description:
//       "The Internal Quality Assurance Cell supports continuous quality improvement through institutional planning, monitoring, documentation and review of academic and administrative processes. This section provides access to IQAC meeting records and other quality assurance documentation published by the institution.",
//     highlights: ["Quality assurance", "Continuous improvement", "Institutional excellence"],
//     sections: [],
//     cta: { label: "Explore Best Practices", to: "/naac/best-practices" },
//   },
//   "iqac-vision-mission": {
//     title: "Vision & Mission",
//     subtitle: "IQAC objectives",
//     description:
//       "The IQAC works toward a vision of academic excellence supported by transparent governance and an evidence-based culture of quality.",
//     highlights: ["Academic excellence", "Transparent systems", "Evidence-based improvement"],
//     sections: [
//       {
//         heading: "Vision",
//         text: "To build a culture of quality that strengthens teaching, learning, and institutional accountability.",
//       },
//       {
//         heading: "Mission",
//         text: "To improve institutional processes through periodic reviews, stakeholder feedback, and quality-focused development plans.",
//       },
//       {
//         heading: "Approach",
//         text: "Quality initiatives are driven by continuous reflection, data analysis, and collaborative actions across the campus.",
//       },
//     ],
//     cta: { label: "View Quality Initiatives", to: "/iqac/quality-initiatives" },
//   },
//   "iqac-committee": {
//     title: "IQAC Committee",
//     subtitle: "Leadership & committees",
//     description:
//       "The IQAC committee brings together academic and administrative leadership to guide quality improvement initiatives.",
//     highlights: ["Leadership", "Academic oversight", "Quality planning"],
//     sections: [
//       {
//         heading: "Governance",
//         text: "The committee ensures that planning, review, and implementation of quality initiatives remain aligned with institutional goals.",
//       },
//       {
//         heading: "Collaboration",
//         text: "Participation from faculty, staff, and stakeholders strengthens the planning and execution of improvement strategies.",
//       },
//       {
//         heading: "Monitoring",
//         text: "IQAC members monitor implementation and support evidence-based improvements across academic and administrative domains.",
//       },
//     ],
//     cta: { label: "View Committee Roles", to: "/iqac/coordinator" },
//   },
//   "iqac-coordinator": {
//     title: "IQAC Coordinator",
//     subtitle: "Internal Quality Assurance Cell",
//     description:
//       "Meet the coordinator of the Internal Quality Assurance Cell.",
//     profile: {
//       name: "",
//       designation: "",
//       qualification: "",
//       department: "",
//       phone: "",
//       email: "",
//       experience: "",
//       coreSubject: "",
//       majorResearchSubject: "",
//       research: "",
//       photo: "",
//     },
//     highlights: ["Coordination", "Implementation", "Monitoring"],
//     sections: [
//       {
//         heading: "Role",
//         text: "The coordinator coordinates initiatives, maintains reports, and facilitates timely action on quality improvement recommendations.",
//       },
//       {
//         heading: "Support",
//         text: "The coordinator works with departments to strengthen data quality, documentation, and institutional accountability.",
//       },
//       {
//         heading: "Impact",
//         text: "Quality coordination helps create a sustained culture of planning, review, and improvement across the campus.",
//       },
//     ],
//     cta: { label: "View Reports", to: "/iqac/annual-reports" },
//   },
//   "iqac-minutes": {
//     title: "IQAC Meetings",
//     subtitle: "Meeting records",
//     description:
//       "Browse IQAC meeting records, minutes, and related documents.",
//     highlights: ["Records", "Review", "Action tracking"],
//     sections: [
//       {
//         heading: "Documentation",
//         text: "Minutes help track recommendations, follow-up responsibilities, and implementation progress across departments.",
//       },
//       {
//         heading: "Decision Support",
//         text: "Meeting records ensure continuity, accountability, and transparent follow-through on quality improvement plans.",
//       },
//       {
//         heading: "Institutional Learning",
//         text: "These records help institutions reflect on outcomes and refine future plans based on evidence and discussion.",
//       },
//     ],
//     cta: { label: "View Action Taken Reports", to: "/iqac/action-taken" },
//   },
//   "iqac-action-taken": {
//     title: "Action Taken Reports",
//     subtitle: "Progress tracking",
//     description:
//       "Action taken reports summarize the implementation status of recommendations from quality review and assessment activities.",
//     highlights: ["Implementation", "Monitoring", "Follow-up"],
//     sections: [
//       {
//         heading: "Progress Review",
//         text: "The reports track whether recommendations have been implemented and whether outcomes have improved over time.",
//       },
//       {
//         heading: "Quality Culture",
//         text: "Regular follow-up reinforces accountability and encourages schools and departments to act on feedback.",
//       },
//       {
//         heading: "Institutional Improvement",
//         text: "These reports help maintain a continuous cycle of planning, action, and review for quality growth.",
//       },
//     ],
//     cta: { label: "Back to IQAC", to: "/iqac" },
//   },
//   "iqac-best-practices": {
//     title: "Best Practices",
//     subtitle: "Quality initiatives",
//     description:
//       "Best practices reflect well-tested, student-centered activities that improve academic and institutional performance.",
//     highlights: ["Student-centered", "Innovation", "Sustainability"],
//     sections: [
//       {
//         heading: "Academic Practices",
//         text: "The college promotes teaching methods, student support measures, and processes that improve outcomes and participation.",
//       },
//       {
//         heading: "Institutional Practice",
//         text: "Best practices formalize solutions that strengthen campus life, service quality, and community engagement.",
//       },
//       {
//         heading: "Impact",
//         text: "These practices create a stronger learning environment and reinforce the institution’s values of excellence and inclusion.",
//       },
//     ],
//     cta: { label: "View Distinctiveness", to: "/iqac/distinctiveness" },
//   },
//   "iqac-distinctiveness": {
//     title: "Institutional Distinctiveness",
//     subtitle: "Unique identity",
//     description:
//       "Institutional distinctiveness reflects the college’s unique values, strengths, and contribution to students and society.",
//     highlights: ["Unique identity", "Community value", "Academic depth"],
//     sections: [
//       {
//         heading: "Distinctive Edge",
//         text: "The college’s identity is built on quality pedagogy, student support, ethical values, and purposeful engagement.",
//       },
//       {
//         heading: "Community Linkage",
//         text: "Its impact extends beyond campus through outreach, skill development, and social responsibility initiatives.",
//       },
//       {
//         heading: "Future Direction",
//         text: "Distinctiveness continues to guide strategic planning, curricula, and institutional progress.",
//       },
//     ],
//     cta: { label: "View AAA", to: "/iqac/aaa" },
//   },
//   "iqac-aaa": {
//     title: "Academic & Administrative Audit",
//     subtitle: "Review and improvement",
//     description:
//       "The academic and administrative audit ensures systematic review of teaching, administration, and institutional processes.",
//     highlights: ["Audit review", "Process improvement", "Accountability"],
//     sections: [
//       {
//         heading: "Review Process",
//         text: "It evaluates teaching quality, governance, student services, and internal systems using structured assessment tools.",
//       },
//       {
//         heading: "Action Orientation",
//         text: "Audit findings lead to measurable improvements in departments, administration, and campus operations.",
//       },
//       {
//         heading: "Quality Assurance",
//         text: "The audit helps align practice with standards and institutional priorities.",
//       },
//     ],
//     cta: { label: "View Green Audit", to: "/iqac/green-audit" },
//   },
//   "iqac-green-audit": {
//     title: "Green Audit",
//     subtitle: "Sustainability review",
//     description:
//       "Green audit focuses on environmental management, sustainability practices, and the college’s resource-conscious campus culture.",
//     highlights: ["Sustainability", "Environment", "Resource efficiency"],
//     sections: [
//       {
//         heading: "Campus Practice",
//         text: "The college reviews energy use, environmental management, waste handling, and awareness initiatives.",
//       },
//       {
//         heading: "Awareness",
//         text: "Sustainability and conservation efforts help create a greener and more responsible campus environment.",
//       },
//       {
//         heading: "Impact",
//         text: "Green initiatives support ecological responsibility and long-term institutional sustainability.",
//       },
//     ],
//     cta: { label: "View Energy Audit", to: "/iqac/energy-audit" },
//   },
//   "iqac-energy-audit": {
//     title: "Energy Audit",
//     subtitle: "Resource efficiency",
//     description:
//       "Energy audit examines usage patterns and opportunities to improve efficiency while supporting sustainable campus operations.",
//     highlights: ["Efficient use", "Savings", "Sustainability"],
//     sections: [
//       {
//         heading: "Resource Review",
//         text: "The audit evaluates patterns of electricity and utility consumption to identify opportunities for optimization.",
//       },
//       {
//         heading: "Operational Impact",
//         text: "Improve efficiency and reduce waste through thoughtful management and awareness activities.",
//       },
//       {
//         heading: "Institutional Value",
//         text: "Energy-conscious operations benefit both the environment and the financial sustainability of the institution.",
//       },
//     ],
//     cta: { label: "View Gender Audit", to: "/iqac/gender-audit" },
//   },
//   "iqac-gender-audit": {
//     title: "Gender Audit",
//     subtitle: "Equity and inclusion",
//     description:
//       "Gender audit supports fairness, equal opportunity, and inclusive campus practices in teaching, governance, and student life.",
//     highlights: ["Equity", "Inclusion", "Fair opportunities"],
//     sections: [
//       {
//         heading: "Purpose",
//         text: "The audit examines how policies and practices support gender inclusivity and equal participation.",
//       },
//       {
//         heading: "Campus Action",
//         text: "It helps identify gaps and promote safe, respectful, and equitable access to academic and institutional opportunities.",
//       },
//       {
//         heading: "Institutional Environment",
//         text: "A gender-responsive environment supports dignity, confidence, and equal participation for all learners.",
//       },
//     ],
//     cta: { label: "View Initiatives", to: "/iqac/quality-initiatives" },
//   },
//   "iqac-quality-initiatives": {
//     title: "Quality Initiatives",
//     subtitle: "Improvement programmes",
//     description:
//       "Quality initiatives include structured actions designed to improve learning, governance, service experience, and institutional excellence.",
//     highlights: ["Improvement", "Stakeholder focus", "Sustained excellence"],
//     sections: [
//       {
//         heading: "Initiative Design",
//         text: "The institution develops programmes that respond to feedback, review findings, and priority areas for improvement.",
//       },
//       {
//         heading: "Campus Impact",
//         text: "These initiatives strengthen teaching, support systems, and the overall student experience.",
//       },
//       {
//         heading: "Continuous Growth",
//         text: "Quality initiatives enable the college to respond proactively to change and reinforce its commitment to excellence.",
//       },
//     ],
//     cta: { label: "View Reports", to: "/iqac/annual-reports" },
//   },
//   "iqac-activities": {
//     title: "IQAC Activities",
//     subtitle: "Quality assurance in action",
//     description: "Activities coordinated by the Internal Quality Assurance Cell to strengthen teaching, learning, institutional processes, and continuous improvement.",
//     highlights: ["Academic quality", "Institutional review", "Continuous improvement"],
//     sections: [
//       { heading: "Academic Initiatives", text: "Document workshops, curriculum reviews, faculty development, student support, and teaching-learning improvements coordinated through IQAC." },
//       { heading: "Institutional Activities", text: "Record audits, stakeholder feedback, quality reviews, and cross-department improvement initiatives." },
//       { heading: "Outcomes", text: "Share the impact of activities, follow-up actions, and improvements achieved across the institution." },
//     ],
//     cta: { label: "View IQAC Meetings", to: "/iqac/meetings" },
//   },
//   "iqac-annual-reports": {
//     title: "IQAC Annual Reports",
//     subtitle: "Institutional reporting",
//     description:
//       "Annual reports document the major quality initiatives, outcomes, and institutional progress achieved over the academic year.",
//     highlights: ["Annual review", "Progress record", "Accountability"],
//     sections: [
//       {
//         heading: "Report Content",
//         text: "The report captures key achievements, quality initiatives, governance updates, and student-focused improvements.",
//       },
//       {
//         heading: "Learning Cycle",
//         text: "Annual review helps the institution assess effectiveness and prioritize future actions.",
//       },
//       {
//         heading: "Stakeholder Value",
//         text: "Reports provide transparency and evidence of the college’s commitment to quality enhancement.",
//       },
//     ],
//     cta: { label: "View Archive", to: "/iqac/archive" },
//   },
//   "iqac-archive": {
//     title: "IQAC Archive",
//     subtitle: "Records and documentation",
//     description:
//       "The archive preserves institutional quality records, reports, meeting outcomes, and supporting documentation for future review.",
//     highlights: ["Records", "Documentation", "Institutional memory"],
//     sections: [
//       {
//         heading: "Historic Record",
//         text: "The archive keeps the campus’s quality journey documented for planning, audit, and reference.",
//       },
//       {
//         heading: "Working Resource",
//         text: "It supports future reviews, policy changes, and strategic institutional learning.",
//       },
//       {
//         heading: "Access & Transparency",
//         text: "Maintaining archived records promotes accountability and continuity across academic cycles.",
//       },
//     ],
//     cta: { label: "Back to IQAC", to: "/iqac" },
//   },
//   "naac-overview": {
//     title: "NAAC Overview",
//     subtitle: "Accreditation information",
//     description:
//       "The National Assessment and Accreditation Council provides a framework to assess institutional quality across academic and operational dimensions.",
//     highlights: ["Accreditation", "Quality review", "Institutional assurance"],
//     sections: [
//       {
//         heading: "Purpose",
//         text: "The accreditation process helps the institution review strengths, identify gaps, and improve quality in a structured way.",
//       },
//       {
//         heading: "Quality Benchmark",
//         text: "NAAC frameworks encourage sustainability, transparency, and evidence-based institutional development.",
//       },
//       {
//         heading: "Campus improvement",
//         text: "The process supports stronger teaching, governance, infrastructure, and student support experiences.",
//       },
//     ],
//     cta: { label: "View Criteria", to: "/naac/criteria" },
//   },
//   "naac-criteria": {
//     title: "NAAC Criteria",
//     subtitle: "Quality assessment dimensions",
//     description:
//       "NAAC criteria guide the college’s review across curricular, teaching, outreach, governance, infrastructure, and student support areas.",
//     highlights: ["Curriculum", "Infrastructure", "Governance"],
//     sections: [
//       {
//         heading: "Assessment Framework",
//         text: "Criteria-based review helps institutions assess quality and document progress across key functions.",
//       },
//       {
//         heading: "Data and Evidence",
//         text: "Evidence-based documentation supports accurate assessment and strategic planning for improvement.",
//       },
//       {
//         heading: "Institutional Growth",
//         text: "The criteria structure helps departments and teams align improvement work with institutional objectives.",
//       },
//     ],
//     cta: { label: "Explore Extension Profile", to: "/extension-profile" },
//   },
//   "naac-ssr": {
//     title: "SSR",
//     subtitle: "Self Study Report",
//     description: "Access the institution's Self Study Report submitted for NAAC assessment.",
//     pdfUrl: "",
//     highlights: [],
//     sections: [],
//     cta: { label: "View AQAR", to: "/naac/aqar" },
//   },
//   "naac-dvv": {
//     title: "DVV Clarifications",
//     subtitle: "Supportive documentation",
//     description:
//       "DVV clarifications provide formal responses to data validation and verification questions raised by the accreditation process.",
//     highlights: ["Verification", "Clarified data", "Compliance"],
//     sections: [
//       {
//         heading: "Validation",
//         text: "The institution responds to queries with documented evidence and process-based explanations.",
//       },
//       {
//         heading: "Quality Assurance",
//         text: "This step reinforces confidence in the authenticity and completeness of institutional data.",
//       },
//       {
//         heading: "Institutional Integrity",
//         text: "The exercise strengthens transparency, accountability, and quality assurance across all processes.",
//       },
//     ],
//     cta: { label: "View NAAC Documents", to: "/naac/documents" },
//   },
//   "naac-documents": {
//     title: "NAAC Documents",
//     subtitle: "Accreditation records",
//     description:
//       "This section houses core accreditation records, reports, and institutional documents for quality review and reference.",
//     highlights: ["Documentation", "Accreditation support", "Reference files"],
//     sections: [
//       {
//         heading: "Official Records",
//         text: "NAAC documentation helps maintain a clear and traceable record of institutional quality initiatives and compliance.",
//       },
//       {
//         heading: "Institutional Access",
//         text: "These records support transparency, internal planning, and visible accountability.",
//       },
//       {
//         heading: "Long-term Use",
//         text: "Documented evidence helps the institution prepare for future reviews and strategic planning.",
//       },
//     ],
//     cta: { label: "Explore Certificates", to: "/naac/certificates" },
//   },
//   "naac-certificates": {
//     title: "NAAC Certificates",
//     subtitle: "Recognition documents",
//     description:
//       "Certificates and recognition documents reflect the institution’s accredited status and long-term quality commitment.",
//     highlights: ["Recognition", "Accreditation", "Institutional confidence"],
//     sections: [
//       {
//         heading: "Recognition",
//         text: "Approved accreditation certificates validate institutional quality and compliance with assessment standards.",
//       },
//       {
//         heading: "Public Trust",
//         text: "Recognition strengthens confidence among students, parents, and partner institutions.",
//       },
//       {
//         heading: "Institutional Legacy",
//         text: "These records celebrate ongoing progress and the college’s commitment to excellence.",
//       },
//     ],
//     cta: { label: "View Affiliation Docs", to: "/naac/affiliation" },
//   },
//   "naac-affiliation": {
//     title: "Affiliation Documents",
//     subtitle: "Academic approvals",
//     description:
//       "Affiliation and approval documents establish the college’s formal academic standing and recognition within the larger system.",
//     highlights: ["Recognition", "Academic standing", "Official approvals"],
//     sections: [
//       {
//         heading: "Academic Recognition",
//         text: "These documents reflect the institution’s formal standing, approvals, and compliance with educational regulations.",
//       },
//       {
//         heading: "Operational Trust",
//         text: "Affiliation records assure stakeholders that the institution functions within recognized academic frameworks.",
//       },
//       {
//         heading: "Institutional Responsibility",
//         text: "Proper documentation supports quality assurance and a transparent academic environment.",
//       },
//     ],
//     cta: { label: "Back to Accreditation", to: "/naac" },
//   },
//   "accreditation-nirf": {
//     title: "NIRF Ranking",
//     subtitle: "National rankings",
//     description:
//       "NIRF participation reflects the institution’s commitment to transparent quality reporting and public accountability.",
//     highlights: ["National ranking", "Performance review", "Public accountability"],
//     sections: [
//       {
//         heading: "Institutional Commitment",
//         text: "Ranking frameworks encourage continuous improvement across learning, outreach, and resource development.",
//       },
//       {
//         heading: "Academic Strength",
//         text: "Participation in national comparisons helps identify areas of excellence and opportunities for enhancement.",
//       },
//       {
//         heading: "Progress Orientation",
//         text: "Ranking and benchmarking support a strategic, evidence-based approach to institutional development.",
//       },
//     ],
//     cta: { label: "View AISHE", to: "/accreditation/aishe" },
//   },
//   "accreditation-aishe": {
//     title: "AISHE",
//     subtitle: "Higher education data",
//     description:
//       "AISHE helps the institution provide recognized educational data and institutional insights to the national higher education system.",
//     highlights: ["Educational data", "National reporting", "Institutional visibility"],
//     sections: [
//       {
//         heading: "Data Reporting",
//         text: "The institution contributes official information that supports benchmarking and national education analysis.",
//       },
//       {
//         heading: "Decision Support",
//         text: "Data reporting strengthens planning, policy response, and institutional visibility.",
//       },
//       {
//         heading: "Quality Culture",
//         text: "Evidence-based reporting remains central to transparent, accountable, and quality-conscious education management.",
//       },
//     ],
//     cta: { label: "View UGC Recognition", to: "/accreditation/ugc" },
//   },
//   "accreditation-ugc": {
//     title: "UGC Recognition",
//     subtitle: "2(f) & 12(B)",
//     description:
//       "UGC recognition reflects the institution’s formal standing and institutional credibility within the higher education framework.",
//     highlights: ["Formal recognition", "Academic credibility", "Institutional trust"],
//     sections: [
//       {
//         heading: "Recognition Status",
//         text: "These approvals underscore the institution’s eligibility and commitment to recognized higher education standards.",
//       },
//       {
//         heading: "Academic Governance",
//         text: "Recognition provides a foundation for structured planning, compliance, and institutional growth.",
//       },
//       {
//         heading: "Public Confidence",
//         text: "Official recognition strengthens confidence among students, faculty, and the wider academic community.",
//       },
//     ],
//     cta: { label: "View Affiliations", to: "/accreditation/affiliation" },
//   },
//   "accreditation-affiliation": {
//     title: "University Affiliation",
//     subtitle: "Academic linkage",
//     description:
//       "University affiliation defines the institution’s academic linkage and its adherence to recognized standards and regulations.",
//     highlights: ["Academic linkage", "Compliance", "Standards"],
//     sections: [
//       {
//         heading: "Academic Structure",
//         text: "Affiliation supports curriculum alignment, oversight, and academic coordination with the parent university system.",
//       },
//       {
//         heading: "Institutional Standards",
//         text: "The arrangement helps maintain recognized academic practices and quality benchmarks across departments.",
//       },
//       {
//         heading: "Ongoing Governance",
//         text: "Affiliation remains an important element of academic accountability and formal institutional recognition.",
//       },
//     ],
//     cta: { label: "View Approvals", to: "/accreditation/approvals" },
//   },
//   "accreditation-approvals": {
//     title: "Recognition & Approvals",
//     subtitle: "Institutional approvals",
//     description:
//       "Recognition and approvals reflect the institution’s compliance with policy, quality expectations, and effective institutional governance.",
//     highlights: ["Approvals", "Compliance", "Institutional accountability"],
//     sections: [
//       {
//         heading: "Governance Confidence",
//         text: "Institutional approvals show that the college is recognized for its operational and academic framework.",
//       },
//       {
//         heading: "Academic Value",
//         text: "Such recognition supports strategic development and public confidence in the quality of the institution.",
//       },
//       {
//         heading: "Future Readiness",
//         text: "Approvals help the institution plan for improved quality, outreach, and policy development.",
//       },
//     ],
//     cta: { label: "View Mandatory Disclosure", to: "/mandatory-disclosure" },
//   },
//   "mandatory-disclosure": {
//     title: "Mandatory Disclosure",
//     subtitle: "Public information",
//     description:
//       "Mandatory disclosure provides essential information about institutional policies, governance, resources, and student-facing practices.",
//     highlights: ["Public information", "Transparency", "Governance"],
//     sections: [
//       {
//         heading: "Information Access",
//         text: "The section ensures stakeholders can access important public information about the institution and its operations.",
//       },
//       {
//         heading: "Transparency",
//         text: "This fosters trust, compliance, and a more informed relationship with students, parents, and the public.",
//       },
//       {
//         heading: "Accountability",
//         text: "Open disclosure reinforces institutional accountability and responsible governance.",
//       },
//     ],
//     cta: { label: "View RTI", to: "/mandatory-disclosure/rti" },
//   },
//   "mandatory-disclosure-rti": {
//     title: "Right to Information (RTI)",
//     subtitle: "Transparency & access",
//     description:
//       "RTI information supports the public’s right to access relevant institutional records and information in a transparent manner.",
//     highlights: ["Transparency", "Access", "Public information"],
//     sections: [
//       {
//         heading: "Information Access",
//         text: "The institution aims to provide timely and appropriate information in line with established legal and governance frameworks.",
//       },
//       {
//         heading: "Public Trust",
//         text: "Accessible information strengthens accountability, trust, and effective administration.",
//       },
//       {
//         heading: "Administrative Clarity",
//         text: "Clear communication ensures that stakeholders understand institutional processes and responsibilities.",
//       },
//     ],
//     cta: { label: "View Profiles", to: "/mandatory-disclosure/profile" },
//   },
//   "mandatory-disclosure-profile": {
//     title: "Institution Profile",
//     subtitle: "Overview of the institution",
//     description:
//       "The institution profile provides essential background, structure, and operational facts for students, stakeholders, and regulators.",
//     highlights: ["Profile", "Background", "Institutional overview"],
//     sections: [
//       {
//         heading: "Institutional Details",
//         text: "The profile summarizes academic focus, governance, programmes, and campus characteristics.",
//       },
//       {
//         heading: "Stakeholder Value",
//         text: "A clear institutional profile supports informed decisions for students, parents, and academic partners.",
//       },
//       {
//         heading: "Public Information",
//         text: "It helps present the college’s mission, strengths, and identity clearly and consistently.",
//       },
//     ],
//     cta: { label: "View Policies", to: "/mandatory-disclosure/policies" },
//   },
//   "mandatory-disclosure-policies": {
//     title: "Policies & Manuals",
//     subtitle: "Governance documents",
//     description:
//       "Policies and manuals govern academic operations, student welfare, administration, and institutional conduct.",
//     highlights: ["Governance", "Processes", "Academic standards"],
//     sections: [
//       {
//         heading: "Framework",
//         text: "Policies establish a clear governance and operational framework across the institution.",
//       },
//       {
//         heading: "Consistency",
//         text: "They help ensure fairness, clarity, and uniformity in decision-making and administrative practice.",
//       },
//       {
//         heading: "Accountability",
//         text: "A structured policy ecosystem strengthens the institution’s commitments to transparency and quality.",
//       },
//     ],
//     cta: { label: "View Code of Conduct", to: "/mandatory-disclosure/code-of-conduct" },
//   },
//   "mandatory-disclosure-code-of-conduct": {
//     title: "Code of Conduct",
//     subtitle: "Behavioral expectations",
//     description:
//       "The code of conduct sets expectations for academic integrity, professionalism, respect, and responsible campus behavior.",
//     highlights: ["Ethics", "Respect", "Professional conduct"],
//     sections: [
//       {
//         heading: "Campus Values",
//         text: "The code emphasizes integrity, respect, inclusion, and professional behavior across campus activities.",
//       },
//       {
//         heading: "Student Welfare",
//         text: "Clear standards help create a supportive, disciplined, and respectful environment for all.",
//       },
//       {
//         heading: "Governance",
//         text: "The code contributes to a safe and constructive teaching and learning environment.",
//       },
//     ],
//     cta: { label: "View Service Rules", to: "/mandatory-disclosure/service-rules" },
//   },
//   "mandatory-disclosure-service-rules": {
//     title: "Service Rules",
//     subtitle: "Institutional standards",
//     description:
//       "Service rules outline responsibilities, procedures, and expectations for staff, faculty, and administrative operations.",
//     highlights: ["Operational clarity", "Staff standards", "Responsible conduct"],
//     sections: [
//       {
//         heading: "Framework",
//         text: "They establish consistent expectations for professional conduct, accountability, and institutional process.",
//       },
//       {
//         heading: "Service Quality",
//         text: "Strong service standards support effective administration and a respectful working environment.",
//       },
//       {
//         heading: "Operational Excellence",
//         text: "Clear procedures help teams perform consistently and build institutional trust.",
//       },
//     ],
//     cta: { label: "View HR Policy", to: "/mandatory-disclosure/hr-policy" },
//   },
//   "mandatory-disclosure-hr-policy": {
//     title: "HR Policy",
//     subtitle: "Human resource framework",
//     description:
//       "The HR policy supports fair, transparent, and efficient personnel management across the institution.",
//     highlights: ["Fairness", "Talent support", "Professional development"],
//     sections: [
//       {
//         heading: "People and Process",
//         text: "The policy protects equitable treatment, responsibility, and professionalism in institutional operations.",
//       },
//       {
//         heading: "Development",
//         text: "It supports employee welfare, capacity building, and a positive campus work culture.",
//       },
//       {
//         heading: "Institutional Stability",
//         text: "A sound HR framework strengthens the organization’s long-term performance and culture.",
//       },
//     ],
//     cta: { label: "Back to Home", to: "/" },
//   },
//   "committees-iqac": { title: "IQAC", subtitle: "Committee information", description: "This page provides quality assurance committee information and institutional oversight details.", highlights: ["Oversight", "Planning", "Quality assurance"], sections: [{ heading: "Mission", text: "The IQAC committee supports quality enhancement and institutional excellence across academic and administrative areas." }, { heading: "Outcome", text: "This committee ensures strategic review, accountability, and continuous improvement across the campus." }], cta: { label: "Explore IQAC", to: "/iqac" } },
//   "committees-anti-ragging": { title: "Anti-Ragging Committee", subtitle: "Student safety and discipline", description: "The anti-ragging committee ensures a safe, respectful campus environment and prevents harassment or intimidation.", highlights: ["Safety", "Discipline", "Respect"], sections: [{ heading: "Purpose", text: "The committee monitors compliance and promotes a secure campus atmosphere for all students." }, { heading: "Support", text: "Students can approach the committee for grievances, counseling, and safe reporting channels." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-grievance": { title: "Grievance Redressal Cell", subtitle: "Student support", description: "The grievance redressal cell listens to concerns and facilitates fair resolution of academic or institutional issues.", highlights: ["Fair process", "Support", "Resolution"], sections: [{ heading: "Purpose", text: "The cell ensures that student and staff concerns are addressed with transparency and respect." }, { heading: "Process", text: "Issues are reviewed through defined procedures to ensure timely and impartial responses." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-icc": { title: "Internal Complaints Committee (ICC)", subtitle: "Equity and respect", description: "The ICC supports a safe and inclusive campus culture by addressing complaints related to workplace and campus conduct.", highlights: ["Equity", "Safety", "Support"], sections: [{ heading: "Role", text: "The committee helps ensure a respectful, safe, and professional environment for all members of the campus community." }, { heading: "Action", text: "It addresses complaints through defined processes while safeguarding dignity and fairness." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-sc-st": { title: "SC/ST Cell", subtitle: "Support and inclusion", description: "The SC/ST cell supports access, inclusion, and welfare for students and staff from Scheduled Caste and Scheduled Tribe communities.", highlights: ["Inclusion", "Support", "Equity"], sections: [{ heading: "Support", text: "The cell promotes inclusion and connects students with welfare resources and academic support." }, { heading: "Purpose", text: "It helps create a more supportive and equitable campus experience for all learners." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-obc": { title: "OBC Cell", subtitle: "Scholarship & support", description: "The OBC cell helps students access welfare, guidance, and support services aligned with their needs and entitlements.", highlights: ["Support", "Inclusion", "Well-being"], sections: [{ heading: "Role", text: "The cell ensures students receive guidance, encouragement, and access to relevant opportunities and support systems." }, { heading: "Mission", text: "It promotes inclusive growth and a stronger student support network." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-minority": { title: "Minority Cell", subtitle: "Support and advocacy", description: "The minority cell works to create a supportive and inclusive environment for students from minority communities.", highlights: ["Inclusion", "Support", "Advocacy"], sections: [{ heading: "Support", text: "The cell promotes well-being, access to opportunities, and a respectful campus culture." }, { heading: "Purpose", text: "It encourages a more inclusive and empowering educational environment for all students." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-divyang": { title: "Divyang Cell", subtitle: "Accessibility & inclusion", description: "The Divyang cell works to create accessible and enabling learning conditions for differently-abled students and staff.", highlights: ["Accessibility", "Inclusion", "Support"], sections: [{ heading: "Focus", text: "The cell supports equitable access, inclusive facilities, and assistive resources for accessibility." }, { heading: "Outcome", text: "It helps create a more comfortable, respectful, and inclusive campus experience." }], cta: { label: "Back to Home", to: "/" } },
//   "committees-student-welfare": { title: "Student Welfare Committee", subtitle: "Student well-being", description: "The student welfare committee promotes well-being, support systems, and positive student experiences across campus activities.", highlights: ["Well-being", "Support", "Student care"], sections: [{ heading: "Role", text: "The committee works to improve guidance, counseling, engagement, and campus support for students." }, { heading: "Impact", text: "It strengthens a caring environment where students can learn, grow, and succeed." }], cta: { label: "Back to Home", to: "/" } },
// };

// function StaticPage({ pageKey, title, subtitle, description, highlights, sections, cta }) {
//   const fallbackPage = pageMap[pageKey] || { title, subtitle, description, highlights, sections, cta };
//   const [databasePage, setDatabasePage] = useState(null);

//   useEffect(() => {
//     let cancelled = false;

//     const loadPage = async () => {
//       try {
//         let response = await fetch(`${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`);

//         if (response.status === 404 && fallbackPage) {
//           await fetch(`${API_BASE}/api/site-pages/seed`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ pages: [{ page_key: pageKey, content: fallbackPage }] }),
//           });
//           response = await fetch(`${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`);
//         }

//         if (!response.ok) return;
//         const result = await response.json();
//         if (!cancelled && result.success) setDatabasePage(result.data.content);
//       } catch (error) {
//         console.error("SITE PAGE CONTENT ERROR:", error);
//       }
//     };

//     loadPage();
//     return () => {
//       cancelled = true;
//     };
//   }, [pageKey]);

//   const page = pageKey === "about" || pageKey === "founder"
//     ? fallbackPage
//     : databasePage || fallbackPage;
//   const theme = themeMap[pageKey] || themeMap.default;

//   const items = page.highlights || ["Academic excellence", "Student growth", "Quality learning"];
//   const content = page.sections || [
//     {
//       heading: "Overview",
//       text: page.description || "This page provides essential institutional information for students, parents, and stakeholders.",
//     },
//   ];

//   if (pageKey === "naac-ssr") {
//     const pdfUrl = page.pdfUrl?.startsWith("http")
//       ? page.pdfUrl
//       : page.pdfUrl
//         ? `${API_BASE}${page.pdfUrl}`
//         : "";

//     return (
//       <div className="min-h-screen bg-white text-slate-800">
//         <TopBar />
//         <Navbar />
//         <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
//           <header className="border-b border-slate-200 pb-6">
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">NAAC Accreditation</p>
//             <h1 className="mt-2 text-3xl font-bold text-slate-900">{page.title || "SSR"}</h1>
//             <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{page.description}</p>
//           </header>
//           <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-6">
//             <div>
//               <h2 className="font-semibold text-slate-900">Self Study Report</h2>
//               <p className="mt-1 text-sm text-slate-500">Official SSR document</p>
//             </div>
//             {pdfUrl ? (
//               <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#0f3262] px-4 py-3 text-sm font-semibold text-white hover:bg-[#19477f]">
//                 <FileText size={17} /> Open SSR PDF
//               </a>
//             ) : (
//               <span className="text-sm text-slate-500">SSR PDF not uploaded</span>
//             )}
//           </section>
//           <div className="pt-6">
//             <Link to={page.cta?.to || "/naac/aqar"} className="text-sm font-semibold text-blue-800 hover:underline">
//               {page.cta?.label || "View AQAR"} →
//             </Link>
//           </div>
//         </main>
//         <PublicFooter />
//       </div>
//     );
//   }

//   if (pageKey === "iqac-coordinator") {
//     const profile = page.profile || {};
//     const photoUrl = profile.photo?.startsWith("http")
//       ? profile.photo
//       : profile.photo
//         ? `${API_BASE}${profile.photo}`
//         : "";
//     const profilePdfUrl = profile.pdf?.startsWith("http")
//       ? profile.pdf
//       : profile.pdf
//         ? `${API_BASE}${profile.pdf}`
//         : "";
//     const profileDetails = [
//       ["Name", profile.name],
//       ["Designation", profile.designation],
//       ["Qualification", profile.qualification],
//       ["Department", profile.department],
//       ["Contact No.", profile.phone],
//       ["Email", profile.email],
//       ["Experience", profile.experience],
//       ["Major Research Subject", profile.majorResearchSubject || profile.coreSubject],
//       ["Research", profile.research],
//     ];

//     return (
//       <div className="min-h-screen bg-white text-slate-800">
//         <TopBar />
//         <Navbar />
//         <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
//           <header className="border-b border-slate-200 pb-6">
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{page.subtitle}</p>
//             <h1 className="mt-2 text-3xl font-bold text-slate-900">{page.title}</h1>
//             <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{page.description}</p>
//           </header>

//           <section className="grid gap-7 py-8 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
//             <div>
//               <div className="aspect-[4/5] w-full overflow-hidden border border-slate-200 bg-slate-100">
//                 {photoUrl ? (
//                   <img src={photoUrl} alt={profile.name || "IQAC Coordinator"} className="h-full w-full object-cover" />
//                 ) : (
//                   <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
//                     <UserRound size={58} strokeWidth={1.2} />
//                     <span className="text-xs font-medium">Profile photo</span>
//                   </div>
//                 )}
//               </div>
//               {profilePdfUrl ? (
//                 <a
//                   href={profilePdfUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="mt-3 inline-flex w-full items-center justify-center gap-2 bg-[#0f3262] px-3 py-3 text-sm font-semibold text-white hover:bg-[#19477f]"
//                 >
//                   <Download size={16} /> Download Profile PDF
//                 </a>
//               ) : (
//                 <button type="button" disabled className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-500">
//                   <FileText size={16} /> Profile PDF not uploaded
//                 </button>
//               )}
//             </div>

//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Coordinator</p>
//               <h2 className="mt-2 text-2xl font-bold text-slate-900">{profile.name || "IQAC Coordinator"}</h2>

//               <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
//                 {profileDetails.map(([label, value]) => (
//                   <div key={label} className="grid gap-2 py-3 sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-3">
//                     <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                       {label === "Contact No." && <Phone size={15} />}
//                       {label === "Email" && <Mail size={15} />}
//                       {label}
//                     </dt>
//                     <dd className="min-w-0 break-words text-sm leading-6 text-slate-600">
//                       {label === "Contact No." && value ? <a href={`tel:${value}`} className="text-blue-800 hover:underline">{value}</a> : null}
//                       {label === "Email" && value ? <a href={`mailto:${value}`} className="text-blue-800 hover:underline">{value}</a> : null}
//                       {label !== "Contact No." && label !== "Email" ? value || "Not provided" : null}
//                       {(label === "Contact No." || label === "Email") && !value ? "Not provided" : null}
//                     </dd>
//                   </div>
//                 ))}
//               </dl>

//             </div>

//             <div className="space-y-6 md:col-span-2 lg:col-span-1">
//               {content.map((block, index) => (
//                 <article key={`${block.heading}-${index}`} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
//                   <h3 className="text-lg font-semibold text-slate-900">{block.heading}</h3>
//                   <p className="mt-2 text-sm leading-7 text-slate-600">{block.text}</p>
//                 </article>
//               ))}
//             </div>
//           </section>
//         </main>
//         <PublicFooter />
//       </div>
//     );
//   }

//   if (pageKey === "about" || pageKey === "founder") {
//     const isFounder = pageKey === "founder";
//     const sourceLink = isFounder ? page.photoSource : page.cta?.to;
//     const callToAction = page.cta;

//     return (
//       <div className="min-h-screen bg-white text-slate-800">
//         <TopBar />
//         <Navbar />
//         <main>
//           <header className="border-b border-slate-200 bg-[#f4f6f5]">
//             <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#946700]">
//                 {page.subtitle}
//               </p>
//               <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-[#12345b] sm:text-4xl">
//                 {page.title}
//               </h1>
//               <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
//                 {page.description}
//               </p>
//             </div>
//           </header>

//           {isFounder ? (
//             <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-8 lg:py-12">
//               <figure className="mx-auto w-full max-w-[220px] md:mx-0">
//                 <img
//                   src={page.photo}
//                   alt={page.photoAlt}
//                   className="aspect-[3/4] w-full border border-slate-200 object-cover object-top"
//                   loading="lazy"
//                 />
//                 <figcaption className="mt-2 text-xs text-slate-500">
//                   Portrait via <a href={sourceLink} target="_blank" rel="noreferrer" className="font-medium text-[#12345b] underline underline-offset-2">Tuljabhavani College</a>
//                 </figcaption>
//               </figure>

//               <div className="min-w-0">
//                 <ul className="mb-5 flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-200 pb-4 text-sm font-semibold text-slate-700">
//                   {page.highlights.map((item) => <li key={item}>{item}</li>)}
//                 </ul>
//                 <div className="divide-y divide-slate-200 border-t border-slate-200">
//                   {page.sections.map((section) => (
//                     <article key={section.heading} className="py-5 first:pt-5">
//                       <h2 className="text-lg font-semibold text-[#12345b]">{section.heading}</h2>
//                       <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{section.text}</p>
//                     </article>
//                   ))}
//                 </div>
//                 <Link to={callToAction.to} className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#d9a31b] pb-2 text-sm font-semibold text-[#12345b] hover:text-[#946700]">
//                   {callToAction.label}<ArrowUpRight size={16} aria-hidden="true" />
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <div className="mx-auto grid max-w-7xl gap-10 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-12">
//               <section aria-label="Sanstha information" className="divide-y divide-slate-200 border-y border-slate-200">
//                 {page.sections.map((section) => (
//                   <article key={section.heading} className="py-6 first:pt-6">
//                     <h2 className="text-lg font-semibold text-[#12345b]">{section.heading}</h2>
//                     <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{section.text}</p>
//                   </article>
//                 ))}
//               </section>

//               <aside className="border-t-4 border-[#d9a31b] pt-4 lg:border-t-0 lg:border-l lg:border-slate-200 lg:border-l-2 lg:pl-6">
//                 <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Sanstha at a glance</p>
//                 <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
//                   {page.highlights.map((item) => (
//                     <li key={item} className="py-3 text-sm font-semibold leading-6 text-slate-700">{item}</li>
//                   ))}
//                 </ul>
//                 <a
//                   href={callToAction.to}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="mt-6 inline-flex items-center gap-2 bg-[#12345b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4a78]"
//                 >
//                   {callToAction.label}<ArrowUpRight size={16} aria-hidden="true" />
//                 </a>
//               </aside>
//             </div>
//           )}
//         </main>
//         <PublicFooter />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 text-slate-800">
//       <TopBar />
//       <Navbar />

//       <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
//         <section className="border-b border-slate-200 pb-7">
//           <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
//             {page.subtitle || "Information"}
//           </p>
//           <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{page.title}</h1>
//           <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
//             {page.description}
//           </p>

//           <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
//             {items.map((item, index) => (
//               <span
//                 key={`${item}-${index}`}
//                 className="text-xs font-semibold text-slate-600"
//               >
//                 {item}
//               </span>
//             ))}
//           </div>
//         </section>

//         <div className="mt-8 grid gap-5 md:grid-cols-3">
//           {content.map((block, index) => (
//             <div
//               key={`${block.heading}-${index}`}
//               className="rounded-2xl border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur-sm"
//               style={{ borderLeft: `4px solid ${theme.accent}` }}
//             >
//               <h2 className="text-lg font-semibold" style={{ color: theme.accent }}>{block.heading}</h2>
//               <p className="mt-3 text-sm leading-6 text-slate-600">{block.text}</p>
//             </div>
//           ))}
//         </div>

//         {page.cta || cta ? (
//           <div className="mt-10 flex justify-center">
//             <Link
//               to={page.cta?.to || cta?.to || "/"}
//               className="inline-flex items-center gap-2 rounded-full bg-[#0f3262] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#153d72]"
//             >
//               {page.cta?.label || cta?.label || "Go to page"}
//               <span aria-hidden="true">→</span>
//             </Link>
//           </div>
//         ) : null}
//       </main>

//       <PublicFooter />
//     </div>
//   );
// }

// export default StaticPage;



import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  UserRound,
} from "lucide-react";

import TopBar from "./header/TopBar";
import Navbar from "./navbar/Navbar";
import PublicFooter from "./Footer/PublicFooter";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ============================================================
   THEME MAP
   ============================================================ */

const themeMap = {
  default: {
    accent: "#1d4ed8",
    soft: "#eff6ff",
  },

  about: {
    accent: "#0f3262",
    soft: "#eff6ff",
  },

  founder: {
    accent: "#0f3262",
    soft: "#eff6ff",
  },

  chairman: {
    accent: "#0f3262",
    soft: "#eff6ff",
  },

  principal: {
    accent: "#0f3262",
    soft: "#eff6ff",
  },

  admissions: {
    accent: "#0f5d4f",
    soft: "#ecfdf5",
  },

  academics: {
    accent: "#1d4ed8",
    soft: "#eff6ff",
  },

  library: {
    accent: "#7c3aed",
    soft: "#f5f3ff",
  },

  research: {
    accent: "#0369a1",
    soft: "#f0f9ff",
  },

  iqac: {
    accent: "#1e40af",
    soft: "#eff6ff",
  },

  naac: {
    accent: "#1e3a8a",
    soft: "#eff6ff",
  },

  accreditation: {
    accent: "#334155",
    soft: "#f8fafc",
  },

  committees: {
    accent: "#0369a1",
    soft: "#f0f9ff",
  },

  "mandatory-disclosure": {
    accent: "#475569",
    soft: "#f8fafc",
  },
};

/* ============================================================
   FALLBACK PAGE DATA
   Database content will override this automatically.
   ============================================================ */

export const pageMap = {
  alumni: {
    title: "Alumni Association",
    subtitle: "Stay connected. Give back. Grow together.",
    description:
      "The Alumni Association connects former students with the college and one another through shared experiences, mentorship, events, and continued involvement in campus life.",
    highlights: ["Alumni network", "Mentorship", "Events"],
    sections: [
      {
        heading: "Alumni Association",
        text:
          "Former students can stay connected, share their experiences, and contribute to the continuing growth of the college.",
      },
      {
        heading: "Registration and Documents",
        text:
          "Publish alumni association registration details and official certificates or documents here.",
      },
      {
        heading: "Alumni Events",
        text:
          "Share alumni meetings, reunions, guest sessions, and upcoming events with former students.",
      },
    ],
  },
  about: {
    sansthaContentVersion: 2,
    title: "Sanstha Overview",
    subtitle: "Shri Swami Vivekanand Shikshan Sanstha, Kolhapur",
    description: "",
    highlights: [
      "Established in 1954 by late Shikshanmaharshi Dr. Bapuji Salunkhe.",
      "Named after the Indian philosopher Swami Vivekananda.",
      "Works to educate rural and economically disadvantaged students.",
      "Serves 13 districts in Maharashtra and one district in Karnataka.",
      "More than 2 lakh students study across 330+ educational and cultural centres.",
      "Its network includes schools, colleges, training institutions, hostels, and a residential school.",
      "Its motto promotes education through knowledge, science, and culture.",
      "Dr. Bapuji Salunkhe received the Dalit Mitra award and an honorary D.Litt. from Shivaji University.",
    ],
    sections: [],
    cta: {
      label: "Explore Vivekanand Shikshan Sanstha, Kolhapur",
      url: "https://www.vivekanandshikshansanstha.edu.in/",
      external: true,
    },
  },
  "college-overview": {
    title: "College Overview",
    subtitle: "Tuljabhavani Mahavidyalaya, Tuljapur",
    description:
      "The college is committed to academic excellence, inclusive learning, student development, and institutional growth rooted in values, discipline, and service.",
    highlights: [
      "Strong academic culture",
      "Student-focused learning",
      "Community and values orientation",
    ],
    sections: [
      {
        heading: "About the College",
        text:
          "Tuljabhavani Mahavidyalaya is dedicated to providing quality higher education in a supportive and disciplined environment. It encourages students to grow academically, socially, and personally.",
      },
      {
        heading: "Learning environment",
        text:
          "The institution promotes strong teaching-learning practices, student engagement, co-curricular development, and career-oriented learning to help learners realise their potential.",
      },
      {
        heading: "Values and mission",
        text:
          "The college continues to build on the vision of educational service by strengthening academic progress, character development, and active participation in society.",
      },
    ],
    cta: {
      label: "Explore Sanstha",
      url: "https://www.vivekanandshikshansanstha.edu.in/",
      external: true,
    },
  },

  founder: {
    title: "Late Dr. Bapuji Salunkhe",
    subtitle: "Shikshanmaharshi and Founder of Shri Swami Vivekanand Shikshan Sanstha",
    description:
      "Dr. Bapuji Salunkhe, known as Govindrao Dnyanoji Salunkhe, was a visionary educationist whose life was devoted to expanding access to learning. In 1954, he founded Shri Swami Vivekanand Shikshan Sanstha with his colleagues, beginning an enduring educational mission rooted in knowledge, character, and service.",
    highlights: [
      "Founder of Shri Swami Vivekanand Shikshan Sanstha",
      "Educationist and social reformer",
      "Recognized with the Dalit Mitra title",
      "Conferred an honorary D.Litt. by Shivaji University",
    ],
    sections: [
      {
        heading: "Early life and education",
        text:
          "Born in Rampur village in the Patan region of Satara district, Govindrao Dnyanoji Salunkhe lost both parents during his childhood and pursued education despite hardship. He earned his Bachelor of Arts degree in 1945 and completed teacher training in 1949. Inspired by Mahatma Gandhi, his family and community came to know him affectionately as Bapuji.",
      },
      {
        heading: "A career in education and public service",
        text:
          "Bapuji began his education career in 1940. He later served as a teacher and headmaster with Rayat Shikshan Sanstha, where he helped develop Mahatma Gandhi Vidyalaya at Rukadi. His commitment to public service also led him to participate in the Quit India movement and support educational causes in the Satara region.",
      },
      {
        heading: "The founding of the Sanstha",
        text:
          "On 19 October 1954, Bapuji and his colleagues laid the foundation of a new educational institution at Karad. Named after Swami Vivekananda, Shri Swami Vivekanand Shikshan Sanstha was registered on 31 December 1954 and began its work in June 1955. What began as a shared educational mission grew to serve students across Maharashtra and Karnataka.",
      },
      {
        heading: "A philosophy of knowledge and character",
        text:
          "Bapuji's educational philosophy joined the pursuit of knowledge with its thoughtful application in life. He emphasized truth, morality, honesty, service, sacrifice, and the development of good character. The Sanstha's motto, “Dnyan, Vidnyan ani Susanskar Yasathi Shikshan Prasar,” reflects this enduring vision.",
      },
      {
        heading: "Dedication and recognition",
        text:
          "Bapuji devoted his life and personal resources to the growth of the Sanstha and the communities it served. In recognition of his contribution to education and service to disadvantaged communities, the Government of Maharashtra honoured him with the title Dalit Mitra. Shivaji University, Kolhapur, conferred on him an honorary D.Litt., and he is remembered with respect as Shikshanmaharshi.",
      },
    ],
    profile: {
      name: "Late Shikshanmaharshi Dr. Bapuji Salunkhe",
      designation: "Educationist, social reformer, and institution builder",
      birthplace: "Rampur, Patan, Satara district",
      education: "B.A. (1945); teacher training (1949)",
      recognition: "Dalit Mitra; honorary D.Litt., Shivaji University",
      photo: "",
      pdf: "",
    },
    cta: {
      label: "Explore the Vivekanand Shikshan Sanstha, Kolhapur",
      url: "https://www.vivekanandshikshansanstha.edu.in/",
    },
  },

  chairman: {
    title: "Chairman",
    subtitle: "Management",
    description:
      "Information about the Chairman and institutional management.",
    highlights: [
      "Institutional leadership",
      "Management vision",
      "Educational development",
    ],
    sections: [
      {
        heading: "Chairman's Message",
        text:
          "The management is committed to supporting quality education, institutional development and student welfare.",
      },
    ],
    profile: {
      name: "",
      designation: "Founder",
      photo: "",
      pdf: "",
    },
  },

  "students-era": {
    contentVersion: 2,
    title: "Students' Era",
    subtitle: "Student development, participation, and campus life",
    description: "Explore opportunities that support students' academic growth, well-being, creativity, leadership, and participation in college life.",
    highlights: ["Learn and lead", "Participate and contribute", "Build skills for the future"],
    sections: [
      {
        heading: "A place to grow",
        text: "Students' Era brings together the activities, facilities, guidance, and opportunities that help learners develop beyond the classroom.",
        items: ["Leadership and service", "Culture and sport", "Career preparation and student support"],
      },
    ],
    resources: [],
  },

  "students-era-ncc": {
    contentVersion: 3,
    title: "National Cadet Corps",
    subtitle: "Unity and Discipline",
    description: "The National Cadet Corps aims to develop character, comradeship, discipline, leadership, secular outlook, spirit of adventure, sportsmanship, and selfless service among young people.",
    highlights: ["Cadet awards and recognitions", "Training and camp achievements", "Participation in institutional and national events"],
    sections: [
      { heading: "About NCC", text: "The National Cadet Corps is a youth development movement that provides opportunities for students to grow through discipline, teamwork, leadership, and responsible citizenship.", items: ["College NCC unit and enrollment information", "Training and camp participation", "Current notices and unit updates"] },
      { heading: "Aims and objectives", text: "NCC seeks to create an organized, trained, and motivated youth resource; develop leadership and service; and provide a suitable environment for students considering a career in the Armed Forces.", items: ["Develop character and personality", "Build self-confidence, physical fitness, and courage", "Learn skills useful in emergencies and daily life"] },
      { heading: "The NCC motto", text: "“Unity and Discipline” (Ekta aur Anushasan) expresses the spirit of national integration, mutual respect, and the discipline needed for individual and collective progress." },
    ],
    resources: [],
  },

  "students-era-nss": {
    contentVersion: 2,
    title: "National Service Scheme",
    subtitle: "Student participation and service learning",
    description: "The National Service Scheme connects student learning with civic responsibility. Use this page to publish current NSS unit information, activities, and reports.",
    highlights: ["Student participation", "Civic responsibility", "Learning through service"],
    sections: [
      { heading: "About NSS", text: "Introduce the college NSS unit, its aims, coordinators, and how students can participate in its programmes.", items: ["Unit information", "Participation details", "Notices and reports"] },
      { heading: "Programmes and learning", text: "Publish verified updates about NSS programmes, awareness activities, and learning experiences.", items: ["Civic awareness", "Social responsibility", "Activity documentation"] },
    ],
    resources: [],
  },

  "students-era-cultural-activities": {
    contentVersion: 2,
    title: "Cultural Activities",
    subtitle: "Students' Era",
    description: "A space to celebrate student creativity, cultural expression, and participation in college events.",
    highlights: ["Creative expression", "Campus events", "Student participation"],
    sections: [
      { heading: "Cultural life on campus", text: "Share information about cultural programmes, celebrations, and student-led activities organized by the college.", items: ["Performing arts", "Literary and creative activities", "College celebrations"] },
      { heading: "Take part", text: "Publish participation guidance, event announcements, and highlights from completed activities.", items: ["Upcoming opportunities", "Participation details", "Event highlights"] },
    ],
    resources: [],
  },

  "students-era-womens-empowerment": {
    contentVersion: 2,
    title: "Women's Empowerment",
    subtitle: "Students' Era",
    description: "Information about initiatives that support women's education, awareness, participation, and well-being on campus.",
    highlights: ["Equal opportunity", "Awareness and confidence", "Student well-being"],
    sections: [
      { heading: "Support and empowerment", text: "Describe the college's relevant support structures, initiatives, and ways students can access guidance.", items: ["Student guidance", "Awareness activities", "Inclusive participation"] },
      { heading: "Activities and resources", text: "Publish verified programme details, activity summaries, and related student resources.", items: ["Workshops and talks", "Health and safety awareness", "Related documents"] },
    ],
    resources: [],
  },

  "students-era-sports": {
    contentVersion: 2,
    title: "Sports",
    subtitle: "Students' Era",
    description: "Discover opportunities for students to participate in sports, physical activity, and college sporting events.",
    highlights: ["Participation", "Fitness and teamwork", "Sports achievements"],
    sections: [
      { heading: "Sports at the college", text: "Use this page to introduce available sports, facilities, coaches, and participation opportunities.", items: ["Sports and activities", "Training information", "Student participation"] },
      { heading: "Events and achievements", text: "Share verified details of competitions, college events, and student achievements.", items: ["Event announcements", "Competition results", "Achievement highlights"] },
    ],
    resources: [],
  },

  "students-era-gym": {
    contentVersion: 2,
    title: "Gym",
    subtitle: "Students' Era",
    description: "Information about fitness facilities and guidance available to support student health and well-being.",
    highlights: ["Fitness and well-being", "Facility information", "Safe participation"],
    sections: [
      { heading: "Fitness facilities", text: "Add current details about the college gym, available equipment, access arrangements, and operating schedule.", items: ["Facility and equipment", "Access and timings", "Usage guidance"] },
      { heading: "Fitness guidance", text: "Publish verified information about safe exercise practices and any support available to students.", items: ["Safe use", "Student guidance", "Health and well-being"] },
    ],
    resources: [],
  },

  "students-era-career-guidance": {
    contentVersion: 2,
    title: "Career Guidance and Counselling",
    subtitle: "Students' Era",
    description: "Career guidance and counselling help students explore pathways, build confidence, and make informed academic and professional choices.",
    highlights: ["Career awareness", "Personal guidance", "Employability skills"],
    sections: [
      { heading: "Guidance and counselling", text: "Introduce the college's career guidance and counselling support, including contact details and how students can access it.", items: ["Career and course guidance", "Individual counselling", "Student referrals and support"] },
      { heading: "Skills and opportunities", text: "Publish current information about workshops, career talks, aptitude support, and other employability initiatives.", items: ["Resume and interview preparation", "Career awareness sessions", "Learning and development resources"] },
    ],
    resources: [],
  },

  "students-era-seminars": {
    contentVersion: 2,
    title: "Seminars",
    subtitle: "Students' Era",
    description: "Seminars and conferences create opportunities for students to engage with ideas, subject knowledge, and expert perspectives.",
    highlights: ["Knowledge sharing", "Academic engagement", "Student participation"],
    sections: [
      { heading: "Seminars and conferences", text: "Publish details of seminars, conferences, workshops, and guest sessions organized by the college.", items: ["Programme title and date", "Organizing department", "Speaker and participation details"] },
      { heading: "Reports and proceedings", text: "Add summaries, photographs, attendance details, and related reports after each event.", items: ["Event reports", "Photo gallery", "Certificates and documents"] },
    ],
    resources: [],
  },

  "students-era-placements": {
    contentVersion: 2,
    title: "Placements",
    subtitle: "Students' Era",
    description: "Placement information helps students prepare for employment and connect with opportunities shared through the college.",
    highlights: ["Career readiness", "Opportunity updates", "Student preparation"],
    sections: [
      { heading: "Placement support", text: "Add current information about the college placement support, eligibility, process, and contact person.", items: ["Placement cell information", "Registration and eligibility", "Student guidance"] },
      { heading: "Opportunities and outcomes", text: "Publish verified employer opportunities, recruitment schedules, and placement outcomes when available.", items: ["Recruitment notices", "Preparation resources", "Verified placement reports"] },
    ],
    resources: [],
  },

  principal: {
    title: "Principal",
    subtitle: "Academic Leadership",
    description:
      "Message and profile of the Principal of the institution.",
    highlights: [
      "Academic leadership",
      "Quality education",
      "Student development",
    ],
    sections: [
      {
        heading: "Principal's Message",
        text:
          "The institution is committed to academic excellence, holistic student development, quality enhancement and meaningful community engagement.",
      },
    ],
  },

  "iqac-about": {
    title: "About IQAC",
    subtitle: "Internal Quality Assurance Cell",
    description:
      "Information about the Internal Quality Assurance Cell and its role in institutional quality enhancement.",
    highlights: [
      "Quality assurance",
      "Continuous improvement",
      "Academic and administrative quality",
    ],
    sections: [
      {
        heading: "Internal Quality Assurance Cell",
        text:
          "IQAC facilitates the development of a quality culture within the institution through continuous monitoring, documentation, review and improvement of academic and administrative processes.",
      },
      {
        heading: "Major Functions",
        text:
          "The IQAC coordinates quality initiatives, prepares quality reports, promotes good practices and supports institutional planning and continuous improvement.",
      },
    ],
  },

  "iqac-vision-mission": {
    title: "IQAC Vision & Mission",
    subtitle: "Quality Enhancement",
    description:
      "Vision, mission and quality objectives of the Internal Quality Assurance Cell.",
    highlights: [
      "Quality culture",
      "Continuous improvement",
      "Institutional excellence",
    ],
    sections: [
      {
        heading: "Vision",
        text:
          "To promote a sustainable quality culture and continuous improvement across academic and administrative activities.",
      },
      {
        heading: "Mission",
        text:
          "To facilitate quality enhancement through systematic planning, monitoring, documentation and stakeholder participation.",
      },
    ],
  },

  "iqac-committee": {
    title: "IQAC Committee",
    subtitle: "Internal Quality Assurance Cell",
    description:
      "Details of the Internal Quality Assurance Cell committee.",
    highlights: [
      "IQAC composition",
      "Institutional representation",
      "Quality assurance responsibilities",
    ],
    sections: [
      {
        heading: "IQAC Committee",
        text:
          "The IQAC committee consists of representatives from relevant institutional and stakeholder groups as prescribed by applicable quality assurance guidelines.",
      },
    ],
  },

  "iqac-coordinator": {
    title: "IQAC Coordinator",
    subtitle: "Internal Quality Assurance Cell",
    description:
      "Profile and responsibilities of the IQAC Coordinator.",
    highlights: [
      "IQAC coordination",
      "Quality initiatives",
      "Institutional documentation",
    ],
    profile: {
      name: "",
      designation: "IQAC Coordinator",
      qualification: "",
      department: "",
      phone: "",
      email: "",
      experience: "",
      coreSubject: "",
      majorResearchSubject: "",
      research: "",
      photo: "",
      profilePdf: "",
    },
    sections: [
      {
        heading: "Role of the IQAC Coordinator",
        text:
          "The IQAC Coordinator coordinates quality assurance activities, institutional documentation, quality initiatives and reporting processes.",
      },
    ],
  },

  "iqac-minutes": {
    title: "IQAC Minutes",
    subtitle: "Meetings and Proceedings",
    description:
      "Minutes and proceedings of Internal Quality Assurance Cell meetings.",
    highlights: [
      "IQAC meetings",
      "Proceedings",
      "Quality decisions",
    ],
    sections: [
      {
        heading: "IQAC Meeting Minutes",
        text:
          "Meeting minutes and related documents are maintained for institutional quality assurance and documentation.",
      },
    ],
  },

  "iqac-action-taken": {
    title: "Action Taken Reports",
    subtitle: "IQAC",
    description:
      "Action Taken Reports based on IQAC recommendations and decisions.",
    highlights: [
      "Recommendations",
      "Actions implemented",
      "Quality improvement",
    ],
    sections: [
      {
        heading: "Action Taken Reports",
        text:
          "Action Taken Reports document the implementation status of decisions and recommendations arising from quality assurance activities.",
      },
    ],
  },

  "iqac-best-practices": {
    title: "Best Practices",
    subtitle: "IQAC",
    description:
      "Institutional best practices adopted for academic and administrative quality enhancement.",
    highlights: [
      "Good practices",
      "Quality enhancement",
      "Institutional innovation",
    ],
    sections: [
      {
        heading: "Institutional Best Practices",
        text:
          "The institution documents and promotes practices that contribute to academic quality, student development, community engagement and institutional effectiveness.",
      },
    ],
  },

  "iqac-distinctiveness": {
    title: "Institutional Distinctiveness",
    subtitle: "IQAC",
    description:
      "Distinctive characteristics and initiatives of the institution.",
    highlights: [
      "Institutional identity",
      "Distinctive initiatives",
      "Community contribution",
    ],
    sections: [
      {
        heading: "Institutional Distinctiveness",
        text:
          "The institution's distinctive initiatives reflect its academic priorities, community engagement and commitment to inclusive development.",
      },
    ],
  },

  "iqac-aaa": {
    title: "Academic & Administrative Audit",
    subtitle: "IQAC",
    description:
      "Academic and Administrative Audit documents and information.",
    highlights: [
      "Academic audit",
      "Administrative audit",
      "Quality improvement",
    ],
    sections: [
      {
        heading: "Academic & Administrative Audit",
        text:
          "Academic and administrative audits support systematic review, identification of improvement areas and strengthening of institutional processes.",
      },
    ],
  },

  "iqac-green-audit": {
    title: "Green Audit",
    subtitle: "IQAC",
    description:
      "Green Audit reports and environmental sustainability initiatives.",
    highlights: [
      "Environmental sustainability",
      "Green practices",
      "Resource conservation",
    ],
    sections: [
      {
        heading: "Green Audit",
        text:
          "The Green Audit documents institutional practices related to environmental sustainability, resource conservation and responsible campus management.",
      },
    ],
  },

  "iqac-energy-audit": {
    title: "Energy Audit",
    subtitle: "IQAC",
    description:
      "Energy Audit reports and energy conservation initiatives.",
    highlights: [
      "Energy conservation",
      "Energy efficiency",
      "Sustainable practices",
    ],
    sections: [
      {
        heading: "Energy Audit",
        text:
          "Energy audit activities help assess energy consumption and identify opportunities for conservation and improved efficiency.",
      },
    ],
  },

  "iqac-gender-audit": {
    title: "Gender Audit",
    subtitle: "IQAC",
    description:
      "Gender Audit information and institutional initiatives.",
    highlights: [
      "Gender equity",
      "Inclusive campus",
      "Student support",
    ],
    sections: [
      {
        heading: "Gender Audit",
        text:
          "The Gender Audit reviews institutional practices and initiatives supporting equity, inclusion and a safe learning environment.",
      },
    ],
  },

  "iqac-quality-initiatives": {
    title: "Quality Initiatives",
    subtitle: "IQAC",
    description:
      "Quality enhancement initiatives undertaken by the institution.",
    highlights: [
      "Quality enhancement",
      "Continuous improvement",
      "Institutional initiatives",
    ],
    sections: [
      {
        heading: "Quality Initiatives",
        text:
          "The institution undertakes various academic, administrative and student-centric initiatives to strengthen quality and institutional effectiveness.",
      },
    ],
  },

  "iqac-activities": {
    title: "IQAC Activities",
    subtitle: "Internal Quality Assurance Cell",
    description:
      "Activities and initiatives conducted by IQAC.",
    highlights: [
      "Quality activities",
      "Workshops and programmes",
      "Institutional improvement",
    ],
    sections: [
      {
        heading: "IQAC Activities",
        text:
          "IQAC activities include quality initiatives, awareness programmes, reviews, documentation and capacity-building activities.",
      },
    ],
  },

  "iqac-annual-reports": {
    title: "IQAC Annual Reports",
    subtitle: "Quality Documentation",
    description:
      "Annual reports and quality assurance documentation.",
    highlights: [
      "Annual reports",
      "Quality documentation",
      "Institutional progress",
    ],
    sections: [
      {
        heading: "Annual Reports",
        text:
          "Annual reports document the major quality initiatives, activities and institutional improvements undertaken during the academic year.",
      },
    ],
  },

  "iqac-archive": {
    title: "IQAC Archive",
    subtitle: "Quality Documents",
    description:
      "Archived IQAC documents and historical quality records.",
    highlights: [
      "Historical records",
      "IQAC documentation",
      "Quality initiatives",
    ],
    sections: [
      {
        heading: "IQAC Archive",
        text:
          "The archive provides access to selected historical IQAC records and quality assurance documents.",
      },
    ],
  },

  "naac-overview": {
    title: "NAAC Accreditation",
    subtitle: "Quality Assurance & Accreditation",
    description:
      "Information related to NAAC accreditation, institutional quality assurance and accreditation documentation.",
    highlights: [
      "NAAC accreditation",
      "Quality assurance",
      "Institutional documentation",
    ],
    sections: [
      {
        heading: "NAAC Accreditation",
        text:
          "This section provides institutional information and documentation related to NAAC accreditation and quality assurance.",
      },
    ],
  },

  "naac-criteria": {
    title: "NAAC Criteria",
    subtitle: "NAAC Accreditation",
    description:
      "Documentation and information related to the NAAC assessment criteria.",
    highlights: [
      "Criterion-wise documentation",
      "Quality indicators",
      "Supporting documents",
    ],
    sections: [
      {
        heading: "NAAC Criteria",
        text:
          "Criterion-wise institutional documentation is maintained to support the accreditation and quality assurance process.",
      },
    ],
  },

  "naac-ssr": {
    title: "Self Study Report",
    subtitle: "NAAC Accreditation",
    description:
      "Self Study Report submitted for institutional assessment and accreditation.",
    pdfUrl: "",
    highlights: [
      "Institutional profile",
      "Criterion-wise information",
      "Supporting documentation",
    ],
    sections: [
      {
        heading: "Self Study Report",
        text:
          "The Self Study Report presents institutional information, quality initiatives, achievements and supporting documentation for assessment.",
      },
    ],
  },

  "naac-dvv": {
    title: "DVV",
    subtitle: "Data Validation and Verification",
    description:
      "Data Validation and Verification documents and supporting information.",
    highlights: [
      "Data validation",
      "Verification documents",
      "Supporting evidence",
    ],
    sections: [
      {
        heading: "Data Validation and Verification",
        text:
          "This section provides documents and information related to Data Validation and Verification.",
      },
    ],
  },

  "naac-documents": {
    title: "NAAC Documents",
    subtitle: "Accreditation Documentation",
    description:
      "Important documents related to NAAC accreditation.",
    highlights: [
      "Accreditation documents",
      "Institutional records",
      "Supporting evidence",
    ],
    sections: [
      {
        heading: "NAAC Documents",
        text:
          "Important NAAC-related institutional documents are maintained in this section.",
      },
    ],
  },

  "naac-certificates": {
    title: "NAAC Certificates",
    subtitle: "Accreditation",
    description:
      "NAAC accreditation certificates and related documents.",
    highlights: [
      "Accreditation certificate",
      "Recognition documents",
      "Quality records",
    ],
    sections: [
      {
        heading: "NAAC Certificates",
        text:
          "Certificates and related accreditation documents are available here.",
      },
    ],
  },

  "naac-affiliation": {
    title: "Affiliation Documents",
    subtitle: "Institutional Accreditation",
    description:
      "University affiliation and related institutional documents.",
    highlights: [
      "University affiliation",
      "Recognition documents",
      "Institutional approvals",
    ],
    sections: [
      {
        heading: "Affiliation Documents",
        text:
          "University affiliation and institutional recognition documents are maintained for reference and transparency.",
      },
    ],
  },

  "accreditation-nirf": {
    title: "NIRF",
    subtitle: "Institutional Accreditation",
    description:
      "National Institutional Ranking Framework information and documents.",
    highlights: [
      "NIRF documentation",
      "Institutional data",
      "Ranking framework",
    ],
    sections: [
      {
        heading: "NIRF",
        text:
          "NIRF-related information and institutional documentation are maintained in this section.",
      },
    ],
  },

  "accreditation-aishe": {
    title: "AISHE",
    subtitle: "Institutional Data",
    description:
      "All India Survey on Higher Education information and documents.",
    highlights: [
      "AISHE data",
      "Institutional information",
      "Higher education statistics",
    ],
    sections: [
      {
        heading: "AISHE",
        text:
          "Institutional data and documents related to the All India Survey on Higher Education are maintained here.",
      },
    ],
  },

  "accreditation-ugc": {
    title: "UGC",
    subtitle: "Recognition & Regulations",
    description:
      "UGC recognition and related institutional documents.",
    highlights: [
      "UGC recognition",
      "Regulatory documents",
      "Institutional compliance",
    ],
    sections: [
      {
        heading: "UGC",
        text:
          "UGC-related recognition, regulatory and institutional documents are provided for public reference.",
      },
    ],
  },

  "accreditation-affiliation": {
    title: "University Affiliation",
    subtitle: "Institutional Recognition",
    description:
      "University affiliation details and supporting documents.",
    highlights: [
      "Affiliation details",
      "University documents",
      "Institutional recognition",
    ],
    sections: [
      {
        heading: "University Affiliation",
        text:
          "The college maintains current and historical affiliation-related documents for institutional records.",
      },
    ],
  },

  "accreditation-approvals": {
    title: "Approvals",
    subtitle: "Institutional Recognition",
    description:
      "Institutional approvals and recognition documents.",
    highlights: [
      "Approvals",
      "Recognition",
      "Regulatory documentation",
    ],
    sections: [
      {
        heading: "Approvals",
        text:
          "Relevant institutional approvals and recognition documents are maintained in this section.",
      },
    ],
  },

  "mandatory-disclosure": {
    title: "Mandatory Disclosure",
    subtitle: "Institutional Transparency",
    description:
      "Mandatory institutional information and public disclosures.",
    highlights: [
      "Institutional information",
      "Policies and regulations",
      "Public disclosure",
    ],
    sections: [
      {
        heading: "Mandatory Disclosure",
        text:
          "The institution provides important information and documents for transparency and public reference.",
      },
    ],
  },

  "mandatory-disclosure-rti": {
    title: "Right to Information",
    subtitle: "Mandatory Disclosure",
    description:
      "Information related to Right to Information provisions.",
    highlights: [
      "RTI information",
      "Public information",
      "Institutional transparency",
    ],
    sections: [
      {
        heading: "Right to Information",
        text:
          "Relevant information regarding institutional transparency and Right to Information provisions is provided here.",
      },
    ],
  },

  "mandatory-disclosure-profile": {
    title: "Institutional Profile",
    subtitle: "Mandatory Disclosure",
    description:
      "Essential institutional profile information.",
    highlights: [
      "Institutional profile",
      "Academic information",
      "Administrative information",
    ],
    sections: [
      {
        heading: "Institutional Profile",
        text:
          "Important institutional information is provided for students, stakeholders and the public.",
      },
    ],
  },

  "mandatory-disclosure-policies": {
    title: "Policies",
    subtitle: "Mandatory Disclosure",
    description:
      "Institutional policies and policy documents.",
    highlights: [
      "Institutional policies",
      "Governance",
      "Quality and compliance",
    ],
    sections: [
      {
        heading: "Institutional Policies",
        text:
          "The institution maintains policies that guide academic, administrative and student-related processes.",
      },
    ],
  },

  "mandatory-disclosure-code-of-conduct": {
    title: "Code of Conduct",
    subtitle: "Mandatory Disclosure",
    description:
      "Institutional code of conduct and related guidelines.",
    highlights: [
      "Code of conduct",
      "Institutional values",
      "Responsible behaviour",
    ],
    sections: [
      {
        heading: "Code of Conduct",
        text:
          "The institutional code of conduct provides guidelines for responsible and ethical behaviour within the college community.",
      },
    ],
  },

  "mandatory-disclosure-service-rules": {
    title: "Service Rules",
    subtitle: "Mandatory Disclosure",
    description:
      "Institutional service rules and related documents.",
    highlights: [
      "Service rules",
      "Staff regulations",
      "Institutional governance",
    ],
    sections: [
      {
        heading: "Service Rules",
        text:
          "Applicable institutional service rules and related documents are maintained for reference.",
      },
    ],
  },

  "mandatory-disclosure-hr-policy": {
    title: "Human Resource Policy",
    subtitle: "Mandatory Disclosure",
    description:
      "Institutional human resource policy and related documents.",
    highlights: [
      "Human resource policy",
      "Staff development",
      "Institutional governance",
    ],
    sections: [
      {
        heading: "Human Resource Policy",
        text:
          "The institutional human resource framework supports effective staff management, development and institutional growth.",
      },
    ],
  },

  "committees-iqac": {
    title: "IQAC Committee",
    subtitle: "Institutional Committees",
    description:
      "Internal Quality Assurance Cell committee.",
    highlights: [
      "Quality assurance",
      "Institutional monitoring",
      "Continuous improvement",
    ],
    sections: [
      {
        heading: "IQAC Committee",
        text:
          "Details of the Internal Quality Assurance Cell committee and its responsibilities are provided here.",
      },
    ],
  },

  "committees-anti-ragging": {
    title: "Anti-Ragging Committee",
    subtitle: "Institutional Committees",
    description:
      "Anti-Ragging Committee and related institutional measures.",
    highlights: [
      "Anti-ragging measures",
      "Student safety",
      "Awareness",
    ],
    sections: [
      {
        heading: "Anti-Ragging Committee",
        text:
          "The institution undertakes appropriate preventive and awareness measures to maintain a safe and respectful campus environment.",
      },
    ],
  },

  "committees-grievance": {
    title: "Grievance Redressal Committee",
    subtitle: "Institutional Committees",
    description:
      "Grievance redressal mechanism and committee information.",
    highlights: [
      "Grievance redressal",
      "Student support",
      "Transparent mechanism",
    ],
    sections: [
      {
        heading: "Grievance Redressal",
        text:
          "The institution provides mechanisms for receiving, reviewing and addressing grievances in accordance with applicable rules.",
      },
    ],
  },

  "committees-icc": {
    title: "Internal Complaints Committee",
    subtitle: "Institutional Committees",
    description:
      "Internal Complaints Committee and related institutional provisions.",
    highlights: [
      "Safe campus",
      "Prevention and awareness",
      "Grievance mechanism",
    ],
    sections: [
      {
        heading: "Internal Complaints Committee",
        text:
          "The committee supports awareness, prevention and appropriate redressal mechanisms within the institutional framework.",
      },
    ],
  },

  "committees-sc-st": {
    title: "SC / ST Committee",
    subtitle: "Institutional Committees",
    description:
      "SC / ST Committee and student support initiatives.",
    highlights: [
      "Student support",
      "Inclusive education",
      "Institutional assistance",
    ],
    sections: [
      {
        heading: "SC / ST Committee",
        text:
          "The committee supports institutional mechanisms intended to promote inclusion, awareness and student support.",
      },
    ],
  },

  "committees-obc": {
    title: "OBC Committee",
    subtitle: "Institutional Committees",
    description:
      "OBC Committee and student support initiatives.",
    highlights: [
      "Student support",
      "Inclusive education",
      "Awareness",
    ],
    sections: [
      {
        heading: "OBC Committee",
        text:
          "The committee supports student awareness and institutional assistance within the applicable framework.",
      },
    ],
  },

  "committees-minority": {
    title: "Minority Committee",
    subtitle: "Institutional Committees",
    description:
      "Minority Committee and student support initiatives.",
    highlights: [
      "Student support",
      "Inclusive campus",
      "Awareness",
    ],
    sections: [
      {
        heading: "Minority Committee",
        text:
          "The committee supports inclusion, awareness and student assistance within the institutional framework.",
      },
    ],
  },

  "committees-divyang": {
    title: "Divyang Committee",
    subtitle: "Institutional Committees",
    description:
      "Committee supporting accessibility and inclusion.",
    highlights: [
      "Accessibility",
      "Inclusive education",
      "Student support",
    ],
    sections: [
      {
        heading: "Divyang Committee",
        text:
          "The institution promotes accessibility and appropriate support for students with disabilities.",
      },
    ],
  },

  "committees-student-welfare": {
    title: "Student Welfare Committee",
    subtitle: "Institutional Committees",
    description:
      "Student welfare initiatives and committee information.",
    highlights: [
      "Student welfare",
      "Support services",
      "Student development",
    ],
    sections: [
      {
        heading: "Student Welfare",
        text:
          "The committee supports initiatives related to student welfare, development and institutional support services.",
      },
    ],
  },
};


/* ============================================================
   HELPERS
   ============================================================ */

function getTheme(pageKey) {
  if (!pageKey) return themeMap.default;

  if (themeMap[pageKey]) {
    return themeMap[pageKey];
  }

  const prefix = Object.keys(themeMap).find((key) =>
    pageKey.startsWith(`${key}-`)
  );

  return prefix ? themeMap[prefix] : themeMap.default;
}

function resolveFileUrl(fileUrl) {
  if (!fileUrl) return "";

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://") ||
    fileUrl.startsWith("blob:")
  ) {
    return fileUrl;
  }

  if (fileUrl.startsWith("/")) {
    return `${API_BASE}${fileUrl}`;
  }

  return `${API_BASE}/${fileUrl}`;
}

const legacyFounderDescription = "Information about the founder and the vision behind the establishment and development of the institution.";
const legacyFounderSections = [
  {
    heading: "Founder",
    text: "The institution was established with a vision of expanding access to quality education and creating opportunities for students and the community.",
  },
  {
    heading: "Vision and Contribution",
    text: "The founding vision continues to guide the institution's commitment to education, social development and community service.",
  },
];

export function normalizeFounderContent(content = {}) {
  const defaults = pageMap.founder;
  const sectionsAreLegacyDefaults = Array.isArray(content.sections)
    && content.sections.length === legacyFounderSections.length
    && content.sections.every((section, index) =>
      section.heading === legacyFounderSections[index].heading
      && section.text === legacyFounderSections[index].text
    );
  const highlightsAreLegacyDefaults = Array.isArray(content.highlights)
    && content.highlights.join("|") === "Institutional foundation|Educational vision|Contribution to society";

  return {
    ...defaults,
    ...content,
    title: !content.title || content.title === "Founder" ? defaults.title : content.title,
    subtitle: !content.subtitle || content.subtitle === "Our Institutional Foundation"
      ? defaults.subtitle
      : content.subtitle,
    description: !content.description || content.description === legacyFounderDescription
      ? defaults.description
      : content.description,
    highlights: !Array.isArray(content.highlights) || highlightsAreLegacyDefaults
      ? defaults.highlights
      : content.highlights,
    sections: !Array.isArray(content.sections) || sectionsAreLegacyDefaults
      ? defaults.sections
      : content.sections,
    profile: {
      ...defaults.profile,
      ...(content.profile || {}),
      name: content.profile?.name || defaults.profile.name,
      designation: !content.profile?.designation || content.profile.designation === "Founder"
        ? defaults.profile.designation
        : content.profile.designation,
      birthplace: content.profile?.birthplace || defaults.profile.birthplace,
      education: content.profile?.education || defaults.profile.education,
      recognition: content.profile?.recognition || defaults.profile.recognition,
    },
  };
}

function normalizePage(page) {
  if (!page || typeof page !== "object") {
    return {};
  }

  return {
    ...page,
    highlights: Array.isArray(page.highlights)
      ? page.highlights
      : [],
    sections: Array.isArray(page.sections)
      ? page.sections
      : [],
  };
}

/* ============================================================
   SSR PAGE
   ============================================================ */

function SSRPage({ page, theme }) {
  const pdfUrl = resolveFileUrl(page.pdfUrl);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <Navbar />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div
              className="mb-4 text-sm font-medium"
              style={{ color: theme.accent }}
            >
              NAAC / Accreditation
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {page.title || "Self Study Report"}
            </h1>

            {page.subtitle && (
              <p className="mt-3 text-base text-slate-600">
                {page.subtitle}
              </p>
            )}

            {page.description && (
              <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                {page.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white shadow-sm"
                  style={{ backgroundColor: theme.accent }}
                >
                  <FileText size={17} />
                  View / Download SSR
                  <ExternalLink size={15} />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-5 py-3 text-sm font-medium text-slate-500">
                  <FileText size={17} />
                  SSR PDF not uploaded
                </div>
              )}

              <Link
                to="/naac/aqar"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                AQAR
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {page.sections?.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {page.sections.map((section, index) => (
              <section
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.heading}
                </h2>

                {section.text && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {section.text}
                  </p>
                )}
              </section>
            ))}

          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

/* ============================================================
   IQAC COORDINATOR PAGE
   ============================================================ */

function IQACCoordinatorPage({ page, theme }) {
  const profile = page.profile || {};

  const photoUrl = resolveFileUrl(profile.photo);
  const profilePdfUrl = resolveFileUrl(profile.profilePdf);

  const profileDetails = [
    ["Designation", profile.designation],
    ["Qualification", profile.qualification],
    ["Department", profile.department],
    ["Experience", profile.experience],
    ["Core Subject", profile.coreSubject],
    ["Major Research Subject", profile.majorResearchSubject],
    ["Research", profile.research],
    ["Phone", profile.phone],
    ["Email", profile.email],
  ].filter((item) => item[1]);

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <Navbar />

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div
              className="mb-3 text-sm font-medium"
              style={{ color: theme.accent }}
            >
              IQAC / Coordinator
            </div>

            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="mt-2 text-base text-slate-600">
                {page.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex justify-center">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={profile.name || "IQAC Coordinator"}
                  className="h-64 w-52 rounded-md border border-slate-200 object-cover"
                />
              ) : (
                <div
                  className="flex h-64 w-52 items-center justify-center rounded-md text-center text-sm text-slate-400"
                  style={{ backgroundColor: theme.soft }}
                >
                  Photo not available
                </div>
              )}
            </div>

            <h2 className="mt-5 text-center text-lg font-semibold text-slate-900">
              {profile.name || "IQAC Coordinator"}
            </h2>

            {profile.designation && (
              <p className="mt-1 text-center text-sm text-slate-500">
                {profile.designation}
              </p>
            )}

            {profilePdfUrl && (
              <a
                href={profilePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white"
                style={{ backgroundColor: theme.accent }}
              >
                <Download size={16} />
                Download Profile
              </a>
            )}
          </aside>

          <div className="space-y-6">
            {profileDetails.length > 0 && (
              <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Profile Details
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {profileDetails.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-2 px-6 py-4 sm:grid-cols-[220px_1fr]"
                    >
                      <div className="text-sm font-medium text-slate-500">
                        {label}
                      </div>
                      <div className="text-sm text-slate-800">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {page.description && (
              <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="leading-7 text-slate-600">
                  {page.description}
                </p>
              </section>
            )}

            {page.sections?.map((section, index) => (
              <section
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div
                  className="mb-4 border-l-4 pl-4"
                  style={{ borderColor: theme.accent }}
                >
                  <h2 className="text-lg font-semibold text-slate-900">
                    {section.heading}
                  </h2>
                </div>

                {section.text && (
                  <p className="whitespace-pre-line leading-7 text-slate-600">
                    {section.text}
                  </p>
                )}
              </section>
            ))}

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

/* ============================================================
   ABOUT / FOUNDER PAGE
   ============================================================ */

function AboutPage({ page, pageKey, theme }) {
  const isFounder = pageKey === "founder";
  const isSansthaOverview = pageKey === "about";

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <Navbar />

      {isFounder ? (
        <section className="border-b border-blue-950 bg-gradient-to-br from-[#0b2444] via-[#123c69] to-[#1d5688] text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
            {page.profile?.photo ? (
              <img
                src={resolveFileUrl(page.profile.photo)}
                alt={page.profile.name || page.title}
                className="size-36 rounded-full border-4 border-white/80 object-cover shadow-xl shadow-black/20 sm:size-44"
              />
            ) : (
              <div className="flex size-36 items-center justify-center rounded-full border-4 border-white/80 bg-white/10 text-white shadow-xl shadow-black/20 sm:size-44" aria-label="Founder portrait placeholder">
                <UserRound size={72} strokeWidth={1.1} />
              </div>
            )}
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              {page.profile?.designation || "Founder"}
            </p>
            <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {page.profile?.name || page.title}
            </h1>
            {page.subtitle && <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 sm:text-base">{page.subtitle}</p>}
          </div>
        </section>
      ) : isSansthaOverview ? (
        <section className="relative overflow-hidden border-b border-[#071f3d] bg-gradient-to-br from-[#0b2444] via-[#123c69] to-[#1d5688] text-white">
          <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-8 -top-16 size-56 rounded-full border border-amber-300/15" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-blue-100">
              <Link to="/" className="transition hover:text-amber-300">Home</Link>
              <span className="mx-2 text-blue-300">/</span>
              <span className="text-white">About</span>
            </nav>
            <div className="max-w-4xl border-l-4 border-amber-400 pl-5 sm:pl-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-sm">
                Our parent institution
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {page.title || "Sanstha Overview"}
              </h1>
              {page.subtitle && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg">
                  {page.subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" aria-hidden="true" />
        </section>
      ) : (
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-3 text-sm font-medium" style={{ color: theme.accent }}>
                About the College
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{page.title}</h1>
              {page.subtitle && <p className="mt-2 text-base text-slate-600">{page.subtitle}</p>}
            </div>
          </div>
        </section>
      )}

      {isFounder ? (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <article className="mx-auto max-w-4xl">
            {page.description && (
              <p className="border-b border-slate-200 pb-8 text-lg leading-8 text-slate-700 sm:text-xl sm:leading-9">
                {page.description}
              </p>
            )}
            {page.sections?.map((section, index) => (
              <section key={`${section.heading}-${index}`} className="border-b border-slate-200 py-8 last:border-b-0 sm:py-10">
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[#a45a1b]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0f3262] sm:text-2xl">
                      {section.heading || `Biography ${index + 1}`}
                    </h2>
                    {section.text && (
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-slate-700 sm:text-base">
                        {section.text}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </article>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.profile?.pdf && (
              <a
                href={resolveFileUrl(page.profile.pdf)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0f3262] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19477f]"
              >
                <FileText size={16} /> View founder document <ExternalLink size={14} />
              </a>
            )}
            {page.cta?.label && (page.cta.url || page.cta.to) && (
              <a
                href={page.cta.url || page.cta.to}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#0f3262] bg-white px-4 py-3 text-sm font-semibold text-[#0f3262] transition hover:bg-blue-50"
              >
                {page.cta.label} <ExternalLink size={15} />
              </a>
            )}
          </div>
        </main>
      ) : isSansthaOverview ? (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {page.description && (
            <p className="mb-8 max-w-4xl border-l-4 border-amber-400 pl-5 text-base leading-8 text-slate-700 sm:text-lg">
              {page.description}
            </p>
          )}

          <section aria-labelledby="sanstha-facts-heading">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-9 bg-amber-500" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Our institution</p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0f3262] pb-4">
              <h2 id="sanstha-facts-heading" className="text-2xl font-bold tracking-tight text-[#0f3262] sm:text-3xl">
                A legacy of educational service
              </h2>
              <span className="text-sm font-semibold text-slate-500">
                {(page.highlights || []).slice(0, 10).length} key facts
              </span>
            </div>

            <ol className="mt-2 grid gap-x-12 md:grid-cols-2">
              {(page.highlights || []).slice(0, 10).map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-4 border-b border-slate-200 py-5 sm:py-6">
                  <span className="mt-0.5 shrink-0 font-serif text-lg font-bold text-amber-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7 text-slate-700 sm:text-base">{item}</p>
                </li>
              ))}
            </ol>
          </section>

          {page.cta?.label && (page.cta.url || page.cta.to) && (
            <div className="mt-9 border-t border-slate-200 pt-7">
              <a
                href={page.cta.url || page.cta.to}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0f3262] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#071f3d] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                {page.cta.label}
                <ExternalLink size={16} />
              </a>
            </div>
          )}
        </main>
      ) : (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {page.description && (
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="leading-7 text-slate-600">{page.description}</p>
                </section>
              )}
              {page.sections?.map((section, index) => (
                <section key={index} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 border-l-4 pl-4" style={{ borderColor: theme.accent }}>
                    <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
                  </div>
                  {section.text && <p className="whitespace-pre-line leading-7 text-slate-600">{section.text}</p>}
                </section>
              ))}
              {page.cta?.label && (page.cta.url || page.cta.to) && (
                <a href={page.cta.url || page.cta.to} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#0f3262] px-5 py-3 text-sm font-semibold text-white hover:bg-[#19477f]">
                  {page.cta.label} <ExternalLink size={15} />
                </a>
              )}
            </div>
            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Institutional Highlights</h2>
              <div className="mt-5 space-y-4">
                {(page.highlights || []).map((item, index) => (
                  <div key={index} className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: theme.accent }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      )}

      <PublicFooter />
    </div>
  );
}

/* ============================================================
   GENERIC STATIC PAGE
   ============================================================ */

export default function StaticPage({
  pageKey,
  title,
  subtitle,
  description,
  highlights,
  sections,
  cta,
}) {
  const fallbackPage = useMemo(() => {
    return (
      pageMap[pageKey] || {
        title: title || "Institutional Information",
        subtitle: subtitle || "",
        description:
          description ||
          "This page provides important institutional information.",
        highlights:
          highlights || [
            "Academic excellence",
            "Student development",
            "Institutional quality",
          ],
        sections:
          sections || [
            {
              heading: "Overview",
              text:
                description ||
                "This page provides important institutional information for students, parents and stakeholders.",
            },
          ],
        cta: cta || null,
      }
    );
  }, [
    pageKey,
    title,
    subtitle,
    description,
    highlights,
    sections,
    cta,
  ]);

  const [databasePage, setDatabasePage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      setLoading(true);

      try {
        let response = await fetch(
          `${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`
        );

        /*
         * If the page does not exist in the database,
         * seed the fallback page once.
         */
        if (response.status === 404 && fallbackPage) {
          try {
            await fetch(`${API_BASE}/api/site-pages/seed`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pages: [
                  {
                    page_key: pageKey,
                    content: fallbackPage,
                  },
                ],
              }),
            });

            response = await fetch(
              `${API_BASE}/api/site-pages/${encodeURIComponent(pageKey)}`
            );
          } catch (seedError) {
            console.error(
              "SITE PAGE SEED ERROR:",
              seedError
            );
          }
        }

        if (!response.ok) {
          if (!cancelled) {
            setDatabasePage(null);
          }

          return;
        }

        const result = await response.json();

        if (
          !cancelled &&
          result &&
          result.success &&
          result.data
        ) {
          const content =
            result.data.content || result.data;

          setDatabasePage(normalizePage(content));
        }
      } catch (error) {
        console.error(
          "SITE PAGE CONTENT ERROR:",
          error
        );

        if (!cancelled) {
          setDatabasePage(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (pageKey) {
      loadPage();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [pageKey, fallbackPage]);

  const sansthaFallbackContentIsNewer =
    pageKey === "about" &&
    Number(databasePage?.sansthaContentVersion || 0) < pageMap.about.sansthaContentVersion;
  const mergedPage = {
    ...fallbackPage,
    ...(databasePage || {}),
    ...(sansthaFallbackContentIsNewer
      ? {
          title: fallbackPage.title,
          subtitle: fallbackPage.subtitle,
          description: fallbackPage.description,
          highlights: fallbackPage.highlights,
          sections: fallbackPage.sections,
          cta: fallbackPage.cta,
          sansthaContentVersion: fallbackPage.sansthaContentVersion,
        }
      : {}),
    profile: {
      ...(fallbackPage.profile || {}),
      ...(databasePage?.profile || {}),
    },
  };
  const page = normalizePage(pageKey === "founder" ? normalizeFounderContent(mergedPage) : mergedPage);

  const theme = getTheme(pageKey);
  const isStudentsEraPage = pageKey?.startsWith("students-era");

  /* ==========================================================
     SPECIAL PAGES
     ========================================================== */

  if (pageKey === "naac-ssr") {
    return <SSRPage page={page} theme={theme} />;
  }

  if (pageKey === "iqac-coordinator") {
    return (
      <IQACCoordinatorPage
        page={page}
        theme={theme}
      />
    );
  }

  if (
    pageKey === "about" ||
    pageKey === "founder"
  ) {
    return (
      <AboutPage
        page={page}
        pageKey={pageKey}
        theme={theme}
      />
    );
  }

  /* ==========================================================
     GENERIC PAGE
     ========================================================== */

  const items =
    page.highlights?.length > 0
      ? page.highlights
      : [
          "Academic excellence",
          "Student development",
          "Institutional quality",
        ];

  const pageSections =
    page.sections?.length > 0
      ? page.sections
      : [
          {
            heading: "Overview",
            text:
              page.description ||
              "This page provides essential institutional information for students, parents and stakeholders.",
          },
        ];
  const resources = (page.resources || [])
    .filter((resource) => resource.is_active !== false && resource.is_active !== 0 && resource.is_active !== "0")
    .sort((left, right) => Number(left.display_order || 0) - Number(right.display_order || 0));

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <Navbar />

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <section className="border-b bg-white">
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isStudentsEraPage ? "py-8" : "py-10"}`}>
          <div className="max-w-5xl">
            <div
              className="mb-3 text-sm font-medium"
              style={{ color: theme.accent }}
            >
              {page.subtitle || "Institutional Information"}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {page.title || title || "Institutional Information"}
            </h1>

            {(page.description || description) && (
              <p className={`${isStudentsEraPage ? "mt-3" : "mt-4"} max-w-4xl text-base leading-7 text-slate-600`}>
                {page.description || description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <main className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isStudentsEraPage ? "py-8" : "py-10"}`}>
        {loading && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
            Loading institutional information...
          </div>
        )}

        {/* Highlights */}

        {items.length > 0 && (
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0"
                  style={{ color: theme.accent }}
                />

                <span className="text-sm font-medium leading-6 text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Content */}

        <div className="grid gap-6 lg:grid-cols-3">
          {pageSections.map((section, index) => (
            <section
              key={index}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div
                className="mb-5 border-l-4 pl-4"
                style={{
                  borderColor: theme.accent,
                }}
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {section.heading ||
                    `Section ${index + 1}`}
                </h2>
              </div>

              {isStudentsEraPage && resources.length > 0 && (
                <section className="mt-8" aria-label="Student resources and gallery">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource, index) => (
                      <article key={`${resource.title || "resource"}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        {resource.imageUrl && (
                          <img src={resolveFileUrl(resource.imageUrl)} alt={resource.title || "Students' Era resource"} loading="lazy" className="aspect-[4/3] w-full bg-slate-100 object-cover" />
                        )}
                        <div className="p-5">
                          <h2 className="font-semibold text-slate-900">{resource.title || "Student resource"}</h2>
                          {resource.description && <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>}
                          {resource.pdfUrl && (
                            <a href={resolveFileUrl(resource.pdfUrl)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline">
                              <FileText size={16} /> {resource.pdfTitle || "View PDF"} <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {section.text && (
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {section.text}
                </p>
              )}

              {Array.isArray(section.items) &&
                section.items.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {section.items.map(
                      (item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex gap-3 text-sm leading-6 text-slate-600"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-1 shrink-0"
                            style={{
                              color: theme.accent,
                            }}
                          />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                )}

              {section.fileUrl && (
                <a
                  href={resolveFileUrl(
                    section.fileUrl
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
                  style={{
                    color: theme.accent,
                  }}
                >
                  <FileText size={16} />
                  {section.fileTitle ||
                    "View Document"}
                  <ExternalLink size={14} />
                </a>
              )}
            </section>
          ))}
        </div>

        {/* CTA */}

        {page.cta?.label && page.cta?.url && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <Link
              to={page.cta.url}
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white"
              style={{
                backgroundColor: theme.accent,
              }}
            >
              {page.cta.label}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Back */}

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}