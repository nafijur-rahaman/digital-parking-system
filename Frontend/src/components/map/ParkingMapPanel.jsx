import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

// Auto-generate a visual grid from capacity & current_occupied
const buildSlotGrid = (lot) => {
  const slots = [];
  for (let i = 0; i < lot.total_capacity; i++) {
    const num = String(i + 1).padStart(2, '0');
    slots.push({
      id: `${lot.name}-${num}`,
      num,
      occupied: i < lot.current_occupied,
    });
  }
  return slots;
};

const ParkingMapPanel = ({ lots, sensorEvent }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!lots || lots.length === 0) {
    return (
      <div className="col-span-2 glass-panel rounded-2xl p-6 flex items-center justify-center bg-[#0B0E14]/80">
        <p className="text-gray-500 text-sm">No parking lots configured yet. Go to Admin Hub → Parking Grid to add one.</p>
      </div>
    );
  }

  const activeLot = lots[activeTab] || lots[0];
  const slots = buildSlotGrid(activeLot);

  return (
    <div className="col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden bg-[#0B0E14]/80">
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]"></div>

      {/* Lot tabs */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex gap-2 flex-wrap">
          {lots.map((lot, index) => (
            <button
              key={lot.id}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                index === activeTab
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {lot.name}
            </button>
          ))}
        </div>
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] flex items-center gap-1.5 text-teal-400 font-bold uppercase tracking-widest bg-teal-900/20 px-3 py-1.5 rounded-full border border-teal-500/30 relative"
        >
          <span className="absolute inset-0 bg-teal-400/20 rounded-full blur-md"></span>
          <Radio className="h-3 w-3 relative z-10" />
          <span className="relative z-10">Live Sensor Matrix</span>
        </motion.span>
      </div>

      {/* Sensor event ticker */}
      <motion.p
        key={sensorEvent?.time}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-teal-300 mb-4 border border-teal-900/40 bg-teal-900/10 rounded-lg px-3 py-2 font-mono tracking-wide relative z-10"
      >
        <span className="text-gray-500 mr-2">{sensorEvent?.time}</span>
        <span className="text-glow-green">{sensorEvent?.text}</span>
      </motion.p>

      {/* Lot stats */}
      <div className="flex gap-3 mb-4 relative z-10">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Capacity</p>
          <p className="text-xl font-bold text-white">{activeLot.total_capacity}</p>
        </div>
        <div className={`border rounded-lg px-4 py-2 text-center ${activeLot.current_occupied >= activeLot.total_capacity ? 'bg-red-500/10 border-red-500/20' : 'bg-teal-500/10 border-teal-500/20'}`}>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Occupied</p>
          <p className={`text-xl font-bold ${activeLot.current_occupied >= activeLot.total_capacity ? 'text-red-400' : 'text-teal-400'}`}>
            {activeLot.current_occupied}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Free</p>
          <p className="text-xl font-bold text-emerald-400">{activeLot.available_spots}</p>
        </div>
        <div className="flex-1 bg-black/40 border border-white/5 rounded-lg px-4 py-2 flex items-center gap-2">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest w-12">Type</p>
          <p className="text-xs font-bold text-purple-300 uppercase">{activeLot.lot_type}</p>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded ${activeLot.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {activeLot.is_active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      {/* Visual slot grid */}
      <div className="bg-black/40 rounded-xl p-6 border border-white/5 relative z-10 shadow-inner">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            {activeLot.name} — Space Map
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded bg-emerald-500/80"></span> Vacant</div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded bg-teal-600"></span> Occupied</div>
          </div>
        </div>

        {slots.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-8">Lot capacity is 0. Update the lot to add spaces.</p>
        ) : (
          <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto pr-1">
            {slots.map((slot) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center justify-center rounded-lg p-2 border text-center transition-all ${
                  slot.occupied
                    ? 'bg-teal-900/40 border-teal-600/50 shadow-[0_0_8px_rgba(20,184,166,0.2)]'
                    : 'bg-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mb-1 ${slot.occupied ? 'bg-teal-400' : 'bg-emerald-400'}`} />
                <p className="text-[8px] font-bold text-gray-400 truncate w-full text-center">
                  {slot.num}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingMapPanel;
