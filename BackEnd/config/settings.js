/**
 * Application configuration settings
 */

export const config = {
  // Payment & Pricing
  platformFeePercentage: 0.10, // 10% platform fee
  
  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    messagesDefaultLimit: 50
  },
  
  // Rate limiting
  rateLimits: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500 // requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // login/register attempts per window
    },
    messages: {
      windowMs: 60 * 1000, // 1 minute
      max: 20 // messages per minute
    }
  },
  
  // File uploads
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword']
  },
  
  // Search
  search: {
    defaultResultLimit: 20,
    maxResultLimit: 100
  }
};

export default config;
