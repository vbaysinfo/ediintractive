import type { Role } from "@/platform/types";

export interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

export const navByRole: Record<Role, NavItem[]> = {
  student: [
    { href: "/student", label: "Overview", emoji: "🏠" },
    { href: "/student/labs", label: "Interactive Labs", emoji: "🧪" },
    { href: "/student/assignments", label: "Assignments", emoji: "📝" },
    { href: "/student/progress", label: "Progress", emoji: "📈" },
    { href: "/student/ask-teacher", label: "Ask Teacher", emoji: "💬" },
  ],
  teacher: [
    { href: "/teacher", label: "Overview", emoji: "🏠" },
    { href: "/teacher/assignments", label: "Assignments", emoji: "📝" },
    { href: "/teacher/performance", label: "Student Performance", emoji: "📊" },
    { href: "/teacher/announcements", label: "Announcements", emoji: "📣" },
    { href: "/teacher/content-pipeline", label: "Content Pipeline", emoji: "📄" },
  ],
  admin: [
    { href: "/admin", label: "Overview", emoji: "🏠" },
    { href: "/admin/teachers", label: "Teachers", emoji: "👩‍🏫" },
    { href: "/admin/students", label: "Students", emoji: "🎒" },
    { href: "/admin/alerts", label: "Alerts", emoji: "🚨" },
    { href: "/admin/reports", label: "Reports", emoji: "📑" },
  ],
  "super-admin": [
    { href: "/super-admin", label: "Overview", emoji: "🏠" },
    { href: "/super-admin/schools", label: "Schools", emoji: "🏫" },
  ],
};

export const roleLabel: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Principal / Admin",
  "super-admin": "Super Admin",
};
