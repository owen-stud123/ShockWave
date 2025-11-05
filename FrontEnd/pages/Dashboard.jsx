import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    earnings: 0,
    messages: 0,
    reviews: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // This function will fetch the real stats from the backend
    const fetchStats = async () => {
      if (!user) return;
      try {
        setStatsLoading(true);
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    // We only fetch stats once the user object is available
    if (!authLoading) {
      fetchStats();
    }
  }, [user, authLoading]);
  
  // Display a loading spinner while user auth or stats are being fetched
  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightgray-light">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div>
      </div>
    );
  }

  // Handle case where user is not logged in (e.g., token expired)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightgray-light">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Please log in to access your dashboard.</h2>
          <Link to="/login" className="text-mint hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightgray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Welcome, {user.name}!
            </h1>
            <p className="text-charcoal-light">
              {user.role === 'designer' ? 'Manage your gigs and find new projects' : 'Post projects and find talented designers'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-mint">
              <h3 className="text-lg font-semibold text-charcoal mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-mint">{stats.projects}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-mint">
              <h3 className="text-lg font-semibold text-charcoal mb-2">{user.role === 'designer' ? 'Total Earnings' : 'Total Spent'}</h3>
              <p className="text-3xl font-bold text-mint">${stats.earnings.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-mint">
              <h3 className="text-lg font-semibold text-charcoal mb-2">Unread Messages</h3>
              <p className="text-3xl font-bold text-mint">{stats.messages}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-mint">
              <h3 className="text-lg font-semibold text-charcoal mb-2">Reviews Received</h3>
              <p className="text-3xl font-bold text-mint">{stats.reviews}</p>
            </div>
          </div>

          {/* Role-specific content */}
          {user.role === 'designer' ? (
            <DesignerDashboard />
          ) : (
            <BusinessDashboard />
          )}
        </motion.div>
      </div>
    </div>
  );
};

const DesignerDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-mint/20">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-mint text-white px-6 py-3 rounded-md hover:bg-mint-dark">Create New Gig</button>
          <Link to="/listings" className="bg-charcoal text-white px-6 py-3 rounded-md hover:bg-charcoal-light">
            Browse Projects
          </Link>
          <Link to="/profile/edit" className="bg-mint-light text-charcoal px-6 py-3 rounded-md hover:bg-mint">Update Profile</Link>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-mint/20">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Recent Activity</h2>
        <p className="text-charcoal-light">No recent activity to show.</p>
      </div>
    </div>
  );
};

const BusinessDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-mint/20">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/listings/new" className="bg-mint text-white px-6 py-3 rounded-md hover:bg-mint-dark">
            Post New Project
          </Link>
          <Link to="/browse" className="bg-charcoal text-white px-6 py-3 rounded-md hover:bg-charcoal-light">
            Browse Designers
          </Link>
          <Link to="/profile/edit" className="bg-mint-light text-charcoal px-6 py-3 rounded-md hover:bg-mint">Update Profile</Link>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-mint/20">
        <h2 className="text-xl font-semibold text-charcoal mb-4">Recent Projects</h2>
        <p className="text-charcoal-light">No projects posted yet.</p>
      </div>
    </div>
  );
};

export default Dashboard;