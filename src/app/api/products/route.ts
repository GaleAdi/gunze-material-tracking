import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama_produk, deskripsi, kategori, gambar_url } = body;

    if (!nama_produk || typeof nama_produk !== "string" || !nama_produk.trim()) {
      return NextResponse.json(
        { error: "Nama produk wajib diisi." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        nama_produk: nama_produk.trim(),
        deskripsi: deskripsi?.trim() || null,
        kategori: kategori?.trim() || null,
        gambar_url: gambar_url?.trim() || null,
      },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
