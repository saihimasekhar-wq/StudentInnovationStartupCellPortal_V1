import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, ArrowLeft, Upload, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProgressSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startups, setStartups] = useState([]);
  const [fetchingStartups, setFetchingStartups] = useState(true);

  const [formData, setFormData] = useState({
    startupId: '',
    title: '',
    summary: '',
    achievements: '',
    challenges: '',
    nextMilestone: '',
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setFetchingStartups(true);
        const res = await axios.get('/api/startups');
        // Filter approved startups
        const list = (res.data || []).filter(s => s.status === 'Approved');
        setStartups(list);
      } catch (err) {
        console.error('Failed to load owned startups:', err);
        setMessage({ type: 'error', text: 'Could not fetch your approved startups.' });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Evidence attachment exceeds 10MB limit.');
      return;
    }
    setEvidenceFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setUploadProgress(0);

    if (!formData.startupId) {
      setMessage({ type: 'error', text: 'Please select an approved startup.' });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (evidenceFile) {
        data.append('evidence', evidenceFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      };

      await axios.post('/api/progress', data, config);
      setMessage({ type: 'success', text: 'Weekly progress report logged successfully!' });

      setTimeout(() => {
        navigate(`/progress-timeline/${formData.startupId}`);
      }, 2000);
    } catch (err) {
      console.error('Progress submit error:', err);
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

        {/* Form container */}
        <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 shadow-xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-650 via-indigo-650 to-indigo-900 px-8 py-6 text-white relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-blue-200 uppercase mb-2">
                Weekly Tracking Desk
              </span>
              <h1 className="text-2xl font-display font-extrabold tracking-tight flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-400" />
                Submit Weekly Startup Progress
              </h1>
              <p className="text-xs text-slate-200 mt-1 font-sans">
                Log business achievements, customer surveys, development updates, and obtain mentor rating cards.
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

            {startups.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6">
                <TrendingUp className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800 font-display">No Approved Startups Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Progress tracking updates are strictly restricted to <strong>Approved</strong> student startups. Please list your startup in the register module and wait for administrative vetting.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Select Active Startup *</label>
                    <select
                      name="startupId"
                      required
                      value={formData.startupId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-700 font-medium"
                    >
                      <option value="">Select Startup</option>
                      {startups.map(s => (
                        <option key={s._id} value={s._id}>{s.startupName} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Progress Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      placeholder="e.g. Completed MVP prototype & User Trials"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Weekly Progress Summary *</label>
                  <textarea
                    name="summary"
                    required
                    rows="3"
                    value={formData.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                    placeholder="Provide a brief summary of what task items were completed this week..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Major Achievements *</label>
                    <textarea
                      name="achievements"
                      required
                      rows="4"
                      value={formData.achievements}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                      placeholder="e.g. 50 student user sign-ups, finalized patent filing, or pitch deck complete..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Key Obstacles / Challenges *</label>
                    <textarea
                      name="challenges"
                      required
                      rows="4"
                      value={formData.challenges}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                      placeholder="e.g. DB scaling bugs, legal filing details, or prototype hardware delays..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Next Milestone *</label>
                  <input
                    type="text"
                    name="nextMilestone"
                    required
                    value={formData.nextMilestone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    placeholder="e.g. Integrate payment gateways, deploy on play store..."
                  />
                </div>

                {/* Evidence Attachment */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 block mb-2 font-display">Evidence / Accomplishment Document (Max 10MB)</h3>
                  <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                    <label className="text-xs font-bold text-slate-700 block mb-1 cursor-pointer font-display">
                      Attach Evidence (PDF, DOCX, PNG/JPG)
                      <input
                        type="file"
                        name="evidence"
                        accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">PDF, DOCX, PNG/JPG formats supported</p>
                    {evidenceFile && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {evidenceFile.name}</p>}
                  </div>
                </div>

                {loading && uploadProgress > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Uploading evidence attachment...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

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
                    className="px-6 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all font-display flex items-center gap-1.5 disabled:bg-indigo-300"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Submit Progress Report
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

export default ProgressSubmit;
