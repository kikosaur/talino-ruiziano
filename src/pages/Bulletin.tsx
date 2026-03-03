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
    Loader2
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";
import { usePublicContent } from "@/hooks/usePublicContent";

const categories = [
    { name: "All", icon: Megaphone, color: "bg-accent" },
    { name: "Announcement", icon: Bell, color: "bg-blue-500" },
    { name: "Achievement", icon: Trophy, color: "bg-yellow-500" },
    { name: "Academic", icon: BookOpen, color: "bg-green-500" },
    { name: "Event", icon: Users, color: "bg-purple-500" },
];

const Bulletin = () => {
    const { data: bulletins, isLoading, error } = usePublicContent("bulletin");

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredItems = (bulletins || []).filter(
        (item) => selectedCategory === "All" || item.metadata?.category === selectedCategory
    );

    // Sort: pinned first, then by date descendant
    const sortedItems = [...filteredItems].sort((a, b) => {
        const aPinned = a.metadata?.pinned;
        const bPinned = b.metadata?.pinned;

        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;

        const aDate = a.metadata?.date ? new Date(a.metadata.date).getTime() : 0;
        const bDate = b.metadata?.date ? new Date(b.metadata.date).getTime() : 0;

        return bDate - aDate;
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
                            <p>Loading bulletins...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/30 rounded-2xl">
                            <AlertCircle className="w-12 h-12 mb-4 text-muted-foreground/50" />
                            <p className="text-lg">Failed to load bulletins.</p>
                            <p className="text-sm">Please try again later.</p>
                        </div>
                    ) : sortedItems.length === 0 ? (
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
                                        item.metadata?.pinned && "border-l-4 border-l-accent",
                                        expandedId === item.id && "ring-2 ring-accent"
                                    )}
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                            {item.metadata?.icon || "📢"}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {item.metadata?.pinned && (
                                                            <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                                📌 Pinned
                                                            </span>
                                                        )}
                                                        <span
                                                            className={cn(
                                                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                                                item.metadata?.category === "Announcement" && "bg-blue-500/20 text-blue-600",
                                                                item.metadata?.category === "Achievement" && "bg-yellow-500/20 text-yellow-600",
                                                                item.metadata?.category === "Academic" && "bg-green-500/20 text-green-600",
                                                                item.metadata?.category === "Event" && "bg-purple-500/20 text-purple-600",
                                                                !item.metadata?.category && "bg-gray-500/20 text-gray-600"
                                                            )}
                                                        >
                                                            <Tag className="w-3 h-3 inline mr-1" />
                                                            {item.metadata?.category || "Notice"}
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
                                                {item.metadata?.date ? format(new Date(item.metadata.date), "MMMM d, yyyy") : 'No Date Supplied'}
                                            </div>

                                            {/* Expanded Content */}
                                            {expandedId === item.id && (
                                                <p className="text-muted-foreground mt-4 leading-relaxed animate-in fade-in slide-in-from-top-2 whitespace-pre-wrap">
                                                    {item.description}
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
