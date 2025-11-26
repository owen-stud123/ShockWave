import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' // Start with no role selected
  });
  const [step, setStep] = useState(1); // Step 1 for role selection, Step 2 for form
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const { confirmPassword, ...userData } = formData;
      const res = await register(userData);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lightgray-light via-white to-mint/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div className="max-w-md w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-mint/20">
          
          {message ? (
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-charcoal mb-4">Registration Successful!</h2>
                  <p className="text-charcoal-light">{message}</p>
                  <Link to="/login" className="mt-6 inline-block bg-mint text-white py-2 px-4 rounded-lg">Proceed to Login</Link>
              </div>
          ) : (
            <>
              {step === 1 && <RoleSelection onSelect={handleRoleSelect} />}
              {step === 2 && <RegistrationForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} isLoading={isLoading} error={error} setStep={setStep} />}
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-charcoal-light">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-mint hover:text-mint-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const RoleSelection = ({ onSelect }) => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-charcoal mb-2">Join ShockWave</h2>
    <p className="text-sm text-charcoal-light mb-8">First, tell us who you are.</p>
    <div className="space-y-4">
      <button onClick={() => onSelect('designer')} className="w-full text-left p-6 border-2 border-lightgray-dark rounded-lg hover:border-mint group">
        <h3 className="font-bold text-lg text-charcoal group-hover:text-mint">I'm a Designer</h3>
        <p className="text-charcoal-light">Looking for projects and to showcase my work.</p>
      </button>
      <button onClick={() => onSelect('business')} className="w-full text-left p-6 border-2 border-lightgray-dark rounded-lg hover:border-mint group">
        <h3 className="font-bold text-lg text-charcoal group-hover:text-mint">I'm a Business</h3>
        <p className="text-charcoal-light">Looking to hire talented designers for projects.</p>
      </button>
      <button onClick={() => onSelect('admin')} className="w-full text-left p-6 border-2 border-lightgray-dark rounded-lg hover:border-purple-500 group">
        <h3 className="font-bold text-lg text-charcoal group-hover:text-purple-500">I'm an Admin</h3>
        <p className="text-charcoal-light">Platform administrator with full access.</p>
      </button>
    </div>
  </div>
);

const RegistrationForm = ({ formData, onChange, onSubmit, isLoading, error, setStep }) => {
  const roleLabel = formData.role === 'designer' ? 'Designer' : formData.role === 'business' ? 'Business' : 'Admin';
  
  return (
  <>
    <button onClick={() => setStep(1)} className="text-sm text-mint mb-4">&larr; Back to role selection</button>
    <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-charcoal mb-2">Create Your {roleLabel} Account</h2>
        <p className="text-sm text-charcoal-light">Let's get you started.</p>
    </div>
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{error}</div>}
      <input type="hidden" name="role" value={formData.role} />
      <InputField label="Full Name" name="name" type="text" value={formData.name} onChange={onChange} placeholder="Enter your full name" />
      <InputField label="Email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" />
      <InputField label="Password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="Create a password (min 6 chars)" />
      <InputField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} placeholder="Confirm your password" />
      <button type="submit" disabled={isLoading} className="w-full bg-mint text-white py-3 rounded-lg font-medium hover:bg-mint-dark disabled:opacity-50">
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  </>
  );
};

const InputField = ({ label, name, type, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-charcoal mb-2">{label}</label>
        <input id={name} name={name} type={type} required value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-mint" />
    </div>
);

export default Register;