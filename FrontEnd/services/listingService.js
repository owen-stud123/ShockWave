import api from './apiClient.js';

export const listingService = {
  getListings: (params = {}) => api.get('/listings', { params }),
  getListing: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  submitProposal: (listingId, data) => api.post(`/listings/${listingId}/proposals`, data),
  getProposalsForListing: (listingId) => api.get(`/listings/${listingId}/proposals`),
  updateProposalStatus: (listingId, proposalId, status) => 
    api.patch(`/listings/${listingId}/proposals/${proposalId}`, { status }),
  toggleBookmark: (listingId) => api.post(`/listings/${listingId}/bookmark`),
  getBookmarkedListings: () => api.get('/listings/bookmarked'),
};

export default listingService;
