"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Top bar */}
      <div className="bg-[#1a3a5c] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Admin Dashboard</p>
              <p className="text-white/50 text-xs">Gunze Material Tracking</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a3a5c] mb-1">Selamat Datang</h1>
          <p className="text-gray-500 text-sm">
            Kelola data produk dan pantau aktivitas sistem pelacakan material.
          </p>
        </div>

        {/* Menu cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Kelola Katalog */}
          <Link
            href="/admin/katalog"
            className="card p-6 flex items-start gap-4 group hover:border-[#1a3a5c]/30 hover:-translate-y-0.5 transition-all animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="w-12 h-12 bg-[#1a3a5c]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1a3a5c]/15 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.8" className="w-6 h-6">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1a3a5c] transition-colors">
                Kelola Katalog Produk
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tambah, edit, dan hapus produk dari katalog. Gambar produk juga bisa diupload langsung.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1a3a5c]">
                Buka
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Registrasi Material */}
          <Link
            href="/admin/material"
            className="card p-6 flex items-start gap-4 group hover:border-[#1a3a5c]/30 hover:-translate-y-0.5 transition-all animate-fade-in-up"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="w-12 h-12 bg-[#e8a020]/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#e8a020]/25 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e8a020" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1a3a5c] transition-colors">
                Registrasi Material
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Daftarkan material baru dan generate QR code barcode untuk ditempelkan di material fisik.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1a3a5c]">
                Buka
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Lacak Material */}
          <Link
            href="/lacak-material"
            className="card p-6 flex items-start gap-4 group hover:border-[#1a3a5c]/30 hover:-translate-y-0.5 transition-all animate-fade-in-up"
            style={{ animationDelay: "0.19s" }}
          >
            <div className="w-12 h-12 bg-[#1a3a5c]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1a3a5c]/15 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.8" className="w-6 h-6">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1a3a5c] transition-colors">
                Lacak Material
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lihat data tracking material dan riwayat produksi untuk setiap barcode.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1a3a5c]">
                Buka
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Scan Material */}
          <Link
            href="/scan"
            className="card p-6 flex items-start gap-4 group hover:border-[#1a3a5c]/30 hover:-translate-y-0.5 transition-all animate-fade-in-up"
            style={{ animationDelay: "0.26s" }}
          >
            <div className="w-12 h-12 bg-[#1a3a5c]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1a3a5c]/15 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.8" className="w-6 h-6">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1a3a5c] transition-colors">
                Scan Material
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Input data tracking per divisi produksi. Digunakan di lantai produksi.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1a3a5c]">
                Buka
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Profil Perusahaan */}
          <Link
            href="/profile"
            className="card p-6 flex items-start gap-4 group hover:border-[#1a3a5c]/30 hover:-translate-y-0.5 transition-all animate-fade-in-up"
            style={{ animationDelay: "0.33s" }}
          >
            <div className="w-12 h-12 bg-[#1a3a5c]/8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1a3a5c]/15 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.8" className="w-6 h-6">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-base mb-1 group-hover:text-[#1a3a5c] transition-colors">
                Profil Perusahaan
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Lihat profil PT Gunze Indonesia dan jaringan Gunze Group.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#1a3a5c]">
                Buka
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
