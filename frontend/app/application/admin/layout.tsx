// app/admin/layout.tsx
"use client";

import Layout from "@/components/Layout";
import { ModalProvider } from "@/context/ModalContext";
import { Home, Users, FileQuestion, ClipboardList, Send } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    {
      label: "Dashboard",
      href: "/application/admin",
      icon: <Home size={18} />,
    },
    {
      label: "Departments",
      href: "/application/admin/departments",
      icon: <Users size={18} />,
    },
    {
      label: "Questions",
      href: "/application/admin/questions",
      icon: <FileQuestion size={18} />,
    },
    {
      label: "Exams",
      href: "/application/admin/exams",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Invitations",
      href: "/application/admin/invitations",
      icon: <Send size={18} />,
    },
  ];

  return (
    <Layout
      title="Admin Panel"
      sidebarTitle="Admin"
      menuItems={menuItems}
      rightSlot={<div className="text-sm opacity-70"></div>}
    >
      <ModalProvider>{children}</ModalProvider>
    </Layout>
  );
}
