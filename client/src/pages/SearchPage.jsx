import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Rocket, Lightbulb, User, Award, ArrowRight, ChevronRight } from 'lucide-react';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search term from URL query parameter (?q=xyz)
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const [queryInput, setQueryInput] = useState(initialQuery);

  const fetchResults = async (q) => {
    if (!q) {
      setResults({ startups: [], proposals: [], mentors: [], successStories: [] });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`/api/search?q=${encodeURIComponent(q)}`);
      setResults(res.data);
      setError(null);
    } catch (err) {
      console.error('Search API failure:', err);
      setError('Search lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQueryInput(initialQuery);
    fetchResults(initialQuery);
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(queryInput.trim())}`);
    }
  };

  const totalResults = results
    ? (results.startups?.length || 0) +
      (results.proposals?.length || 0) +
      (results.mentors?.length || 0) +
      (results.successStories?.length || 0)
    : 0;

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-12">
      <div className="absolute top-10 right-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-10 left-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search header Form */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSearchSubmit} className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search startups, innovation proposals, mentors, stories..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/80 transition-all font-sans text-slate-800"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-md transition-all font-display shrink-0"
            >
              Search
            </button>
          </form>
          {initialQuery && !loading && (
            <p className="text-xs text-slate-450 mt-3 font-sans">
              Found <span className="font-semibold text-slate-700">{totalResults} matches</span> for keyword "{initialQuery}"
            </p>
          )}
        </div>

        {/* Results layout */}
        {loading ? (
          <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
            <div className="h-28 bg-slate-200 rounded-2xl"></div>
            <div className="h-28 bg-slate-200 rounded-2xl"></div>
            <div className="h-28 bg-slate-200 rounded-2xl"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
            <p className="text-rose-600 font-semibold">{error}</p>
          </div>
        ) : !initialQuery ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-sm max-w-md mx-auto">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 font-display">Enter a Search Term</h3>
            <p className="text-xs text-slate-500 mt-1">Type in a keyword above to find startups, mentors, or proposals.</p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-sm max-w-md mx-auto">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 font-display">No Matches Found</h3>
            <p className="text-xs text-slate-500 mt-1">We couldn't find anything matching "{initialQuery}". Try adjusting spelling or filters.</p>
          </div>
        ) : (
          <div className="space-y-10 max-w-5xl mx-auto">
            
            {/* Startups results block */}
            {results.startups?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-indigo-500" />
                  Matching Startups ({results.startups.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.startups.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-5 border border-indigo-50/40 shadow-sm flex flex-col justify-between hover-glow">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-base font-bold text-slate-900 font-display truncate">{item.startupName}</h3>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-650 shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mb-3">Founder: {item.founderName}</p>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <Link
                          to={`/startup/${item._id}`}
                          className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 font-display"
                        >
                          View Profile
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals block */}
            {results.proposals?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  Matching Proposals ({results.proposals.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.proposals.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-5 border border-indigo-50/40 shadow-sm flex flex-col justify-between hover-glow">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-base font-bold text-slate-900 font-display line-clamp-1">{item.title}</h3>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-655 shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mb-3">Technologies: {item.technologies}</p>
                        <p className="text-slate-650 text-xs leading-relaxed line-clamp-2">{item.abstract}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <Link
                          to="/explore"
                          className="flex items-center gap-0.5 text-xs font-bold text-purple-600 hover:text-purple-700 font-display"
                        >
                          Explore proposals feed
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentors block */}
            {results.mentors?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-teal-500" />
                  Matching Mentors ({results.mentors.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.mentors.map((item, idx) => (
                    <div key={idx} className="glass-panel bg-white/95 rounded-2xl p-5 border border-indigo-50/40 shadow-sm flex gap-3 hover-glow">
                      <div className="h-10 w-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-bold font-display">
                        {item.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 font-display">{item.name}</h3>
                        <p className="text-[10px] text-slate-450 font-sans">{item.designation}</p>
                        <p className="text-slate-650 text-xs mt-1.5"><span className="font-semibold text-slate-800">Expertise:</span> {item.expertise}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Stories block */}
            {results.successStories?.length > 0 && (
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Matching Achievements ({results.successStories.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.successStories.map(item => (
                    <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-5 border border-indigo-50/40 shadow-sm flex flex-col justify-between hover-glow">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-base font-bold text-slate-900 font-display truncate">{item.startupName} Success Study</h3>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-650 shrink-0">
                            {item.achievement}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-sans mb-3">Founder: {item.founderName}</p>
                        <p className="text-slate-605 text-xs leading-relaxed line-clamp-2">{item.content}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <Link
                          to={`/gallery/${item._id}`}
                          className="flex items-center gap-0.5 text-xs font-bold text-amber-600 hover:text-amber-700 font-display"
                        >
                          Read Story Case
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
