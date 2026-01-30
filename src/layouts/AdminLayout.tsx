import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PeerChat from "@/components/dashboard/PeerChat";
import { useSessionTracker } from "@/hooks/useSessionTracker";

const AdminLayout = () => {
    // Track user session time
    useSessionTracker();

    const [isChatVisible, setIsChatVisible] = useState(false);
    const [autoSelectRecipientId, setAutoSelectRecipientId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleChat = (recipientId?: string) => {
        if (recipientId) {
            setAutoSelectRecipientId(recipientId);
            setIsChatVisible(true);
        } else {
            setIsChatVisible((prev) => !prev);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-foreground text-background">
                <div className="flex items-center gap-2">
                    <img src="/bulb.png" alt="Logo" className="w-8 h-8" />
                    <span className="font-serif font-bold">Talino-Ruiziano</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 hover:bg-background/10 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
            </div>

            <AdminSidebar
                onChatToggle={() => toggleChat()}
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

            <main className="flex-1 w-full md:ml-20 lg:ml-64 transition-all duration-300">
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
