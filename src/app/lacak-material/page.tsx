"use client";

import { useState, useRef, FormEvent } from "react";
import { ScrollReveal } from "@/components/Animations";

/* ─── Types ──────────────────────────────────────────────── */
interface TrackingEntry {
  id: string;
  divisi: string;
  status: string;
  catatan: string | null;
  timestamp: string;
}

interface MaterialData {
  id: string;
  barcode: string;
  nama_material: string;
  jenis: string;
  tanggal_masuk: string;
  status_terakhir: string | null;
  divisi_terakhir: string | null;
  created_at: string;
  trackingHistory: TrackingEntry[];
}

/* ─── Constants ─────────────────────────────────────────── */
const DIVISI_ORDER = ["TWISTING", "DYEING", "WINDING", "INSPEKSI", "GUDANG"] as const;
type Divisi = (typeof DIVISI_ORDER)[number];

const DIVISI_LABELS: Record<Divisi, string> = {
  TWISTING: "Twisting",
  DYEING: "Dyeing",
  WINDING: "Winding",
  INSPEKSI: "Inspeksi",
  GUDANG: "Gudang",
};

/* ─── Helpers ───────────────────────────────────────────── */
function getHighestDivisiIndex(history: TrackingEntry[]): number {
  if (history.length === 0) return -1;
  const statuses = history.map((h) => h.status);
  const lastStatus = statuses[statuses.length - 1];
  const lastDivisi = history[history.length - 1].divisi;
  const lastIndex = DIVISI_ORDER.indexOf(lastDivisi as Divisi);

  // If last status is SELESAI at current divisi, mark that divisi as complete
  if (lastStatus === "SELESAI") return lastIndex;
  // If last status is KELUAR, that divisi is done and we move to next
  if (lastStatus === "KELUAR") return lastIndex;
  // If last status is MASUK, that divisi is the current active one
  return lastIndex;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "MASUK": return "Masuk";
    case "KELUAR": return "Keluar";
    case "SELESAI": return "Selesai";
    default: return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "MASUK": return "bg-blue-100 text-blue-700";
    case "KELUAR": return "bg-amber-100 text-amber-700";
    case "SELESAI": return "bg-emerald-100 text-emerald-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

/* ─── Component ──────────────────────────────────────────── */
export default function LacakMaterialPage() {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<MaterialData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = barcode.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Terjadi kesalahan. Silakan coba lagi.");
      } else {
        setResult(json.data);
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  }

  const highestIndex = result ? getHighestDivisiIndex(result.trackingHistory) : -1;

  return (
    <div>
      {/* Page Header */}
      <section className="bg-[#1a3a5c] py-12">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-[#e8a020] rounded-full" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Lacak
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Lacak Material
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Masukkan barcode material untuk melihat status dan riwayat produksi
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-container py-10">
        <div className="max-w-xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative mb-4">
            <div className="relative group">
              {/* Scanning line animation */}
              {loading && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8a020] to-transparent opacity-80 animate-scan-line z-10 pointer-events-none rounded-t-2xl" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Masukkan barcode material, contoh: GUNZE-2026-00001"
                disabled={loading}
                className="w-full pl-5 pr-36 py-4 border-2 border-gray-200 rounded-2xl text-sm font-mono bg-white focus:outline-none focus:border-[#1a3a5c] focus:ring-4 focus:ring-[#1a3a5c]/10 group-hover:border-[#1a3a5c]/50 transition-all placeholder:text-gray-400 placeholder:font-sans disabled:bg-gray-50 disabled:cursor-not-allowed"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 bg-[#1a3a5c]/5 blur-sm transition-opacity duration-300" />
            </div>
            <button
              type="submit"
              disabled={loading || !barcode.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Mencari...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Lacak
                </span>
              )}
            </button>
          </form>

          {/* Sample barcodes helper */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-xs text-gray-400 self-center font-semibold uppercase tracking-wide">
              Sample:
            </span>
            {["GUNZE-2026-00001", "GUNZE-2026-00002", "GUNZE-2026-00003"].map((bc) => (
              <button
                key={bc}
                onClick={() => {
                  setBarcode(bc);
                  inputRef.current?.focus();
                }}
                className="text-xs font-mono bg-gray-100 hover:bg-gray-200 text-[#1a3a5c] px-3 py-1 rounded-full transition-colors border border-gray-200 hover:border-[#1a3a5c]/30"
              >
                {bc}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Error State */}
          {!loading && error && <ErrorState message={error} />}

          {/* Result */}
          {!loading && !error && result && (
            <>
              <ScrollReveal animation="bounce-in">
                <SummaryCard material={result} />
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={0.15}>
                <TimelineView
                  history={result.trackingHistory}
                  highestIndex={highestIndex}
                />
              </ScrollReveal>
            </>
          )}

          {/* Initial Empty State */}
          {!loading && !error && !result && (
            <InitialState />
          )}
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────── */
function LoadingSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="w-4 h-4 animate-spin"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div className="card p-8 flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#1a3a5c]/20 border-t-[#1a3a5c] rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Mencari data material...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="card p-8 flex flex-col items-center gap-4 text-center border-red-100 bg-red-50/50">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" className="w-7 h-7">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-1">Material Tidak Ditemukan</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Tips: Coba masukkan barcode dengan format{" "}
        <span className="font-mono bg-gray-100 px-1 rounded">GUNZE-2026-XXXXX</span>
      </p>
    </div>
  );
}

function InitialState() {
  return (
    <div className="card p-10 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 bg-[#1a3a5c]/5 rounded-2xl flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="1.5" className="w-8 h-8 opacity-40">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-gray-600 text-sm">
          Masukkan Barcode untuk Melacak
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Ketik atau scan barcode material, lalu tekan Enter atau klik tombol
          Lacak
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ material }: { material: MaterialData }) {
  const isComplete = material.status_terakhir === "SELESAI";

  return (
    <div className="card overflow-hidden mb-6">
      <div className={`px-6 py-4 ${isComplete ? "bg-emerald-500" : "bg-[#1a3a5c]"}`}>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div>
            <p className="text-white font-semibold text-sm">{material.nama_material}</p>
            <p className="text-white/60 text-xs font-mono">{material.barcode}</p>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                isComplete
                  ? "bg-white/20 text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              {isComplete ? "✓ SELESAI" : "● DALAM PROSES"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              label: "Jenis Material",
              value: material.jenis,
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            },
            {
              label: "Divisi Saat Ini",
              value: material.divisi_terakhir
                ? DIVISI_LABELS[material.divisi_terakhir as Divisi] ?? material.divisi_terakhir
                : "—",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              ),
            },
            {
              label: "Status",
              value: material.status_terakhir
                ? getStatusLabel(material.status_terakhir)
                : "—",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
            {
              label: "Tanggal Masuk",
              value: formatDate(material.tanggal_masuk),
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#1a3a5c]/8 rounded-lg flex items-center justify-center shrink-0 text-[#1a3a5c]">
                {icon}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                  {label}
                </p>
                <p className="text-sm font-bold text-gray-800 leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineView({
  history,
  highestIndex,
}: {
  history: TrackingEntry[];
  highestIndex: number;
}) {
  return (
    <div className="card p-6 md:p-8">
      <h2 className="text-base font-bold text-[#1a3a5c] mb-6 flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Riwayat Produksi
      </h2>

      {/* Progress bar overview */}
      <div className="mb-8">
        <div className="flex gap-1">
          {DIVISI_ORDER.map((divisi, i) => {
            const isPassed = i <= highestIndex;
            return (
              <div
                key={divisi}
                className={`flex-1 h-2 rounded-full transition-all duration-700 ${
                  isPassed
                    ? "bg-emerald-500 animate-progress-fill"
                    : "bg-gray-200"
                }`}
                style={isPassed ? { animationDelay: `${i * 0.15}s` } : {}}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          {DIVISI_ORDER.map((divisi, i) => (
            <span
              key={divisi}
              className={`text-[9px] font-semibold uppercase tracking-wide ${
                i <= highestIndex ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {DIVISI_LABELS[divisi]}
            </span>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <div className="space-y-0">
          {DIVISI_ORDER.map((divisi, divisiIndex) => {
            const isPassed = divisiIndex <= highestIndex;
            const divisiEntries = history.filter((h) => h.divisi === divisi);

            return (
              <div key={divisi} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Node */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPassed
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200 animate-step-glow"
                        : "bg-white border-gray-200 text-gray-300"
                    }`}
                  >
                    {isPassed ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{divisiIndex + 1}</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-bold text-sm ${
                        isPassed ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {DIVISI_LABELS[divisi]}
                    </h3>
                    {isPassed && (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Selesai
                      </span>
                    )}
                    {!isPassed && (
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        Belum Dilalui
                      </span>
                    )}
                  </div>

                  {/* Tracking entries for this division */}
                  {divisiEntries.length > 0 ? (
                    <div className="space-y-1.5">
                      {divisiEntries.map((entry) => (
                        <div key={entry.id} className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getStatusColor(entry.status)}`}>
                            {getStatusLabel(entry.status)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(entry.timestamp)}
                          </span>
                          {entry.catatan && (
                            <span className="text-xs text-gray-500 italic w-full">
                              {entry.catatan}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-300 italic">Belum ada data</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
