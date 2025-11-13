import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State for data
  const [listing, setListing] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the proposal form
  const [proposalForm, setProposalForm] = useState({ message: '', price_offered: '', delivery_time: '' });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for review simulation
  const [isProjectComplete, setIsProjectComplete] = useState(false); 
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);

  useEffect(() => {
    const fetchListingData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await listingAPI.getListing(id);
        setListing(res.data);

        // If the logged-in user is the owner of this listing, fetch proposals.
        if (isAuthenticated && user?.id === res.data.owner_id) {
          const proposalsRes = await listingAPI.getProposalsForListing(id);
          setProposals(proposalsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch listing data:', error);
        if (error.response?.status === 404) navigate('/404'); // Or a "not found" page
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
  }, [id, user, isAuthenticated, navigate]);

  const handleProposalChange = (e) => {
    setProposalForm({ ...proposalForm, [e.target.name]: e.target.value });
  };
  
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await listingAPI.submitProposal(id, proposalForm);
      alert('Proposal submitted successfully!');
      navigate('/listings');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to submit proposal.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmitted = () => {
    alert("Thank you for your review!");
    setHasAlreadyReviewed(true);
  };

  const handleAcceptProposal = (proposalId) => {
    // In a real app, this would trigger a backend endpoint.
    alert(`(Simulated) Accepting proposal ID: ${proposalId}. This will create an order and notify the designer.`);
    // Example: await orderAPI.createFromProposal(proposalId);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div></div>;
  }
  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center"><h2 className="text-2xl font-bold text-charcoal">Listing not found.</h2></div>;
  }

  const isOwner = isAuthenticated && user?.id === listing.owner_id;
  const showReviewForm = isOwner && isProjectComplete && !hasAlreadyReviewed;
  const showProposalForm = isAuthenticated && user.role === 'designer' && !isOwner;
  const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-lightgray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isOwner && (
            <div className="mb-4 bg-yellow-100 p-4 rounded-lg text-yellow-800 border border-yellow-300">
            <p className="font-bold">Developer Simulation Panel</p>
            <label className="flex items-center mt-2 cursor-pointer">
                <input type="checkbox" checked={isProjectComplete} onChange={() => setIsProjectComplete(!isProjectComplete)} />
                <span className="ml-2 text-sm">Simulate "Project Complete" to show review form.</span>
            </label>
            </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-4xl font-bold text-charcoal">{listing.title}</h1>
            <p className="text-charcoal-light mt-2">Posted by {listing.owner_name}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Project Description</h2>
              <p className="text-charcoal leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-lightgray-light p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-charcoal mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-charcoal-light">Budget</p>
                    <p className="font-semibold text-mint text-lg">${listing.budget_min} - ${listing.budget_max}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal-light">Deadline</p>
                    <p className="font-semibold">{listing.deadline ? new Date(listing.deadline).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {isOwner && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-6">Received Proposals ({proposals.length})</h2>
            <div className="space-y-6">
              {proposals.length > 0 ? (
                proposals.map(proposal => (
                  <div key={proposal.id} className="border border-lightgray rounded-lg p-4 transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={proposal.designer_avatar ? `${SERVER_BASE_URL}${proposal.designer_avatar}` : `https://ui-avatars.com/api/?name=${proposal.designer_name.replace(' ', '+')}`}
                          alt={proposal.designer_name}
                          className="w-12 h-12 rounded-full object-cover bg-lightgray"
                        />
                        <div>
                          <Link to={`/designer/${proposal.designer_id}`} className="font-bold text-charcoal hover:underline">{proposal.designer_name}</Link>
                          <p className="text-sm text-charcoal-light">{new Date(proposal.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="font-bold text-lg text-mint">${proposal.price_offered}</p>
                        <p className="text-sm text-charcoal-light">{proposal.delivery_time} days delivery</p>
                      </div>
                    </div>
                    <p className="mt-4 text-charcoal-light bg-lightgray-light p-3 rounded-md">{proposal.message}</p>
                    <div className="mt-4 flex justify-end gap-3">
                      <button className="bg-charcoal text-white px-4 py-2 rounded-md hover:bg-charcoal-light transition-colors font-semibold text-sm">Message</button>
                      <button 
                        onClick={() => handleAcceptProposal(proposal.id)}
                        className="bg-mint text-white px-4 py-2 rounded-md hover:bg-mint-dark transition-colors font-semibold text-sm"
                      >
                        Accept Proposal
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-charcoal-light">You have not received any proposals for this project yet.</p>
              )}
            </div>
          </motion.div>
        )}
        
        {showProposalForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-6">Submit a Proposal</h2>
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              {submitError && <div className="text-red-500 bg-red-100 p-3 rounded-md">{submitError}</div>}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">Your Message</label>
                <textarea id="message" name="message" rows="5" required value={proposalForm.message} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="Introduce yourself and explain why you're a great fit for this project..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_offered" className="block text-sm font-medium text-charcoal mb-1">Your Price ($)</label>
                  <input id="price_offered" name="price_offered" type="number" required value={proposalForm.price_offered} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="e.g., 1200" />
                </div>
                <div>
                  <label htmlFor="delivery_time" className="block text-sm font-medium text-charcoal mb-1">Delivery Time (days)</label>
                  <input id="delivery_time" name="delivery_time" type="number" required value={proposalForm.delivery_time} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="e.g., 14" />
                </div>
              </div>
              <div className="text-right">
                <button type="submit" disabled={isSubmitting} className="bg-mint text-white px-6 py-2 rounded-md hover:bg-mint-dark transition-colors disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</button>
              </div>
            </form>
          </motion.div>
        )}
        
        {showReviewForm && (
          <ReviewForm 
            orderId={1}
            revieweeId={1}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default ListingDetail;