import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import MusicPlayer from "@/components/dashboard/MusicPlayer";
import PeerChat from "@/components/dashboard/PeerChat";

const StudentLayout = () => {
    const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);

    const toggleMusicPlayer = () => {
        setIsMusicPlayerVisible((prev) => !prev);
    };

    const toggleChat = () => {
        setIsChatVisible((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar
                onMusicToggle={toggleMusicPlayer}
                onChatToggle={toggleChat}
            />

            <Outlet context={{ toggleMusicPlayer, toggleChat }} />

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
