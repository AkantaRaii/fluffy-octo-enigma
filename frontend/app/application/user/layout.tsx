// app/user/layout.tsx
"use client";

import Layout from "@/components/Layout";
import { Home, Clock, History, User as UserIcon } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { label: "Dashboard", href: "/application/user", icon: <Home size={18} /> },
    {
      label: "Upcoming Exams",
      href: "/application/user/upcoming",
      icon: <Clock size={18} />,
    },
    {
      label: "Past Exams",
      href: "/application/user/past",
      icon: <History size={18} />,
    },
    {
      label: "Profile",
      href: "/application/user/profile",
      icon: <UserIcon size={18} />,
    },
  ];
  return (
    <Layout
      title="Exam Portal"
      sidebarTitle="My Exams"
      menuItems={menuItems}
      rightSlot={<div className="text-sm opacity-70">student@you</div>}
    >
      {children}
    </Layout>
  );
}
