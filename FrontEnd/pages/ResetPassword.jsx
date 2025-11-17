import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await authAPI.resetPassword(token, password);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightgray-light py-12 px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-charcoal">Reset Your Password</h2>
            <p className="text-sm text-charcoal-light mt-2">Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
            {message && (
                <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm">
                    {message} Redirecting to login...
                </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">New Password</label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || message}
              className="w-full bg-mint text-white py-3 rounded-lg font-medium hover:bg-mint-dark disabled:opacity-50"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;