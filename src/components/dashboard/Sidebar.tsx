import { 
  LayoutDashboard, 
  Upload, 
  Calendar, 
  CheckSquare, 
  Music, 
  MessageCircle, 
  Settings,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Submit ILT", path: "/dashboard/submit" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  { icon: CheckSquare, label: "To-Do List", path: "/dashboard/todos" },
  { icon: Music, label: "Music Corner", path: "/dashboard/music" },
  { icon: MessageCircle, label: "Peer Chat", path: "/dashboard/chat" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-primary text-primary-foreground transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-primary-foreground/20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[var(--shadow-gold)] flex-shrink-0">
            <BookOpen className="w-6 h-6 text-accent-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-serif font-bold truncate">
              Talino-Ruiziano
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-[var(--shadow-gold)]" 
                  : "hover:bg-primary-foreground/10"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-primary-foreground/20 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-foreground/10 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
        
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/20 transition-all text-primary-foreground/70 hover:text-primary-foreground"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
