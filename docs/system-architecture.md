# System Architecture — NEXORA Enterprise WMS / ERP

## Overview

NEXORA utilizes a multi-tier, microservices-inspired monorepo architecture engineered for high concurrency, real-time warehouse data processing, and predictive analytics.

```
                   +--------------------------+
                   |   React 18 + Vite UI     |
                   |   (Port 3000 / SPA)      |
                   +------------+-------------+
                                |
                                | HTTP REST / JSON
                                v
                   +--------------------------+
                   |  Laravel 10/11 Backend   |
                   |  (Port 8000 / REST API)  |
                   +-----+--------------+-----+
                         |              |
        SQL Queries &    |              | HTTP REST API
        Transactions     v              v
         +-----------------+          +---------------------+
         |  MySQL Database |          | Python AI Analytics |
         |   (nexora_db)   |          |    (Port 5000)      |
         +-----------------+          +---------------------+
```

## Key Components

1. **Frontend Tier (React + Vite + Tailwind CSS)**:
   - Client-side routing with `react-router-dom`.
   - Dynamic dark/light enterprise layout with sidebar navigation.
   - Axios service wrappers connecting to backend API endpoints.

2. **Backend Engine (Laravel 10/11 REST API)**:
   - Full domain model coverage (Products, Stock, Inbound, Outbound, Procurement, Users, Roles).
   - Sanctum Token-Based Authentication & RBAC Middleware.
   - Transactional integrity for Stock Movements & Stock Opname updates.

3. **Analytics Engine (Python FastAPI/Flask)**:
   - Predictive demand forecasting using historical movement time-series.
   - Intelligent Safety Stock & Reorder Point recommendations ($ROP = (d \times L) + SS$).
   - Inventory Health Score calculation and Slow-moving stock classification.

4. **Database Tier (MySQL / MariaDB)**:
   - Relational database schema (`nexora_db`) with indexed foreign keys.
   - Audit trail capturing user mutations.
