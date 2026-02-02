import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Track {
    id: string | number; // number for default tracks, string (UUID) for user tracks
    title: string;
    artist: string;
    url: string;
    is_user_added?: boolean;
}

// Default tracks removed as per request
export const defaultTracks: Track[] = [];

export const useMusic = () => {
    const { user } = useAuth();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user tracks
    const fetchUserTracks = async () => {
        if (!user) return;

        try {
            // Cast supabase to any to bypass strict type checks for new table
            const { data, error } = await (supabase as any)
                .from("user_playlists")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) throw error;

            if (data) {
                const userTracks: Track[] = (data as any[]).map(t => ({
                    id: t.id,
                    title: t.title,
                    artist: t.artist,
                    url: t.url,
                    is_user_added: true
                }));
                setTracks(userTracks); // Only user tracks
            }
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    // Add a new track
    const addTrack = async (title: string, artist: string, url: string) => {
        if (!user) {
            toast.error("You must be logged in to add music");
            return false;
        }

        try {
            setIsLoading(true);
            const { error } = await (supabase as any)
                .from("user_playlists")
                .insert({
                    user_id: user.id,
                    title,
                    artist,
                    url
                });

            if (error) throw error;

            toast.success("Track added to your playlist!");
            await fetchUserTracks();
            return true;
        } catch (error) {
            console.error("Error adding track:", error);
            toast.error("Failed to add track");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Remove a track
    const removeTrack = async (trackId: string) => {
        if (!user) return;

        try {
            const { error } = await (supabase as any)
                .from("user_playlists")
                .delete()
                .eq("id", trackId);

            if (error) throw error;

            toast.success("Track removed");
            await fetchUserTracks();
        } catch (error) {
            console.error("Error removing track:", error);
            toast.error("Failed to remove track");
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUserTracks();
    }, [user]);

    // --- Music Library Functions (Teacher/Admin) ---

    const fetchLibraryTracks = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from("music_library")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Track[];
        } catch (error) {
            console.error("Error fetching music library:", error);
            return [];
        }
    };

    const addLibraryTrack = async (title: string, artist: string, url: string) => {
        if (!user) return false;
        try {
            const { error } = await (supabase as any)
                .from("music_library")
                .insert({
                    title,
                    artist,
                    url,
                    created_by: user.id
                });

            if (error) throw error;
            toast.success("Song added to Global Library");
            return true;
        } catch (error) {
            console.error("Error adding to library:", error);
            toast.error("Failed to add song to library");
            return false;
        }
    };

    const deleteLibraryTrack = async (id: string) => {
        try {
            const { error } = await (supabase as any)
                .from("music_library")
                .delete()
                .eq("id", id);

            if (error) throw error;
            toast.success("Song deleted from library");
            return true;
        } catch (error) {
            console.error("Error deleting from library:", error);
            toast.error("Failed to delete song");
            return false;
        }
    };

    const updateLibraryTrack = async (id: string, title: string, artist: string, url: string) => {
        try {
            const { error } = await (supabase as any)
                .from("music_library")
                .update({
                    title,
                    artist,
                    url
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Song updated successfully");
            return true;
        } catch (error) {
            console.error("Error updating song:", error);
            toast.error("Failed to update song");
            return false;
        }
    };

    return {
        tracks,
        isLoading,
        addTrack,
        removeTrack,
        refreshTracks: fetchUserTracks,
        // Library exports
        fetchLibraryTracks,
        addLibraryTrack,
        updateLibraryTrack,
        deleteLibraryTrack
    };
};
