import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, uploadAPI } from '../services/api'; // Import uploadAPI
import { motion } from 'framer-motion';

const ProfileEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    location: '',
    hourly_rate: ''
  });
  const [avatarFile, setAvatarFile] = useState(null); // State for the avatar file
  const [avatarPreview, setAvatarPreview] = useState(''); // State for the image preview
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      const fetchProfile = async () => {
        try {
          const res = await profileAPI.getProfile(user.id);
          setFormData({
            bio: res.data.bio || '',
            skills: (res.data.skills || []).join(', '),
            location: res.data.location || '',
            hourly_rate: res.data.hourly_rate || ''
          });
          if (res.data.avatar_url) {
            setAvatarPreview((import.meta.env.VITE_API_URL || 'http://localhost:5000') + res.data.avatar_url);
          }
        } catch (err) {
          console.error('Failed to fetch profile', err);
          setError('Could not load your profile data.');
        }
      };
      fetchProfile();
    }
  }, [user, loading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      };
      await profileAPI.updateProfile(user.id, profileData);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-lightgray-light py-12 px-4 sm:px-6 lg:px-8">
      <motion.div /* ... */ >
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Edit Your Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
            
            {/* Avatar Upload Section */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <img 
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name}&background=00CEC9&color=fff`} 
                  alt="Avatar Preview" 
                  className="w-20 h-20 rounded-full object-cover"
                />
                <input 
                  type="file" 
                  id="avatar" 
                  name="avatar" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mint/10 file:text-mint hover:file:bg-mint/20"
                />
              </div>
            </div>

            {/* Rest of the form */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-charcoal mb-2">Bio</label>
              <textarea id="bio" name="bio" rows="4" className="w-full ..." value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-charcoal mb-2">Skills (comma separated)</label>
              <input id="skills" name="skills" type="text" className="w-full ..." value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-charcoal mb-2">Location</label>
                <input id="location" name="location" type="text" className="w-full ..." value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              {user.role === 'designer' && (
                <div>
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-charcoal mb-2">Hourly Rate ($)</label>
                  <input id="hourly_rate" name="hourly_rate" type="number" step="0.01" className="w-full ..." value={formData.hourly_rate} onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})} />
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