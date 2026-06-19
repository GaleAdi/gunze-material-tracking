import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const divisi = searchParams.get("divisi");

  const VALID_DIVISI = ["TWISTING", "DYEING", "WINDING", "INSPEKSI", "GUDANG"];

  if (!divisi || !VALID_DIVISI.includes(divisi)) {
    return NextResponse.json(
      { error: "Parameter divisi wajib diisi dengan nilai valid." },
      { status: 400 }
    );
  }

  try {
    const recent = await prisma.trackingHistory.findMany({
      where: { divisi },
      orderBy: { timestamp: "desc" },
      take: 10,
      include: {
        material: {
          select: {
            barcode: true,
            nama_material: true,
            jenis: true,
          },
        },
      },
    });

    return NextResponse.json({ data: recent });
  } catch (error) {
    console.error("[GET /api/scan/recent]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
