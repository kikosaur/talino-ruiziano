import { BookOpen, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[var(--shadow-gold)] group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="text-xl font-serif font-bold text-primary-foreground">
            Talino-Ruiziano
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="nav-link hidden sm:block">Home</Link>
          <Link to="/dashboard" className="nav-link hidden sm:block">Dashboard</Link>
          <Link to="/login">
            <Button className="btn-gold flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
