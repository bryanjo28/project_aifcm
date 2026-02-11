"use client";

import { FormEvent, useState } from "react";
import Reveal from "@/components/Reveal";
import { toast } from "sonner";

type Benefit = {
  title: string;
  icon: React.ReactNode;
};

const benefits: Benefit[] = [
  {
    title: "Dapatkan e-book gratis",
    icon: (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none">
        <path
          d="M3.75 8.25h16.5v11.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8.25v12.75M3 8.25h18M7.5 8.25V6.75a2.25 2.25 0 0 1 4.122-1.255L12 6l.378-.505A2.25 2.25 0 0 1 16.5 6.75v1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Diundang ke webinar gratis",
    icon: (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none">
        <rect
          x="3.75"
          y="5.25"
          width="13.5"
          height="13.5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m17.25 10.5 3-2.25a.75.75 0 0 1 1.2.6v6.3a.75.75 0 0 1-1.2.6l-3-2.25"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Dapat template AI gratis",
    icon: (
      <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none">
        <path
          d="M12 6.75h5.25A2.25 2.25 0 0 1 19.5 9v9.75M12 6.75H6.75A2.25 2.25 0 0 0 4.5 9v9.75M12 6.75v12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18.75c-1.7-1.1-3.437-1.65-5.25-1.65H4.5M12 18.75c1.7-1.1 3.437-1.65 5.25-1.65h2.25"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function EmailLeadSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

      const response = await fetch(`${apiBaseUrl}/api/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: "AI Enthusiast",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      toast.success(
        "Terima kasih! Kami akan mengirimkan materi gratis ke email Anda."
      );
      setEmail("");
    } catch {
      toast.error("Terjadi kesalahan saat mengirim email. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="email-capture" className="px-6 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="relative overflow-hidden rounded-[20px] border border-[rgba(30,174,219,0.42)] bg-[rgba(4,13,34,0.88)] p-6 shadow-[0_0_34px_rgba(30,174,219,0.24)] md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(30,174,219,0.08)] to-transparent" />
          <div className="relative text-center">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">
              Tertarik? Masukkan Email
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-xl">
              Dapatkan akses gratis ke materi eksklusif untuk memulai perjalanan
              konten AI faceless Anda.
            </p>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[rgba(30,174,219,0.35)] bg-[rgba(2,10,28,0.9)] px-5 py-6 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center text-[var(--glow-blue)]">
                  {item.icon}
                </div>
                <p className="mt-4 text-base text-white/90">{item.title}</p>
              </div>
            ))}
          </div>

          <form className="relative mt-7 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 rounded-xl border border-[rgba(30,174,219,0.32)] bg-[rgba(2,10,28,0.9)] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[var(--glow-light)] md:text-base"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-7 text-sm font-semibold text-[#031022] transition hover:brightness-110 md:text-base"
            >
              {isSubmitting ? "Mengirim..." : "Dapatkan Materi Gratis"}
            </button>
          </form>

          <p className="relative mt-6 text-center text-sm text-white/55">
            Kami menghargai privasi Anda. Berhenti berlangganan kapan saja.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
