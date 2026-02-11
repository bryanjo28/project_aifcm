import Image from "next/image";
import Reveal from "@/components/Reveal";

const products = [
  {
    badge: "Diskon 41%",
    title: "The Creator's Handbook to AI",
    price: "Rp 59.000",
    oldPrice: "Rp 100.000",
    description:
      "Panduan dasar mencari uang dengan AI dan 100 ide cari penghasilan.",
    listTitle: "Buku E-book lengkap",
    features: [
      "100 ide cari uang dengan AI",
      "Panduan langkah per langkah",
      "Update seumur hidup",
    ],
    image: "/images/buku.png",
    imageAlt: "Cover The Creator's Handbook to AI",
    href: "https://yapp.ink/jasonai/product/the-creators-handbook-to-ai",
    ctaClass:
      "bg-gradient-to-r from-[#7f31ff] to-[#6a29da] shadow-[0_12px_26px_rgba(127,49,255,0.28)]",
  },
  {
    badge: "Laris!",
    title: "AI Faceless Content Mentoring",
    price: "Rp 499.000",
    oldPrice: "Rp 799.000",
    description:
      "Kursus lengkap untuk menghasilkan konten berkualitas tinggi dengan AI tanpa tampil di muka.",
    listTitle: "Yang kamu dapatkan",
    features: [
      "Buku The Creator's Handbook to AI",
      "Konsultasi pribadi",
      "Discord exclusive community",
      "WhatsApp group community",
      "Video tutorial lengkap",
    ],
    image: "/images/mentoring.png",
    imageAlt: "Dokumentasi AI Faceless Content Mentoring",
    href:
      "https://yapp.ink/jasonai/product/bantuin-kamu-dapet-10-juta-dari-ngonten-pake-a-course-ai-faceless-content-mastery",
    ctaClass:
      "bg-gradient-to-r from-[var(--glow-blue)] to-[#2d7cff] shadow-[0_12px_26px_rgba(30,174,219,0.28)]",
  },
];

export default function ProductSection() {
  return (
    <section id="produk" className="px-6 pb-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold text-white md:text-5xl">Produk</h2>
          <div className="mx-auto mt-4 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--glow-light)] to-transparent" />
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-6 text-white/70 md:text-xl md:leading-8">
            Pilih produk yang sesuai dengan kebutuhan Anda untuk memulai
            perjalanan content creation dengan AI.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-7 lg:grid-cols-2">
          {products.map((product) => (
            <Reveal
              key={product.title}
              className="relative overflow-hidden rounded-[22px] border border-[rgba(30,174,219,0.45)] bg-[rgba(3,10,24,0.85)] p-5 shadow-[0_0_30px_rgba(30,174,219,0.2)] md:p-6"
            >
              <div className="pointer-events-none absolute -left-14 top-8 h-40 w-40 rounded-full bg-[rgba(30,174,219,0.12)] blur-[70px]" />
              <div className="pointer-events-none absolute -right-12 bottom-9 h-44 w-44 rounded-full bg-[rgba(51,195,240,0.1)] blur-[75px]" />

              <div className="relative">
                <span className="inline-flex rounded-full bg-[rgba(51,195,240,0.22)] px-3 py-1 text-xs font-semibold text-[var(--glow-light)]">
                  {product.badge}
                </span>

                <div className="mt-4 flex justify-center rounded-2xl border border-white/10 bg-[rgba(7,16,36,0.65)] px-4 py-4">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    width={560}
                    height={340}
                    className="h-auto max-h-[210px] w-auto max-w-full object-contain"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white md:text-[2rem] md:leading-[1.15]">
                  {product.title}
                </h3>

                <div className="mt-3 flex items-end gap-3">
                  <p className="text-3xl font-semibold text-[var(--glow-light)] md:text-4xl">
                    {product.price}
                  </p>
                  <p className="pb-1 text-sm text-white/45 line-through">
                    {product.oldPrice}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
                  {product.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-white md:text-base">
                  {product.listTitle}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--glow-light)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110 md:text-base ${product.ctaClass}`}
                >
                  Beli Sekarang
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
