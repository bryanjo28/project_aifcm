"use client";

import Link from "next/link";

export type AdminTab = "overview" | "products" | "orders" | "promotions" | "sessions";

type SidebarItem = {
  key: AdminTab;
  label: string;
  hint: string;
};

interface Props {
  activeTab: AdminTab;
  items: SidebarItem[];
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
  };
  onLogout: () => void;
}

export default function AdminSidebar({ activeTab, items, user, onLogout }: Props) {
  return (
    <aside className="flex h-full flex-col border-b border-white/10 bg-[rgba(4,9,22,0.85)] p-5 md:border-b-0 md:border-r md:p-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--glow-light)]/80">STUDIO</p>
        <p className="mt-2 text-sm text-white/55">Admin navigation</p>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const isActive = item.key === activeTab;
          return (
            <Link
              key={item.key}
              href={`/admin?tab=${item.key}`}
              className={`block rounded-xl border px-4 py-3 transition ${
                isActive
                  ? "border-[rgba(30,174,219,0.55)] bg-[rgba(30,174,219,0.14)] shadow-[0_0_20px_rgba(30,174,219,0.14)]"
                  : "border-white/10 bg-[rgba(8,16,34,0.52)] hover:border-[rgba(30,174,219,0.35)]"
              }`}
            >
              <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-white/85"}`}>
                {item.label}
              </p>
              <p className="mt-1 text-xs text-white/55">{item.hint}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-2xl border border-[rgba(30,174,219,0.32)] bg-[rgba(8,16,34,0.7)] p-4">
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--glow-light)]">{user.role}</p>
          <p className="mt-2 truncate text-xs text-white/60">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-white/15 bg-[rgba(8,16,34,0.78)] px-4 py-3 text-sm font-semibold text-white/88 transition hover:border-[rgba(30,174,219,0.45)] hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
