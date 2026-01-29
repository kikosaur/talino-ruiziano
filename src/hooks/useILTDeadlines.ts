import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ILTDeadline {
    id: string;
    name: string;
    subject: string;
    description: string;
    deadline: string; // ISO date string
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
                    createdAt: d.created_at,
                    updatedAt: d.updated_at
                }));
                setDeadlines(mapped);

                // Migration check: If we have data in localStorage and we are a teacher, sync it
                if (isTeacher) {
                    const stored = localStorage.getItem("ilt_deadlines_v2");
                    if (stored) {
                        try {
                            const localDeadlines = JSON.parse(stored);
                            if (localDeadlines.length > 0) {
                                console.log("Migrating local deadlines to Supabase...");
                                for (const local of localDeadlines) {
                                    const exists = data.some((d: any) => d.name === local.name);
                                    if (!exists) {
                                        await (supabase.from("ilt_deadlines") as any).insert({
                                            name: local.name,
                                            subject: local.subject || "General",
                                            description: local.description || "",
                                            deadline: local.deadline
                                        });
                                    }
                                }
                                localStorage.removeItem("ilt_deadlines_v2");
                                // We don't call fetchDeadlines recursively here to avoid loops, 
                                // but the state will be updated on the next manual/auto refresh.
                                // Actually, one refresh is fine.
                            } else {
                                localStorage.removeItem("ilt_deadlines_v2");
                            }
                        } catch (e) {
                            console.error("Migration failed", e);
                        }
                    }
                }
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

    const resetToDefaults = useCallback(async () => {
        if (!isTeacher) return;
        try {
            const { error: deleteError } = await (supabase.from("ilt_deadlines") as any).delete().neq("id", "00000000-0000-0000-0000-000000000000");

            if (deleteError) throw deleteError;

            const defaults = [
                { name: 'Math Week 1', subject: 'Mathematics', description: 'Basic algebraic expressions', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
                { name: 'English Essay', subject: 'English', description: 'Write a 500-word essay on a classic novel', deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
                { name: 'Science Lab', subject: 'Science', description: 'Chemical reaction report', deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() }
            ];

            await (supabase.from("ilt_deadlines") as any).insert(defaults);
            await fetchDeadlines();
        } catch (error) {
            console.error("Error resetting deadlines:", error);
        }
    }, [isTeacher, fetchDeadlines]);

    return {
        deadlines,
        isLoading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        getDeadline,
        resetToDefaults,
        refreshDeadlines: fetchDeadlines,
    };
};
