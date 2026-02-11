 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

type AuthResponse = {
  ok: boolean;
  data?: AuthUser;
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

      const response = await fetch(`${apiBaseUrl}/api/v1/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.data) {
        throw new Error(result.message ?? "Login gagal. Coba lagi.");
      }

      toast.success(`Welcome back, ${result.data.name}!`);
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-6 pb-12 pt-28">
      <Navbar mode="auth" />
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-[rgba(30,174,219,0.18)] blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-[rgba(51,195,240,0.14)] blur-[100px]" />

      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center justify-center">
        <section className="w-full max-w-md rounded-[28px] border border-[rgba(30,174,219,0.38)] bg-[rgba(8,16,34,0.76)] p-7 shadow-[0_0_34px_rgba(30,174,219,0.2)] md:p-9">
          <p className="text-xs font-semibold tracking-[0.22em] text-white/60">
            MEMBER AREA
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Login
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Masuk untuk akses materi course, community, dan update terbaru.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/75">
                Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/75">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110"
            >
              {isSubmitting ? "Loading..." : "Masuk Sekarang"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/70">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--glow-light)] hover:text-white"
            >
              Register
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link className="text-xs text-white/50 hover:text-white/80" href="/">
              Kembali ke landing page
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
