import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import { profileAPI, reviewAPI } from '../services/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// ... (StarRating component remains the same)
const StarRating = ({ rating, reviewCount }) => { /* ... */ };

const Profile = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth(); // Get current user info
  const navigate = useNavigate(); // Hook for navigation
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (useEffect for fetching profile data remains the same)
  }, [id]);

  const handleContact = () => {
    // Navigate to the messages page and pass the profile owner's info
    navigate('/messages', { 
      state: { 
        newConversationWith: {
          id: profile.user_id,
          name: profile.name,
        } 
      } 
    });
  };

  if (loading) { /* ... */ }
  if (!profile) { /* ... */ }

  // Determine if the contact button should be shown
  const showContactButton = isAuthenticated && user.role === 'business' && user.id !== profile.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div /* ... */ >
        {/* ... (Header and Main Content sections remain the same) ... */}
        
        {/* We will modify the Sidebar section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* ... (About Me and Reviews sections) ... */}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Info</h3>
                
                {profile.hourly_rate && (
                  <div className="mb-4">
                    <p className="text-sm text-charcoal-light">Hourly Rate</p>
                    <p className="text-2xl font-bold text-mint">${profile.hourly_rate}/hr</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-charcoal-light">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.user_created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* --- CONTACT BUTTON ADDED HERE --- */}
                {showContactButton && (
                  <button 
                    onClick={handleContact}
                    className="w-full bg-mint text-white py-3 px-4 rounded-md hover:bg-mint-dark transition-colors font-semibold"
                  >
                    Contact Designer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;