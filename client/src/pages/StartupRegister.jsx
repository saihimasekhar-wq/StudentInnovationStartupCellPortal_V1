import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Rocket, ArrowLeft, Upload, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StartupRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode (if ID is passed in route)
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    startupName: '',
    category: '',
    description: '',
    problemStatement: '',
    solution: '',
    founderName: user?.fullName || '',
    coFounderName: '',
    department: user?.department || '',
    teamSize: '1',
    stage: 'Idea Stage',
    fundingRequired: '',
    email: user?.email || '',
    phone: '',
    website: '',
    videoUrl: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [pitchFile, setPitchFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['IT & SaaS', 'AI & DeepTech', 'BioTech', 'CleanTech', 'EdTech', 'FinTech', 'Hardware & IoT', 'Healthcare', 'Others'];
  const stages = ['Idea Stage', 'Prototype', 'MVP', 'Revenue Generating'];

  useEffect(() => {
    if (isEditMode) {
      const fetchStartupDetails = async () => {
        try {
          setFetchingDetails(true);
          const res = await axios.get(`/api/startups/${id}`);
          const data = res.data;
          
          setFormData({
            startupName: data.startupName || '',
            category: data.category || '',
            description: data.description || '',
            problemStatement: data.problemStatement || '',
            solution: data.solution || '',
            founderName: data.founderName || '',
            coFounderName: data.coFounderName || '',
            department: data.department || '',
            teamSize: data.teamSize ? data.teamSize.toString() : '1',
            stage: data.stage || 'Idea Stage',
            fundingRequired: data.fundingRequired || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            videoUrl: data.videoUrl || '',
          });
        } catch (err) {
          console.error('Error fetching startup details:', err);
          setMessage({ type: 'error', text: 'Failed to retrieve startup details. Access might be restricted.' });
        } finally {
          setFetchingDetails(false);
        }
      };
      fetchStartupDetails();
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

    // Validate size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    if (e.target.name === 'logo') {
      setLogoFile(file);
    } else if (e.target.name === 'pitchDeck') {
      setPitchFile(file);
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

      if (logoFile) {
        data.append('logo', logoFile);
      }
      if (pitchFile) {
        data.append('pitchDeck', pitchFile);
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

      let response;
      if (isEditMode) {
        response = await axios.put(`/api/startups/${id}`, data, config);
        setMessage({ type: 'success', text: 'Startup details updated successfully! Reset to pending vetting.' });
      } else {
        response = await axios.post('/api/startups', data, config);
        setMessage({ type: 'success', text: 'Startup registered successfully! Vetting is now pending.' });
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Startup submit error:', err);
      const errText = err.response?.data?.message || 'Action failed. Please review form requirements.';
      setMessage({ type: 'error', text: errText });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading startup registry details...</p>
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
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 font-display"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Form panel card */}
        <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-650 via-purple-650 to-indigo-900 px-8 py-6 text-white border-b border-indigo-950/20 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-indigo-200 uppercase mb-2">
                Student Venture Cell
              </span>
              <h1 className="text-2xl font-display font-extrabold tracking-tight flex items-center gap-2">
                <Rocket className="h-6 w-6 text-indigo-400" />
                {isEditMode ? 'Edit Startup Listing' : 'Register Your Startup'}
              </h1>
              <p className="text-xs text-slate-200 mt-1 font-sans">
                Formally list your student-led business. Establish roles, categories, funding requirements, and submit pitches.
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

            {/* Stage 1: Basic Corporate identity */}
            <h3 className="text-base font-display font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Corporate Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Startup Name *</label>
                <input
                  type="text"
                  name="startupName"
                  required
                  value={formData.startupName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="e.g. EduAI Solutions"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Industry Sector / Category *</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">One-line Pitch / Brief Description *</label>
              <textarea
                name="description"
                required
                rows="2"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                placeholder="State your venture value proposition in 2 sentences..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">The Problem Statement *</label>
                <textarea
                  name="problemStatement"
                  required
                  rows="4"
                  value={formData.problemStatement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                  placeholder="What customer pain-point are you solving?"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Your Product Solution *</label>
                <textarea
                  name="solution"
                  required
                  rows="4"
                  value={formData.solution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-sm"
                  placeholder="How does your technology/service resolve the problem?"
                />
              </div>
            </div>

            {/* Stage 2: Founders & Metrics */}
            <h3 className="text-base font-display font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 flex items-center gap-1.5">
              <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Executive Team & Milestones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Founder Name *</label>
                <input
                  type="text"
                  name="founderName"
                  required
                  value={formData.founderName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Co-Founder Name</label>
                <input
                  type="text"
                  name="coFounderName"
                  value={formData.coFounderName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="Optional co-founder name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Executive Team Size *</label>
                <input
                  type="number"
                  name="teamSize"
                  required
                  min="1"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Venture Stage *</label>
                <select
                  name="stage"
                  required
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white text-slate-700"
                >
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Funding Requirement (INR) *</label>
                <input
                  type="text"
                  name="fundingRequired"
                  required
                  value={formData.fundingRequired}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="e.g. 5 Lakhs or 10 Lakhs"
                />
              </div>
            </div>

            {/* Stage 3: Contacts & Media */}
            <h3 className="text-base font-display font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 flex items-center gap-1.5">
              <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Media & Contact Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Corporate Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Founder Contact Phone *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Website Link</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="Optional website url"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Video Demo URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  placeholder="e.g. Youtube or Drive pitch link"
                />
              </div>
            </div>

            {/* Stage 4: Documents uploads */}
            <h3 className="text-base font-display font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 flex items-center gap-1.5">
              <span className="h-5 w-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Pitch & Branding Attachments (Max 10MB)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Logo upload field */}
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <label className="text-xs font-bold text-slate-700 block mb-1 cursor-pointer font-display">
                  Upload Corporate Logo
                  <input
                    type="file"
                    name="logo"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">PNG, JPG, JPEG formats only</p>
                {logoFile && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {logoFile.name}</p>}
              </div>

              {/* Pitch deck upload field */}
              <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                <label className="text-xs font-bold text-slate-700 block mb-1 cursor-pointer font-display">
                  Upload Pitch Deck / Document
                  <input
                    type="file"
                    name="pitchDeck"
                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">PDF, DOC, DOCX formats only</p>
                {pitchFile && <p className="text-xs text-indigo-600 font-semibold mt-2">Selected: {pitchFile.name}</p>}
              </div>
            </div>

            {/* Upload progress indicator */}
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

            {/* Action card buttons */}
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
                {isEditMode ? 'Update Venture Details' : 'Register Startup'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default StartupRegister;
