export interface Submission {
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

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    studentName: "Juan Dela Cruz",
    studentEmail: "juan@school.edu",
    iltName: "Week 1 - Introduction to Topic",
    fileName: "juan_week1_assignment.pdf",
    fileType: "application/pdf",
    fileSize: 2048000,
    submittedAt: new Date("2024-01-15T10:30:00"),
    status: "graded",
    pointsAwarded: 50,
    grade: "A",
  },
  {
    id: "2",
    studentName: "Maria Santos",
    studentEmail: "maria@school.edu",
    iltName: "Week 1 - Introduction to Topic",
    fileName: "maria_intro_work.pdf",
    fileType: "application/pdf",
    fileSize: 1536000,
    submittedAt: new Date("2024-01-15T14:22:00"),
    status: "graded",
    pointsAwarded: 50,
    grade: "A-",
  },
  {
    id: "3",
    studentName: "Pedro Reyes",
    studentEmail: "pedro@school.edu",
    iltName: "Week 2 - Core Concepts",
    fileName: "pedro_concepts.pdf",
    fileType: "application/pdf",
    fileSize: 3072000,
    submittedAt: new Date("2024-01-22T09:15:00"),
    status: "reviewed",
    pointsAwarded: 50,
  },
  {
    id: "4",
    studentName: "Ana Garcia",
    studentEmail: "ana@school.edu",
    iltName: "Week 2 - Core Concepts",
    fileName: "ana_week2.png",
    fileType: "image/png",
    fileSize: 4096000,
    submittedAt: new Date("2024-01-22T16:45:00"),
    status: "pending",
    pointsAwarded: 50,
  },
  {
    id: "5",
    studentName: "Carlos Mendoza",
    studentEmail: "carlos@school.edu",
    iltName: "Week 3 - Applied Learning",
    fileName: "carlos_applied.pdf",
    fileType: "application/pdf",
    fileSize: 2560000,
    submittedAt: new Date("2024-01-28T11:00:00"),
    status: "pending",
    pointsAwarded: 50,
  },
  {
    id: "6",
    studentName: "Sofia Cruz",
    studentEmail: "sofia@school.edu",
    iltName: "Week 1 - Introduction to Topic",
    fileName: "sofia_intro.pdf",
    fileType: "application/pdf",
    fileSize: 1800000,
    submittedAt: new Date("2024-01-16T08:30:00"),
    status: "graded",
    pointsAwarded: 50,
    grade: "B+",
  },
  {
    id: "7",
    studentName: "Miguel Torres",
    studentEmail: "miguel@school.edu",
    iltName: "Week 3 - Applied Learning",
    fileName: "miguel_project.jpg",
    fileType: "image/jpeg",
    fileSize: 5120000,
    submittedAt: new Date("2024-01-29T13:20:00"),
    status: "reviewed",
    pointsAwarded: 50,
  },
  {
    id: "8",
    studentName: "Isabella Ramos",
    studentEmail: "isabella@school.edu",
    iltName: "Week 2 - Core Concepts",
    fileName: "isabella_concepts.pdf",
    fileType: "application/pdf",
    fileSize: 2200000,
    submittedAt: new Date("2024-01-23T10:10:00"),
    status: "graded",
    pointsAwarded: 50,
    grade: "A",
  },
];

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
