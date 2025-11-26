import api from './apiClient.js';

export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getReviewsForUser: (userId) => api.get(`/reviews/user/${userId}`),
};

export default reviewService;
