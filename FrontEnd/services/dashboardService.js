import api from './apiClient.js';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export default dashboardService;
