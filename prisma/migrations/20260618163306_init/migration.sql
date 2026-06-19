-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barcode" TEXT NOT NULL,
    "nama_material" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "tanggal_masuk" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_terakhir" TEXT,
    "divisi_terakhir" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TrackingHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "material_id" TEXT NOT NULL,
    "divisi" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "catatan" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrackingHistory_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" TEXT,
    "gambar_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_barcode_key" ON "Material"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
