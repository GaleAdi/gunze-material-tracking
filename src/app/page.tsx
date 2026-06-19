import Link from "next/link";
import { ScrollReveal } from "@/components/Animations";

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-[#1a3a5c] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#e8a020]/8 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#234e7a]/60 blur-[60px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hg)" />
          </svg>
        </div>

        <div className="section-container relative py-20 md:py-28">
          {/* Eyebrow */}
          <ScrollReveal animation="fade-in" delay={0}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/70 text-xs font-semibold uppercase tracking-[0.18em] px-3.5 py-1.5 rounded-full mb-7 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              EJIP Industrial Park, Cikarang — Bekasi
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal animation="slide-right" delay={0.05}>
            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-white leading-[1.1] mb-5 tracking-tight">
              PT Gunze Indonesia
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal animation="fade-up" delay={0.15}>
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-3 max-w-xl">
              Produsen benang jahit berkualitas standar Jepang sejak 1991, bagian dari{" "}
              <span className="text-[#e8a020] font-semibold">Gunze Limited</span>{" "}
              yang telah berdiri sejak 1896.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.25}>
            <p className="text-sm text-white/55 leading-relaxed mb-10 max-w-xl">
              Dengan fasilitas lengkap untuk produksi dan pewarnaan benang, kami melayani pasar lokal dan ekspor dengan komitmen mutu yang tak kompromi.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal animation="scale-in" delay={0.35}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/lacak-material" className="btn-accent text-sm px-7 py-3.5 group">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Lacak Material
              </Link>
              <Link href="/katalog" className="inline-flex items-center gap-2 bg-transparent border-2 border-white/50 text-white font-semibold text-sm px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#1a3a5c] hover:border-white transition-all duration-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Katalog Produk
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="section-container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                animation: "fade-up" as const, delay: 0,
                icon: <path d="M12 2L2 7l10 5 10-5-10-5z" />,
                label: "Didirikan",
                value: "1991",
              },
              {
                animation: "scale-in" as const, delay: 0.06,
                icon: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
                label: "Induk Perusahaan",
                value: "Gunze Limited, Jepang",
              },
              {
                animation: "fade-up" as const, delay: 0.12,
                icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>,
                label: "Fasilitas",
                value: "Dyeing & Produksi",
              },
              {
                animation: "scale-in" as const, delay: 0.18,
                icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
                label: "Jangkauan",
                value: "Lokal & Ekspor",
              },
            ].map(({ animation, delay, icon, label, value }) => (
              <ScrollReveal key={label} animation={animation} delay={delay}>
                <div className="stat-card group hover:shadow-md hover:shadow-[#1a3a5c]/8 transition-shadow duration-300">
                  <div className="w-10 h-10 bg-[#1a3a5c]/7 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1a3a5c]/12 transition-colors duration-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.8" className="w-5 h-5">{icon}</svg>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-[0.1em] mb-1">{label}</p>
                  <p className="text-sm font-bold text-[#1a3a5c] leading-snug">{value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Production Flow ──────────────────────────────── */}
      <section className="section-container py-16">
        <ScrollReveal animation="fade-up" delay={0}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#1a3a5c]/5 text-[#1a3a5c] text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4 border border-[#1a3a5c]/10">
              Proses Produksi
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f2840] mb-3">
              Alur Produksi Kami
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Setiap material melewati 5 checkpoint ketat sebelum siap dikirim ke pelanggan.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { step: "01", name: "Twisting", desc: "Pembuatan & pemutaran benang", bg: "bg-blue-50", border: "border-blue-100", numColor: "text-blue-300", nameColor: "text-blue-900" },
            { step: "02", name: "Dyeing", desc: "Pewarnaan benang berbagai jenis", bg: "bg-indigo-50", border: "border-indigo-100", numColor: "text-indigo-300", nameColor: "text-indigo-900" },
            { step: "03", name: "Winding", desc: "Penggulungan ke bentuk akhir", bg: "bg-violet-50", border: "border-violet-100", numColor: "text-violet-300", nameColor: "text-violet-900" },
            { step: "04", name: "Inspeksi", desc: "Pengecekan kualitas ketat", bg: "bg-purple-50", border: "border-purple-100", numColor: "text-purple-300", nameColor: "text-purple-900" },
            { step: "05", name: "Gudang", desc: "Siap kirim ke pelanggan", bg: "bg-emerald-50", border: "border-emerald-100", numColor: "text-emerald-300", nameColor: "text-emerald-900" },
          ].map(({ step, name, desc, bg, border, numColor, nameColor }, idx) => (
            <ScrollReveal key={name} animation="zoom-in" delay={0.04 * idx}>
              <div className={`card p-5 text-center border ${bg} ${border} hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default`}>
                {/* Step number */}
                <div className={`text-3xl font-black ${numColor} opacity-50 mb-2 select-none`}>{step}</div>
                {/* Divider line */}
                <div className={`h-0.5 w-6 mx-auto mb-3 rounded-full ${bg.replace('50','200')}`} />
                <h3 className={`font-bold text-sm mb-1 ${nameColor}`}>{name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fade-up" delay={0.25}>
          <div className="text-center mt-10">
            <Link href="/lacak-material" className="btn-primary text-sm px-8 py-3.5">
              Lacak Material Anda
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Gunze Group Overview ────────────────────────── */}
      <section className="bg-[#1a3a5c] py-14 relative overflow-hidden">
        {/* Shimmer divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a020]/40 to-transparent" />

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#234e7a]/30 blur-[80px] rounded-full" />

        <div className="section-container relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text */}
            <ScrollReveal animation="slide-right" delay={0} className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8a020] mb-3">Gunze Group</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-tight">
                Jejaring Produksi di 5 Negara
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-md">
                Sebagai bagian dari Gunze Group, PT Gunze Indonesia berdiri bersama fasilitas produksi di Jepang, China, Bangladesh, Vietnam, dan Indonesia — memberikan kapabilitas global dengan standar lokal yang ketat.
              </p>
              <Link href="/profile" className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#e8a020] hover:text-white transition-colors duration-200 group">
                Lihat Profil Perusahaan
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>

            {/* Right: Country Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { flag: "🇯🇵", country: "Jepang", note: "Kantor Pusat" },
                { flag: "🇨🇳", country: "China", note: "Produksi" },
                { flag: "🇧🇩", country: "Bangladesh", note: "Produksi" },
                { flag: "🇻🇳", country: "Vietnam", note: "Produksi" },
                { flag: "🇮🇩", country: "Indonesia", note: "Produksi" },
                { flag: "🌐", country: "Global", note: "Ekspor" },
              ].map(({ flag, country, note }, idx) => (
                <ScrollReveal key={country} animation="scale-in" delay={0.05 * idx}>
                  <div className="bg-white/8 backdrop-blur-sm rounded-xl p-3.5 text-center border border-white/10 hover:bg-white/14 hover:border-white/18 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                    <div className="text-2xl mb-1.5 leading-none">{flag}</div>
                    <p className="text-white font-semibold text-xs">{country}</p>
                    <p className="text-white/45 text-[10px] mt-0.5">{note}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
