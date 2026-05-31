import React from 'react';
import { X, Sparkles, Rocket, Cpu, Calendar, ShieldCheck, TrendingUp, Bell, FileSpreadsheet, Layers } from 'lucide-react';

const ComingSoonModal = ({ isOpen, onClose, moduleName }) => {
  if (!isOpen) return null;

  // Dictionary of module titles and descriptions
  const moduleInfo = {
    'Startup Register': {
      icon: <Rocket className="h-10 w-10 text-indigo-500" />,
      desc: 'Register and profile your student-led startup. Manage company registration numbers, founder equity structures, cap tables, and legal structures all in one secure portal.',
    },
    'Proposal Form': {
      icon: <Sparkles className="h-10 w-10 text-purple-500" />,
      desc: 'Submit and file your innovation, product design, or research proposal. Upload files, outline problem statements, and submit to the Academic Review Committee.',
    },
    'Incubation Apply': {
      icon: <Cpu className="h-10 w-10 text-pink-500" />,
      desc: 'Apply for physical co-working desks, laboratory resources, compute servers, cloud credits, and college funding programs for startup incubation.',
    },
    'Mentor Assign': {
      icon: <Layers className="h-10 w-10 text-teal-500" />,
      desc: 'Connect with industry mentors, startup veterans, venture capitalists, and academic research advisors. Schedule 1-on-1 reviews and get feedback.',
    },
    'Progress Tracker': {
      icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
      desc: 'Track your startup Milestones, Key Performance Indicators (KPIs), product releases, customer acquisition charts, and funding rounds.',
    },
    'Success Gallery': {
      icon: <Calendar className="h-10 w-10 text-amber-500" />,
      desc: 'Browse successful alumni-founded startups, funding milestones, media highlights, awards, patent disclosures, and student founder success stories.',
    },
    'Notifications': {
      icon: <Bell className="h-10 w-10 text-rose-500" />,
      desc: 'Stay updated on pitch nights, hackathons, VC demo days, grant applications, bootcamps, and workshops hosted by the college Startup Cell.',
    },
    'Export Reports': {
      icon: <FileSpreadsheet className="h-10 w-10 text-emerald-500" />,
      desc: 'Export structured CSV and PDF reports outlining registered student count, active startups, milestone progress, and funding utilization for administrative reviews.',
    },
    'Admin Panel': {
      icon: <ShieldCheck className="h-10 w-10 text-indigo-600" />,
      desc: 'Administrative command center. Approve proposal submissions, evaluate incubation space availability, assign mentors, and manage portal security roles.',
    },
    'History': {
      icon: <Calendar className="h-10 w-10 text-slate-500" />,
      desc: 'Access your portal transaction log, audit trails of past proposal submissions, historical feedback reports, and previous incubation application statuses.',
    }
  };

  const currentInfo = moduleInfo[moduleName] || {
    icon: <Sparkles className="h-10 w-10 text-indigo-500" />,
    desc: 'This module is currently undergoing development and will be released in the upcoming portal update. Stay tuned!',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="glass-panel w-full max-w-md overflow-hidden rounded-2xl bg-white/90 p-6 shadow-2xl transition-all duration-300 transform scale-100 border border-indigo-100 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          {/* Circular Animated Blob Icon Wrapper */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50/80 mb-4 animate-pulse-glow">
            {currentInfo.icon}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">
            {moduleName}
          </h3>
          
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-4 font-display">
            Module Coming Soon
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
            {currentInfo.desc}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 text-sm font-display"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
