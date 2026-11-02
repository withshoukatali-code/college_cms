import {
  ShieldCheck,
  BadgeCheck,
  FileText,
} from "lucide-react";

export const iqacMenuData = [
  {
    title: "IQAC",
    icon: ShieldCheck,

    items: [
      {
        title: "About IQAC",
        path: "/iqac",
      },
      {
        title: "Vision & Mission",
        path: "/iqac/vision-mission",
      },
      {
        title: "IQAC Committee",
        path: "/iqac/committee",
      },
      {
        title: "IQAC Coordinator",
        path: "/iqac/coordinator",
      },
      {
        title: "IQAC Meetings",
        path: "/iqac/meetings",
      },
      {
        title: "Action Taken Reports",
        path: "/iqac/action-taken",
      },
      {
        title: "Feedback",
        path: "/feedback",
      },
    ],
  },

  {
    title: "Quality Initiatives",
    icon: BadgeCheck,

    items: [
      {
        title: "Best Practices",
        path: "/naac/best-practices",
      },
      {
        title: "Institutional Distinctiveness",
        path: "/iqac/distinctiveness",
      },
      {
        title: "Audit Reports",
        path: "/iqac/audit",
      },
      {
        title: "IQAC Activities",
        path: "/iqac/activities",
      },
      {
        title: "Quality Initiatives",
        path: "/iqac/quality-initiatives",
      },
    ],
  },

  {
    title: "Reports",
    icon: FileText,

    items: [
      {
        title: "IQAC Annual Reports",
        path: "/iqac/annual-reports",
      },
      {
        title: "IQAC Archive",
        path: "/iqac/archive",
      },
    ],
  },
];