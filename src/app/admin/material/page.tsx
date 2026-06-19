"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Material {
  id: string;
  barcode: string;
  nama_material: string;
  jenis: string;
  tanggal_masuk: string;
  status_terakhir: string | null;
  divisi_terakhir: string | null;
  created_at: string;
}

interface CreatedResult {
  data: Material;
  qrCode: string;
}

const JENIS_OPTIONS = [
  "Benang Polyester",
  "Benang Katun",
  "Benang Nylon",
  "Benang Spandex",
  "Benang Texture",
  "Benang Filament",
  "Lainnya",
];

const DIVISI_LABELS: Record<string, string> = {
  TWISTING: "Twisting",
  DYEING: "Dyeing",
  WINDING: "Winding",
  INSPEKSI: "Inspeksi",
  GUDANG: "Gudang",
};

const STATUS_LABELS: Record<string, string> = {
  MASUK: "Masuk",
  KELUAR: "Keluar",
  SELESAI: "Selesai",
};

export default function MaterialAdminPage() {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recentMaterials, setRecentMaterials] = useState<Material[]>([]);
  const [created, setCreated] = useState<CreatedResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const namaRef = useRef<HTMLInputElement>(null);

  // Load recent materials
  useEffect(() => {
    fetch("/api/material")
      .then((r) => r.json())
      .then((d) => { if (d.data) setRecentMaterials(d.data.slice(0, 20)); });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !jenis) return;

    setLoading(true);
    setError(null);
    setCreated(null);

    try {
      const res = await fetch("/api/material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_material: nama.trim(), jenis }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Terjadi kesalahan.");
      } else {
        setCreated(json);
        setShowSuccess(true);
        setNama("");
        setJenis("");
        namaRef.current?.focus();
        // Refresh list
        const listRes = await fetch("/api/material");
        const listJson = await listRes.json();
        if (listJson.data) setRecentMaterials(listJson.data.slice(0, 20));
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!created) return;
    const link = document.createElement("a");
    link.href = created.qrCode;
    link.download = `QR-${created.data.barcode}.png`;
    link.click();
  }

  function printQR() {
    if (!created || !printRef.current) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>QR - ${created.data.barcode}</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; margin: 0; }
            img { width: 200px; height: 200px; }
            h2 { font-size: 14px; margin: 12px 0 4px; color: #1a3a5c; }
            p { margin: 0; font-size: 11px; color: #555; }
            .barcode { font-family: monospace; font-size: 13px; font-weight: bold; color: #1a3a5c; margin-top: 6px; }
            hr { border: none; border-top: 1px dashed #ccc; margin: 16px 0; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Top bar */}
      <div className="bg-[#1a3a5c] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-white/60 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div>
              <p className="text-white font-bold text-sm">Registrasi Material</p>
              <p className="text-white/50 text-xs">Admin Dashboard — Gunze Material Tracking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Form Registrasi ── */}
          <div>
            <div className="card p-6">
              <h2 className="text-base font-bold text-[#1a3a5c] mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1a3a5c]/8 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="2" className="w-4 h-4">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                Registrasi Material Baru
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Nama Material <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={namaRef}
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Benang Polyester 150D"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Jenis Benang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                    required
                  >
                    <option value="">— Pilih Jenis Benang —</option>
                    {JENIS_OPTIONS.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-4 h-4 shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-red-700 text-xs font-medium">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !nama.trim() || !jenis}
                  className="w-full bg-[#1a3a5c] hover:bg-[#234e7a] active:bg-[#0f2840] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 animate-spin">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Daftarkan & Generate QR
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="bg-[#f4f5f7] rounded-lg p-3 flex items-start gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    QR code akan di-generate otomatis setelah material berhasil didaftarkan. Print atau download QR tersebut dan tempelkan di material fisik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── QR Code Output ── */}
          <div>
            {showSuccess && created ? (
              <div className="card p-6 animate-bounce-in">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="w-4 h-4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-[#1a3a5c]">QR Code Material</h2>
                </div>

                {/* Printable QR area */}
                <div ref={printRef} className="text-center">
                  <div className="bg-[#1a3a5c]/3 rounded-xl p-6 inline-block mb-4">
                    <img
                      src={created.qrCode}
                      alt={`QR Code ${created.data.barcode}`}
                      className="w-44 h-44 mx-auto"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-[#1a3a5c]">{created.data.nama_material}</h3>
                  <p className="text-xs text-gray-500 mt-1">{created.data.jenis}</p>
                  <p className="text-sm font-bold font-mono text-[#1a3a5c] mt-2 tracking-widest">{created.data.barcode}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={downloadQR}
                    className="flex-1 bg-[#e8a020] hover:bg-[#d4920e] text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PNG
                  </button>
                  <button
                    onClick={printQR}
                    className="flex-1 bg-[#1a3a5c] hover:bg-[#234e7a] text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    Print Label
                  </button>
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <div className="card p-6 flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="w-10 h-10">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-500 mb-1">QR Code belum ada</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Daftarkan material baru di sebelah kiri, QR code akan muncul di sini.
                </p>
              </div>
            )}

            {/* Info */}
            <div className="card mt-4 p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Format Barcode</h3>
              <div className="space-y-2">
                {["GUNZE-2026-00001", "GUNZE-2026-00002"].map((bc) => (
                  <div key={bc} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="w-3 h-3">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                    </div>
                    <span className="text-xs font-mono font-semibold text-gray-600">{bc}</span>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400 mt-2">
                  Format: GUNZE-YYYY-NNNNN (tahun-nomor urut)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Materials */}
        {recentMaterials.length > 0 && (
          <div className="mt-6">
            <div className="card overflow-hidden">
              <div className="bg-[#1a3a5c] px-5 py-3">
                <h2 className="text-white font-bold text-sm">Material Terbaru</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Barcode</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Nama Material</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Jenis</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Tanggal</th>
                      <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMaterials.map((m) => (
                      <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#1a3a5c]">{m.barcode}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium text-xs">{m.nama_material}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{m.jenis}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(m.tanggal_masuk).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="px-4 py-3">
                          {m.status_terakhir ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              {m.divisi_terakhir ? DIVISI_LABELS[m.divisi_terakhir] : STATUS_LABELS[m.status_terakhir]}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                              Belum Scan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
