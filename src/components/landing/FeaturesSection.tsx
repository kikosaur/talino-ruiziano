import { Upload, Calendar, Music, MessageCircle, Award, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "ILT Submission Portal",
    description: "Submit your Independent Learning Tasks with ease and earn points instantly.",
    color: "bg-accent",
  },
  {
    icon: Award,
    title: "Earn Badges & Points",
    description: "Complete tasks to unlock achievements and climb the leaderboard.",
    color: "bg-primary",
  },
  {
    icon: Calendar,
    title: "Study Calendar",
    description: "Keep track of all your deadlines with our visual study calendar.",
    color: "bg-secondary",
  },
  {
    icon: Music,
    title: "Music Corner",
    description: "Stay focused with our curated study music playlists.",
    color: "bg-accent",
  },
  {
    icon: MessageCircle,
    title: "Peer Chat",
    description: "Connect with classmates, ask questions, and share resources.",
    color: "bg-primary",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics.",
    color: "bg-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="section-title">
            Everything You Need to{" "}
            <span className="text-gradient-gold">Excel</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our gamified platform makes learning engaging and rewarding. 
            Complete tasks, earn achievements, and track your progress.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-elevated p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-serif font-bold text-xl text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
