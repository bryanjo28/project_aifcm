"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  user: { name: string };
  onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="rounded-2xl border border-[rgba(30,174,219,0.3)] bg-[rgba(5,12,28,0.9)] px-5 py-4 shadow-[0_0_30px_rgba(30,174,219,0.12)] md:px-7">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold tracking-tight text-[var(--glow-light)] md:text-3xl">
          AI Faceless Content Mastery
        </div>

        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-[rgba(30,174,219,0.5)] bg-[rgba(8,16,34,0.82)] px-4 py-2 text-sm font-semibold text-white transition hover:border-[rgba(30,174,219,0.75)]"
          >
            {user.name}
            <span className="text-white/60">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-[rgba(30,174,219,0.35)] bg-[rgba(5,12,28,0.95)] shadow-[0_0_25px_rgba(30,174,219,0.18)] backdrop-blur">
              <button
                type="button"
                className="w-full rounded-t-xl px-4 py-2.5 text-left text-sm text-white/85 transition hover:bg-[rgba(30,174,219,0.12)] hover:text-white"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-b-xl px-4 py-2.5 text-left text-sm font-semibold text-white/90 transition hover:bg-[rgba(30,174,219,0.15)] hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
