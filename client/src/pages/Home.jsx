import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Rocket, Sparkles, Cpu, Layers, TrendingUp, Calendar, 
  Bell, FileSpreadsheet, ShieldCheck, ArrowRight, Award, 
  Users, Bookmark, Lightbulb, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatisticsSection from '../components/StatisticsSection';

const Home = ({ onTriggerComingSoon }) => {
  const { isAuthenticated, user } = useAuth();
  const [successStories, setSuccessStories] = useState([]);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const res = await axios.get('/api/stories');
        if (res.data && res.data.length > 0) {
          setSuccessStories(res.data.slice(0, 3));
        } else {
          throw new Error('No stories');
        }
      } catch (err) {
        console.error('Failed to fetch home success stories:', err);
        // Fallback seed stories if empty
        setSuccessStories([
          {
            _id: 'seed_1',
            startupName: 'EduAI Solutions',
            founderName: 'Aditya Sen (CSE Class of \'25)',
            achievement: 'Valuation: ₹2.2 Crores',
            content: 'An AI-powered adaptive tutoring platform catering to secondary school students. Raised ₹25 Lakhs in seed round funding.',
            awards: 'Best Campus Startup 2025'
          },
          {
            _id: 'seed_2',
            startupName: 'EcoDrive Motors',
            founderName: 'Riya Patel & Team (Mech + EEE \'24)',
            achievement: 'Grant Funded: ₹10 Lakhs',
            content: 'Building affordable electric conversion kits for commercial two-wheelers. Received NIDHI-PRAYAS government research grant.',
            awards: 'NIDHI-PRAYAS Grant Winner'
          },
          {
            _id: 'seed_3',
            startupName: 'TheraPrint Biotech',
            founderName: 'Dr. Vivek Nair (Biotech Research Scholar)',
            achievement: 'Patents: 2 Disclosed',
            content: 'Developing low-cost 3D bioprinters for pharmaceutical tissue-scaffold testing. Patented technology, incubating at College Phase-II.',
            awards: '2 Biotech Patents Filed'
          }
        ]);
      }
    };
    fetchTopStories();
  }, []);

  // Feature cards data
  const features = [
    {
      title: 'Startup Registration',
      desc: 'Formally register your student-led business. Establish executive roles, structure cap tables, and file organizational charts.',
      icon: <Rocket className="h-6 w-6 text-indigo-600" />,
      to: isAuthenticated ? '/startup-register' : '/login',
    },
    {
      title: 'Proposal Submission',
      desc: 'Submit your raw product design or innovation ideas. Get evaluated by college faculty and receive research grants.',
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      to: isAuthenticated ? '/proposal-form' : '/login',
    },
    {
      title: 'Incubation Space',
      desc: 'Apply for co-working hot desks, maker space access, advanced lab equipment access, and cloud computing credits.',
      icon: <Cpu className="h-6 w-6 text-pink-600" />,
      to: isAuthenticated ? '/incubation-apply' : '/login',
    },
    {
      title: 'Mentor Assignment',
      desc: 'Schedule private advising sessions with industry veterans, legal advisers, patent experts, and VC funds.',
      icon: <Layers className="h-6 w-6 text-teal-600" />,
      to: isAuthenticated ? '/dashboard' : '/login',
    },
    {
      title: 'Progress Tracker',
      desc: 'Log business milestones, product mockups, customer validation surveys, and timeline achievements.',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      to: isAuthenticated ? '/progress-submit' : '/login',
    },
    {
      title: 'Success Gallery',
      desc: 'Browse startup profiles, patent filings, media coverage articles, and fundraising announcements.',
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
      to: '/gallery',
    },
    {
      title: 'Broad Notifications',
      desc: 'Receive alerts about upcoming pitch nights, hackathons, incubator applications, and government grants.',
      icon: <Bell className="h-6 w-6 text-rose-600" />,
      to: isAuthenticated ? '/dashboard' : '/login',
    },
    {
      title: 'Report Exports',
      desc: 'Generate administrative reports regarding student engagement, startup growth, and resources consumed.',
      icon: <FileSpreadsheet className="h-6 w-6 text-emerald-600" />,
      to: '/admin/login',
    },
    {
      title: 'Admin Dashboard',
      desc: 'Verify student eligibility, review submitted business plans, allocate spaces, and audit mentor sessions.',
      icon: <ShieldCheck className="h-6 w-6 text-indigo-700" />,
      to: '/admin/login',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-blob-1 blur-3xl pointer-events-none" />
      <div className="absolute top-[600px] right-20 w-96 h-96 rounded-full blur-blob-2 blur-3xl pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-28 bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 mb-6 font-display animate-pulse-glow">
            <Sparkles className="h-3.5 w-3.5" />
            Empowering Campus Entrepreneurs
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display max-w-4xl mx-auto leading-none mb-6">
            Ignite Your Ideas, Build the <span className="gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Future of Business</span>
          </h1>
          
          <p className="text-lg text-slate-650 max-w-2xl mx-auto leading-relaxed mb-10 font-sans">
            Welcome to the Student Innovation & Startup Cell Portal. We provide the mentorship, funding pathways, co-working infrastructure, and community to accelerate your startup from napkin sketch to market launch.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isAuthenticated ? (
              <div className="flex flex-col items-center">
                <span className="text-sm text-slate-600 mb-2 font-semibold">Welcome back, {user?.fullName}!</span>
                <div className="flex gap-4">
                  <Link
                    to="/startup-register"
                    className="flex items-center gap-2 py-3.5 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all font-display group text-sm"
                  >
                    Register Your Startup
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/proposal-form"
                    className="py-3.5 px-7 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all font-display text-sm flex items-center justify-center"
                  >
                    Submit Proposal
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 py-3.5 px-7 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all font-display group text-sm"
                >
                  Apply for Incubation
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="py-3.5 px-7 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all font-display text-sm"
                >
                  Student Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <StatisticsSection />

      {/* 3. About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans">
                About the Innovation Cell
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight">
                Nurturing Academic Talents into Enterprise Leaders
              </h2>
              <p className="text-slate-650 text-base leading-relaxed font-sans">
                The Student Innovation & Startup Cell serves as the central hub of entrepreneurial action on campus. We bridge the gap between academic theory and market validation, offering student founders access to specialized technology infrastructure, seed funding networks, intellectual property filing advisory services, and physical incubator workspace.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex gap-3 items-start">
                  <div className="flex items-center justify-center p-1 bg-indigo-150 rounded-lg text-indigo-700 shrink-0 mt-0.5">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 font-display">Seed Grants</h4>
                    <p className="text-xs text-slate-500">Access to state and private incubation funding cycles.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="flex items-center justify-center p-1 bg-indigo-150 rounded-lg text-indigo-700 shrink-0 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 font-display">Elite Mentorship</h4>
                    <p className="text-xs text-slate-500">1-on-1 feedback from industry founders and tech veterans.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-10" />
              <div className="relative glass-panel rounded-3xl p-8 bg-white/80 border border-slate-200/80 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 font-display mb-4">Core Ecosystem Benefits</h3>
                <ul className="space-y-4 text-sm text-slate-650">
                  <li className="flex gap-3 items-start">
                    <span className="h-5 w-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span>No-cost workspace with high-speed internet, compute pools, and laboratory assets.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="h-5 w-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span>Pre-seed grant pools of up to ₹10 Lakhs for validated prototypes.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="h-5 w-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span>Free patent search databases and academic attorney consultations.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="h-5 w-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span>Academic credits conversion for certified incubation milestones.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Vision & Mission Section */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Vision card */}
            <div className="glass-panel-dark rounded-2xl p-8 hover:border-slate-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-6">
                <Bookmark className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight mb-4">Our Vision</h3>
              <p className="text-slate-300 text-base leading-relaxed font-sans">
                To build a world-class technology-driven academic startup incubator that acts as a catalyst for local economic development, fostering a high-integrity generation of student innovators who build globally viable, scalable enterprise solutions.
              </p>
            </div>

            {/* Mission card */}
            <div className="glass-panel-dark rounded-2xl p-8 hover:border-slate-700 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 text-purple-400 rounded-xl mb-6">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-display tracking-tight mb-4">Our Mission</h3>
              <p className="text-slate-300 text-base leading-relaxed font-sans">
                To identify, support, and fund early-stage ideas on campus; to provide continuous mentoring pipelines from industry partners; to simplify administrative compliance for student startup registration; and to secure institutional funding networks.
              </p>
            </div>
          </div>
        </div>
        {/* 5. Features Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight mb-4">
              Explore Our Core Startup Modules
            </h2>
            <p className="text-slate-650 leading-relaxed font-sans">
              Interact with the foundational blocks of the portal. Registered students can apply for incubation, check milestones, schedule mentor meetups, and export performance charts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => {
              const cardContent = (
                <>
                  <div>
                    <div className="inline-flex items-center justify-center p-3.5 bg-indigo-50 rounded-xl mb-5 text-indigo-650 transition-colors group-hover:bg-indigo-650 group-hover:text-white shrink-0">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display mb-2 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-550 text-sm leading-relaxed mb-6 font-sans">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-605 group-hover:underline font-display">
                    Launch Module
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </>
              );

              if (feature.to) {
                return (
                  <Link
                    key={idx}
                    to={feature.to}
                    className="glass-panel rounded-2xl p-6 bg-white hover-glow border border-slate-200/50 flex flex-col justify-between group"
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={idx}
                  onClick={() => onTriggerComingSoon(feature.title)}
                  className="glass-panel rounded-2xl p-6 bg-white hover-glow border border-slate-200/50 cursor-pointer flex flex-col justify-between group"
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Success Stories Preview Section */}
      <section className="py-20 bg-slate-150/40 backdrop-blur-sm border-t border-slate-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans mb-2">
                Student Accomplishments
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight">
                Featured Startup Success Stories
              </h2>
            </div>
            <Link
              to="/gallery"
              className="flex items-center gap-1 text-sm font-semibold text-indigo-605 hover:text-indigo-700 hover:underline mt-4 md:mt-0 font-display"
            >
              Browse Gallery Archive
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {successStories.map((story, idx) => (
              <div 
                key={idx}
                className="glass-panel bg-white/95 border border-indigo-50/50 rounded-2xl p-6 shadow-md flex flex-col justify-between hover-glow"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-sans truncate max-w-[120px]" title={story.awards || 'Verified'}>
                      {story.awards || 'Ecosystem Success'}
                    </span>
                    <span className="text-xs text-slate-400 font-sans shrink-0">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 font-display mb-1 truncate">
                    {story.startupName}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-650 mb-4 font-sans truncate">
                    {story.founderName}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans line-clamp-3">
                    {story.content}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs font-bold text-slate-800 font-display flex items-center gap-1.5 mt-2">
                  <Award className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{story.achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      </section>

    </div>
  );
};

export default Home;
