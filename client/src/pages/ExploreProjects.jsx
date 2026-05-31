import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Rocket, Lightbulb, Search, Filter, Sparkles, Building, Layers, Eye, BookOpen } from 'lucide-react';

const ExploreProjects = () => {
  const [startups, setStartups] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('startups'); // startups or proposals

  const categories = ['All', 'IT & SaaS', 'AI & DeepTech', 'BioTech', 'CleanTech', 'EdTech', 'FinTech', 'Hardware & IoT', 'Healthcare'];

  const fetchData = async (query = '') => {
    try {
      setLoading(true);
      // Use '.' as a wildcard to fetch everything if query is empty
      const apiQuery = query.trim() || '.';
      const res = await axios.get(`/api/search?q=${encodeURIComponent(apiQuery)}`);
      
      setStartups(res.data.startups || []);
      setProposals(res.data.proposals || []);
      setError(null);
    } catch (err) {
      console.error('Error exploring cell hub:', err);
      setError('Failed to fetch project registry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(searchTerm);
  };

  const filteredStartups = startups.filter(s => {
    if (categoryFilter === 'All') return true;
    return s.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  const filteredProposals = proposals.filter(p => {
    if (categoryFilter === 'All') return true;
    return p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden py-10">
      {/* Decorative Blob */}
      <div className="absolute top-20 right-10 w-96 h-96 blur-blob-1 rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-20 left-10 w-96 h-96 blur-blob-2 rounded-full pointer-events-none opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 mb-4 font-display">
            <Sparkles className="h-3.5 w-3.5" />
            Approved Project Registry
          </div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Explore Campus Innovations
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Discover vetted student startups and verified technical proposals backed by the college incubation wing.
          </p>
        </div>

        {/* Search and Filters Panel */}
        <div className="glass-panel rounded-2xl p-6 bg-white/70 border border-slate-200/40 shadow-sm mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, founder, category, or core keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/80 transition-all font-sans text-slate-800"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/10 transition-all font-display shrink-0"
            >
              Search Hub
            </button>
          </form>

          {/* Categories Filters list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center gap-1 text-slate-400 font-semibold text-xs uppercase tracking-wider shrink-0 mr-2">
              <Filter className="h-4 w-4" />
              <span>Sector:</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-display border transition-all shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('startups')}
            className={`flex items-center gap-2 pb-3.5 px-6 font-display font-bold text-sm tracking-tight border-b-2 transition-all ${
              activeTab === 'startups'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-450 hover:text-slate-700'
            }`}
          >
            <Rocket className="h-4 w-4" />
            Vetted Startups ({filteredStartups.length})
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
            Research Proposals ({filteredProposals.length})
          </button>
        </div>

        {/* Content Listing */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white animate-pulse border border-slate-200/40 p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-6 w-48 bg-slate-200 rounded"></div>
                  <div className="h-12 w-full bg-slate-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-rose-600 font-semibold">{error}</p>
            <button onClick={() => fetchData()} className="mt-4 text-xs font-semibold text-indigo-600 underline">Try again</button>
          </div>
        ) : activeTab === 'startups' ? (
          /* Startups Feed Grid */
          filteredStartups.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm">
              <Building className="h-12 w-12 text-slate-355 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 font-display">No Approved Startups Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                No verified startup listings fit the selected criteria. Try adjusting filters or typing another keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {filteredStartups.map(item => (
                <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-6 border border-indigo-50/50 shadow-sm flex flex-col justify-between hover-glow">
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-sans">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-450 font-mono font-medium bg-slate-50 px-2 py-0.5 rounded">
                        {item.stage}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-display mb-1 truncate">{item.startupName}</h3>
                    <p className="text-xs text-slate-500 font-sans mb-3">Founder: <span className="font-semibold text-slate-700">{item.founderName}</span></p>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-550 font-sans font-semibold">
                      Req: <span className="text-slate-850 font-display font-bold">INR {item.fundingRequired}</span>
                    </span>
                    <Link
                      to={`/startup/${item._id}`}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 font-display bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Proposals Feed Grid */
          filteredProposals.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm">
              <Layers className="h-12 w-12 text-slate-355 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 font-display">No Approved Proposals Found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                No innovation proposals match the category or keyword query at this moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {filteredProposals.map(item => (
                <div key={item._id} className="glass-panel bg-white/95 rounded-2xl p-6 border border-indigo-50/50 shadow-sm flex flex-col justify-between hover-glow">
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-sans">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-450 font-mono font-medium bg-slate-50 px-2 py-0.5 rounded">
                        {item.department}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-display mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-sans mb-4">Team: <span className="font-semibold text-slate-700">{item.teamMembers || 'Student Team'}</span></p>
                    
                    <p className="text-slate-650 text-sm leading-relaxed mb-6 font-sans line-clamp-3">
                      {item.abstract}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-sans">
                      Tech: <span className="font-semibold text-slate-700 truncate max-w-[120px] inline-block align-bottom">{item.technologies}</span>
                    </span>
                    <button
                      onClick={() => alert(`Research proposal documentation is archived. If you are an ecosystem member, please sign in to request access to: ${item.title}`)}
                      className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 font-display bg-purple-50/50 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Read Abstract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ExploreProjects;
