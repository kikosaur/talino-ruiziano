import { FileText, Award, MessageCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "submission" | "badge" | "chat" | "deadline";
  title: string;
  description: string;
  time: string;
  points?: number;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "submission",
    title: "ILT Week 3 Submitted",
    description: "Mathematics Assignment",
    time: "2 hours ago",
    points: 50,
  },
  {
    id: "2",
    type: "badge",
    title: "Badge Earned!",
    description: "Hot Streak - 5 day streak",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "chat",
    title: "New Message",
    description: "Maria: 'Thanks for the help!'",
    time: "Yesterday",
  },
  {
    id: "4",
    type: "deadline",
    title: "Upcoming Deadline",
    description: "Science ILT due in 2 days",
    time: "Jan 30",
  },
];

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
  return (
    <div className="card-elevated p-6">
      <h3 className="section-title text-xl mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
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
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
