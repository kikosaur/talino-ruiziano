import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col">
            <span
              className="text-xl font-bold"
              style={{ color: "#FFC107", fontFamily: "Georgia, serif" }} // Golden Yellow
            >
              Talino-Ruiziano
            </span>
            <span className="text-xs text-white/80 hidden sm:block">
              Motivate & Complete your tasks!
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            About
          </Link>
          <Link
            to="/programs"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            Programs
          </Link>
          <Link
            to="/bulletin"
            className="text-white hover:text-yellow-300 font-medium transition-colors"
          >
            Bulletin
          </Link>

          {/* Join Button */}
          <Link to="/register">
            <Button
              className="px-6 py-2 font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105"
              style={{
                backgroundColor: "#FFC107", // Golden Yellow
                color: "#801B1B", // Deep Maroon
              }}
            >
              Join
            </Button>
          </Link>
        </div>

        {/* Mobile: Join Button + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/register">
            <Button
              className="px-4 py-1.5 text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "#FFC107",
                color: "#801B1B",
              }}
            >
              Join
            </Button>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#FFC107" }}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" style={{ color: "#801B1B" }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: "#801B1B" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t"
          style={{ backgroundColor: "#801B1B", borderColor: "rgba(255,255,255,0.2)" }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-yellow-300 font-medium py-2 transition-colors"
            >
              About
            </Link>
            <Link
              to="/programs"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-yellow-300 font-medium py-2 transition-colors"
            >
              Programs
            </Link>
            <Link
              to="/bulletin"
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-yellow-300 font-medium py-2 transition-colors"
            >
              Bulletin
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-yellow-300 hover:text-yellow-200 font-medium py-2 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
