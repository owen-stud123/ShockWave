import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // This useEffect correctly handles setting the avatar URL
  // It only runs when the 'user' object changes.
  useEffect(() => {
    if (isAuthenticated && user) {
      const url = user.avatar_url
        ? `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${user.avatar_url}`
        : `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=00CEC9&color=fff`;
      setAvatarUrl(url);
    } else {
      setAvatarUrl(null); // Clear the avatar on logout
    }
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }} 
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
              <h1 className="text-xl sm:text-2xl font-bold text-mint hover:text-mint-dark transition-colors">
                ShockWave
              </h1>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4 lg:space-x-8">
              <Link to="/browse" className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-sm font-medium transition-all">
                Browse Designers
              </Link>
              <Link to="/listings" className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-sm font-medium transition-all">
                Find Work
              </Link>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-sm font-medium transition-all">
                  Dashboard
                </Link>
                <Link to="/messages" className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-sm font-medium transition-all">
                  Messages
                </Link>
                <div className="flex items-center space-x-3 border-l border-lightgray-dark pl-4 ml-2">
                  {/* Conditionally render the image only when avatarUrl is ready */}
                  {avatarUrl && <img src={avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover bg-lightgray" />}
                  <span className="text-sm text-charcoal hidden lg:inline">
                    Hello, {user.name}
                  </span>
                  <button onClick={handleLogout} className="bg-mint text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-mint-dark transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-sm font-medium transition-all">
                  Login
                </Link>
                <Link to="/register" className="bg-mint text-white px-3 lg:px-4 py-2 rounded-md text-sm font-medium hover:bg-mint-dark transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-charcoal hover:text-mint hover:bg-mint/5 focus:outline-none" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="md:hidden border-t-2 border-mint" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-2 pt-2 pb-3 bg-white shadow-lg flex flex-col gap-1">
              <Link to="/browse" onClick={closeMobileMenu} className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-base font-medium transition-all">Browse Designers</Link>
              <Link to="/listings" onClick={closeMobileMenu} className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-base font-medium transition-all">Find Work</Link>
              {isAuthenticated && user ? (
                <>
                  <div className="border-t border-lightgray-dark pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-charcoal-light">Logged in as <span className="font-medium text-charcoal">{user.name}</span></div>
                  </div>
                  <Link to="/dashboard" onClick={closeMobileMenu} className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-base font-medium transition-all">Dashboard</Link>
                  <Link to="/messages" onClick={closeMobileMenu} className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-base font-medium transition-all">Messages</Link>
                  <button onClick={handleLogout} className="w-full text-left text-white bg-mint hover:bg-mint-dark px-3 py-2 rounded-md text-base font-medium transition-colors mt-2">Logout</button>
                </>
              ) : (
                <div className="border-t border-lightgray-dark pt-2 mt-2 flex flex-col gap-1">
                  <Link to="/login" onClick={closeMobileMenu} className="text-charcoal hover:text-mint hover:bg-mint/5 px-3 py-2 rounded-md text-base font-medium transition-all">Login</Link>
                  <Link to="/register" onClick={closeMobileMenu} className="text-white bg-mint hover:bg-mint-dark px-3 py-2 rounded-md text-base font-medium transition-colors shadow-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;