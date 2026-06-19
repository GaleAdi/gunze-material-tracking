"use client";

import { useState, useRef, useEffect, FormEvent, useCallback } from "react";

/* ─── Types ──────────────────────────────────────────────── */
interface RecentScan {
  id: string;
  divisi: string;
  status: string;
  catatan: string | null;
  timestamp: string;
  material: {
    barcode: string;
    nama_material: string;
    jenis: string;
  };
}

interface SuccessPayload {
  id: string;
  barcode: string;
  nama_material: string;
  divisi: string;
  status: string;
}

/* ─── Audio Engine ───────────────────────────────────────── */
class AudioBeep {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.ctx;
  }

  success() {
    this.beep(880, 0.1, "sine");
    setTimeout(() => this.beep(1100, 0.1, "sine"), 100);
  }

  error() {
    this.beep(330, 0.15, "square");
    setTimeout(() => this.beep(260, 0.2, "square"), 180);
  }

  networkError() {
    this.beep(200, 0.08, "sine");
  }

  private beep(frequency: number, duration: number, type: OscillatorType = "sine") {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported
    }
  }
}

const audio = new AudioBeep();

/* ─── Constants ─────────────────────────────────────────── */
const DIVISI_OPTIONS = [
  { value: "TWISTING", label: "Twisting", icon: "⚙️", color: "bg-blue-500" },
  { value: "DYEING", label: "Dyeing", icon: "🎨", color: "bg-indigo-500" },
  { value: "WINDING", label: "Winding", icon: "🧵", color: "bg-violet-500" },
  { value: "INSPEKSI", label: "Inspeksi", icon: "🔍", color: "bg-purple-500" },
  { value: "GUDANG", label: "Gudang", icon: "📦", color: "bg-emerald-500" },
] as const;

