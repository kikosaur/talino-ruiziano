import { BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[var(--shadow-gold)]">
                <BookOpen className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-serif font-bold">
                Talino-Ruiziano
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A gamified Learning Management System designed to make 
              learning engaging and rewarding for students.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg">Research Study</h4>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              This platform is part of a research study comparing digital 
              gamification versus traditional paper-based submissions.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Talino-Ruiziano. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> for learners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
