import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, BookOpen, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation/loading states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // List of departments provided by the user
  const departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Other'
  ];

  // Validate form fields
  const validateForm = () => {
    const tempErrors = {};
    if (!fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    }
    if (!email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email format';
    }
    if (!studentId.trim()) {
      tempErrors.studentId = 'Student ID is required';
    }
    if (!department) {
      tempErrors.department = 'Please select your academic department';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters long';
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    const result = await register(fullName, email, studentId, department, password);

    if (result.success) {
      setRegisterSuccess(true);
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

      {/* Main Register Form Card */}
      <div className="glass-panel w-full max-w-lg bg-white/90 p-8 rounded-2xl border border-indigo-100 shadow-xl relative z-10 transition-all duration-300">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            Create Student Account
          </h2>
          <p className="text-slate-500 text-sm font-sans">
            Join the College Startup incubation network
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
        {registerSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 mb-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl font-sans animate-bounce">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Account created successfully! Logging you in...</span>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  disabled={isSubmitting || registerSuccess}
                  placeholder="John Doe"
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                    errors.fullName ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.fullName && (
                <span className="block text-xs text-rose-650 font-sans mt-1">{errors.fullName}</span>
              )}
            </div>

            {/* Email Address */}
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
                  disabled={isSubmitting || registerSuccess}
                  placeholder="john.doe@college.edu"
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                    errors.email ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && (
                <span className="block text-xs text-rose-650 font-sans mt-1">{errors.email}</span>
              )}
            </div>

            {/* Student ID */}
            <div className="space-y-1.5">
              <label htmlFor="studentId" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
                Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-5 w-5" />
                </div>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    if (errors.studentId) setErrors({ ...errors, studentId: '' });
                  }}
                  disabled={isSubmitting || registerSuccess}
                  placeholder="STU2026998"
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                    errors.studentId ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.studentId && (
                <span className="block text-xs text-rose-650 font-sans mt-1">{errors.studentId}</span>
              )}
            </div>

            {/* Department Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="department" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors({ ...errors, department: '' });
                  }}
                  disabled={isSubmitting || registerSuccess}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all appearance-none ${
                    errors.department ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.department && (
                <span className="block text-xs text-rose-655 font-sans mt-1">{errors.department}</span>
              )}
            </div>

            {/* Password */}
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
                  disabled={isSubmitting || registerSuccess}
                  placeholder="••••••••"
                  className={`block w-full pl-11 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                    errors.password ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || registerSuccess}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="block text-xs text-rose-650 font-sans mt-1">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-550 font-sans">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  disabled={isSubmitting || registerSuccess}
                  placeholder="••••••••"
                  className={`block w-full pl-11 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all ${
                    errors.confirmPassword ? 'border-rose-450 focus:border-rose-450 focus:ring-rose-500/10' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting || registerSuccess}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="block text-xs text-rose-650 font-sans mt-1">{errors.confirmPassword}</span>
              )}
            </div>

          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || registerSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-sm font-display mt-6"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Register Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect Footer */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
