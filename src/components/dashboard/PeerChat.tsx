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
    } = useChat();

    const [isExpanded, setIsExpanded] = useState(true);
    const [view, setView] = useState<"global" | "private" | "users">("global");
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher">("all");
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

    // Auto-select recipient when prop changes
    useEffect(() => {
        if (autoSelectRecipientId && isVisible) {
            setActiveRecipientId(autoSelectRecipientId);
            setView("private");
        }
    }, [autoSelectRecipientId, isVisible, setActiveRecipientId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, view]);

    // Focus input when chat opens or view changes
    useEffect(() => {
        if (isVisible && isExpanded && view !== "users" && inputRef.current) {
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
                "fixed bottom-6 right-24 z-50 transition-all duration-300 ease-in-out",
                isExpanded ? "w-80 sm:w-96" : "w-14"
            )}
        >
            {/* Collapsed State */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-xl flex items-center justify-center hover:scale-110 transition-transform relative"
                >
                    <MessageCircle className="w-6 h-6 text-primary-foreground" />
                    {messages.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                            {messages.length > 99 ? "99+" : messages.length}
                        </span>
                    )}
                </button>
            )}

            {/* Expanded Chat */}
            {isExpanded && (
                <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            {view !== "global" ? (
                                <button
                                    onClick={() => {
                                        setActiveRecipientId(null);
                                        setView("global");
                                    }}
                                    className="p-1 hover:bg-muted rounded-full transition-colors"
                                >
                                    <ChevronDown className="w-5 h-5 rotate-90 text-muted-foreground" />
                                </button>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary-foreground" />
                                </div>
                            )}
                            <div>
                                <span className="font-semibold text-foreground">
                                    {view === "global" ? "Peer Chat" : view === "users" ? "Select User" : activeRecipient?.name || "Private Chat"}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {isConnected ? (
                                        <div className="flex items-center gap-1">
                                            <Wifi className="w-3 h-3 text-green-500" />
                                            <span className="text-green-500">
                                                {view === "private" && activeRecipient ? "Active Now" : `${onlineUsers.length} Online`}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <WifiOff className="w-3 h-3 text-red-500" />
                                            <span className="text-red-500">Disconnected</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {view === "global" && (
                                <button
                                    onClick={() => setView("users")}
                                    className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                                    title="Start Private Chat"
                                >
                                    <Users className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                                title="Minimize"
                            >
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                                onClick={onToggle}
                                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[350px]">
                        {view === "users" ? (
                            <div className="space-y-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50"
                                    />
                                </div>

                                {/* Role Filter Tabs */}
                                <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
                                    <button
                                        onClick={() => setRoleFilter("all")}
                                        className={cn(
                                            "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                                            roleFilter === "all"
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("student")}
                                        className={cn(
                                            "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                                            roleFilter === "student"
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Students
                                    </button>
                                    <button
                                        onClick={() => setRoleFilter("teacher")}
                                        className={cn(
                                            "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                                            roleFilter === "teacher"
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Teachers
                                    </button>
                                </div>

                                {/* User List */}
                                <div className="space-y-1 max-h-64 overflow-y-auto">
                                    {filteredUsers.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm text-muted-foreground">
                                                {userSearchQuery ? "No users found" : "No users available"}
                                            </p>
                                        </div>
                                    ) : (
                                        filteredUsers.map(u => {
                                            const isOnline = onlineUsers.some(ou => ou.user_id === u.user_id);
                                            return (
                                                <button
                                                    key={u.user_id}
                                                    onClick={() => startPrivateChat(u.user_id)}
                                                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors text-left group"
                                                >
                                                    <div className="relative">
                                                        <Avatar className="w-9 h-9">
                                                            <AvatarImage src={u.avatar_url || undefined} />
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                                {u.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {isOnline && (
                                                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn(
                                                                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                                                u.role === "teacher"
                                                                    ? "bg-accent/10 text-accent"
                                                                    : "bg-secondary/10 text-secondary"
                                                            )}>
                                                                {u.role === "teacher" ? "Teacher" : "Student"}
                                                            </span>
                                                            {isOnline && (
                                                                <span className="text-[10px] text-green-600 font-medium">● Online</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                                <p className="text-sm">No messages yet</p>
                                <p className="text-xs">{view === "global" ? "Start the conversation!" : "Send a private message to start chatting."}</p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isOwn = message.user_id === currentUserId;
                                const isTeacher = message.sender_role === "teacher";

                                // Grouping logic
                                const previousMessage = messages[index - 1];
                                const isSameSender = previousMessage && previousMessage.user_id === message.user_id;
                                const showHeader = !isOwn && !isSameSender;

                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex flex-col max-w-[85%]",
                                            isOwn ? "ml-auto items-end" : "mr-auto items-start",
                                            index > 0 && isSameSender ? "mt-1" : "mt-3"
                                        )}
                                    >
                                        {/* Sender info (only for first message in group) */}
                                        {showHeader && (
                                            <div className="flex items-center gap-2 mb-1 ml-1 group/sender">
                                                <Avatar className="w-5 h-5">
                                                    <AvatarImage src={message.sender_avatar || undefined} />
                                                    <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                                                        {message.sender_name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium text-muted-foreground",
                                                        view === "global" && "cursor-pointer hover:text-accent underline-offset-2 hover:underline"
                                                    )}
                                                    onClick={() => view === "global" && startPrivateChat(message.user_id)}
                                                >
                                                    {message.sender_name}
                                                </span>
                                                {isTeacher && (
                                                    <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded-full border border-yellow-500/20">
                                                        Teacher
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Message bubble */}
                                        <div
                                            className={cn(
                                                "px-4 py-2 text-sm break-words shadow-sm",
                                                isOwn
                                                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-2xl rounded-tr-sm"
                                                    : isTeacher
                                                        ? "bg-yellow-50/80 dark:bg-yellow-900/10 text-foreground rounded-2xl rounded-tl-sm border border-yellow-200/50 dark:border-yellow-700/30"
                                                        : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                                            )}
                                        >
                                            {message.content}
                                        </div>

                                        {/* Timestamp */}
                                        <span className={cn(
                                            "text-[9px] text-muted-foreground/70 mt-0.5 px-1",
                                            isOwn ? "text-right" : "text-left"
                                        )}>
                                            {formatTime(message.created_at)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {view !== "users" && (
                        <div className="p-3 border-t border-border/50 bg-card/50">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={view === "global" ? "Message everyone..." : `Message ${activeRecipient?.name || "privately"}...`}
                                    className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    disabled={isSending}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isSending}
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                        inputValue.trim() && !isSending
                                            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-105"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                    )}
                                >
                                    {isSending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-center">
                                {view === "global" ? (isCurrentUserTeacher ? "Teacher Channel" : `Chatting as ${currentUserName}`) : `Private Chat with ${activeRecipient?.name || "Peer"}`}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PeerChat;
