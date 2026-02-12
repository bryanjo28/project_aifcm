import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function Value() {
  return (
    <section id="value" className="px-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="relative overflow-hidden rounded-[28px] border border-[rgba(30,174,219,0.32)] bg-[rgba(5,10,22,0.82)] p-6 shadow-[0_0_36px_rgba(30,174,219,0.18)] md:p-10">
          <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[rgba(30,174,219,0.12)] blur-[90px]" />
          <div className="pointer-events-none absolute -right-10 bottom-8 h-60 w-60 rounded-full bg-[rgba(51,195,240,0.14)] blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_60px_1fr]">
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">
                  AKSES LIFETIME
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                  Paling tidak enak itu ketika baru mulai dan ada waktunya,
                  tapi akses ke kelasnya udah tutup.
                </p>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                  Kami berbeda, kami berkomitmen penuh untuk melayani dan
                  membimbing kalian tanpa ada batasan waktu.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-[rgba(30,174,219,0.18)] blur-[30px]" />
                <div className="rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.75)] p-3 shadow-[0_0_24px_rgba(30,174,219,0.18)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[rgba(10,18,36,0.8)]">
                    <Image
                      src="/images/placeholder-social.png"
                      alt="Preview sosial media"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden items-center justify-center lg:flex">
              <div className="absolute left-1/2 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(51,195,240,0.5)] to-transparent" />
              <div className="flex h-full flex-col items-center justify-between py-6">
                <div className="rounded-2xl border border-[rgba(30,174,219,0.5)] bg-[rgba(12,20,40,0.85)] px-4 py-3 text-lg font-semibold text-white">
                  01
                </div>
                <div className="rounded-2xl border border-[rgba(30,174,219,0.5)] bg-[rgba(12,20,40,0.85)] px-4 py-3 text-lg font-semibold text-white">
                  02
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative mx-auto w-full max-w-sm lg:ml-auto">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[rgba(51,195,240,0.16)] blur-[30px]" />
                <div className="rounded-3xl border border-[rgba(30,174,219,0.35)] bg-[rgba(8,16,34,0.75)] p-3 shadow-[0_0_24px_rgba(30,174,219,0.18)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[rgba(10,18,36,0.8)]">
                    <Image
                      src="/images/placeholder-community.png"
                      alt="Preview community"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  TIDAK PERLU TAKUT APA PUN
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                  Banyak yang takut dan mengira jadi kreator itu butuh alat-alat
                  mahal, bayar software jutaan, dan skill produksi atau public
                  speaking yang setingkat dewa.
                </p>
                <p className="mt-4 text-sm leading-6 text-white/70 md:text-base">
                  Kami menawarkan solusi berbasis AI untuk mengatasi semua
                  masalah tersebut tanpa perlu menghabiskan banyak uang.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
