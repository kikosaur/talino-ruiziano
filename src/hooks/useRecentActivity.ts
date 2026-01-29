import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useILTDeadlines } from "@/hooks/useILTDeadlines";
import { formatDistanceToNow } from "date-fns";

export interface Activity {
    id: string;
    type: "submission" | "badge" | "chat" | "deadline";
    title: string;
    description: string;
    time: string;
    timestamp: Date; // For sorting
    points?: number;
}

export const useRecentActivity = () => {
    const { user } = useAuth();
    const { deadlines } = useILTDeadlines();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!user) return;

            setIsLoading(true);
            const newActivities: Activity[] = [];

            try {
                // 1. Fetch recent submissions
                const { data: submissions } = await supabase
                    .from("submissions")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("submitted_at", { ascending: false })
                    .limit(5);

                if (submissions) {
                    submissions.forEach((sub) => {
                        newActivities.push({
                            id: `sub-${sub.id}`,
                            type: "submission",
                            title: "ILT Submitted",
                            description: sub.ilt_name,
                            time: formatDistanceToNow(new Date(sub.submitted_at), { addSuffix: true }),
                            timestamp: new Date(sub.submitted_at),
                            points: sub.points_awarded,
                        });
                    });
                }

                // 2. Fetch earned badges
                const { data: userBadges } = await supabase
                    .from("user_badges")
                    .select("*, badges(*)")
                    .eq("user_id", user.id)
                    .order("earned_at", { ascending: false })
                    .limit(5);

                if (userBadges) {
                    userBadges.forEach((ub: any) => {
                        if (ub.badges) {
                            newActivities.push({
                                id: `badge-${ub.id}`,
                                type: "badge",
                                title: "Badge Earned!",
                                description: ub.badges.name,
                                time: formatDistanceToNow(new Date(ub.earned_at), { addSuffix: true }),
                                timestamp: new Date(ub.earned_at),
                            });
                        }
                    });
                }

                // 3. Add upcoming deadlines (from local storage hook)
                // Filter for deadlines in the future, sort by closest
                const now = new Date();
                const upcoming = deadlines
                    .filter((d) => new Date(d.deadline) > now)
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 3);

                upcoming.forEach((d) => {
                    newActivities.push({
                        id: `deadline-${d.id}`,
                        type: "deadline",
                        title: "Upcoming Deadline",
                        description: `${d.name} (${d.subject})`,
                        time: formatDistanceToNow(new Date(d.deadline), { addSuffix: true }),
                        timestamp: new Date(d.createdAt), // Use creation time for "recent activity" feed? Or maybe just show them at the top? 
                        // Actually, for a "History" feed, future deadlines don't make sense to mix in by timestamp if we sort by "Recent". 
                        // But the UI shows "Recent Activity". 
                        // Let's treat "Upcoming Deadline" as something that is relevant NOW.
                        // We'll give it a fake timestamp of "now" so it appears at the top, or just append it.
                    });
                });

                // 4. Sort all by timestamp descending (newest first)
                // For deadlines, they don't really have a "happened at" time generally, 
                // but if we want them to appear, we can filter them separately or include them.
                // Let's include them but if they are future, maybe they shouldn't be in "Recent Activity" history?
                // The original placeholder had "Upcoming Deadline". 
                // Let's keep them and stick them at the top.

                const history = newActivities.filter(a => a.type !== 'deadline');
                history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                // Combine: Deadlines first, then history
                const finalActivities = [
                    ...newActivities.filter(a => a.type === 'deadline'),
                    ...history
                ].slice(0, 10); // Limit total items

                setActivities(finalActivities);
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [user, deadlines]);

    return { activities, isLoading };
};
