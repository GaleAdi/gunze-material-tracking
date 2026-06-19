import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama_material, jenis } = body;

    if (!nama_material?.trim() || !jenis?.trim()) {
      return NextResponse.json(
        { error: "Nama material dan jenis wajib diisi." },
        { status: 400 }
      );
    }

    // Generate barcode: GUNZE-YYYY-NNNNN
    const year = new Date().getFullYear();
    const count = await prisma.material.count();
    const sequence = String(count + 1).padStart(5, "0");
    const barcode = `GUNZE-${year}-${sequence}`;

    // Check if barcode already exists (race condition)
    const existing = await prisma.material.findUnique({ where: { barcode } });
    if (existing) {
      // Retry with incremented sequence
      const newSequence = String(count + 2).padStart(5, "0");
      const barcodeRetry = `GUNZE-${year}-${newSequence}`;
      const material = await prisma.material.create({
        data: {
          barcode: barcodeRetry,
          nama_material: nama_material.trim(),
          jenis: jenis.trim(),
        },
      });

      // Generate QR code as base64 PNG
      const qrDataUrl = await QRCode.toDataURL(barcodeRetry, {
        width: 280,
        margin: 2,
        color: { dark: "#1a3a5c", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });

      return NextResponse.json({ data: material, qrCode: qrDataUrl }, { status: 201 });
    }

    const material = await prisma.material.create({
      data: {
        barcode,
        nama_material: nama_material.trim(),
        jenis: jenis.trim(),
      },
    });

    // Generate QR code as base64 PNG
    const qrDataUrl = await QRCode.toDataURL(barcode, {
      width: 280,
      margin: 2,
      color: { dark: "#1a3a5c", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });

    return NextResponse.json({ data: material, qrCode: qrDataUrl }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/material]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { created_at: "desc" },
      include: { _count: { select: { trackingHistory: true } } },
    });
    return NextResponse.json({ data: materials });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}
