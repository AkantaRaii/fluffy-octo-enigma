"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar, { MenuItem } from "@/components/Sidebar";
import SessionWrapper from "./SessionWrapper";
import { useSession } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  menuItems: MenuItem[];
  sidebarTitle?: string;
  rightSlot?: React.ReactNode; // optional content on navbar right
}

export default function Layout({
  children,
  title,
  menuItems,
  sidebarTitle = title,
  rightSlot,
}: LayoutProps) {
  const { data: session } = useSession();

  const [isLg, setIsLg] = useState(false);
  const [open, setOpen] = useState(false);

  // keep an up-to-date lg breakpoint flag & default open state
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      setIsLg(mq.matches);
      setOpen(mq.matches); // open by default on lg, closed on small
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <SessionWrapper>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Sidebar
          title={sidebarTitle}
          menuItems={menuItems}
          open={open}
          setOpen={setOpen}
          isLg={isLg}
        />
        {/* content area shifts when sidebar is visible on lg */}
        <div className={`transition-[margin] ${isLg ? "lg:ml-64" : ""}`}>
          <Navbar
            title={title}
            onMenuClick={() => setOpen(true)}
            rightSlot={session?.email}
          />
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SessionWrapper>
  );
}
