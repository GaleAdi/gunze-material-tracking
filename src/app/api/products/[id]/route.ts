import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nama_produk, deskripsi, kategori, gambar_url } = body;

    if (!nama_produk || typeof nama_produk !== "string" || !nama_produk.trim()) {
      return NextResponse.json(
        { error: "Nama produk wajib diisi." },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        nama_produk: nama_produk.trim(),
        deskripsi: deskripsi?.trim() || null,
        kategori: kategori?.trim() || null,
        gambar_url: gambar_url?.trim() || null,
      },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("[PUT /api/products/[id]]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id } });

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Delete image file if exists
    if (product.gambar_url) {
      const relativePath = product.gambar_url.replace("/uploads/", "");
      const filePath = path.join(process.cwd(), "public", "uploads", relativePath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // ignore file deletion errors
      }
    }

    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
