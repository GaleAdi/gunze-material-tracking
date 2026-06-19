export default function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-white tracking-wide">
                PT Gunze Indonesia
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Sistem pelacakan material produksi untuk memastikan kualitas dan
              transparansi di setiap tahapan proses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
              navigasi
            </h4>
            <ul className="space-y-1.5">
              {[
                { href: "/", label: "Home" },
                { href: "/profile", label: "Profil Perusahaan" },
                { href: "/katalog", label: "Katalog Produk" },
                { href: "/lacak-material", label: "Lacak Material" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
              informasi
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 mt-0.5 shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>EJIP Industrial Park Plot 7H-1, Cikarang Selatan, Bekasi, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 shrink-0"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>Sistem Pelacakan Material</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} PT Gunze Indonesia. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-white/30">
            Didukung oleh Gunze Limited, Jepang — sejak 1896
          </p>
        </div>
      </div>
    </footer>
  );
}
