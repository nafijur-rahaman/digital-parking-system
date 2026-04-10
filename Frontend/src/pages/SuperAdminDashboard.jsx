import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Plus, Users, UserPlus, Server, Activity, ArrowRight, LayoutDashboard, KeyRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff'); // staff, slots, overview
  const [slots, setSlots] = useState([
    { id: 'A-01', type: 'FACULTY' },
    { id: 'A-02', type: 'VACANT' },
  ]);
  const [staffList, setStaffList] = useState([
    { id: 'ST-9001', email: 'deskguard1@unipark.edu' },
  ]);

  const [slotForm, setSlotForm] = useState({ id: '', type: 'STUDENT' });
  const [staffForm, setStaffForm] = useState({ id: '', email: '' });

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotForm.id.trim()) return;
    setSlots([...slots, slotForm]);
    setSlotForm({ id: '', type: 'STUDENT' });
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!staffForm.id.trim() || !staffForm.email.trim()) return;
    setStaffList([...staffList, staffForm]);
    setStaffForm({ id: '', email: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Sidebar Links */}
      <div className="col-span-1 space-y-4">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-sm font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" /> Admin Tools
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${activeTab === 'overview' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold"><LayoutDashboard className="w-4 h-4" /> System Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${activeTab === 'staff' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold"><Users className="w-4 h-4" /> System Staffing</span>
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${activeTab === 'slots' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold"><Server className="w-4 h-4" /> Parking Grid</span>
            </button>
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

      {/* Main Content Area */}
      <div className="col-span-3 glass-panel p-8 rounded-2xl min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide mb-2 flex items-center gap-3">
                  <UserPlus className="text-purple-400 w-6 h-6" /> Staff Provisioning
                </h1>
                <p className="text-sm text-gray-400">Create login credentials for new gate guards or administrative staff. The ID acts as the login username.</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <form onSubmit={handleCreateStaff} className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold tracking-widest text-purple-400 mb-4">NEW CREDENTIALS</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">STAFF ID (LOGIN)</label>
                    <input type="text" value={staffForm.id} onChange={(e) => setStaffForm({ ...staffForm, id: e.target.value })} placeholder="e.g. ST-204" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">EMAIL ADDRESS (PASSWORD)</label>
                    <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="guard@unipark.edu" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg py-3 mt-4 flex justify-center items-center gap-2">
                    <KeyRound className="w-4 h-4" /> Provision Account
                  </motion.button>
                </form>

                <div className="bg-black/40 border border-white/5 p-6 rounded-xl">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-4">ACTIVE STAFF ROSTER</h3>
                  <div className="space-y-3">
                    {staffList.map((staff, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex gap-3 items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">{staff.id.substring(0, 2)}</div>
                          <div>
                            <p className="font-bold text-sm text-white">{staff.id}</p>
                            <p className="text-xs text-gray-500">{staff.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PARKING LOTS MANAGEMENT */}
          {activeTab === 'slots' && (
            <motion.div key="slots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide mb-2 flex items-center gap-3">
                  <Plus className="text-purple-400 w-6 h-6" /> Parking Grid Allocation
                </h1>
                <p className="text-sm text-gray-400">Initialize new parking sections into the live matrix system dynamically.</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <form onSubmit={handleCreateSlot} className="bg-black/40 border border-white/5 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold tracking-widest text-purple-400 mb-4">NEW SLOT PARAMETERS</h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">SLOT IDENTIFIER</label>
                    <input type="text" value={slotForm.id} onChange={(e) => setSlotForm({ ...slotForm, id: e.target.value })} placeholder="e.g. C-15" className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">DESIGNATED TYPE</label>
                    <select value={slotForm.type} onChange={(e) => setSlotForm({ ...slotForm, type: e.target.value })} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none">
                      <option value="GENERAL">GENERAL</option>
                      <option value="FACULTY">FACULTY ONLY</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg py-3 mt-4">
                    Deploy Space to Map
                  </motion.button>
                </form>

                <div className="bg-black/40 border border-white/5 p-6 rounded-xl">
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 mb-4">INITIALIZED SLOTS REGISTER</h3>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map((slot, i) => (
                      <div key={i} className="flex justify-between items-center px-3 py-2 rounded-lg bg-teal-900/10 border border-teal-500/20">
                        <span className="font-bold text-sm text-white">{slot.id}</span>
                        <span className="text-[10px] text-teal-400 font-bold">{slot.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-white tracking-wide mb-2 flex items-center gap-3">
                 System Hierarchy
              </h1>
              <p className="text-sm text-gray-400">Welcome to the Super Admin control panel. From here, you can manage the physical constraints of the garage (Slots) and the operational security constraint of the endpoints (Staff).</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
