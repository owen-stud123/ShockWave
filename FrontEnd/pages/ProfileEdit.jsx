import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI, uploadAPI } from '../services/api';
import { motion } from 'framer-motion';

const ProfileEdit = () => {
  const { user, checkAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ bio: '', skills: '', location: '', hourly_rate: '' });
  const [portfolioItems, setPortfolioItems] = useState([]);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [portfolioFile, setPortfolioFile] = useState(null);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await profileAPI.getProfile(user.id);
      setFormData({
        bio: res.data.bio || '',
        skills: (res.data.skills || []).join(', '),
        location: res.data.location || '',
        hourly_rate: res.data.hourly_rate || ''
      });
      setPortfolioItems(res.data.portfolio_items || []);
      if (res.data.avatar_url) {
        setAvatarPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${res.data.avatar_url}`);
      }
    } catch (err) {
      setError('Could not load your profile data.');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handlePortfolioFileChange = (e) => setPortfolioFile(e.target.files[0]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        await uploadAPI.uploadAvatar(avatarFormData);
      }
      
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      };
      await profileAPI.updateProfile(user.id, profileData);
      
      await checkAuth(); // Refresh user context
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    e.preventDefault();
    if (!portfolioFile || !portfolioTitle) {
      setError("A title and file are required for portfolio items.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
        const portfolioFormData = new FormData();
        portfolioFormData.append('file', portfolioFile);
        portfolioFormData.append('title', portfolioTitle);
        portfolioFormData.append('description', portfolioDescription);

        await uploadAPI.uploadPortfolioItem(portfolioFormData);
        // Reset form and refetch profile to show new item
        setPortfolioFile(null);
        setPortfolioTitle('');
        setPortfolioDescription('');
        document.getElementById('portfolio-file-input').value = '';
        fetchProfile();
    } catch(err) {
        setError(err.response?.data?.error || 'Failed to upload portfolio item.');
    } finally {
        setIsUploading(false);
    }
  };

  const handleDeletePortfolioItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
        await uploadAPI.deletePortfolioItem(itemId);
        setPortfolioItems(portfolioItems.filter(item => item._id !== itemId));
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete item.');
    }
  };
  
  if (pageLoading || authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-lightgray-light py-12 px-4">
      <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</div>}
        
        {/* Profile Details Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20 mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-6">Edit Your Profile</h1>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <img src={avatarPreview || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}`} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover border-2"/>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-mint/10 file:text-mint hover:file:bg-mint/20"/>
              </div>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-charcoal mb-2">Bio</label>
              <textarea id="bio" name="bio" rows="4" className="w-full p-2 border-2 rounded-lg" value={formData.bio} onChange={handleChange}></textarea>
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-charcoal mb-2">Skills (comma separated)</label>
              <input id="skills" name="skills" type="text" className="w-full p-2 border-2 rounded-lg" value={formData.skills} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-charcoal mb-2">Location</label>
                <input id="location" name="location" type="text" className="w-full p-2 border-2 rounded-lg" value={formData.location} onChange={handleChange} />
              </div>
              {user.role === 'designer' && (
                <div>
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-charcoal mb-2">Hourly Rate ($)</label>
                  <input id="hourly_rate" name="hourly_rate" type="number" step="0.01" className="w-full p-2 border-2 rounded-lg" value={formData.hourly_rate} onChange={handleChange} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg bg-lightgray">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-lg text-white bg-mint hover:bg-mint-dark disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>

        {/* Portfolio Management Section */}
        {user.role === 'designer' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Manage Portfolio</h2>
              {/* Upload Form */}
              <form onSubmit={handlePortfolioUpload} className="space-y-4 p-4 border rounded-lg bg-lightgray-light mb-8">
                  <h3 className="font-semibold text-lg">Upload New Item</h3>
                  <div>
                      <label htmlFor="portfolioTitle" className="block text-sm font-medium text-charcoal mb-1">Title</label>
                      <input id="portfolioTitle" type="text" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} required className="w-full p-2 border-2 rounded-lg" />
                  </div>
                  <div>
                      <label htmlFor="portfolioDescription" className="block text-sm font-medium text-charcoal mb-1">Description (Optional)</label>
                      <textarea id="portfolioDescription" value={portfolioDescription} onChange={(e) => setPortfolioDescription(e.target.value)} rows="2" className="w-full p-2 border-2 rounded-lg"></textarea>
                  </div>
                  <div>
                      <label htmlFor="portfolio-file-input" className="block text-sm font-medium text-charcoal mb-1">File (Image, PDF, DOC)</label>
                      <input id="portfolio-file-input" type="file" required onChange={handlePortfolioFileChange} accept=".jpg, .jpeg, .png, .pdf, .doc, .docx" className="w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-mint/10 file:text-mint hover:file:bg-mint/20"/>
                  </div>
                  <button type="submit" disabled={isUploading} className="px-6 py-2 rounded-lg text-white bg-mint hover:bg-mint-dark disabled:opacity-50">{isUploading ? 'Uploading...' : 'Upload Item'}</button>
              </form>
              
              {/* Existing Items */}
              <h3 className="font-semibold text-lg mb-4">Your Items</h3>
              <div className="space-y-4">
                  {portfolioItems.length > 0 ? portfolioItems.map(item => (
                      <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                              <p className="font-bold">{item.title}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <button onClick={() => handleDeletePortfolioItem(item._id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                      </div>
                  )) : <p>You have no portfolio items yet.</p>}
              </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileEdit;