import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Rocket, Sparkles, Globe, Video, User, Briefcase, DollarSign, Calendar, ChevronLeft, Download, ShieldCheck, Mail, Phone, Users } from 'lucide-react';

const StartupShowcase = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/startups/public/${id}`);
        setStartup(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching startup:', err);
        const message = err.response?.data?.message || 'Approved startup profile not found or access restricted.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchStartup();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-10 w-2/3 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-32 w-full bg-slate-200 rounded"></div>
          </div>
          <div className="lg:col-span-4 h-64 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-rose-50 text-rose-500 rounded-2xl mb-4">
          <Rocket className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-slate-900">Profile Unavailable</h2>
        <p className="mt-2 text-sm text-slate-500">{error || 'This startup might be pending approval or does not exist.'}</p>
        <div className="mt-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all font-display"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  // Format pitch deck link
  const pitchDeckUrl = startup.pitchDeck ? `/${startup.pitchDeck}` : null;
  const logoUrl = startup.logo ? `/${startup.logo}` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60';

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-10">
      {/* Decorative Blob */}
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 font-display"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Discover Feed
          </Link>
        </div>

        {/* Profile Banner Card */}
        <div className="glass-panel rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 border border-slate-800 shadow-xl text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
              {/* Logo container */}
              <div className="h-24 w-24 rounded-2xl bg-white border border-slate-700/50 p-2 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt={startup.startupName} className="h-full w-full object-contain rounded-xl" />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-sans">
                    {startup.category}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-sans">
                    {startup.stage}
                  </span>
                  <span className="flex items-center gap-0.5 text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Cell Startup
                  </span>
                </div>
                <h1 className="text-3xl font-display font-extrabold tracking-tight">{startup.startupName}</h1>
                <p className="mt-1.5 text-slate-300 text-sm font-sans max-w-xl leading-relaxed">
                  {startup.description}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 mt-4 md:mt-0 w-full md:w-auto">
              {startup.website && (
                <a
                  href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold font-display transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              )}
              {pitchDeckUrl && (
                <a
                  href={pitchDeckUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold font-display transition-all shadow-md shadow-indigo-600/10"
                >
                  <Download className="h-4 w-4" />
                  Download Pitch Deck
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Showcase Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Problem Statement & Solution */}
            <div className="glass-panel rounded-3xl bg-white p-8 border border-slate-200/40 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-50 text-indigo-600"><Rocket className="h-4 w-4" /></span>
                  The Problem Statement
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed font-sans">
                  {startup.problemStatement}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-50 text-emerald-600"><Sparkles className="h-4 w-4" /></span>
                  The Proposed Solution
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed font-sans">
                  {startup.solution}
                </p>
              </div>
            </div>

            {/* Video Demo (if available) */}
            {startup.videoUrl && (
              <div className="glass-panel rounded-3xl bg-white p-8 border border-slate-200/40 shadow-sm">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="p-1 rounded bg-pink-50 text-pink-600"><Video className="h-4 w-4" /></span>
                  Video Demonstration
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 shadow-inner flex items-center justify-center">
                  {/* Parse and embed YouTube player nicely, or fallback to external preview card */}
                  {startup.videoUrl.includes('youtube.com') || startup.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        startup.videoUrl.includes('v=') 
                          ? startup.videoUrl.split('v=')[1]?.split('&')[0] 
                          : startup.videoUrl.split('/').pop()
                      }`}
                      title={`${startup.startupName} Demo`}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-center p-8">
                      <Video className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">External Video Demo Available</p>
                      <p className="text-xs text-slate-400 mt-1 mb-4">Click below to watch this startup's product pitch presentation.</p>
                      <a
                        href={startup.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Watch Video Demopage
                        <Globe className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Stats & Contacts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Startup Metrics panel */}
            <div className="glass-panel rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm">
              <h3 className="text-base font-display font-bold text-slate-900 mb-4 pb-2.5 border-b border-slate-100">
                Core Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Funding Required</span>
                    <span className="text-sm font-bold text-slate-800 font-display">INR {startup.fundingRequired}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Startup Stage</span>
                    <span className="text-sm font-bold text-slate-800 font-display">{startup.stage}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Team Composition</span>
                    <span className="text-sm font-bold text-slate-800 font-display">{startup.teamSize} Executive Members</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Registered on Cell</span>
                    <span className="text-sm font-bold text-slate-800 font-mono text-xs">{new Date(startup.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Mentor Info */}
            <div className="glass-panel rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm">
              <h3 className="text-base font-display font-bold text-slate-900 mb-4 pb-2.5 border-b border-slate-100">
                Cell Assigned Mentor
              </h3>
              {startup.assignedMentor ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 font-bold">
                      {startup.assignedMentor.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-display">{startup.assignedMentor.name}</h4>
                      <p className="text-[11px] text-slate-500">{startup.assignedMentor.designation}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-sans tracking-wide">Expertise Focus</span>
                    <span className="text-xs font-semibold text-slate-700">{startup.assignedMentor.expertise}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <User className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">Unassigned</p>
                  <p className="text-[10px] text-slate-450 mt-0.5">Cell panel mentor allocation is currently pending.</p>
                </div>
              )}
            </div>

            {/* Team details & Contact */}
            <div className="glass-panel rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm">
              <h3 className="text-base font-display font-bold text-slate-900 mb-4 pb-2.5 border-b border-slate-100">
                Founding Partners
              </h3>
              
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-sans">Primary Founder</span>
                  <span className="text-xs font-bold text-slate-800 font-display">{startup.founderName}</span>
                </div>
                {startup.coFounderName && (
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-sans">Co-Founder</span>
                    <span className="text-xs font-bold text-slate-800 font-display">{startup.coFounderName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 font-sans">Department</span>
                  <span className="text-xs font-bold text-slate-800 font-display">{startup.department}</span>
                </div>
              </div>

              {/* Public email and phone */}
              <div className="space-y-2">
                <a
                  href={`mailto:${startup.email}`}
                  className="flex items-center gap-2 p-2 bg-indigo-50/30 hover:bg-indigo-50 border border-indigo-100/50 rounded-xl text-xs text-indigo-700 font-semibold transition-colors w-full"
                >
                  <Mail className="h-4 w-4" />
                  Email: {startup.email}
                </a>
                <a
                  href={`tel:${startup.phone}`}
                  className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-xl text-xs text-slate-700 font-semibold transition-colors w-full"
                >
                  <Phone className="h-4 w-4" />
                  Phone: {startup.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupShowcase;
