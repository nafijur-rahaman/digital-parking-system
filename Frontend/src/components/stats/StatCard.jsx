import { motion } from 'framer-motion';

const colorMap = {
  blue: 'from-blue-500/10 to-transparent border-t-blue-500 text-glow-blue',
  green: 'from-teal-500/10 to-transparent border-t-teal-500 text-glow-green',
  red: 'from-red-500/10 to-transparent border-t-red-500 text-glow-red',
  purple: 'from-purple-500/10 to-transparent border-t-purple-500',
};

const barMap = {
  blue: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
  green: 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]',
  red: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]',
  purple: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
};

const StatCard = ({ title, value, total, progress, trend, isUrgent, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-panel border-t-2 bg-gradient-to-b ${colorMap[color]} rounded-2xl p-6 relative overflow-hidden`}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      
      <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 uppercase">{title}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <motion.span 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-white tracking-tight"
        >
          {value}
        </motion.span>
        <span className="text-sm text-gray-500 font-medium">{total}</span>
      </div>
      {progress && (
        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${barMap[color]}`} 
          />
        </div>
      )}
      {isUrgent && (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg mt-2 border border-red-500/30 uppercase tracking-wider hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
        >
          Dispatch Officer
        </motion.button>
      )}
      {trend && <p className="text-[11px] text-teal-400 font-medium mt-1">{trend}</p>}
    </motion.div>
  );
};

export default StatCard;
