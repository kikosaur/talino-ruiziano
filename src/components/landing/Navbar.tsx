import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-lg"
      style={{ backgroundColor: "#801B1B" }} // Deep Maroon
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/bulb.png"
            alt="Talino Ruiziano Logo"
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col">
            <span
              className="text-xl font-bold"
              style={{ color: "#FFC107", fontFamily: "Georgia, serif" }} // Golden Yellow
            >
              Talino-Ruiziano
            </span>
            <span className="text-xs text-white/80">
              Motivate & Complete your tasks!
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/bulletin"
            className="text-white hover:text-yellow-300 font-medium underline underline-offset-4 hidden sm:block transition-colors"
          >
            Bulletin
          </Link>
          <Link
            to="/dashboard"
            className="text-white hover:text-yellow-300 font-medium underline underline-offset-4 hidden sm:block transition-colors"
          >
            Dashboard
          </Link>

          {/* Hamburger Menu */}
          <button
            className="p-2 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#FFC107" }} // Golden Yellow
          >
            <Menu className="w-5 h-5" style={{ color: "#801B1B" }} />
          </button>

          {/* Join Button */}
          <Link to="/register">
            <Button
              className="px-6 py-2 font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#FFC107", // Golden Yellow
                color: "#801B1B", // Deep Maroon
              }}
            >
              Join
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
