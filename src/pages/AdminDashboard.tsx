import { Link } from "react-router-dom";
import { FileText, Users, BarChart3, ArrowRight, Trophy, Clock, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSubmissions } from "@/hooks/useSubmissions";

const AdminDashboard = () => {
  const { submissions, isLoading } = useSubmissions(true);

  // Calculate stats from real submissions
  const stats = {
    totalSubmissions: submissions.length,
    pendingReview: submissions.filter(s => s.status === "pending").length,
    totalStudents: new Set(submissions.map(s => s.user_id)).size,
    gradedCount: submissions.filter(s => s.status === "graded").length,
  };

  const recentSubmissions = submissions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="ml-20 lg:ml-64 p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading dashboard...</p>
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
          <div className="space-y-2">
            <h1 className="section-title text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's an overview of your class activity.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "Total Submissions", value: stats.totalSubmissions, color: "bg-accent" },
              { icon: Clock, label: "Pending Review", value: stats.pendingReview, color: "bg-secondary" },
              { icon: Users, label: "Active Students", value: stats.totalStudents, color: "bg-primary" },
              { icon: Trophy, label: "Graded", value: stats.gradedCount, color: "bg-green-600" },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/admin/submissions"
              className="card-elevated p-6 hover:scale-[1.02] transition-transform group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center shadow-[var(--shadow-gold)]">
                    <FileText className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground">
                      View Submissions
                    </h3>
                    <p className="text-muted-foreground">
                      Review and grade student work
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/students"
              className="card-elevated p-6 hover:scale-[1.02] transition-transform group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-[var(--shadow-soft)]">
                    <Users className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground">
                      Manage Students
                    </h3>
                    <p className="text-muted-foreground">
                      View student profiles
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="card-elevated p-6 hover:scale-[1.02] transition-transform group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-foreground">
                      Analytics
                    </h3>
                    <p className="text-muted-foreground">
                      View research data
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>

          {/* Recent submissions */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title text-xl">Recent Submissions</h3>
              <Link to="/admin/submissions" className="text-accent hover:underline font-medium text-sm">
                View all →
              </Link>
            </div>
            
            {recentSubmissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{submission.student_name || "Student"}</p>
                        <p className="text-sm text-muted-foreground">{submission.ilt_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        submission.status === "graded" 
                          ? "bg-green-500/20 text-green-700"
                          : submission.status === "reviewed"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-accent/20 text-accent-foreground"
                      }`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(submission.submitted_at))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
