# PT Gunze Indonesia — Material Tracking System

Sistem pelacakan material berbasis QR code dan barcode untuk PT Gunze Indonesia. Sistem ini mencatat pergerakan material melalui 5 divisi produksi menggunakan scanner barcode bertipe USB HID (keyboard emulation).

---

## Cara Menjalankan Secara Lokal

### 1. Install Dependency

```bash
npm install
```

### 2. Setup Environment Variable

Copy file `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dengan connection string PostgreSQL lokal atau Neon/Supabase.

```bash
cp .env.example .env
```

Edit file `.env`:

```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### 3. Generate Prisma Client & Migrasi Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Jalankan Seed Script (Opsional)

Seed script membuat 1 akun admin default dan sample data tracking untuk demo.

```bash
npm run db:seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser.

---

## Struktur 5 Divisi Tracking & Cara Kerja Halaman /scan

Material bergerak melalui 5 divisi produksi secara berurutan:

| Kode Divisi | Nama Divisi | Fungsi |
|---|---|---|
| `TWISTING` | Twisting | Proses twisting benang |
| `DYEING` | Dyeing | Proses pewarnaan benang |
| `WINDING` | Winding | Proses winding/penggulungan |
| `INSPEKSI` | Inspeksi | Pemeriksaan kualitas |
| `GUDANG` | Gudang | Penyimpanan & keluar masuk material |

### Cara Kerja Halaman `/scan`

1. Operator divisi membuka halaman `/scan` di browser
2. Pilih divisi mereka dari dropdown (secara default sudah terisi sesuai divisi PC tersebut)
3. Scanner barcode (USB HID) digunakan untuk scan barcode/QR code yang menempel di material fisik
4. Hasil scan otomatis masuk ke input field sebagai teks (keyboard emulation)
5. Klik tombol **Proses** untuk mencatat data tracking ke database
6. Sistem otomatis menentukan status:
   - Jika ini divisi pertama (`TWISTING`) untuk material ini → status `MASUK`
   - Jika material datang dari divisi lain → status `KELUAR` dari divisi sebelumnya, `MASUK` ke divisi ini
   - Jika ini divisi terakhir (`GUDANG`) → status `SELESAI`

Riwayat scan per divisi bisa dilihat di `/api/scan/recent?divisi=NAMA_DIVISI`.

---

## Menambahkan Material Baru

Untuk saat ini, penambahan material baru dilakukan melalui **Prisma Studio**:

```bash
npm run db:studio
```

1. Buka browser ke http://localhost:5555
2. Pilih model **Material**
3. Klik **Add record**
4. Isi kolom:
   - `barcode` — format: `GUNZE-TAHUN-NOMOR` (contoh: `GUNZE-2026-00003`)
   - `nama_material` — nama produk (contoh: `Benang Polyester 150D`)
   - `jenis` — jenis benang (contoh: `Benang Polyester`)
5. Klik **Save 1 record**

> Halaman registrasi material untuk admin (`/admin/material`) sudah tersedia di sisi development dan akan segera terintegrasi penuh ke sistem.

---

## Deploy ke Vercel

### 1. Hubungkan Repo GitHub ke Vercel

1. Buka https://vercel.com → klik **Add New Project**
2. Pilih repo GitHub yang berisi project ini
3. Vercel akan otomatis mendeteksi ini project Next.js
4. Klik **Deploy**

### 2. Isi Environment Variable di Vercel Dashboard

Sebelum deploy pertama selesai, sebelum atau sesudahnya:

1. Di halaman project Vercel → **Settings → Environment Variables**
2. Tambahkan:
   - **Name**: `DATABASE_URL`
   - **Value**: connection string PostgreSQL dari Neon/Supabase
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
3. Klik **Save**

### 3. Jalankan Migrasi & Seed ke Database Production

Setelah environment variable diset dan Vercel selesai deploy, buka terminal lalu jalankan:

```bash
# Pastikan .env.local atau .env sudah terisi dengan DATABASE_URL production
npx prisma migrate deploy
npm run db:seed
```

Atau, jika Vercel Build Command ingin automate migrasi otomatis, bisa ditambahkan di **Settings → General → Build Command**:

```bash
npx prisma migrate deploy && next build
```

> **Catatan:** Build Vercel tidak otomatis menjalankan seed — seed perlu dijalankan secara manual sekali ke database production, atau ditrigger via webhook/cronjob jika diperlukan.

---

## Catatan untuk Tim IT Lapangan

### Barcode Scanner

Gunakan scanner bertipe **USB HID (keyboard emulation)**. Scanner jenis ini akan mengirim hasil scan langsung sebagai teks ke field yang aktif — tidak perlu driver tambahan atau library khusus. Pastikan:

- Scanner diset ke mode **HID** (bukan COM/Serial)
- Field input di halaman `/scan` dalam keadaan aktif (klik/tap dulu sebelum scan)
- Koneksi internet/LAN tersedia di PC/tablet

### Perangkat per Divisi

Setiap divisi cukup menyediakan **1 PC atau tablet** yang:
- Terhubung ke internet atau LAN
- Browser diarahkan ke halaman `/scan` (bisa diset sebagai home page atau shortcut)
- Scanner barcode USB HID terhubung ke perangkat tersebut

### Keamanan — Akun Admin Default

Akun admin default yang dibuat oleh seed script:

```
Username: admin
Password: admin123
```

**WAJIB diganti passwordnya sebelum go-live ke production permanen.** Gunakan Prisma Studio atau query SQL langsung untuk update:

```sql
UPDATE "AdminUser"
SET password_hash = '<hash_baru>'
WHERE username = 'admin';
```

Hash baru bisa dibuat dengan bcrypt — contoh generate via Node.js:

```js
const bcrypt = require('bcryptjs');
bcrypt.hash('PasswordBaru2026!', 10).then(h => console.log(h));
```

---

## Daftar Environment Variable

| Variable | Wajib | Deskripsi |
|---|---|---|
| `DATABASE_URL` | ✅ Ya | Connection string PostgreSQL. Format: `postgresql://user:password@host:port/dbname?sslmode=require`. Untuk Neon/Supabase gunakan `?sslmode=require` di akhir. |
| `SESSION_SECRET` | ✅ Ya | Password untuk enkripsi session cookie (iron-session). Minimal 32 karakter. Generate dengan: `openssl rand -base64 32`. Jangan share atau commit ke repo. |
| `NEXT_PUBLIC_APP_URL` | Opsional | URL lengkap aplikasi (contoh: `https://gunze-tracking.vercel.app`). Diisi otomatis oleh Vercel untuk environment production. |

> Untuk development lokal, `SESSION_SECRET` juga perlu ditambahkan ke file `.env`. Contoh:
> ```
> SESSION_SECRET="ganti-dengan-random-string-minimal-32-karakter"
> ```

---

## Struktur Database

Model Prisma yang digunakan:

- **Material** — Data master material (barcode, nama, jenis, status terakhir)
- **TrackingHistory** — Riwayat pergerakan material per divisi (material_id, divisi, status, catatan, timestamp)
- **Product** — Katalog produk (untuk halaman `/katalog`)
- **AdminUser** — Akun administrator sistem