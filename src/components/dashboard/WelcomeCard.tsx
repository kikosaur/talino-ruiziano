import { Trophy, Flame, Target } from "lucide-react";

interface WelcomeCardProps {
  studentName: string;
  points: number;
  streak: number;
  level: number;
}

const WelcomeCard = ({ studentName, points, streak, level }: WelcomeCardProps) => {
  const avatarEmoji = "🎓"; // Could be customizable later

  return (
    <div className="card-elevated p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side - Avatar and greeting */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-[hsl(40,100%,55%)] rounded-2xl flex items-center justify-center shadow-[var(--shadow-gold)] text-4xl animate-float">
            {avatarEmoji}
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Welcome back,</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              {studentName}
            </h2>
            <p className="text-muted-foreground">Level {level} Scholar</p>
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex flex-wrap gap-4">
          {/* Points */}
          <div className="points-display">
            <Trophy className="w-5 h-5" />
            <span>{points.toLocaleString()}</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full shadow-[var(--shadow-soft)]">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold">{streak} Day Streak</span>
          </div>

          {/* Tasks completed */}
          <div className="flex items-center gap-2 bg-card border border-border px-5 py-2 rounded-full shadow-sm">
            <Target className="w-5 h-5 text-secondary" />
            <span className="font-medium text-foreground">12/15 ILTs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
