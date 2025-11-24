import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false, // Do not connect automatically
  transports: ['polling', 'websocket'],
  withCredentials: true
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
      socket.connect();
      socket.emit('join_room', user.id);

      const handleReceiveMessage = (message) => {
        // If the message belongs to the currently active chat
        if (activeThread && (message.thread_id === activeThread.thread_id || 
            message.sender_id === activeThread.participant_id || 
            message.recipient_id === activeThread.participant_id)) {
          
          setMessages((prev) => {
            // Remove optimistic message if it exists (sent by this user)
            const withoutOptimistic = prev.filter(msg => !msg.isOptimistic);
            
            // Check if this message already exists (avoid duplicates)
            const messageExists = withoutOptimistic.some(msg => 
              msg._id === message._id || msg.id === message._id
            );
            
            if (messageExists) {
              return prev;
            }
            
            // Add the real message from server
            return [...withoutOptimistic, message];
          });
        }
        
        // Always refresh the thread list to show the new "last message" and reorder
        fetchThreads();
      };
      socket.on('receive_message', handleReceiveMessage);

      // Initial data load and handling of "new conversation" state
      const initialize = async () => {
        const allThreads = await fetchThreads();
        const newConversationUser = location.state?.newConversationWith;

        if (newConversationUser) {
          // Find if a thread already exists with this user
          const existingThread = allThreads.find(t => t.participant_id === newConversationUser.id);
          if (existingThread) {
            handleThreadClick(existingThread);
          } else {
            // Create a temporary placeholder thread to start the conversation
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
          // Clear the location state to prevent re-triggering
          navigate(location.pathname, { replace: true, state: {} });
        } else if (allThreads.length > 0 && !activeThread) {
            // Select the first thread by default
            handleThreadClick(allThreads[0]);
        }
      };
      initialize();
      
      return () => {
        socket.off('receive_message', handleReceiveMessage);
        socket.disconnect();
      };
    }
  }, [user, location.state]);

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
      const res = await messageAPI.getMessages(thread.thread_id);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeThread) return;
    
    const messageContent = newMessage.trim();
    const threadId = activeThread.thread_id || `${user.id}_${activeThread.participant_id}`;
    
    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      _id: `temp_${Date.now()}`, // Temporary ID
      sender_id: user.id,
      recipient_id: activeThread.participant_id,
      content: messageContent,
      thread_id: threadId,
      created_at: new Date().toISOString(),
      isOptimistic: true // Flag to identify optimistic messages
    };
    
    // Optimistically add message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Update the thread list to show this as the last message
    setThreads(prevThreads => {
      const updatedThreads = prevThreads.map(thread => {
        if (thread.thread_id === threadId || thread.participant_id === activeThread.participant_id) {
          return {
            ...thread,
            last_message: messageContent,
            thread_id: threadId,
            isPlaceholder: false
          };
        }
        return thread;
      });
      
      // If no existing thread found (new conversation), add it
      const threadExists = updatedThreads.some(t => 
        t.thread_id === threadId || t.participant_id === activeThread.participant_id
      );
      
      if (!threadExists) {
        updatedThreads.unshift({
          thread_id: threadId,
          participant_id: activeThread.participant_id,
          participant_name: activeThread.participant_name,
          last_message: messageContent
        });
      }
      
      return updatedThreads;
    });
    
    // Clear input immediately for better UX
    setNewMessage('');
    
    // Send to server (server will send back confirmation)
    socket.emit('send_message', {
      sender_id: user.id,
      recipient_id: activeThread.participant_id,
      content: messageContent,
      thread_id: threadId
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading conversations...</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white max-w-7xl mx-auto my-8 rounded-lg shadow-lg border-2 border-mint/20 overflow-hidden">
      {/* Left Panel: Conversation Threads */}
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
                <li 
                  key={thread.thread_id} 
                  onClick={() => handleThreadClick(thread)} 
                  className={`p-4 cursor-pointer hover:bg-lightgray-light border-b border-lightgray transition-colors ${activeThread?.thread_id === thread.thread_id ? 'bg-mint/10 border-l-4 border-l-mint' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white font-bold flex-shrink-0">
                      {thread.participant_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal truncate">{thread.participant_name}</p>
                      <p className="text-xs text-charcoal-light">{thread.participant_role || 'User'}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Right Panel: Active Chat */}
      <div className="w-2/3 flex flex-col bg-lightgray-light">
        {activeThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b-2 border-lightgray bg-white flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white font-bold text-lg">
                {activeThread.participant_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal">{activeThread.participant_name}</h2>
                <p className="text-xs text-charcoal-light">{activeThread.participant_role || 'User'}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => {
                const senderId = msg.sender_id || msg.sender?.id;
                const isOwnMessage = senderId === user.id;
                const prevSenderId = index > 0 ? (messages[index - 1].sender_id || messages[index - 1].sender?.id) : null;
                const nextSenderId = index < messages.length - 1 ? (messages[index + 1].sender_id || messages[index + 1].sender?.id) : null;
                const showAvatar = index === 0 || prevSenderId !== senderId;
                const showTimestamp = index === messages.length - 1 || nextSenderId !== senderId;
                
                return (
                  <div key={msg.id || msg._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {/* Left Avatar (for other user) */}
                    {!isOwnMessage && (
                      <div className={`w-8 h-8 rounded-full bg-mint flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        {activeThread.participant_name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-md`}>
                      <div className={`px-4 py-2 rounded-2xl shadow-sm ${isOwnMessage ? 'bg-mint text-white rounded-br-sm' : 'bg-white text-charcoal rounded-bl-sm'}`}>
                        <p className="text-sm leading-relaxed">{msg.body || msg.content}</p>
                      </div>
                      {showTimestamp && (
                        <span className="text-xs text-charcoal-light mt-1 px-2">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {/* Right Avatar (for own messages) */}
                    {isOwnMessage && (
                      <div className={`w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div className="p-4 bg-white border-t-2 border-lightgray">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder={`Message ${activeThread.participant_name}...`}
                  className="flex-1 px-4 py-3 border-2 border-lightgray-dark rounded-full focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-mint text-white rounded-full hover:bg-mint-dark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-charcoal-light text-center">
            <p className="text-lg">Select a conversation to start chatting,<br />or contact a designer from their profile page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;