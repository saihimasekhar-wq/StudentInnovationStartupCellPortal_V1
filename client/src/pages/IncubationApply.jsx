import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Building, ArrowLeft, Cpu, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IncubationApply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [approvedStartups, setApprovedStartups] = useState([]);
  const [fetchingStartups, setFetchingStartups] = useState(true);
  
  const [formData, setFormData] = useState({
    startupId: '',
    progress: '',
    fundingRequirement: '',
    whyIncubation: '',
    expectedSupport: '',
    futureGoals: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setFetchingStartups(true);
        const res = await axios.get('/api/startups');
        // Restrict list to APPROVED startups only
        const list = (res.data || []).filter(s => s.status === 'Approved');
        setApprovedStartups(list);
      } catch (err) {
        console.error('Failed to load owned startups:', err);
        setMessage({ type: 'error', text: 'Could not fetch your approved startup registry.' });
      } finally {
        setFetchingStartups(false);
      }
    };
    fetchStartups();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.startupId) {
      setMessage({ type: 'error', text: 'Please select an approved startup for incubation.' });
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/incubations', formData);
      setMessage({ type: 'success', text: 'Incubation application filed successfully! Cell admin vetting pending.' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Incubation submit error:', err);
      const text = err.response?.data?.message || 'Action failed. Please review form requirements.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingStartups) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Retrieving your approved startup registry...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-10">
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-700 font-display"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Form panel card */}
        <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-teal-650 via-indigo-650 to-indigo-900 px-8 py-6 text-white relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-teal-200 uppercase mb-2">
                Incubation Wing Office
              </span>
              <h1 className="text-2xl font-display font-extrabold tracking-tight flex items-center gap-2">
                <Cpu className="h-6 w-6 text-teal-400" />
                Apply for Incubation Space
              </h1>
              <p className="text-xs text-slate-200 mt-1 font-sans">
                Request physical hot-desks, high-performance computing pools, conference areas, and cloud credit schemes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-sm font-semibold border ${
                message.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-rose-600 mt-0.5" />}
                <span>{message.text}</span>
              </div>
            )}

            {approvedStartups.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
                <Building className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800 font-display">No Approved Startups Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Incubation requests are strictly restricted to <strong>Approved</strong> student startups. Please list your startup in the register module and wait for administrative vetting.
                </p>
                <div className="mt-4">
                  <Link
                    to="/startup-register"
                    className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow"
                  >
                    Register a Startup
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Select Approved Startup *</label>
                    <select
                      name="startupId"
                      required
                      value={formData.startupId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-700 font-medium"
                    >
                      <option value="">Select Startup</option>
                      {approvedStartups.map(s => (
                        <option key={s._id} value={s._id}>{s.startupName} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Incubation Funding Requirement *</label>
                    <input
                      type="text"
                      name="fundingRequirement"
                      required
                      value={formData.fundingRequirement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      placeholder="e.g. INR 5 Lakhs for prototype scale"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Current Business Progress / Traction *</label>
                  <textarea
                    name="progress"
                    required
                    rows="3"
                    value={formData.progress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                    placeholder="Specify current prototype stage, user trials, co-founder structure, or pilot sales..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Why is physical Incubation Needed? *</label>
                    <textarea
                      name="whyIncubation"
                      required
                      rows="4"
                      value={formData.whyIncubation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                      placeholder="Explain what physical assets (labs, desks, computing clusters) you will utilize..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Expected Support & Services *</label>
                    <textarea
                      name="expectedSupport"
                      required
                      rows="4"
                      value={formData.expectedSupport}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                      placeholder="e.g. legal advisory, patent search assistance, accounting tools, cloud credits..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Future 12-Month Milestones & Goals *</label>
                  <textarea
                    name="futureGoals"
                    required
                    rows="3"
                    value={formData.futureGoals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                    placeholder="State your product development, user growth, or seed funding targets..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-sm transition-colors font-display"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all font-display flex items-center gap-1.5 disabled:bg-teal-300"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    File Incubation Application
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default IncubationApply;
