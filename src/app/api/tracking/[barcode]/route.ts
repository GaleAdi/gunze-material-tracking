import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const barcode = params.barcode?.trim();

  if (!barcode) {
    return NextResponse.json(
      { error: "Barcode tidak boleh kosong." },
      { status: 400 }
    );
  }

  try {
    const material = await prisma.material.findUnique({
      where: { barcode },
      include: {
        trackingHistory: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        {
          error: `Material dengan barcode "${barcode}" tidak ditemukan. Pastikan barcode yang dimasukkan benar dan coba lagi.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: material });
  } catch (error) {
    console.error("[GET /api/tracking]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
