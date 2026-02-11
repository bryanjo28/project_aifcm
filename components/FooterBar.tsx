import Reveal from "@/components/Reveal";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/heyjasz/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@heyjasz",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M14.8 4.2c.5 1.5 1.6 2.8 3.1 3.4.7.3 1.5.5 2.3.5v2.8c-1.2 0-2.4-.3-3.5-.8v4.7a6 6 0 1 1-6-6c.4 0 .8 0 1.2.1v2.9a3.2 3.2 0 0 0-4 3.1 3.2 3.2 0 1 0 6.4 0V4.2h.5Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@heyjasz",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M21.5 7.6a2.9 2.9 0 0 0-2-2c-1.8-.5-7.5-.5-7.5-.5s-5.7 0-7.5.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .5 4.4 2.9 2.9 0 0 0 2 2c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.5-4.4ZM10 15.2V8.8L15.5 12 10 15.2Z" />
      </svg>
    ),
  },
];

export default function FooterBar() {
  return (
    <footer className="border-t border-white/10 px-6 pb-14 pt-12">
      <div className="mx-auto w-full max-w-4xl">
        <Reveal className="text-center">
          <p className="mx-auto max-w-2xl text-xl leading-9 text-white/80">
            Kuasai skill AI ini supaya kamu bisa survive di Era New Creator
            Economy dan hasilkan cuan hingga 10 juta perbulannya cuman dari
            rumah
          </p>

          <div className="mt-8 flex items-center justify-center gap-8 text-white/90">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="transition hover:text-[var(--glow-light)]"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
