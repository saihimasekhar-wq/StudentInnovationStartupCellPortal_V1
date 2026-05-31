import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Rocket, Lightbulb, UserCheck, ShieldCheck, FileCheck, CheckCircle2, Award } from 'lucide-react';

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercent = Math.min(progress / duration, 1);
      setCount(Math.floor(progressPercent * end));

      if (progressPercent < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}</span>;
};

const StatisticsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/public/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch public stats', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse border border-slate-100 flex flex-col justify-center px-6 gap-2 shadow-sm">
            <div className="h-4 w-12 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const statItems = [
    { label: 'Registered Students', val: stats.totalStudents, icon: <Users className="h-5 w-5 text-indigo-600" />, desc: 'Active student accounts' },
    { label: 'Total Startups', val: stats.totalStartups, icon: <Rocket className="h-5 w-5 text-purple-600" />, desc: 'Initiatives registered' },
    { label: 'Approved Startups', val: stats.approvedStartups, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, desc: 'Vetted by cell panel' },
    { label: 'Submitted Proposals', val: stats.totalProposals, icon: <Lightbulb className="h-5 w-5 text-pink-600" />, desc: 'Ideas and innovations' },
    { label: 'Approved Proposals', val: stats.approvedProposals, icon: <FileCheck className="h-5 w-5 text-teal-600" />, desc: 'Vetted research works' },
    { label: 'Active Mentors', val: stats.totalMentors, icon: <UserCheck className="h-5 w-5 text-sky-600" />, desc: 'Expert guides assigned' },
    { label: 'Incubation Requests', val: stats.incubationApplications, icon: <ShieldCheck className="h-5 w-5 text-blue-600" />, desc: 'Workspace requests' },
    { label: 'Success Stories', val: stats.successStories, icon: <Award className="h-5 w-5 text-amber-600" />, desc: 'Ecosystem milestones' },
  ];

  return (
    <section className="relative overflow-hidden py-16 bg-slate-50/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      <div className="absolute -top-40 -left-40 h-96 w-96 blur-blob-1 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 h-96 w-96 blur-blob-2 rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-bold text-slate-900 sm:text-4xl">
            Real-time Cell Hub Metrics
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Live counts tracking the growth, applications, and performance achievements of our college startup cell.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white/70 hover:bg-white backdrop-blur-md rounded-2xl p-6 border border-slate-100/80 hover:border-indigo-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/50 transition-colors">
                  {item.icon}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">Live</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                <CountUp end={item.val} />
              </p>
              <h3 className="text-sm font-semibold text-slate-800 mt-1 font-display">{item.label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
