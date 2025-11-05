import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, uploadAPI } from '../services/api';
import { motion } from 'framer-motion';

const ProfileEdit = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    location: '',
    hourly_rate: ''
  });

  // State for file handling
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch existing profile data when the component loads
  useEffect(() => {
    if (!authLoading && user) {
      const fetchProfile = async () => {
        try {
          const res = await profileAPI.getProfile(user.id);
          setFormData({
            bio: res.data.bio || '',
            skills: (res.data.skills || []).join(', '), // Convert array to comma-separated string for the input
            location: res.data.location || '',
            hourly_rate: res.data.hourly_rate || ''
          });
          if (res.data.avatar_url) {
            setAvatarPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${res.data.avatar_url}`);
          }
        } catch (err) {
          console.error('Failed to fetch profile', err);
          setError('Could not load your profile data.');
        } finally {
          setPageLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, authLoading]);

  // Handle changes to form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection for the avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Step 1: Upload avatar if a new one is selected
      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('avatar', avatarFile);
        await uploadAPI.uploadAvatar(uploadFormData);
      }
      
      // Step 2: Update the rest of the profile data
      const profileData = {
        ...formData,
        // Convert the comma-separated string back to an array for the backend
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      };
      await profileAPI.updateProfile(user.id, profileData);
      
      alert("Profile updated successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update profile', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (pageLoading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-lightgray-light py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
            
            {/* Avatar Upload Section */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <img 
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=00CEC9&color=fff`} 
                  alt="Avatar Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-lightgray"
                />
                <input 
                  type="file" 
                  id="avatar" 
                  name="avatar" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mint/10 file:text-mint hover:file:bg-mint/20 cursor-pointer"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-charcoal mb-2">Bio</label>
              <textarea id="bio" name="bio" rows="4" className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="Tell everyone a little about yourself" value={formData.bio} onChange={handleChange}></textarea>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-charcoal mb-2">Skills (comma separated)</label>
              <input id="skills" name="skills" type="text" className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., Logo Design, Branding, UI/UX" value={formData.skills} onChange={handleChange} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-charcoal mb-2">Location</label>
                <input id="location" name="location" type="text" className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., New York, USA" value={formData.location} onChange={handleChange} />
              </div>
              {/* Hourly Rate (Only for Designers) */}
              {user.role === 'designer' && (
                <div>
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-charcoal mb-2">Hourly Rate ($)</label>
                  <input id="hourly_rate" name="hourly_rate" type="number" step="0.01" className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="e.g., 50" value={formData.hourly_rate} onChange={handleChange} />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg text-charcoal bg-lightgray hover:bg-lightgray-dark">Cancel</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg text-white bg-mint hover:bg-mint-dark disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileEdit;