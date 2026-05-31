import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Sparkles, RefreshCw, AlertCircle, UserCheck } from 'lucide-react';

const AdminLogin = () => {
  const { adminLogin, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleMode, setRoleMode] = useState('admin'); // admin or mentor
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (roleMode === 'admin') {
        result = await adminLogin(email.trim(), password);
      } else {
        // Mentor login uses standard auth flow
        result = await login(email.trim(), password);
      }

      if (result.success) {
        if (roleMode === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/mentor/dashboard');
        }
      } else {
        setError(result.message || 'Verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-slate-50 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Blob */}
      <div className="absolute top-10 left-10 w-80 h-80 blur-blob-1 rounded-full pointer-events-none opacity-45" />
      <div className="absolute bottom-10 right-10 w-80 h-80 blur-blob-2 rounded-full pointer-events-none opacity-45" />

      <div className="relative max-w-md w-full z-10">
        
        {/* Toggle mode tab cards */}
        <div className="flex border-b border-slate-200 mb-6 bg-white/80 p-1 rounded-2xl shadow-sm border">
          <button
            onClick={() => { setRoleMode('admin'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition-all ${
              roleMode === 'admin' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Administrative Wing
          </button>
          <button
            onClick={() => { setRoleMode('mentor'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold font-display rounded-xl transition-all ${
              roleMode === 'mentor' 
                ? 'bg-indigo-650 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Industry Mentor Portal
          </button>
        </div>

        {/* Login panel card */}
        <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 p-8 shadow-xl">
          
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow ${
              roleMode === 'admin' ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {roleMode === 'admin' ? <ShieldCheck className="h-7 w-7" /> : <UserCheck className="h-7 w-7" />}
            </div>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
              {roleMode === 'admin' ? 'Administrative Sign In' : 'Ecosystem Mentor Log In'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              {roleMode === 'admin' 
                ? 'Vet applications, assign mentors, and export dynamic data logs.' 
                : 'Review assigned startup weekly progress logs and log rating cards.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start gap-2 text-xs font-semibold">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Cell Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                  placeholder={roleMode === 'admin' ? 'admin@startupcell.edu' : 'mentor@college.edu'}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Private Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-xs font-bold font-display shadow transition-all flex items-center justify-center gap-1.5 ${
                roleMode === 'admin' 
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'bg-indigo-650 hover:bg-indigo-700'
              }`}
            >
              {loading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Sparkles className="h-4.5 w-4.5" />}
              {roleMode === 'admin' ? 'Access Administrative Panel' : 'Access Mentor Hub'}
            </button>
          </form>

          {roleMode === 'admin' && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-sans block">Default Seeding Credentials:</span>
              <code className="text-[11px] bg-slate-50 text-slate-650 px-2 py-1 rounded inline-block font-mono mt-1 select-all font-semibold">
                admin@startupcell.edu / Admin@123
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
