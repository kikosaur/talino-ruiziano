import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ILTDeadline {
    id: string;
    name: string;
    subject: string;
    description: string;
    deadline: string; // ISO date string
    is_archived: boolean;
    createdAt: string;
    updatedAt: string;
}

export const useILTDeadlines = () => {
    const { isTeacher } = useAuth();
    const [deadlines, setDeadlines] = useState<ILTDeadline[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDeadlines = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await (supabase.from("ilt_deadlines") as any)
                .select("*")
                .order("deadline", { ascending: true });

            if (error) throw error;

            if (data) {
                const mapped: ILTDeadline[] = data.map((d: any) => ({
                    id: d.id,
                    name: d.name,
                    subject: d.subject || "General",
                    description: d.description || "",
                    deadline: d.deadline,
                    is_archived: d.is_archived || false,
                    createdAt: d.created_at,
                    updatedAt: d.updated_at
                }));
                setDeadlines(mapped);

                // Migration logic removed
            }
        } catch (error) {
            console.error("Error loading deadlines from Supabase:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isTeacher]);

    useEffect(() => {
        fetchDeadlines();
    }, [fetchDeadlines]);

    const addDeadline = useCallback(
        async (name: string, subject: string, description: string, deadline: Date): Promise<ILTDeadline | null> => {
            if (!isTeacher) return null;

            try {
                const { data, error } = await (supabase.from("ilt_deadlines") as any)
                    .insert({
                        name,
                        subject,
                        description,
                        deadline: deadline.toISOString(),
                        is_archived: false
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newDeadline: ILTDeadline = {
                    id: data.id,
                    name: data.name,
                    subject: data.subject,
                    description: data.description,
                    deadline: data.deadline,
                    is_archived: data.is_archived || false,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                };

                setDeadlines(prev => [...prev, newDeadline].sort(
                    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                ));
                return newDeadline;
            } catch (error) {
                console.error("Error adding deadline:", error);
                return null;
            }
        },
        [isTeacher]
    );

    const updateDeadline = useCallback(
        async (id: string, updates: Partial<Omit<ILTDeadline, "id" | "createdAt">>): Promise<boolean> => {
            if (!isTeacher) return false;

            try {
                const { error } = await (supabase.from("ilt_deadlines") as any)
                    .update({
                        name: updates.name,
                        subject: updates.subject,
                        description: updates.description,
                        deadline: updates.deadline,
                        is_archived: updates.is_archived,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", id);

                if (error) throw error;

                await fetchDeadlines();
                return true;
            } catch (error) {
                console.error("Error updating deadline:", error);
                return false;
            }
        },
        [isTeacher, fetchDeadlines]
    );

    const archiveDeadline = useCallback(
        async (id: string, isArchived: boolean): Promise<boolean> => {
            if (!isTeacher) return false;

            try {
                const { error } = await (supabase.from("ilt_deadlines") as any)
                    .update({
                        is_archived: isArchived,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", id);

                if (error) throw error;

                await fetchDeadlines(); // Refresh to update list
                return true;
            } catch (error) {
                console.error("Error archiving deadline:", error);
                return false;
            }
        },
        [isTeacher, fetchDeadlines]
    );

    const deleteDeadline = useCallback(
        async (id: string): Promise<boolean> => {
            if (!isTeacher) return false;

            try {
                const { error } = await (supabase.from("ilt_deadlines") as any)
                    .delete()
                    .eq("id", id);

                if (error) throw error;

                setDeadlines(prev => prev.filter(d => d.id !== id));
                return true;
            } catch (error) {
                console.error("Error deleting deadline:", error);
                return false;
            }
        },
        [isTeacher]
    );

    const getDeadline = useCallback(
        (id: string): ILTDeadline | undefined => {
            return deadlines.find((d) => d.id === id);
        },
        [deadlines]
    );

    // resetToDefaults removed to prevent placeholder data generation

    return {
        deadlines,
        isLoading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        archiveDeadline,
        getDeadline,
        refreshDeadlines: fetchDeadlines,
    };
};
