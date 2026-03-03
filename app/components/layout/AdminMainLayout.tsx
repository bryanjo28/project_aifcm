"use client";

import type React from "react";
import AdminSidebar, { type AdminTab } from "@/app/components/layout/AdminSidebar";

export const adminSidebarItems: Array<{ key: AdminTab; label: string; hint: string }> = [
  { key: "overview", label: "Overview", hint: "Ringkasan dashboard" },
  { key: "products", label: "Products", hint: "Daftar produk digital" },
  { key: "orders", label: "Orders", hint: "Riwayat transaksi" },
  { key: "users", label: "Users", hint: "Users Management" },
  { key: "sessions", label: "Sessions", hint: "Kelas dan jadwal live" },
];

const tabCopy: Record<
  AdminTab,
  { title: string; subtitle: string; panelTitle: string; panelText: string; badge: string }
> = {
  overview: {
    title: "Overview",
    subtitle: "Pantau performa bisnis secara cepat.",
    panelTitle: "Weekly Snapshot",
    panelText: "Dummy insight untuk KPI, engagement, dan conversion rate.",
    badge: "5 Widgets",
  },
  products: {
    title: "Products",
    subtitle: "Kelola katalog produk digital kamu.",
    panelTitle: "Digital Products",
    panelText: "Contoh list produk dengan metric sederhana untuk UI admin.",
    badge: "2 Active",
  },
  orders: {
    title: "Orders",
    subtitle: "Lihat status pembayaran dan pengiriman akses.",
    panelTitle: "Latest Orders",
    panelText: "Dummy data order terbaru dari pengguna yang checkout.",
    badge: "10 New",
  },
  users: {
    title: "Users",
    subtitle: "User Management System.",
    panelTitle: "User Board",
    panelText: "",
    badge: "",
  },
  sessions: {
    title: "Sessions",
    subtitle: "Monitor kelas live, rekaman, dan peserta.",
    panelTitle: "Upcoming Sessions",
    panelText: "Placeholder jadwal sesi mentoring dan webinar mingguan.",
    badge: "4 Scheduled",
  },
};

interface Props {
  activeTab: AdminTab;
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
  };
  onLogout: () => void;
  children?: React.ReactNode;
  hideTopToolbar?: boolean;

    // ✅ tambah ini
  primaryAction?: {
    label: string;
    onClick: () => void;
    hidden?: boolean;
  };
  
}

export default function AdminMainLayout({
  activeTab,
  user,
  onLogout,
  children,
  primaryAction,
  hideTopToolbar = false,
}: Props) {
  const content = tabCopy[activeTab];

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-4 py-4 md:px-6 md:py-5">
      <div className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[rgba(30,174,219,0.16)] blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[rgba(51,195,240,0.12)] blur-[125px]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-[1680px] grid-cols-1 rounded-2xl border border-[rgba(30,174,219,0.26)] bg-[rgba(5,12,28,0.84)] shadow-[0_0_35px_rgba(30,174,219,0.14)] md:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar activeTab={activeTab} items={adminSidebarItems} user={user} onLogout={onLogout} />

        <section className="p-5 md:p-7">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-white/45">ADMIN PAGE</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{content.title}</h1>
              <p className="mt-2 text-sm text-white/60">{content.subtitle}</p>
            </div>

           {primaryAction && !primaryAction.hidden ? (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="rounded-full bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(30,174,219,0.22)] transition hover:brightness-110"
              >
                {primaryAction.label}
              </button>
            ) : null}
          </header>

          {!hideTopToolbar ? (
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <label className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/12 bg-[rgba(8,16,34,0.62)] px-4 py-3">
                <span className="text-white/45">Search</span>
                <input
                  type="text"
                  placeholder="Cari data..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <span className="inline-flex rounded-full border border-[rgba(30,174,219,0.35)] bg-[rgba(30,174,219,0.12)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--glow-light)]">
                {content.badge}
              </span>
            </div>
          ) : null}

          <section className="mt-6 rounded-2xl border border-[rgba(30,174,219,0.3)] bg-[rgba(8,16,34,0.64)] p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white">{content.panelTitle}</h2>
              <p className="text-xs text-white/50">Live Data</p>
            </div>

            {/* ✅ Inject real content here */}
            {children ? (
              <div className="mt-4">{children}</div>
            ) : (
              <>
                <p className="mt-4 text-sm text-white/65">{content.panelText}</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <article
                      key={item}
                      className="rounded-xl border border-white/10 bg-[rgba(4,10,24,0.72)] p-4 transition hover:border-[rgba(30,174,219,0.34)]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-white/45">Item {item}</p>
                      <p className="mt-2 text-base font-semibold text-white">Dummy Title {item}</p>
                      <p className="mt-2 text-sm text-white/55">
                        Konten placeholder untuk tab{" "}
                        <span className="font-semibold text-white/70">{content.title}</span>.
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
