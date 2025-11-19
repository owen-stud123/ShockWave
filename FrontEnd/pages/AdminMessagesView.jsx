import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminMessagesView = () => {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchThreads = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getAllMessageThreads();
            setThreads(res.data);
        } catch (err) {
            setError("Failed to fetch message threads.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const handleThreadClick = async (thread) => {
        setActiveThread(thread);
        setMessages([]); // Clear previous messages
        try {
            const res = await adminAPI.getMessagesForModeration(thread.thread_id);
            setMessages(res.data);
        } catch (err) {
            setError(`Failed to fetch messages for thread ${thread.thread_id}.`);
            console.error(err);
        }
    };

    const handleToggleFlag = async () => {
        if (!activeThread) return;
        try {
            const res = await adminAPI.toggleFlagThread(activeThread.thread_id);
            // Update the flag status in the UI immediately
            const updatedThread = { ...activeThread, is_flagged: res.data.is_flagged };
            setActiveThread(updatedThread);
            setThreads(prevThreads => prevThreads.map(t => 
                t.thread_id === activeThread.thread_id ? updatedThread : t
            ));
        } catch (error) {
            alert('Failed to update flag status.');
        }
    };

    if (loading) return <p>Loading message threads...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg shadow-lg border overflow-hidden">
            {/* Left Panel: Conversation Threads */}
            <div className="w-full md:w-1/3 border-r flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">All Conversations</h2>
                </div>
                <div className="overflow-y-auto">
                    {threads.map(thread => (
                        <div key={thread.thread_id} onClick={() => handleThreadClick(thread)} className={`p-4 cursor-pointer hover:bg-gray-100 border-b ${activeThread?.thread_id === thread.thread_id ? 'bg-blue-50' : ''} ${thread.is_flagged ? 'border-l-4 border-red-500 pl-3' : ''}`}>
                            <p className="font-semibold text-sm">{thread.participants.map(p => p.name).join(' & ')}</p>
                            <p className="text-sm text-gray-600 truncate">{thread.last_message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(thread.last_message_date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Right Panel: Active Chat */}
            <div className="hidden md:flex w-2/3 flex-col">
                {activeThread ? (
                    <>
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{activeThread.participants.map(p => p.name).join(' & ')}</h2>
                            <button onClick={handleToggleFlag} className={`px-3 py-1 text-sm font-semibold rounded ${activeThread.is_flagged ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>
                                {activeThread.is_flagged ? 'Unflag Thread' : 'Flag Thread'}
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                            {messages.map(msg => (
                                <div key={msg._id} className="mb-4">
                                    <p className="font-bold">{msg.sender.name} <span className="text-xs text-gray-500">({msg.sender.role})</span></p>
                                    <div className="p-3 bg-white rounded-lg shadow-sm whitespace-pre-wrap">{msg.body}</div>
                                    <p className="text-xs text-gray-400 text-right mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to view its content.</div>}
            </div>
        </div>
    );
};

export default AdminMessagesView;