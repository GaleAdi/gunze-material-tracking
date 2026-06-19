import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Seed AdminUser
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password_hash: hashedPassword,
    },
  });
  console.log("✅ Admin user created (username: admin, password: admin123)");

  // Seed Material 1: baru sampai Twisting (progress awal)
  const material1 = await prisma.material.create({
    data: {
      barcode: "GUNZE-2026-00001",
      nama_material: "Benang Polyester 150D",
      jenis: "Polyester",
      status_terakhir: "MASUK",
      divisi_terakhir: "TWISTING",
      tanggal_masuk: new Date("2026-06-15T08:00:00Z"),
      trackingHistory: {
        create: [
          {
            divisi: "TWISTING",
            status: "MASUK",
            catatan: "Material masuk lini produksi Twisting",
            timestamp: new Date("2026-06-15T08:30:00Z"),
          },
          {
            divisi: "TWISTING",
            status: "KELUAR",
            catatan: "Proses twisting selesai, lanjut ke dyeing",
            timestamp: new Date("2026-06-15T12:00:00Z"),
          },
          {
            divisi: "DYEING",
            status: "MASUK",
            catatan: "Material diterima di divisi Dyeing",
            timestamp: new Date("2026-06-15T13:00:00Z"),
          },
        ],
      },
    },
  });
  console.log(`✅ Material 1 created: ${material1.barcode} (progress: Dyeing)`);

  // Seed Material 2: sudah sampai Inspeksi (hampir selesai)
  const material2 = await prisma.material.create({
    data: {
      barcode: "GUNZE-2026-00002",
      nama_material: "Benang Nylon 70D",
      jenis: "Nylon",
      status_terakhir: "MASUK",
      divisi_terakhir: "INSPEKSI",
      tanggal_masuk: new Date("2026-06-10T07:00:00Z"),
      trackingHistory: {
        create: [
          {
            divisi: "TWISTING",
            status: "MASUK",
            catatan: "Material masuk lini produksi Twisting",
            timestamp: new Date("2026-06-10T07:30:00Z"),
          },
          {
            divisi: "TWISTING",
            status: "KELUAR",
            catatan: "Twisting selesai",
            timestamp: new Date("2026-06-10T11:00:00Z"),
          },
          {
            divisi: "DYEING",
            status: "MASUK",
            catatan: "Masuk proses pewarnaan",
            timestamp: new Date("2026-06-10T11:30:00Z"),
          },
          {
            divisi: "DYEING",
            status: "KELUAR",
            catatan: "Pewarnaan selesai, warna sesuai standar",
            timestamp: new Date("2026-06-10T16:00:00Z"),
          },
          {
            divisi: "WINDING",
            status: "MASUK",
            catatan: "Masuk proses penggulungan",
            timestamp: new Date("2026-06-11T08:00:00Z"),
          },
          {
            divisi: "WINDING",
            status: "KELUAR",
            catatan: "Penggulungan selesai",
            timestamp: new Date("2026-06-11T14:00:00Z"),
          },
          {
            divisi: "INSPEKSI",
            status: "MASUK",
            catatan: "Masuk proses inspeksi kualitas",
            timestamp: new Date("2026-06-11T14:30:00Z"),
          },
        ],
      },
    },
  });
  console.log(`✅ Material 2 created: ${material2.barcode} (progress: Inspeksi)`);

  // Seed Material 3: sudah selesai sampai Gudang
  const material3 = await prisma.material.create({
    data: {
      barcode: "GUNZE-2026-00003",
      nama_material: "Benang Cotton 60S",
      jenis: "Cotton",
      status_terakhir: "SELESAI",
      divisi_terakhir: "GUDANG",
      tanggal_masuk: new Date("2026-06-05T06:00:00Z"),
      trackingHistory: {
        create: [
          {
            divisi: "TWISTING",
            status: "MASUK",
            catatan: "Material masuk lini produksi Twisting",
            timestamp: new Date("2026-06-05T06:30:00Z"),
          },
          {
            divisi: "TWISTING",
            status: "KELUAR",
            catatan: "Twisting selesai",
            timestamp: new Date("2026-06-05T10:00:00Z"),
          },
          {
            divisi: "DYEING",
            status: "MASUK",
            catatan: "Masuk proses pewarnaan",
            timestamp: new Date("2026-06-05T10:30:00Z"),
          },
          {
            divisi: "DYEING",
            status: "KELUAR",
            catatan: "Pewarnaan selesai",
            timestamp: new Date("2026-06-05T15:00:00Z"),
          },
          {
            divisi: "WINDING",
            status: "MASUK",
            catatan: "Masuk proses penggulungan",
            timestamp: new Date("2026-06-06T07:00:00Z"),
          },
          {
            divisi: "WINDING",
            status: "KELUAR",
            catatan: "Penggulungan selesai",
            timestamp: new Date("2026-06-06T13:00:00Z"),
          },
          {
            divisi: "INSPEKSI",
            status: "MASUK",
            catatan: "Masuk proses inspeksi kualitas",
            timestamp: new Date("2026-06-06T13:30:00Z"),
          },
          {
            divisi: "INSPEKSI",
            status: "SELESAI",
            catatan: "Semua standar kualitas terpenuhi",
            timestamp: new Date("2026-06-06T16:00:00Z"),
          },
          {
            divisi: "GUDANG",
            status: "MASUK",
            catatan: "Material siap kirim, masuk gudang",
            timestamp: new Date("2026-06-07T08:00:00Z"),
          },
        ],
      },
    },
  });
  console.log(`✅ Material 3 created: ${material3.barcode} (progress: Gudang - SELESAI)`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("  - Admin: admin / admin123");
  console.log("  - Material 1: GUNZE-2026-00001 (progress: Dyeing)");
  console.log("  - Material 2: GUNZE-2026-00002 (progress: Inspeksi)");
  console.log("  - Material 3: GUNZE-2026-00003 (progress: Gudang - SELESAI)");
  console.log("  - Products: (empty)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
