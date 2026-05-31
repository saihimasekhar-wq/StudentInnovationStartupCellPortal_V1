import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, LayoutDashboard, Users, Rocket, Lightbulb, Cpu, 
  TrendingUp, Award, Bell, FileSpreadsheet, UserCheck, LogOut,
  Search, ArrowUpRight, Check, X, MessageSquare, Trash2, Calendar, 
  Download, Plus, Edit, ShieldAlert, Upload, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');

  // Core administrative states
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  // Unified fetch for admin stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Administrative lookup failed. Re-verify auth credentials.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Cell Overview', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { id: 'users', label: 'Student Auditing', icon: <Users className="h-4.5 w-4.5" /> },
    { id: 'startups', label: 'Venture Registry', icon: <Rocket className="h-4.5 w-4.5" /> },
    { id: 'proposals', label: 'Innovation Proposals', icon: <Lightbulb className="h-4.5 w-4.5" /> },
    { id: 'incubations', label: 'Incubation Space', icon: <Cpu className="h-4.5 w-4.5" /> },
    { id: 'progress', label: 'Weekly Logs', icon: <TrendingUp className="h-4.5 w-4.5" /> },
    { id: 'mentors', label: 'Mentor Matching', icon: <UserCheck className="h-4.5 w-4.5" /> },
    { id: 'announcements', label: 'Announcements Hub', icon: <Bell className="h-4.5 w-4.5" /> },
    { id: 'stories', label: 'Case Studies CRUD', icon: <Award className="h-4.5 w-4.5" /> },
    { id: 'export', label: 'Export Desk', icon: <FileSpreadsheet className="h-4.5 w-4.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 1. Left Administrative Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-950/20">
        <div>
          {/* Header brand logo */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-650 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-white tracking-tight block">Cell Control Console</span>
              <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-semibold font-mono">College Admin Portal</span>
            </div>
          </div>

          {/* Menu panel items */}
          <nav className="p-4 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActivePanel(item.id); setError(''); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold font-display transition-all ${
                  activeTabOrPanel(activePanel, item.id)
                    ? 'bg-slate-800 text-white shadow-inner'
                    : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User panel sign out */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="leading-tight">
              <span className="text-xs font-bold text-white block truncate max-w-[120px]">Super Admin</span>
              <span className="text-[10px] text-slate-500 font-mono">admin@startupcell.edu</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold font-mono">Root</span>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-800 hover:bg-rose-900/10 hover:border-rose-900/30 text-rose-500 hover:text-rose-400 text-xs font-bold font-display rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main content pane */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 flex items-start gap-2.5 text-xs font-semibold">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamically render sub-panel boards based on state selection */}
        {activePanel === 'overview' && <OverviewPanel stats={stats} loading={loadingStats} onFetch={fetchStats} />}
        {activePanel === 'users' && <UsersPanel />}
        {activePanel === 'startups' && <StartupsPanel onFetchStats={fetchStats} />}
        {activePanel === 'proposals' && <ProposalsPanel onFetchStats={fetchStats} />}
        {activePanel === 'incubations' && <IncubationsPanel onFetchStats={fetchStats} />}
        {activePanel === 'progress' && <ProgressPanel />}
        {activePanel === 'mentors' && <MentorsPanel />}
        {activePanel === 'announcements' && <AnnouncementsPanel />}
        {activePanel === 'stories' && <StoriesPanel />}
        {activePanel === 'export' && <ExportPanel />}

      </main>

    </div>
  );
};

// Helper for active tab mapping
const activeTabOrPanel = (curr, target) => curr === target;

