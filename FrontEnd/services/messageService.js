import api from './apiClient.js';

export const messageService = {
  getThreads: () => api.get('/messages/threads'),
  getMessages: (threadId, params = {}) => api.get(`/messages/${threadId}`, { params }),
};

export default messageService;
