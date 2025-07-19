

// With Api
// src/pages/LoginPage.jsx - with RTK Query
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/features/api/authApi'; // 1. Import the RTK Query hook
import toast from 'react-hot-toast'; // Import the toast library

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Instantiate the RTK Query mutation hook
  // It gives us a 'login' function to trigger the API call and state variables.
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Our FastAPI backend's form expects a 'username' field, which is our email.
    const credentials = { username: email, password };
    
    try {
      // 3. Call the login mutation. .unwrap() will automatically handle
      // the success case or throw an error if the API call fails.
      await login(credentials).unwrap();
      
      // The onQueryStarted logic in our authApi slice now handles saving the token
      // and updating the Redux state. We don't need to do it here.
      
    } catch (err) {
      // The error is automatically caught here by .unwrap().
      // The 'isError' and 'error' states from the hook will be updated.
      console.error('Failed to login:', err);
    }
  };

  // 4. Use useEffect to react to changes in the mutation's state.
  // This is the modern way to handle side effects like navigation.
  useEffect(() => {
    if (isSuccess) {
      toast.success('Login successful! Welcome back.');
      // Navigate to the home page on successful login.
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rich-black">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold gold-gradient-text mb-2">
            ELYSIAN
          </h1>
          <p className="text-warm-white/70">Welcome back to luxury</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 5. Display a dynamic error message from the hook's state */}
          {isError && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error?.data?.detail || 'Invalid credentials. Please try again.'}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-md px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-md px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading} // Disable the button while the API call is in progress
            className="w-full bg-gold text-rich-black py-4 font-medium tracking-wider hover:bg-gold/90 transition-all duration-300 disabled:bg-gold/50 disabled:cursor-not-allowed"
          >
            {/* 6. Show a loading state to the user */}
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>

          <p className="text-center text-warm-white/60">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:text-gold/80">
              Join ELYSIAN
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
