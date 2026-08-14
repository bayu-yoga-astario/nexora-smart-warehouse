// Central Local Storage Data Service with Auto-seed for NEXORA Enterprise ERP

const initialData = {
  // Master Data
  products: [
    { id: 1, sku: 'SKU-ELE-001', barcode: '8991001001', name: 'Smart Sensor Hub IoT Pro', category: 'Electronics', unit: 'PCS', stock: 12, min_stock: 15, max_stock: 100, unit_cost: 450000, sell_price: 650000, warehouse: 'Jakarta Central DC', status: 'Low Stock', description: 'Industrial grade multi-protocol IoT sensor hub' },
    { id: 2, sku: 'SKU-RAW-002', barcode: '8991001002', name: 'Aluminum Alloy Sheet 5mm', category: 'Raw Materials', unit: 'KG', stock: 145, min_stock: 50, max_stock: 500, unit_cost: 120000, sell_price: 180000, warehouse: 'Surabaya Distribution Hub', status: 'Normal', description: 'High tensile 6061-T6 aluminum sheet' },
    { id: 3, sku: 'SKU-FG-003', barcode: '8991001003', name: 'Industrial Terminal Junction Box', category: 'Finished Goods', unit: 'BOX', stock: 85, min_stock: 20, max_stock: 200, unit_cost: 850000, sell_price: 1250000, warehouse: 'Jakarta Central DC', status: 'Normal', description: 'IP67 rated waterproof junction terminal' },
    { id: 4, sku: 'SKU-ELE-004', barcode: '8991001004', name: 'PCB Microcontroller Board v4.2', category: 'Electronics', unit: 'PCS', stock: 240, min_stock: 30, max_stock: 400, unit_cost: 210000, sell_price: 320000, warehouse: 'Bandung Transit WH', status: 'Normal', description: 'ARM Cortex-M4 embedded logic controller' },
    { id: 5, sku: 'SKU-RAW-005', barcode: '8991001005', name: 'Industrial Copper Wire 2.5mm', category: 'Raw Materials', unit: 'Meter', stock: 48, min_stock: 100, max_stock: 1000, unit_cost: 28000, sell_price: 45000, warehouse: 'Jakarta Central DC', status: 'Low Stock', description: 'Pure annealed stranded copper electrical wire' },
    { id: 6, sku: 'SKU-PKG-006', barcode: '8991001006', name: 'Heavy Duty Corrugated Carton Box', category: 'Packaging', unit: 'BOX', stock: 520, min_stock: 100, max_stock: 1500, unit_cost: 12000, sell_price: 25000, warehouse: 'Surabaya Distribution Hub', status: 'Normal', description: 'Double-wall 5-ply shipping grade carton' }
  ],

  categories: [
    { id: 1, code: 'CAT-ELE', name: 'Electronics', description: 'Sensor, IC, controller, dan modul instrumentasi elektronik', product_count: 24 },
    { id: 2, code: 'CAT-RAW', name: 'Raw Materials', description: 'Bahan mentah logam, kabel tembaga, dan polimer industri', product_count: 52 },
    { id: 3, code: 'CAT-FG', name: 'Finished Goods', description: 'Produk jadi siap kemas dan kirim ke pelanggan', product_count: 38 },
    { id: 4, code: 'CAT-PKG', name: 'Packaging', description: 'Karton tebal, palet kayu, bubble wrap, dan strapping band', product_count: 16 },
    { id: 5, code: 'CAT-SPP', name: 'Spare Parts', description: 'Suku cadang mesin gudang, forklift parts, dan konveyor', product_count: 41 }
  ],

  units: [
    { id: 1, code: 'PCS', name: 'Pieces / Satuan', symbol: 'pcs', description: 'Satuan hitung unit individual' },
    { id: 2, code: 'KG', name: 'Kilogram', symbol: 'kg', description: 'Satuan bobot berat metrik' },
    { id: 3, code: 'BOX', name: 'Box / Dus', symbol: 'box', description: 'Kemasan kardus sekunder' },
    { id: 4, code: 'MTR', name: 'Meter', symbol: 'm', description: 'Satuan ukuran panjang' },
    { id: 5, code: 'PLT', name: 'Pallet', symbol: 'plt', description: 'Satuan palet logistik standar' },
    { id: 6, code: 'LTR', name: 'Liter', symbol: 'L', description: 'Satuan volume cairan' }
  ],

  suppliers: [
    { id: 1, code: 'SUP-001', name: 'PT Global Komponen Nusantara', email: 'sales@globalkomponen.co.id', phone: '+62 21-554-8901', city: 'Jakarta Barat', address: 'Kawasan Industri Puri Indah Blok B-8', rating: 4.8, status: 'Active' },
    { id: 2, code: 'SUP-002', name: 'CV Logam Mandiri Perkasa', email: 'order@logammandiri.com', phone: '+62 31-890-3321', city: 'Surabaya', address: 'Jl. Rungkut Industri Raya No. 45', rating: 4.5, status: 'Active' },
    { id: 3, code: 'SUP-003', name: 'PT Indopack Kemasan Prima', email: 'info@indopackprima.co.id', phone: '+62 22-771-4450', city: 'Bandung', address: 'Jl. Soekarno Hatta No. 620', rating: 4.2, status: 'Active' },
    { id: 4, code: 'SUP-004', name: 'Shanghai Tech Components Ltd', email: 'export@shanghaitech.cn', phone: '+86 21-8899-1122', city: 'Shanghai, CN', address: 'Pudong New District Innovation Park', rating: 4.6, status: 'Active' }
  ],

  customers: [
    { id: 1, code: 'CUST-001', name: 'PT Astra Solusi Manufaktur', email: 'procurement@astrasolusi.id', phone: '+62 21-899-2300', city: 'Cikarang, Bekasi', address: 'GIIC Deltamas Zone A-10', type: 'Enterprise B2B', status: 'Active' },
    { id: 2, code: 'CUST-002', name: 'PT Telco Infrastruktur Digital', email: 'supply@telcoinfradigital.com', phone: '+62 21-522-8811', city: 'Jakarta Selatan', address: 'Menara Palma Lt. 18, HR Rasuna Said', type: 'Corporate', status: 'Active' },
    { id: 3, code: 'CUST-003', name: 'CV Surya Cipta Elektrika', email: 'suryacipta.el@gmail.com', phone: '+62 274-551-998', city: 'Yogyakarta', address: 'Jl. Magelang KM 7.5 No. 12', type: 'Distributor', status: 'Active' }
  ],

  warehouses: [
    { id: 1, code: 'WH-JKT-01', name: 'Jakarta Central DC', type: 'Central Distribution Hub', address: 'Kawasan Pergudangan Marunda Center Blok C-12, Jakarta Utara', capacity_sqm: 12000, total_bins: 480, manager: 'Ahmad Subagyo', status: 'Active' },
    { id: 2, code: 'WH-SBY-02', name: 'Surabaya Distribution Hub', type: 'Regional Hub', address: 'Kawasan Industri SIER Blok G-5, Surabaya', capacity_sqm: 8500, total_bins: 320, manager: 'Hendro Prasetyo', status: 'Active' },
    { id: 3, code: 'WH-BDG-03', name: 'Bandung Transit WH', type: 'Transit / Fulfillment', address: 'Jl. Raya Cimahi No. 104, Bandung Barat', capacity_sqm: 4000, total_bins: 150, manager: 'Dewi Lestari', status: 'Active' }
  ],

  locations: [
    { id: 1, code: 'LOC-A1-01', warehouse: 'Jakarta Central DC', zone: 'Zone A - Electronics', rack: 'R-01', shelf: 'S-01', bin: 'BIN-01', status: 'Occupied' },
    { id: 2, code: 'LOC-A1-02', warehouse: 'Jakarta Central DC', zone: 'Zone A - Electronics', rack: 'R-01', shelf: 'S-02', bin: 'BIN-02', status: 'Available' },
    { id: 3, code: 'LOC-B2-01', warehouse: 'Jakarta Central DC', zone: 'Zone B - Raw Materials', rack: 'R-02', shelf: 'S-01', bin: 'BIN-01', status: 'Occupied' },
    { id: 4, code: 'LOC-C3-01', warehouse: 'Surabaya Distribution Hub', zone: 'Zone C - Finished Goods', rack: 'R-03', shelf: 'S-01', bin: 'BIN-01', status: 'Occupied' },
    { id: 5, code: 'LOC-D4-01', warehouse: 'Bandung Transit WH', zone: 'Zone D - Transit', rack: 'R-04', shelf: 'S-01', bin: 'BIN-01', status: 'Available' }
  ],

  // Inventory Movements & Opname
  stockMovements: [
    { id: 1, ref_no: 'MOV-2026-081', date: '2026-08-13 14:20', sku: 'SKU-ELE-001', product_name: 'Smart Sensor Hub IoT Pro', type: 'INBOUND', qty: 50, warehouse: 'Jakarta Central DC', notes: 'Penerimaan PO-2026-018', operator: 'Bambang Tri' },
    { id: 2, ref_no: 'MOV-2026-080', date: '2026-08-13 11:45', sku: 'SKU-FG-003', product_name: 'Industrial Terminal Junction Box', type: 'OUTBOUND', qty: -15, warehouse: 'Jakarta Central DC', notes: 'Surat Jalan DO-2026-042', operator: 'Rian Hidayat' },
    { id: 3, ref_no: 'MOV-2026-079', date: '2026-08-12 16:30', sku: 'SKU-RAW-002', product_name: 'Aluminum Alloy Sheet 5mm', type: 'TRANSFER', qty: 25, warehouse: 'Surabaya Hub -> Bandung WH', notes: 'Inter-warehouse rebalancing', operator: 'Siti Rahma' },
    { id: 4, ref_no: 'MOV-2026-078', date: '2026-08-12 09:15', sku: 'SKU-RAW-005', product_name: 'Industrial Copper Wire 2.5mm', type: 'ADJUSTMENT', qty: -2, warehouse: 'Jakarta Central DC', notes: 'Koreksi kabel rusak uji lab', operator: 'Ahmad Subagyo' }
  ],

  stockOpname: [
    { id: 1, opname_no: 'OPN-2026-008', date: '2026-08-10', warehouse: 'Jakarta Central DC', zone: 'Zone A - Electronics', total_items: 24, system_qty: 480, actual_qty: 478, discrepancy: -2, status: 'Completed', auditor: 'Ahmad Subagyo' },
    { id: 2, opname_no: 'OPN-2026-009', date: '2026-08-14', warehouse: 'Surabaya Distribution Hub', zone: 'Zone B - Raw Materials', total_items: 18, system_qty: 620, actual_qty: 620, discrepancy: 0, status: 'In Progress', auditor: 'Hendro Prasetyo' }
  ],

  stockAdjustments: [
    { id: 1, adj_no: 'ADJ-2026-015', date: '2026-08-12', sku: 'SKU-RAW-005', product_name: 'Industrial Copper Wire 2.5mm', warehouse: 'Jakarta Central DC', type: 'REDUCE', qty: 2, reason: 'Damaged / Rusak fisik saat handling', status: 'Approved', requested_by: 'Bambang Tri', approved_by: 'Administrator' },
    { id: 2, adj_no: 'ADJ-2026-016', date: '2026-08-13', sku: 'SKU-ELE-004', product_name: 'PCB Microcontroller Board v4.2', warehouse: 'Bandung Transit WH', type: 'INCREASE', qty: 5, reason: 'Found / Kelebihan hitung stock opname', status: 'Pending', requested_by: 'Dewi Lestari', approved_by: '-' }
  ],

  // Procurement
  purchaseRequests: [
    { id: 1, pr_no: 'PR-2026-089', date: '2026-08-12', department: 'Warehouse Jakarta', requested_by: 'Bambang Tri', total_estimated: 14500000, priority: 'High', status: 'Approved', items: [{ sku: 'SKU-ELE-001', name: 'Smart Sensor Hub', qty: 20, est_price: 450000 }, { sku: 'SKU-PKG-006', name: 'Carton Box', qty: 200, est_price: 12000 }] },
    { id: 2, pr_no: 'PR-2026-090', date: '2026-08-13', department: 'Production Assembly', requested_by: 'Siti Rahma', total_estimated: 8400000, priority: 'Normal', status: 'Pending', items: [{ sku: 'SKU-RAW-005', name: 'Industrial Copper Wire', qty: 300, est_price: 28000 }] }
  ],

  purchaseOrders: [
    { id: 1, po_no: 'PO-2026-042', pr_no: 'PR-2026-089', date: '2026-08-13', supplier: 'PT Global Komponen Nusantara', total_amount: 14500000, payment_terms: 'NET 30', status: 'Issued', delivery_due: '2026-08-20' },
    { id: 2, po_no: 'PO-2026-041', pr_no: 'PR-2026-085', date: '2026-08-08', supplier: 'CV Logam Mandiri Perkasa', total_amount: 21600000, payment_terms: 'NET 14', status: 'Completed', delivery_due: '2026-08-14' }
  ],

  goodsReceipts: [
    { id: 1, gr_no: 'GR-2026-038', po_no: 'PO-2026-041', date: '2026-08-13', supplier: 'CV Logam Mandiri Perkasa', warehouse: 'Surabaya Hub', received_qty: 120, qc_status: 'Passed', received_by: 'Hendro Prasetyo' },
    { id: 2, gr_no: 'GR-2026-039', po_no: 'PO-2026-042', date: '2026-08-14', supplier: 'PT Global Komponen Nusantara', warehouse: 'Jakarta Central DC', received_qty: 20, qc_status: 'Inspecting', received_by: 'Bambang Tri' }
  ],

  // Outbound
  materialRequests: [
    { id: 1, mr_no: 'MR-2026-051', date: '2026-08-13', requester: 'Divisi Assembly Line 2', project: 'Batch Produksi Terminal Box', priority: 'High', status: 'Approved', items_count: 3 },
    { id: 2, mr_no: 'MR-2026-052', date: '2026-08-14', requester: 'Divisi R&D Sensor', project: 'Prototyping Smart Hub v5', priority: 'Medium', status: 'Pending', items_count: 2 }
  ],

  pickings: [
    { id: 1, pick_no: 'PCK-2026-061', ref_order: 'MR-2026-051', picker: 'Rian Hidayat', zone: 'Zone A & B', total_items: 65, picked_items: 65, status: 'Completed' },
    { id: 2, pick_no: 'PCK-2026-062', ref_order: 'DO-2026-043', picker: 'Bambang Tri', zone: 'Zone C', total_items: 30, picked_items: 12, status: 'In Progress' }
  ],

  packings: [
    { id: 1, pack_no: 'PCK-BOX-021', pick_no: 'PCK-2026-061', box_type: 'Heavy Duty Carton 50x40x30', weight_kg: 18.5, packed_by: 'Siti Rahma', status: 'Ready for Dispatch' },
    { id: 2, pack_no: 'PCK-BOX-022', pick_no: 'PCK-2026-062', box_type: 'Pallet Plastic Wrapping', weight_kg: 140.0, packed_by: 'Bambang Tri', status: 'Packing' }
  ],

  deliveryOrders: [
    { id: 1, do_no: 'DO-2026-042', date: '2026-08-13', customer: 'PT Astra Solusi Manufaktur', destination: 'Cikarang, Bekasi', driver: 'M. Yusuf (B 9482 SXA)', status: 'Dispatched', total_packages: 5 },
    { id: 2, do_no: 'DO-2026-043', date: '2026-08-14', customer: 'PT Telco Infrastruktur Digital', destination: 'Jakarta Selatan', driver: 'Agus Santoso (B 1120 TZZ)', status: 'Preparing', total_packages: 8 }
  ],

  shipments: [
    { id: 1, shp_no: 'SHP-2026-030', do_no: 'DO-2026-042', carrier: 'NEXORA Dedicated Fleet', tracking_no: 'NEX-TRK-9901', dispatch_date: '2026-08-13 13:00', eta: '2026-08-13 17:00', status: 'Delivered' },
    { id: 2, shp_no: 'SHP-2026-031', do_no: 'DO-2026-043', carrier: 'JNE Trucking Cargo', tracking_no: 'JNE-TRK-88129', dispatch_date: '2026-08-14 09:30', eta: '2026-08-15 14:00', status: 'In Transit' }
  ],

  // Administration
  users: [
    { id: 1, name: 'Administrator NEXORA', email: 'admin@nexora.com', role: 'Super Admin', status: 'Active', department: 'IT Operations & Enterprise', phone: '+62 812-8899-0011' },
    { id: 2, name: 'Ahmad Subagyo', email: 'ahmad.s@nexora.com', role: 'Warehouse Manager', status: 'Active', department: 'Jakarta Central DC', phone: '+62 811-2345-6789' },
    { id: 3, name: 'Siti Rahma', email: 'siti.r@nexora.com', role: 'Procurement Specialist', status: 'Active', department: 'Purchasing & SCM', phone: '+62 813-4567-8901' },
    { id: 4, name: 'Bambang Tri', email: 'bambang.t@nexora.com', role: 'Inventory Staff', status: 'Active', department: 'Surabaya Distribution Hub', phone: '+62 815-6789-0123' },
    { id: 5, name: 'Dewi Lestari', email: 'dewi.l@nexora.com', role: 'Quality Control Lead', status: 'Active', department: 'Bandung Transit WH', phone: '+62 817-8901-2345' }
  ],

  roles: [
    { id: 1, name: 'Super Admin', description: 'Akses penuh ke semua modul sistem dan konfigurasi', users_count: 1, permissions: ['all'] },
    { id: 2, name: 'Warehouse Manager', description: 'Pengelolaan stok, lokasi gudang, dan otorisasi pergerakan barang', users_count: 3, permissions: ['master_data', 'inventory_full', 'outbound_approve', 'reports'] },
    { id: 3, name: 'Procurement Specialist', description: 'Pengelolaan vendor, Purchase Request, dan Purchase Order', users_count: 2, permissions: ['procurement_full', 'suppliers', 'inbound_view'] },
    { id: 4, name: 'Inventory & Picker Staff', description: 'Operasional scan picking, packing, dan stock opname fisik', users_count: 8, permissions: ['inventory_view', 'picking', 'packing', 'opname_input'] }
  ],

  auditLogs: [
    { id: 1, timestamp: '2026-08-14 00:15:20', user: 'Administrator NEXORA', module: 'Administration', action: 'Update Account Settings & Security', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 2, timestamp: '2026-08-13 23:40:12', user: 'Administrator NEXORA', module: 'Inventory', action: 'Export Master Data Produk Catalog to Excel', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 3, timestamp: '2026-08-13 22:15:45', user: 'Ahmad Subagyo', module: 'Procurement', action: 'Approve Purchase Request PR-2026-089', ip: '192.168.1.45', status: 'SUCCESS' },
    { id: 4, timestamp: '2026-08-13 19:10:00', user: 'Siti Rahma', module: 'Outbound', action: 'Generate Delivery Order DO-2026-042', ip: '192.168.1.72', status: 'SUCCESS' },
    { id: 5, timestamp: '2026-08-13 16:05:30', user: 'Bambang Tri', module: 'Stock Opname', action: 'Record Actual Count Bin LOC-A1-01', ip: '192.168.2.14', status: 'SUCCESS' }
  ]
};

