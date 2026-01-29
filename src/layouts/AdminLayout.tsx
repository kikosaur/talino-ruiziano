import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PeerChat from "@/components/dashboard/PeerChat";

const AdminLayout = () => {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [autoSelectRecipientId, setAutoSelectRecipientId] = useState<string | null>(null);

    const toggleChat = (recipientId?: string) => {
        if (recipientId) {
            setAutoSelectRecipientId(recipientId);
            setIsChatVisible(true);
        } else {
            setIsChatVisible((prev) => !prev);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar onChatToggle={toggleChat} />

            <main className="ml-20 lg:ml-64 transition-all duration-300">
                <Outlet context={{ toggleChat }} />
            </main>

            {/* Floating Peer Chat */}
            <PeerChat
                isVisible={isChatVisible}
                onToggle={() => toggleChat()}
                autoSelectRecipientId={autoSelectRecipientId}
            />
        </div>
    );
};

export default AdminLayout;
