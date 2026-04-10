import StatCard from './StatCard';

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          total={stat.total}
          progress={stat.progress}
          trend={stat.trend}
          isUrgent={stat.isUrgent}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
