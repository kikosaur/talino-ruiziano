import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PublicContent {
    id: string;
    type: string;
    title: string;
    description: string | null;
    metadata: any;
    created_at: string;
    updated_at: string;
}

// Fetch all content of a specific type
export const usePublicContent = (type: string) => {
    return useQuery({
        queryKey: ["public_content", type],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("public_content")
                .select("*")
                .eq("type", type)
                .order("created_at", { ascending: false });

            if (error) {
                console.error(`Error fetching ${type} content:`, error);
                throw error;
            }

            return data as PublicContent[];
        },
    });
};

// Add new content
export const useAddPublicContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newContent: Omit<PublicContent, "id" | "created_at" | "updated_at">) => {
            const { data, error } = await (supabase as any)
                .from("public_content")
                .insert([newContent])
                .select()
                .single();

            if (error) {
                console.error("Error adding public content:", error);
                throw error;
            }

            return data as PublicContent;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["public_content", data.type] });
            toast.success("Content added successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add content");
        },
    });
};

// Update existing content
export const useUpdatePublicContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: Partial<PublicContent> & { id: string }) => {
            const { id, type, ...updates } = content;

            const { data, error } = await (supabase as any)
                .from("public_content")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                console.error("Error updating public content:", error);
                throw error;
            }

            return { data: data as PublicContent, originalType: type };
        },
        onSuccess: (result) => {
            if (result.originalType) {
                queryClient.invalidateQueries({ queryKey: ["public_content", result.originalType] });
            }
            // Fallback invalidation just in case the true type wasn't passed in the payload
            if (result.data?.type) {
                queryClient.invalidateQueries({ queryKey: ["public_content", result.data.type] });
            }
            toast.success("Content updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update content");
        },
    });
};

// Delete content
export const useDeletePublicContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, type }: { id: string; type: string }) => {
            const { error } = await (supabase as any)
                .from("public_content")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Error deleting public content:", error);
                throw error;
            }

            return { id, type };
        },
        onSuccess: ({ type }) => {
            queryClient.invalidateQueries({ queryKey: ["public_content", type] });
            toast.success("Content deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete content");
        },
    });
};
