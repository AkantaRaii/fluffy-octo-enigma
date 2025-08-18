// app/not-found.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-6">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#91a92a] blur-3xl opacity-50" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#91a92a] blur-3xl opacity-50" />

        {/* Header with company logo */}
        <div className="flex items-center gap-3 p-6 border-b border-slate-200">
          <Image
            src="/gtnlogo.png"
            width={36}
            height={36}
            alt="Company Logo"
            className="rounded-md"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-slate-700">
            Your Company
          </span>
        </div>

        {/* Body */}
        <div className="p-8 sm:p-12 text-center">
          {/* Big gradient 404 */}
          <div className="mx-auto mb-6 max-w-sm">
            <svg viewBox="0 0 600 180" className="w-full h-auto">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#91a92a" />
                  <stop offset="100%" stopColor="#7a8e21" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="ui-sans-serif, system-ui, -apple-system"
                fontWeight="800"
                fontSize="140"
                fill="url(#g)"
              >
                404
              </text>
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Page not found
          </h1>
          <p className="mt-2 text-slate-600">
            Sorry, we couldn’t find the page you’re looking for. It may have
            been moved or deleted.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#91a92a] px-5 py-2.5 text-white font-medium shadow-sm hover:bg-[#7a8e21] transition"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Contact Support
            </Link>
          </div>

          {/* Small footer note */}
          <p className="mt-6 text-xs text-slate-400">
            Error code: <span className="font-mono">404_NOT_FOUND</span>
          </p>
        </div>
      </div>
    </main>
  );
}
