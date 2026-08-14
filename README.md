# NEXORA — Enterprise WMS & Inventory ERP System

NEXORA is a high-performance, full-stack enterprise Warehouse Management System (WMS) and Inventory Enterprise Resource Planning (ERP) platform built with a decoupled monorepo architecture.

## 🏗️ Monorepo Architecture

```
NEXORA/
├── frontend/             # React + Vite + Tailwind CSS Client App
├── backend/              # Laravel REST API + MySQL Engine
├── analytics/            # Python AI / Machine Learning Data Analytics Engine
├── database/             # Initial Database SQL dumps & Schemas
├── docs/                 # Enterprise System Architecture & API Documentation
├── docker-compose.yml    # Monorepo container orchestration
└── README.md             # Core Documentation
```

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6, Recharts
- **Backend**: Laravel 10/11 (PHP 8.2+), REST API, MySQL 8 / MariaDB, Sanctum Auth
- **AI & Analytics**: Python 3.12 (FastAPI / Pandas / Scikit-Learn / Statsmodels)
- **Database**: MySQL (`nexora_db`)

## 📌 Module Navigation Hierarchy

- **Dashboard**: Executive KPI Stat Cards, Stock Flow Charts, Recent Activity, Low Stock Alerts
- **Master Data**: Products, Categories, Units, Suppliers, Customers, Warehouses, Locations
- **Inventory**: Stock Level, Stock Movement (Log), Stock Opname, Stock Adjustment, Slow Moving Detection
- **Procurement**: Purchase Requests (PR), Purchase Orders (PO), Goods Receipts (GR), Supplier Performance
- **Outbound**: Material Requests (MR), Picking, Packing, Delivery Orders (DO), Shipments
- **Analytics**: Demand Forecasting, Reorder Point Recommendations, Inventory Health Score, Slow Moving Analysis
- **Reports**: Stock, Inbound, Outbound, Purchase, and Comprehensive Inventory Reports
- **Import / Export**: Excel Data Ingestion & Data Export (CSV / Excel / PDF)
- **Administration**: User Management, Roles & Permissions (RBAC), System Audit Logs

---

## 🛠️ Quick Start Setup Guide

### 1. Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

### 3. Analytics Service (Python)
```bash
cd analytics
pip install -r requirements.txt
python main.py
```

---

Developed for Enterprise Supply Chain & Warehouse Excellence.
