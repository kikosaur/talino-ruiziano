import { useOutletContext } from "react-router-dom";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import BadgeGallery from "@/components/dashboard/BadgeGallery";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TodoList from "@/components/dashboard/TodoList";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

import { useSubmissions } from "@/hooks/useSubmissions";
import { useILTDeadlines } from "@/hooks/useILTDeadlines";

interface DashboardContextType {
  toggleMusicPlayer: () => void;
  toggleChat: () => void;
}

const Dashboard = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const { toggleMusicPlayer } = useOutletContext<DashboardContextType>();
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const { deadlines, isLoading: deadlinesLoading } = useILTDeadlines();

  const isLoading = authLoading || submissionsLoading || deadlinesLoading;

  // Calculate unique submissions
  const uniqueSubmissions = new Set(submissions.map(s => s.ilt_name)).size;
  const totalDeadlines = deadlines.length;

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Main content */}
      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <WelcomeCard
            studentName={profile.display_name || "Student"}
            avatarUrl={profile.avatar_url}
            points={profile.total_points}
            streak={profile.streak_days}
            level={profile.level}
            submittedCount={uniqueSubmissions}
            totalCount={totalDeadlines}
          />

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Badge Gallery (takes 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <BadgeGallery />
            </div>

            {/* Right Column - Quick Actions & Todo List */}
            <div className="space-y-6">
              <QuickActions onMusicToggle={toggleMusicPlayer} />
              <TodoList />
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

