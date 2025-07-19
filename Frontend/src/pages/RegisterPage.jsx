// src/pages/RegisterPage.jsx - Updated for RTK Query
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '@/features/api/userApi'; // 1. Import the signup hook
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  // 2. Instantiate the RTK Query mutation hook
  const [signup, { isLoading, isSuccess, isError, error: apiError }] = useSignupMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear local error state
    
    // Frontend validation for password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // 3. Call the signup mutation with the required fields
      // Our backend expects 'name', 'email', and 'password'
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      await signup(userData).unwrap();
      
    } catch (err) {
      console.error('Registration failed:', err);
      // The isError and apiError states will be set automatically
    }
  };

  // 4. Use useEffect to handle success side-effects
  useEffect(() => {
    if (isSuccess) {
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    }
  }, [isSuccess, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rich-black">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold gold-gradient-text pt-8 mb-2">
            ELYSIAN
          </h1>
          <p className="text-xl text-warm-white/80 mb-2">Create Your Account</p>
          <p className="text-warm-white/60">Join our exclusive circle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display local or API errors */}
          {(error || isError) && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error || apiError?.data?.detail || 'Registration failed. Please try again.'}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="your.email@elysian.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="Create password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-rich-black py-4 font-medium tracking-widest text-lg hover:bg-gold/90 transition-all duration-300 rounded-lg disabled:bg-gold/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

          <p className="text-center text-warm-white/60">
            Already a member?{' '}
            <Link to="/login" className="text-gold hover:text-gold/80 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
