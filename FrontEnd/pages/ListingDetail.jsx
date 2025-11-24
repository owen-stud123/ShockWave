import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { listingAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    message: '',
    price_offered: '',
    delivery_time: ''
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await listingAPI.getListing(id);
        setListing(res.data);
        setIsBookmarked(res.data.is_bookmarked || false);
        
        // If owner, fetch proposals
        if (user && res.data.owner_id === user.id) {
          fetchProposals();
        }
      } catch (err) {
        alert('Listing not found or access denied');
        navigate('/listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate, user]);

  const fetchProposals = async () => {
    setLoadingProposals(true);
    try {
      const res = await listingAPI.getProposalsForListing(id);
      setProposals(res.data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoadingProposals(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'designer') {
      return;
    }

    setBookmarking(true);
    try {
      const response = await listingAPI.toggleBookmark(id);
      setIsBookmarked(response.data.isBookmarked);
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setBookmarking(false);
    }
  };

  const handleContact = () => {
    if (!user) {
      alert('Please login to contact the business');
      navigate('/login');
      return;
    }
    
    // Navigate to messages with the business owner pre-selected
    navigate('/messages', {
      state: {
        newConversationWith: {
          id: listing.owner_id,
          name: listing.owner_name
        }
      }
    });
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmittingProposal(true);
    try {
      await listingAPI.submitProposal(id, {
        message: proposalData.message,
        price_offered: parseFloat(proposalData.price_offered),
        delivery_time: parseInt(proposalData.delivery_time)
      });
      alert('Proposal submitted successfully!');
      setShowProposalForm(false);
      setProposalData({ message: '', price_offered: '', delivery_time: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    if (!window.confirm('Accept this proposal and create an order?')) return;
    try {
      // Create order from proposal - backend will mark proposal accepted and create order
      const res = await orderAPI.createOrder({ proposal_id: proposalId });
      const orderId = res.data.orderId;
      // Refresh proposals and navigate to the created order
      fetchProposals();
      if (orderId) {
        navigate(`/order/${orderId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to accept proposal / create order:', err);
      alert(err.response?.data?.error || 'Failed to accept proposal');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    if (!window.confirm('Reject this proposal?')) return;
    try {
      await listingAPI.updateProposalStatus(id, proposalId, 'rejected');
      alert('Proposal rejected');
      fetchProposals();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject proposal');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightgray-light">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user?.id === listing.owner_id;

  return (
    <div className="min-h-screen bg-lightgray-light py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-mint to-mint-dark text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
                <p className="text-lg opacity-90">Posted by {listing.owner_name}</p>
              </div>
              {user?.role === 'designer' && !isOwner && (
                <button
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`p-3 rounded-full transition-all ${
                    isBookmarked 
                      ? 'bg-white text-yellow-500' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } disabled:opacity-50`}
                  title={isBookmarked ? 'Saved' : 'Save project'}
                >
                  <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-yellow-500' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-lightgray-light rounded-lg">
              <div>
                <p className="text-sm text-charcoal-light mb-1">Budget Range</p>
                <p className="text-3xl font-bold text-mint">
                  ${listing.budget_min} - ${listing.budget_max}
                </p>
              </div>
              <div>
                <p className="text-sm text-charcoal-light mb-1">Deadline</p>
                <p className="text-2xl font-semibold text-charcoal">
                  {listing.deadline ? new Date(listing.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not specified'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Project Description</h2>
              <p className="text-charcoal leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Status */}
            <div className="mb-8">
              <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                listing.status === 'open' ? 'bg-green-100 text-green-800' :
                listing.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {listing.status === 'open' ? '🟢 Open for Applications' :
                 listing.status === 'in_progress' ? '🔵 In Progress' :
                 '⚪ Closed'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-lightgray">
              <Link
                to="/listings"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-charcoal font-semibold rounded-lg transition-colors"
              >
                ← Back to Listings
              </Link>
              
              {user?.role === 'designer' && !isOwner && listing.status === 'open' && (
                <>
                  <button
                    onClick={() => setShowProposalForm(!showProposalForm)}
                    className="px-6 py-3 bg-mint hover:bg-mint-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    {showProposalForm ? 'Cancel Proposal' : 'Submit Proposal'}
                  </button>
                  <button
                    onClick={handleContact}
                    className="px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    Message Business
                  </button>
                </>
              )}

              {isOwner && (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-charcoal hover:bg-charcoal-dark text-white font-semibold rounded-lg transition-colors"
                >
                  Back to Dashboard
                </Link>
              )}
            </div>

            {/* Proposals Section for Business Owners */}
            {isOwner && (
              <div className="mt-8 pt-8 border-t border-lightgray">
                <h3 className="text-2xl font-bold text-charcoal mb-4">
                  Proposals Received ({proposals.length})
                </h3>
                {loadingProposals ? (
                  <p className="text-charcoal-light">Loading proposals...</p>
                ) : proposals.length === 0 ? (
                  <p className="text-charcoal-light">No proposals yet. Designers will submit proposals for this project.</p>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => {
                      const pid = proposal.id || proposal._id;
                      const designerName = proposal.designer?.name || proposal.designer_name || 'Designer';
                      const createdAt = proposal.created_at || proposal.createdAt;
                      const status = proposal.status || 'pending';

                      return (
                        <motion.div
                          key={pid}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-white border-2 border-lightgray rounded-lg hover:border-mint transition-colors"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-charcoal">{designerName}</h4>
                              <p className="text-sm text-charcoal-light">
                                Submitted {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-charcoal-light">Offered Price</p>
                              <p className="text-2xl font-bold text-mint">${proposal.price_offered}</p>
                            </div>
                            <div>
                              <p className="text-sm text-charcoal-light">Delivery Time</p>
                              <p className="text-2xl font-bold text-charcoal">{proposal.delivery_time} days</p>
                            </div>
                          </div>

                          <div className="mb-4 p-4 bg-lightgray-light rounded-lg">
                            <p className="text-sm font-semibold text-charcoal mb-2">Proposal Message:</p>
                            <p className="text-charcoal whitespace-pre-wrap">{proposal.message}</p>
                          </div>

                          {status === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleAcceptProposal(pid)}
                                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                              >
                                Accept & Create Order
                              </button>
                              <button
                                onClick={() => handleRejectProposal(pid)}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Proposal Form */}
            {showProposalForm && user?.role === 'designer' && !isOwner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 p-6 bg-lightgray-light rounded-lg border-2 border-mint"
              >
                <h3 className="text-2xl font-bold text-charcoal mb-4">Submit Your Proposal</h3>
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Your Message / Pitch
                    </label>
                    <textarea
                      value={proposalData.message}
                      onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                      rows="5"
                      placeholder="Explain why you're the best fit for this project..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Price You're Offering ($)
                      </label>
                      <input
                        type="number"
                        value={proposalData.price_offered}
                        onChange={(e) => setProposalData({ ...proposalData, price_offered: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                        placeholder="e.g., 2000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Delivery Time (days)
                      </label>
                      <input
                        type="number"
                        value={proposalData.delivery_time}
                        onChange={(e) => setProposalData({ ...proposalData, delivery_time: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                        placeholder="e.g., 14"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="w-full px-6 py-3 bg-mint hover:bg-mint-dark text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListingDetail;