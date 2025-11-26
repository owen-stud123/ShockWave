import api from './apiClient.js';

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  postProgressUpdate: (orderId, data) => api.post(`/orders/${orderId}/updates`, data),
};

export default orderService;
