// app/admin/layout.tsx

import Layout from "@/components/Layout";
import { ModalProvider } from "@/context/ModalContext";
import {
  Home,
  Users,
  FileQuestion,
  ClipboardList,
  Send,
  Building,
  UserIcon,
} from "lucide-react";
import { getServerSession } from "next-auth";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const menuItems = [
    {
      label: "Dashboard",
      href: "/application/admin",
      icon: <Home size={18} />,
    },
    {
      label: "Users",
      href: "/application/admin/users",
      icon: <Users size={18} />,
    },
    {
      label: "Departments",
      href: "/application/admin/departments",
      icon: <Building size={18} />,
    },
    {
      label: "Exams",
      href: "/application/admin/exams",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Profile",
      href: "/application/admin/profile",
      icon: <UserIcon size={18} />,
    },
  ];

  return (
    <Layout
      title="Admin Panel"
      sidebarTitle="Admin"
      menuItems={menuItems}
      session={session}
      rightSlot={<div className="text-sm opacity-70">asdjasndfa</div>}
    >
      <ModalProvider>{children}</ModalProvider>
    </Layout>
  );
}
