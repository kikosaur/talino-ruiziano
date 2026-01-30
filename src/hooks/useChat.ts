import { useState, useEffect, useCallback, useRef } from "react";
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
    recipient_id: string | null; // Added to standard interface
}

export const useChat = () => {
    const { user, profile, isTeacher } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<{ user_id: string, name: string, role: string }[]>([]);
    const [allUsers, setAllUsers] = useState<{ user_id: string, name: string, role: string, avatar_url?: string | null }[]>([]);
    const [activeRecipientId, setActiveRecipientId] = useState<string | null>(null);
    const [lastIncomingMessage, setLastIncomingMessage] = useState<ChatMessage | null>(null);

    // Fetch existing messages with sender info
    const fetchMessages = useCallback(async () => {
        if (!user) return;

        try {
            setIsLoading(true);
            setError(null);

            // Fetch messages based on type (public or private)
            let query = supabase.from("messages").select("*");

            if (activeRecipientId) {
                // Private messages between current user and active recipient
                query = query.or(`and(user_id.eq.${user.id},recipient_id.eq.${activeRecipientId}),and(user_id.eq.${activeRecipientId},recipient_id.eq.${user.id})`);
            } else {
                // Public messages
                query = query.is("recipient_id", null);
            }

            const { data: messagesData, error: messagesError } = await query
                .order("created_at", { ascending: true })
                .limit(100);

            if (messagesError) throw messagesError;

            if (messagesData && messagesData.length > 0) {
                // Fetch profiles for all message senders
                const userIds = Array.from(new Set(messagesData.map((m) => m.user_id)));
                const { data: profiles } = await supabase
                    .from("profiles")
                    .select("user_id, display_name, avatar_url")
                    .in("user_id", userIds);

                // Fetch roles
                const { data: roles } = await supabase
                    .from("user_roles")
                    .select("user_id, role")
                    .in("user_id", userIds);

                const profileMap = new Map((profiles as any[])?.map((p) => [p.user_id, p]));
                const roleMap = new Map((roles as any[])?.map((r) => [r.user_id, r.role]));

                const enrichedMessages = messagesData.map((m) => {
                    const profile = profileMap.get(m.user_id) as any;
                    return {
                        ...(m as any),
                        sender_name: profile?.display_name || "Unknown",
                        sender_avatar: profile?.avatar_url,
                        sender_role: (roleMap.get(m.user_id) as any) || "student",
                        recipient_id: (m as any).recipient_id
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
    }, [user, activeRecipientId]);

    // Fetch all users with roles
    const fetchAllUsers = useCallback(async () => {
        if (!user) return;

        try {
            // Get all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("user_id, display_name, avatar_url")
                .order("display_name", { ascending: true });

            if (profilesError) throw profilesError;

            // Get roles for all users
            const userIds = profiles?.map(p => p.user_id) || [];
            const { data: roles, error: rolesError } = await supabase
                .from("user_roles")
                .select("user_id, role")
                .in("user_id", userIds);

            if (rolesError) throw rolesError;

            const roleMap = new Map(roles?.map(r => [r.user_id, r.role]));

            const usersWithRoles = profiles?.map(p => ({
                user_id: p.user_id,
                name: p.display_name || "Unknown User",
                role: roleMap.get(p.user_id) || "student",
                avatar_url: p.avatar_url,
            })) || [];

            setAllUsers(usersWithRoles.filter(u => u.user_id !== user.id));
        } catch (err) {
            console.error("Error fetching all users:", err);
        }
    }, [user]);

    // Send a new message
    const sendMessage = async (content: string): Promise<{ success: boolean; error?: string }> => {
        if (!user || !content.trim()) {
            return { success: false, error: "Cannot send empty message" };
        }

        try {
            const { error: insertError } = await supabase.from("messages").insert({
                user_id: user.id,
                content: content.trim(),
                recipient_id: activeRecipientId,
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

    // Ref for active recipient to use in realtime callback without re-running effect
    const activeRecipientIdRef = useRef<string | null>(null);

    // Update ref when state changes
    useEffect(() => {
        activeRecipientIdRef.current = activeRecipientId;
    }, [activeRecipientId]);

    // Fetch all users on mount
    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    // Set up real-time subscription (Global Channel)
    useEffect(() => {
        if (!user) return;

        let channel: RealtimeChannel | null = null;

        const setupRealtime = async () => {
            // Subscribe to global chat channel for presence and messages
            // We use a single channel so presence is shared across the app
            channel = supabase
                .channel("global_study_chat")
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                    },
                    async (payload) => {
                        const newMessage = payload.new as any;
                        const currentRecipientId = activeRecipientIdRef.current;

                        // Filter messages client-side implementation
                        // Logic:
                        // 1. If we are in Public Chat (currentRecipientId is null):
                        //    - Show if message is Public (recipient_id is null)
                        // 2. If we are in Private Chat (currentRecipientId is set):
                        //    - Show if message is between ME and RECIPIENT

                        // Notification Logic: Check if message is for me or global, regardless of active view
                        if (
                            newMessage.user_id !== user.id && // Not from me
                            (newMessage.recipient_id === user.id || newMessage.recipient_id === null) // To me or Global
                        ) {
                            // Fetch sender info for notification if needed, or just use partial
                            // For simplicity/speed we might just pass raw new message or wait for profile
                            // But we need the name for the toast ("John sent a message")

                            // We can fetch profile here essentially reusing logic
                            const { data: notifProfile } = await supabase
                                .from("profiles")
                                .select("display_name")
                                .eq("user_id", newMessage.user_id)
                                .maybeSingle();

                            setLastIncomingMessage({
                                ...(newMessage as ChatMessage),
                                sender_name: notifProfile?.display_name || "Someone"
                            });
                        }

                        let isRelevant = false;

                        if (currentRecipientId) {
                            // Private Chat Mode
                            isRelevant = (
                                (newMessage.user_id === user.id && newMessage.recipient_id === currentRecipientId) ||
                                (newMessage.user_id === currentRecipientId && newMessage.recipient_id === user.id)
                            );
                        } else {
                            // Public Chat Mode
                            // Only show public messages (recipient_id is null)
                            isRelevant = (newMessage.recipient_id === null);
                        }

                        if (!isRelevant) return;

                        // Fetch sender info for the new message in current view
                        // We fetch these individually to ensure we have the latest profile info
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

            // Handle Presence Sync (Who is online?)
            channel.on("presence", { event: "sync" }, () => {
                const newState = channel?.presenceState();
                const users: { user_id: string, name: string, role: string }[] = [];

                for (const key in newState) {
                    const stateUsers = newState[key];
                    (stateUsers as any[]).forEach((u: any) => {
                        // Prevent duplicates and don't list self if desired, but usually we list everyone
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

        setupRealtime();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [user, profile, isTeacher]); // Removed activeRecipientId dependency to keep channel stable

    // Re-fetch messages when activeRecipientId changes (handled separately from subscription)
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]); // fetchMessages depends on activeRecipientId

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
        allUsers,
        activeRecipientId,
        setActiveRecipientId,
        lastIncomingMessage
    };
};
