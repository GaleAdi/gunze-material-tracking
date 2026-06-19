-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "nama_material" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "tanggal_masuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_terakhir" TEXT,
    "divisi_terakhir" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingHistory" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "divisi" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "catatan" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" TEXT,
    "gambar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_barcode_key" ON "Material"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- AddForeignKey
ALTER TABLE "TrackingHistory" ADD CONSTRAINT "TrackingHistory_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
