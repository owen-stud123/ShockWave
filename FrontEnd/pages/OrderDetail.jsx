import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderAPI, reviewAPI, invoiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { motion } from 'framer-motion';

const OrderDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [progressUpdate, setProgressUpdate] = useState('');
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

    const fetchOrderData = useCallback(async () => {
        try {
            const orderRes = await orderAPI.getOrder(id);
            setOrder(orderRes.data);

            if (orderRes.data.status === 'completed') {
                const reviewRes = await reviewAPI.getReviewsForUser(orderRes.data.seller._id);
                const buyerReviews = await reviewAPI.getReviewsForUser(orderRes.data.buyer._id);
                const allReviews = [...reviewRes.data, ...buyerReviews.data];
                const orderReviews = allReviews.filter(r => r.order_id === id);
                setReviews(orderReviews);
                setHasUserReviewed(orderReviews.some(r => r.reviewer_id === user.id));
            }
        } catch (error) {
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, navigate, user.id]);

    useEffect(() => {
        fetchOrderData();
    }, [fetchOrderData]);

    const handleStatusUpdate = async (status) => {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="font-semibold mb-2">Mark this order as {status}?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        if (!confirmed) return;
        try {
            const res = await orderAPI.updateOrderStatus(id, status);
            setOrder(prev => ({ ...prev, ...res.data.order }));
            toast.success(`Order marked as ${status}`);
        } catch (error) {
            toast.error(`Failed to update status: ${error.response?.data?.error || 'Server error'}`);
        }
    };

    const handleCreateInvoice = async () => {
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="font-semibold mb-2">Generate a formal invoice for this completed project?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Create Invoice
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        if (!confirmed) return;
        try {
            await invoiceAPI.createInvoice({ order_id: id });
            toast.success("Invoice created successfully!");
            navigate('/invoices');
        } catch (error) {
             toast.error(`Failed to create invoice: ${error.response?.data?.error || 'Server error'}`);
        }
    };

    const handlePostUpdate = async (e) => {
        e.preventDefault();
        if (progressUpdate.trim() === '') return;
        setIsSubmittingUpdate(true);
        try {
            const res = await orderAPI.postProgressUpdate(id, { message: progressUpdate });
            setOrder(prev => ({
                ...prev,
                progress_updates: [...prev.progress_updates, res.data.update]
            }));
            setProgressUpdate('');
            toast.success('Progress update posted successfully');
        } catch (error) {
            toast.error(`Failed to post update: ${error.response?.data?.error || 'Server error'}`);
        } finally {
            setIsSubmittingUpdate(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center">Order not found.</div>;

    const isDesigner = user.id === order.seller._id;
    const isBusiness = user.id === order.buyer._id;
    const revieweeId = isDesigner ? order.buyer._id : order.seller._id;
    const showReviewForm = order.status === 'completed' && !hasUserReviewed;
    
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <h1 className="text-3xl font-bold mb-2">{order.listing.title}</h1>
                <p className="text-gray-500 mb-6">Order ID: #{order.id.slice(-8)}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <h2 className="font-bold text-lg mb-2">Project Details</h2>
                        <p><strong>Seller (Designer):</strong> {order.seller.name}</p>
                        <p><strong>Buyer (Business):</strong> {order.buyer.name}</p>
                        <p><strong>Amount:</strong> <span className="font-bold text-mint">${order.amount.toFixed(2)}</span></p>
                        <p><strong>Status:</strong> <span className="font-semibold capitalize">{order.status.replace('_', ' ')}</span></p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="font-bold text-lg mb-2">Actions</h2>
                        {isDesigner && order.status === 'in_progress' && <button onClick={() => handleStatusUpdate('delivered')} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Mark as Delivered</button>}
                        {isBusiness && order.status === 'delivered' && <button onClick={() => handleStatusUpdate('completed')} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Accept Delivery & Mark Complete</button>}
                        {isDesigner && order.status === 'completed' && <button onClick={handleCreateInvoice} className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600">Create Invoice</button>}
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.1 }} className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Project Progress</h2>
                <div className="space-y-6">
                    {order.progress_updates.map(update => (
                        <div key={update._id} className="flex gap-4"><div className="flex flex-col items-center"><span className="w-3 h-3 bg-mint rounded-full mt-1"></span><div className="w-px flex-grow bg-gray-200"></div></div><div><p className="text-sm text-gray-500">{new Date(update.created_at).toLocaleString()}</p><p className="font-semibold">{update.author.name} posted:</p><div className="mt-1 p-3 bg-gray-100 rounded-md">{update.message}</div></div></div>
                    ))}
                </div>
                {isDesigner && (order.status === 'in_progress' || order.status === 'delivered') && (
                    <form onSubmit={handlePostUpdate} className="mt-6 pt-6 border-t"><h3 className="text-lg font-semibold mb-2">Post a New Update</h3><textarea value={progressUpdate} onChange={(e) => setProgressUpdate(e.target.value)} placeholder="Share your progress..." className="w-full p-2 border rounded-md" rows="4" required /><button type="submit" disabled={isSubmittingUpdate} className="mt-2 bg-mint text-white px-4 py-2 rounded-md disabled:opacity-50">{isSubmittingUpdate ? 'Posting...' : 'Post Update'}</button></form>
                )}
            </motion.div>

            {order.status === 'completed' && (
                <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.2 }} className="bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    {reviews.length > 0 ? reviews.map(r => <div key={r.id} className="border-t py-2"><p><strong>{r.reviewer_name}:</strong> {r.comment} ({r.rating} stars)</p></div>) : <p>No reviews yet.</p>}
                    {showReviewForm && <ReviewForm orderId={id} revieweeId={revieweeId} onReviewSubmitted={fetchOrderData} />}
                </motion.div>
            )}
        </div>
    );
};

export default OrderDetail;