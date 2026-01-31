import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface AppSettings {
    id: number;
    class_name: string;
    instructor_name: string;
    course_description: string;
    academic_year: string;
    semester: string;
    allow_late_submissions: boolean;
    maintenance_mode: boolean;
    updated_at: string;
}

export const useAppSettings = () => {
    const { isTeacher } = useAuth();
    const { toast } = useToast();
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await (supabase.from("app_settings") as any)
                .select("*")
                .single();

            if (error) {
                // If checking table existence or empty, might perform init logic here or just log
                console.error("Error fetching settings:", error);
                throw error;
            }

            if (data) {
                setSettings(data as AppSettings);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = useCallback(
        async (updates: Partial<AppSettings>): Promise<boolean> => {
            if (!isTeacher) {
                toast({
                    title: "Access Denied",
                    description: "Only teachers can update settings.",
                    variant: "destructive",
                });
                return false;
            }

            try {
                const { error } = await supabase
                    .from("app_settings")
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", 1); // Singleton row 1

                if (error) throw error;

                await fetchSettings();

                toast({
                    title: "Settings Saved",
                    description: "Application configuration has been updated successfully.",
                });

                return true;
            } catch (error) {
                console.error("Error updating settings:", error);
                toast({
                    title: "Update Failed",
                    description: "Failed to save settings. Please try again.",
                    variant: "destructive",
                });
                return false;
            }
        },
        [isTeacher, fetchSettings, toast]
    );

    return {
        settings,
        isLoading,
        updateSettings,
        refreshSettings: fetchSettings
    };
};
