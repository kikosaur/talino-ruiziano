import { useState } from "react";
import {
    Users,
    FileCheck,
    Calendar,
    BarChart3,
    MessageCircle,
    Settings,
    ChevronDown,
    Sparkles,
    Target,
    Search,
    Filter,
    Send,
    TrendingUp,
    Music
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AdminGuide = () => {
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
                        Welcome to the StudySpark Teacher Dashboard! This platform helps you manage student ILTs, track progress, and communicate effectively.
                    </p>
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Dashboard Overview:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• <strong>Students:</strong> View and manage enrolled students</li>
                            <li>• <strong>Submissions:</strong> Review student work</li>
                            <li>• <strong>Deadlines:</strong> Create and manage ILTs</li>
                            <li>• <strong>Analytics:</strong> Track class performance</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "students",
            title: "Managing Students",
            icon: Users,
            color: "text-blue-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Student Directory Features:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>View All Students:</strong> See enrolled students with their stats</li>
                        <li><strong>Sort & Filter:</strong> Organize by name, points, or level</li>
                        <li><strong>Student Profiles:</strong> Click cards for detailed information</li>
                        <li><strong>Direct Messaging:</strong> Click "Message Student" to chat privately</li>
                    </ul>
                    <h4 className="font-semibold text-sm mt-4">Student Information Includes:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Display name and avatar</li>
                        <li>• Total points and current level</li>
                        <li>• Active learning streak (🔥 days)</li>
                        <li>• Email address</li>
                        <li>• <strong>Usage Statistics:</strong> Track total study time and session consistency</li>
                        <li>• <strong>Submission History:</strong> View detailed work history with time filters</li>
                        <li>• <strong>Badges & Achievements:</strong> See student milestones</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>💡 Tip:</strong> Export student data to CSV for record-keeping!</p>
                    </div>
                </div>
            )
        },
        {
            id: "submissions",
            title: "Checking Submissions",
            icon: FileCheck,
            color: "text-green-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Review Process:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Navigate to the <strong>Submissions</strong> tab</li>
                        <li>Filter by subject or search for specific students</li>
                        <li>Click <strong>"View Submission"</strong> to see student work</li>
                        <li>Review the file or link provided</li>
                        <li>Provide feedback or mark as reviewed</li>
                    </ol>
                    <h4 className="font-semibold text-sm mt-4">Submission Information:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Student name and avatar</li>
                        <li>• ILT title and subject</li>
                        <li>• Submission date and time</li>
                        <li>• Status (on-time, late, or early)</li>
                        <li>• File or link submitted</li>
                    </ul>
                </div>
            )
        },
        {
            id: "deadlines",
            title: "Setting Deadlines",
            icon: Calendar,
            color: "text-orange-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Creating ILT Deadlines:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Go to the <strong>ILT Deadlines</strong> tab</li>
                        <li>Click <strong>"Add New Deadline"</strong></li>
                        <li>Fill in the details:
                            <ul className="ml-6 mt-1 space-y-1">
                                <li>- ILT title (e.g., "Week 5 - Python Basics")</li>
                                <li>- Subject category</li>
                                <li>- Due date and time</li>
                                <li>- Description (optional)</li>
                            </ul>
                        </li>
                        <li>Click <strong>"Create Deadline"</strong></li>
                    </ol>
                    <h4 className="font-semibold text-sm mt-4">Managing Existing Deadlines:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• <strong>Edit:</strong> Update details anytime</li>
                        <li>• <strong>Delete:</strong> Remove outdated deadlines</li>
                        <li>• <strong>View Status:</strong> See submission progress</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>📅 Tip:</strong> Create deadlines in advance to give students time to plan!</p>
                    </div>
                </div>
            )
        },
        {
            id: "music-library",
            title: "Music Library Management",
            icon: Music, // Ensure Music is imported
            color: "text-rose-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Curating Study Music:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Go to the <strong>Music Library</strong> tab in the sidebar</li>
                        <li>Click <strong>"Add New Song"</strong> button</li>
                        <li>Enter the <strong>Song Title</strong>, <strong>Artist</strong>, and <strong>MP3 Link</strong></li>
                        <li>Click <strong>"Add Song"</strong> to publish it to the school library</li>
                    </ol>
                    <h4 className="font-semibold text-sm mt-4">Managing Tracks:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• <strong>Search:</strong> Find songs to manage using the search bar</li>
                        <li>• <strong>Preview:</strong> Play songs to verify the audio</li>
                        <li>• <strong>Delete:</strong> Remove songs that are no longer needed</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>🎵 Note:</strong> Songs added here are instantly available to all students in their Music Player library!</p>
                    </div>
                </div>
            )
        },
        {
            id: "analytics",
            title: "Analytics Dashboard",
            icon: BarChart3,
            color: "text-cyan-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Metrics:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>Total Students:</strong> Number of enrolled students</li>
                        <li><strong>Total Submissions:</strong> All-time submission count</li>
                        <li><strong>Recent Activity:</strong> Submissions in the last 7 days</li>
                        <li><strong>Submission Timeline:</strong> Visual chart of submissions over time</li>
                    </ul>
                    <h4 className="font-semibold text-sm mt-4">Subject Breakdown:</h4>
                    <p className="text-sm text-muted-foreground">
                        See submissions per subject category to identify which topics are most active and where students might need more support.
                    </p>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>📊 Tip:</strong> Use analytics to identify trends and adjust your teaching approach!</p>
                    </div>
                </div>
            )
        },
        {
            id: "messaging",
            title: "Messaging Students",
            icon: MessageCircle,
            color: "text-pink-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Communication Methods:</h4>

                    <div className="space-y-3">
                        <div>
                            <h5 className="text-sm font-medium mb-1">1. Direct from Student Directory:</h5>
                            <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                                <li>• Go to Students tab</li>
                                <li>• Click "Message Student" on any card</li>
                                <li>• Chat opens automatically with that student</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-sm font-medium mb-1">2. Using Peer Chat:</h5>
                            <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                                <li>• Click chat icon in sidebar</li>
                                <li>• Click Users icon to browse</li>
                                <li>• Search or filter students</li>
                                <li>• Click to start conversation</li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="text-sm font-medium mb-1">3. Global Announcements:</h5>
                            <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                                <li>• Use Global Chat for class-wide messages</li>
                                <li>• All students can see and respond</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>💬 Tip:</strong> Use private messages for individual feedback!</p>
                    </div>
                </div>
            )
        },
        {
            id: "settings",
            title: "Settings & Account",
            icon: Settings,
            color: "text-gray-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Account Settings:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><strong>Display Name:</strong> How you appear to students</li>
                        <li><strong>Avatar:</strong> Choose from 64 unique avatars</li>
                        <li><strong>Email:</strong> Your contact information</li>
                        <li><strong>Security:</strong> Change password anytime</li>
                    </ul>
                    <h4 className="font-semibold text-sm mt-4">Customization:</h4>
                    <p className="text-sm text-muted-foreground">
                        Personalize your profile with different avatar styles including People, Robots, Pixel Art, and Fun Emoji designs.
                    </p>
                </div>
            )
        },
        {
            id: "tips",
            title: "Best Practices",
            icon: Target,
            color: "text-yellow-500",
            content: (
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Tips for Success:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>✅ <strong>Check submissions regularly</strong> - Students appreciate timely feedback</li>
                        <li>✅ <strong>Set clear deadlines</strong> - Give students at least a week for assignments</li>
                        <li>✅ <strong>Use direct messaging</strong> - Reach out to students who are falling behind</li>
                        <li>✅ <strong>Monitor analytics</strong> - Identify trends early</li>
                        <li>✅ <strong>Export data</strong> - Keep records of student progress</li>
                        <li>✅ <strong>Encourage streaks</strong> - Gamification motivates students!</li>
                    </ul>
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs text-foreground"><strong>⭐ Remember:</strong> The platform is designed to make your life easier while keeping students engaged!</p>
                    </div>
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
                        Teacher Guide
                    </h1>
                    <p className="text-muted-foreground">
                        Everything you need to effectively manage your class and track student progress! 📚
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
                        <TrendingUp className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div className="space-y-2">
                            <h3 className="font-semibold">Need Technical Support?</h3>
                            <p className="text-sm text-muted-foreground">
                                If you encounter any issues or have suggestions for improving the platform, please contact your system administrator or IT support team.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminGuide;
