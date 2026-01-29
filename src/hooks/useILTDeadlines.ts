import { useState, useEffect, useCallback } from "react";

export interface ILTDeadline {
    id: string;
    name: string;
    subject: string;
    description: string;
    deadline: string; // ISO date string
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = "ilt_deadlines_v2";

// Default deadlines if none exist
const defaultDeadlines: ILTDeadline[] = [];

export const useILTDeadlines = () => {
    const [deadlines, setDeadlines] = useState<ILTDeadline[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load deadlines from localStorage
    const loadDeadlines = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Migration: add default subject if missing
                const migrated = parsed.map((d: any) => ({
                    ...d,
                    subject: d.subject || "General"
                }));
                setDeadlines(migrated);
            } else {
                // Initialize with defaults
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDeadlines));
                setDeadlines(defaultDeadlines);
            }
        } catch (error) {
            console.error("Error loading deadlines:", error);
            setDeadlines(defaultDeadlines);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDeadlines();
    }, [loadDeadlines]);

    // Save to localStorage whenever deadlines change
    const saveDeadlines = useCallback((newDeadlines: ILTDeadline[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDeadlines));
        setDeadlines(newDeadlines);
    }, []);

    // Add a new deadline
    const addDeadline = useCallback(
        (name: string, subject: string, description: string, deadline: Date): ILTDeadline => {
            const newDeadline: ILTDeadline = {
                id: `ilt-${Date.now()}`,
                name,
                subject,
                description,
                deadline: deadline.toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const updated = [...deadlines, newDeadline].sort(
                (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
            saveDeadlines(updated);
            return newDeadline;
        },
        [deadlines, saveDeadlines]
    );

    // Update an existing deadline
    const updateDeadline = useCallback(
        (id: string, updates: Partial<Omit<ILTDeadline, "id" | "createdAt">>): boolean => {
            const index = deadlines.findIndex((d) => d.id === id);
            if (index === -1) return false;

            const updated = [...deadlines];
            updated[index] = {
                ...updated[index],
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            // Re-sort by deadline
            updated.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
            saveDeadlines(updated);
            return true;
        },
        [deadlines, saveDeadlines]
    );

    // Delete a deadline
    const deleteDeadline = useCallback(
        (id: string): boolean => {
            const updated = deadlines.filter((d) => d.id !== id);
            if (updated.length === deadlines.length) return false;

            saveDeadlines(updated);
            return true;
        },
        [deadlines, saveDeadlines]
    );

    // Get a single deadline by ID
    const getDeadline = useCallback(
        (id: string): ILTDeadline | undefined => {
            return deadlines.find((d) => d.id === id);
        },
        [deadlines]
    );

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
        saveDeadlines(defaultDeadlines);
    }, [saveDeadlines]);

    return {
        deadlines,
        isLoading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        getDeadline,
        resetToDefaults,
        refreshDeadlines: loadDeadlines,
    };
};
