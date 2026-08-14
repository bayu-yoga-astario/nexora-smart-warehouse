# NEXORA — Enterprise WMS & Inventory ERP System

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel_10-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Python](https://img.shields.io/badge/AI_Engine-Python_3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)

**NEXORA** adalah sistem enterprise *Warehouse Management System* (WMS) dan *Inventory Enterprise Resource Planning* (ERP) berskala penuh yang dirancang untuk mengelola seluruh rantai pasok (*supply chain*), pergudangan multi-cabang (Multi-DC), dan inventaris perusahaan manufaktur/distribusi secara terintegrasi, cepat, dan presisi.

---

## 🎯 Tujuan & Manfaat Website Ini Dibuat

Website / Aplikasi **NEXORA** dibuat untuk mengatasi tantangan operasional logistik dan pergudangan modern:

1. **Visibilitas Stok Real-Time (End-to-End Tracking)**:
   - Memantau ketersediaan barang secara akurat di seluruh gudang (Distribution Center, Gudang Transit, dan Hub Regional).
   - Mengetahui lokasi rak, lorong (*aisle*), tingkat (*shelf*), hingga kotak penyimpanan (*bin*).

2. **Otomasi Alur Pengadaan (Inbound / Procurement)**:
   - Pengajuan Permintaan Pembelian (*Purchase Request* / PR) dari tiap departemen.
   - Penerbitan *Purchase Order* (PO) resmi ke vendor/supplier.
   - Pemeriksaan fisik & kontrol kualitas (*Quality Control*) saat Penerimaan Barang (*Goods Receipt* / GR).

3. **Efisiensi Pengeluaran Barang (Outbound / Fulfillment)**:
   - Permintaan Material (*Material Request* / MR) untuk produksi atau proyek.
   - Panduan *Picking* (pengambilan barang di rak) dan *Packing* (pengepakan dan pelabelan).
   - Penerbitan Dokumen Surat Jalan (*Delivery Order* / DO) dan pelacakan armada pengiriman (*Shipment*).

4. **Kecerdasan Buatan & Analitik Prediktif (AI Analytics)**:
   - **Demand Forecasting**: Memprediksi kebutuhan stok 30–90 hari ke depan dengan model statistik & Machine Learning.
   - **Reorder Point (ROP) & Safety Stock**: Rekomendasi otomatis kapan dan berapa banyak barang yang harus dipesan kembali untuk mencegah *stockout* (kehabisan barang).
   - **Deteksi Slow-Moving & Dead Stock**: Mencegah kerugian modal tertahan pada barang yang lambat terjual.
   - **Inventory Health Score**: Mengukur efisiensi pergudangan secara menyeluruh (*turnover rate*, risiko *overstock*, dan akurasi opname).

5. **Akuntabilitas & Keamanan (Governance & RBAC)**:
   - Manajemen pengguna berbasis peran (*Role-Based Access Control* / RBAC).
   - *Audit Trail / Logs* untuk merekam setiap penambahan, pengeditan, atau penghapusan data secara transparan.

---

## 🏗️ Struktur Arsitektur Monorepo

```
NEXORA/
├── frontend/             # React 18 + Vite + Tailwind CSS + Lucide Icons
├── backend/              # Laravel 10 REST API Engine + Sanctum Auth
├── analytics/            # Python AI / ML Analytics Engine (FastAPI/Flask)
├── database/             # Skema SQL & Data Inisialisasi (nexora_database.sql)
├── docs/                 # Dokumentasi Lengkap Sistem, DB & API
├── docker-compose.yml    # Konfigurasi Container Orchestration
└── README.md             # Dokumentasi Panduan Project
```

---

## 💻 Prasyarat Sistem (Prerequisites)

Sebelum menginstal, pastikan komputer Anda telah terpasang:
- **Node.js** (v18.x atau lebih baru) & **NPM**: [Download Node.js](https://nodejs.org/)
- **PHP** (v8.1 atau v8.2+) & **Composer**: [Download Composer](https://getcomposer.org/)
- **MySQL / MariaDB** (Disarankan menggunakan **XAMPP**): [Download XAMPP](https://www.apachefriends.org/)
- **Git**: [Download Git](https://git-scm.com/)
- **Python** (v3.10+): *(Opsional untuk menjalankan AI Analytics engine)*

---

## 🛠️ Panduan Instalasi & Menjalankan Project

### Langkah 1: Clone atau Download Repository
```bash
git clone https://github.com/bayu-yoga-astario/nexora-smart-warehouse.git
cd nexora-smart-warehouse
```
*(Atau download file `.ZIP` dari GitHub dan ekstrak ke folder komputer Anda, misalnya di `C:\xampp\htdocs\NEXORA`)*.

---

### Langkah 2: Setup Database (MySQL / XAMPP)
1. Buka **XAMPP Control Panel** dan nyalakan modul **Apache** dan **MySQL**.
2. Buka browser dan akses **phpMyAdmin** di [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Buat database baru bernama: `nexora_db`.
4. Klik tab **Import** pada database `nexora_db`, lalu pilih file:
   `database/nexora_database.sql`
5. Klik **Go / Kirim** untuk mengimpor tabel dan data demo awal.

---

### Langkah 3: Setup Frontend (React + Vite)
Buka Terminal / PowerShell di folder project:
```bash
cd frontend
npm install
npm run dev
```
Setelah berjalan, frontend akan aktif di: **[http://localhost:5173/](http://localhost:5173/)**

---

### Langkah 4: Setup Backend (Laravel API)
Buka tab Terminal / PowerShell baru:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --port=8000
```
Setelah berjalan, Backend API aktif di: **[http://localhost:8000/](http://localhost:8000/)**

---

### Langkah 5: Setup Analytics Engine (Python AI) — *Opsional*
Buka tab Terminal / PowerShell baru:
```bash
cd analytics
pip install -r requirements.txt
python main.py
```
Analytics engine akan aktif pada port: **`http://localhost:5000/`**

---

## 🔑 Akun & Kredensial Demo Login

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Super Administrator** | `admin@nexora.com` | `password` | Akses Penuh ke Semua Modul & Pengaturan Admin |
| **Warehouse Manager** | `ahmad.s@nexora.com` | `password` | Manajemen Stok, Mutasi, Inbound & Outbound |

*(Catatan: Anda juga dapat menggunakan tombol **Akses Demo Cepat** di halaman login untuk masuk secara instan)*.

---

## 🧭 Daftar Modul & Fitur Utama

- 📊 **Executive Dashboard**: KPI Stat Cards, Stock Flow Charts, Low Stock Alerts, Aktivitas Terkini.
- 📦 **Master Data**: Produk (SKU & Barcode), Kategori, Satuan (UOM), Supplier, Pelanggan, Gudang Multi-DC, Rak & Bin.
- 🔄 **Inventory Management**: Level Stok Real-Time, Mutasi Stok, Stock Opname, Penyesuaian (*Adjustment*), Deteksi *Slow-Moving*.
- 🛒 **Procurement**: Purchase Request (PR), Purchase Order (PO), Goods Receipt (GR), Evaluasi Kinerja Supplier.
- 🚚 **Outbound / Fulfillment**: Permintaan Material (MR), Picking List, Packing Slip, Surat Jalan (DO), Pelacakan Pengiriman.
- 🧠 **AI & Analytics**: Demand Forecasting, Rekomendasi Reorder Point, Skor Kesehatan Inventory (*Health Score*).
- 📑 **Laporan & Cetak**: Laporan Stok, Inbound, Outbound, Pembelian, Cetak PDF & Export Excel/CSV.
- ⚙️ **Administrasi**: Manajemen User, Role & Permissions (RBAC), Audit Log Trails.

---

## 📄 Lisensi & Kontributor

Dikembangkan oleh **Bayu Yoga Astario** untuk keunggulan manajemen rantai pasok dan pergudangan modern skala enterprise.
