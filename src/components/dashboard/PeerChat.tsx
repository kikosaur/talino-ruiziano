import { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    Send,
    X,
    ChevronDown,
    Wifi,
    WifiOff,
    Loader2,
    Users,
    Search,
    Filter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface PeerChatProps {
    isVisible: boolean;
    onToggle: () => void;
    autoSelectRecipientId?: string | null;
}

const PeerChat = ({ isVisible, onToggle, autoSelectRecipientId }: PeerChatProps) => {
    const {
        messages,
        isLoading,
        isConnected,
        sendMessage,
        currentUserId,
        currentUserName,
        isCurrentUserTeacher,
        onlineUsers,
        allUsers,
        activeRecipientId,
        setActiveRecipientId,
        lastIncomingMessage
    } = useChat();

    const [isExpanded, setIsExpanded] = useState(true);
    const [view, setView] = useState<"home" | "global" | "private">("home");
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher">("all");
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeRecipient = allUsers.find(u => u.user_id === activeRecipientId) || onlineUsers.find(u => u.user_id === activeRecipientId);

    // Filter and sort users
    const filteredUsers = allUsers
        .filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase());
            const matchesRole = roleFilter === "all" || u.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            // Online users first
            const aOnline = onlineUsers.some(ou => ou.user_id === a.user_id);
            const bOnline = onlineUsers.some(ou => ou.user_id === b.user_id);
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            // Then alphabetically
            return a.name.localeCompare(b.name);
        });

    // Auto-select recipient and open chat
    useEffect(() => {
        if (autoSelectRecipientId && isVisible) {
            setActiveRecipientId(autoSelectRecipientId);
            setView("private");
        }
    }, [autoSelectRecipientId, isVisible, setActiveRecipientId]);

    // Notification Logic and Unread Count
    useEffect(() => {
        if (!lastIncomingMessage) return;

        // Conditions to notify:
        // 1. Chat is minimized (!isExpanded) OR Chat is CLOSED (!isVisible)
        // 2. Chat is OPEN but view is 'home'
        // 3. Chat is OPEN (private) but message is from someone else
        // 4. Chat is OPEN (global) but message is private

        const isFromCurrentPrivate = view === "private" && activeRecipientId === lastIncomingMessage.user_id;
        const isFromGlobal = view === "global" && !lastIncomingMessage.recipient_id;

        const shouldNotify = !isVisible || !isExpanded || (!isFromCurrentPrivate && !isFromGlobal);

        if (shouldNotify) {
            import("sonner").then(({ toast }) => {
                toast(
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={lastIncomingMessage.sender_avatar || undefined} />
                            <AvatarFallback>{lastIncomingMessage.sender_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs font-bold">{lastIncomingMessage.sender_name}</p>
                            <p className="text-xs line-clamp-1">{lastIncomingMessage.content}</p>
                        </div>
                    </div>,
                    {
                        duration: 4000,
                        position: "top-right"
                    }
                );
            });

            // Increment badge if chat is closed
            if (!isExpanded) {
                setUnreadCount(prev => prev + 1);
            }
        }
    }, [lastIncomingMessage]);

    // Reset unread when opening
    useEffect(() => {
        if (isExpanded) {
            setUnreadCount(0);
        }
    }, [isExpanded]);


    // Auto-scroll logic
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, view]);

    // Focus input logic
    useEffect(() => {
        if (isVisible && isExpanded && view !== "home" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isVisible, isExpanded, view]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        const result = await sendMessage(inputValue);

        if (result.success) {
            setInputValue("");
        }
        setIsSending(false);
    };

    const startPrivateChat = (user_id: string) => {
        setActiveRecipientId(user_id);
        setView("private");
    };

    const openGlobalChat = () => {
        setActiveRecipientId(null);
        setView("global");
    };

    const goBackToHome = () => {
        setView("home");
        setActiveRecipientId(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed z-50 transition-all duration-300 ease-in-out",
                isExpanded
                    ? "bottom-24 inset-x-4 w-auto sm:w-96 sm:inset-x-auto sm:bottom-6 sm:right-24"
                    : "bottom-6 right-24 w-14"
            )}
        >
            {/* Collapsed State */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl flex items-center justify-center hover:scale-110 transition-transform relative"
                >
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
            )}

            {/* Expanded Content */}
            {isExpanded && (
                <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 shrink-0">
                        <div className="flex items-center gap-2">
                            {view !== "home" ? (
                                <button
                                    onClick={goBackToHome}
                                    className="p-1.5 hover:bg-muted rounded-full transition-colors mr-1"
                                    title="Back to Directory"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-90 text-muted-foreground" />
                                </button>
                            ) : null}

                            <div>
                                <span className="font-bold text-base bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                    {view === "home" ? "Study Chat" : view === "global" ? "Global Chat" : activeRecipient?.name}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Wifi className={cn("w-3 h-3", isConnected ? "text-green-500" : "text-red-500")} />
                                    <span>{isConnected ? "Connected" : "Offline"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                            >
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* View Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        {view === "home" ? (
                            // === DIRECTORY VIEW ===
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Global Chat Card */}
                                <button
                                    onClick={openGlobalChat}
                                    className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group text-left relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:animate-shimmer" />
                                    <div className="flex items-center gap-4 relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Users className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">Global Conversation</h3>
                                            <p className="text-xs text-muted-foreground">Talk with the whole class</p>
                                        </div>
                                        <ChevronDown className="w-5 h-5 ml-auto -rotate-90 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </button>

                                {/* Search & Filter */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search students & teachers..."
                                            value={userSearchQuery}
                                            onChange={(e) => setUserSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {(['all', 'student', 'teacher'] as const).map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setRoleFilter(role)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors",
                                                    roleFilter === role
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {role === 'all' ? 'All' : role + 's'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* User List */}
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Directory</p>
                                    {filteredUsers.length === 0 ? (
                                        <p className="text-sm text-center py-4 text-muted-foreground">No users found.</p>
                                    ) : (
                                        filteredUsers.map(u => {
                                            const isOnline = onlineUsers.some(ou => ou.user_id === u.user_id);
                                            return (
                                                <button
                                                    key={u.user_id}
                                                    onClick={() => startPrivateChat(u.user_id)}
                                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left group"
                                                >
                                                    <div className="relative">
                                                        <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                                                            <AvatarImage src={u.avatar_url || undefined} />
                                                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-xs font-bold">
                                                                {u.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {isOnline && (
                                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{u.name}</p>
                                                        <p className="text-[10px] text-muted-foreground capitalize flex items-center gap-1">
                                                            <span>{u.role}</span>
                                                            {isOnline && <span className="text-green-500">• Online</span>}
                                                        </p>
                                                    </div>
                                                    <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                            // === CHAT VIEW (Global or Private) ===
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                {isLoading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground/50 space-y-2">
                                                <MessageCircle className="w-12 h-12 opacity-20" />
                                                <p className="text-sm font-medium">No messages yet</p>
                                                <p className="text-xs">Start the conversation!</p>
                                            </div>
                                        ) : (
                                            messages.map((message, index) => {
                                                const isOwn = message.user_id === currentUserId;
                                                const isTeacher = message.sender_role === "teacher";
                                                const previousMessage = messages[index - 1];
                                                const isSameSender = previousMessage && previousMessage.user_id === message.user_id;

                                                return (
                                                    <div
                                                        key={message.id}
                                                        className={cn(
                                                            "flex flex-col max-w-[85%]",
                                                            isOwn ? "ml-auto items-end" : "mr-auto items-start",
                                                            index > 0 && isSameSender ? "mt-1" : "mt-3"
                                                        )}
                                                    >
                                                        {!isOwn && !isSameSender && (
                                                            <div className="flex items-center gap-2 mb-1 ml-1">
                                                                <span className="text-xs font-semibold text-muted-foreground/80">{message.sender_name}</span>
                                                                {isTeacher && <span className="text-[9px] bg-yellow-500/10 text-yellow-600 px-1 rounded uppercase font-bold tracking-wider">Teacher</span>}
                                                            </div>
                                                        )}
                                                        <div
                                                            className={cn(
                                                                "px-4 py-2 text-sm break-words shadow-sm",
                                                                isOwn
                                                                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-tr-sm"
                                                                    : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                                                            )}
                                                        >
                                                            {message.content}
                                                        </div>
                                                        <span className="text-[9px] text-muted-foreground/50 mt-1 px-1">
                                                            {formatTime(message.created_at)}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}

                                {/* Input Area */}
                                <div className="p-3 bg-card border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            disabled={isSending}
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputValue.trim() || isSending}
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                                                inputValue.trim() && !isSending
                                                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/25 hover:scale-105"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerChat;
