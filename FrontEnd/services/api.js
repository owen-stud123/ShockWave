import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service Objects ---

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const profileAPI = {
  getProfile: (id) => api.get(`/profiles/${id}`),
  updateProfile: (id, data) => api.put(`/profiles/${id}`, data),
  searchProfiles: (params) => api.get('/profiles', { params }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const listingAPI = {
  getListings: () => api.get('/listings'),
  getListing: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  submitProposal: (listingId, data) => api.post(`/listings/${listingId}/proposals`, data),
  getProposalsForListing: (listingId) => api.get(`/listings/${listingId}/proposals`),
};

export const orderAPI = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const messageAPI = {
  getThreads: () => api.get('/messages/threads'),
  getMessages: (participantId) => api.get(`/messages/threads/${participantId}`),
};

export const reviewAPI = {
  createReview: (data) => api.post('/reviews', data),
  getReviewsForUser: (userId) => api.get(`/reviews/user/${userId}`),
};

export const uploadAPI = {
  uploadAvatar: (formData) => api.post('/uploads/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;