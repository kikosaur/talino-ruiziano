import { Upload, Calendar, CheckSquare, Music } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Upload,
    label: "Submit ILT",
    description: "Upload your task",
    path: "/dashboard/submit",
    color: "bg-accent",
    points: "+50 pts",
  },
  {
    icon: Calendar,
    label: "View Calendar",
    description: "Check deadlines",
    path: "/dashboard/calendar",
    color: "bg-primary",
  },
  {
    icon: CheckSquare,
    label: "To-Do List",
    description: "Manage tasks",
    path: "/dashboard/todos",
    color: "bg-secondary",
  },
];

interface QuickActionsProps {
  onMusicToggle?: () => void;
}

const QuickActions = ({ onMusicToggle }: QuickActionsProps) => {
  return (
    <div className="card-elevated p-6">
      <h3 className="section-title text-xl mb-6">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group p-4 rounded-xl border border-border hover:border-accent bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
              <action.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              {action.points && (
                <span className="text-xs font-bold text-accent bg-accent/20 px-2 py-1 rounded-full">
                  {action.points}
                </span>
              )}
            </div>
          </Link>
        ))}

        {/* Study Music - Special button that toggles the music player */}
        <button
          onClick={onMusicToggle}
          className="group p-4 rounded-xl border border-border hover:border-accent bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-[1.02] text-left"
        >
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Study Music</p>
              <p className="text-sm text-muted-foreground">Focus time</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;

