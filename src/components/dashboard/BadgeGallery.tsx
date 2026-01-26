import { Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

const badges: Badge[] = [
  { id: "1", name: "ILT Starter", emoji: "🌟", description: "Submit your first ILT", earned: true, earnedDate: "Jan 15" },
  { id: "2", name: "Week 1 Finisher", emoji: "📚", description: "Complete all Week 1 tasks", earned: true, earnedDate: "Jan 22" },
  { id: "3", name: "Hot Streak", emoji: "🔥", description: "5-day submission streak", earned: true, earnedDate: "Jan 25" },
  { id: "4", name: "Bookworm", emoji: "📖", description: "Read all study materials", earned: true, earnedDate: "Jan 28" },
  { id: "5", name: "Top Performer", emoji: "🏆", description: "Reach 500 points", earned: false },
  { id: "6", name: "Social Butterfly", emoji: "🦋", description: "Send 10 chat messages", earned: false },
  { id: "7", name: "Perfect Week", emoji: "💎", description: "Submit all ILTs on time", earned: false },
  { id: "8", name: "Master Scholar", emoji: "🎓", description: "Complete all course ILTs", earned: false },
];

const BadgeGallery = () => {
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title text-xl">Badge Gallery</h3>
        <span className="text-sm text-muted-foreground font-medium">
          {earnedCount}/{badges.length} Earned
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
              badge.earned 
                ? "bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 hover:scale-105 cursor-pointer" 
                : "bg-muted/50 border border-border opacity-60"
            }`}
          >
            <div className={`text-3xl mb-2 ${badge.earned ? "animate-float" : "grayscale"}`}>
              {badge.earned ? badge.emoji : <Lock className="w-8 h-8 mx-auto text-muted-foreground" />}
            </div>
            <p className={`font-medium text-sm ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
              {badge.name}
            </p>
            {badge.earned && badge.earnedDate && (
              <p className="text-xs text-accent mt-1">{badge.earnedDate}</p>
            )}
            
            {/* Tooltip on hover */}
            {badge.earned && (
              <div className="absolute inset-0 rounded-xl bg-primary/95 text-primary-foreground opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                <p className="text-xs">{badge.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeGallery;
