import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: FileText, label: "Submissions", path: "/admin/submissions" },
  { icon: Users, label: "Students", path: "/admin/students" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-foreground text-background transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-background/20">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[var(--shadow-gold)] flex-shrink-0">
            <BookOpen className="w-6 h-6 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-serif font-bold block">
                Admin Panel
              </span>
              <span className="text-xs text-background/60">Talino-Ruiziano</span>
            </div>
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
                  : "hover:bg-background/10 text-background/80"
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
      <div className="p-3 border-t border-background/20 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl hover:bg-background/10 transition-all text-background/80"
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/20 transition-all text-background/70 hover:text-background"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
