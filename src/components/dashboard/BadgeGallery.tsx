import { Lock, Loader2, Award } from "lucide-react";
import { useBadges } from "@/hooks/useBadges";

const BadgeGallery = () => {
  const { badges, isLoading } = useBadges();
  const earnedCount = badges.filter(b => b.earned).length;

  if (isLoading) {
    return (
      <div className="card-elevated p-6 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
        <p className="text-muted-foreground">Loading badges...</p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title text-xl">Badge Gallery</h3>
        <span className="text-sm text-muted-foreground font-medium">
          {earnedCount}/{badges.length} Earned
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No badges available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-xl text-center transition-all duration-300 ${badge.earned
                  ? "bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 hover:scale-105 cursor-pointer"
                  : "bg-muted/50 border border-border opacity-60"
                }`}
            >
              <div className={`text-3xl mb-2 ${badge.earned ? "animate-float" : "grayscale"}`}>
                {badge.earned ? (
                  <span>{badge.icon}</span>
                ) : (
                  <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
                )}
              </div>
              <p className={`font-medium text-sm ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
                {badge.name}
              </p>
              {badge.earned && badge.earnedDate && (
                <p className="text-xs text-accent mt-1">{badge.earnedDate}</p>
              )}

              {/* Tooltip on hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/95 text-primary-foreground opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-3 z-10">
                <p className="text-xs text-center">
                  {badge.description}
                  {!badge.earned && badge.required_points && (
                    <span className="block mt-1 pt-1 border-t border-white/20">
                      Requires {badge.required_points} pts
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeGallery;
