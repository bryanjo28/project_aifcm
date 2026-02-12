"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type RegisterResponse = {
  ok: boolean;
  message?: string;
  data?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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

      const response = await fetch(`${apiBaseUrl}/api/v1/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = (await response.json()) as RegisterResponse;
      if (!response.ok) {
        throw new Error(result.message ?? "Register gagal. Coba lagi.");
      }

      toast.success("Register berhasil. Silakan login.");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Register gagal.";
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
        <section className="w-full max-w-md rounded-[28px] border border-[rgba(30,174,219,0.38)] bg-[rgba(8,16,34,0.76)] p-7 shadow-[0_0_34px_rgba(30,174,219,0.2)] md:p-9 animate-rise">
          <p className="text-xs font-semibold tracking-[0.22em] text-white/60 animate-rise delay-1">
            MEMBER AREA
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl animate-rise delay-2">
            Register
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/70 animate-rise delay-3">
            Buat akun baru untuk mulai akses materi AI Faceless Content Mastery.
          </p>

          <form className="mt-7 space-y-4 animate-rise delay-3" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-medium text-white/75">
                Nama
              </label>
              <input
                type="text"
                placeholder="Nama lengkap"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
              />
            </div>
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
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110"
            >
              {isSubmitting ? "Loading..." : "Buat Akun"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/70 animate-rise delay-3">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--glow-light)] hover:text-white"
            >
              Login
            </Link>
          </p>

          <div className="mt-6 text-center animate-rise delay-3">
            <Link className="text-xs text-white/50 hover:text-white/80" href="/">
              Kembali ke landing page
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
