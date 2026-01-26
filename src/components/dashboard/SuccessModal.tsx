import { Trophy, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  pointsEarned: number;
  newTotal: number;
}

const SuccessModal = ({ isOpen, onClose, fileName, pointsEarned, newTotal }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative card-elevated p-8 max-w-md w-full text-center space-y-6 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-accent to-[hsl(40,100%,55%)] rounded-full flex items-center justify-center mx-auto shadow-[var(--shadow-gold)] animate-bounce-slow">
          <CheckCircle className="w-10 h-10 text-accent-foreground" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            🎉 Submission Successful!
          </h2>
          <p className="text-muted-foreground">
            Your ILT has been submitted successfully
          </p>
        </div>

        {/* File info */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">File submitted:</p>
          <p className="font-medium text-foreground truncate">{fileName}</p>
        </div>

        {/* Points earned */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="points-display text-xl animate-pulse">
              <Trophy className="w-6 h-6" />
              <span>+{pointsEarned} Points!</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            New total: <span className="font-bold text-foreground">{newTotal.toLocaleString()} points</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-2">
          <Button onClick={onClose} className="btn-gold">
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
