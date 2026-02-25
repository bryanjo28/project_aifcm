"use client";

import UserHeader from "@/app/components/layout/UserHeader";
import UserSidebar from "@/app/components/layout/UserSidebar";

interface Props {
  user: {
    name: string;
    email: string;
    role: "user" | "admin";
  };
  onLogout: () => void;
}

export default function UserMainLayout({ user, onLogout }: Props) {
  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-4 py-4 md:px-6 md:py-5">
      <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[rgba(30,174,219,0.2)] blur-[95px]" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[rgba(51,195,240,0.16)] blur-[110px]" />

      <div className="relative mx-auto w-full max-w-[1680px] space-y-4">
        <UserHeader user={user} onLogout={onLogout} />

        <section className="grid min-h-[calc(100vh-130px)] grid-cols-1 rounded-2xl border border-[rgba(30,174,219,0.26)] bg-[rgba(5,12,28,0.86)] shadow-[0_0_35px_rgba(30,174,219,0.1)] md:grid-cols-[250px_minmax(0,1fr)]">
          <UserSidebar onLogout={onLogout} user={user} />

          <section className="grid grid-cols-1 gap-5 p-5 md:p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-2xl border border-[rgba(30,174,219,0.34)] bg-[rgba(8,16,34,0.65)] p-5 shadow-[0_0_28px_rgba(30,174,219,0.28)] md:p-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/45">USER AREA</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Halo, {user.name}
              </h1>
              <p className="mt-2 text-sm text-white/60">Prototype user page structure.</p>

              <div className="mt-6 rounded-2xl border border-[rgba(30,174,219,0.35)] bg-[rgba(4,12,28,0.78)] p-4 md:p-5">
                <p className="text-sm font-medium text-white/75">Video Player Area</p>
                <div className="mt-3 flex h-[420px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-[rgba(3,10,24,0.58)] text-sm text-white/45">
                  Placeholder section
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-[rgba(30,174,219,0.34)] bg-[rgba(8,16,34,0.65)] p-5">
              <h2 className="text-lg font-semibold text-white">My Course</h2>
              <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(3,10,24,0.62)] p-4">
                <p className="text-sm font-semibold text-white">AIFCM Course</p>
                <p className="mt-2 text-sm text-white/50">Dummy</p>
              </div>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}
