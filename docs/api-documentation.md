# API Documentation — NEXORA REST API

Base URL: `http://localhost:8000/api`

## Authentication Endpoints
- `POST /auth/login`: User authentication, returns Bearer token.
- `POST /auth/logout`: Revoke token.
- `GET /auth/me`: Retrieve current user profile & permissions.

## Master Data Endpoints
- `GET /products`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}`
- `GET /categories`, `POST /categories`, `PUT /categories/{id}`
- `GET /suppliers`, `POST /suppliers`, `PUT /suppliers/{id}`
- `GET /customers`, `POST /customers`, `PUT /customers/{id}`
- `GET /warehouses`, `POST /warehouses`
- `GET /locations`, `POST /locations`

## Inventory Endpoints
- `GET /inventory/stock`: Get aggregated stock levels across warehouses.
- `GET /inventory/movements`: Retrieve stock movement logs.
- `POST /inventory/opname`: Submit physical stock count / opname variance.
- `POST /inventory/adjustments`: Submit manual stock level adjustment.

## Analytics Endpoints (Backend Proxy to Python Service)
- `GET /analytics/demand-forecast`: Returns time-series predictions per product.
- `GET /analytics/reorder-recommendations`: Returns items below calculated reorder point.
- `GET /analytics/inventory-health`: Returns warehouse health score (0-100%).
- `GET /analytics/slow-moving`: Identifies slow-moving / dead stock items.
