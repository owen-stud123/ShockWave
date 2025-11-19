import axios from 'axios';

// Get the base URL from environment variables, with a fallback for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- 1. AXIOS INSTANCE CREATION ---
// This is the centralized API client. All requests from the frontend will go through this instance.
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending cookies (like the refresh token) to the backend
});

// --- 2. REQUEST INTERCEPTOR ---
// This function runs BEFORE every single API request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage.
    const token = localStorage.getItem('accessToken');
    if (token) {
      // If a token exists, automatically add the 'Authorization' header to the request.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Allow the request to proceed with the new header.
  },
  (error) => {
    // If there's an error creating the request, reject the promise.
    return Promise.reject(error);
  }
);

// --- 3. RESPONSE INTERCEPTOR ---
// This function runs AFTER an API response is received, but BEFORE it's passed to the component.
api.interceptors.response.use(
  // If the response is successful (e.g., status 200), just pass it through.
  (response) => response,
  // If the response has an error (e.g., status 403), this logic is triggered.
  async (error) => {
    const originalRequest = error.config;
    
    // This block handles expired access tokens. A 403 status is what our backend sends for this.
    // The `!originalRequest._retry` flag prevents an infinite loop of retries.
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to get a new access token using the refresh token cookie.
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // Save the new access token.
        localStorage.setItem('accessToken', data.accessToken);
        
        // Update the authorization header on our original failed request.
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // Retry the original request with the new token.
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh fails, the user's session is truly expired.
        // Clear the token and redirect to the login page.
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For any other errors, just pass them along.
    return Promise.reject(error);
  }
);

// --- 4. MODULAR API OBJECTS ---
// Grouping API calls by resource for clean code and easy importing.

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
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
  updateProposalStatus: (listingId, proposalId, status) => api.patch(`/listings/${listingId}/proposals/${proposalId}`, { status }),
  toggleBookmark: (listingId) => api.post(`/listings/${listingId}/bookmark`),
  getBookmarkedListings: () => api.get('/listings/bookmarked'),
};

export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  postProgressUpdate: (orderId, data) => api.post(`/orders/${orderId}/updates`, data),
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
  uploadAvatar: (formData) => api.post('/uploads/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadPortfolioItem: (formData) => api.post('/uploads/portfolio', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePortfolioItem: (id) => api.delete(`/uploads/portfolio/${id}`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id, is_active) => api.patch(`/admin/users/${id}/status`, { is_active }),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllMessageThreads: () => api.get('/admin/messages'),
  getMessagesForModeration: (threadId) => api.get(`/admin/messages/${threadId}`),
  toggleFlagThread: (threadId) => api.patch(`/admin/messages/${threadId}/flag`),
};

export const invoiceAPI = {
    getInvoices: () => api.get('/invoices'),
    createInvoice: (data) => api.post('/invoices', data),
};

export default api;