import api from './apiClient.js';

export const adminService = {
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUserStatus: (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active }),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllMessageThreads: (params = {}) => api.get('/admin/messages', { params }),
  getMessagesForModeration: (threadId) => api.get(`/admin/messages/${threadId}`),
  toggleFlagThread: (threadId) => api.patch(`/admin/messages/${threadId}/flag`),
};

export default adminService;
