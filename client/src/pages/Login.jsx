import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation/loading states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Load remember me email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Validate form fields
  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email format';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must contain at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      setLoginSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 1500); // Small delay to show success animation
    } else {
      setIsSubmitting(false);
      setServerError(result.message);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-blob-1 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-blob-2 blur-3xl opacity-60 pointer-events-none" />

      {/* Main Login Form Card */}
      <div className="glass-panel w-full max-w-md bg-white/90 p-8 rounded-2xl border border-indigo-100 shadow-xl relative z-10 transition-all duration-300">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            Student Sign In
          </h2>
          <p className="text-slate-500 text-sm font-sans">
            Access the Student Innovation & Startup Cell Portal
          </p>
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 text-sm text-rose-800 bg-rose-50 border border-rose-100 rounded-xl font-sans">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {loginSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl font-sans animate-bounce">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Authentication successful! Redirecting...</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                disabled={isSubmitting || loginSuccess}
                placeholder="student@college.edu"
                className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                  errors.email ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.email && (
              <span className="block text-xs text-rose-600 font-sans mt-1">{errors.email}</span>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                disabled={isSubmitting || loginSuccess}
                placeholder="••••••••"
                className={`block w-full pl-11 pr-10 py-3 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                  errors.password ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting || loginSuccess}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <span className="block text-xs text-rose-600 font-sans mt-1">{errors.password}</span>
            )}
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting || loginSuccess}
                className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/25 transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-500 font-semibold cursor-pointer font-sans select-none">
                Remember Me
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || loginSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm font-display"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect Footer */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 font-sans">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Register now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
