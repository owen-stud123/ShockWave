import api from './apiClient.js';

export const invoiceService = {
  getInvoices: () => api.get('/invoices'),
  getInvoice: (id) => api.get(`/invoices/${id}`),
  createInvoice: (data) => api.post('/invoices', data),
  markAsPaid: (id) => api.patch(`/invoices/${id}/pay`),
};

export default invoiceService;
