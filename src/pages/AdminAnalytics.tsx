import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, Loader2, Trophy } from "lucide-react";
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
        upcomingDeadlines: 0,
        avgSessionDuration: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [topUsers, setTopUsers] = useState<any[]>([]);

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

            // 2. Fetch Active Students (Total students) & Profiles for stats
            const { data: studentProfiles, error: profileError } = await supabase
                .from("profiles")
                .select("user_id, display_name, avatar_url, total_time_spent_seconds, session_count")
                .order("total_time_spent_seconds", { ascending: false });

            if (profileError) throw profileError;

            // Filter out teachers/admins if necessary? Assuming profiles contains mostly students or we filter by role
            // Better to join with roles, but for now assuming high time spent implies valid user.
            // Let's rely on the role fetch for exact count.
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

            //KPIs and Chart Data processing...
            const totalSubmissions = submissions?.length || 0;
            const gradedSubmissions = submissions?.filter(s => s.grade && !isNaN(Number(s.grade))) || [];
            const totalGrade = gradedSubmissions.reduce((sum, s) => sum + Number(s.grade), 0);
            const currentAvg = gradedSubmissions.length > 0 ? (totalGrade / gradedSubmissions.length) : 0;
            const activeStudents = studentCount || 0;

            // Session Stats
            const totalTime = studentProfiles?.reduce((sum, p) => sum + (p.total_time_spent_seconds || 0), 0) || 0;
            const totalSessions = studentProfiles?.reduce((sum, p) => sum + (p.session_count || 0), 0) || 0;
            const avgSessionDuration = totalSessions > 0 ? totalTime / totalSessions : 0;

            const now = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(now.getDate() + 7);
            const upcomingCount = deadlines.filter(d => {
                const due = new Date(d.deadline);
                return due >= now && due <= nextWeek;
            }).length;

            setStats({
                avgGrade: Math.round(currentAvg * 10) / 10,
                avgGradeDiff: 0,
                activeStudents,
                totalSubmissions,
                upcomingDeadlines: upcomingCount,
                avgSessionDuration
            });

            // Set Top Users
            setTopUsers(studentProfiles?.slice(0, 5) || []);

            const weeks = [];
            for (let i = 5; i >= 0; i--) {
                const d = subWeeks(new Date(), i);
                const start = startOfWeek(d);
                const end = endOfWeek(d);
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

            // Recent activity processing
            const recentSubs = submissions?.slice(0, 5) || [];
            const userIds = [...new Set([...recentSubs.map(s => s.user_id), ...(badges?.map(b => b.user_id) || [])])];
            // We already have profiles, so map from that
            const profileMap = new Map(studentProfiles?.map(p => [p.user_id, p.display_name]));

            const activityList = [
                ...recentSubs.map(s => ({
                    user: profileMap.get(s.user_id) || "Unknown Student",
                    initials: (profileMap.get(s.user_id) || "U").substring(0, 2).toUpperCase(),
                    action: `Submitted ${s.ilt_name}`,
                    time: s.submitted_at,
                    color: "bg-accent/20 text-accent"
                })),
                ...(badges?.map((b: any) => ({
                    user: profileMap.get(b.user_id) || "Unknown Student",
                    initials: (profileMap.get(b.user_id) || "U").substring(0, 2).toUpperCase(),
                    action: `Earned "${b.badges?.name}" Badge`,
                    time: b.earned_at,
                    color: "bg-primary/20 text-primary"
                })) || [])
            ]
                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                .slice(0, 5);

            setRecentActivity(activityList);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-6 lg:p-8 transition-all duration-300">
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avgGrade}%</div>
                            <p className="text-xs text-muted-foreground">Based on graded submissions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeStudents}</div>
                            <p className="text-xs text-muted-foreground">Total class size</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                            <p className="text-xs text-muted-foreground">Files received</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                            <p className="text-xs text-muted-foreground">Next 7 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Class Avg Session</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.floor(stats.avgSessionDuration / 60)}m
                            </div>
                            <p className="text-xs text-muted-foreground">Per login session</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Activity */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Trends</CardTitle>
                            <CardDescription>Submission and performance metrics over time.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
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

                    <div className="col-span-3 space-y-4">
                        {/* Top Active Students */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Active Students</CardTitle>
                                <CardDescription>Most engaged learners by time spent.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topUsers.map((user, i) => (
                                        <div key={user.user_id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.display_name?.[0] || "U").toUpperCase()
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium leading-none">{user.display_name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.session_count || 0} sessions</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-accent">
                                                {Math.floor((user.total_time_spent_seconds || 0) / 3600)}h {Math.floor(((user.total_time_spent_seconds || 0) % 3600) / 60)}m
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest student actions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {recentActivity.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No recent activity.</p>
                                    ) : (
                                        recentActivity.map((activity, i) => (
                                            <div key={i} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center font-bold mr-3`}>
                                                    {activity.initials}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{activity.user}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]" title={activity.action}>{activity.action}</p>
                                                </div>
                                                <div className="text-xs text-muted-foreground whitespace-nowrap">
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
    );
};

export default AdminAnalytics;
