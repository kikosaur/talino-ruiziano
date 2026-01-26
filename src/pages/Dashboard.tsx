import DashboardSidebar from "@/components/dashboard/Sidebar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import BadgeGallery from "@/components/dashboard/BadgeGallery";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  // Mock student data - would come from auth/database
  const studentData = {
    name: "Juan Dela Cruz",
    points: 750,
    streak: 5,
    level: 3,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      {/* Main content */}
      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <WelcomeCard
            studentName={studentData.name}
            points={studentData.points}
            streak={studentData.streak}
            level={studentData.level}
          />

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Badge Gallery (takes 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <BadgeGallery />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>

          {/* Recent Activity - Full Width */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
