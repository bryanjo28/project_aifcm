export default function HeroMain() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-28">
      <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[rgba(30,174,219,0.18)] blur-[110px]" />
      <div className="absolute right-[-140px] top-[40px] h-[260px] w-[260px] rounded-full bg-[rgba(51,195,240,0.22)] blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-[72%] h-32 w-80 -translate-x-1/2 rounded-full bg-[rgba(30,174,219,0.1)] blur-[85px]" />

      <div className="mx-auto w-full max-w-5xl">
        <section className="text-center animate-rise">
          <p className="text-xs font-semibold tracking-[0.32em] text-white/60 animate-rise delay-1">
            AIFCM SYSTEM
          </p>

          <h1 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-5xl animate-rise delay-2">
            STRATEGI{" "}
            <span className="text-[var(--glow-light)]">10JT / BULAN</span>{" "}
            CUKUP DENGAN{" "}
            <span className="text-[var(--glow-light)]">KERJA 2 JAM / HARI</span>{" "}
            DARI NGONTEN PAKE A.I
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-white/70 md:text-base animate-rise delay-3">
            Diajarin bikin konten - viral - dapetin followers - jualan produk /
            jasa - cuan - otomatisasi pake A.I.
          </p>

          <div className="mx-auto mt-8 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--glow-light)] to-transparent animate-rise delay-3" />

          <div className="mt-8 grid gap-4 md:grid-cols-3 animate-rise delay-3">
            <div className="rounded-2xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.7)] p-5 text-left">
              <p className="text-sm font-semibold text-white">Konten 2 Jam</p>
              <p className="mt-2 text-xs text-white/60">
                Template + workflow siap pakai untuk eksekusi harian.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.7)] p-5 text-left">
              <p className="text-sm font-semibold text-white">Formula Viral</p>
              <p className="mt-2 text-xs text-white/60">
                Hook, struktur, dan scoring konten biar tembus reach.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.7)] p-5 text-left">
              <p className="text-sm font-semibold text-white">Cuan + Sistem</p>
              <p className="mt-2 text-xs text-white/60">
                Monetisasi, lead, dan automasi yang bisa diskalakan.
              </p>
            </div>
          </div>

          <button className="mt-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(30,174,219,0.28)] transition hover:brightness-110 animate-rise delay-3">
            Dapatkan Strateginya Sekarang
          </button>
        </section>
      </div>
    </section>
  );
}
