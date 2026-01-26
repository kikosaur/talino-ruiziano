import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import ConfettiEffect from "@/components/dashboard/ConfettiEffect";
import SuccessModal from "@/components/dashboard/SuccessModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

const iltOptions = [
  { id: "week1", name: "Week 1 - Introduction to Topic", dueDate: "Jan 20, 2024" },
  { id: "week2", name: "Week 2 - Core Concepts", dueDate: "Jan 27, 2024" },
  { id: "week3", name: "Week 3 - Applied Learning", dueDate: "Feb 3, 2024" },
  { id: "week4", name: "Week 4 - Practice Exercises", dueDate: "Feb 10, 2024" },
  { id: "week5", name: "Week 5 - Review & Reflection", dueDate: "Feb 17, 2024" },
];

const SubmitILT = () => {
  const [selectedILT, setSelectedILT] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentPoints, setCurrentPoints] = useState(750);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success!
    setIsSubmitting(false);
    setShowConfetti(true);
    setShowSuccess(true);
    setCurrentPoints(prev => prev + 50);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setShowConfetti(false);
    // Reset form
    setSelectedILT("");
    removeFile();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <ConfettiEffect isActive={showConfetti} />
      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        fileName={uploadedFile?.file.name || ""}
        pointsEarned={50}
        newTotal={currentPoints}
      />

      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="section-title text-3xl">Submit ILT</h1>
            <p className="text-muted-foreground text-lg">
              Upload your Independent Learning Task and earn <span className="text-accent font-bold">+50 points</span>!
            </p>
          </div>

          {/* Main form card */}
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
                    onClick={() => setSelectedILT(ilt.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      selectedILT === ilt.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 bg-card"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedILT === ilt.id
                          ? "border-accent bg-accent"
                          : "border-muted-foreground"
                      )}>
                        {selectedILT === ilt.id && (
                          <CheckCircle className="w-3 h-3 text-accent-foreground" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{ilt.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Due: {ilt.dueDate}</span>
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
        </div>
      </main>
    </div>
  );
};

export default SubmitILT;
