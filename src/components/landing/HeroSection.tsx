import { ArrowRight, Sparkles, Trophy, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 px-4 flex items-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">
                Gamified Learning Experience
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Learn with{" "}
              <span className="text-gradient-gold">Purpose</span>,{" "}
              <br className="hidden sm:block" />
              Earn with{" "}
              <span className="text-gradient-maroon">Pride</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Complete your Independent Learning Tasks, earn points, unlock achievements, 
              and track your academic journey in a fun and engaging way.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button className="btn-gold text-lg flex items-center gap-2 group">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="btn-maroon text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                { icon: Trophy, label: "Points to Earn", value: "1000+" },
                { icon: Target, label: "Achievements", value: "25+" },
              ].map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="flex items-center gap-3 animate-slide-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border border-border shadow-sm">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Visual element */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative z-10">
              {/* Main card */}
              <div className="card-elevated p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-[hsl(40,100%,55%)] rounded-2xl flex items-center justify-center shadow-[var(--shadow-gold)]">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground">Student Progress</h3>
                    <p className="text-muted-foreground">Week 3 of 10</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ILT Completion</span>
                    <span className="font-semibold text-foreground">75%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-[hsl(40,100%,55%)] rounded-full transition-all duration-1000"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                {/* Recent badges */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Recent Achievements</p>
                  <div className="flex gap-2 flex-wrap">
                    {["🌟 ILT Starter", "📚 Week 1", "🔥 Streak"].map((badge) => (
                      <span key={badge} className="badge-earned text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Points display */}
                <div className="flex justify-center">
                  <div className="points-display text-lg">
                    <Trophy className="w-5 h-5" />
                    <span>750 Points</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-2xl flex items-center justify-center shadow-[var(--shadow-gold)] animate-float">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-[var(--shadow-soft)] animate-float" style={{ animationDelay: "0.5s" }}>
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
