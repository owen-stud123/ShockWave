import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { profileAPI } from '../services/api';

// A small, reusable component to display the star rating on the card
const MiniStarRating = ({ rating, reviewCount }) => {
  if (!rating) return <div className="h-5"></div>; // Keep height consistent
  return (
    <div className="flex items-center mt-1">
      <span className="text-yellow-400">★</span>
      <span className="ml-1 text-sm font-semibold text-charcoal">
        {parseFloat(rating).toFixed(1)}
      </span>
      <span className="ml-2 text-sm text-charcoal-light">({reviewCount} reviews)</span>
    </div>
  );
};

const Browse = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    skill: '',
    location: '',
    min_rate: '',
    max_rate: ''
  });

  useEffect(() => {
    // This function will be called whenever the filters change.
    // A debounce could be added here in a real application to prevent excessive API calls.
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.searchProfiles(filters);
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Browse Designers</h1>
          <p className="text-charcoal-light text-lg">Find the perfect creative partner for your next project.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-mint/20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name, skill..."
              className="px-4 py-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="skill"
              placeholder="Skill (e.g., logo design)"
              className="px-4 py-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
              value={filters.skill}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="px-4 py-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
              value={filters.location}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="min_rate"
              placeholder="Min rate ($)"
              className="px-4 py-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
              value={filters.min_rate}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="max_rate"
              placeholder="Max rate ($)"
              className="px-4 py-2 border-2 border-lightgray-dark rounded-md focus:ring-mint focus:border-mint"
              value={filters.max_rate}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-charcoal-light text-lg">No designers found matching your criteria.</p>
            </div>
          ) : (
            profiles.map((profile, index) => (
              <motion.div
                key={profile.user_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-mint flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center mb-4">
                    <img 
                      src={profile.avatar_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.avatar_url}` : `https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}&background=DFE6E9&color=2D3436`}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-lightgray"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-charcoal">{profile.name}</h3>
                      <p className="text-charcoal-light text-sm">{profile.location || 'Location not specified'}</p>
                    </div>
                  </div>
                  
                  <p className="text-charcoal mb-4 line-clamp-3 h-20">
                    {profile.bio || 'No bio available. Click to view the full profile for more details.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 h-10">
                    {profile.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-mint/10 text-mint text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="px-3 py-1 bg-lightgray text-charcoal-light text-xs font-semibold rounded-full">
                        +{profile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-lightgray-light p-4 flex justify-between items-center">
                  <div>
                    {profile.hourly_rate && (
                      <p className="text-lg font-bold text-mint">${profile.hourly_rate}/hr</p>
                    )}
                    <MiniStarRating rating={profile.avg_rating} reviewCount={profile.review_count} />
                  </div>
                  <Link to={`/designer/${profile.user_id}`} className="bg-charcoal text-white px-4 py-2 rounded-md hover:bg-charcoal-light transition-colors text-sm font-semibold">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;