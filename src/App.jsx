import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import ListingDetail from './pages/ListingDetail';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import { motion } from 'framer-motion';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <motion.main 
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/designer/:id" element={<Profile />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/checkout/:orderId" element={<Checkout />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </motion.main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
