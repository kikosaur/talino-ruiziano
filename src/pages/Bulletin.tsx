import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
    Megaphone,
    ArrowLeft,
    Calendar,
    Tag,
    ChevronRight,
    Bell,
    Trophy,
    BookOpen,
    Users,
    AlertCircle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

// Sample bulletin data
const bulletinItems = [
    {
        id: 1,
        title: "Enrollment for SY 2026-2027 Now Open",
        content: "We are excited to announce that enrollment for the upcoming school year is now open. Early bird registrants will receive a 10% discount on tuition fees. Visit the registrar's office or enroll online through our student portal.",
        category: "Announcement",
        date: new Date(2026, 0, 28),
        pinned: true,
        icon: "📢",
    },
    {
        id: 2,
        title: "Congratulations to Our Math Olympiad Winners!",
        content: "Our students brought home 3 gold, 5 silver, and 7 bronze medals from the Regional Mathematics Olympiad. Special recognition goes to Juan Dela Cruz for placing 1st overall. Way to go, Ruizianos!",
        category: "Achievement",
        date: new Date(2026, 0, 25),
        pinned: true,
        icon: "🏆",
    },
    {
        id: 3,
        title: "ILT Week 4 Submission Deadline Reminder",
        content: "This is a reminder that ILT Week 4: Data Collection assignments are due on February 5, 2026. Please submit your work through the Talino-Ruiziano portal. Late submissions will incur a 10-point deduction.",
        category: "Academic",
        date: new Date(2026, 0, 27),
        pinned: false,
        icon: "📚",
    },
    {
        id: 4,
        title: "Foundation Week Activities Schedule",
        content: "Join us for Foundation Week from February 10-14, 2026! Activities include: Quiz Bee, Sports Fest, Talent Show, and the Foundation Day Program. Sign-ups are now open at the Student Affairs Office.",
        category: "Event",
        date: new Date(2026, 0, 20),
        pinned: false,
        icon: "🎉",
    },
    {
        id: 5,
        title: "Parent-Teacher Conference Schedule",
        content: "The 2nd Quarter Parent-Teacher Conference will be held on February 8, 2026 from 8:00 AM to 5:00 PM. Parents are encouraged to meet with their child's advisers to discuss academic progress.",
        category: "Event",
        date: new Date(2026, 0, 18),
        pinned: false,
        icon: "👨‍👩‍👧",
    },
    {
        id: 6,
        title: "Library Extended Hours During Exam Week",
        content: "The school library will extend its operating hours from 6:00 AM to 10:00 PM during exam week (February 17-21). Take advantage of the quiet study environment and available resources.",
        category: "Announcement",
        date: new Date(2026, 0, 15),
        pinned: false,
        icon: "📖",
    },
];

const categories = [
    { name: "All", icon: Megaphone, color: "bg-accent" },
    { name: "Announcement", icon: Bell, color: "bg-blue-500" },
    { name: "Achievement", icon: Trophy, color: "bg-yellow-500" },
    { name: "Academic", icon: BookOpen, color: "bg-green-500" },
    { name: "Event", icon: Users, color: "bg-purple-500" },
];

const Bulletin = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const filteredItems = bulletinItems.filter(
        (item) => selectedCategory === "All" || item.category === selectedCategory
    );

    // Sort: pinned first, then by date
    const sortedItems = [...filteredItems].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.date.getTime() - a.date.getTime();
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-br from-primary to-primary/80">
                <div className="container mx-auto px-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-[var(--shadow-gold)]">
                            <Megaphone className="w-8 h-8 text-accent-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-primary-foreground">
                                School Bulletin
                            </h1>
                            <p className="text-primary-foreground/80 text-lg">
                                Stay updated with the latest news and announcements
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-6 border-b border-border sticky top-16 bg-background z-40">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                    selectedCategory === cat.name
                                        ? "bg-accent text-accent-foreground shadow-[var(--shadow-gold)]"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bulletin Items */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {sortedItems.length === 0 ? (
                        <div className="text-center py-16">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No bulletins in this category</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-4xl mx-auto">
                            {sortedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "card-elevated p-6 transition-all cursor-pointer",
                                        item.pinned && "border-l-4 border-l-accent",
                                        expandedId === item.id && "ring-2 ring-accent"
                                    )}
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                            {item.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {item.pinned && (
                                                            <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                                📌 Pinned
                                                            </span>
                                                        )}
                                                        <span
                                                            className={cn(
                                                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                                                item.category === "Announcement" && "bg-blue-500/20 text-blue-600",
                                                                item.category === "Achievement" && "bg-yellow-500/20 text-yellow-600",
                                                                item.category === "Academic" && "bg-green-500/20 text-green-600",
                                                                item.category === "Event" && "bg-purple-500/20 text-purple-600"
                                                            )}
                                                        >
                                                            <Tag className="w-3 h-3 inline mr-1" />
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-serif font-bold text-lg text-foreground">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <ChevronRight
                                                    className={cn(
                                                        "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                                                        expandedId === item.id && "rotate-90"
                                                    )}
                                                />
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(item.date, "MMMM d, yyyy")}
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedId === item.id && (
                                                <p className="text-muted-foreground mt-4 leading-relaxed animate-in fade-in slide-in-from-top-2">
                                                    {item.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Bulletin;
