import {
  GraduationCap,
  Building2,
  Microscope,
 // Library,
  //  ShieldCheck,
  //  Award,
  //  BadgeCheck,
  //  FileText,
   BookOpen,
   
} from "lucide-react";

import { iqacMenuData } from "./iqacMenuData";
import { accreditationMenuData } from "./AccreditationMenuData";


export const menuData = [

  {
    title: "Home",
    path: "/",
  },


  {
    title: "About Us",
    type: "mega",
    columns: [
      {
        title: "About Sanstha",
        items: [
          
          { title: "Sanstha Overview", path: "/about" },
          { title: "Founder's Message", path: "/about/founder" },
            { title: "Chairman's Message", path: "/about/chairman" },
        
        ],
      },
      {
        title: "Governance & Vision",
        items: [
          { title: "Governing Management Committee", path: "/about/governing-management-committee" },
          { title: "Local Management Committee", path: "/about/local-management-committee" },
          { title: "Mission & Vision", path: "/about/mission-vision" },
        ],
      },
      {
        title: "About College",
        items: [
          { title: "College Overview", path: "/about/college-overview" },
          { title: "Infrastructure", path: "/facilities" },
          { title: "Principal's Message", path: "/about/principal" },
        ],
      },
    ],
  },

  {
    title: "Academics",
    type: "mega",
    columns: [

      {
        title: "Academic",

        items: [
          {
            title: "Programmes",
            path: "/academics/programmes",
          },
          {
            title: "Academic Calendar",
            path: "/academics/calendar",
          },
          {
            title: "Departments",
            path: "/departments",
          },
        ],
      },


      {
        title: "Examination",

        items: [
          {
            title: "Examinations",
            path: "/examinations",
          },
          // {
          //   title: "Time Table",
          //   path: "/timetable",
          // },
          // {
          //   title: "Results",
          //   path: "/results",
          // },
        ],
      },


      {
        title: "Admissions",

        items: [
          {
            title: "Admissions",
            path: "/admissions",
          },
          {
            title: "Admission Process",
            path: "/admissions/process",
          },
        ],
      },

    ],
  },


  {
    id: "departments",
    title: "Departments",
    type: "mega",
    menuType: "departments",

    columns: [

      {
        title: "Arts",
        icon: GraduationCap,

        items: [
          {
            title: "English",
            path: "/departments/english",
          },
          {
            title: "Marathi",
            path: "/departments/marathi",
          },
          {
            title: "Hindi",
            path: "/departments/hindi",
          },
          {
            title: "History",
            path: "/departments/history",
          },
          {
            title: "Geography",
            path: "/departments/geography",
          },
          {
            title: "Political Science",
            path: "/departments/political-science",
          },
          {
            title: "Economics",
            path: "/departments/economics",
          },
        ],
      },


      {
        title: "Science",
        icon: Microscope,

        items: [
          {
            title: "Physics",
            path: "/departments/physics",
          },
          {
            title: "Chemistry",
            path: "/departments/chemistry",
          },
          {
            title: "Mathematics",
            path: "/departments/mathematics",
          },
          {
            title: "Botany",
            path: "/departments/botany",
          },
          {
            title: "Zoology",
            path: "/departments/zoology",
          },
          {
            title: "Computer Science",
            path: "/departments/computer-science",
          },
        ],
      },


      {
        title: "Commerce",
        icon: Building2,

        items: [
          {
            title: "Commerce",
            path: "/departments/commerce",
          },
          {
            title: "BBA",
            path: "/departments/bba",
          },
          {
            title: "M.Com",
            path: "/departments/mcom",
          },
        ],
      },


      {
        title: "Professional Courses",
        icon: BookOpen,

        items: [
          {
            title: "BCA",
            path: "/departments/bca",
          },
          {
            title: "Data Science",
            path: "/departments/data-science",
          },
        ],
      },

    ],
  },



// {
//   title: "IQAC",
//   type: "mega",
//   menuType: "iqac",
//   menuOffset: "-330px",

//   columns: [

//     {
      
//   title: "IQAC",
//   icon: ShieldCheck,
 

//       items: [
//         {
//           title: "About IQAC",
//           path: "/iqac/about",
//         },
//         {
//           title: "Vision & Mission",
//           path: "/iqac/vision-mission",
//         },
//         {
//           title: "IQAC Committee",
//           path: "/iqac/committee",
//         },
//         {
//           title: "IQAC Coordinator",
//           path: "/iqac/coordinator",
//         },
//         {
//           title: "Minutes of Meetings",
//           path: "/iqac/minutes",
//         },
//         {
//           title: "Action Taken Reports",
//           path: "/iqac/action-taken",
//         },
//         {
//           title: "Contact IQAC",
//           path: "/iqac/contact",
//         },
//       ],
//     },

//     {
//       title: "NAAC Accreditation",
//  icon: Award,
//       items: [
//         {
//           title: "IIQA",
//           path: "/iqac/iiqa",
//         },
//         {
//           title: "SSR",
//           path: "/iqac/ssr",
//         },
//         {
//           title: "DVV Clarifications",
//           path: "/iqac/dvv",
//         },
//         {
//           title: "Peer Team Visit",
//           path: "/iqac/peer-team",
//         },
//         {
//           title: "AQAR (Year-wise)",
//           path: "/iqac/aqar",
//         },
//         {
//           title: "NAAC Certificates",
//           path: "/iqac/certificates",
//         },
//         {
//           title: "NAAC Documents",
//           path: "/iqac/naac-documents",
//         },
//       ],
//     },

//     {
//       title: "Quality Assurance",
//  icon: BadgeCheck,
//       items: [
//         {
//           title: "Best Practices",
//           path: "/iqac/best-practices",
//         },
//         {
//           title: "Institutional Distinctiveness",
//           path: "/iqac/distinctiveness",
//         },
//         {
//           title: "Academic & Administrative Audit",
//           path: "/iqac/aaa",
//         },
//         {
//           title: "Green Audit",
//           path: "/iqac/green-audit",
//         },
//         {
//           title: "Energy Audit",
//           path: "/iqac/energy-audit",
//         },
//         {
//           title: "Gender Audit",
//           path: "/iqac/gender-audit",
//         },
//         {
//           title: "Quality Initiatives",
//           path: "/iqac/quality-initiatives",
//         },
//       ],
//     },

//     {
//       title: "Reports & Policies",
//  icon: FileText,
//       items: [
//         {
//           title: "Annual Reports",
//           path: "/iqac/annual-reports",
//         },
//         {
//           title: "Stakeholder Feedback",
//           path: "/iqac/feedback",
//         },
//         {
//           title: "Policies & Manuals",
//           path: "/iqac/policies",
//         },
//         {
//           title: "Code of Conduct",
//           path: "/iqac/code-of-conduct",
//         },
//         {
//           title: "Downloads",
//           path: "/iqac/downloads",
//         },
//         {
//           title: "Archive",
//           path: "/iqac/archive",
//         },
//       ],
//     },

//   ],
// },


{
  title: "IQAC",
  type: "mega",
  menuType: "iqac",
  menuOffset: "-330px",

  columns: iqacMenuData,
},

{
  title: "Accreditation",
  type: "mega",
  menuType: "accreditation",
  menuOffset: "-330px",

  columns: accreditationMenuData,
},


  {
    title: "Library",
    path: "/library",
  },

  {
    title: "Research",
    path: "/research",
  },

  {
    title: "Students' Era",
    type: "mega",
    menuOffset: "-520px",
    columns: [
      {
        title: "Student Development",
        items: [
          // { title: "Overview", path: "/students-era" },
          { title: "NCC", path: "/students-era/ncc" },
          { title: "NSS", path: "/students-era/nss" },
          { title: "Cultural Activities", path: "/students-era/cultural-activities" },
          { title: "Women’s Empowerment", path: "/students-era/womens-empowerment" },
        ],
      },
      {
        title: "Fitness & Careers",
        items: [
          { title: "Sports", path: "/students-era/sports" },
          // { title: "Gym", path: "/students-era/gym" },
          { title: "Career Guidance and Counselling", path: "/students-era/career-guidance" },
          { title: "Seminars", path: "/students-era/seminars" },
          { title: "Placements", path: "/students-era/placements" },
        ],
      },
    ],
  },


  {
    title: "Alumni",
    path: "/alumni",
  },


  {
    title: "Gallery",
    path: "/gallery",
  },

  {
    title: "E-Contents",
    path: "/e-contents",
  },
  // {
  //   title: "Downloads",
  //   path: "/downloads",
  // },


  {
    title: "Screen Reader",
    path: "/screen-reader",
  },


];