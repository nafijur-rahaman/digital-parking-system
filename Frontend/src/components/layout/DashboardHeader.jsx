import { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navigation2, Shield, User, ChevronDown, UserCircle, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleContext } from '../../context/RoleContext';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, label }) => (
  <NavLink to={to} className={({ isActive }) =>
    `relative text-[13px] font-[500] px-1 pb-2 transition-colors duration-150 ${isActive ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'}`
  }>
    {({ isActive }) => (
      <>
        {label}
        {isActive && (
          <motion.div
            layoutId="nav-pill"
            className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-[var(--teal)] shadow-[0_0_8px_rgba(45,212,191,0.8)]"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </>
    )}
  </NavLink>
);

export default function DashboardHeader() {
  const { role } = useContext(RoleContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isSuperAdmin = role === 'superadmin';

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = (user?.name || user?.username || 'U')
    .split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="relative z-50 mb-6">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1600px] mx-auto glass rounded-[18px] px-6 py-3.5 flex items-center justify-between"
      >
        {/* ── LEFT: Wordmark ── */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500/25 to-teal-400/10 rounded-[10px] border border-teal-500/20 flex items-center justify-center">
              <Navigation2 className="h-4 w-4 text-teal-400" />
            </div>
            <span className="text-[15px] font-[800] text-white tracking-[-0.03em]">UniPark</span>
          </div>

          {/* Nav links (superadmin only) */}
          {isSuperAdmin && (
            <nav className="flex items-center gap-7 pt-2">
              <NavItem to="/admin" label="Admin Hub" />
              <NavItem to="/terminal" label="Live Terminal" />
              <NavItem to="/analytics" label="Analytics" />
            </nav>
          )}
        </div>

        {/* ── RIGHT: Live badge + User ── */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/8 border border-teal-500/15">
            <span className="live-dot flex-shrink-0" />
            <span className="text-[11px] font-[600] text-teal-400 tracking-wide">Live</span>
          </div>

          {/* User menu */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[12px] border border-transparent hover:border-[var(--border-base)] hover:bg-white/[0.04] transition-all duration-150"
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-[12px] font-[800] tracking-wide flex-shrink-0
                ${isSuperAdmin
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white'
                }`}>
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-[600] text-white leading-tight">{user?.name || user?.username}</p>
                <p className={`text-[10px] font-[700] tracking-wide uppercase leading-tight ${isSuperAdmin ? 'text-purple-400' : 'text-teal-400'}`}>
                  {isSuperAdmin ? 'Super Admin' : 'Staff'}
                </p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full mt-2 w-56 z-[9999] glass rounded-[16px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-[12px] font-[800] flex-shrink-0
                        ${isSuperAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-teal-500 to-cyan-600'} text-white`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-[600] text-white truncate">{user?.name || user?.username}</p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate">{isSuperAdmin ? 'Super Administrator' : 'Gate Staff'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-1.5">
                    <button onClick={() => setOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-colors">
                      <UserCircle className="h-4 w-4 flex-shrink-0" />
                      View Profile
                    </button>
                    <button onClick={() => setOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] text-[var(--text-secondary)] hover:text-white hover:bg-white/[0.05] transition-colors">
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      Settings
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-white/[0.06]">
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors">
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </div>
  );
}
