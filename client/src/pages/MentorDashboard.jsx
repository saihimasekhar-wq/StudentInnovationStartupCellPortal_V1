import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserCheck, Rocket, TrendingUp, Calendar, CheckCircle2, AlertCircle, 
  MessageSquare, Star, ArrowUpRight, ChevronRight, LogOut, Sparkles, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [assignedStartups, setAssignedStartups] = useState([]);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [error, setError] = useState('');

  // Selected startup logs
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Review modal / input state
  const [activeLog, setActiveLog] = useState(null);
  const [mentorRating, setMentorRating] = useState('5');
  const [mentorComment, setMentorComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchStartups = async () => {
    try {
      setLoadingStartups(true);
      const res = await axios.get('/api/startups');
      setAssignedStartups(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch assigned startups.');
    } finally {
      setLoadingStartups(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleStartupSelect = async (startup) => {
    setSelectedStartup(startup);
    setActiveLog(null);
    setLogs([]);
    try {
      setLoadingLogs(true);
      const res = await axios.get(`/api/progress/startup/${startup._id}`);
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to retrieve startup progress reports.');
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!activeLog) return;
    try {
      setSubmittingReview(true);
      await axios.put(`/api/progress/${activeLog._id}/review`, {
        mentorRating: parseInt(mentorRating),
        mentorComment
      });

      alert('Weekly progress log reviewed and rated successfully!');
      
      // Refresh current startup logs timeline
      const res = await axios.get(`/api/progress/startup/${selectedStartup._id}`);
      setLogs(res.data || []);
      
      setMentorRating('5');
      setMentorComment('');
      setActiveLog(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit weekly review rating.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`}
          />
        ))}
      </div>
    );
  };

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 1. Left Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-350 shrink-0 flex flex-col justify-between border-r border-slate-950/20">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-650 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-white tracking-tight block">Mentor Portal</span>
              <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-semibold font-mono">Ecosystem Advisory</span>
            </div>
          </div>

          <div className="p-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-3 px-2 tracking-wider">Assigned Startups</span>
            {loadingStartups ? (
              <div className="text-center py-4 text-xs text-slate-500">Loading assignments...</div>
            ) : assignedStartups.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500 italic">No startups assigned.</div>
            ) : (
              <div className="space-y-1">
                {assignedStartups.map(s => (
                  <button
                    key={s._id}
                    onClick={() => handleStartupSelect(s)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold font-display transition-all ${
                      selectedStartup?._id === s._id 
                        ? 'bg-slate-800 text-white shadow-inner' 
                        : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{s.startupName}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mentor profile information */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex flex-col gap-1 mb-3 px-2">
            <span className="text-xs font-bold text-white truncate">{user?.fullName}</span>
            <span className="text-[10px] text-slate-500 truncate">{user?.email}</span>
            <span className="text-[9px] uppercase tracking-wider text-teal-400 border border-teal-500/20 bg-teal-500/10 px-1.5 py-0.5 rounded inline-block font-bold w-max mt-1">Mentor</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-800 hover:bg-rose-900/10 hover:border-rose-900/30 text-rose-500 hover:text-rose-400 text-xs font-bold font-display rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main content */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!selectedStartup ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/50 p-8 shadow-sm">
            <Rocket className="h-12 w-12 text-slate-350 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 font-display">Select an Assigned Startup</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto text-center leading-relaxed">
              Select an assigned student startup from the sidebar queue to review their weekly accomplishments logs, track achievements, and submit review cards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline logs display list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-755 font-sans">
                    {selectedStartup.category}
                  </span>
                  <h2 className="text-lg font-display font-extrabold text-slate-900 mt-1">{selectedStartup.startupName} Progress Timeline</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Founder: <span className="font-semibold text-slate-700">{selectedStartup.founderName}</span> | Stage: <span className="font-semibold text-slate-700">{selectedStartup.stage}</span></p>
                </div>
              </div>

              {loadingLogs ? (
                <div className="text-center py-10 text-xs text-slate-400">Loading progress timeline...</div>
              ) : logs.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-455 bg-white rounded-2xl border p-6">No progress reports filed by the student yet.</div>
              ) : (
                <div className="relative border-l border-indigo-100 ml-4 pl-8 space-y-6">
                  {logs.map((log, idx) => {
                    const isReviewed = log.status === 'Reviewed';
                    const evidenceLink = log.evidence ? `/${log.evidence}` : null;

                    return (
                      <div key={log._id} className="relative">
                        <span className="absolute -left-12 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-500 text-indigo-650 font-mono text-xs font-bold shadow-sm">
                          {logs.length - idx}
                        </span>

                        <div className={`glass-panel rounded-3xl bg-white border shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer ${
                          activeLog?._id === log._id ? 'border-indigo-500/50' : 'border-slate-200/40'
                        }`} onClick={() => { if (!isReviewed) { setActiveLog(log); setMentorComment(log.mentorComment || ''); setMentorRating(log.mentorRating?.toString() || '5'); } }}>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
                            <h3 className="text-sm font-bold text-slate-900 font-display">{log.title}</h3>
                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                              isReviewed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {log.status}
                            </span>
                          </div>

                          <div className="space-y-3 text-xs text-slate-650">
                            <p><span className="font-semibold text-slate-800">Summary:</span> {log.summary}</p>
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Achievements:</span>
                                <p className="mt-0.5">{log.achievements}</p>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Challenges:</span>
                                <p className="mt-0.5">{log.challenges}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[11px]">
                              <span>Next Target: <span className="font-bold text-slate-800">{log.nextMilestone}</span></span>
                              {evidenceLink && <a href={evidenceLink} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-600 underline">View Evidence attachment</a>}
                            </div>
                          </div>

                          {isReviewed && (
                            <div className="mt-4 pt-3 border-t border-dashed border-slate-200/80 bg-slate-50/50 -mx-5 -mb-5 px-5 py-3 rounded-b-3xl text-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-700">Reviewed Rating:</span>
                                {renderStars(log.mentorRating)}
                              </div>
                              <p className="italic text-slate-600 mt-1">"{log.mentorComment}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Review and rating input block */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm min-h-[300px] flex flex-col justify-between">
              {!activeLog ? (
                <div className="text-center py-20 text-xs text-slate-455">
                  Select a pending progress log timeline card from the left side to submit rating and comment review.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5 text-xs">
                  <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">Reviewing Log: {activeLog.title}</h3>
                      <span className="text-[10px] text-slate-400 font-mono block">Submitted: {new Date(activeLog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-2 font-display">Assign Star Rating *</label>
                    <div className="flex gap-2 p-2 bg-slate-50 rounded-xl justify-center">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setMentorRating(val.toString())}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              val <= parseInt(mentorRating) 
                                ? 'text-amber-500 fill-amber-500' 
                                : 'text-slate-200 fill-slate-200 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1.5 font-display">Mentor Advisories & Comments *</label>
                    <textarea
                      required
                      rows="4"
                      value={mentorComment}
                      onChange={e => setMentorComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs leading-relaxed"
                      placeholder="Provide structural guidelines, business strategies, DB advice, or pilot trials guidance..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveLog(null)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl font-display transition-colors text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="flex-grow py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl font-display shadow transition-colors flex items-center justify-center gap-1"
                    >
                      {submittingReview ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Submit Log Review
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}
      </main>

    </div>
  );
};

export default MentorDashboard;
