import api from './apiClient.js';

export const profileService = {
  getProfile: (id) => api.get(`/profiles/${id}`),
  updateProfile: (id, data) => api.put(`/profiles/${id}`, data),
  searchProfiles: (params) => api.get('/profiles', { params }),
};

export default profileService;
