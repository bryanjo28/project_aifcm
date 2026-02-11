"use client";

import { useEffect, useMemo, useState } from "react";
import Reveal from "@/components/Reveal";

const INITIAL_SECONDS = 2 * 24 * 60 * 60 + 23 * 60 * 60 + 58 * 60 + 50;

type CountdownPart = {
  label: string;
  value: number;
};

function formatCountdown(totalSeconds: number): CountdownPart[] {
  const safeSeconds = Math.max(0, totalSeconds);
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
}

export default function LimitedOffer() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : INITIAL_SECONDS));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => formatCountdown(timeLeft), [timeLeft]);

  return (
    <section id="limited-offer" className="px-6 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="relative overflow-hidden rounded-[22px] border border-[rgba(30,174,219,0.35)] bg-[rgba(3,10,24,0.85)] p-5 shadow-[0_0_34px_rgba(30,174,219,0.18)] md:p-7">
          <div className="pointer-events-none absolute -left-14 top-8 h-40 w-40 rounded-full bg-[rgba(30,174,219,0.14)] blur-[72px]" />
          <div className="pointer-events-none absolute -right-12 bottom-9 h-44 w-44 rounded-full bg-[rgba(51,195,240,0.12)] blur-[76px]" />

          <div className="relative text-center">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Penawaran Terbatas
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--glow-light)] to-transparent" />
            <p className="mx-auto mt-5 max-w-2xl text-sm text-white/70 md:text-base">
              Kuota batch ini terbatas hanya untuk 50 orang pertama!
            </p>
          </div>

          <div className="relative mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {countdown.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/15 bg-[rgba(5,14,32,0.72)] p-3 text-center md:p-4"
              >
                <p className="text-3xl font-semibold leading-none text-white md:text-4xl">
                  {item.value.toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs tracking-wide text-white/60 md:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-7 rounded-xl border border-white/15 bg-[rgba(4,12,28,0.75)] p-4 text-left md:p-6">
            <p className="text-lg font-semibold text-white md:text-xl">
              Bonus untuk Pendaftar Hari Ini:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/85 md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-[var(--glow-light)]">✓</span>
                <span>30+ Template AI untuk berbagai niche</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--glow-light)]">✓</span>
                <span>E-book Monetisasi Konten Faceless</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--glow-light)]">✓</span>
                <span>Akses VIP ke Webinar Bulanan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--glow-light)]">✓</span>
                <span>1 Sesi Konsultasi Pribadi</span>
              </li>
            </ul>
          </div>

          <p className="relative mt-7 text-center text-lg font-semibold text-[#ffd84f] md:text-xl">
            Hanya tersisa 7 slot dari 50 kuota batch ini!
          </p>

          <a
            href="#"
            className="relative mt-5 block rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(30,174,219,0.25)] transition hover:brightness-110 md:text-base"
          >
            Dapatkan Akses Sekarang
          </a>

          <p className="relative mt-4 text-center text-xs text-white/70 md:text-sm">
            * Harga akan naik setelah kuota batch ini habis
          </p>
        </Reveal>
      </div>
    </section>
  );
}
