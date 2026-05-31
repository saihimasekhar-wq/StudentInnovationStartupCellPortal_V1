import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Award, Sparkles, Target, ArrowRight, Layers, FileText, DollarSign, Calendar } from 'lucide-react';

const SuccessGallery = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/stories');
        setStories(res.data || []);
      } catch (err) {
        console.error('Error fetching success stories:', err);
        setError('Failed to load cell achievements gallery. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-12">
      {/* Decorative Blob */}
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 mb-4 font-display">
            <Award className="h-3.5 w-3.5" />
            Ecosystem Milestones
          </div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Success Story Gallery
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Celebrating our student startup ecosystem. Meet the founders, researchers, and builders who scaled prototypes to validated businesses.
          </p>
        </div>

        {/* Content grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-white animate-pulse border border-slate-200/40 p-6 flex flex-col justify-between">
                <div className="h-48 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/40 shadow-sm max-w-md mx-auto">
            <p className="text-rose-600 font-semibold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-xs font-semibold text-indigo-600 underline">Reload page</button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-md max-w-xl mx-auto">
            <Award className="h-14 w-14 text-indigo-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-slate-800 font-display">Gallery Coming Soon</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Our startup cell vetting board is compiling dynamic profiles of this batch's milestones. Check back shortly to meet our founders!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map(item => (
              <div key={item._id} className="glass-panel bg-white/95 rounded-3xl border border-slate-100/80 shadow-md flex flex-col justify-between overflow-hidden hover-glow">
                
                {/* Story Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.coverImage ? `/${item.coverImage}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60'}
                    alt={item.startupName}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                  <span className="absolute top-4 left-4 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-indigo-600 text-white font-sans shadow-md">
                    Milestone Achieved
                  </span>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2.5 mb-6">
                    <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight leading-tight">{item.startupName}</h3>
                    <p className="text-xs text-slate-450 font-sans">Founder: <span className="font-semibold text-slate-700">{item.founderName}</span></p>
                    
                    <div className="inline-flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 w-full mt-2">
                      <Target className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 truncate">{item.achievement}</span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-sans line-clamp-3 pt-2">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Funding Raised</span>
                      <span className="text-xs font-bold text-slate-800 font-display">INR {item.fundingRaised || 'Bootstrapped'}</span>
                    </div>

                    <Link
                      to={`/gallery/${item._id}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs font-display transition-colors"
                    >
                      Read Case Study
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessGallery;
