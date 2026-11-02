import {
  Award,
  Landmark,
  FileCheck,
  UsersRound,
} from "lucide-react";

export const accreditationMenuData = [
  {
    title: "NAAC",
    icon: Award,

    items: [
      {
        title: "NAAC Overview",
        path: "/naac",
      },
      {
        title: "NAAC Criteria",
        path: "/naac/criteria",
      },
      {
        title: "SSR",
        path: "/naac/ssr",
      },
      {
        title: "DVV",
        path: "/naac/dvv",
      },
      {
        title: "Extension Profile",
        path: "/extension-profile",
      },
      {
        title: "Criteria Extension Documents",
        path: "/extension-documents",
      },
      {
        title: "AQAR",
        path: "/naac/aqar",
      },
    
      {
        title: "NAAC Certificates",
        path: "/naac/certificates",
      },
      {
        title: "Affiliation Documents",
        path: "/naac/affiliation",
      },
    ],
  },

  {
    title: "Recognition & Rankings",
    icon: Landmark,

    items: [
      {
        title: "Recognition & Rankings",
        path: "/accreditation/recognition-rankings",
      },
    ],
  },

  {
    title: "Mandatory Disclosure",
    icon: FileCheck,

    items: [
      {
        title: "Mandatory Disclosure",
        path: "/mandatory-disclosure",
      },
      {
        title: "Right to Information (RTI)",
        path: "/mandatory-disclosure/rti",
      },
    ],
  },

  {
    title: "Committees",
    icon: UsersRound,

    items: [
      {
        title: "Accreditation & IQAC Committees",
        path: "/accreditation/committees",
      },
    ],
  },
];