import api from './api';

export const reportService = {
  getStockReport: async (params) => api.get('/reports/stock', { params }),
  getInboundReport: async (params) => api.get('/reports/inbound', { params }),
  getOutboundReport: async (params) => api.get('/reports/outbound', { params }),
  getPurchaseReport: async (params) => api.get('/reports/purchase', { params })
};
