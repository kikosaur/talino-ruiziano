import { useState, useRef, useEffect } from "react";
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Lo-Fi tracks using free royalty-free audio
const lofiTracks = [
  {
    id: 1,
    title: "Chill Vibes",
    artist: "Study Beats",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
  },
  {
    id: 2,
    title: "Focus Mode",
    artist: "Lo-Fi Dreams",
    url: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc6eb42.mp3"
  },
  {
    id: 3,
    title: "Late Night Study",
    artist: "Ambient Waves",
    url: "https://cdn.pixabay.com/download/audio/2022/02/22/audio_d1718ab41b.mp3"
  },
  {
    id: 4,
    title: "Coffee Shop",
    artist: "Mellow Beats",
    url: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb5efc4a09.mp3"
  },
  {
    id: 5,
    title: "Rainy Day",
    artist: "Calm Collective",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3"
  }
];

interface MusicPlayerProps {
  isVisible: boolean;
  onToggle: () => void;
}

const MusicPlayer = ({ isVisible, onToggle }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = lofiTracks[currentTrackIndex];

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = volume;
    audioRef.current.loop = false;

    const audio = audioRef.current;

    // Update progress
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // Handle track end
    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => 
      prev === 0 ? lofiTracks.length - 1 : prev - 1
    );
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => 
      prev === lofiTracks.length - 1 ? 0 : prev + 1
    );
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
        isExpanded ? "w-80" : "w-14"
      )}
    >
      {/* Collapsed State - Just an icon button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
        >
          <Music className="w-6 h-6 text-primary-foreground" />
        </button>
      )}

      {/* Expanded Player */}
      {isExpanded && (
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Music className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Music Corner</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Track Info */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center flex-shrink-0">
                <Music className={cn(
                  "w-6 h-6 text-accent",
                  isPlaying && "animate-bounce"
                )} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {currentTrack.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-muted rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <SkipBack className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <SkipForward className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>

          {/* Track List */}
          <div className="border-t border-border/50 max-h-32 overflow-y-auto">
            {lofiTracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={cn(
                  "w-full px-4 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left",
                  index === currentTrackIndex && "bg-accent/10"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index === currentTrackIndex 
                    ? "bg-accent text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    index === currentTrackIndex ? "text-accent font-medium" : "text-foreground"
                  )}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
