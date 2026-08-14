# Database Design & Entity Relationship — NEXORA

## Database Name: `nexora_db`

### Core Schema & Tables

1. **`users`**: User credentials, role assignment, active state.
2. **`roles` & `permissions`**: RBAC matrix (`admin`, `warehouse_manager`, `procurement_officer`, `staff`).
3. **`categories`**: Product categories (e.g., Electronics, Raw Materials, Finished Goods).
4. **`units`**: Units of Measurement (Pcs, Box, Kg, Liter, Meter).
5. **`suppliers`**: Supplier profiles, contacts, performance rating.
6. **`customers`**: Customer profiles, delivery addresses.
7. **`warehouses`**: Physical & virtual warehouse facilities.
8. **`locations`**: Storage bins, racks, and aisles within warehouses.
9. **`products`**: Item master (SKU, barcode, name, min_stock, max_stock, unit_cost, sell_price).
10. **`stocks`**: Product stock levels linked to specific warehouses and bin locations.
11. **`stock_movements`**: Immutable log of all inbound, outbound, transfer, and adjustment transactions.
12. **`purchase_requests` & `purchase_orders`**: Procurement workflow documents.
13. **`goods_receipts`**: Inbound receiving records from suppliers.
14. **`material_requests` & `delivery_orders`**: Outbound picking/packing and shipment records.
15. **`stock_opnames`**: Physical inventory audit counts & variance discrepancies.
16. **`audit_logs`**: System audit log recording user actions, IP addresses, and payload diffs.
17. **`notifications`**: User alert notifications (low stock, pending approvals).
