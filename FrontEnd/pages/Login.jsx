import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lightgray-light via-white to-mint/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h2>
            <p className="text-sm text-charcoal-light">Sign in to continue to ShockWave</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                {error}
              </motion.div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">Email</label>
              <input id="email" name="email" type="email" required className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="Enter your email" value={formData.email} onChange={handleChange}/>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">Password</label>
              <input id="password" name="password" type="password" required className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" placeholder="Enter your password" value={formData.password} onChange={handleChange}/>
            </div>
            
            <div className="text-right text-sm">
                <Link to="/forgot-password" className="font-medium text-mint hover:text-mint-dark">
                    Forgot password?
                </Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-mint text-white py-3 rounded-lg font-medium hover:bg-mint-dark disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-light">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-mint hover:text-mint-dark">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <TestAccountsBox quickLogin={quickLogin} />
      </motion.div>
    </div>
  );
};

const TestAccountsBox = ({ quickLogin }) => (
    <motion.div className="mt-6 bg-gradient-to-r from-lightgray-light to-lightgray rounded-xl p-6 border-2 border-lightgray-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="text-center mb-4">
            <p className="text-xs font-semibold text-charcoal-light uppercase tracking-wide">Test Accounts</p>
        </div>
        <div className="space-y-3">
            <TestAccountButton onClick={() => quickLogin('designer@creative.com', 'design2024')} role="👨‍🎨 Designer" email="designer@creative.com" pass="design2024" />
            <TestAccountButton onClick={() => quickLogin('business@startup.com', 'startup2024')} role="💼 Business" email="business@startup.com" pass="startup2024" />
            <TestAccountButton onClick={() => quickLogin('admin@shockwave.com', 'admin2024')} role="🔐 Admin" email="admin@shockwave.com" pass="admin2024" />
        </div>
        <p className="text-xs text-charcoal-light text-center mt-4 italic">Click any account to auto-fill credentials</p>
    </motion.div>
);

const TestAccountButton = ({ onClick, role, email, pass }) => (
    <button onClick={onClick} className="w-full bg-white p-3 rounded-lg border-2 border-lightgray-dark hover:border-mint hover:shadow-md transition-all text-left group">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-charcoal-light mb-1">{role}</p>
                <p className="text-sm font-mono text-charcoal-light group-hover:text-mint">{email}</p>
                <p className="text-sm font-mono text-charcoal-light group-hover:text-mint">{pass}</p>
            </div>
            <svg className="w-5 h-5 text-charcoal-light group-hover:text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </button>
);

export default Login;