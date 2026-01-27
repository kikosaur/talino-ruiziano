import DashboardSidebar from "@/components/dashboard/Sidebar";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import BadgeGallery from "@/components/dashboard/BadgeGallery";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      {/* Main content */}
      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <WelcomeCard
            studentName={profile.display_name || "Student"}
            points={profile.total_points}
            streak={profile.streak_days}
            level={profile.level}
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
