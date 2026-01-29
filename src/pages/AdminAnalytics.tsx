import { BarChart3, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock data for analytics
const data = [
    { name: "Week 1", submissions: 24, avgGrade: 85 },
    { name: "Week 2", submissions: 28, avgGrade: 88 },
    { name: "Week 3", submissions: 22, avgGrade: 82 },
    { name: "Week 4", submissions: 30, avgGrade: 90 },
    { name: "Week 5", submissions: 25, avgGrade: 86 },
    { name: "Week 6", submissions: 27, avgGrade: 89 },
];

const AdminAnalytics = () => {
    // In a real app, we would fetch analytics data here

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
                                <div className="text-2xl font-bold">87.5%</div>
                                <p className="text-xs text-muted-foreground">
                                    +2.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Students
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">32</div>
                                <p className="text-xs text-muted-foreground">
                                    100% submission rate this week
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
                                <div className="text-2xl font-bold">156</div>
                                <p className="text-xs text-muted-foreground">
                                    Across 6 assignments
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
                                <div className="text-2xl font-bold">2</div>
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
                                    <BarChart data={data}>
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
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold mr-4">
                                            JD
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">John Doe</p>
                                            <p className="text-sm text-muted-foreground">
                                                Submitted ILT Week 6
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-4">
                                            AS
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Alice Smith</p>
                                            <p className="text-sm text-muted-foreground">
                                                Earned "Early Bird" Badge
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">2h ago</div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold mr-4">
                                            RJ
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Robert Johnson</p>
                                            <p className="text-sm text-muted-foreground">
                                                Updated profile picture
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">5h ago</div>
                                    </div>
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
