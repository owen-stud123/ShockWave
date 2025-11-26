import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { profileAPI, reviewAPI } from '../services/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const StarRating = ({ rating, reviewCount }) => {
  if (!rating) return <div className="text-sm text-charcoal-light">No reviews yet</div>;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <span key={`full_${i}`} className="text-yellow-400 text-xl">★</span>)}
      {halfStar && <span className="text-yellow-400 text-xl">☆</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty_${i}`} className="text-gray-300 text-xl">★</span>)}
      {reviewCount > 0 && <span className="ml-2 text-charcoal-light text-sm">({reviewCount} reviews)</span>}
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileRes, reviewsRes] = await Promise.all([
          profileAPI.getProfile(id),
          reviewAPI.getReviewsForUser(id)
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  const handleContact = () => {
    navigate('/messages', { 
      state: { 
        newConversationWith: {
          id: profile.user_id,
          name: profile.name,
        } 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-charcoal">Designer profile not found.</h2>
      </div>
    );
  }

  const SERVER_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const avatarUrl = profile.avatar_url 
    ? (profile.avatar_url.startsWith('http') ? profile.avatar_url : `${SERVER_BASE_URL}${profile.avatar_url}`)
    : `https://ui-avatars.com/api/?name=${profile.name.replace(' ', '+')}`;
  const showContactButton = isAuthenticated && user?.role === 'business' && user?.id !== profile.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-charcoal to-charcoal-light p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src={avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-4 border-mint bg-white"/>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-xl capitalize text-lightgray">{profile.role}</p>
              <div className="mt-2"><StarRating rating={profile.avg_rating} reviewCount={profile.review_count} /></div>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-charcoal mb-4">About Me</h2>
                <p className="text-charcoal-light leading-relaxed">{profile.bio || 'No bio available.'}</p>
              </section>

              {profile.role === 'designer' && (
                  <section className="mb-8">
                      <h2 className="text-2xl font-bold text-charcoal mb-4">Portfolio</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.portfolio_items?.length > 0 ? (
                              profile.portfolio_items.map(item => {
                                  const fileUrl = item.file_url.startsWith('http') ? item.file_url : `${SERVER_BASE_URL}${item.file_url}`;
                                  return (
                                  <a href={fileUrl} target="_blank" rel="noreferrer" key={item._id} className="border rounded-lg p-4 hover:shadow-md hover:border-mint">
                                      <p className="font-bold">{item.title}</p>
                                      <p className="text-sm text-gray-600">{item.description}</p>
                                      <p className="text-xs text-mint mt-2 uppercase">View {item.file_type}</p>
                                  </a>
                                  );
                              })
                          ) : (
                              <p className="text-charcoal-light">No portfolio items have been uploaded yet.</p>
                          )}
                      </div>
                  </section>
              )}

              <section>
                <h2 className="text-2xl font-bold text-charcoal mb-4">Reviews</h2>
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review.id} className="border-b border-lightgray pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <StarRating rating={review.rating} />
                          <p className="ml-auto text-sm text-charcoal-light">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-charcoal">{review.comment}</p>
                        <p className="text-sm font-semibold text-charcoal-light mt-2">- {review.reviewer_name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-charcoal-light">This user has not received any reviews yet.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-lightgray-light p-6 rounded-lg sticky top-24">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Info</h3>
                
                {profile.hourly_rate && (
                  <div className="mb-4">
                    <p className="text-sm text-charcoal-light">Hourly Rate</p>
                    <p className="text-2xl font-bold text-mint">${profile.hourly_rate}/hr</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-sm text-charcoal-light">Member Since</p>
                  <p className="font-medium">{new Date(profile.user_created_at).toLocaleDateString()}</p>
                </div>

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