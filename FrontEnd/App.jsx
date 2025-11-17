import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit.jsx';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Listings from './pages/Listings.jsx';
import CreateListing from './pages/CreateListing.jsx';
import ListingDetail from './pages/ListingDetail';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import SavedProjects from './pages/SavedProjects';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Invoices from './pages/Invoices';
import { motion } from 'framer-motion';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-lightgray-light flex flex-col">
          <Navbar />
          
          <motion.main 
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/designer/:id" element={<Profile />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
              <Route path="/profile/edit" element={<PrivateRoute><ProfileEdit /></PrivateRoute>} />
              <Route path="/checkout/:orderId" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
              
              {/* Designer Routes */}
              <Route path="/projects/saved" element={<PrivateRoute roles={['designer']}><SavedProjects /></PrivateRoute>} />
              
              {/* Business Routes */}
              <Route path="/listings/new" element={<PrivateRoute roles={['business']}><CreateListing /></PrivateRoute>} />
              
              {/* Admin Route */}
              <Route path="/admin/*" element={
                <PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>
              } />
            </Routes>
          </motion.main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;