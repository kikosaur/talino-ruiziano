import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import MusicPlayer from "@/components/dashboard/MusicPlayer";
import PeerChat from "@/components/dashboard/PeerChat";
import { useSessionTracker } from "@/hooks/useSessionTracker";

const StudentLayout = () => {
    // Track user session time
    useSessionTracker();

    const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMusicPlayer = () => {
        setIsMusicPlayerVisible((prev) => !prev);
    };

    const toggleChat = () => {
        setIsChatVisible((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                    <img src="/bulb.png" alt="Logo" className="w-8 h-8" />
                    <span className="font-serif font-bold">Talino-Ruiziano</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>

            <DashboardSidebar
                onMusicToggle={toggleMusicPlayer}
                onChatToggle={toggleChat}
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className="flex-1 w-full transition-all duration-300">
                <Outlet context={{ toggleMusicPlayer, toggleChat }} />
            </div>

            {/* Floating Music Player */}
            <MusicPlayer
                isVisible={isMusicPlayerVisible}
                onToggle={toggleMusicPlayer}
            />

            {/* Floating Peer Chat */}
            <PeerChat
                isVisible={isChatVisible}
                onToggle={toggleChat}
            />
        </div>
    );
};

export default StudentLayout;
