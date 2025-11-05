import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation(); // Hook to get navigation state
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // ... (socket.io listeners remain the same)
  }, [user, activeThread]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await messageAPI.getThreads();
        
        // --- LOGIC TO HANDLE NEW CONVERSATION ---
        const newConversationUser = location.state?.newConversationWith;
        let allThreads = res.data;

        if (newConversationUser) {
          // Check if a thread with this user already exists
          const existingThread = allThreads.find(t => t.participant_id === newConversationUser.id);
          if (!existingThread) {
            // If not, create a placeholder thread so it appears in the list
            const newPlaceholderThread = {
              thread_id: [user.id, newConversationUser.id].sort().join('-'),
              participant_id: newConversationUser.id,
              participant_name: newConversationUser.name,
              last_message: 'Start the conversation!',
              last_message_date: new Date().toISOString(),
            };
            allThreads = [newPlaceholderThread, ...allThreads];
          }
          // Set this new or existing thread as active
          handleThreadClick(allThreads.find(t => t.participant_id === newConversationUser.id));

          // Clear the location state so it doesn't re-trigger
          window.history.replaceState({}, document.title);
        }

        setThreads(allThreads);
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      }
    };
    if (user) fetchThreads();
  }, [user, location.state]);
  
  // ... (useEffect for scrolling remains the same)

  const handleThreadClick = async (thread) => {
    setActiveThread(thread);
    try {
      // Fetch messages only if the thread is real (not just a placeholder)
      if (thread.last_message !== 'Start the conversation!') {
        const res = await messageAPI.getMessages(thread.participant_id);
        setMessages(res.data);
      } else {
        setMessages([]); // Clear messages for a new conversation
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  
  // ... (handleSendMessage function remains the same)

  return (
    // ... (The JSX for the Messages component remains exactly the same)
    <div className="h-[calc(100vh-8rem)] flex bg-white max-w-7xl mx-auto my-8 rounded-lg shadow-lg border-2 border-mint/20 overflow-hidden">
        {/* ... */}
    </div>
  );
};

export default Messages;