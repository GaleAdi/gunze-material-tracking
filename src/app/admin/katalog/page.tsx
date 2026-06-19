"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────── */
interface Product {
  id: string;
  nama_produk: string;
  deskripsi: string | null;
  kategori: string | null;
  gambar_url: string | null;
  created_at: string;
}

/* ─── Helpers ───────────────────────────────────────────── */
function formatTanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Component ──────────────────────────────────────────── */
export default function AdminKatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setGambarUrl(json.url);
    } catch (err) {
      setFormError((err as Error).message ?? "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  function openAdd() {
    setShowForm(true);
    setEditingId(null);
    setNama("");
    setDeskripsi("");
    setKategori("");
    setGambarUrl("");
    setFormError(null);
    setFormSuccess(null);
  }

  function openEdit(product: Product) {
    setShowForm(true);
    setEditingId(product.id);
    setNama(product.nama_produk);
    setDeskripsi(product.deskripsi ?? "");
    setKategori(product.kategori ?? "");
    setGambarUrl(product.gambar_url ?? "");
    setFormError(null);
    setFormSuccess(null);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
    setFormSuccess(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nama.trim()) {
      setFormError("Nama produk wajib diisi.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const payload = {
        nama_produk: nama.trim(),
        deskripsi: deskripsi.trim() || null,
        kategori: kategori.trim() || null,
        gambar_url: gambarUrl.trim() || null,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");

      setFormSuccess(editingId ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
      await fetchProducts();
      setTimeout(() => {
        closeForm();
        router.push("/katalog");
      }, 1200);
    } catch (err) {
      setFormError((err as Error).message ?? "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
      await fetchProducts();
      setDeleteTarget(null);
    } catch (err) {
      alert((err as Error).message ?? "Gagal menghapus produk.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Top bar */}
      <div className="bg-[#1a3a5c] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-white/50 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div className="w-px h-5 bg-white/20" />
            <div>
              <p className="text-white font-bold text-sm">Kelola Katalog Produk</p>
              <p className="text-white/50 text-xs">Admin — PT Gunze Indonesia</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/katalog"
              target="_blank"
              className="text-white/60 hover:text-white text-xs transition-colors flex items-center gap-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Lihat Katalog
            </Link>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1a3a5c]">Katalog Produk</h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {products.length} produk dalam katalog
            </p>
          </div>
          <button
            onClick={openAdd}
            className="btn-primary"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk
          </button>
        </div>

        {/* Product Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f4f5f7] border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-16">Gambar</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Nama Produk</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-32">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Deskripsi</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-28">Tanggal</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                      Memuat data...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="w-10 h-10">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        <p className="text-gray-400 text-sm font-medium">Belum ada produk</p>
                        <p className="text-gray-300 text-xs">Klik {`"Tambah Produk"`} untuk menambahkan data pertama</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                          {product.gambar_url ? (
                            <Image
                              src={product.gambar_url}
                              alt={product.nama_produk}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="w-6 h-6">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-sm">{product.nama_produk}</p>
                      </td>
                      <td className="px-4 py-3">
                        {product.kategori ? (
                          <span className="navy-badge">{product.kategori}</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-gray-500 text-xs line-clamp-2">
                          {product.deskripsi ?? <span className="text-gray-300 italic">Tanpa deskripsi</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-400 text-xs">{formatTanggal(product.created_at)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1a3a5c] hover:bg-[#1a3a5c]/8 transition-all"
                            title="Edit"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Hapus"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add/Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-[#1a3a5c] px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-white font-bold text-base">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nama produk */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Benang Polyester 150D"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Kategori
                </label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  placeholder="Contoh: Polyester, Nylon, Cotton"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi singkat produk..."
                  rows={3}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/10 transition-all resize-none"
                />
              </div>

              {/* Gambar */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Gambar Produk
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#1a3a5c]/40 transition-colors">
                  {gambarUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={gambarUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="cursor-pointer text-xs font-semibold text-[#1a3a5c] bg-[#1a3a5c]/8 hover:bg-[#1a3a5c]/15 px-3 py-1.5 rounded-lg transition-colors">
                          Ganti Gambar
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUpload(file);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setGambarUrl("")}
                          className="text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="w-10 h-10">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG, WEBP — maks 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Error / Success */}
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-4 h-4 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-red-700 text-xs">{formError}</p>
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-4 h-4 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="text-emerald-700 text-xs">{formSuccess}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !nama.trim()}
                  className="flex-1 bg-[#1a3a5c] hover:bg-[#234e7a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 animate-spin">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : editingId ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Produk"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-7 h-7">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </div>
            <h3 className="text-center font-bold text-gray-800 text-base mb-2">
              Hapus Produk?
            </h3>
            <p className="text-center text-gray-500 text-sm mb-1">
              Anda akan menghapus:
            </p>
            <p className="text-center font-semibold text-gray-800 text-sm mb-6">
              {deleteTarget.nama_produk}
            </p>
            <p className="text-center text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-6">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
