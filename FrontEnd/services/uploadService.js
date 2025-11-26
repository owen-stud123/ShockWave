import api from './apiClient.js';

export const uploadService = {
  uploadAvatar: (formData) => 
    api.post('/uploads/avatar', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  uploadPortfolioItem: (formData) => 
    api.post('/uploads/portfolio', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
  deletePortfolioItem: (id) => api.delete(`/uploads/portfolio/${id}`),
};

export default uploadService;
