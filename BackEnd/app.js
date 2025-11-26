import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/database.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import listingRoutes from './routes/listingsRoutes.js';
import orderRoutes from './routes/ordersRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken, requireRole } from './middleware/auth.js';

console.log('🔍 MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');
connectDB();
const app = express();
const server = http.createServer(app);

const allowedOrigins = [ 'http://localhost:5173', process.env.CLIENT_URL ].filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

const io = new Server(server, { cors: corsOptions });
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
// General rate limiter - increased to 500 requests per 15 minutes for development
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500, message: 'Too many requests, please try again later.' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Removed static file serving - now using Cloudinary for all uploads

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', authenticateToken, requireRole(['admin']), adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Setup Socket.IO handlers
setupSocketHandlers(io);

app.use(errorHandler);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
