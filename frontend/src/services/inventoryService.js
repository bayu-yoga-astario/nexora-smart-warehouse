import api from './api';

export const inventoryService = {
  getStock: async () => {
    try {
      const res = await api.get('/inventory/stock');
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 1, sku: 'SKU-ELE-001', name: 'Smart Sensor Hub', warehouse: 'Central Warehouse', location: 'Aisle 01 - Bin A-12', quantity: 12, unit: 'PCS' },
          { id: 2, sku: 'SKU-RAW-002', name: 'Aluminum Alloy Sheet', warehouse: 'Surabaya DC', location: 'Rack 04 - Bin B-02', quantity: 45, unit: 'KG' }
        ]
      };
    }
  },

  getMovements: async () => {
    try {
      const res = await api.get('/inventory/movements');
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 101, reference: 'GR-2026-001', type: 'INBOUND', sku: 'SKU-ELE-001', product: 'Smart Sensor Hub', qty: 50, date: '2026-08-10 14:30', user: 'Procurement Admin' },
          { id: 102, reference: 'DO-2026-042', type: 'OUTBOUND', sku: 'SKU-FG-003', product: 'Industrial Terminal Box', qty: 15, date: '2026-08-11 09:15', user: 'Logistics Staff' }
        ]
      };
    }
  },

  submitOpname: async (data) => api.post('/inventory/opname', data)
};
