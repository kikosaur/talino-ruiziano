import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Music,
  Plus,
  X,
  Trash2,
  Loader2,
  Search,
  ChevronDown,
  Shuffle,
  Repeat,
  Repeat1,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { Input } from "@/components/ui/input";
import { useMusic, Track } from "@/hooks/useMusic";
import { toast } from "sonner";

interface MusicPlayerProps {
  isVisible: boolean;
  onToggle: () => void;
}

const MusicPlayer = ({ isVisible, onToggle }: MusicPlayerProps) => {
  const { tracks, isLoading: isPlaylistLoading, addTrack, removeTrack, fetchLibraryTracks } = useMusic();

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Playback Modes
  const [loopMode, setLoopMode] = useState<'all' | 'one' | 'none'>('all'); // Default loop playlist
  const [isShuffle, setIsShuffle] = useState(false);

  // Library State
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTracks, setLibraryTracks] = useState<Track[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Form State (for custom adds - removed from UI but keeping state to avoid errors if logic persists)
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newUrl, setNewUrl] = useState("");


  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  useEffect(() => {
    if (showLibrary) {
      loadLibrary();
    }
  }, [showLibrary]);

  const loadLibrary = async () => {
    setIsLoadingLibrary(true);
    const tracks = await fetchLibraryTracks();
    setLibraryTracks(tracks);
    setIsLoadingLibrary(false);
  };

  const filteredLibraryTracks = libraryTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!currentTrack) return;

    // Pause functionality of previous track if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create audio element
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.loop = false; // We handle loop manually

    const audio = audioRef.current;

    // Update progress
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // Handle track end
    const handleEnded = () => {
      if (loopMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    // Auto-play if state is Playing
    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]); // We don't depend on isPlaying or loopMode here to avoid re-creation, handling logic inside

  // Watch playback control changes (Note: loopMode handled in event listener closure? 
  // careful: handleEnded defined inside accesses closure loopMode. 
  // If loopMode changes, handleEnded is stale? YES. 
  // We need handleEnded to reference current State.
  // Actually, Effect runs on currentTrack change. If I change Loop Mode mid-song, it won't update the listener?
  // Correct. We need to attach listener cleanly or use Ref for loopMode.

  // Use Refs for latest state in listeners
  const loopModeRef = useRef(loopMode);
  const isShuffleRef = useRef(isShuffle);

  useEffect(() => { loopModeRef.current = loopMode; }, [loopMode]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);

  // Re-bind listener? Or just put loopMode in dependency?
  // Putting loopMode in dependency re-creates Audio. That's bad (stops music).
  // Better: Use the Ref inside the listener.

  // Let's rewrite the EFFECT to use refs for logic.

  useEffect(() => {
    if (!currentTrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = isMuted ? 0 : volume;

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      const currentLoop = loopModeRef.current;
      if (currentLoop === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextManual(true); // Pass flag its auto
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]); // Only re-create on track change.

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
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Helper for shuffle logic
  const getNextIndex = () => {
    if (isShuffleRef.current) {
      return Math.floor(Math.random() * tracks.length);
    }
    return currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? tracks.length - 1 : prev - 1
    );
    setProgress(0);
  };

  const handleNextManual = (isAuto = false) => {
    // If auto-next and loop is none and at end, stop.
    if (isAuto && loopModeRef.current === 'none' && currentTrackIndex === tracks.length - 1 && !isShuffleRef.current) {
      setIsPlaying(false);
      return;
    }

    setCurrentTrackIndex((prev) => {
      if (isShuffleRef.current) {
        let nextInd = Math.floor(Math.random() * tracks.length);
        // Avoid same song if possible
        if (tracks.length > 1 && nextInd === prev) {
          nextInd = (nextInd + 1) % tracks.length;
        }
        return nextInd;
      }
      return prev === tracks.length - 1 ? 0 : prev + 1;
    });
    setProgress(0);
  };

  // Exposed handleNext for button
  const handleNext = () => handleNextManual(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleLoop = () => {
    setLoopMode(prev => {
      if (prev === 'all') return 'one';
      if (prev === 'one') return 'none';
      return 'all'; // Default back to all
    });
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const handleAddTrack = async () => {
    if (!newTitle || !newArtist || !newUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsAdding(true);
    const success = await addTrack(newTitle, newArtist, newUrl);

    if (success) {
      setNewTitle("");
      setNewArtist("");
      setNewUrl("");
      // Form closed
    }
    setIsAdding(false);
  };

  const handleOpenLibrary = async () => {
    setIsAdding(true);
    const libs = await fetchLibraryTracks();
    setLibraryTracks(libs);
    setShowLibrary(true);
    setIsAdding(false);
  };

  const handleImportTrack = async (track: Track) => {
    if (confirm(`Add "${track.title}" to your playlist?`)) {
      await addTrack(track.title, track.artist, track.url);
      setShowLibrary(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  // Fallback if no tracks loaded yet - REMOVED to allow Library access
  // if (!currentTrack && !showLibrary) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        isExpanded
          ? "bottom-24 inset-x-4 w-auto sm:w-80 sm:inset-x-auto sm:bottom-6 sm:right-6"
          : "bottom-6 right-6 w-14"
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
      {isExpanded && !showLibrary && (
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Music className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Music Corner</span>
            </div>
            <div className="flex items-center gap-1">
              {/* Use a Library Button here */}
              <button
                onClick={handleOpenLibrary}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors text-xs flex items-center gap-1 mr-1 text-accent"
                title="Browse Library"
              >
                <span className="font-bold">Library</span>
              </button>
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
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground truncate">
                  {currentTrack ? currentTrack.title : "No music added"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {currentTrack ? currentTrack.artist : "Add songs from Library"}
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
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleShuffle}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 hover:bg-muted",
                    isShuffle ? "text-accent bg-accent/10" : "text-muted-foreground"
                  )}
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
                  title="Previous"
                  disabled={!currentTrack}
                >
                  <SkipBack className="w-5 h-5 text-foreground" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                  title={isPlaying ? "Pause" : "Play"}
                  disabled={!currentTrack}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
                  title="Next"
                  disabled={!currentTrack}
                >
                  <SkipForward className="w-5 h-5 text-foreground" />
                </button>

                <button
                  onClick={toggleLoop}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 hover:bg-muted",
                    loopMode !== 'none' ? "text-accent bg-accent/10" : "text-muted-foreground"
                  )}
                  title={loopMode === 'one' ? "Loop One" : loopMode === 'all' ? "Loop All" : "No Loop"}
                >
                  {loopMode === 'one' ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>
              </div>
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

          {/* Track List Header */}
          <div className="px-4 py-2 border-t border-border/50 flex justify-between items-center bg-muted/20">
            <span className="text-xs font-semibold text-muted-foreground">My Playlist</span>
            <span className="text-[10px] text-muted-foreground/70">
              {tracks.length} songs
            </span>
          </div>

          {/* Track List */}
          <div className="border-t border-border/50 overflow-y-auto flex-1 h-32">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  "w-full px-4 py-2 flex items-center justify-between group hover:bg-muted/50 transition-colors",
                  index === currentTrackIndex && "bg-accent/10"
                )}
              >
                <button
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-3 flex-1 text-left min-w-0"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    index === currentTrackIndex
                      ? "bg-accent text-primary-foreground"
                      : "bg-muted text-muted-foreground/70"
                  )}>
                    {isPlaying && index === currentTrackIndex ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      index + 1
                    )}
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

                {/* Delete Button (Only for user tracks) */}
                {track.is_user_added && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Remove this song from your playlist?")) {
                        removeTrack(track.id.toString());
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Song"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- LIBRARY MODAL/VIEW --- */}
      {isExpanded && showLibrary && (
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-accent" />
              <span className="font-semibold text-foreground">School Library</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowLibrary(false)}
            >
              Back to Player
            </Button>
          </div>

          {/* Library List */}
          {/* Description */}
          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Browse and add songs curated by your teachers.
            </p>
          </div>

          <div className="relative px-4 pb-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-accent/20 focus-visible:ring-accent"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            {isLoadingLibrary ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : filteredLibraryTracks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No songs found.</p>
            ) : (
              filteredLibraryTracks.map((track) => {
                const isAdded = tracks.some(t => t.title === track.title && t.artist === track.artist);
                // Actually library tracks have ID, playlist tracks have ID. 
                // But playlist ID != Library ID because it's a copy.
                // So checking by Title+Artist is safer, OR checking if we store library_id.
                // For now assuming existing logic checks content match or simply allows duplicates?
                // Let's use the 'Check if added' logic used before or simplest UI.

                // Simplest: Just use the button.
                return (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-accent/10 bg-background/50 hover:bg-accent/5 hover:border-accent/20 transition-all duration-300 group shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-foreground/90 group-hover:text-accent transition-colors">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate font-medium">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 rounded-full transition-all duration-300 ml-2",
                        isAdded
                          ? "bg-accent/20 text-accent hover:bg-accent/20 cursor-default"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => !isAdded && handleImportTrack(track)}
                      title={isAdded ? "Already in Playlist" : "Add to Playlist"}
                      disabled={isAdded}
                    >
                      {isAdded ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
