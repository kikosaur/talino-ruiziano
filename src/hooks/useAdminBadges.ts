import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./useBadges";

export const useAdminBadges = () => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchBadges = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("badges")
                .select("*")
                .order("required_points", { ascending: true });

            if (error) throw error;

            // Map the database rows to the Badge interface which requires an 'earned' property
            const mappedBadges: Badge[] = (data || []).map(badge => ({
                ...badge,
                earned: false // In admin view, we don't track if the admin earned it
            }));

            setBadges(mappedBadges);
        } catch (error) {
            console.error("Error fetching badges:", error);
            toast({
                title: "Error loading badges",
                description: "Failed to fetch the list of badges.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBadges();
    }, [fetchBadges]);

    const addBadge = async (newBadge: Omit<Badge, "id" | "earned" | "earnedDate">) => {
        try {
            const { error } = await supabase.from("badges").insert([newBadge]);
            if (error) throw error;

            toast({
                title: "Badge Added",
                description: "The new badge has been created successfully.",
            });
            await fetchBadges();
            return true;
        } catch (error) {
            console.error("Error creating badge:", error);
            toast({
                title: "Failed to add badge",
                description: "An error occurred while creating the badge.",
                variant: "destructive",
            });
            return false;
        }
    };

    const updateBadge = async (id: string, updates: Partial<Omit<Badge, "id" | "earned" | "earnedDate">>) => {
        try {
            const { error } = await supabase
                .from("badges")
                .update(updates)
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Badge Updated",
                description: "The badge details have been successfully updated.",
            });
            await fetchBadges();
            return true;
        } catch (error) {
            console.error("Error updating badge:", error);
            toast({
                title: "Failed to update badge",
                description: "An error occurred while saving the changes.",
                variant: "destructive",
            });
            return false;
        }
    };

    const deleteBadge = async (id: string) => {
        try {
            const { error } = await supabase
                .from("badges")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Badge Deleted",
                description: "The badge has been successfully removed.",
            });
            await fetchBadges();
            return true;
        } catch (error) {
            console.error("Error deleting badge:", error);
            toast({
                title: "Failed to delete badge",
                description: "Make sure no users have earned this badge before deleting it.",
                variant: "destructive",
            });
            return false;
        }
    };

    return {
        badges,
        isLoading,
        refreshBadges: fetchBadges,
        addBadge,
        updateBadge,
        deleteBadge,
    };
};
