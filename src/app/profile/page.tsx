/*
 * DATA PROFIL PERUSAHAAN
 *
 * NOTE FOR CLIENT:
 * Semua informasi di bawah ini perlu diverifikasi dan dilengkapi
 * oleh klien sebelum go-live. Terutama:
 * - Nomor telepon, email resmi, dan kontak perusahaan
 * - Detail fasilitas (luas pabrik, jumlah karyawan, kapasitas produksi)
 * - Data keuangan atau penghargaan yang relevan
 * - Link media sosial atau website resmi Gunze Indonesia
 */

import {
  Building2,
  MapPin,
  Factory,
  Globe,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { ScrollReveal } from "@/components/Animations";

export default function ProfilePage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-[#1a3a5c] py-14 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#e8a020]/8 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-[#234e7a]/50 blur-3xl" />

        <div className="section-container relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Logo */}
            <div className="shrink-0">
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-white shadow-xl shadow-black/20 flex items-center justify-center p-3 border border-white/20">
                <img
                  src="/gunze-logo.jpg"
                  alt="PT Gunze Indonesia"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Accent line below logo */}
              <div className="mt-3 mx-auto w-12 h-1 bg-[#e8a020] rounded-full" />
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020] mb-2">
                Tentang Kami
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Profil Perusahaan
              </h1>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                Produsen benang jahit berkualitas standar Jepang sejak 1991,
                bagian dari{" "}
                <span className="text-white font-semibold">Gunze Limited</span>{" "}
                yang telah berdiri sejak 1896.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Content */}
      <section className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Key Info */}
          <div className="lg:col-span-1 space-y-5">
            {/* Company Card */}
            <div className="card overflow-hidden shadow-md shadow-[#1a3a5c]/5">
              <div className="bg-[#1a3a5c] px-6 py-4">
                <h2 className="text-white font-bold text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#e8a020]" />
                  Informasi Perusahaan
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { icon: <Building2 className="w-4 h-4" />, label: "Nama", value: "PT Gunze Indonesia" },
                  { icon: <MapPin className="w-4 h-4" />, label: "Tahun Berdiri", value: "1991" },
                  { icon: <Globe className="w-4 h-4" />, label: "Induk Perusahaan", value: "Gunze Limited, Jepang" },
                  { icon: <Factory className="w-4 h-4" />, label: "Lokasi", value: "EJIP Industrial Park, Cikarang, Bekasi" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#1a3a5c]/8 rounded-lg flex items-center justify-center shrink-0 text-[#1a3a5c]">{icon}</div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Card */}
            <ScrollReveal animation="scale-in" delay={0.15}>
              <div className="card p-5 shadow-md shadow-[#1a3a5c]/5">
                <h3 className="font-bold text-[#1a3a5c] mb-4 flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4" />
                  Nilai Perusahaan
                </h3>
                <ul className="space-y-3">
                  {[
                    { title: "Kualitas Tanpa Kompromi", desc: "Standar produksi ala Jepang di setiap tahap" },
                    { title: "Kepuasan Pelanggan", desc: "Komitmen penuh untuk memenuhi ekspektasi" },
                    { title: "Disiplin Produksi", desc: "Eksekusi presisi dan konsistensi operasional" },
                  ].map(({ title, desc }) => (
                    <li key={title} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#e8a020] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Narrative Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <ScrollReveal animation="slide-right" delay={0.05}>
              <div className="card p-6 md:p-8 shadow-md shadow-[#1a3a5c]/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-6 bg-[#e8a020] rounded-full" />
                  <h2 className="text-lg font-bold text-[#1a3a5c]">Tentang PT Gunze Indonesia</h2>
                </div>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                  <p>
                    PT Gunze Indonesia adalah perusahaan manufaktur yang bergerak di bidang produksi{" "}
                    <strong className="text-gray-900 font-semibold">benang jahit (sewing thread) berkualitas tinggi</strong>{" "}
                    dengan standar Jepang. Didirikan pada tahun 1991, perusahaan ini telah mengukuhkan posisinya sebagai salah satu produsen benang jahit terkemuka di Indonesia, melayani pasar lokal maupun ekspor.
                  </p>
                  <p>
                    Sebagai bagian dari <strong className="text-gray-900 font-semibold">Gunze Group</strong> — perusahaan asal Jepang yang telah berdiri sejak tahun 1896 — PT Gunze Indonesia mengadopsi prinsip-prinsip produksi ketat yang telah menjadikan Gunze Group dikenal di seluruh dunia. Pengalaman lebih dari satu abad serta jaringan produksi di lima negara menjadi landasan kuat bagi kualitas produk kami.
                  </p>
                  <p>
                    Perusahaan mengoperasikan fasilitas produksi yang lengkap di kawasan{" "}
                    <strong className="text-gray-900 font-semibold">EJIP Industrial Park, Cikarang Selatan, Bekasi, Jawa Barat</strong>. Fasilitas dyeing yang kami miliki memungkinkan обработка berbagai jenis textured yarn sesuai kebutuhan spesifik pelanggan, baik untuk industri garmen, textile, maupun aplikasi teknis lainnya.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Gunze Group Network */}
            <ScrollReveal animation="slide-right" delay={0.1}>
              <div className="card p-6 md:p-8 shadow-md shadow-[#1a3a5c]/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-1.5 h-6 bg-[#e8a020] rounded-full" />
                  <h2 className="text-lg font-bold text-[#1a3a5c]">Jaringan Gunze Group</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Keanggotaan dalam jaringan produksi global Gunze Group membuka akses terhadap teknologi, riset, dan standar mutu yang terus berkembang. Basis produksi Gunze Group tersebar di lima negara:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { flag: "🇯🇵", country: "Jepang", role: "Kantor Pusat & Inovasi", desc: "Markas Gunze Limited, pusat riset dan pengembangan" },
                    { flag: "🇨🇳", country: "China", role: "Produksi Skala Besar", desc: "Fasilitas produksi utama untuk pasar Asia-Pasifik" },
                    { flag: "🇧🇩", country: "Bangladesh", role: "Produksi Regional", desc: "Mendukung industri garment Asia Selatan" },
                    { flag: "🇻🇳", country: "Vietnam", role: "Produksi Regional", desc: "Jangkauan produksi untuk pasar Asia Tenggara" },
                    { flag: "🇮🇩", country: "Indonesia", role: "Produksi & Ekspor", desc: "Pabrik di Cikarang melayani pasar lokal & ekspor" },
                  ].map(({ flag, country, role, desc }) => (
                    <div key={country} className="group bg-[#1a3a5c]/4 rounded-xl p-4 hover:bg-[#1a3a5c]/8 transition-all duration-300 border border-[#1a3a5c]/10 hover:border-[#1a3a5c]/20">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-2xl leading-none">{flag}</span>
                        <div>
                          <p className="font-bold text-sm text-[#1a3a5c]">{country}</p>
                          <p className="text-[10px] font-semibold text-[#e8a020] uppercase tracking-wide">{role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Commitment */}
            <ScrollReveal animation="scale-in" delay={0.05}>
              <div className="bg-gradient-to-br from-[#1a3a5c] to-[#0f2840] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-[#1a3a5c]/20">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#e8a020]/8 blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#234e7a]/40 blur-3xl translate-y-1/2 -translate-x-1/4" />
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#e8a020] rounded-l-2xl" />

                <div className="relative flex flex-col sm:flex-row items-start gap-5">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Users className="w-7 h-7 text-[#e8a020]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-2">Komitmen terhadap Kualitas</h3>
                    <p className="text-white/75 text-sm leading-relaxed">
                      Dengan dukungan jaringan global Gunze Group dan pengalaman lebih dari tiga dekade di Indonesia, kami berkomitmen menghadirkan produk benang jahit berkualitas konsisten kepada setiap pelanggan — baik di pasar lokal maupun internasional. Keandalan, ketepatan, dan kepuasan pelanggan adalah prioritas utama kami.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
