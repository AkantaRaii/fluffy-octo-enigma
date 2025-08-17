"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  title: string;
  menuItems: MenuItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  isLg: boolean; // provided by Layout to avoid window checks here
}

export default function Sidebar({
  title,
  menuItems,
  open,
  setOpen,
  isLg,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* overlay for small screens */}
      {open && !isLg && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-neutral-900 text-white transition-transform
        ${open || isLg ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 h-16 bg-neutral-950">
          <span className="text-sm font-bold tracking-wide">{title}</span>
          {!isLg && (
            <button
              onClick={() => setOpen(false)}
              className="rounded p-2 hover:bg-neutral-800"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="py-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm
                  hover:bg-neutral-800/70 ${active ? "bg-neutral-800" : ""}`}
                onClick={() => (!isLg ? setOpen(false) : null)}
              >
                {item.icon && <span className="opacity-80">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
