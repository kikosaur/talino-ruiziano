import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  Image,
  ChevronUp,
  ChevronDown,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Save,
  X,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  studentName: string;
  studentEmail: string;
  iltName: string;
  fileName: string;
  fileUrl: string; // Added fileUrl
  fileType: string;
  fileSize: number;
  submittedAt: Date;
  status: "pending" | "reviewed" | "graded";
  pointsAwarded: number;
  grade?: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
  onExportCSV: () => void;
  onUpdateSubmission?: (
    submissionId: string,
    status: "pending" | "reviewed" | "graded",
    grade?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

type SortField = "studentName" | "iltName" | "submittedAt" | "status";
type SortDirection = "asc" | "desc";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-accent/20 text-accent-foreground border-accent/30"
  },
  reviewed: {
    label: "Reviewed",
    icon: Eye,
    className: "bg-secondary/20 text-secondary border-secondary/30"
  },
  graded: {
    label: "Graded",
    icon: CheckCircle,
    className: "bg-green-500/20 text-green-700 border-green-500/30"
  },
};

const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const SubmissionsTable = ({ submissions, onExportCSV, onUpdateSubmission }: SubmissionsTableProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [iltFilter, setIltFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Grading modal state
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [editingStatus, setEditingStatus] = useState<"pending" | "reviewed" | "graded">("pending");
  const [editingGrade, setEditingGrade] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Get unique ILT names for filter
  const iltOptions = useMemo(() => {
    const unique = [...new Set(submissions.map(s => s.iltName))];
    return unique.sort();
  }, [submissions]);

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.studentName.toLowerCase().includes(query) ||
          s.studentEmail.toLowerCase().includes(query) ||
          s.fileName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(s => s.status === statusFilter);
    }

    // Apply ILT filter
    if (iltFilter !== "all") {
      result = result.filter(s => s.iltName === iltFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "studentName":
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case "iltName":
          comparison = a.iltName.localeCompare(b.iltName);
          break;
        case "submittedAt":
          comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [submissions, searchQuery, statusFilter, iltFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openGradingModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEditingStatus(submission.status);
    setEditingGrade(submission.grade || "");
    setIsGradingModalOpen(true);
  };

  const handleSaveGrade = async () => {
    if (!selectedSubmission || !onUpdateSubmission) return;

    setIsSaving(true);
    try {
      const result = await onUpdateSubmission(
        selectedSubmission.id,
        editingStatus,
        editingGrade || undefined
      );

      if (result.success) {
        toast({
          title: "Submission Updated! ✅",
          description: `${selectedSubmission.studentName}'s submission has been updated.`,
        });
        setIsGradingModalOpen(false);
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update submission",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by student name, email, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-warm"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 input-warm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="graded">Graded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={iltFilter} onValueChange={setIltFilter}>
          <SelectTrigger className="w-full sm:w-56 input-warm">
            <SelectValue placeholder="ILT Assignment" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Assignments</SelectItem>
            {iltOptions.map((ilt) => (
              <SelectItem key={ilt} value={ilt}>
                {ilt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={onExportCSV} className="btn-gold flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </p>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("studentName")}
                >
                  <div className="flex items-center gap-2">
                    Student
                    <SortIcon field="studentName" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("iltName")}
                >
                  <div className="flex items-center gap-2">
                    Assignment
                    <SortIcon field="iltName" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  File
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("submittedAt")}
                >
                  <div className="flex items-center gap-2">
                    Submitted
                    <SortIcon field="submittedAt" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Points
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Grade
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission, index) => {
                const status = statusConfig[submission.status];
                const StatusIcon = status.icon;
                const isImage = submission.fileType.startsWith("image/");

                return (
                  <tr
                    key={submission.id}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/20 transition-colors",
                      index % 2 === 0 ? "bg-card" : "bg-card/50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {submission.studentName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {submission.studentEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-foreground text-sm">
                        {submission.iltName}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isImage ? "bg-accent/20" : "bg-primary/20"
                        )}>
                          {isImage ? (
                            <Image className="w-4 h-4 text-accent" />
                          ) : (
                            <FileText className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-foreground hover:text-accent hover:underline truncate max-w-[150px] block font-medium flex items-center gap-1"
                          >
                            {submission.fileName}
                            <Download className="w-3 h-3 text-muted-foreground" />
                          </a>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(submission.fileSize)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-foreground">
                        {formatDate(submission.submittedAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        status.className
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-accent">
                        +{submission.pointsAwarded}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {submission.grade ? (
                        <span className="font-bold text-foreground bg-muted px-2 py-1 rounded">
                          {submission.grade}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGradingModal(submission)}
                        className="flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Grade
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No submissions found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      <Dialog open={isGradingModalOpen} onOpenChange={setIsGradingModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-accent" />
              Grade Submission
            </DialogTitle>
            <DialogDescription>
              Update the status and assign a grade for this submission.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6 py-4">
              {/* Student Info */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="font-medium text-foreground">{selectedSubmission.studentName}</p>
                <p className="text-sm text-muted-foreground">{selectedSubmission.studentEmail}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Assignment:</span> {selectedSubmission.iltName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">File:</span> {selectedSubmission.fileName}
                </p>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value as typeof editingStatus)}
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="graded">Graded</option>
                </select>
              </div>

              {/* Grade Selection */}
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter grade (e.g. 95)"
                  value={editingGrade}
                  onChange={(e) => setEditingGrade(e.target.value)}
                  className="input-warm"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsGradingModalOpen(false)}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveGrade}
              disabled={isSaving}
              className="btn-gold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionsTable;
