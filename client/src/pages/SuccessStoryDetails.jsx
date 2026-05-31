import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, ChevronLeft, Target, Calendar, DollarSign, Sparkles } from 'lucide-react';

const SuccessStoryDetails = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/stories/${id}`);
        setStory(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('Case study details could not be found or are not available.');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
          <div className="h-32 w-full bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Award className="h-10 w-10 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-display font-extrabold text-slate-900">Case Study Missing</h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <div className="mt-6">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all font-display"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-12">
      {/* Decorative Blob */}
      <div className="absolute top-10 left-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 right-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 font-display"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Achievements Gallery
          </Link>
        </div>

        {/* Story details layout */}
        <div className="glass-panel rounded-3xl bg-white border border-slate-200/40 shadow-lg overflow-hidden">
          {/* Banner image */}
          <div className="h-72 w-full bg-slate-100 overflow-hidden relative shrink-0">
            <img
              src={story.coverImage ? `/${story.coverImage}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=60'}
              alt={story.startupName}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600/90 text-white font-sans uppercase mb-2">
                Validated Success Study
              </span>
              <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">{story.startupName}</h1>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8">
            {/* Quick badges metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Primary Founder</span>
                <span className="text-sm font-bold text-slate-800 font-display mt-0.5 block">{story.founderName}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Major Achievement</span>
                <span className="text-sm font-bold text-slate-800 font-display mt-0.5 block truncate" title={story.achievement}>
                  {story.achievement}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Funding Raised</span>
                <span className="text-sm font-bold text-indigo-755 font-display mt-0.5 block">INR {story.fundingRaised || 'Bootstrapped'}</span>
              </div>
            </div>

            {/* Story text */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-50 text-indigo-600"><Target className="h-4 w-4" /></span>
                  Awards & Recognitions
                </h2>
                <div className="p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl text-slate-700 text-sm font-semibold font-sans">
                  {story.awards || 'No specific awards listed.'}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="p-1 rounded bg-purple-50 text-purple-600"><Sparkles className="h-4 w-4" /></span>
                  The Incubation Journey
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed font-sans whitespace-pre-line">
                  {story.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStoryDetails;
