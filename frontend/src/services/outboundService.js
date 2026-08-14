import api from './api';

export const outboundService = {
  getDeliveryOrders: async () => {
    try {
      const res = await api.get('/outbound/delivery-orders');
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 'DO-2026-042', customer: 'PT Global Logistics', status: 'Shipped', carrier: 'JNE Express', date: '2026-08-11' }
        ]
      };
    }
  }
};
