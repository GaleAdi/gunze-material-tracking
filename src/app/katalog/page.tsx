import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/Animations";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  nama_produk: string;
  deskripsi: string | null;
  kategori: string | null;
  gambar_url: string | null;
  created_at: Date;
};

async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function KatalogPage() {
  const products = await getProducts();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-[#1a3a5c] py-12">
        <div className="section-container">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-[#e8a020] rounded-full" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Produk
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Katalog Produk
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Jelajahi berbagai jenis benang jahit berkualitas dari PT Gunze
            Indonesia
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-container py-12">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, idx) => (
              <ScrollReveal key={product.id} animation="fade-up" delay={idx * 0.06}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1a3a5c]/10 transition-all duration-300">
      {/* Image Area */}
      <div className="relative h-48 bg-[#f4f5f7] overflow-hidden flex items-center justify-center">
        {/* Animated gradient shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer group-hover:bg-[length:200%_100%] transition-opacity duration-500 pointer-events-none" />

        {product.gambar_url ? (
          <Image
            src={product.gambar_url}
            alt={product.nama_produk}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs">Tanpa Gambar</span>
          </div>
        )}

        {/* Category Badge */}
        {product.kategori && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[#1a3a5c] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {product.kategori}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 group-hover:text-[#1a3a5c] transition-colors">
          {product.nama_produk}
        </h3>
        {product.deskripsi && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {product.deskripsi}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">
            Benang Jahit
          </span>
          <button className="text-xs font-semibold text-[#1a3a5c] hover:text-[#e8a020] transition-colors flex items-center gap-1">
            Detail
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3 h-3"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {/* Icon */}
      <div className="w-24 h-24 bg-[#1a3a5c]/5 rounded-2xl flex items-center justify-center mb-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a3a5c"
          strokeWidth="1.2"
          className="w-12 h-12 opacity-40"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-[#1a3a5c] mb-2">
        Katalog Produk
      </h3>
      <p className="text-gray-500 text-sm text-center max-w-sm leading-relaxed mb-8">
        Katalog produk akan segera tersedia. Tim kami sedang menyiapkan
        informasi lengkap mengenai berbagai jenis benang jahit berkualitas dari
        PT Gunze Indonesia.
      </p>

      {/* Decorative */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px w-12 bg-gray-200" />
        <span className="uppercase tracking-widest font-semibold">
          Segera Hadir
        </span>
        <span className="h-px w-12 bg-gray-200" />
      </div>

      {/* Placeholder cards preview */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl opacity-30">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="h-32 bg-gray-100 animate-pulse" />
            <div className="p-4">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
