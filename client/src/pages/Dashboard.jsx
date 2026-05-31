import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Rocket, Lightbulb, Cpu, TrendingUp, Bell, Plus, Edit, Trash2, Eye, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [incubations, setIncubations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [activeTab, setActiveTab] = useState('startups'); // startups, proposals, incubations

  const fetchData = async () => {
    try {
      setLoading(true);
      const [startupsRes, proposalsRes, incubationsRes] = await Promise.all([
        axios.get('/api/startups'),
        axios.get('/api/proposals'),
        axios.get('/api/incubations')
      ]);

      setStartups(startupsRes.data || []);
      setProposals(proposalsRes.data || []);
      setIncubations(incubationsRes.data || []);
    } catch (err) {
      console.error('Error fetching student dashboard records:', err);
      setMessage('Failed to load your cell filings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStartup = async (id) => {
    if (window.confirm('Are you sure you want to delete this startup registration? This will clear all linked records.')) {
      try {
        await axios.delete(`/api/startups/${id}`);
        fetchData();
      } catch (err) {
        console.error('Delete startup error:', err);
        alert('Failed to remove startup registry.');
      }
    }
  };

  const handleDeleteProposal = async (id) => {
    if (window.confirm('Are you sure you want to delete this innovation proposal?')) {
      try {
        await axios.delete(`/api/proposals/${id}`);
        fetchData();
      } catch (err) {
        console.error('Delete proposal error:', err);
        alert('Failed to delete proposal.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Request Changes':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading student venture workspace...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-10">
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Greeting Board */}
        <div className="glass-panel rounded-3xl bg-white p-8 border border-slate-200/40 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-sans">
              Student Activity Dashboard
            </span>
            <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Faculty: <span className="font-semibold text-slate-700">{user?.department}</span> | ID: <span className="font-semibold text-slate-700">{user?.studentId}</span></p>
          </div>

          {/* Core Action triggers */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/startup-register"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-display shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              Register Startup
            </Link>
            <Link
              to="/proposal-form"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-purple-650 hover:bg-purple-700 text-white rounded-xl text-xs font-bold font-display shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              Submit Proposal
            </Link>
          </div>
        </div>

        {/* Dashboard Workspace grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main workspace filings panel */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Tabs control */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('startups')}
                className={`flex items-center gap-2 pb-3.5 px-6 font-display font-bold text-sm tracking-tight border-b-2 transition-all ${
                  activeTab === 'startups'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-450 hover:text-slate-700'
                }`}
              >
                <Rocket className="h-4 w-4" />
                Venture Registry ({startups.length})
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex items-center gap-2 pb-3.5 px-6 font-display font-bold text-sm tracking-tight border-b-2 transition-all ${
                  activeTab === 'proposals'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-450 hover:text-slate-700'
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                Innovation Proposals ({proposals.length})
              </button>

              <button
                onClick={() => setActiveTab('incubations')}
                className={`flex items-center gap-2 pb-3.5 px-6 font-display font-bold text-sm tracking-tight border-b-2 transition-all ${
                  activeTab === 'incubations'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-450 hover:text-slate-700'
                }`}
              >
                <Cpu className="h-4 w-4" />
                Incubation Spaces ({incubations.length})
              </button>
            </div>

            {/* Render Tab Contents */}
            {activeTab === 'startups' && (
              <div className="space-y-4">
                {startups.length === 0 ? (
                  <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                    <Rocket className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-slate-800 font-display">No Venture Filings Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Formally list your startup registry items to receive cell guides and funding vetting.
                    </p>
                  </div>
                ) : (
                  startups.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-6 border border-slate-200/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-display">{item.startupName}</h3>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-550 font-sans">{item.category} | Stage: <span className="font-semibold text-slate-700">{item.stage}</span></p>
                        <p className="text-xs text-slate-500 font-sans line-clamp-1">{item.description}</p>
                        
                        {item.adminComment && (
                          <div className="text-xs p-2.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl mt-2 max-w-xl font-medium">
                            <span className="font-bold">Cell Feedback:</span> "{item.adminComment}"
                          </div>
                        )}
                        {item.assignedMentor && (
                          <div className="text-xs p-2 bg-indigo-50/50 border border-indigo-100/50 text-indigo-800 rounded-lg mt-2 inline-flex items-center gap-1.5 font-semibold">
                            <span className="h-2 w-2 rounded-full bg-indigo-650"></span>
                            Mentor: {item.assignedMentor.name} ({item.assignedMentor.designation})
                          </div>
                        )}
                      </div>

                      {/* Control panel buttons */}
                      <div className="flex flex-wrap gap-2 shrink-0 self-end sm:self-center">
                        {item.status === 'Approved' && (
                          <>
                            <Link
                              to={`/progress-timeline/${item._id}`}
                              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800 border border-slate-200/40 transition-colors flex items-center justify-center gap-1"
                              title="Progress Logs Feed"
                            >
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-[10px] font-bold font-display px-0.5">Logs</span>
                            </Link>
                            <Link
                              to={`/startup/${item._id}`}
                              className="p-2 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl text-indigo-600 hover:text-indigo-700 transition-colors"
                              title="View Public Profile"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </>
                        )}
                        <Link
                          to={`/startup-register/edit/${item._id}`}
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-indigo-650 hover:text-indigo-755 border border-slate-200/40 transition-colors"
                          title="Edit Filings"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteStartup(item._id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 hover:text-rose-700 transition-colors"
                          title="Delete Registration"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'proposals' && (
              <div className="space-y-4">
                {proposals.length === 0 ? (
                  <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                    <Lightbulb className="h-10 w-10 text-slate-350 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-slate-800 font-display">No Proposals Filed</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Submit faculty research plans or novel tech proposals to obtain grants and maker space support.
                    </p>
                  </div>
                ) : (
                  proposals.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-6 border border-slate-200/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 font-display">{item.title}</h3>
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-550 font-sans">{item.category} | Tech: <span className="font-semibold text-slate-700">{item.technologies}</span></p>
                        
                        {item.adminComment && (
                          <div className="text-xs p-2.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl mt-2 max-w-xl font-medium">
                            <span className="font-bold">Cell Feedback:</span> "{item.adminComment}"
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2 shrink-0 self-end sm:self-center">
                        <Link
                          to={`/proposal/edit/${item._id}`}
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-indigo-650 hover:text-indigo-755 border border-slate-200/40 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProposal(item._id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'incubations' && (
              <div className="space-y-4">
                {incubations.length === 0 ? (
                  <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-6 shadow-sm">
                    <Cpu className="h-10 w-10 text-slate-355 mx-auto mb-2" />
                    <h3 className="text-base font-bold text-slate-800 font-display">No Space Requests Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Incubation application is pending. File request after your startup gains Approved status.
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/incubation-apply"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow"
                      >
                        File Application
                      </Link>
                    </div>
                  </div>
                ) : (
                  incubations.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-6 border border-slate-200/40 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 font-display">
                            Incubation Request for: <span className="text-indigo-600 font-extrabold">{item.startupId?.startupName || 'Your Startup'}</span>
                          </h3>
                          <span className="text-[10px] text-slate-400 font-mono font-medium block">Filed on: {new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs text-slate-650">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Business Traction</span>
                            <span className="text-slate-700 mt-0.5 block">{item.progress}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Expected Cell Support</span>
                            <span className="text-slate-700 mt-0.5 block">{item.expectedSupport}</span>
                          </div>
                        </div>
                        
                        {item.adminComment && (
                          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl font-medium">
                            <span className="font-bold">Cell Feedback:</span> "{item.adminComment}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Sidebar announcements panel */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm">
              <h3 className="text-base font-display font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-indigo-500" />
                Cell Announcements
              </h3>
              
              <div className="space-y-3">
                <div className="text-xs p-3 bg-indigo-50/50 rounded-xl text-slate-750 border border-indigo-100/50">
                  <span className="font-bold text-indigo-900 block">Demo Pitch Night</span>
                  Log your product milestones before VC validation cycle this Friday.
                </div>
                <div className="text-xs p-3 bg-slate-50 rounded-xl text-slate-600">
                  <span className="font-bold text-slate-800 block">Workspace Allocation</span>
                  Approved incubatees can pick up workspace keys from cell block desk.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
