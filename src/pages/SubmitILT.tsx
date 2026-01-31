import { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  Upload, FileText, Image, X, CheckCircle, AlertCircle,
  Eye, Clock, Award, Loader2, Filter, ChevronLeft, ChevronRight,
  ArrowUpDown
} from "lucide-react";
import ConfettiEffect from "@/components/dashboard/ConfettiEffect";
import SuccessModal from "@/components/dashboard/SuccessModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useILTDeadlines } from "@/hooks/useILTDeadlines";
import { useAppSettings } from "@/hooks/useAppSettings";

interface UploadedFile {
  file: File;
  preview?: string;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ITEMS_PER_PAGE = 5;

const SubmitILT = () => {
  const { profile, refreshProfile } = useAuth();
  const { submitILT, submissions } = useSubmissions();
  const { deadlines } = useILTDeadlines();
  const { settings } = useAppSettings();

  // Create a set of submitted ILT names for efficient lookup
  const submittedIltNames = new Set(submissions.map(s => s.ilt_name));

  // Convert deadlines to iltOptions format for the form, excluding archived ones
  const iltOptions = deadlines
    .filter(d => !d.is_archived)
    .map((d) => {
      const dueDate = new Date(d.deadline);
      const isPastDue = dueDate < new Date();
      const isLateNotAllowed = settings ? !settings.allow_late_submissions && isPastDue : false;
      const isDone = submittedIltNames.has(d.name);

      return {
        id: d.id,
        name: d.name,
        subject: d.subject || "General",
        dueDate: format(dueDate, "MMM d, yyyy"),
        isDone,
        isLocked: isLateNotAllowed && !isDone, // Lock if late and strict mode is on
        isPastDue
      };
    });

  const [selectedILT, setSelectedILT] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "graded" | "pending">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPoints = profile?.total_points || 0;

  const handleFileSelect = useCallback((file: File) => {
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a PDF or image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB");
      return;
    }

    const uploadedFile: UploadedFile = { file };

    // Create preview for images
    if (file.type.startsWith("image/")) {
      uploadedFile.preview = URL.createObjectURL(file);
    }

    setUploadedFile(uploadedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedILT || !uploadedFile) {
      setError("Please select an ILT and upload a file");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const iltName = iltOptions.find(ilt => ilt.id === selectedILT)?.name || selectedILT;
    const result = await submitILT(iltName, uploadedFile.file);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Failed to submit ILT");
      return;
    }

    // Refresh profile to get updated points
    await refreshProfile();

    // Success!
    setShowConfetti(true);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setShowConfetti(false);
    // Reset form
    setSelectedILT("");
    removeFile();
  };

  // Logic: Filter -> Sort -> Paginate
  const filteredSubmissions = submissions.filter(s => {
    if (filterStatus === "all") return true;
    if (filterStatus === "graded") return s.status === "graded";
    if (filterStatus === "pending") return s.status === "pending" || s.status === "reviewed"; // Treat 'reviewed' as pending/process
    return true;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    const dateA = new Date(a.submitted_at).getTime();
    const dateB = new Date(b.submitted_at).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedSubmissions.length / ITEMS_PER_PAGE);

  // Ensure current page is valid when filtering changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <ConfettiEffect isActive={showConfetti} />
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        fileName={uploadedFile?.file.name || ""}
        pointsEarned={50}
        newTotal={currentPoints + 50}
      />

      <main className="ml-0 md:ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="section-title text-3xl">Submit ILT</h1>
            <p className="text-muted-foreground text-lg">
              Upload your Independent Learning Task and earn <span className="text-accent font-bold">+50 points</span>!
            </p>
          </div>

          {iltOptions.length === 0 ? (
            <div className="card-elevated p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No Assignments Available</h3>
              <p className="text-muted-foreground">
                There are currently no deadline assignments to submit to.
                <br />
                Please ask your teacher to add an assignment in the Teacher Panel.
              </p>
            </div>
          ) : (
            /* Main form card */
            <div className="card-elevated p-6 md:p-8 space-y-6">
              {/* ILT Selection */}
              <div className="space-y-3">
                <Label className="text-foreground font-semibold text-lg">
                  Select ILT Assignment
                </Label>
                <div className="grid gap-3">
                  {iltOptions.map((ilt) => (
                    <button
                      key={ilt.id}
                      onClick={() => !ilt.isDone && !ilt.isLocked && setSelectedILT(prev => prev === ilt.id ? "" : ilt.id)}
                      disabled={ilt.isDone || ilt.isLocked}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left",
                        ilt.isDone
                          ? "border-green-500/30 bg-green-500/5 opacity-80 cursor-default"
                          : ilt.isLocked
                            ? "border-destructive/30 bg-destructive/5 opacity-80 cursor-not-allowed"
                            : selectedILT === ilt.id
                              ? "border-accent bg-accent/10"
                              : "border-border hover:border-accent/50 bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          ilt.isDone
                            ? "border-green-500 bg-green-500"
                            : ilt.isLocked
                              ? "border-destructive bg-destructive"
                              : selectedILT === ilt.id
                                ? "border-accent bg-accent"
                                : "border-muted-foreground"
                        )}>
                          {(selectedILT === ilt.id || ilt.isDone) && !ilt.isLocked && (
                            <CheckCircle className={cn(
                              "w-3 h-3",
                              ilt.isDone ? "text-white" : "text-accent-foreground"
                            )} />
                          )}
                          {ilt.isLocked && (
                            <X className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              ilt.isDone ? "text-muted-foreground line-through" :
                                ilt.isLocked ? "text-destructive" :
                                  "text-foreground"
                            )}>
                              {ilt.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase">
                              {ilt.subject}
                            </span>
                            {ilt.isDone && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 font-bold uppercase">
                                Done
                              </span>
                            )}
                            {ilt.isLocked && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-bold uppercase">
                                Closed
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground md:hidden">
                            {ilt.isDone ? "Submitted" : ilt.isLocked ? "Deadline Passed" : `Due: ${ilt.dueDate}`}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground hidden md:inline">
                        {ilt.isDone ? "Submitted" : ilt.isLocked ? "Deadline Passed" : `Due: ${ilt.dueDate}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload Area */}
              <div className="space-y-3">
                <Label className="text-foreground font-semibold text-lg">
                  Upload Your Work
                </Label>

                {!uploadedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300",
                      isDragging
                        ? "border-accent bg-accent/10 scale-[1.02]"
                        : "border-border hover:border-accent/50 hover:bg-muted/30"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground">
                          {isDragging ? "Drop your file here!" : "Drag & drop your file here"}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          or <span className="text-accent font-medium">browse</span> to upload
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" /> PDF
                        </span>
                        <span className="flex items-center gap-1">
                          <Image className="w-4 h-4" /> Images
                        </span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-accent rounded-2xl p-4 bg-accent/5">
                    <div className="flex items-start gap-4">
                      {/* Preview/Icon */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-primary" />
                        )}
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-accent">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Ready to submit</span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={removeFile}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Submit button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedILT || !uploadedFile || isSubmitting}
                  className="btn-gold flex-1 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Submit & Earn +50 Points
                    </span>
                  )}
                </Button>
              </div>

              {/* Points reminder */}
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-[var(--shadow-gold)]">
                  🏆
                </div>
                <div>
                  <p className="font-medium text-foreground">Earn rewards for every submission!</p>
                  <p className="text-sm text-muted-foreground">
                    Submit on time to maintain your streak and unlock bonus badges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submissions History / Grades */}
          {submissions.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="section-title text-2xl">My Submissions</h2>

                {/* Sorting Controls */}
                <div className="flex gap-2">
                  {/* Filter Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:bg-muted transition-colors">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{filterStatus === 'all' ? 'All' : filterStatus}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-xl shadow-xl p-1 hidden group-hover:block z-20">
                      {(['all', 'graded', 'pending'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors capitalize",
                            filterStatus === status && "bg-accent/10 text-accent font-medium"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Button */}
                  <button
                    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                    title={sortOrder === 'newest' ? "Newest First" : "Oldest First"}
                  >
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <span className="hidden sm:inline">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {paginatedSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground card-elevated">
                    <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No submissions match your filter.</p>
                  </div>
                ) : (
                  paginatedSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="card-elevated p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                          submission.status === 'graded' ? "bg-green-500/20 text-green-600" :
                            submission.status === 'reviewed' ? "bg-accent/20 text-accent" :
                              "bg-muted text-muted-foreground"
                        )}>
                          {submission.status === 'graded' ? <CheckCircle className="w-6 h-6" /> :
                            submission.status === 'reviewed' ? <Eye className="w-6 h-6" /> :
                              <Clock className="w-6 h-6" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-foreground">{submission.ilt_name}</h3>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                              submission.status === 'graded' ? "bg-green-500/10 text-green-600" :
                                submission.status === 'reviewed' ? "bg-accent/10 text-accent" :
                                  "bg-yellow-500/10 text-yellow-600"
                            )}>
                              {submission.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {submission.file_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {format(new Date(submission.submitted_at), "MMM d, yyyy • h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Grade Section */}
                      {submission.grade ? (
                        <div className="flex items-center gap-6 w-full md:w-auto bg-muted/30 p-3 rounded-xl border border-border/50">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Grade</p>
                            <p className="text-2xl font-black text-green-600 leading-none">{submission.grade}</p>
                          </div>
                          <div className="w-px h-8 bg-border/50"></div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Points</p>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4 text-accent" />
                              <span className="text-xl font-bold text-accent leading-none">+{submission.points_awarded}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg text-sm w-full md:w-auto justify-center">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Waiting for grade...</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSubmissions.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubmissions.length)} of {filteredSubmissions.length}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="flex items-center px-4 font-medium text-sm bg-muted/30 rounded-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubmitILT;
