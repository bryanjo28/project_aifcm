import EmailLeadSection from "@/components/EmailLeadSection";
import FooterBar from "@/components/FooterBar";
import HeroMain from "@/components/HeroMain";
import LimitedOffer from "@/components/LimitedOffer";
import Navbar from "@/components/Navbar";
import ProductSection from "@/components/ProductSection";
import Reveal from "@/components/Reveal";
import Value from "@/components/Value";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-hero">
      <Navbar />
      <HeroMain />
      <section id="about" className="px-6 pb-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal className="mt-4 overflow-hidden rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] shadow-[0_0_30px_rgba(30,174,219,0.2)]">
            <div className="w-full p-2 md:p-3">
              <div className="relative w-full overflow-hidden rounded-2xl pt-[56.25%]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/t28pPwNSqGY"
                  title="AI Faceless Content Mastery"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
          <Reveal className="mt-4 rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] p-6 text-center shadow-[0_0_25px_rgba(30,174,219,0.18)] md:p-8">
            <h2 className="text-xl font-semibold text-[var(--glow-light)] md:text-2xl">
              Apa si sebenarnya AI Faceless content mastery itu?
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
              Ini adalah sebuah course yang isinya{" "}
              <span className="text-[var(--glow-light)]">
                Rahasia dan formula
              </span>{" "}
              yang bisa bantuin kamu dapetin{" "}
              <span className="text-[var(--glow-light)]">10 juta perbulan</span>{" "}
              cuman dari ngonten pake AI. Disini akan diajarkan mulai dari apa
              itu AI, bagaimana cara mencari niche yang tepat, hingga cara
              mendapatkan{" "}
              <span className="text-[var(--glow-light)]">
                Cuan atau Monetisasi
              </span>
              . Detailnya kamu cek deh video ini:
            </p>
          </Reveal>

        </div>
      </section>

      {/* <section id="success" className="px-6 pb-28">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="text-center">
            <p className="text-sm font-semibold tracking-[0.25em] text-white/50">
              SUCCESS STORIES
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
              Mereka Sudah Dapat Hasil, Sekarang Giliran Kamu
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
              Potongan cerita nyata dari member yang menjalankan formula AIFCM.
              Fokus pada proses yang bisa ditiru: niche, konsistensi, dan
              monetisasi.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Reveal className="rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] p-6 shadow-[0_0_24px_rgba(30,174,219,0.16)]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[rgba(30,174,219,0.2)]" />
                <div>
                  <p className="text-sm font-semibold text-white">Rania - 22</p>
                  <p className="text-xs text-white/50">
                    Niche: Edu Tips (AI)
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Dalam 6 minggu, channel aku tembus 120K views. Yang paling
                terasa: kerja lebih rapi karena sudah ada roadmap konten.
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                <span>60+ video</span>
                <span>Revenue: 12.4 jt</span>
              </div>
            </Reveal>

            <Reveal className="rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] p-6 shadow-[0_0_24px_rgba(30,174,219,0.16)]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[rgba(30,174,219,0.2)]" />
                <div>
                  <p className="text-sm font-semibold text-white">Dimas - 27</p>
                  <p className="text-xs text-white/50">
                    Niche: Finansial Ringan
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Aku mulai dari 0. Follow step-by-step, dapat 3 brand kecil
                dalam 2 bulan. Cuan pertamaku 8,7 jt.
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                <span>35 video</span>
                <span>Revenue: 8.7 jt</span>
              </div>
            </Reveal>

            <Reveal className="rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.55)] p-6 shadow-[0_0_24px_rgba(30,174,219,0.16)]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[rgba(30,174,219,0.2)]" />
                <div>
                  <p className="text-sm font-semibold text-white">Nadia - 25</p>
                  <p className="text-xs text-white/50">
                    Niche: Lifestyle Produktif
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Paling membantu: template prompt dan flow editing. Aku bisa
                konsisten upload 4x seminggu tanpa kelelahan.
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-white/50">
                <span>48 video</span>
                <span>Revenue: 10.1 jt</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section> */}

      <Value />

      <section id="proof" className="px-6 pb-28">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold text-white md:text-5xl">
              Unleash Your Creative Potential
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-36 bg-gradient-to-r from-transparent via-[var(--glow-light)] to-transparent" />
            <p className="mx-auto mt-6 max-w-3xl text-sm leading-6 text-white/65 md:text-xl md:leading-8">
              Lihat bagaimana AI Faceless Content dapat meningkatkan
              penghasilanmu dalam waktu singkat.
            </p>
          </Reveal>

          <Reveal className="relative mt-10 overflow-hidden rounded-[24px] border border-[rgba(30,174,219,0.4)] bg-[rgba(3,10,24,0.82)] p-5 shadow-[0_0_38px_rgba(30,174,219,0.2)] md:p-7">
            <div className="pointer-events-none absolute -left-14 top-8 h-44 w-44 rounded-full bg-[rgba(30,174,219,0.14)] blur-[75px]" />
            <div className="pointer-events-none absolute -right-12 bottom-12 h-56 w-56 rounded-full bg-[rgba(51,195,240,0.16)] blur-[88px]" />

            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[rgba(7,16,36,0.68)] p-6 md:p-8">
                <p className="text-2xl font-semibold text-[var(--glow-light)] md:text-4xl">
                  Bukti Penghasilan Nyata
                </p>
                <p className="mt-5 text-sm leading-7 text-white/75 md:text-lg">
                  Ini bukti nyata pendapatan yang bisa dihasilkan dari konten AI
                  faceless. Bukan janji kosong, tapi hasil nyata yang bisa kamu
                  capai juga dengan formula yang tepat.
                </p>
                <ul className="mt-7 space-y-3 text-sm text-white/85 md:text-2xl">
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--glow-light)]">✓</span>
                    <span>Social Media Platform</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--glow-light)]">✓</span>
                    <span>Endorsement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[var(--glow-light)]">✓</span>
                    <span>Digital Product</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[rgba(30,174,219,0.45)] bg-[rgba(8,16,34,0.78)] p-2 shadow-[inset_0_0_20px_rgba(30,174,219,0.08)]">
                <Image
                  src="/images/testimoni2.png"
                  alt="Bukti penghasilan member AI Faceless Content Mastery"
                  width={1200}
                  height={760}
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LimitedOffer />
      <ProductSection />
      <EmailLeadSection />
      <FooterBar />
    </div>
  );
}