export const storageService = {
  get: (key) => {
    const raw = localStorage.getItem(`nexora_${key}`);
    if (!raw) {
      const fallback = initialData[key] || [];
      localStorage.setItem(`nexora_${key}`, JSON.stringify(fallback));
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialData[key] || [];
    }
  },

  set: (key, data) => {
    localStorage.setItem(`nexora_${key}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(`nexora_${key}_updated`, { detail: data }));
  },

  create: (key, item) => {
    const list = storageService.get(key);
    const newItem = {
      ...item,
      id: item.id || (list.length > 0 ? Math.max(...list.map(i => i.id || 0)) + 1 : 1),
      created_at: new Date().toISOString()
    };
    const updated = [newItem, ...list];
    storageService.set(key, updated);
    storageService.logAudit('CREATE', key.toUpperCase(), `Menambahkan entri baru ID #${newItem.id}`);
    return newItem;
  },

  update: (key, id, itemData) => {
    const list = storageService.get(key);
    const updated = list.map(item => (item.id === id ? { ...item, ...itemData, updated_at: new Date().toISOString() } : item));
    storageService.set(key, updated);
    storageService.logAudit('UPDATE', key.toUpperCase(), `Memperbarui entri ID #${id}`);
    return updated.find(i => i.id === id);
  },

  delete: (key, id) => {
    const list = storageService.get(key);
    const updated = list.filter(item => item.id !== id);
    storageService.set(key, updated);
    storageService.logAudit('DELETE', key.toUpperCase(), `Menghapus entri ID #${id}`);
    return true;
  },

  logAudit: (action, moduleName, details) => {
    const currentUser = JSON.parse(localStorage.getItem('nexora_user') || '{"name":"Administrator NEXORA"}');
    const logs = storageService.get('auditLogs');
    const newLog = {
      id: (logs.length > 0 ? Math.max(...logs.map(i => i.id || 0)) + 1 : 1),
      timestamp: new Date().toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':'),
      user: currentUser.name || 'Administrator',
      module: moduleName,
      action: `${action}: ${details}`,
      ip: '127.0.0.1',
      status: 'SUCCESS'
    };
    storageService.set('auditLogs', [newLog, ...logs]);
  }
};