// ==========================================
// 1. CELL OVERVIEW SUB-PANEL BOARD
// ==========================================
const OverviewPanel = ({ stats, loading, onFetch }) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRes, setSearchRes] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await axios.get('/api/admin/login-history');
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleAdminSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchRes(null);
      return;
    }
    try {
      setSearching(true);
      const res = await axios.get(`/api/admin/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchRes(res.data);
    } catch (err) {
      console.error(err);
      alert('Administrative keyword search failed.');
    } finally {
      setSearching(false);
    }
  };

  const statCards = [
    { label: 'Registered Students', val: stats?.totalUsers || 0, icon: <Users className="h-5 w-5 text-indigo-600" /> },
    { label: 'Total Startup Files', val: stats?.totalStartups || 0, icon: <Rocket className="h-5 w-5 text-purple-600" /> },
    { label: 'Pending Startups', val: stats?.pendingStartups || 0, icon: <ShieldAlert className="h-5 w-5 text-amber-600" /> },
    { label: 'Approved Startups', val: stats?.approvedStartups || 0, icon: <Check className="h-5 w-5 text-emerald-600" /> },
    { label: 'Total Innovation Proposals', val: stats?.totalProposals || 0, icon: <Lightbulb className="h-5 w-5 text-pink-600" /> },
    { label: 'Approved Proposals', val: stats?.approvedProposals || 0, icon: <Check className="h-5 w-5 text-teal-600" /> },
    { label: 'Incubation Space Filings', val: stats?.totalIncubations || 0, icon: <Cpu className="h-5 w-5 text-blue-600" /> },
    { label: 'Total Audited Sign-Ins', val: stats?.totalLogins || 0, icon: <TrendingUp className="h-5 w-5 text-indigo-600" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Ecosystem Metrics Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time summaries tracking student venture growth, incubation queues, and audit trails.</p>
        </div>
        <button onClick={onFetch} className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-display shadow-sm flex items-center gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats Cards grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-white animate-pulse border border-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
              <div className="flex justify-between items-center">
                <div className="p-2 rounded-xl bg-slate-50">{card.icon}</div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Live</span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-display font-extrabold text-slate-900 block">{card.val}</span>
                <span className="text-xs text-slate-500 font-sans mt-0.5">{card.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Administrative Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm">
        <h3 className="text-sm font-display font-bold text-slate-900 mb-3 flex items-center gap-1.5">
          <Search className="h-4.5 w-4.5 text-indigo-500" />
          Administrative Search Bar
        </h3>
        <form onSubmit={handleAdminSearch} className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search across student names, email, student ID, startup name, proposal title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-xs text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-md transition-all shrink-0"
          >
            Execute Search
          </button>
        </form>

        {/* Display Search Results */}
        {searching && (
          <div className="mt-4 flex items-center gap-2 justify-center py-6 text-slate-400 text-xs">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
            <span>Running database queries...</span>
          </div>
        )}

        {searchRes && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 font-display">Administrative Search Results:</h4>
            
            {/* Users */}
            {searchRes.users?.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">Matching Students ({searchRes.users.length})</span>
                <div className="space-y-1.5">
                  {searchRes.users.map(u => (
                    <div key={u._id} className="text-xs p-2 bg-slate-50 rounded border border-slate-100 flex justify-between font-mono">
                      <span>{u.fullName} ({u.email})</span>
                      <span className="text-indigo-650">ID: {u.studentId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Startups */}
            {searchRes.startups?.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">Matching Startups ({searchRes.startups.length})</span>
                <div className="space-y-1.5">
                  {searchRes.startups.map(s => (
                    <div key={s._id} className="text-xs p-2.5 bg-slate-50 rounded border border-slate-100 flex justify-between font-mono">
                      <span>{s.startupName} (Founder: {s.founderName})</span>
                      <span className="font-bold uppercase text-[9px]">{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals */}
            {searchRes.proposals?.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 tracking-wider">Matching Proposals ({searchRes.proposals.length})</span>
                <div className="space-y-1.5">
                  {searchRes.proposals.map(p => (
                    <div key={p._id} className="text-xs p-2.5 bg-slate-50 rounded border border-slate-100 flex justify-between font-mono">
                      <span>{p.title} (Sector: {p.category})</span>
                      <span className="font-bold uppercase text-[9px]">{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!searchRes.users?.length && !searchRes.startups?.length && !searchRes.proposals?.length) && (
              <p className="text-xs text-slate-450 text-center py-4">No records matched search term.</p>
            )}
          </div>
        )}
      </div>

      {/* Live Auditing Login History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <h3 className="text-sm font-display font-bold text-slate-900">Sign-In Activity Logs</h3>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Real-time Audits</span>
        </div>

        {loadingHistory ? (
          <div className="text-center py-6 text-xs text-slate-400">Loading sign-in history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-450">No sign-ins recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Login Date/Time</th>
                  <th className="pb-3 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-mono text-slate-650">
                {history.slice(0, 5).map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-800 font-sans">{log.fullName}</td>
                    <td className="py-3">{log.email}</td>
                    <td className="py-3 text-[11px]">{new Date(log.loginTime).toLocaleString()}</td>
                    <td className="py-3 text-right text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

// ==========================================
// 2. STUDENT AUDITING (USERS) SUB-PANEL BOARD
// ==========================================
const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = async (id) => {
    try {
      setLoadingDetails(true);
      const res = await axios.get(`/api/admin/users/${id}`);
      setSelectedUser(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to retrieve user details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('WARNING: Deleting this student account will permanently purge all of their owned startups, innovation proposals, space request files, and logs! Proceed?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        setSelectedUser(null);
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Student Accounts Purge & Auditing</h2>
        <p className="text-xs text-slate-500 mt-0.5">Track student department groups, verify logins, and auditing registry filings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">Loading student listings...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-450">No students registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                    <th className="pb-3">FullName</th>
                    <th className="pb-3">Student ID</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-right">Filings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs text-slate-650">
                  {users.map(u => (
                    <tr 
                      key={u._id} 
                      onClick={() => handleUserClick(u._id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        selectedUser?.user?._id === u._id ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <td className="py-3 font-semibold text-slate-800 font-sans">{u.fullName}</td>
                      <td className="py-3 font-mono">{u.studentId}</td>
                      <td className="py-3">{u.department?.split(' ')[0]}</td>
                      <td className="py-3 text-right font-bold text-slate-700">
                        S:{u.startupsCount || 0} / P:{u.proposalsCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Details Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm min-h-[300px] flex flex-col justify-between">
          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <RefreshCw className="h-6 w-6 text-indigo-600 animate-spin" />
              <span className="text-xs text-slate-400">Pulling student records...</span>
            </div>
          ) : !selectedUser ? (
            <div className="text-center py-20 text-xs text-slate-450">
              Select a student from the auditing table to view registration details and purge files.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">{selectedUser.user.fullName}</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedUser.user.email}</span>
                </div>
                <button
                  onClick={() => handleDeleteUser(selectedUser.user._id)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-rose-600 hover:text-rose-700 transition-colors"
                  title="Purge Student Account"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Faculty Dept</span>
                    <span className="font-semibold text-slate-800">{selectedUser.user.department}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Student ID</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedUser.user.studentId}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans mb-1.5">Startup Filings</span>
                  {selectedUser.startups?.length === 0 ? (
                    <p className="text-slate-450 italic">No startups filed.</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedUser.startups.map(s => (
                        <div key={s._id} className="p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[11px] flex justify-between">
                          <span>{s.startupName}</span>
                          <span className="font-bold uppercase tracking-wider">{s.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-sans mb-1.5">Innovation Proposals</span>
                  {selectedUser.proposals?.length === 0 ? (
                    <p className="text-slate-450 italic">No proposals submitted.</p>
                  ) : (
                    <div className="space-y-1">
                      {selectedUser.proposals.map(p => (
                        <div key={p._id} className="p-2 bg-slate-50 rounded border border-slate-100 font-mono text-[11px] flex justify-between">
                          <span className="truncate max-w-[200px]">{p.title}</span>
                          <span className="font-bold uppercase tracking-wider">{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. VENTURE REGISTRY (STARTUPS) SUB-PANEL BOARD
// ==========================================
const StartupsPanel = ({ onFetchStats }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/startups');
      setStartups(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/startups/${id}/status`, {
        status,
        adminComment: commentInput,
      });
      setCommentInput('');
      setActiveItem(null);
      fetchStartups();
      onFetchStats();
    } catch (err) {
      console.error(err);
      alert('Vetting update failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Student Venture Vetting Office</h2>
        <p className="text-xs text-slate-500 mt-0.5">Vet startup profiles, review problem statement hypotheses, and assign statuses.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading startup registry...</div>
        ) : startups.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-450">No startup registrations recorded.</div>
        ) : (
          <div className="space-y-4">
            {startups.map(s => (
              <div key={s._id} className="p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/40 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 font-display">{s.startupName}</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-755 border border-indigo-100 font-mono">
                        {s.category}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-mono">
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-1">Founder: <span className="font-semibold text-slate-700">{s.founderName}</span> ({s.email})</p>
                    <p className="text-xs text-slate-650 leading-relaxed mt-2"><span className="font-semibold text-slate-800">Problem Statement:</span> {s.problemStatement}</p>
                    <p className="text-xs text-slate-655 leading-relaxed mt-1"><span className="font-semibold text-slate-800">Solution:</span> {s.solution}</p>
                    {s.adminComment && (
                      <div className="text-xs p-2 bg-indigo-50 text-indigo-800 rounded-xl mt-3 max-w-xl font-medium">
                        <span className="font-bold">Comment:</span> "{s.adminComment}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Vetting Action triggers */}
                <div className="pt-3 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex gap-2">
                    {s.logo && <a href={`/${s.logo}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">View Logo</a>}
                    {s.pitchDeck && <a href={`/${s.pitchDeck}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-purple-650 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded">Download Pitch</a>}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeItem === s._id ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Provide feedback comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="flex-grow px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                        />
                        <button onClick={() => handleUpdateStatus(s._id, 'Approved')} className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><Check className="h-4 w-4" /></button>
                        <button onClick={() => handleUpdateStatus(s._id, 'Rejected')} className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><X className="h-4 w-4" /></button>
                        <button onClick={() => setActiveItem(null)} className="p-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-display">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setActiveItem(s._id); setCommentInput(s.adminComment || ''); }} className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-sm">
                        Vet Application
                      </button>
                    )}
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

// ==========================================
// 4. TECHNICAL PROPOSALS SUB-PANEL BOARD
// ==========================================
const ProposalsPanel = ({ onFetchStats }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/proposals');
      setProposals(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/proposals/${id}/status`, {
        status,
        adminComment: commentInput,
      });
      setCommentInput('');
      setActiveItem(null);
      fetchProposals();
      onFetchStats();
    } catch (err) {
      console.error(err);
      alert('Vetting update failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Technical Research Vetting Desk</h2>
        <p className="text-xs text-slate-500 mt-0.5">Vet faculty innovation designs, check research grant requests, and assign statuses.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading proposals...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-450">No innovation proposals filed.</div>
        ) : (
          <div className="space-y-4">
            {proposals.map(p => (
              <div key={p._id} className="p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/40 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 font-display">{p.title}</h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-755 border border-purple-100 font-mono">
                      {p.category}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-750 border border-amber-100 font-mono">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-1">Submitter: <span className="font-semibold text-slate-700">{p.submittedBy?.fullName || 'Student'}</span> ({p.department})</p>
                  <p className="text-xs text-slate-650 leading-relaxed mt-2"><span className="font-semibold text-slate-800">Abstract:</span> {p.abstract}</p>
                  <p className="text-xs text-slate-655 leading-relaxed mt-1"><span className="font-semibold text-slate-800">Novel Innovation:</span> {p.innovation}</p>
                  {p.adminComment && (
                    <div className="text-xs p-2 bg-indigo-50 text-indigo-800 rounded-xl mt-3 max-w-xl font-medium">
                      <span className="font-bold">Comment:</span> "{p.adminComment}"
                    </div>
                  )}
                </div>

                {/* Vetting Action triggers */}
                <div className="pt-3 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex gap-2">
                    {p.proposalDocument && <a href={`/${p.proposalDocument}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">View Proposal Document</a>}
                    {p.supportingFiles && <a href={`/${p.supportingFiles}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-purple-650 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded">Download Support CAD</a>}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeItem === p._id ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Provide feedback comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="flex-grow px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                        />
                        <button onClick={() => handleUpdateStatus(p._id, 'Approved')} className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><Check className="h-4 w-4" /></button>
                        <button onClick={() => handleUpdateStatus(p._id, 'Rejected')} className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><X className="h-4 w-4" /></button>
                        <button onClick={() => setActiveItem(null)} className="p-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-display">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setActiveItem(p._id); setCommentInput(p.adminComment || ''); }} className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-sm">
                        Vet Application
                      </button>
                    )}
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

// ==========================================
// 5. INCUBATION SPACE SUB-PANEL BOARD
// ==========================================
const IncubationsPanel = ({ onFetchStats }) => {
  const [incubations, setIncubations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  const fetchIncubations = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/incubations');
      setIncubations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncubations();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/incubations/${id}/status`, {
        status,
        adminComment: commentInput,
      });
      setCommentInput('');
      setActiveItem(null);
      fetchIncubations();
      onFetchStats();
    } catch (err) {
      console.error(err);
      alert('Vetting update failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Incubation Space Allocation Queue</h2>
        <p className="text-xs text-slate-500 mt-0.5">Vet workspace requests, co-working desk applications, and compute cluster credits.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading space queue...</div>
        ) : incubations.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-450">No incubation applications recorded.</div>
        ) : (
          <div className="space-y-4">
            {incubations.map(i => (
              <div key={i._id} className="p-5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-200/40 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Venture: <span className="text-indigo-650">{i.startupId?.startupName || 'Your Startup'}</span>
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-755 border border-blue-100 font-mono">
                      {i.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans mt-1">Filed by: <span className="font-semibold text-slate-700">{i.submittedBy?.fullName || 'Student'}</span> ({i.submittedBy?.department || 'Faculty'})</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-white p-3 rounded-xl border border-slate-200/30 text-xs text-slate-650">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-450 block">Business Traction Summary:</span>
                      <p className="mt-0.5">{i.progress}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-450 block">Why is co-working space needed?</span>
                      <p className="mt-0.5">{i.whyIncubation}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-650 mt-3"><span className="font-semibold text-slate-800">Expected Support Focus:</span> {i.expectedSupport}</p>
                  
                  {i.adminComment && (
                    <div className="text-xs p-2 bg-indigo-50 text-indigo-800 rounded-xl mt-3 max-w-xl font-medium">
                      <span className="font-bold">Comment:</span> "{i.adminComment}"
                    </div>
                  )}
                </div>

                {/* Vetting Action triggers */}
                <div className="pt-3 border-t border-slate-200/50 flex justify-end">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activeItem === i._id ? (
                      <div className="flex gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Provide feedback comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="flex-grow px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                        />
                        <button onClick={() => handleUpdateStatus(i._id, 'Approved')} className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><Check className="h-4 w-4" /></button>
                        <button onClick={() => handleUpdateStatus(i._id, 'Rejected')} className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold font-display flex items-center justify-center"><X className="h-4 w-4" /></button>
                        <button onClick={() => setActiveItem(null)} className="p-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-display">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setActiveItem(i._id); setCommentInput(i.adminComment || ''); }} className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-sm">
                        Vet Application
                      </button>
                    )}
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

// ==========================================
// 6. WEEKLY PROGRESS LOGS SUB-PANEL BOARD
// ==========================================
const ProgressPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/progress');
        setLogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Ecosystem Weekly Tracker Progress Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">Audit student weekly venture tracker logs, ratings from industry mentors, and review progress records.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading progress reports...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-455">No weekly progress logs recorded.</div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log._id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-200/40">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Venture: <span className="text-indigo-650 font-extrabold">{log.startupName}</span> | {log.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block">Filed by: {log.submittedBy?.fullName} ({log.submittedBy?.department})</span>
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                    log.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-650">
                  <p><span className="font-semibold text-slate-800">Weekly Accomplishments:</span> {log.achievements}</p>
                  <p><span className="font-semibold text-slate-800">Encountered Obstacles:</span> {log.challenges}</p>
                  <p><span className="font-semibold text-slate-800">Next Target Milestone:</span> {log.nextMilestone}</p>
                  
                  {log.status === 'Reviewed' && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-xl border border-slate-200/30 text-xs font-sans">
                      <span className="font-bold text-slate-700 block">Mentor Feedback Rating: {log.mentorRating} Stars</span>
                      <span className="italic">"{log.mentorComment}"</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. MENTOR MATCHING & ASSIGNMENTS SUB-PANEL
// ==========================================
const MentorsPanel = () => {
  const [mentors, setMentors] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  // New mentor input state
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');

  // Assign mentor state
  const [selectedStartup, setSelectedStartup] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');

  const fetchMentorsAndStartups = async () => {
    try {
      setLoading(true);
      const [mentorsRes, startupsRes] = await Promise.all([
        axios.get('/api/admin/mentors'),
        axios.get('/api/admin/startups')
      ]);
      setMentors(mentorsRes.data || []);
      // Filter only approved startups for mentor matching
      setStartups((startupsRes.data || []).filter(s => s.status === 'Approved'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsAndStartups();
  }, []);

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/mentors', {
        name, expertise, email, phone, designation, password
      });
      setName(''); setExpertise(''); setEmail(''); setPhone(''); setDesignation(''); setPassword('');
      fetchMentorsAndStartups();
      alert('Mentor profile created successfully! Default login credentials matching their email seeded.');
    } catch (err) {
      console.error(err);
      alert('Failed to register mentor.');
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    if (!selectedStartup || !selectedMentor) {
      alert('Please select both a startup and a mentor.');
      return;
    }
    try {
      await axios.post('/api/admin/assign-mentor', {
        startupId: selectedStartup,
        mentorId: selectedMentor
      });
      setSelectedStartup('');
      setSelectedMentor('');
      fetchMentorsAndStartups();
      alert('Ecosystem mentor matched and assigned successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to match mentor.');
    }
  };

  const handleDeleteMentor = async (id) => {
    if (window.confirm('Delete this mentor profile? All startup assignments will be cleared.')) {
      try {
        await axios.delete(`/api/admin/mentors/${id}`);
        fetchMentorsAndStartups();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Ecosystem Mentor Matching Desk</h2>
        <p className="text-xs text-slate-500 mt-0.5">Register ecosystem guides, schedule advisories, and match mentors to approved student startups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mentor Matching Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm space-y-6">
          <form onSubmit={handleCreateMentor} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-2 border-b">Register Mentor Profile</h3>
            
            <div>
              <label className="text-[10px] font-bold text-slate-650 block mb-1">FullName *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="Dr. Anita Rao" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Expertise / Domain *</label>
              <input type="text" required value={expertise} onChange={e => setExpertise(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="DeepTech, SaaS strategy" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">Email *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="anita@college.edu" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">Phone *</label>
                <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="9880123456" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Designation *</label>
              <input type="text" required value={designation} onChange={e => setDesignation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="Research Scientist" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Login Password (Default: Mentor@123)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="Mentor@123" />
            </div>

            <button type="submit" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-sm flex items-center justify-center gap-1.5"><Plus className="h-4 w-4" /> Save Profile</button>
          </form>

          {/* Assignment Matcher */}
          <form onSubmit={handleAssignMentor} className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-2 border-b">Match Mentor to Startup</h3>
            
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Approved Startup *</label>
              <select required value={selectedStartup} onChange={e => setSelectedStartup(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-750">
                <option value="">Select Startup</option>
                {startups.map(s => <option key={s._id} value={s._id}>{s.startupName}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Assigned Guide *</label>
              <select required value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-750">
                <option value="">Select Mentor</option>
                {mentors.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-display shadow-sm flex items-center justify-center gap-1.5">Match Mentoring Pair</button>
          </form>
        </div>

        {/* Mentors list table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-3 border-b mb-4">Active Mentors Directory</h3>
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">Loading mentors...</div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-455">No mentors registered yet.</div>
          ) : (
            <div className="space-y-3">
              {mentors.map(m => (
                <div key={m._id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/40 flex justify-between items-center gap-4 text-xs font-sans">
                  <div>
                    <h4 className="font-bold text-slate-900 font-display text-sm">{m.name}</h4>
                    <p className="text-[10px] text-slate-450">{m.designation}</p>
                    <p className="text-slate-600 mt-1.5"><span className="font-semibold text-slate-800">Domain:</span> {m.expertise}</p>
                    <p className="text-slate-500 text-[10px] font-mono mt-0.5">Email: {m.email} | Tel: {m.phone}</p>
                  </div>
                  <button onClick={() => handleDeleteMentor(m._id)} className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 hover:text-rose-700 shrink-0"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. ANNOUNCEMENTS HUB SUB-PANEL BOARD
// ==========================================
const AnnouncementsPanel = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetUserId, setTargetUserId] = useState(''); // empty = broadcast
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/admin/notifications', {
        title, message, targetUserId: targetUserId || null
      });
      setTitle(''); setMessage(''); setTargetUserId('');
      alert('Announcement push notification distributed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to transmit notification alerts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Cell Broadcast Announcements Hub</h2>
        <p className="text-xs text-slate-500 mt-0.5">Distribute emergency pitch-night notifications,VC session alerts, or grant announcements.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm max-w-2xl">
        <form onSubmit={handleBroadcast} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Target Group / Recipient</label>
            <select
              value={targetUserId}
              onChange={e => setTargetUserId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-750 font-medium"
            >
              <option value="">Broadcast to All Registered Students (Global Announcement)</option>
              {students.map(u => (
                <option key={u._id} value={u._id}>Direct Alert to: {u.fullName} ({u.studentId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Alert Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
              placeholder="e.g. NIDHI-PRAYAS Grant Phase-II Cycle Open"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Detailed Message *</label>
            <textarea
              required
              rows="4"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs leading-relaxed"
              placeholder="Provide eligibility criteria, scheduling guidelines, or pitch room assignments..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow flex items-center gap-1.5 disabled:bg-slate-300"
          >
            {loading ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Bell className="h-4.5 w-4.5 text-indigo-400" />}
            Distribute Announcement Alert
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 9. CASE STUDIES CRUD (SUCCESS GALLERY)
// ==========================================
const StoriesPanel = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD input states
  const [activeStoryId, setActiveStoryId] = useState(null); // null = create mode
  const [startupName, setStartupName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [achievement, setAchievement] = useState('');
  const [fundingRaised, setFundingRaised] = useState('');
  const [awards, setAwards] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/stories');
      setStories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setImageFile(file);
    } else {
      alert('Cover image size must be under 10MB.');
    }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('startupName', startupName);
      data.append('founderName', founderName);
      data.append('achievement', achievement);
      data.append('fundingRaised', fundingRaised);
      data.append('awards', awards);
      data.append('content', content);
      if (imageFile) {
        data.append('coverImage', imageFile);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (activeStoryId) {
        await axios.put(`/api/admin/stories/${activeStoryId}`, data, config);
        alert('Success story case details updated successfully!');
      } else {
        await axios.post('/api/admin/stories', data, config);
        alert('New success story case published to portal public grids!');
      }

      setStartupName(''); setFounderName(''); setAchievement(''); setFundingRaised(''); setAwards(''); setContent(''); setImageFile(null); setActiveStoryId(null);
      fetchStories();
    } catch (err) {
      console.error(err);
      alert('Failed to publish case story.');
    }
  };

  const handleEditClick = (story) => {
    setActiveStoryId(story._id);
    setStartupName(story.startupName || '');
    setFounderName(story.founderName || '');
    setAchievement(story.achievement || '');
    setFundingRaised(story.fundingRaised || '');
    setAwards(story.awards || '');
    setContent(story.content || '');
    setImageFile(null);
  };

  const handleDeleteStory = async (id) => {
    if (window.confirm('Are you sure you want to delete this success gallery case study?')) {
      try {
        await axios.delete(`/api/admin/stories/${id}`);
        fetchStories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Startup Success Gallery CRUD Publisher</h2>
        <p className="text-xs text-slate-500 mt-0.5">Publish approved startup case studies to public home grids and discover sections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CRUD Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm space-y-4">
          <form onSubmit={handleSaveStory} className="space-y-4 text-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-2 border-b flex justify-between">
              <span>{activeStoryId ? 'Edit Success Case Details' : 'Publish New Success Case'}</span>
              {activeStoryId && <button type="button" onClick={() => { setActiveStoryId(null); setStartupName(''); setFounderName(''); setAchievement(''); setFundingRaised(''); setAwards(''); setContent(''); }} className="text-indigo-600 underline font-semibold normal-case">Create Mode</button>}
            </h3>

            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Startup Name *</label>
              <input type="text" required value={startupName} onChange={e => setStartupName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Founder Full Name *</label>
              <input type="text" required value={founderName} onChange={e => setFounderName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">Achievement Label *</label>
                <input type="text" required value={achievement} onChange={e => setAchievement(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="e.g. Seed Funding Raised" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">Funding Raised (INR) *</label>
                <input type="text" required value={fundingRaised} onChange={e => setFundingRaised(e.target.value)} className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="e.g. INR 25 Lakhs" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Awards & Research Grants</label>
              <input type="text" value={awards} onChange={e => setAwards(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs" placeholder="NIDHI-PRAYAS or private VC grant details" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Case study details content *</label>
              <textarea required rows="4" value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs leading-relaxed" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-655 block mb-1">Success Case Cover Image (Max 10MB)</label>
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
                <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                <label className="text-[10px] font-bold text-slate-700 block cursor-pointer">
                  Pick Cover Image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {imageFile && <p className="text-[10px] text-indigo-650 mt-1 font-semibold">Selected: {imageFile.name}</p>}
              </div>
            </div>

            <button type="submit" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow-sm flex items-center justify-center gap-1.5"><Sparkles className="h-4 w-4" /> Save Success Case</button>
          </form>
        </div>

        {/* Existing success stories list */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm overflow-hidden">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-3 border-b mb-4">Ecosystem Showcase Archives</h3>
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-400">Loading cases...</div>
          ) : stories.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-450">No success stories published yet.</div>
          ) : (
            <div className="space-y-3">
              {stories.map(item => (
                <div key={item._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 flex justify-between items-center gap-4 text-xs font-sans">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded bg-slate-200 overflow-hidden shrink-0">
                      <img src={item.coverImage ? `/${item.coverImage}` : 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100'} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-display">{item.startupName}</h4>
                      <p className="text-[10px] text-slate-500">Founder: {item.founderName} | Achievement: {item.achievement}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => handleEditClick(item)} className="p-1.5 bg-white hover:bg-slate-100 border rounded text-slate-600"><Edit className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDeleteStory(item._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded border border-rose-100 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. EXPORT REPORT DESK SUB-PANEL BOARD
// ==========================================
const ExportPanel = () => {
  const [reportType, setReportType] = useState('users');
  const [format, setFormat] = useState('xlsx');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = (e) => {
    e.preventDefault();
    setExporting(true);

    // Build API query URL string nicely
    let query = `/api/admin/export/${reportType}?format=${format}`;
    if (startDate) query += `&startDate=${startDate}`;
    if (endDate) query += `&endDate=${endDate}`;

    // Trigger direct window attachment download
    window.open(query, '_blank');
    
    setTimeout(() => {
      setExporting(false);
    }, 1500);
  };

  const reportItems = [
    { id: 'users', label: 'Ecosystem Students list', desc: 'Registered student profiles and departments.' },
    { id: 'startups', label: 'Startup Registry listings', desc: 'Vetted startup stages, problem statement details.' },
    { id: 'proposals', label: 'Technical Innovation Proposals', desc: 'Abstract titles, faculty grids, and grant vetting.' },
    { id: 'incubations', label: 'Incubation Space Queue', desc: 'Space queue filings, computing cluster request logs.' },
    { id: 'progress', label: 'Weekly Tracker logs', desc: 'Timeline milestones logs and mentor ratings.' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Administrative Export Reports desk</h2>
        <p className="text-xs text-slate-500 mt-0.5">Generate formal Excel spreadsheets, structured CSV data, or styled PDF summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Options Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm">
          <form onSubmit={handleExport} className="space-y-5 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Report Type *</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-750 font-medium"
              >
                {reportItems.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">Export Format *</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl">
                {['xlsx', 'csv', 'pdf'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      format === fmt
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-550 hover:text-slate-800'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-655 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={exporting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display shadow flex items-center justify-center gap-1.5 disabled:bg-slate-400"
            >
              {exporting ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <Download className="h-4.5 w-4.5" />}
              Generate & Download Report
            </button>
          </form>
        </div>

        {/* Descriptions sidebar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display pb-2.5 border-b mb-3.5">Export Contents Index</h3>
            
            <div className="space-y-3.5">
              {reportItems.map(item => (
                <div key={item.id} className="text-xs font-sans">
                  <h4 className="font-bold text-slate-900 font-display">{item.label}</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
