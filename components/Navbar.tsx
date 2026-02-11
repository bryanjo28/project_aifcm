"use client";

import Link from "next/link";

type NavbarProps = {
  mode?: "default" | "auth";
};

export default function Navbar({ mode = "default" }: NavbarProps) {
  const isAuthMode = mode === "auth";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(3,10,24,0.85)] backdrop-blur-md">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center px-6 py-4 ${
          isAuthMode ? "justify-start" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[var(--glow-light)] md:text-2xl"
          >
            AI Faceless Content Mastery
          </Link>
        </div>

        <nav className={`hidden items-center gap-8 text-sm text-white/80 md:flex ${isAuthMode ? "md:hidden" : ""}`}>
          <a className="hover:text-white" href="#hero">
            Personal Mentoring
          </a>
          <a className="hover:text-white" href="#produk">
            The Creator&apos;s Handbook
          </a>
          {/* <a className="hover:text-white" href="#produk">
            Buku
          </a> */}
          {/* <a className="hover:text-white" href="#limited-offer">
            Help
          </a> */}
        </nav>

        {isAuthMode ? null : (
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="hidden text-white/80 hover:text-white md:inline-flex"
            >
              Login
            </Link>
            <button className="rounded-full bg-[var(--glow-blue)] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_15px_rgba(30,174,219,0.35)] transition hover:bg-[var(--glow-light)] md:px-5 md:py-2.5 md:text-sm">
              Mulai Belajar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
