"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type CheckEmailResponse = {
  ok: boolean;
  message?: string;
  data?: {
    email: string;
    found: boolean;
  };
};

type ResetPasswordResponse = {
  ok: boolean;
  message?: string;
  data?: {
    email: string;
  };
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

  const handleCheckEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/user/forgot-password/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json()) as CheckEmailResponse;
      if (!response.ok || !result.data?.found) {
        throw new Error(result.message ?? "Email tidak ditemukan.");
      }

      setEmailConfirmed(true);
      toast.success("Email ditemukan. Silakan ubah password.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal cek email.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/user/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const result = (await response.json()) as ResetPasswordResponse;
      if (!response.ok) {
        throw new Error(result.message ?? "Gagal ubah password.");
      }

      toast.success("Password berhasil diubah. Silakan login.");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal ubah password.";
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
          <p className="text-xs font-semibold tracking-[0.22em] text-white/60">MEMBER AREA</p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Forgot Password</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Masukkan email terlebih dulu. Jika ditemukan, langsung ubah password.
          </p>

          {!emailConfirmed ? (
            <form className="mt-7 space-y-4" onSubmit={handleCheckEmail}>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110"
              >
                {isSubmitting ? "Memeriksa..." : "Konfirmasi Email"}
              </button>
            </form>
          ) : (
            <form className="mt-7 space-y-4" onSubmit={handleResetPassword}>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-[rgba(3,10,24,0.5)] px-4 py-3 text-sm text-white/70 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">Password Baru</label>
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-white/75">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-white/15 bg-[rgba(3,10,24,0.75)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[var(--glow-light)]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110"
              >
                {isSubmitting ? "Menyimpan..." : "Ubah Password"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-white/70">
            Sudah ingat password?{" "}
            <Link href="/login" className="font-semibold text-[var(--glow-light)] hover:text-white">
              Kembali Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
