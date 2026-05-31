import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, ArrowLeft, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProposalForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    abstract: '',
    problemStatement: '',
    innovation: '',
    impact: '',
    technologies: '',
    teamMembers: '',
    department: user?.department || '',
  });

  const [docFile, setDocFile] = useState(null);
  const [supportFile, setSupportFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['IT & SaaS', 'AI & DeepTech', 'BioTech', 'CleanTech', 'EdTech', 'FinTech', 'Hardware & IoT', 'Healthcare', 'Others'];

  useEffect(() => {
    if (isEditMode) {
      const fetchProposalDetails = async () => {
        try {
          setFetchingDetails(true);
          const res = await axios.get(`/api/proposals/${id}`);
          const data = res.data;
          setFormData({
            title: data.title || '',
            category: data.category || '',
            abstract: data.abstract || '',
            problemStatement: data.problemStatement || '',
            innovation: data.innovation || '',
            impact: data.impact || '',
            technologies: data.technologies || '',
            teamMembers: data.teamMembers || '',
            department: data.department || '',
          });
        } catch (err) {
          console.error('Fetch proposal error:', err);
          setMessage({ type: 'error', text: 'Failed to retrieve proposal data.' });
        } finally {
          setFetchingDetails(false);
        }
      };
      fetchProposalDetails();
    }
  }, [id, isEditMode]);

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
      alert('File size exceeds the 10MB limit.');
      return;
    }

    if (e.target.name === 'proposalDocument') {
      setDocFile(file);
    } else if (e.target.name === 'supportingFiles') {
      setSupportFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setUploadProgress(0);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (docFile) {
        data.append('proposalDocument', docFile);
      }
      if (supportFile) {
        data.append('supportingFiles', supportFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      if (isEditMode) {
        await axios.put(`/api/proposals/${id}`, data, config);
        setMessage({ type: 'success', text: 'Proposal updated successfully!' });
      } else {
        await axios.post('/api/proposals', data, config);
        setMessage({ type: 'success', text: 'Proposal submitted successfully! Vetting is pending.' });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Proposal submit error:', err);
      const text = err.response?.data?.message || 'Action failed. Please review form requirements.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading proposal data...</p>
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
          
          <div className="bg-gradient-to-r from-purple-650 via-indigo-650 to-purple-900 px-8 py-6 text-white relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-purple-200 uppercase mb-2">
                Innovation Cell Board
              </span>
              <h1 className="text-2xl font-display font-extrabold tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                {isEditMode ? 'Edit Innovation Proposal' : 'Submit Innovation Proposal'}
              </h1>
              <p className="text-xs text-slate-200 mt-1 font-sans">
                File faculty research plans, technical designs, or novel product concepts to receive grants and workspace approvals.
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Proposal Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="e.g. Adaptive LMS using Deep Neural Networks"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Technology Sector *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-700"
                >
                  <option value="">Select Sector</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Executive Summary / Abstract *</label>
              <textarea
                name="abstract"
                required
                rows="3"
                value={formData.abstract}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                placeholder="Briefly state your technology hypothesis and major implementation goals..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Target Problem *</label>
                <textarea
                  name="problemStatement"
                  required
                  rows="4"
                  value={formData.problemStatement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-xs"
                  placeholder="What is the existing bottleneck or research gap?"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">The Novel Innovation *</label>
                <textarea
                  name="innovation"
                  required
                  rows="4"
                  value={formData.innovation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-xs"
                  placeholder="How is your concept novel compared to commercial products?"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Societal & Commercial Impact *</label>
                <textarea
                  name="impact"
                  required
                  rows="4"
                  value={formData.impact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-xs"
                  placeholder="What are the potential cost reductions or productivity gains?"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Core Technologies *</label>
                <input
                  type="text"
                  name="technologies"
                  required
                  value={formData.technologies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="e.g. PyTorch, React, ESP32"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Department / Faculty *</label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Team Member Names *</label>
                <input
                  type="text"
                  name="teamMembers"
                  required
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="Full names separated by comma"
                />
              </div>
            </div>

            {/* Document attachments */}
            <h3 className="text-base font-display font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 flex items-center gap-1.5">
              Research Docs & Support Schemes (Max 10MB)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <label className="text-xs font-bold text-slate-700 block mb-1 cursor-pointer font-display">
                  Primary Research Proposal (PDF) *
                  <input
                    type="file"
                    name="proposalDocument"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">PDF formats only</p>
                {docFile && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {docFile.name}</p>}
              </div>

              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <label className="text-xs font-bold text-slate-700 block mb-1 cursor-pointer font-display">
                  Supporting Files / CAD designs
                  <input
                    type="file"
                    name="supportingFiles"
                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">PDF, DOCX, PNG/JPG formats</p>
                {supportFile && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {supportFile.name}</p>}
              </div>
            </div>

            {loading && uploadProgress > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Uploading files to Cell server...</span>
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
                className="px-6 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all font-display flex items-center gap-1.5 disabled:bg-purple-300"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isEditMode ? 'Update Proposal' : 'Submit Proposal'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
