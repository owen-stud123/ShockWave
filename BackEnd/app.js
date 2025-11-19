import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';


import connectDB from './config/database.js';
import Message from './models/messageModel.js';

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
import messagesRoutes from './routes/messagesRoutes.js';

dotenv.config();
connectDB(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/messages', messagesRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

io.on('connection', (socket) => { /* Socket logic remains */ });
app.use(errorHandler);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));