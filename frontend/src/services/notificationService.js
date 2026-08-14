// Notification Service for NEXORA Enterprise
// Manages notification state via localStorage with real-time reactivity

const STORAGE_KEY = 'nexora_notifications';

const EVENT_NAME = 'nexora_notifications_updated';

// Default seed notifications tied to actual system activity
const seedNotifications = () => {
  const now = Date.now();
  return [
    {
      id: 'notif-001',
      type: 'alert',
      title: 'Low Stock Alert',
      text: 'Smart Sensor Hub IoT Pro — stok 12 pcs (minimum 15 pcs)',
      link: '/inventory/stock',
      time: new Date(now - 5 * 60 * 1000).toISOString(),
      unread: true,
    },
    {
      id: 'notif-002',
      type: 'inbound',
      title: 'Goods Receipt Diterima',
      text: 'GR-2026-041 — 120 pcs Smart Sensor Hub dari PT Elco Teknologi berhasil diterima di Jakarta Central DC',
      link: '/procurement/goods-receipt',
      time: new Date(now - 8 * 60 * 1000).toISOString(),
      unread: true,
    },
    {
      id: 'notif-003',
      type: 'order',
      title: 'Purchase Order Disetujui',
      text: 'PO-2026-019 untuk Aluminium Sheet 500 KG telah disetujui oleh Manager',
      link: '/procurement/purchase-order',
      time: new Date(now - 60 * 60 * 1000).toISOString(),
      unread: true,
    },
    {
      id: 'notif-004',
      type: 'system',
      title: 'Stock Opname Selesai',
      text: 'Opname area Bin A-12 di Jakarta Central DC selesai tanpa selisih',
      link: '/inventory/opname',
      time: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      unread: false,
    },
    {
      id: 'notif-005',
      type: 'outbound',
      title: 'Delivery Order Dikirim',
      text: 'DO-2026-088 ke PT Global Distribusi — 3 item telah dikirim',
      link: '/outbound/delivery-order',
      time: new Date(now - 42 * 60 * 1000).toISOString(),
      unread: false,
    },
    {
      id: 'notif-006',
      type: 'alert',
      title: 'Low Stock Alert',
      text: 'Industrial Copper Wire 2.5mm — stok 48 meter (minimum 100 meter)',
      link: '/inventory/stock',
      time: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      unread: false,
    },
    {
      id: 'notif-007',
      type: 'system',
      title: 'Adjustment Diajukan',
      text: 'ADJ-2026-016 — PCB Microcontroller Board v4.2 +5 pcs menunggu persetujuan',
      link: '/inventory/adjustment',
      time: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      unread: false,
    },
  ];
};

const dispatchUpdate = () => {
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const notificationService = {
  EVENT_NAME,

  // Get all notifications
  getAll: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedNotifications();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  },

  // Get unread count
  getUnreadCount: () => {
    const all = notificationService.getAll();
    return all.filter((n) => n.unread).length;
  },

  // Mark a single notification as read
  markAsRead: (id) => {
    const all = notificationService.getAll();
    const updated = all.map((n) => (n.id === id ? { ...n, unread: false } : n));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
    return updated;
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    const all = notificationService.getAll();
    const updated = all.map((n) => ({ ...n, unread: false }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
    return updated;
  },

  // Delete a single notification
  remove: (id) => {
    const all = notificationService.getAll();
    const updated = all.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
    return updated;
  },

  // Clear all notifications
  clearAll: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    dispatchUpdate();
    return [];
  },

  // Add a new notification
  add: (notification) => {
    const all = notificationService.getAll();
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: new Date().toISOString(),
      unread: true,
      ...notification,
    };
    const updated = [newNotif, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    dispatchUpdate();
    return updated;
  },

  // Format time ago
  formatTimeAgo: (isoString) => {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = Math.max(0, now - then);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days === 1) return 'Kemarin';
    return `${days} hari lalu`;
  },
};
