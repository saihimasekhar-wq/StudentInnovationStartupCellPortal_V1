import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, TrendingUp, Star, Calendar, MessageSquare, AlertCircle, Award, CheckCircle } from 'lucide-react';

const ProgressTimeline = () => {
  const { startupId } = useParams();
  const [logs, setLogs] = useState([]);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        // Fetch startup details first
        const startupRes = await axios.get(`/api/startups/${startupId}`);
        setStartup(startupRes.data);

        // Fetch progress timeline
        const progressRes = await axios.get(`/api/progress/startup/${startupId}`);
        setLogs(progressRes.data || []);
      } catch (err) {
        console.error('Failed to load progress timeline:', err);
        setError('Failed to retrieve weekly progress logs. Make sure you are authorized.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [startupId]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating 
                ? 'text-amber-500 fill-amber-500' 
                : 'text-slate-200 fill-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 w-1/3 bg-slate-200 rounded mb-8"></div>
        <div className="space-y-6">
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-display font-extrabold text-slate-900">Timeline Access Restricted</h2>
        <p className="mt-2 text-sm text-slate-500">{error || 'This startup progress registry is unlisted.'}</p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-10">
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 hover:text-indigo-700 font-display"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Link
            to="/progress-submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-display shadow shadow-indigo-600/10"
          >
            + Log Progress
          </Link>
        </div>

        {/* Startup banner */}
        <div className="glass-panel rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-sans">
              {startup.category}
            </span>
            <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mt-1">
              {startup.startupName} Progress Timeline
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Assigned Mentor: <span className="font-semibold text-slate-700">{startup.assignedMentor?.name || 'Unassigned'}</span></p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-sans">Logs Filed:</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg font-mono">{logs.length} Weeks</span>
          </div>
        </div>

        {/* Timeline representation */}
        {logs.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-sm">
            <TrendingUp className="h-12 w-12 text-slate-350 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 font-display">Timeline is Empty</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No weekly progress logs have been logged for this venture yet. Start tracking your business goals by creating a log!
            </p>
            <div className="mt-5">
              <Link
                to="/progress-submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow"
              >
                File Your First Progress Log
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative border-l border-indigo-100 ml-4 pl-8 space-y-10">
            {logs.map((log, index) => {
              const evidenceLink = log.evidence ? `/${log.evidence}` : null;
              const isReviewed = log.status === 'Reviewed';

              return (
                <div key={log._id} className="relative">
                  {/* Timeline point bullet */}
                  <span className="absolute -left-12 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-500 text-indigo-600 font-mono text-xs font-bold shadow-sm">
                    {logs.length - index}
                  </span>

                  {/* Log panel card */}
                  <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 shadow-sm p-6 hover:shadow-md transition-shadow">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 mb-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-display">{log.title}</h3>
                        <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-0.5 font-mono">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(log.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Vetting status badge */}
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        isReviewed 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {isReviewed ? <CheckCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                        {log.status}
                      </span>
                    </div>

                    {/* Summary & Achievements */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-450 block tracking-wider font-sans">Summary</span>
                        <p className="text-slate-650 text-xs leading-relaxed font-sans mt-0.5">{log.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Weekly Achievements</span>
                          <p className="text-xs text-slate-700 font-sans mt-0.5">{log.achievements}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Encountered Obstacles</span>
                          <p className="text-xs text-slate-750 font-sans mt-0.5">{log.challenges}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-50">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Next Target Milestone</span>
                          <span className="text-xs font-bold text-slate-800 font-display">{log.nextMilestone}</span>
                        </div>

                        {evidenceLink && (
                          <a
                            href={evidenceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 px-3 py-1.5 rounded-lg transition-colors font-display"
                          >
                            View Evidence
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Mentor review block (if reviewed) */}
                    {isReviewed && (
                      <div className="mt-5 pt-4 border-t border-dashed border-slate-200/80 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">M</span>
                            <span className="text-xs font-bold text-slate-800 font-display">Mentor Rating Card</span>
                          </div>
                          {renderStars(log.mentorRating)}
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed font-sans italic bg-white p-3 rounded-xl border border-slate-100 mt-2 flex gap-1.5">
                          <MessageSquare className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block text-slate-500 not-italic text-[10px] uppercase tracking-wide">Mentor Comments:</span>
                            "{log.mentorComment || 'Weekly milestones validated. Keep building!'}"
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProgressTimeline;
