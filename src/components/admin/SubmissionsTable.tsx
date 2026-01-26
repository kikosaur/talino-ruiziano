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
  AlertCircle
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
import { Submission, formatFileSize, formatDate } from "@/data/mockSubmissions";
import { cn } from "@/lib/utils";

interface SubmissionsTableProps {
  submissions: Submission[];
  onExportCSV: () => void;
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

const SubmissionsTable = ({ submissions, onExportCSV }: SubmissionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [iltFilter, setIltFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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
                          <p className="text-sm text-foreground truncate max-w-[150px]">
                            {submission.fileName}
                          </p>
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
    </div>
  );
};

export default SubmissionsTable;
