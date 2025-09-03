"use client";

import { Session } from "next-auth";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

interface ProfileSectionProps {
  session: Session | null;
}

export default function ProfileSection({ session }: ProfileSectionProps) {
  const [toggleOpen, setToggleOpen] = useState(false);
  const email = session?.user?.email;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignout = () => {
    signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToggleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={() => setToggleOpen((prev) => !prev)}
      className="relative hover:bg-green-50 px-2 py-1 rounded flex items-center group hover:cursor-pointer select-none"
    >
      <div className="m-2 w-8 h-8 rounded-full flex justify-center items-center border border-green-700 bg-green-100 text-green-800 font-medium">
        {email?.[0]?.toUpperCase() || "?"}
      </div>

      <p>{email}</p>
      <ChevronDown
        className="inline-block ml-1 group-hover:rotate-180"
        size={16}
      />
      {toggleOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
        >
          <button
            onClick={handleSignout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}