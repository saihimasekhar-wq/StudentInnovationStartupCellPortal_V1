import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, LogOut, User, Bell, ChevronDown, Search,
  Rocket, Sparkles, Cpu, Layers, TrendingUp, Calendar, ShieldCheck
} from 'lucide-react';

const Navbar = ({ onTriggerComingSoon }) => {
  const { user, isAuthenticated, logout, notifications, fetchNotifications } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Get active dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'mentor') return '/mentor/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo and Brand */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/10 group-hover:scale-105 transition-all">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg leading-tight tracking-tight text-slate-900 hidden sm:block">
                SISCP <span className="text-indigo-650 block text-[10px] font-medium font-sans tracking-widest uppercase">College Startup Cell</span>
              </span>
            </Link>
          </div>

          {/* Centered Premium Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-sm w-full mx-4 relative">
            <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search startups, proposals, mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-xs text-slate-800 transition-all"
            />
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 shrink-0">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-bold font-display transition-all ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg text-xs font-bold font-display transition-all ${
                isActive('/explore') 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Explore Registry
            </Link>

            {/* Modules Dropdown */}
            {isAuthenticated && user?.role === 'student' && (
              <div className="relative">
                <button
                  onClick={() => {
                    setModulesDropdownOpen(!modulesDropdownOpen);
                    setNotificationsOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold font-display text-slate-650 hover:text-slate-900 hover:bg-slate-100/60 transition-all"
                >
                  Filings Desk
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${modulesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {modulesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <Link
                      to="/startup-register"
                      onClick={() => setModulesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-650 font-bold transition-all"
                    >
                      <Rocket className="h-4 w-4 text-indigo-500 shrink-0" />
                      Register Startup
                    </Link>
                    <Link
                      to="/proposal-form"
                      onClick={() => setModulesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-650 font-bold transition-all"
                    >
                      <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                      Submit Proposal
                    </Link>
                    <Link
                      to="/incubation-apply"
                      onClick={() => setModulesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-teal-650 font-bold transition-all"
                    >
                      <Cpu className="h-4 w-4 text-teal-500 shrink-0" />
                      Incubation Space
                    </Link>
                    <Link
                      to="/progress-submit"
                      onClick={() => setModulesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-650 font-bold transition-all"
                    >
                      <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
                      Track Progress
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-lg text-xs font-bold font-display transition-all ${
                isActive('/gallery') 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Success Stories
            </Link>
          </div>

          {/* Desktop Right Panel (Auth & Notifications) */}
          <div className="hidden lg:flex items-center space-x-4 shrink-0">
            {/* Notification bell */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setModulesDropdownOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100/60 rounded-xl transition-all relative"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-4 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
                      <span className="font-display font-bold text-slate-900 text-sm">Announcements Alerts</span>
                      <button 
                        onClick={() => { setNotificationsOpen(false); navigate(getDashboardRoute()); }}
                        className="text-[10px] text-indigo-650 hover:text-indigo-700 font-bold"
                      >
                        View Dashboard
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-4 text-xs text-slate-450 italic">No notification alerts.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} className="text-xs p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-650">
                            <span className="font-bold text-slate-800 block mb-0.5">{n.title}</span>
                            <span>{n.message}</span>
                            <span className="text-[9px] text-slate-400 font-mono block mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              /* User authenticated dropdown */
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setModulesDropdownOpen(false);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 bg-slate-100/80 hover:bg-slate-200/50 rounded-full transition-all border border-slate-200/40"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display text-sm font-semibold">
                    {(user?.fullName || user?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-tight hidden xl:block pr-3">
                    <div className="text-xs font-bold text-slate-800">{user?.fullName || user?.name}</div>
                    <div className="text-[10px] text-slate-450 font-medium uppercase tracking-wider">{user?.role || 'Student'}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500 pr-1.5" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] text-slate-400 font-medium">Log account</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left transition-colors font-bold"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Portal Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-colors font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* User logged out state */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all font-display"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm font-display"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full mb-3">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search startups, proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </form>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Explore Registry
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Success Stories
            </Link>
            
            {isAuthenticated && user?.role === 'student' && (
              <>
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mt-2 mb-1">
                  Filings Desk
                </div>

                <Link
                  to="/startup-register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-650 hover:bg-slate-50 font-bold"
                >
                  <Rocket className="h-4 w-4 text-indigo-500" />
                  Register Startup
                </Link>
                <Link
                  to="/proposal-form"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-650 hover:bg-slate-50 font-bold"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Submit Proposal
                </Link>
                <Link
                  to="/incubation-apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-650 hover:bg-slate-50 font-bold"
                >
                  <Cpu className="h-4 w-4 text-teal-500" />
                  Incubation Space
                </Link>
                <Link
                  to="/progress-submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-650 hover:bg-slate-50 font-bold"
                >
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Track Progress
                </Link>
              </>
            )}
          </div>

          {/* Mobile User Section */}
          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display font-semibold">
                    {(user?.fullName || user?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{user?.fullName || user?.name}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{user?.email}</div>
                  </div>
                </div>
                
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all text-slate-700"
                >
                  Portal Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-rose-250 text-rose-600 bg-rose-50/10 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors font-display"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 rounded-xl text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-display"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
