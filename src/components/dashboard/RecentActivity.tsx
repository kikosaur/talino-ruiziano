import { FileText, Award, MessageCircle, Clock, Loader2 } from "lucide-react";
import { useRecentActivity } from "@/hooks/useRecentActivity";

const iconMap = {
  submission: FileText,
  badge: Award,
  chat: MessageCircle,
  deadline: Clock,
};

const colorMap = {
  submission: "bg-accent text-accent-foreground",
  badge: "bg-primary text-primary-foreground",
  chat: "bg-secondary text-secondary-foreground",
  deadline: "bg-destructive text-destructive-foreground",
};

const RecentActivity = () => {
  const { activities, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <div className="card-elevated p-6 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <h3 className="section-title text-xl mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No recent activity yet.</p>
            <p className="text-sm">Submit an ILT or join a chat to get started!</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = iconMap[activity.type];
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                title={activity.time}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[activity.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground truncate">{activity.title}</p>
                    {activity.points && (
                      <span className="text-xs font-bold text-accent">+{activity.points}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
