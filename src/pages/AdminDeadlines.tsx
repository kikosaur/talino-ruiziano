import { useState } from "react";
import { format } from "date-fns";
import {
    Calendar,
    Plus,
    Pencil,
    Trash2,
    Clock,
    FileText,
    Save,
    X,
    RotateCcw,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useILTDeadlines, ILTDeadline } from "@/hooks/useILTDeadlines";
import { cn } from "@/lib/utils";

const AdminDeadlines = () => {
    const {
        deadlines,
        isLoading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        resetToDefaults,
    } = useILTDeadlines();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        description: "",
        deadline: "",
    });

    const resetForm = () => {
        setFormData({ name: "", subject: "", description: "", deadline: "" });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            name: "",
            subject: "",
            description: "",
            deadline: format(new Date(), "yyyy-MM-dd"),
        });
    };

    const handleEdit = (deadline: ILTDeadline) => {
        setEditingId(deadline.id);
        setIsAdding(false);
        setFormData({
            name: deadline.name,
            subject: deadline.subject || "General",
            description: deadline.description,
            deadline: format(new Date(deadline.deadline), "yyyy-MM-dd"),
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.deadline) return;

        if (isAdding) {
            await addDeadline(formData.name, formData.subject || "General", formData.description, new Date(formData.deadline));
        } else if (editingId) {
            await updateDeadline(editingId, {
                name: formData.name,
                subject: formData.subject || "General",
                description: formData.description,
                deadline: new Date(formData.deadline).toISOString(),
            });
        }

        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this deadline?")) {
            await deleteDeadline(id);
        }
    };

    const handleReset = async () => {
        if (confirm("Reset all deadlines to defaults? This will remove any custom deadlines.")) {
            await resetToDefaults();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <p className="text-muted-foreground">Loading deadlines...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="section-title text-3xl flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-accent" />
                            Manage ILT Deadlines
                        </h1>
                        <p className="text-muted-foreground">
                            Set and manage ILT deadlines that sync with student calendars
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset} className="gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                        <Button onClick={handleAdd} className="btn-gold gap-2">
                            <Plus className="w-4 h-4" />
                            Add Deadline
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="card-elevated p-6 border-2 border-accent/50">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            {isAdding ? (
                                <>
                                    <Plus className="w-5 h-5 text-accent" />
                                    Add New Deadline
                                </>
                            ) : (
                                <>
                                    <Pencil className="w-5 h-5 text-accent" />
                                    Edit Deadline
                                </>
                            )}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    ILT Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., ILT Week 6: Results Discussion"
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="e.g., Research, History"
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Due Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of this ILT assignment..."
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleSave} className="btn-gold gap-2">
                                <Save className="w-4 h-4" />
                                Save Deadline
                            </Button>
                            <Button variant="outline" onClick={resetForm} className="gap-2">
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Deadlines List */}
                <div className="card-elevated p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Current Deadlines ({deadlines.length})
                    </h3>

                    {deadlines.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No deadlines set</p>
                            <p className="text-sm">Click "Add Deadline" to create one</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {deadlines.map((deadline) => {
                                const dueDate = new Date(deadline.deadline);
                                const isPast = dueDate < new Date();

                                return (
                                    <div
                                        key={deadline.id}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border transition-all",
                                            editingId === deadline.id
                                                ? "border-accent bg-accent/10"
                                                : isPast
                                                    ? "border-muted bg-muted/30"
                                                    : "border-border bg-card hover:border-accent/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                                    isPast ? "bg-muted" : "bg-accent/20"
                                                )}
                                            >
                                                <Clock
                                                    className={cn(
                                                        "w-6 h-6",
                                                        isPast ? "text-muted-foreground" : "text-accent"
                                                    )}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p
                                                        className={cn(
                                                            "font-medium truncate",
                                                            isPast ? "text-muted-foreground" : "text-foreground"
                                                        )}
                                                    >
                                                        {deadline.name}
                                                    </p>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium uppercase tracking-wider">
                                                        {deadline.subject || "General"}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {deadline.description || "No description"}
                                                </p>
                                                <p
                                                    className={cn(
                                                        "text-xs mt-1",
                                                        isPast ? "text-muted-foreground" : "text-accent"
                                                    )}
                                                >
                                                    Due: {format(dueDate, "MMMM d, yyyy")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(deadline)}
                                                className="hover:bg-accent/20"
                                            >
                                                <Pencil className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(deadline.id)}
                                                className="hover:bg-destructive/20"
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            Deadlines sync automatically
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Changes made here will immediately reflect in the student Study Calendar
                            and ILT submission page.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminDeadlines;
