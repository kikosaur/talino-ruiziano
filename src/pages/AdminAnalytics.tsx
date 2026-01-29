import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, subWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { useILTDeadlines } from "@/hooks/useILTDeadlines";

const AdminAnalytics = () => {
    const { deadlines } = useILTDeadlines();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        avgGrade: 0,
        avgGradeDiff: 0,
        activeStudents: 0,
        totalSubmissions: 0,
        upcomingDeadlines: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);

            // 1. Fetch Submissions (for Stats & Charts)
            const { data: submissions, error: subError } = await supabase
                .from("submissions")
                .select("*")
                .order("submitted_at", { ascending: false });

            if (subError) throw subError;

            // 2. Fetch Active Students (Total students)
            const { count: studentCount, error: roleError } = await supabase
                .from("user_roles")
                .select("*", { count: 'exact', head: true })
                .eq("role", "student");

            if (roleError) throw roleError;

            // 3. Fetch Recent Badges (for Activity)
            const { data: badges, error: badgeError } = await supabase
                .from("user_badges")
                .select("*, badges(*)")
                .order("earned_at", { ascending: false })
                .limit(5);

            if (badgeError) throw badgeError;

            // --- PROCESS DATA ---

            // A. KPI: Total Submissions
            const totalSubmissions = submissions?.length || 0;

            // B. KPI: Avg Performance (Parse grades)
            const gradedSubmissions = submissions?.filter(s => s.grade && !isNaN(Number(s.grade))) || [];
            const totalGrade = gradedSubmissions.reduce((sum, s) => sum + Number(s.grade), 0);
            const currentAvg = gradedSubmissions.length > 0 ? (totalGrade / gradedSubmissions.length) : 0;
            // (Mock diff for now as we don't have historical snapshots easily)
            const avgGradeDiff = 0;

            // C. KPI: Active Students
            const activeStudents = studentCount || 0;

            // D. KPI: Upcoming Deadlines (Next 7 days)
            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            const upcomingCount = deadlines.filter(d => {
                const due = new Date(d.deadline);
                return due >= now && due <= nextWeek;
            }).length;

            setStats({
                avgGrade: Math.round(currentAvg * 10) / 10,
                avgGradeDiff,
                activeStudents,
                totalSubmissions,
                upcomingDeadlines: upcomingCount
            });

            // E. CHART: Weekly Trends (Last 6 weeks)
            const weeks = [];
            for (let i = 5; i >= 0; i--) {
                const d = subWeeks(new Date(), i);
                const start = startOfWeek(d);
                const end = endOfWeek(d);
                const label = `Week ${format(d, "w")}`; // or just Week 1..6 relative? Let's use Week number
                // Or simplified: "Week 1", "Week 2" logic based on data present? 
                // Let's just do last 6 ISO weeks.

                const weekSubmissions = submissions?.filter(s => {
                    const subDate = new Date(s.submitted_at);
                    return subDate >= start && subDate <= end;
                }) || [];

                const weekGraded = weekSubmissions.filter(s => s.grade && !isNaN(Number(s.grade)));
                const weekTotal = weekGraded.reduce((sum, s) => sum + Number(s.grade), 0);
                const weekAvg = weekGraded.length > 0 ? Math.round(weekTotal / weekGraded.length) : 0;

                weeks.push({
                    name: format(start, "MMM d"),
                    submissions: weekSubmissions.length,
                    avgGrade: weekAvg
                });
            }
            setChartData(weeks);

            // F. RECENT ACTIVITY (Merge Submissions & Badges)
            // We need student names for submissions. 
            // In a real optimized query we'd join profiles. For now let's just fetch profiles for the top 5 submissions.
            const recentSubs = submissions?.slice(0, 5) || [];
            const userIds = [...new Set([...recentSubs.map(s => s.user_id), ...(badges?.map(b => b.user_id) || [])])];

            const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
            const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]));

            const activityList = [
                ...recentSubs.map(s => ({
                    type: 'submission',
                    user: profileMap.get(s.user_id) || "Unknown Student",
                    initials: (profileMap.get(s.user_id) || "U").substring(0, 2).toUpperCase(),
                    action: `Submitted ${s.ilt_name}`,
                    time: s.submitted_at,
                    color: "bg-accent/20 text-accent"
                })),
                ...(badges?.map((b: any) => ({
                    type: 'badge',
                    user: profileMap.get(b.user_id) || "Unknown Student",
                    initials: (profileMap.get(b.user_id) || "U").substring(0, 2).toUpperCase(),
                    action: `Earned "${b.badges?.name}" Badge`,
                    time: b.earned_at,
                    color: "bg-primary/20 text-primary"
                })) || [])
            ]
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 5); // Start with top 5

            setRecentActivity(activityList);

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <AdminSidebar />
                <main className="ml-20 lg:ml-64 p-6 lg:p-8 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-accent animate-spin" />
                        <p className="text-muted-foreground">Loading analytics...</p>
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
                    <div className="space-y-1">
                        <h1 className="section-title text-3xl flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-accent" />
                            Class Analytics
                        </h1>
                        <p className="text-muted-foreground">
                            Insights into student performance and engagement.
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg. Performance
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.avgGrade}%</div>
                                <p className="text-xs text-muted-foreground">
                                    Based on graded submissions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Enrolled Students
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeStudents}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total class size
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Submissions
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                                <p className="text-xs text-muted-foreground">
                                    Files received
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Upcoming Deadlines
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                                <p className="text-xs text-muted-foreground">
                                    In the next 7 days
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Submission & Performance Trends</CardTitle>
                                <CardDescription>
                                    Weekly submission counts and average grades.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={chartData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Bar dataKey="submissions" fill="#801B1B" radius={[4, 4, 0, 0]} name="Submissions" />
                                        <Bar dataKey="avgGrade" fill="#FFC107" radius={[4, 4, 0, 0]} name="Avg Grade" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Latest student actions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {recentActivity.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No recent activity.</p>
                                    ) : (
                                        recentActivity.map((activity, i) => (
                                            <div key={i} className="flex items-center">
                                                <div className={`w-9 h-9 rounded-full ${activity.color} flex items-center justify-center font-bold mr-4`}>
                                                    {activity.initials}
                                                </div>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.action}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminAnalytics;
