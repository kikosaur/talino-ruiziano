import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#801B1B" }} className="text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/bulb.png"
                alt="Talino Ruiziano Logo"
                className="w-12 h-12 object-contain"
              />
              <span
                className="text-xl font-bold"
                style={{ color: "#FFC107", fontFamily: "Georgia, serif" }}
              >
                Talino-Ruiziano
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              A gamified Learning Management System designed to make
              learning engaging and rewarding for students.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg" style={{ color: "#FFC107" }}>Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-yellow-300 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/bulletin" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Bulletin
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg" style={{ color: "#FFC107" }}>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Study */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg" style={{ color: "#FFC107" }}>Research Study</h4>
            <p className="text-white/70 text-sm leading-relaxed">
              This platform is part of a research study comparing digital
              gamification versus traditional paper-based submissions.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2026 Talino-Ruiziano. All rights reserved.
          </p>
          <p className="text-white/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 fill-yellow-400 text-yellow-400" /> for learners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
