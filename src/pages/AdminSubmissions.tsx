import { FileText, Users, Trophy, Clock, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useToast } from "@/hooks/use-toast";

// Adapter to convert our Submission type to the table's expected format
interface TableSubmission {
  id: string;
  studentName: string;
  studentEmail: string;
  iltName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  submittedAt: Date;
  status: "pending" | "reviewed" | "graded";
  pointsAwarded: number;
  grade?: string;
}

const AdminSubmissions = () => {
  const { toast } = useToast();
  const { submissions, isLoading, updateSubmissionStatus } = useSubmissions(true);

  // Transform submissions to match table component format
  const tableSubmissions: TableSubmission[] = submissions.map((s) => ({
    id: s.id,
    studentName: s.student_name || "Unknown Student",
    studentEmail: s.student_email || "",
    iltName: s.ilt_name,
    fileName: s.file_name,
    fileType: s.file_type,
    fileSize: s.file_size,
    submittedAt: new Date(s.submitted_at),
    status: s.status,
    pointsAwarded: s.points_awarded,
    grade: s.grade || undefined,
  }));

  // Calculate stats
  const stats = {
    totalSubmissions: tableSubmissions.length,
    pendingReview: tableSubmissions.filter(s => s.status === "pending").length,
    totalStudents: new Set(submissions.map(s => s.user_id)).size,
    totalPoints: tableSubmissions.reduce((sum, s) => sum + s.pointsAwarded, 0),
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

    const rows = tableSubmissions.map((s) => [
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
      description: `Exported ${tableSubmissions.length} submissions to CSV.`,
    });
  };

  const handleUpdateSubmission = async (
    submissionId: string,
    status: "pending" | "reviewed" | "graded",
    grade?: string
  ) => {
    return updateSubmissionStatus(submissionId, status, grade);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="ml-20 lg:ml-64 p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading submissions...</p>
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
            submissions={tableSubmissions} 
            onExportCSV={exportToCSV}
            onUpdateSubmission={handleUpdateSubmission}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminSubmissions;
