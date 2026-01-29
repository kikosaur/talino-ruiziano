import {
  LayoutDashboard,
  Upload,
  Calendar,
  Music,
  MessageCircle,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Submit ILT", path: "/dashboard/submit" },
  { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
];

interface DashboardSidebarProps {
  onMusicToggle?: () => void;
  onChatToggle?: () => void;
}

const DashboardSidebar = ({ onMusicToggle, onChatToggle }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

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

      {/* User info */}
      {!collapsed && profile && (
        <div className="px-4 py-3 border-b border-primary-foreground/20">
          <p className="text-sm font-medium truncate">{profile.display_name || "Student"}</p>
          <p className="text-xs text-primary-foreground/60 truncate">{profile.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
              {profile.total_points} pts
            </span>
            <span className="text-xs bg-primary-foreground/10 px-2 py-0.5 rounded-full">
              Level {profile.level}
            </span>
          </div>
        </div>
      )}

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

        {/* Music Corner - Button to toggle floating player */}
        <button
          onClick={onMusicToggle}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-primary-foreground/10"
        >
          <Music className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="font-medium truncate">Music Corner</span>
          )}
        </button>

        {/* Peer Chat - Button to toggle floating chat */}
        <button
          onClick={onChatToggle}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-primary-foreground/10"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="font-medium truncate">Peer Chat</span>
          )}
        </button>

        {/* Admin link - only show for admins */}
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              location.pathname.startsWith("/admin")
                ? "bg-accent text-accent-foreground shadow-[var(--shadow-gold)]"
                : "hover:bg-primary-foreground/10"
            )}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="font-medium truncate">Admin Panel</span>
            )}
          </Link>
        )}
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

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/20 transition-all text-primary-foreground/70 hover:text-primary-foreground"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

