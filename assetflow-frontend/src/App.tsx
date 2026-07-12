import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, CheckCircle, Repeat, LogOut, Shield, Menu, X, KeyRound, User } from 'lucide-react';
import { ToastProvider, useToast } from './context/ToastContext';
import { AssetList } from './modules/asset/AssetList';
import { AssetDetails } from './modules/asset/AssetDetails';
import { AssetForm } from './modules/asset/AssetForm';
import { AllocationPage } from './modules/allocation/AllocationPage';
import { ReturnAssetPage } from './modules/allocation/ReturnAssetPage';
import { TransferPage } from './modules/transfer/TransferPage';
import api from './services/api';

// MOCK LOGIN COMPONENT
const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('username', response.data.data.username);
        showToast('Authenticated successfully with JWT', 'success');
        onLoginSuccess();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/20">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">AssetFlow</h2>
          <p className="text-xs text-slate-400">Enterprise Asset & Resource Management</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-4 py-2.5 text-sm rounded-xl glass-input text-slate-100 placeholder-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/15 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

// MAIN LAYOUT WRAPPER WITH SIDEBAR
const DashboardLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const username = localStorage.getItem('username') || 'Employee';

  const menuItems = [
    { name: 'Asset Catalog', path: '/assets', icon: LayoutGrid },
    { name: 'Checkout / Allocate', path: '/allocations/new', icon: CheckCircle },
    { name: 'Transfers Workflow', path: '/transfers', icon: Repeat },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-slate-950/60 flex-shrink-0">
        <div className="p-6 border-b border-slate-900/80 flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-400" />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block">AssetFlow</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Enterprise EAM</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 pt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Match sub-routes for assets list
            const isActive = location.pathname.startsWith(item.path) || 
              (item.path === '/assets' && (location.pathname === '/' || location.pathname.startsWith('/assets/')));

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGGED IN USER BAR */}
        <div className="p-4 border-t border-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-300">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-900 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE MENU TOGGLE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-400" />
          <span className="font-extrabold text-sm tracking-tight text-white">AssetFlow</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-slate-950/95 z-30 flex flex-col p-6 animate-slide-in">
          <nav className="flex-grow space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path) || 
                (item.path === '/assets' && (location.pathname === '/' || location.pathname.startsWith('/assets/')));

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                      : 'text-slate-400 border-transparent hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-rose-400 bg-slate-900 border border-slate-800 mt-auto"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Session</span>
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-grow h-full pt-16 md:pt-0 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Navigate to="/assets" replace />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/assets/:id" element={<AssetDetails />} />
          <Route path="/assets/new" element={<AssetForm />} />
          <Route path="/assets/edit/:id" element={<AssetForm />} />
          <Route path="/allocations/new" element={<AllocationPage />} />
          <Route path="/allocations/return/:id" element={<ReturnAssetPage />} />
          <Route path="/transfers" element={<TransferPage />} />
          <Route path="/transfers/new" element={<TransferPage />} />
          <Route path="*" element={<Navigate to="/assets" replace />} />
        </Routes>
      </main>

    </div>
  );
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Switch */}
          <Route
            path="/login"
            element={
              authenticated ? (
                <Navigate to="/assets" replace />
              ) : (
                <Login onLoginSuccess={() => setAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/*"
            element={
              authenticated ? (
                <DashboardLayout onLogout={() => setAuthenticated(false)} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
