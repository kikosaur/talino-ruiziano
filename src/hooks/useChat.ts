import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    // Joined from profiles
    sender_name?: string;
    sender_avatar?: string | null;
    sender_role?: string;
}

export const useChat = () => {
    const { user, profile, isTeacher } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<{ user_id: string, name: string, role: string }[]>([]);

    // Fetch existing messages with sender info
    const fetchMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch messages
            const { data: messagesData, error: messagesError } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: true })
                .limit(100);

            if (messagesError) throw messagesError;

            if (messagesData && messagesData.length > 0) {
                // Fetch profiles for all message senders
                const userIds = [...new Set(messagesData.map((m) => m.user_id))];
                const { data: profiles } = await supabase
                    .from("profiles")
                    .select("user_id, display_name, avatar_url")
                    .in("user_id", userIds);

                // Fetch roles
                const { data: roles } = await supabase
                    .from("user_roles")
                    .select("user_id, role")
                    .in("user_id", userIds);

                const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));
                const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]));

                const enrichedMessages = messagesData.map((m) => {
                    const profile = profileMap.get(m.user_id);
                    return {
                        ...m,
                        sender_name: profile?.display_name || "Unknown",
                        sender_avatar: profile?.avatar_url,
                        sender_role: roleMap.get(m.user_id) || "student",
                    };
                });

                setMessages(enrichedMessages);
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Send a new message
    const sendMessage = async (content: string): Promise<{ success: boolean; error?: string }> => {
        if (!user || !content.trim()) {
            return { success: false, error: "Cannot send empty message" };
        }

        try {
            const { error: insertError } = await supabase.from("messages").insert({
                user_id: user.id,
                content: content.trim(),
            });

            if (insertError) throw insertError;

            return { success: true };
        } catch (err) {
            console.error("Error sending message:", err);
            return {
                success: false,
                error: err instanceof Error ? err.message : "Failed to send message",
            };
        }
    };

    // Set up real-time subscription
    useEffect(() => {
        let channel: RealtimeChannel | null = null;

        const setupRealtime = async () => {
            // First fetch existing messages
            await fetchMessages();

            // Then subscribe to new messages
            channel = supabase
                .channel("public:messages")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                    },
                    async (payload) => {
                        const newMessage = payload.new as ChatMessage;

                        // Fetch sender info for the new message
                        const { data: profileData } = await supabase
                            .from("profiles")
                            .select("display_name, avatar_url")
                            .eq("user_id", newMessage.user_id)
                            .maybeSingle();

                        const { data: roleData } = await supabase
                            .from("user_roles")
                            .select("role")
                            .eq("user_id", newMessage.user_id)
                            .maybeSingle();

                        const enrichedMessage: ChatMessage = {
                            ...newMessage,
                            sender_name: profileData?.display_name || "Unknown",
                            sender_avatar: profileData?.avatar_url,
                            sender_role: roleData?.role || "student",
                        };

                        setMessages((prev) => [...prev, enrichedMessage]);
                    }
                )
                .subscribe(async (status) => {
                    setIsConnected(status === "SUBSCRIBED");

                    if (status === "SUBSCRIBED") {
                        await channel?.track({
                            user_id: user.id,
                            online_at: new Date().toISOString(),
                            name: profile?.display_name || "Unknown",
                            role: isTeacher ? "teacher" : "student"
                        });
                    }
                });

            channel
                .on("presence", { event: "sync" }, () => {
                    const newState = channel?.presenceState();
                    const users = [];
                    for (const key in newState) {
                        const stateUsers = newState[key];
                        // Each key might have multiple entries (tabs)
                        stateUsers.forEach((u: any) => {
                            if (!users.find(existing => existing.user_id === u.user_id)) {
                                users.push({
                                    user_id: u.user_id,
                                    name: u.name,
                                    role: u.role
                                });
                            }
                        });
                    }
                    setOnlineUsers(users);
                });
        };

        if (user) {
            setupRealtime();
        }

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [user, fetchMessages]);

    return {
        messages,
        isLoading,
        error,
        isConnected,
        sendMessage,
        refreshMessages: fetchMessages,
        currentUserId: user?.id,
        currentUserName: profile?.display_name || "You",
        isCurrentUserTeacher: isTeacher,
        onlineUsers,
    };
};
