import { useState, useEffect } from "react";
import { Users, Search, Mail, Trophy, BookOpen, Loader2, MessageCircle, Download, Filter, X, TrendingUp, Award, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOutletContext } from "react-router-dom";

interface StudentProfile {
    user_id: string;
    display_name: string | null;
    email: string | null;
    avatar_url: string | null;
    total_points: number;
    level: number;
    streak_days: number;
    total_time_spent_seconds: number | null;
    session_count: number | null;
}

interface AdminLayoutContext {
    toggleChat: (recipientId?: string) => void;
}

const AdminStudents = () => {
    const { toast } = useToast();
    const { toggleChat } = useOutletContext<AdminLayoutContext>();
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    const [sortBy, setSortBy] = useState<"name" | "points" | "level" | "time">("name");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                // Fetch only students (filter by role)
                const { data: roleData, error: roleError } = await supabase
                    .from("user_roles")
                    .select("user_id")
                    .eq("role", "student");

                if (roleError) throw roleError;

                if (roleData && roleData.length > 0) {
                    const studentIds = roleData.map(r => r.user_id);
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .in("user_id", studentIds)
                        .order("display_name", { ascending: true });

                    if (error) throw error;
                    setStudents(data as StudentProfile[]);
                } else {
                    setStudents([]);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                toast({
                    title: "Error",
                    description: "Failed to load student directory.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, [toast]);

    const filteredAndSortedStudents = students
        .filter(student =>
        (student.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "points":
                    return b.total_points - a.total_points;
                case "level":
                    return b.level - a.level;
                case "time":
                    const aTime = a.total_time_spent_seconds || 0;
                    const bTime = b.total_time_spent_seconds || 0;
                    return bTime - aTime;
                case "name":
                default:
                    return (a.display_name || "").localeCompare(b.display_name || "");
            }
        });

    const handleExportCSV = () => {
        const headers = ["Name", "Email", "Points", "Level", "Streak"];
        const rows = filteredAndSortedStudents.map(s => [
            s.display_name || "Unknown",
            s.email || "",
            s.total_points.toString(),
            s.level.toString(),
            s.streak_days.toString(),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: "Export Successful! 📊",
            description: `Exported ${filteredAndSortedStudents.length} students to CSV.`,
        });
    };

    const handleMessageStudent = (student: StudentProfile) => {
        // Open chat with this specific student
        toggleChat(student.user_id);
        toast({
            title: "Opening Private Chat",
            description: `Starting conversation with ${student.display_name || "this student"}.`,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <p className="text-muted-foreground">Loading student directory...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="section-title text-3xl flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary" />
                            Student Directory
                        </h1>
                        <p className="text-muted-foreground">
                            {filteredAndSortedStudents.length} students enrolled in your program
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={sortBy === "name" ? "default" : "outline"}
                            onClick={() => setSortBy("name")}
                            className="gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Name
                        </Button>
                        <Button
                            variant={sortBy === "points" ? "default" : "outline"}
                            onClick={() => setSortBy("points")}
                            className="gap-2"
                        >
                            <Trophy className="w-4 h-4" />
                            Points
                        </Button>
                        <Button
                            variant={sortBy === "level" ? "default" : "outline"}
                            onClick={() => setSortBy("level")}
                            className="gap-2"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Level
                        </Button>
                        <Button
                            variant={sortBy === "time" ? "default" : "outline"}
                            onClick={() => setSortBy("time")}
                            className="gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Usage
                        </Button>
                    </div>
                </div>

                {/* Student Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedStudents.length === 0 ? (
                        <div className="col-span-full py-20 text-center card-elevated">
                            <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-medium text-muted-foreground">No students found</p>
                        </div>
                    ) : (
                        filteredAndSortedStudents.map((student) => (
                            <div
                                key={student.user_id}
                                className="card-elevated group hover:scale-[1.02] transition-all cursor-pointer"
                                onClick={() => setSelectedStudent(student)}
                            >
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                                            {student.avatar_url ? (
                                                <img src={student.avatar_url} alt={student.display_name || ""} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-primary">
                                                    {(student.display_name?.[0] || "U").toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-serif font-bold text-xl truncate group-hover:text-primary transition-colors">
                                                {student.display_name || "Anonymous Student"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span className="truncate">{student.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                                            <Trophy className="w-4 h-4 text-accent" />
                                            <span className="text-sm font-bold text-accent">{student.total_points}</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                                            <BookOpen className="w-4 h-4 text-secondary" />
                                            <span className="text-sm font-bold text-secondary">Lvl {student.level}</span>
                                        </div>
                                        {student.streak_days > 0 && (
                                            <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                                <span className="text-sm font-bold text-orange-600">{student.streak_days}🔥</span>
                                            </div>
                                        )}
                                        {student.total_time_spent_seconds !== null && student.total_time_spent_seconds > 0 && (
                                            <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                                <Clock className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-bold text-blue-600">
                                                    {Math.floor(student.total_time_spent_seconds / 3600)}h {Math.floor((student.total_time_spent_seconds % 3600) / 60)}m
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMessageStudent(student);
                                        }}
                                        variant="outline"
                                        className="w-full gap-2 hover:bg-primary/10 hover:border-primary"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Message Student
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Student Detail Modal */}
                {selectedStudent && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedStudent(null)}
                    >
                        <div
                            className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold font-serif">Student Profile</h2>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                                        {selectedStudent.avatar_url ? (
                                            <img src={selectedStudent.avatar_url} alt={selectedStudent.display_name || ""} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-primary">
                                                {(selectedStudent.display_name?.[0] || "U").toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold font-serif mb-2">{selectedStudent.display_name || "Anonymous Student"}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                            <Mail className="w-4 h-4" />
                                            <span>{selectedStudent.email}</span>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                handleMessageStudent(selectedStudent);
                                                setSelectedStudent(null);
                                            }}
                                            className="btn-gold gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Send Message
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="card-elevated p-4 text-center">
                                        <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-accent">{selectedStudent.total_points}</p>
                                        <p className="text-sm text-muted-foreground">Total Points</p>
                                    </div>
                                    <div className="card-elevated p-4 text-center">
                                        <BookOpen className="w-8 h-8 text-secondary mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-secondary">Level {selectedStudent.level}</p>
                                        <p className="text-sm text-muted-foreground">Current Level</p>
                                    </div>
                                    <div className="card-elevated p-4 text-center">
                                        <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-orange-600">{selectedStudent.streak_days}</p>
                                        <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
                                    </div>
                                </div>

                                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                                    <p className="text-sm text-muted-foreground">
                                        <strong className="text-foreground">Note:</strong> Additional student data such as submissions, badges, and activity history will be available in future updates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminStudents;
