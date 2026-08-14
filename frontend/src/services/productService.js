import api from './api';

export const productService = {
  getAll: async (params) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 1, sku: 'SKU-ELE-001', barcode: '8991001', name: 'Smart Sensor Hub', category: 'Electronics', unit: 'PCS', stock: 12, min_stock: 15, unit_cost: 450000, sell_price: 650000, status: 'Low Stock' },
          { id: 2, sku: 'SKU-RAW-002', barcode: '8991002', name: 'Aluminum Alloy Sheet', category: 'Raw Materials', unit: 'KG', stock: 45, min_stock: 50, unit_cost: 120000, sell_price: 180000, status: 'Normal' },
          { id: 3, sku: 'SKU-FG-003', barcode: '8991003', name: 'Industrial Terminal Box', category: 'Finished Goods', unit: 'BOX', stock: 85, min_stock: 20, unit_cost: 850000, sell_price: 1250000, status: 'Normal' }
        ]
      };
    }
  },
  create: async (data) => api.post('/products', data),
  update: async (id, data) => api.put(`/products/${id}`, data),
  delete: async (id) => api.delete(`/products/${id}`)
};
