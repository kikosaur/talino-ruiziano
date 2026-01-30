import { useState, useEffect } from "react";
import { Users, Search, Mail, Trophy, BookOpen, Loader2, MessageCircle, Download, Filter, X, TrendingUp, Award, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOutletContext } from "react-router-dom";

interface StudentSubmission {
    id: string;
    ilt_name: string;
    file_name: string;
    file_url: string;
    status: string;
    grade: string | null;
    points_awarded: number;
    submitted_at: string;
}

interface StudentBadge {
    badge_id: string;
    name: string;
    icon: string;
    description: string;
    earned_at: string;
}

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
    last_active_at: string | null;
    submission_count?: number;
    submissions?: StudentSubmission[];
    badges?: StudentBadge[];
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
    const [submissionFilter, setSubmissionFilter] = useState<'7' | '30' | 'all'>('all');

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

                    // Fetch profiles
                    const { data: profilesData, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .in("user_id", studentIds)
                        .order("display_name", { ascending: true });

                    if (error) throw error;

                    // Fetch submissions with full details for all students
                    const { data: submissionsData } = await supabase
                        .from("submissions")
                        .select("*")
                        .in("user_id", studentIds)
                        .order("submitted_at", { ascending: false });

                    // Fetch badges for all students
                    const { data: badgesData } = await supabase
                        .from("user_badges")
                        .select(`
                            badge_id,
                            earned_at,
                            user_id,
                            badges (
                                id,
                                name,
                                icon,
                                description
                            )
                        `)
                        .in("user_id", studentIds);

                    // Aggregate data
                    const studentsWithData = profilesData?.map(profile => {
                        // Get submissions for this student
                        const userSubmissions = submissionsData?.filter(
                            s => s.user_id === profile.user_id
                        ).map(s => ({
                            id: s.id,
                            ilt_name: s.ilt_name,
                            file_name: s.file_name,
                            file_url: s.file_url,
                            status: s.status,
                            grade: s.grade,
                            points_awarded: s.points_awarded,
                            submitted_at: s.submitted_at
                        })) || [];

                        // Get badges
                        const userBadges = badgesData?.filter(
                            b => b.user_id === profile.user_id
                        ).map(b => ({
                            badge_id: b.badge_id,
                            name: (b.badges as any)?.name || '',
                            icon: (b.badges as any)?.icon || '',
                            description: (b.badges as any)?.description || '',
                            earned_at: b.earned_at
                        })) || [];

                        return {
                            ...profile,
                            submission_count: userSubmissions.length,
                            submissions: userSubmissions,
                            badges: userBadges
                        } as StudentProfile;
                    }) || [];

                    setStudents(studentsWithData);
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

                            <div className="p-6 space-y-6 pb-8">
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

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="card-elevated p-3 text-center">
                                        <Trophy className="w-6 h-6 text-accent mx-auto mb-1" />
                                        <p className="text-xl font-bold text-accent">{selectedStudent.total_points}</p>
                                        <p className="text-xs text-muted-foreground">Total Points</p>
                                    </div>
                                    <div className="card-elevated p-3 text-center">
                                        <BookOpen className="w-6 h-6 text-secondary mx-auto mb-1" />
                                        <p className="text-xl font-bold text-secondary">Level {selectedStudent.level}</p>
                                        <p className="text-xs text-muted-foreground">Current Level</p>
                                    </div>
                                    <div className="card-elevated p-3 text-center">
                                        <Award className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                                        <p className="text-xl font-bold text-orange-600">{selectedStudent.streak_days}</p>
                                        <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
                                    </div>
                                </div>

                                {/* Usage Statistics */}
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-foreground">Usage Statistics</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Total Time</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {selectedStudent.total_time_spent_seconds !== null && selectedStudent.total_time_spent_seconds > 0
                                                    ? `${Math.floor(selectedStudent.total_time_spent_seconds / 3600)}h ${Math.floor((selectedStudent.total_time_spent_seconds % 3600) / 60)}m`
                                                    : '< 1m'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {selectedStudent.session_count || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Avg Session</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {selectedStudent.session_count && selectedStudent.total_time_spent_seconds
                                                    ? `${Math.floor(selectedStudent.total_time_spent_seconds / selectedStudent.session_count / 60)}m`
                                                    : '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Last Active</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {selectedStudent.last_active_at
                                                    ? new Date(selectedStudent.last_active_at).toLocaleDateString()
                                                    : 'Never'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Submissions */}
                                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <h4 className="font-semibold text-foreground">Recent Submissions</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSubmissionFilter('7')}
                                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${submissionFilter === '7'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                                                    }`}
                                            >
                                                7 Days
                                            </button>
                                            <button
                                                onClick={() => setSubmissionFilter('30')}
                                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${submissionFilter === '30'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                                                    }`}
                                            >
                                                30 Days
                                            </button>
                                            <button
                                                onClick={() => setSubmissionFilter('all')}
                                                className={`px-3 py-1 text-xs rounded-lg transition-colors ${submissionFilter === 'all'
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                                                    }`}
                                            >
                                                All Time
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {selectedStudent.submissions && selectedStudent.submissions.length > 0 ? (
                                            (() => {
                                                const now = new Date();
                                                const filterDays = submissionFilter === '7' ? 7 : submissionFilter === '30' ? 30 : 999999;
                                                const cutoffDate = new Date(now.getTime() - filterDays * 24 * 60 * 60 * 1000);

                                                const filteredSubmissions = selectedStudent.submissions.filter(sub => {
                                                    if (submissionFilter === 'all') return true;
                                                    return new Date(sub.submitted_at) >= cutoffDate;
                                                });

                                                return filteredSubmissions.length > 0 ? (
                                                    filteredSubmissions.map((submission) => (
                                                        <div
                                                            key={submission.id}
                                                            className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-green-500/50 transition-colors"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-sm truncate">{submission.file_name}</p>
                                                                    <span className={`px-2 py-0.5 text-xs rounded ${submission.status === 'graded'
                                                                        ? 'bg-blue-500/20 text-blue-600'
                                                                        : submission.status === 'submitted'
                                                                            ? 'bg-green-500/20 text-green-600'
                                                                            : 'bg-gray-500/20 text-gray-600'
                                                                        }`}>
                                                                        {submission.status}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {submission.ilt_name} • {new Date(submission.submitted_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            {submission.grade && (
                                                                <div className="text-right ml-3">
                                                                    <p className="text-sm font-bold text-green-600">{submission.grade}</p>
                                                                    <p className="text-xs text-muted-foreground">{submission.points_awarded} pts</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <p className="text-sm text-muted-foreground">No submissions in this period</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="text-center py-6">
                                                <div className="text-4xl mb-2">📝</div>
                                                <p className="text-sm text-muted-foreground">No submissions yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Badges Earned */}
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-amber-600" />
                                            <h4 className="font-semibold text-foreground">
                                                Badges Earned {selectedStudent.badges && selectedStudent.badges.length > 0 && (
                                                    <span className="text-sm text-muted-foreground">({selectedStudent.badges.length})</span>
                                                )}
                                            </h4>
                                        </div>
                                    </div>
                                    {selectedStudent.badges && selectedStudent.badges.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-3">
                                            {selectedStudent.badges.slice(0, 8).map((badge) => (
                                                <div
                                                    key={badge.badge_id}
                                                    className="flex flex-col items-center gap-2 p-3 bg-card-elevated rounded-lg hover:bg-muted/50 transition-colors group"
                                                    title={badge.description}
                                                >
                                                    <div className="text-3xl">{badge.icon}</div>
                                                    <p className="text-xs text-center text-muted-foreground group-hover:text-foreground line-clamp-2">
                                                        {badge.name}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="text-4xl mb-2">🏆</div>
                                            <p className="text-sm text-muted-foreground">No badges earned yet</p>
                                            <p className="text-xs text-muted-foreground mt-1">Keep learning to earn badges!</p>
                                        </div>
                                    )}
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
