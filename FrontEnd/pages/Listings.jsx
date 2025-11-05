import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listingAPI } from '../services/api';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingAPI.getListings();
        setListings(response.data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightgray-light">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightgray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Find Work</h1>
            <p className="text-charcoal-light mt-1">Browse and apply to the latest design projects.</p>
          </div>
        </div>

        <div className="space-y-6">
          {listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-charcoal">No Open Projects</h3>
              <p className="text-charcoal-light mt-2">Check back later for new opportunities!</p>
            </div>
          ) : (
            listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/listing/${listing.id}`} className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-mint">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-charcoal hover:text-mint">{listing.title}</h2>
                      <p className="text-sm text-charcoal-light mt-1">Posted by {listing.owner_name}</p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                      <p className="text-lg font-bold text-mint">${listing.budget_min} - ${listing.budget_max}</p>
                      <p className="text-sm text-charcoal-light">Budget</p>
                    </div>
                  </div>
                  <p className="mt-4 text-charcoal line-clamp-2">{listing.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-charcoal-light">
                    <span>Deadline: {listing.deadline ? new Date(listing.deadline).toLocaleDateString() : 'Not specified'}</span>
                    <span className="text-mint font-semibold">View Details &rarr;</span>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;