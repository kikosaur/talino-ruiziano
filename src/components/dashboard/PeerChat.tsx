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
}

const PeerChat = ({ isVisible, onToggle }: PeerChatProps) => {
    const {
        messages,
        isLoading,
        isConnected,
        sendMessage,
        currentUserId,
        currentUserName,
        isCurrentUserTeacher,
        onlineUsers,
    } = useChat();

    const [isExpanded, setIsExpanded] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isVisible && isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isVisible, isExpanded]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;

        setIsSending(true);
        const result = await sendMessage(inputValue);

        if (result.success) {
            setInputValue("");
        }
        setIsSending(false);
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Users className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="font-semibold text-foreground">Peer Chat</span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {isConnected ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-1 cursor-help">
                                                        <Wifi className="w-3 h-3 text-green-500" />
                                                        <span className="text-green-500">
                                                            {onlineUsers.length} Online
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-xs space-y-1">
                                                        <p className="font-semibold text-muted-foreground mb-1">Online Users:</p>
                                                        {onlineUsers.map(u => (
                                                            <div key={u.user_id} className="flex items-center gap-1.5">
                                                                <div className={cn("w-1.5 h-1.5 rounded-full", u.role === 'teacher' ? "bg-yellow-500" : "bg-green-500")} />
                                                                <span>{u.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
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

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[350px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                                <p className="text-sm">No messages yet</p>
                                <p className="text-xs">Start the conversation!</p>
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
                                            <div className="flex items-center gap-2 mb-1 ml-1">
                                                <Avatar className="w-5 h-5">
                                                    <AvatarImage src={message.sender_avatar || undefined} />
                                                    <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                                                        {message.sender_name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-medium text-muted-foreground">
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

                                        {/* Timestamp (only showing for last message in group or on hover - simplifying to always show for now but small) */}
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
                    <div className="p-3 border-t border-border/50 bg-card/50">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
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
                            {isCurrentUserTeacher ? "Responding as Teacher" : `Chatting as ${currentUserName}`}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerChat;
