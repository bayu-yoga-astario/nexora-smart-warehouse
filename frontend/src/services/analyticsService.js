import api from './api';

export const analyticsService = {
  getDemandForecast: async () => {
    try {
      const res = await api.get('/analytics/forecast');
      return res.data;
    } catch (e) {
      return {
        data: [
          { product_sku: 'SKU-ELE-001', product_name: 'Smart Sensor Hub', forecast_next_30d: 145, trend: '+12%', confidence: '94%' },
          { product_sku: 'SKU-RAW-002', product_name: 'Aluminum Alloy Sheet', forecast_next_30d: 320, trend: '+5%', confidence: '89%' }
        ]
      };
    }
  },

  getReorderRecommendations: async () => {
    try {
      const res = await api.get('/analytics/reorder');
      return res.data;
    } catch (e) {
      return {
        data: [
          { product_sku: 'SKU-ELE-001', product_name: 'Smart Sensor Hub', current_stock: 12, min_stock: 15, reorder_point: 35, recommended_order_qty: 100, urgency: 'HIGH' }
        ]
      };
    }
  },

  getInventoryHealth: async () => {
    try {
      const res = await api.get('/analytics/inventory-health');
      return res.data;
    } catch (e) {
      return {
        data: {
          health_score: 88.5,
          status: 'EXCELLENT',
          turnover_rate: '4.2x / year',
          stockout_risk_items: 3,
          overstock_risk_items: 2,
          dead_stock_ratio: '3.1%'
        }
      };
    }
  },

  getSlowMoving: async () => {
    try {
      const res = await api.get('/analytics/slow-moving');
      return res.data;
    } catch (e) {
      return {
        data: [
          { product_sku: 'SKU-OLD-999', product_name: 'Legacy Cable Harness', current_stock: 250, days_inactive: 120, capital_tied_up: 12500000, status: 'CRITICAL_SLOW' }
        ]
      };
    }
  }
};
