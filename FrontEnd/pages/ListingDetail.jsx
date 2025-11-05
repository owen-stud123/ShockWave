import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm'; // Import the new component

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState({ message: '', price_offered: '', delivery_time: '' });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- SIMULATION STATE ---
  // In a real app, this data would come from the order's status and participants.
  const [isProjectComplete, setIsProjectComplete] = useState(false); 
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingAPI.getListing(id);
        setListing(response.data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);
  
  const handleProposalChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await listingAPI.submitProposal(id, proposal);
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
    setHasAlreadyReviewed(true); // Hide the form after submission
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!listing) {
    return <div className="min-h-screen flex items-center justify-center"><h2>Listing not found</h2></div>;
  }

  // Determine if the review form should be shown.
  // This logic is for simulation. A real app would check if the user was the buyer of this project's completed order.
  const showReviewForm = isAuthenticated && isProjectComplete && !hasAlreadyReviewed && user.id === 2; // Simulating user 2 (business) is the buyer

  return (
    <div className="min-h-screen bg-lightgray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- SIMULATION TOGGLE --- */}
        <div className="mb-4 bg-yellow-100 p-4 rounded-lg text-yellow-800 border border-yellow-300">
          <p className="font-bold">Developer Simulation Panel</p>
          <p className="text-sm">This panel helps test features before the full order system is built.</p>
          <label className="flex items-center mt-2 cursor-pointer">
            <input type="checkbox" checked={isProjectComplete} onChange={() => setIsProjectComplete(!isProjectComplete)} />
            <span className="ml-2 text-sm">Simulate "Project Complete" state to show the review form (for business user).</span>
          </label>
        </div>

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
        
        {isAuthenticated && user.role === 'designer' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-6">Submit a Proposal</h2>
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              {submitError && <div className="text-red-500 bg-red-100 p-3 rounded-md">{submitError}</div>}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">Your Message</label>
                <textarea id="message" name="message" rows="5" required value={proposal.message} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="Introduce yourself and explain why you're a great fit for this project..."></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_offered" className="block text-sm font-medium text-charcoal mb-1">Your Price ($)</label>
                  <input id="price_offered" name="price_offered" type="number" required value={proposal.price_offered} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="e.g., 1200" />
                </div>
                <div>
                  <label htmlFor="delivery_time" className="block text-sm font-medium text-charcoal mb-1">Delivery Time (days)</label>
                  <input id="delivery_time" name="delivery_time" type="number" required value={proposal.delivery_time} onChange={handleProposalChange} className="w-full p-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint" placeholder="e.g., 14" />
                </div>
              </div>
              <div className="text-right">
                <button type="submit" disabled={isSubmitting} className="bg-mint text-white px-6 py-2 rounded-md hover:bg-mint-dark transition-colors disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* --- REVIEW FORM SECTION --- */}
        {showReviewForm && (
          <ReviewForm 
            orderId={1} // Placeholder - this would be the actual order ID from the completed project
            revieweeId={1} // Placeholder - this is the designer's ID we are reviewing
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default ListingDetail;