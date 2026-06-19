import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_DIVISI = ["TWISTING", "DYEING", "WINDING", "INSPEKSI", "GUDANG"] as const;
const VALID_STATUS = ["MASUK", "KELUAR", "SELESAI"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barcode, divisi, status, catatan } = body;

    // Validation
    if (!barcode || typeof barcode !== "string") {
      return NextResponse.json(
        { error: "Barcode wajib diisi." },
        { status: 400 }
      );
    }
    if (!divisi || !VALID_DIVISI.includes(divisi)) {
      return NextResponse.json(
        { error: `Divisi wajib dipilih. Pilihan valid: ${VALID_DIVISI.join(", ")}` },
        { status: 400 }
      );
    }
    if (!status || !VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: `Status wajib dipilih. Pilihan valid: ${VALID_STATUS.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if material exists
    const material = await prisma.material.findUnique({
      where: { barcode: barcode.trim() },
    });

    if (!material) {
      return NextResponse.json(
        {
          error:
            "Material tidak ditemukan. Daftarkan material terlebih dahulu melalui halaman admin sebelum melakukan scan.",
        },
        { status: 404 }
      );
    }

    // Create tracking entry + update material in transaction
    const [trackingEntry] = await prisma.$transaction([
      prisma.trackingHistory.create({
        data: {
          material_id: material.id,
          divisi,
          status,
          catatan: catatan?.trim() || null,
          timestamp: new Date(),
        },
      }),
      prisma.material.update({
        where: { id: material.id },
        data: {
          status_terakhir: status,
          divisi_terakhir: divisi,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: trackingEntry,
        material: {
          barcode: material.barcode,
          nama_material: material.nama_material,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/tracking]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." },
      { status: 500 }
    );
  }
}
