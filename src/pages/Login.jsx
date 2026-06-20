import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [loginIdentifier, setLoginIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api-mockforge.onrender.com/api/databases/6a2bde3c54c439099ee6b611/resources/user_name_password');
      
      if (!response.ok) {
        throw new Error("Could not retrieve accounts server-side.");
      }

      const usersList = await response.json();

      // Find user matching email/mobile and password
      const matchedUser = usersList.find(user => 
        (user.email === loginIdentifier || user.mobile === loginIdentifier) && 
        user.password === password
      );

      if (matchedUser) {
        // Retain standard local session variable for routing or header identification
        localStorage.setItem('user', JSON.stringify({ email: matchedUser.email, authenticated: true }));
        navigate('/');
      } else {
        setError("Invalid credentials or user doesn't exist.");
      }
    } catch (err) {
      setError("Server validation failed. Please check network connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Log in to safely access your dynamic shopping cart session.</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
            <input 
              type="text" 
              value={loginIdentifier} 
              onChange={(e) => setLoginIdentifier(e.target.value)} 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
              placeholder="Enter email or 10-digit mobile" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 rounded-lg font-semibold transition text-sm"
          >
            {loading ? 'Verifying...' : 'Log In'}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">New to ShopSmart? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link></p>
      </div>
    </div>
  );
}