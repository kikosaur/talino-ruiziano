import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, FileText, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useILTDeadlines } from "@/hooks/useILTDeadlines";
import { cn } from "@/lib/utils";

type DeadlineStatus = "completed" | "upcoming" | "overdue";

interface DeadlineWithStatus {
  name: string;
  deadline: Date;
  status: DeadlineStatus;
  submittedAt?: Date;
}

const statusConfig = {
  completed: {
    label: "Completed",
    icon: CheckCircle,
    bgClass: "bg-green-500/20",
    textClass: "text-green-600",
    borderClass: "border-green-500/30",
    dotClass: "bg-green-500",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    bgClass: "bg-accent/20",
    textClass: "text-accent",
    borderClass: "border-accent/30",
    dotClass: "bg-accent",
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    bgClass: "bg-destructive/20",
    textClass: "text-destructive",
    borderClass: "border-destructive/30",
    dotClass: "bg-destructive",
  },
};

const StudyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const { deadlines: iltDeadlines, isLoading: deadlinesLoading } = useILTDeadlines();

  const isLoading = submissionsLoading || deadlinesLoading;

  // Calculate deadlines with their status
  const deadlinesWithStatus: DeadlineWithStatus[] = useMemo(() => {
    const now = new Date();

    return iltDeadlines.map((ilt) => {
      const deadlineDate = new Date(ilt.deadline);

      // Check if this ILT was submitted
      const submission = submissions.find((s) => s.ilt_name === ilt.name);

      if (submission) {
        return {
          name: ilt.name,
          deadline: deadlineDate,
          status: "completed" as DeadlineStatus,
          submittedAt: new Date(submission.submitted_at),
        };
      } else if (isBefore(deadlineDate, now)) {
        return { name: ilt.name, deadline: deadlineDate, status: "overdue" as DeadlineStatus };
      } else {
        return { name: ilt.name, deadline: deadlineDate, status: "upcoming" as DeadlineStatus };
      }
    });
  }, [submissions, iltDeadlines]);

  // Get days in current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of the week the month starts on (0 = Sunday)
  const startDay = monthStart.getDay();

  // Get deadlines for a specific day
  const getDeadlinesForDay = (day: Date) => {
    return deadlinesWithStatus.filter((d) => isSameDay(d.deadline, day));
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // Stats
  const stats = {
    completed: deadlinesWithStatus.filter((d) => d.status === "completed").length,
    upcoming: deadlinesWithStatus.filter((d) => d.status === "upcoming").length,
    overdue: deadlinesWithStatus.filter((d) => d.status === "overdue").length,
    total: deadlinesWithStatus.length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <main className="ml-20 lg:ml-64 p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-muted-foreground">Loading calendar...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="section-title text-3xl flex items-center gap-3">
                <Calendar className="w-8 h-8 text-accent" />
                Study Calendar
              </h1>
              <p className="text-muted-foreground">
                Track your ILT deadlines and submission progress
              </p>
            </div>
            <Button onClick={goToToday} variant="outline" className="w-fit">
              Today
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total ILTs", value: stats.total, icon: FileText, color: "bg-primary" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-green-500" },
              { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "bg-accent" },
              { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "bg-destructive" },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 card-elevated p-6">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-foreground">
                  {format(currentMonth, "MMMM yyyy")}
                </h2>
                <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {daysInMonth.map((day) => {
                  const dayDeadlines = getDeadlinesForDay(day);
                  const hasDeadlines = dayDeadlines.length > 0;
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "aspect-square p-1 rounded-lg border transition-all",
                        isCurrentDay
                          ? "border-accent bg-accent/10"
                          : "border-transparent hover:border-border",
                        hasDeadlines && "cursor-pointer hover:bg-muted/30"
                      )}
                    >
                      <div className="h-full flex flex-col">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isCurrentDay ? "text-accent" : "text-foreground"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {hasDeadlines && (
                          <div className="flex flex-wrap gap-0.5 mt-auto">
                            {dayDeadlines.slice(0, 3).map((deadline, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  statusConfig[deadline.status].dotClass
                                )}
                                title={deadline.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", config.dotClass)} />
                    <span className="text-sm text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines List */}
            <div className="card-elevated p-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">📅 All Deadlines</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {deadlinesWithStatus.map((deadline, index) => {
                  const config = statusConfig[deadline.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        config.bgClass,
                        config.borderClass
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <StatusIcon className={cn("w-5 h-5 shrink-0 mt-0.5", config.textClass)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {deadline.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due: {format(deadline.deadline, "MMM d, yyyy")}
                          </p>
                          {deadline.submittedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Submitted {format(deadline.submittedAt, "MMM d")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyCalendar;
