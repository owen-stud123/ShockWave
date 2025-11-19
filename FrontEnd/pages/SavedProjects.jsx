import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { motion } from 'framer-motion';

const SavedProjects = () => {
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedProjects = async () => {
            try {
                const res = await listingAPI.getBookmarkedListings();
                setSavedProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch saved projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedProjects();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading your saved projects...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Projects</h1>
            <div className="space-y-6">
                {savedProjects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-charcoal">You haven't saved any projects yet.</h3>
                        <p className="text-charcoal-light mt-2">
                            Click the bookmark icon on a project to save it for later.
                        </p>
                        <Link to="/listings" className="mt-4 inline-block bg-mint text-white px-6 py-2 rounded-md">Browse Projects</Link>
                    </div>
                ) : (
                    savedProjects.map((listing, index) => (
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
                                        <p className="text-sm text-charcoal-light mt-1">Posted by {listing.owner?.name || 'N/A'}</p>
                                    </div>
                                    <div className="mt-4 sm:mt-0 text-left sm:text-right">
                                        <p className="text-lg font-bold text-mint">${listing.budget_min} - ${listing.budget_max}</p>
                                        <p className="text-sm text-charcoal-light">Budget</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-charcoal line-clamp-2">{listing.description}</p>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedProjects;