import { useState, useEffect } from "react";
import {
    Users,
    Search,
    MoreHorizontal,
    Mail,
    GraduationCap,
    Loader2
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentProfile {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    level: number;
    total_points: number;
    streak_days: number;
    user_id: string;
}

const AdminStudents = () => {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            // First get all user IDs with role 'student'
            const { data: roleData, error: roleError } = await supabase
                .from("user_roles")
                .select("user_id")
                .eq("role", "student");

            if (roleError) throw roleError;

            if (roleData && roleData.length > 0) {
                const studentIds = roleData.map(r => r.user_id);

                // Then get profiles for these students
                const { data: profiles, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .in("user_id", studentIds);

                if (profileError) throw profileError;

                // Sort by name
                const sortedProfiles = (profiles || []).sort((a, b) =>
                    (a.display_name || "").localeCompare(b.display_name || "")
                );

                // Map to include user_id if needed, though profiles has user_id
                setStudents(sortedProfiles as StudentProfile[]);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        (student.display_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <AdminSidebar />
                <main className="ml-20 lg:ml-64 p-6 lg:p-8 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        <p className="text-muted-foreground">Loading students...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="section-title text-3xl flex items-center gap-3">
                                <Users className="w-8 h-8 text-accent" />
                                Enrolled Students
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your class roster and view student progress.
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 input-warm"
                            />
                        </div>
                    </div>

                    {/* Students List */}
                    <div className="card-elevated overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-6 py-4 text-left font-semibold text-foreground">Name</th>
                                        <th className="px-6 py-4 text-left font-semibold text-foreground hidden md:table-cell">Level</th>
                                        <th className="px-6 py-4 text-left font-semibold text-foreground hidden sm:table-cell">Points</th>
                                        <th className="px-6 py-4 text-left font-semibold text-foreground hidden lg:table-cell">Streak</th>
                                        <th className="px-6 py-4 text-right font-semibold text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                                No students found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student, index) => (
                                            <tr
                                                key={student.id}
                                                className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? "bg-card" : "bg-card/50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {(student.display_name?.[0] || student.email[0]).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">{student.display_name || "Unknown Name"}</p>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                {student.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-accent" />
                                                        <span className="font-medium">Lvl {student.level}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className="text-accent font-bold">{student.total_points.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full text-xs font-bold">
                                                        {student.streak_days} Days 🔥
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.email)}>
                                                                Copy Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminStudents;
