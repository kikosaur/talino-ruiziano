import { useState } from "react";
import {
    BookOpen,
    Calendar,
    Trophy,
    MessageCircle,
    Music,
    User,
    TrendingUp,
    ChevronDown,
    Sparkles,
    Target,
    Clock,
    Award,
    Upload,
    Settings
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StudentGuide = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>("getting-started");

    const sections = [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: Sparkles,
            color: "text-purple-500",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Welcome to StudySpark! This platform helps you manage your ILT (Independent Learning Tasks) while making learning fun and engaging.
                    </p>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Quick Start:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Check your dashboard for current points, level, and streak</li>
                            <li>View upcoming deadlines in the Deadlines tab</li>
                            <li>Submit your ILTs before the due date</li>
                            <li>Earn points and badges for your achievements</li>
                        </ol>
                    </div>
                </div>
            )
        },
        {
            id: "submissions",
            title: "Submitting ILTs",
            icon: Upload,
            color: "text-blue-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">How to Submit:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Navigate to the <strong>Submissions</strong> tab from the sidebar</li>
                        <li>Find the ILT you want to submit</li>
                        <li>Click the <strong>"Submit ILT"</strong> button</li>
                        <li>Upload your file or enter your submission link</li>
                        <li>Click <strong>"Submit"</strong> to complete</li>
                    </ol>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>💡 Tip:</strong> Submit early! You can resubmit if needed before the deadline.</p>
                    </div>
                </div>
            )
        },
        {
            id: "deadlines",
            title: "Managing Deadlines",
            icon: Clock,
            color: "text-orange-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Understanding Deadlines:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">🔴</span>
                            <span><strong>Red badge:</strong> Overdue - Submit ASAP!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-0.5">🟡</span>
                            <span><strong>Yellow badge:</strong> Due soon (within 3 days)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">🟢</span>
                            <span><strong>Green badge:</strong> Plenty of time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">✅</span>
                            <span><strong>Submitted:</strong> You're all set!</span>
                        </li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>⚡ Pro Tip:</strong> Check deadlines daily to stay on track!</p>
                    </div>
                </div>
            )
        },
        {
            id: "badges",
            title: "Earning Badges",
            icon: Award,
            color: "text-yellow-500",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Badges are awarded for special achievements. Collect them all!
                    </p>
                    <h4 className="font-semibold text-sm">Available Badges:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">🌟 First Steps</div>
                            <div className="text-muted-foreground">Submit your first ILT</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">🔥 On Fire</div>
                            <div className="text-muted-foreground">3-day submission streak</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">🌅 Early Bird</div>
                            <div className="text-muted-foreground">Submit 3+ days early</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">⚡ Speed Demon</div>
                            <div className="text-muted-foreground">Submit within 1 hour</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">🎯 Perfect Score</div>
                            <div className="text-muted-foreground">100% on-time submissions</div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="font-semibold">👑 Overachiever</div>
                            <div className="text-muted-foreground">50+ submissions</div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "chat",
            title: "Peer Chat",
            icon: MessageCircle,
            color: "text-green-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Chat Features:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>Global Chat:</strong> Talk with all classmates publicly</li>
                        <li><strong>Private Messages:</strong> Send direct messages to anyone</li>
                        <li><strong>User Directory:</strong> Search and filter users by role</li>
                        <li><strong>Online Status:</strong> See who's currently active</li>
                    </ul>
                    <h4 className="font-semibold text-sm mt-4">How to Use:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Click the chat icon in the sidebar</li>
                        <li>Choose Global or click the Users icon for private chat</li>
                        <li>Search for someone or select from the list</li>
                        <li>Start messaging!</li>
                    </ol>
                </div>
            )
        },
        {
            id: "music",
            title: "Music Player",
            icon: Music,
            color: "text-pink-500",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Stay focused with background music while working on your ILTs.
                    </p>
                    <h4 className="font-semibold text-sm">Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>🎵 Lo-fi beats for studying</li>
                        <li>🎧 Floating player that stays with you</li>
                        <li>🔊 Volume control</li>
                        <li>⏸️ Play/Pause anytime</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>🎼 Tip:</strong> Click the music icon in the sidebar to toggle the player!</p>
                    </div>
                </div>
            )
        },
        {
            id: "avatar",
            title: "Customizing Avatar",
            icon: User,
            color: "text-indigo-500",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Make your profile unique with customizable avatars!
                    </p>
                    <h4 className="font-semibold text-sm">How to Change:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Go to <strong>Settings</strong> from the sidebar</li>
                        <li>Browse through avatar styles (People, Robots, Pixel Art, Emoji)</li>
                        <li>Click on your favorite avatar</li>
                        <li>It's instantly updated everywhere!</li>
                    </ol>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>✨ Fun Fact:</strong> There are 64 different avatars to choose from!</p>
                    </div>
                </div>
            )
        },
        {
            id: "activity",
            title: "Activity Tracking",
            icon: Clock,
            color: "text-teal-500",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Your learning time is automatically tracked to help you build consistent study habits!
                    </p>
                    <h4 className="font-semibold text-sm">Usage Stats Card:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>⏱️ Total Time:</strong> Shows how long you've been actively learning on the platform.</li>
                        <li><strong>👥 Sessions:</strong> Counts how many times you've logged in to study.</li>
                        <li><strong>⌛ Avg Session:</strong> Your average study duration per session.</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>💡 Smart Tracking:</strong> The timer pauses automatically when you're inactive, so you get an accurate picture of your focus time!</p>
                    </div>
                </div>
            )
        },
        {
            id: "progress",
            title: "Tracking Progress",
            icon: TrendingUp,
            color: "text-cyan-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Your Stats:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>🎯 Points:</strong> Earned from submissions and achievements</li>
                        <li><strong>📊 Level:</strong> Increases every 100 points</li>
                        <li><strong>🔥 Streak:</strong> Consecutive days of activity</li>
                        <li><strong>📚 ILTs Completed:</strong> Total submissions</li>
                    </ul>
                    <h4 className="font-semibold text-sm mt-4">Points Breakdown:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✅ Submit on time: <strong>+10 points</strong></li>
                        <li>⚡ Early submission: <strong>+15 points</strong></li>
                        <li>🔥 Maintain streak: <strong>+5 points/day</strong></li>
                        <li>🏆 Earn badges: <strong>+20 points each</strong></li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        How to Use StudySpark
                    </h1>
                    <p className="text-muted-foreground">
                        Everything you need to know to make the most of your learning experience! 🚀
                    </p>
                </div>

                {/* Guide Sections */}
                <div className="space-y-3">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isExpanded = expandedSection === section.id;

                        return (
                            <Card key={section.id} className="overflow-hidden">
                                <button
                                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-lg bg-muted", section.color)}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-left">{section.title}</h3>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-muted-foreground transition-transform",
                                            isExpanded && "rotate-180"
                                        )}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-border/50 pt-4">
                                        {section.content}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Footer */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                    <div className="flex items-start gap-3">
                        <Target className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div className="space-y-2">
                            <h3 className="font-semibold">Need More Help?</h3>
                            <p className="text-sm text-muted-foreground">
                                If you have questions or need assistance, feel free to message your teacher through the Peer Chat feature or ask during class!
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentGuide;
