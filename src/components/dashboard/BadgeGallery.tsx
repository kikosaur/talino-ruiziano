import {
  Lock,
  Loader2,
  Award,
  Zap,
  Flame,
  GraduationCap,
  Calendar,
  MessageCircle,
  Trophy,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import { useBadges } from "@/hooks/useBadges";

const iconMap: Record<string, any> = {
  Zap,
  Flame,
  GraduationCap,
  Calendar,
  MessageCircle,
  Trophy,
  CheckCircle,
  Clock,
  Star,
  Award
};

const BadgeGallery = () => {
  const { badges, isLoading } = useBadges();
  const earnedCount = badges.filter(b => b.earned).length;

  const renderBadgeIcon = (badge: any) => {
    const IconComponent = iconMap[badge.icon];

    if (IconComponent) {
      return <IconComponent className={`w-8 h-8 mx-auto ${badge.earned ? "text-accent" : "text-muted-foreground/40"}`} />;
    }

    // Fallback to emoji if not in map
    return (
      <span className={`text-3xl ${badge.earned ? "" : "opacity-30 grayscale"}`}>
        {badge.icon || "🏅"}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="card-elevated p-6 flex flex-col items-center justify-center min-h-[240px]">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
        <p className="text-muted-foreground">Polishing your medals...</p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="section-title text-2xl flex items-center gap-3">
            <Award className="w-6 h-6 text-accent" />
            Badge Gallery
          </h3>
          <p className="text-sm text-muted-foreground">Complete challenges to unlock unique rewards</p>
        </div>
        <div className="bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
          <span className="text-sm text-accent font-bold">
            {earnedCount}/{badges.length} Earned
          </span>
        </div>
      </div>

      {badges.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-10" />
          <p>The trophy cabinet is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`group relative p-6 rounded-2xl text-center transition-all duration-500 hover:z-20 ${badge.earned
                ? "bg-gradient-to-br from-accent/10 via-background to-accent/5 border-2 border-accent/20 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                : "bg-muted/30 border border-border/50 hover:bg-muted/50"
                }`}
            >
              <div className={`mb-3 transition-transform duration-500 group-hover:scale-110 ${badge.earned ? "animate-float" : ""}`}>
                {renderBadgeIcon(badge)}
              </div>

              <div className="space-y-1">
                <p className={`font-bold text-sm tracking-tight ${badge.earned ? "text-foreground" : "text-muted-foreground"}`}>
                  {badge.name}
                </p>
                {badge.earned && badge.earnedDate ? (
                  <p className="text-[10px] text-accent/80 font-medium uppercase tracking-wider">{badge.earnedDate}</p>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60 uppercase font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    Locked
                  </div>
                )}
              </div>

              {/* Tooltip/Detail on hover */}
              <div className="absolute inset-0 rounded-2xl bg-secondary/95 text-secondary-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 z-10 scale-95 group-hover:scale-100">
                <p className="text-xs font-medium leading-relaxed">
                  {badge.description}
                </p>
                {!badge.earned && (badge.required_points || badge.required_submissions) && (
                  <div className="mt-2 pt-2 border-t border-secondary-foreground/20 w-full">
                    <p className="text-[10px] uppercase font-bold text-accent">Requirement:</p>
                    <p className="text-[10px] opacity-80">
                      {badge.required_points && `${badge.required_points} Points`}
                      {badge.required_points && badge.required_submissions && " + "}
                      {badge.required_submissions && `${badge.required_submissions} Submissions`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeGallery;
