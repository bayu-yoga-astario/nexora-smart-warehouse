import api from './api';

export const procurementService = {
  getPurchaseRequests: async () => {
    try {
      const res = await api.get('/procurement/requests');
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 'PR-2026-001', requester: 'Factory Operations', status: 'Approved', total_items: 4, date: '2026-08-01' },
          { id: 'PR-2026-002', requester: 'Electronics Div', status: 'Pending Review', total_items: 2, date: '2026-08-12' }
        ]
      };
    }
  },

  getPurchaseOrders: async () => {
    try {
      const res = await api.get('/procurement/orders');
      return res.data;
    } catch (e) {
      return {
        data: [
          { id: 'PO-2026-089', supplier: 'PT Microtech Component', status: 'Issued', total_amount: 45000000, date: '2026-08-05' }
        ]
      };
    }
  }
};