const STATUS_OPTIONS = [
  { value: "MASUK", label: "Masuk", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "KELUAR", label: "Keluar", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "SELESAI", label: "Selesai", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
] as const;

/* ─── Helpers ───────────────────────────────────────────── */
function formatJam(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatTanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Sub-components ─────────────────────────────────────── */
function PulseIndicator({ active }: { active: boolean }) {
  return (
    <span className="relative inline-flex items-center gap-1.5">
      <span className={`absolute inline-flex h-full w-full rounded-full ${active ? "bg-emerald-400" : "bg-amber-400"} animate-pulse-ring`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-emerald-500" : "bg-amber-500"}`} />
    </span>
  );
}

function BarcodeInput({
  value,
  onChange,
  disabled,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="relative group">
      {/* Scanning line animation */}
      {!disabled && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 animate-scan-line z-10 pointer-events-none rounded-t-xl" />
      )}

      {/* Glow effect when focused */}
      <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#1a3a5c] via-[#234e7a] to-[#1a3a5c] opacity-0 transition-opacity duration-300 -z-10 blur-sm ${!disabled ? "group-hover:opacity-30" : ""}`} />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pindai barcode di sini..."
        disabled={disabled}
        className="w-full pl-5 pr-4 py-5 border-2 border-gray-200 rounded-xl text-base font-mono font-bold tracking-wider bg-white transition-all duration-200 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal disabled:bg-gray-50 disabled:cursor-not-allowed focus:outline-none focus:border-[#1a3a5c] focus:ring-0 group-hover:border-[#1a3a5c]/50"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Barcode icon watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
          <path d="M2 4h2v16H2zM6 4h1v16H6zM9 4h3v16H9zM14 4h2v16h-2zM18 4h3v16h-3z" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function ScanPage() {
  const [divisi, setDivisi] = useState<string>("TWISTING");
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState<string>("MASUK");
  const [catatan, setCatatan] = useState("");
  const [recent, setRecent] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<SuccessPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<"success" | "error" | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const fetchRecent = useCallback(async (div: string) => {
    try {
      const res = await fetch(`/api/scan/recent?divisi=${div}`);
      if (!res.ok) return;
      const json = await res.json();
      setRecent(json.data ?? []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchRecent(divisi);
  }, [divisi, fetchRecent]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = barcode.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: trimmed, divisi, status, catatan }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Terjadi kesalahan.");
        triggerFlash("error");
        audio.error();
      } else {
        setSuccess({
          id: json.data.id,
          barcode: json.data.barcode,
          nama_material: json.material.nama_material,
          divisi,
          status,
        });
        setBarcode("");
        setCatatan("");
        fetchRecent(divisi);
        barcodeRef.current?.focus();
        triggerFlash("success");
        audio.success();
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
      triggerFlash("error");
      audio.networkError();
    } finally {
      setLoading(false);
    }
  }

  function triggerFlash(type: "success" | "error") {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setFlash(type);
    flashTimerRef.current = setTimeout(() => setFlash(null), 700);
  }

  const selectedDivisi = DIVISI_OPTIONS.find((d) => d.value === divisi);
  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === status);

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* ── Full-screen Flash ── */}
      {flash && (
        <div
          className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-200 ${
            flash === "success"
              ? "bg-emerald-500/15 opacity-100"
              : "bg-red-500/15 opacity-100"
          }`}
        />
      )}

      {/* Header */}
      <div className="bg-[#1a3a5c] px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Animated logo */}
            <div className="relative">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              {/* Pulse ring */}
              <span className="absolute -inset-1 rounded-xl border-2 border-white/30 animate-pulse-ring opacity-0" />
            </div>

            <div className="flex-1">
              <h1 className="text-white font-bold text-lg">Scan Material</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <PulseIndicator active={!loading} />
                <p className="text-white/60 text-xs">
                  {loading ? "Memproses..." : `Divisi ${selectedDivisi?.label ?? divisi} — Siap Scan`}
                </p>
              </div>
            </div>

            {/* Scan count badge */}
            <div className="text-right">
              <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
                <p className="text-white font-bold text-lg leading-none">{recent.length}</p>
                <p className="text-white/50 text-[10px] uppercase tracking-wide">scan</p>
              </div>
            </div>
          </div>

          {/* Divisi pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {DIVISI_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDivisi(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  divisi === opt.value
                    ? `${opt.color} text-white shadow-lg`
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* ── Scan Form ── */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg shadow-[#1a3a5c]/5 overflow-hidden">
          {/* Top accent bar */}
          <div className={`h-1 ${selectedDivisi?.color ?? "bg-[#1a3a5c]"} transition-colors duration-300`} />

          <div className="p-5 space-y-4">
            {/* Status & Divisi row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-semibold bg-[#fafbfc] focus:outline-none focus:border-[#1a3a5c] transition-all cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Divisi</label>
                <div className={`px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm font-semibold bg-gray-50 text-gray-500 cursor-not-allowed`}>
                  <span className="mr-1.5">{selectedDivisi?.icon}</span>
                  {selectedDivisi?.label}
                </div>
              </div>
            </div>

            {/* Barcode Input */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Barcode <span className="text-red-400">*</span>
              </label>
              <BarcodeInput
                value={barcode}
                onChange={setBarcode}
                disabled={loading}
                inputRef={barcodeRef}
              />
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Catatan <span className="font-normal text-gray-300 normal-case">(opsional)</span>
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Warna sesuai standar, ada defect minor..."
                disabled={loading}
                rows={2}
                className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm bg-[#fafbfc] focus:outline-none focus:border-[#1a3a5c] transition-all resize-none disabled:bg-gray-50 placeholder:text-gray-300"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !barcode.trim()}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                loading || !barcode.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : `${selectedDivisi?.color ?? "bg-[#1a3a5c]"} text-white hover:opacity-90 active:scale-[0.98]`
              }`}
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 0h12a8 8 0 010 16H4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  SIMPAN — {selectedStatus?.label?.toUpperCase()}
                </>
              )}
            </button>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="mx-5 mb-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center gap-4 animate-fade-in-up">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200 animate-bounce-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-7 h-7">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-emerald-800 text-lg leading-none">Berhasil!</p>
                <p className="text-emerald-700 text-sm font-semibold mt-0.5 truncate">
                  {success.nama_material}
                </p>
                <p className="text-emerald-600 text-xs mt-0.5">
                  <span className="font-mono font-bold">{success.barcode}</span>
                  {" · "}{selectedDivisi?.label} / {selectedStatus?.label}
                </p>
              </div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mx-5 mb-5 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-4 animate-fade-in">
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-7 h-7">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-black text-red-800 text-lg leading-none">Scan Gagal</p>
                <p className="text-red-700 text-sm font-medium mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </form>

        {/* ── Recent Scans ── */}
        <div className="bg-white rounded-2xl shadow-lg shadow-[#1a3a5c]/5 overflow-hidden">
          <div className={`h-1 ${selectedDivisi?.color ?? "bg-[#1a3a5c]"} transition-colors duration-300`} />

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a3a5c]/10 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a3a5c" strokeWidth="2" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Scan Terakhir</p>
                <p className="text-gray-400 text-xs">{selectedDivisi?.label}</p>
              </div>
            </div>
            <button
              onClick={() => fetchRecent(divisi)}
              className="text-[#1a3a5c]/60 hover:text-[#1a3a5c] text-xs font-semibold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1a3a5c]/5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {recent.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="w-16 h-16 bg-[#f4f5f7] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="w-8 h-8">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-400 text-sm">Belum ada scan</p>
                <p className="text-gray-300 text-xs mt-1">Scan barcode untuk memulai</p>
              </div>
            ) : (
              recent.map((scan, index) => {
                const statusOpt = STATUS_OPTIONS.find((s) => s.value === scan.status);
                const divOpt = DIVISI_OPTIONS.find((d) => d.value === scan.divisi);
                return (
                  <div
                    key={scan.id}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#f4f5f7]/50 transition-colors animate-slide-in-right"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Status indicator */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${divOpt?.color ?? "bg-gray-300"}`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-[#1a3a5c]">
                          {scan.material.barcode}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusOpt?.color ?? "bg-gray-100"}`}>
                          {statusOpt?.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {scan.material.nama_material}
                        {scan.catatan && (
                          <span className="text-gray-300 italic ml-1">— {scan.catatan}</span>
                        )}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-600">{formatJam(scan.timestamp)}</p>
                      <p className="text-[10px] text-gray-300">{formatTanggal(scan.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-300 pb-2">
          Scan barcode lalu tekan ENTER — beep akan berbunyi sebagai konfirmasi
        </p>
      </div>
    </div>
  );
}
