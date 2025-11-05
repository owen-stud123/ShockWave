import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingAPI } from '../services/api';

const CreateListing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await listingAPI.createListing(formData);
      navigate('/listings');
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed to create listing.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lightgray-light py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Post a New Project</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-2">Project Title</label>
              <input id="title" name="title" type="text" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., Logo for a new coffee shop" />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">Project Description</label>
              <textarea id="description" name="description" rows="5" required value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="Describe the project requirements in detail..."></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget_min" className="block text-sm font-medium text-charcoal mb-2">Minimum Budget ($)</label>
                <input id="budget_min" name="budget_min" type="number" required value={formData.budget_min} onChange={handleChange} className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., 500" />
              </div>
              <div>
                <label htmlFor="budget_max" className="block text-sm font-medium text-charcoal mb-2">Maximum Budget ($)</label>
                <input id="budget_max" name="budget_max" type="number" required value={formData.budget_max} onChange={handleChange} className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., 1500" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg text-charcoal bg-lightgray hover:bg-lightgray-dark">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg text-white bg-mint hover:bg-mint-dark disabled:opacity-50">{isLoading ? 'Submitting...' : 'Post Project'}</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateListing;