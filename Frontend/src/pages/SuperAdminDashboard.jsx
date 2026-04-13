import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Plus, Users, UserPlus, Server, Activity, ArrowRight,
  LayoutDashboard, KeyRound, Trash2, Loader2, AlertCircle, CheckCircle,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  getAllStaff, createStaff, deleteStaff,
  getAllParkingLots, createParkingLot, deleteParkingLot,
  getAllBookings,
} from '../services/api';

const FeedbackBanner = ({ type, message }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm mb-4 ${isError ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'}`}
    >
      {isError ? <AlertCircle className="h-4 w-4 flex-shrink-0" /> : <CheckCircle className="h-4 w-4 flex-shrink-0" />}
      {message}
    </motion.div>
  );
};

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff');

  // Staff state
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffFeedback, setStaffFeedback] = useState({ type: '', message: '' });
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const [staffForm, setStaffForm] = useState({ username: '', password: '', full_name: '', email: '', phone: '', role: 'staff' });

  // Lot state
  const [lots, setLots] = useState([]);
  const [lotsLoading, setLotsLoading] = useState(true);
  const [lotsFeedback, setLotsFeedback] = useState({ type: '', message: '' });
  const [lotsSubmitting, setLotsSubmitting] = useState(false);
  const [lotForm, setLotForm] = useState({ name: '', lot_type: 'general', location: '', description: '', total_capacity: 10 });

  // Overview state
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    if (activeTab === 'staff') fetchStaff();
    if (activeTab === 'slots') fetchLots();
    if (activeTab === 'overview') fetchOverview();
  }, [activeTab]);

  const fetchStaff = async () => {
    setStaffLoading(true);
    try { const res = await getAllStaff(); setStaffList(res.staff || []); }
    catch { setStaffFeedback({ type: 'error', message: 'Failed to load staff list.' }); }
    finally { setStaffLoading(false); }
  };

  const fetchLots = async () => {
    setLotsLoading(true);
    try { const res = await getAllParkingLots(); setLots(res); }
    catch { setLotsFeedback({ type: 'error', message: 'Failed to load parking lots.' }); }
    finally { setLotsLoading(false); }
  };

  const fetchOverview = async () => {
    try {
      const [staffRes, lotsRes, bookingsRes] = await Promise.all([getAllStaff(), getAllParkingLots(), getAllBookings()]);
      setOverviewData({
        staffCount: (staffRes.staff || []).length,
        lotCount: lotsRes.length,
        totalCapacity: lotsRes.reduce((s, l) => s + l.total_capacity, 0),
        totalOccupied: lotsRes.reduce((s, l) => s + l.current_occupied, 0),
        activeBookings: (bookingsRes || []).filter((b) => b.status === 'active').length,
        totalBookings: (bookingsRes || []).length,
      });
    } catch { /* silent */ }
  };

  // Staff CRUD
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffSubmitting(true);
    setStaffFeedback({ type: '', message: '' });
    try {
      await createStaff(staffForm);
      setStaffFeedback({ type: 'success', message: `Staff "${staffForm.username}" created successfully.` });
      setStaffForm({ username: '', password: '', full_name: '', email: '', phone: '', role: 'staff' });
      fetchStaff();
    } catch (err) {
      const errMsg = err?.data ? Object.values(err.data).flat().join(' ') : 'Failed to create staff.';
      setStaffFeedback({ type: 'error', message: errMsg });
    } finally { setStaffSubmitting(false); }
  };

  const handleDeleteStaff = async (pk, username) => {
    if (!window.confirm(`Delete staff "${username}"? This cannot be undone.`)) return;
    try { await deleteStaff(pk); setStaffFeedback({ type: 'success', message: `Staff "${username}" deleted.` }); fetchStaff(); }
    catch { setStaffFeedback({ type: 'error', message: 'Failed to delete staff.' }); }
  };

  // Lot CRUD
  const handleCreateLot = async (e) => {
    e.preventDefault();
    setLotsSubmitting(true);
    setLotsFeedback({ type: '', message: '' });
    try {
      await createParkingLot({ ...lotForm, total_capacity: parseInt(lotForm.total_capacity) });
      setLotsFeedback({ type: 'success', message: `Lot "${lotForm.name}" created successfully.` });
      setLotForm({ name: '', lot_type: 'general', location: '', description: '', total_capacity: 10 });
      fetchLots();
    } catch (err) {
      const errMsg = err?.data ? Object.values(err.data).flat().join(' ') : 'Failed to create parking lot.';
      setLotsFeedback({ type: 'error', message: errMsg });
    } finally { setLotsSubmitting(false); }
  };

  const handleDeleteLot = async (pk, name) => {
    if (!window.confirm(`Delete lot "${name}"? This will fail if it has active bookings.`)) return;
    try { await deleteParkingLot(pk); setLotsFeedback({ type: 'success', message: `Lot "${name}" deleted.` }); fetchLots(); }
    catch (err) { setLotsFeedback({ type: 'error', message: err?.data?.error || 'Failed to delete lot.' }); }
  };

  const sidebarItems = [
    { key: 'overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'System Overview' },
    { key: 'staff', icon: <Users className="w-4 h-4" />, label: 'System Staffing' },
    { key: 'slots', icon: <Server className="w-4 h-4" />, label: 'Parking Grid' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="col-span-1 space-y-4">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Admin Tools
          </h2>
          <div className="space-y-2">
            {sidebarItems.map(({ key, icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${activeTab === key ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <span className="flex items-center gap-3 text-sm font-semibold">{icon} {label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase">Quick Links</h2>
          <NavLink to="/terminal" className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-teal-900/40 to-black/40 border border-teal-500/30 text-teal-300 hover:from-teal-800/50 transition-all font-semibold text-sm mb-3 group">
            <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Live Terminal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>
      </div>

      {/* Main */}
      <div className="col-span-3 glass-panel p-8 rounded-2xl min-h-[600px]">
        <AnimatePresence mode="wait">

          {/* ── STAFF ── */}
          {activeTab === 'staff' && (
            <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide mb-1 flex items-center gap-3"><UserPlus className="text-purple-400 w-6 h-6" /> Staff Provisioning</h1>
                <p className="text-sm text-gray-400">Create login credentials for new gate guards or administrative staff.</p>
              </div>
              <FeedbackBanner {...staffFeedback} />
              <div className="grid grid-cols-2 gap-8">
                <form onSubmit={handleCreateStaff} className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold tracking-widest text-purple-400 mb-4">NEW CREDENTIALS</h3>
                  {[
                    { label: 'USERNAME (LOGIN)', key: 'username', type: 'text', placeholder: 'e.g. guard_01', req: true },
                    { label: 'PASSWORD', key: 'password', type: 'password', placeholder: 'Min 6 characters', req: true },
                    { label: 'FULL NAME', key: 'full_name', type: 'text', placeholder: 'e.g. John Smith', req: true },
                    { label: 'EMAIL', key: 'email', type: 'email', placeholder: 'guard@university.edu', req: true },
                    { label: 'PHONE (OPTIONAL)', key: 'phone', type: 'text', placeholder: '+8801700000000', req: false },
                  ].map(({ label, key, type, placeholder, req }) => (
                    <div key={key}>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">{label}</label>
                      <input type={type} value={staffForm[key]} onChange={(e) => setStaffForm({ ...staffForm, [key]: e.target.value })}
                        placeholder={placeholder} required={req}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">ROLE</label>
                    <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500">
                      <option value="staff">Staff (Gate Guard)</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={staffSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg py-3 mt-2 flex justify-center items-center gap-2 disabled:opacity-60">
                    {staffSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><KeyRound className="w-4 h-4" /> Provision Account</>}
                  </motion.button>
                </form>

                <div className="bg-black/40 border border-white/5 p-6 rounded-xl">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-4">ACTIVE STAFF ROSTER</h3>
                  {staffLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
                  ) : staffList.length === 0 ? (
                    <p className="text-gray-600 text-xs text-center py-8">No staff accounts yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      {staffList.map((s) => (
                        <div key={s.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                              {(s.full_name || s.username).substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{s.full_name || s.username}</p>
                              <p className="text-xs text-gray-500">{s.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-1 rounded font-bold ${s.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {s.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                            <button onClick={() => handleDeleteStaff(s.id, s.username)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PARKING LOTS ── */}
          {activeTab === 'slots' && (
            <motion.div key="slots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide mb-1 flex items-center gap-3"><Plus className="text-purple-400 w-6 h-6" /> Parking Grid Allocation</h1>
                <p className="text-sm text-gray-400">Initialize new parking sections into the live matrix system.</p>
              </div>
              <FeedbackBanner {...lotsFeedback} />
              <div className="grid grid-cols-2 gap-8">
                <form onSubmit={handleCreateLot} className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-3">
                  <h3 className="text-sm font-bold tracking-widest text-purple-400 mb-4">NEW LOT PARAMETERS</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">LOT NAME (UNIQUE)</label>
                    <input type="text" value={lotForm.name} onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
                      placeholder="e.g. North_Block_A" required
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">LOT TYPE</label>
                    <select value={lotForm.lot_type} onChange={(e) => setLotForm({ ...lotForm, lot_type: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none">
                      <option value="general">General</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="vip">VIP</option>
                      <option value="disabled">Disabled</option>
                      <option value="ev">EV Charging</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">LOCATION</label>
                    <input type="text" value={lotForm.location} onChange={(e) => setLotForm({ ...lotForm, location: e.target.value })}
                      placeholder="e.g. Behind Academic Building" required
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">TOTAL CAPACITY</label>
                    <input type="number" min="1" value={lotForm.total_capacity}
                      onChange={(e) => setLotForm({ ...lotForm, total_capacity: e.target.value })} required
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">DESCRIPTION (OPTIONAL)</label>
                    <input type="text" value={lotForm.description} onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
                      placeholder="Any additional notes..."
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={lotsSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg py-3 mt-2 flex justify-center items-center gap-2 disabled:opacity-60">
                    {lotsSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Deploy Space to Map'}
                  </motion.button>
                </form>

                <div className="bg-black/40 border border-white/5 p-6 rounded-xl">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-4">INITIALIZED LOTS</h3>
                  {lotsLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-teal-400" /></div>
                  ) : lots.length === 0 ? (
                    <p className="text-gray-600 text-xs text-center py-8">No parking lots configured yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      {lots.map((lot) => (
                        <div key={lot.id} className="flex justify-between items-center px-3 py-3 rounded-lg bg-teal-900/10 border border-teal-500/20">
                          <div>
                            <p className="font-bold text-sm text-white">{lot.name}</p>
                            <p className="text-[10px] text-gray-500 capitalize">{lot.lot_type} · {lot.location}</p>
                            <p className="text-[10px] text-teal-400 font-mono mt-0.5">{lot.current_occupied}/{lot.total_capacity} occupied</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-1 rounded font-bold ${lot.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {lot.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                            <button onClick={() => handleDeleteLot(lot.id, lot.name)}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-white tracking-wide mb-2">System Hierarchy</h1>
              <p className="text-sm text-gray-400">Live system stats pulled directly from the database.</p>
              {!overviewData ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>
              ) : (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Total Staff', value: overviewData.staffCount },
                    { label: 'Parking Lots', value: overviewData.lotCount },
                    { label: 'Total Capacity', value: overviewData.totalCapacity },
                    { label: 'Currently Occupied', value: overviewData.totalOccupied },
                    { label: 'Active Bookings', value: overviewData.activeBookings },
                    { label: 'Total Bookings', value: overviewData.totalBookings },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-black/40 border border-white/5 rounded-xl p-5 text-center">
                      <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">{label}</p>
                      <p className="text-3xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
