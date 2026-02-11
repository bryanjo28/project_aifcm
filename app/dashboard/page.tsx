"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
          "http://localhost:4000";

        const response = await fetch(`${apiBaseUrl}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const result = (await response.json()) as { ok: boolean; data?: AuthUser };
        if (!response.ok || !result.data) {
          throw new Error("Silakan login dulu.");
        }

        setUser(result.data);
      } catch {
        toast.error("Silakan login dulu.");
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    void checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

      await fetch(`${apiBaseUrl}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } finally {
      toast.success("Kamu sudah logout.");
      router.push("/login");
    }
  };

  if (checkingAuth) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/70">Memeriksa sesi login...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-[rgba(30,174,219,0.18)] blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-[rgba(51,195,240,0.14)] blur-[100px]" />

      <div className="mx-auto w-full max-w-4xl">
        <section className="rounded-[28px] border border-[rgba(30,174,219,0.38)] bg-[rgba(8,16,34,0.76)] p-7 shadow-[0_0_34px_rgba(30,174,219,0.2)] md:p-9">
          <p className="text-xs font-semibold tracking-[0.22em] text-white/60">
            DASHBOARD
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Halo, {user.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Ini halaman dummy untuk test alur register/login. Nanti bisa kamu isi
            konten member area.
          </p>

          <div className="mt-7 grid gap-4 rounded-2xl border border-white/10 bg-[rgba(3,10,24,0.75)] p-5 text-sm text-white/85 md:grid-cols-2">
            <p>
              <span className="text-white/55">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-white/55">Role:</span> {user.role}
            </p>
            <p>
              <span className="text-white/55">Status:</span>{" "}
              {user.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <span className="text-white/55">User ID:</span> {user.id}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110"
            >
              Logout
            </button>
            <Link
              href="/"
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
            >
              Kembali ke Landing Page
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
