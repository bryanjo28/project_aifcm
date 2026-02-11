import Image from "next/image";

export default function Hero() {
  return (
    <div id="hero" className="min-h-screen">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-[-120px] top-[120px] h-[240px] w-[240px] rounded-full bg-[rgba(30,174,219,0.22)] blur-[80px]" />
          <div className="absolute right-[-140px] top-[40px] h-[260px] w-[260px] rounded-full bg-[rgba(51,195,240,0.22)] blur-[90px]" />
        </div>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-28 lg:flex-row lg:items-center">
          <section className="max-w-xl animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(30,174,219,0.45)] bg-[rgba(10,16,34,0.6)] px-4 py-2 text-xs font-semibold text-[var(--glow-light)] shadow-[0_0_18px_rgba(30,174,219,0.25)]">
              <span className="drop-glow">*</span>
              AIFCM
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white md:text-5xl">
              AI Faceless Content Mastery by{" "}
              <span className="text-glow text-[var(--glow-light)]">
                Heyjasz
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/60">
              10 Juta/bulan bukan hal yang sulit kalau kamu tahu formula ini. Pelajari cara menghasilkan income dari konten dengan AI, tanpa harus nampil di muka.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-rise delay-1">
              <button className="rounded-full bg-[var(--glow-blue)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(30,174,219,0.35)] transition hover:bg-[var(--glow-light)]">
                Dapatkan Akses
              </button>
              <a
                href="#about"
                className="rounded-full border border-[rgba(30,174,219,0.7)] px-6 py-3 text-sm font-semibold text-[var(--glow-light)] shadow-[0_0_10px_rgba(30,174,219,0.2)] transition hover:bg-[rgba(30,174,219,0.08)]"
              >
                Pelajari lebih lanjut
              </a>
            </div>
            <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-6 text-sm text-white/60 animate-rise delay-2">
              <div>
                <div className="text-lg font-semibold text-[var(--glow-light)]">
                  50K+
                </div>
                Siswa Aktif
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--glow-light)]">
                  200+
                </div>
                Kelas Premium
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--glow-light)]">
                  98%
                </div>
                Kepuasan
              </div>
            </div>
          </section>

          <section className="relative w-full max-w-lg animate-rise delay-1">
            <div className="pointer-events-none absolute -left-6 top-10 h-64 w-64 rounded-full bg-[rgba(30,174,219,0.25)] blur-[70px] drift-slow" />
            <div className="pointer-events-none absolute -right-8 bottom-6 h-56 w-56 rounded-full bg-[rgba(51,195,240,0.2)] blur-[80px] drift-slow" />
            <div className="pointer-events-none absolute right-6 top-6 h-40 w-40 rounded-full bg-[rgba(13,30,69,0.7)] blur-[55px] drift-slow" />
            <div className="glow-card glow-pulse float-slow relative mx-auto max-w-[380px] rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] p-2 shadow-[inset_0_0_30px_rgba(30,174,219,0.08)] sm:max-w-[420px] lg:max-w-[460px]">
              <Image
                src="/images/hero.png"
                alt="Preview program AI Faceless Content Mastery"
                width={800}
                height={1200}
                className="h-auto w-full max-h-[520px] rounded-2xl object-contain drop-shadow-[0_30px_60px_rgba(5,10,20,0.7)] lg:max-h-[620px]"
                priority
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
