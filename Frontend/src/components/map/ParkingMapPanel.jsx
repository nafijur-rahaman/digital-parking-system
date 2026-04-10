import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import ParkingSlot from './ParkingSlot';

const ParkingMapPanel = ({ lotTabs, slots, sensorEvent }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden bg-[#0B0E14]/80">
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex gap-2">
          {lotTabs.map((tab, index) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                index === activeTab 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
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
      
      <motion.p 
        key={sensorEvent?.time}
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-teal-300 mb-6 border border-teal-900/40 bg-teal-900/10 rounded-lg px-3 py-2 font-mono tracking-wide relative z-10"
      >
        <span className="text-gray-500 mr-2">{sensorEvent?.time}</span> 
        <span className="text-glow-green">{sensorEvent?.text}</span>
      </motion.p>

      <div className="bg-black/40 rounded-xl p-8 border border-white/5 relative z-10 shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> ZONE ALFA (MAIN)
          </h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded bg-emerald-500/80"></span> Vacant</div>
             <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded bg-teal-600"></span> Occupied</div>
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-5">
          {slots.map((slot, index) => (
            <ParkingSlot 
              key={slot.id} 
              id={slot.id} 
              type={slot.type} 
              status={slot.status} 
              memberId={slot.memberId} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkingMapPanel;
