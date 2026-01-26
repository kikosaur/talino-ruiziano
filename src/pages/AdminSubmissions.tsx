import { FileText, Users, Trophy, Clock } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import { mockSubmissions, Submission, formatDate } from "@/data/mockSubmissions";
import { useToast } from "@/hooks/use-toast";

const AdminSubmissions = () => {
  const { toast } = useToast();

  // Calculate stats
  const stats = {
    totalSubmissions: mockSubmissions.length,
    pendingReview: mockSubmissions.filter(s => s.status === "pending").length,
    totalStudents: new Set(mockSubmissions.map(s => s.studentEmail)).size,
    totalPoints: mockSubmissions.reduce((sum, s) => sum + s.pointsAwarded, 0),
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      "Student Name",
      "Student Email",
      "ILT Assignment",
      "File Name",
      "File Size (bytes)",
      "Submitted At",
      "Status",
      "Points Awarded",
      "Grade",
    ];

    const rows = mockSubmissions.map((s) => [
      s.studentName,
      s.studentEmail,
      s.iltName,
      s.fileName,
      s.fileSize.toString(),
      s.submittedAt.toISOString(),
      s.status,
      s.pointsAwarded.toString(),
      s.grade || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful! 📊",
      description: `Exported ${mockSubmissions.length} submissions to CSV.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="section-title text-3xl">Student Submissions</h1>
            <p className="text-muted-foreground text-lg">
              View and manage all ILT submissions from students
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: FileText,
                label: "Total Submissions",
                value: stats.totalSubmissions,
                color: "bg-accent",
              },
              {
                icon: Clock,
                label: "Pending Review",
                value: stats.pendingReview,
                color: "bg-secondary",
              },
              {
                icon: Users,
                label: "Active Students",
                value: stats.totalStudents,
                color: "bg-primary",
              },
              {
                icon: Trophy,
                label: "Points Awarded",
                value: stats.totalPoints,
                color: "bg-accent",
              },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submissions table */}
          <SubmissionsTable 
            submissions={mockSubmissions} 
            onExportCSV={exportToCSV} 
          />
        </div>
      </main>
    </div>
  );
};

export default AdminSubmissions;
