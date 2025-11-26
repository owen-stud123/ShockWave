/**
 * Socket.IO event handlers
 */
import Message from '../models/messageModel.js';
import { generateThreadId } from '../utils/chatUtils.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join user to their personal room for receiving messages
    socket.on('join_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`✅ User ${userId} joined their room`);
    });

    // Handle sending messages with optimistic delivery
    socket.on('send_message', async (messageData) => {
      try {
        console.log('📨 Received message:', messageData);
        
        // Generate thread ID using utility function
        const thread_id = messageData.thread_id || 
          generateThreadId(messageData.sender_id, messageData.recipient_id);
        
        // Prepare message object for frontend (optimistic delivery)
        const tempMessageId = `temp_${Date.now()}_${Math.random()}`;
        const messageToSend = {
          _id: tempMessageId,
          id: tempMessageId,
          sender_id: messageData.sender_id,
          recipient_id: messageData.recipient_id,
          content: messageData.content,
          thread_id: thread_id,
          created_at: new Date(),
          is_read: false,
          status: 'sending' // Optimistic status
        };
        
        // Emit immediately to both users (optimistic UI)
        io.to(`user_${messageData.recipient_id}`).emit('receive_message', messageToSend);
        io.to(`user_${messageData.sender_id}`).emit('receive_message', messageToSend);
        console.log(`📤 Optimistic delivery to sender and recipient`);
        
        // Save to database asynchronously
        const newMessage = new Message({
          sender: messageData.sender_id,
          recipient: messageData.recipient_id,
          body: messageData.content,
          thread_id: thread_id,
        });
        
        const savedMessage = await newMessage.save();
        console.log('💾 Message saved to DB:', savedMessage._id);
        
        // Send confirmation with real ID
        const confirmedMessage = {
          tempId: tempMessageId,
          _id: savedMessage._id,
          id: savedMessage._id.toString(),
          sender_id: savedMessage.sender,
          recipient_id: savedMessage.recipient,
          content: savedMessage.body,
          thread_id: savedMessage.thread_id,
          created_at: savedMessage.created_at,
          is_read: savedMessage.is_read,
          status: 'sent'
        };
        
        // Notify both users that message was persisted
        io.to(`user_${messageData.recipient_id}`).emit('message_confirmed', confirmedMessage);
        io.to(`user_${messageData.sender_id}`).emit('message_confirmed', confirmedMessage);
        
      } catch (error) {
        console.error('❌ Error sending message:', error);
        
        // Notify sender of failure
        socket.emit('message_error', { 
          tempId: messageData.tempId,
          error: 'Failed to send message',
          details: error.message,
          sender_id: messageData.sender_id,
          recipient_id: messageData.recipient_id
        });
      }
    });

    // Mark messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { thread_id, user_id } = data;
        
        await Message.updateMany(
          { thread_id, recipient: user_id, is_read: false },
          { $set: { is_read: true } }
        );
        
        // Notify sender that their messages were read
        const messages = await Message.find({ thread_id, sender: { $ne: user_id } }).select('sender');
        const senderIds = [...new Set(messages.map(m => m.sender.toString()))];
        
        senderIds.forEach(senderId => {
          io.to(`user_${senderId}`).emit('messages_read', { thread_id, reader_id: user_id });
        });
        
      } catch (error) {
        console.error('❌ Error marking messages as read:', error);
      }
    });

    // Typing indicator
    socket.on('typing_start', (data) => {
      const { thread_id, user_id, recipient_id } = data;
      io.to(`user_${recipient_id}`).emit('user_typing', { thread_id, user_id });
    });

    socket.on('typing_stop', (data) => {
      const { thread_id, user_id, recipient_id } = data;
      io.to(`user_${recipient_id}`).emit('user_stopped_typing', { thread_id, user_id });
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });
};
