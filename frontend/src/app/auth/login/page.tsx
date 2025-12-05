'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth.context';
import { User, Lock, Camera, Check, AlertCircle, Eye } from 'lucide-react';


export default function LoginPage() {
  const [email, setEmail] = useState(''); // Used as 'Username' input
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Added for UI fidelity
  const [error, setError] = useState(''); // Pre-filled for UI fidelity
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Keeping your original function logic untouched as requested
    try {
      await login(email, password);
      // router.push('/'); // Commented out to prevent environment-specific error, use a standard link or remove mock if needed
      router.push('/');
    } catch (err) {
      setError('Invalid username or password'); 
    } finally {
      setLoading(false);
    }
  };

  // --- Background Bar Chart Illustration (Complex Div Structure) ---
  const BarChartIllustration = () => (
    <div className="relative w-full h-full p-12 overflow-hidden flex flex-col justify-between">
      {/* Dynamic Bars - using high z-index and varied opacity/blur */}
      <div className="absolute inset-0 z-0">
        {/* Tall Red/Orange Bar */}
        <div className="absolute top-0 left-1/2 w-12 h-4/5 bg-orange-600/50 rounded-lg transform rotate-2 blur-sm"></div>
        {/* Tall Purple Bar */}
        <div className="absolute top-10 left-1/4 w-12 h-3/4 bg-purple-600/50 rounded-lg transform -rotate-3 blur-sm"></div>
        {/* Yellow Bar 1 (Middle) */}
        <div className="absolute top-1/2 right-1/4 w-10 h-1/3 bg-yellow-400/50 rounded-lg transform rotate-6 blur-sm"></div>
        {/* Yellow Bar 2 (Bottom) */}
        <div className="absolute bottom-5 left-1/3 w-10 h-1/4 bg-yellow-400/50 rounded-lg transform -rotate-1"></div>
        {/* Small Purple Bar (Bottom Left) */}
        <div className="absolute bottom-5 left-10 w-8 h-1/5 bg-purple-700/50 rounded-lg transform rotate-3"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-white pt-16">
        <h1 className="text-6xl font-extrabold leading-tight">
          Welcome! <br/> Lading
        </h1>
        <p className="mt-4 text-sm max-w-xs text-white/80">
          Lorem ipsum dolor sit amet, consectetuer adipiscing sed laoreet dolore magna aliquam erat volutpat.
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300">
          Learn more
        </button>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 text-xs text-white/70">
        © 2045 Company
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-600 to-red-600 font-sans">
      
      {/* Main Layout Container */}
      <div className="w-full max-w-6xl h-[600px] grid md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Left Panel: Illustration and Marketing Text */}
        <div className="hidden md:flex bg-black/10"> {/* Simple dark background for the left column */}
          <BarChartIllustration />
        </div>

        {/* Right Panel: Glassmorphism Login Card */}
        <div className="p-4 sm:p-10 lg:p-16 flex flex-col justify-center bg-white/10 backdrop-blur-md rounded-3xl md:rounded-l-none">
          
          {/* Card Header */}
          <div className="flex justify-between items-center mb-10 text-white">
            <h2 className="text-4xl font-semibold">Login</h2>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-md">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* --- Login Form --- */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username Input (using 'email' state) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-white/50 bg-white/80 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-150 sm:text-base shadow-inner"
                placeholder="Username"
                autoComplete="off"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-white/50 bg-white/80 placeholder-gray-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-150 sm:text-base shadow-inner"
                placeholder="Password"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700">
                <Eye className="h-5 w-5" />
              </button>
            </div>
            
            {/* Error Message (pre-filled for visual demonstration) */}
            {error && (
              <div className="flex items-center p-3 text-sm font-medium text-white bg-red-600 rounded-xl shadow-lg">
                <AlertCircle className="w-4 h-4 mr-2"/>
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-2 text-white text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-orange-400 bg-transparent border-white/70 rounded focus:ring-orange-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>

              <Link href="/auth/forgot-password" className="font-medium text-white/80 hover:text-white transition duration-150">
                Forgot Password?
              </Link>
            </div>

            {/* Placeholder Text UI element */}
             <div className="flex items-center text-xs text-white/70">
                <Check className="w-3 h-3 mr-1"/>
                <span>hai mext text ren hover translation-57</span>
             </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-full text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl disabled:opacity-60 transition duration-300"
              >
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </div>
            
            {/* Create Account Link */}
            <p className="text-center text-sm text-white/70 pt-6">
              Don't have an account?{' '}
              {/* Replaced <Link> with <a> */}
              <a
                href="/auth/register"
                className="font-bold text-white hover:text-yellow-400 transition duration-150"
              >
                Create Account
              </a>
            </p>

          </form>
          {/* --- End Login Form --- */}
        </div>
      </div>
    </div>
  );
}