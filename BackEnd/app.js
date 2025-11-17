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

// --- (MODIFICATION 1): IMPORT MONGOOSE AND THE MESSAGE MODEL ---
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import Message from './models/messageModel.js';

// Import routes and middleware...
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import listingRoutes from './routes/listingsRoutes.js';
import orderRoutes from './routes/ordersRoutes.js';
import messageRoutes from './routes/messagesRoutes.js';
import paymentRoutes from './routes/paymentsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

// --- (MODIFICATION 2): CONNECT TO MONGODB AT STARTUP ---
connectDB(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions,
  transports: ['polling', 'websocket']
});

const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/reviews', reviewsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// --- (MODIFICATION 3): THIS IS THE DEFINITIVE FIX FOR SOCKETS, NOW USING MONGOOSE ---
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);
  
  socket.on('join_room', (userId) => {
    console.log(`User ${userId} joined room: ${userId}`);
    socket.join(userId.toString());
  });

  socket.on('send_message', async (data) => {
    try {
      const { sender_id, recipient_id, body } = data;
      if (!sender_id || !recipient_id || !body) {
        console.error('Socket Event Error: Invalid message data received:', data);
        return;
      }
      
      const thread_id = [sender_id, recipient_id].sort().join('-');
      
      const newMessage = new Message({
        thread_id: thread_id,
        sender: sender_id,
        recipient: recipient_id,
        body: body,
      });

      await newMessage.save();
      
      // --- THIS IS THE FIX ---
      // Construct the object with the exact fields the frontend expects ('sender_id', etc.)
      const messageForClient = {
          id: newMessage._id.toHexString(),
          thread_id: newMessage.thread_id,
          sender_id: newMessage.sender.toHexString(),
          recipient_id: newMessage.recipient.toHexString(),
          body: newMessage.body,
          created_at: newMessage.created_at,
      };

      // Emit the correctly structured object to both users
      io.to(recipient_id.toString()).emit('receive_message', messageForClient);
      io.to(sender_id.toString()).emit('receive_message', messageForClient);
      console.log(`Message sent from ${sender_id} to ${recipient_id}`);

    } catch (error) {
      console.error('!!! CRITICAL FAILURE in "send_message" event:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥 A user disconnected:', socket.id);
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});