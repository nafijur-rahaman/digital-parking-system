import DashboardHeader from './DashboardHeader';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-300 p-6">
      <DashboardHeader />
      <main className="max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
