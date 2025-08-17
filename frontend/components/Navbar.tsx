"use client";

import { Menu } from "lucide-react";

interface NavbarProps {
  title: string;
  onMenuClick: () => void;     // open sidebar on small screens
  rightSlot?: React.ReactNode; // optional (avatar, theme toggle, etc.)
}

export default function Navbar({ title, onMenuClick, rightSlot }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex h-full items-center px-4">
        {/* hamburger: only show on <lg */}
        <button
          onClick={onMenuClick}
          className="lg:hidden mr-2 rounded p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-semibold truncate">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
