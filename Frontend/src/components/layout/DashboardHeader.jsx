import { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, User, Navigation, Shield, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleContext } from '../../AppRoutes';
import { useAuth } from '../../context/AuthContext';

const navItemClass = ({ isActive }) =>
  `relative px-1 pb-2 transition-colors text-sm font-medium ${isActive
    ? 'text-teal-400 font-semibold'
    : 'text-gray-400 hover:text-white'}`;

const DashboardHeader = () => {
  const { role } = useContext(RoleContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-[1600px] mx-auto flex items-center justify-between mb-8 glass-panel px-6 py-4 rounded-2xl"
    >
      {/* Left — Logo + Search */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-white flex items-center gap-3 tracking-wide">
          <div className="bg-teal-500/20 text-teal-400 p-2 rounded-lg border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <Navigation className="h-6 w-6" />
          </div>
          UniPark Access
        </h1>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors group-focus-within:text-teal-400" />
          <input
            type="text"
            placeholder="Search spaces or IDs..."
            className="bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-teal-500/50 transition-all text-white placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Right — Nav + User */}
      <div className="flex items-center gap-8">
        {/* Navigation — only for superadmin */}
        {role === 'superadmin' && (
          <nav className="flex gap-8 pt-2">
            <NavLink to="/admin" className={navItemClass}>
              {({ isActive }) => (
                <>
                  Admin Hub
                  {isActive && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] rounded-full" />}
                </>
              )}
            </NavLink>
            <NavLink to="/terminal" className={navItemClass}>
              {({ isActive }) => (
                <>
                  Live Terminal
                  {isActive && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] rounded-full" />}
                </>
              )}
            </NavLink>
            <NavLink to="/analytics" className={navItemClass}>
              {({ isActive }) => (
                <>
                  Analytics
                  {isActive && <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)] rounded-full" />}
                </>
              )}
            </NavLink>
          </nav>
        )}

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-3 bg-black/30 pl-3 pr-3 py-2 rounded-full border border-white/5 hover:border-white/15 transition-all glass-panel-hover"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: role === 'superadmin' ? '#a78bfa' : '#2dd4bf' }}>
                {role === 'superadmin' ? 'Super Admin' : 'Staff'}
              </p>
            </div>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center shadow-lg ${role === 'superadmin' ? 'bg-gradient-to-tr from-purple-500 to-indigo-500' : 'bg-gradient-to-tr from-teal-500 to-blue-500'}`}>
              {role === 'superadmin' ? <Shield className="text-white h-4 w-4" /> : <User className="text-white h-4 w-4" />}
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-52 glass-panel rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
              >
                {/* Profile Info */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); /* navigate('/profile') later */ }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    View Profile
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-white/5 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
