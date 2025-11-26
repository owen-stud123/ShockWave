// Central exports for all API services
export { default as authService } from './authService.js';
export { default as profileService } from './profileService.js';
export { default as listingService } from './listingService.js';
export { default as messageService } from './messageService.js';
export { default as orderService } from './orderService.js';
export { default as reviewService } from './reviewService.js';
export { default as uploadService } from './uploadService.js';
export { default as adminService } from './adminService.js';
export { default as invoiceService } from './invoiceService.js';
export { default as dashboardService } from './dashboardService.js';

// For backward compatibility, re-export as the old object structure
export const authAPI = (await import('./authService.js')).default;
export const profileAPI = (await import('./profileService.js')).default;
export const listingAPI = (await import('./listingService.js')).default;
export const messageAPI = (await import('./messageService.js')).default;
export const orderAPI = (await import('./orderService.js')).default;
export const reviewAPI = (await import('./reviewService.js')).default;
export const uploadAPI = (await import('./uploadService.js')).default;
export const adminAPI = (await import('./adminService.js')).default;
export const invoiceAPI = (await import('./invoiceService.js')).default;
export const dashboardAPI = (await import('./dashboardService.js')).default;

export { default as api } from './apiClient.js';
