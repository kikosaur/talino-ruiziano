import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export interface Badge {
    id: string;
    name: string;
    icon: string; // Emoji or icon name
    description: string;
    required_points: number | null;
    required_submissions: number | null;
    earned: boolean;
    earnedDate?: string;
}

export const useBadges = () => {
    const { user } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBadges = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                // 1. Fetch all available badges
                const { data: allBadges, error: badgesError } = await supabase
                    .from("badges")
                    .select("*")
                    .order("required_points", { ascending: true });

                if (badgesError) throw badgesError;

                // 2. Fetch badges earned by the user
                const { data: userBadges, error: userBadgesError } = await supabase
                    .from("user_badges")
                    .select("badge_id, earned_at")
                    .eq("user_id", user.id);

                if (userBadgesError) throw userBadgesError;

                // Create a map of earned badges for quick lookup
                const earnedMap = new Map(
                    userBadges.map((ub) => [ub.badge_id, ub.earned_at])
                );

                // 3. Merge data
                const mergedBadges: Badge[] = (allBadges || []).map((badge) => {
                    const earnedAt = earnedMap.get(badge.id);
                    return {
                        id: badge.id,
                        name: badge.name,
                        icon: badge.icon || "🏅", // Fallback icon
                        description: badge.description,
                        required_points: badge.required_points,
                        required_submissions: badge.required_submissions,
                        earned: !!earnedAt,
                        earnedDate: earnedAt ? format(new Date(earnedAt), "MMM d, yyyy") : undefined,
                    };
                });

                setBadges(mergedBadges);
            } catch (err) {
                console.error("Error fetching badges:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch badges");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBadges();
    }, [user]);

    return { badges, isLoading, error };
};
