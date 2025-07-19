
// src/pages/admin/AdminLoginPage.jsx - Fixed Race Condition
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import { useLoginMutation } from '../../features/api/authApi';
import { useSelector } from 'react-redux'; // 1. Import useSelector
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  // 2. Get the user object directly from the Redux store
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { username: email, password };
    try {
      // The only job of handleSubmit now is to trigger the login
      await login(credentials).unwrap();
    } catch (err) {
      console.error('Admin login failed:', err);
    }
  };

  // 3. THE FIX: This useEffect now watches the 'user' object from the store.
  // It will only run AFTER the getMe query has finished and the user state is updated.
  useEffect(() => {
    // If a user object exists AND that user is an admin, then we navigate.
    if (user && user.is_admin) {
      toast.success('Admin access granted.');
      navigate('/admin');
    }
  }, [user, navigate]); // This effect depends on the user object

  return (
    <div className="min-h-screen flex items-center justify-center bg-rich-black">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-gold" />
          </div>
          <h1 className="text-4xl font-display font-bold text-warm-white mb-2">
            Admin Access
          </h1>
          <p className="text-warm-white/60">Sign in to manage luxury collections</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isError && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error?.data?.detail || 'Access Denied: Invalid admin credentials'}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="admin@elysian.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold text-rich-black py-4 font-medium tracking-widest text-lg hover:bg-gold/90 transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gold/50 disabled:cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            <span>{isLoading ? 'ACCESSING...' : 'ACCESS ADMIN'}</span>
          </button>

          <p className="text-center text-warm-white/60">
            <a href="/login" className="text-gold hover:text-gold/80">
              Back to User Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
