import { useState, useEffect } from "react";
import { useMusic, Track } from "@/hooks/useMusic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Music,
    Loader2,
    Plus,
    Play,
    Pause,
    Search,
    Headphones,
    ExternalLink,
    Pencil
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const MusicManager = () => {
    const { fetchLibraryTracks, addLibraryTrack, updateLibraryTrack, deleteLibraryTrack } = useMusic();
    const [libraryTracks, setLibraryTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [url, setUrl] = useState("");

    // Preview state
    const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
    const [previewingId, setPreviewingId] = useState<string | number | null>(null);

    const loadTracks = async () => {
        setIsLoading(true);
        const tracks = await fetchLibraryTracks();
        setLibraryTracks(tracks);
        setIsLoading(false);
    };

    useEffect(() => {
        loadTracks();
        return () => {
            if (previewAudio) {
                previewAudio.pause();
                setPreviewAudio(null);
            }
        };
    }, []);

    const resetForm = () => {
        setTitle("");
        setArtist("");
        setUrl("");
        setEditingTrack(null);
    };

    const openAddDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (track: Track) => {
        setEditingTrack(track);
        setTitle(track.title);
        setArtist(track.artist);
        setUrl(track.url);
        setIsDialogOpen(true);
    };

    const processUrl = (inputUrl: string) => {
        let processed = inputUrl.trim();

        // Handle Google Drive (various formats)
        // Matches: /file/d/ID, id=ID, open?id=ID
        const driveRegex = /(?:\/file\/d\/|id=|open\?id=)([a-zA-Z0-9_-]+)/;
        if (processed.includes('google.com') && driveRegex.test(processed)) {
            const matches = processed.match(driveRegex);
            if (matches && matches[1]) {
                // Use docs.google.com for better streaming reliability
                return `https://docs.google.com/uc?export=download&id=${matches[1]}`;
            }
        }

        // Handle Dropbox
        if (processed.includes('dropbox.com') && processed.includes('dl=0')) {
            return processed.replace('dl=0', 'dl=1');
        }

        return processed;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !artist || !url) {
            toast.error("Please fill in all fields");
            return;
        }

        const finalUrl = processUrl(url);

        setIsSubmitting(true);
        let success = false;

        if (editingTrack) {
            success = await updateLibraryTrack(editingTrack.id.toString(), title, artist, finalUrl);
        } else {
            success = await addLibraryTrack(title, artist, finalUrl);
        }

        if (success) {
            resetForm();
            loadTracks();
            setIsDialogOpen(false);
            if (finalUrl !== url) {
                toast.success("Link automatically converted for streaming!");
            }
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string, songTitle: string) => {
        if (confirm(`Are you sure you want to delete "${songTitle}" from the library?`)) {
            const success = await deleteLibraryTrack(id);
            if (success) {
                loadTracks();
            }
        }
    };

    const togglePreview = (track: Track) => {
        if (previewingId === track.id) {
            // Stop
            previewAudio?.pause();
            setPreviewingId(null);
            setPreviewAudio(null);
        } else {
            // Stop current
            if (previewAudio) previewAudio.pause();

            // Start new
            const audio = new Audio(track.url);
            audio.play().catch(e => toast.error("Could not play preview. Check URL."));
            audio.onended = () => setPreviewingId(null);
            setPreviewAudio(audio);
            setPreviewingId(track.id);
        }
    };

    const filteredTracks = libraryTracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="p-6 lg:p-8 transition-all duration-300 space-y-8 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-xl">
                            <Music className="w-8 h-8 text-accent" />
                        </div>
                        Music Library
                    </h1>
                    <p className="text-muted-foreground">
                        Manage the school's curated music collection for students.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={openAddDialog}
                            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Song
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingTrack ? "Edit Song" : "Add Song to Library"}</DialogTitle>
                            <DialogDescription>
                                {editingTrack ? "Update the song details below." : "Add a high-quality MP3 link for students to listen to."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Song Title</label>
                                <Input
                                    placeholder="e.g. Lofi Study Beats"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Artist</label>
                                <Input
                                    placeholder="e.g. Chillhop Music"
                                    value={artist}
                                    onChange={e => setArtist(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">MP3 URL</label>
                                <Input
                                    placeholder="https://..."
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Direct link to audio file required.</p>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {editingTrack ? "Save Changes" : "Add Song"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search songs or artists..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 bg-card"
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg border border-border">
                    <Headphones className="w-4 h-4" />
                    <span>{libraryTracks.length} Songs in Library</span>
                </div>
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    <p className="text-muted-foreground">Loading library...</p>
                </div>
            ) : filteredTracks.length === 0 ? (
                <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-muted rounded-2xl">
                    <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No songs found</h3>
                    <p className="text-muted-foreground text-sm">
                        {searchQuery ? "Try a different search term" : "Get started by adding some music!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTracks.map(track => (
                        <Card key={track.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted/60">
                            <CardContent className="p-5 flex flex-col gap-4 h-full">
                                {/* Top: Icon & Play */}
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent">
                                        {previewingId === track.id ? (
                                            <div className="flex gap-1 h-4 items-end">
                                                <div className="w-1 bg-accent h-full animate-[bounce_1s_infinite]" />
                                                <div className="w-1 bg-accent h-2 animate-[bounce_1.2s_infinite]" />
                                                <div className="w-1 bg-accent h-3 animate-[bounce_0.8s_infinite]" />
                                            </div>
                                        ) : (
                                            <Music className="w-6 h-6" />
                                        )}
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                        onClick={() => togglePreview(track)}
                                        title={previewingId === track.id ? "Pause Preview" : "Play Preview"}
                                    >
                                        {previewingId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                    </Button>
                                </div>

                                {/* Middle: Info */}
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-bold truncate" title={track.title}>{track.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="truncate max-w-[150px]" title={track.artist}>{track.artist}</span>
                                    </div>
                                </div>

                                {/* Bottom: Actions */}
                                <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-2 mt-auto">
                                    <a
                                        href={track.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" /> Source
                                    </a>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-8 px-2"
                                            onClick={() => openEditDialog(track)}
                                            title="Edit Song"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                            onClick={() => handleDelete(track.id.toString(), track.title)}
                                            title="Delete Song"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MusicManager;
