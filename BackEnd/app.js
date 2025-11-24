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
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Join user to their personal room for receiving messages
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`✅ User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on('send_message', async (messageData) => {
    try {
      console.log('📨 Received message:', messageData);
      
      // Create and save message to MongoDB (match the Message model schema!)
      const newMessage = new Message({
        sender: messageData.sender_id,      // Model uses 'sender' not 'sender_id'
        recipient: messageData.recipient_id, // Model uses 'recipient' not 'recipient_id'
        body: messageData.content,           // Model uses 'body' not 'content'
        thread_id: messageData.thread_id || `${messageData.sender_id}_${messageData.recipient_id}`,
      });
      
      const savedMessage = await newMessage.save();
      console.log('💾 Message saved to DB:', savedMessage._id);
      
      // Convert to plain object with proper field names for frontend
      const messageToSend = {
        _id: savedMessage._id,
        id: savedMessage._id.toString(),
        sender_id: savedMessage.sender,
        recipient_id: savedMessage.recipient,
        content: savedMessage.body,
        thread_id: savedMessage.thread_id,
        created_at: savedMessage.created_at,
        is_read: savedMessage.is_read
      };
      
      // Emit to recipient's room
      io.to(`user_${messageData.recipient_id}`).emit('receive_message', messageToSend);
      console.log(`📤 Sent to recipient: user_${messageData.recipient_id}`);
      
      // Also emit back to sender for confirmation
      io.to(`user_${messageData.sender_id}`).emit('receive_message', messageToSend);
      console.log(`📤 Sent to sender: user_${messageData.sender_id}`);
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('Error details:', error.stack);
      socket.emit('message_error', { 
        error: 'Failed to send message',
        details: error.message 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
