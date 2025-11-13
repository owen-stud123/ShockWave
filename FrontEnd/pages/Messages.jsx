import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  transports: ['polling', 'websocket']
});

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  const fetchThreads = async () => {
    if (!user) return [];
    setLoading(true);
    try {
      const res = await messageAPI.getThreads();
      setThreads(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch threads:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Connect and join room
      socket.connect();
      socket.emit('join_room', user.id);

      // Listener for incoming messages
      const handleReceiveMessage = (message) => {
        // If the message belongs to the currently open chat, add it to the view
        if (activeThread && message.thread_id === activeThread.thread_id) {
          setMessages((prev) => [...prev, message]);
        }
        // Always refresh the thread list to show the new "last message"
        fetchThreads();
      };
      socket.on('receive_message', handleReceiveMessage);

      // Initial data load
      const initialize = async () => {
        const allThreads = await fetchThreads();
        const newConversationUser = location.state?.newConversationWith;

        if (newConversationUser) {
          const existingThread = allThreads.find(t => t.participant_id === newConversationUser.id);
          if (existingThread) {
            handleThreadClick(existingThread);
          } else {
            const placeholder = {
              thread_id: [user.id, newConversationUser.id].sort().join('-'),
              participant_id: newConversationUser.id,
              participant_name: newConversationUser.name,
              last_message: 'Start the conversation!',
              isPlaceholder: true,
            };
            setThreads(prev => [placeholder, ...prev]);
            setActiveThread(placeholder);
            setMessages([]);
          }
          navigate(location.pathname, { replace: true });
        }
      };
      initialize();
      
      return () => {
        socket.off('receive_message', handleReceiveMessage);
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleThreadClick = async (thread) => {
    setActiveThread(thread);
    if (thread.isPlaceholder) {
      setMessages([]);
      return;
    }
    try {
      const res = await messageAPI.getMessages(thread.participant_id);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeThread) return;
    
    // Only emit the event to the server. The server is the source of truth.
    // The server will save it, broadcast it back, and our `receive_message` listener will then add it to the UI.
    socket.emit('send_message', {
      sender_id: user.id,
      recipient_id: activeThread.participant_id,
      body: newMessage,
    });
    setNewMessage('');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white max-w-7xl mx-auto my-8 rounded-lg shadow-lg border-2 border-mint/20 overflow-hidden">
      <div className="w-1/3 border-r-2 border-lightgray flex flex-col">
        <div className="p-4 border-b-2 border-lightgray">
          <h2 className="text-xl font-bold text-charcoal">Conversations</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {threads.length === 0 ? (
            <p className="p-4 text-charcoal-light">No conversations yet.</p>
          ) : (
            <ul>
              {threads.map(thread => (
                <li key={thread.thread_id} onClick={() => handleThreadClick(thread)} className={`p-4 cursor-pointer hover:bg-lightgray-light border-b border-lightgray ${activeThread?.thread_id === thread.thread_id ? 'bg-mint/10' : ''}`}>
                  <p className="font-semibold text-charcoal">{thread.participant_name}</p>
                  <p className="text-sm text-charcoal-light truncate">{thread.last_message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="w-2/3 flex flex-col bg-lightgray-light">
        {activeThread ? (
          <>
            <div className="p-4 border-b-2 border-lightgray bg-white flex items-center">
              <h2 className="text-xl font-bold text-charcoal">{activeThread.participant_name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={msg.id || `temp-${index}`} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.sender_id === user.id ? 'bg-mint text-white' : 'bg-white text-charcoal'}`}>
                      <p>{msg.body}</p>
                      <p className={`text-xs mt-1 text-right ${msg.sender_id === user.id ? 'text-lightgray' : 'text-charcoal-light'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t-2 border-lightgray">
              <form onSubmit={handleSendMessage} className="flex">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border-2 border-lightgray-dark rounded-l-lg focus:ring-mint focus:border-mint"/>
                <button type="submit" className="px-4 py-2 bg-mint text-white rounded-r-lg hover:bg-mint-dark font-semibold">Send</button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-charcoal-light">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;