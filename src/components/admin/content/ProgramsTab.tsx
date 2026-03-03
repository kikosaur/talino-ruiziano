import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, BookOpen, Clock, Users } from "lucide-react";
import {
    usePublicContent,
    useAddPublicContent,
    useUpdatePublicContent,
    useDeletePublicContent,
    PublicContent
} from "@/hooks/usePublicContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ProgramsTab = () => {
    const { data: programs, isLoading } = usePublicContent("program");
    const addMutation = useAddPublicContent();
    const updateMutation = useUpdatePublicContent();
    const deleteMutation = useDeletePublicContent();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<PublicContent | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "📚",
        duration: "",
        students: "",
        courses: "", // Comma separated string for form handling
    });

    const handleOpenDialog = (program?: PublicContent) => {
        if (program) {
            setEditingProgram(program);
            setFormData({
                title: program.title,
                description: program.description || "",
                icon: program.metadata?.icon || "📚",
                duration: program.metadata?.duration || "",
                students: program.metadata?.students || "",
                courses: (program.metadata?.courses || []).join(", "),
            });
        } else {
            setEditingProgram(null);
            setFormData({
                title: "",
                description: "",
                icon: "📚",
                duration: "",
                students: "",
                courses: "",
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title) return;

        const metadata = {
            icon: formData.icon,
            duration: formData.duration,
            students: formData.students,
            courses: formData.courses.split(",").map(c => c.trim()).filter(Boolean),
        };

        if (editingProgram) {
            await updateMutation.mutateAsync({
                id: editingProgram.id,
                type: "program",
                title: formData.title,
                description: formData.description,
                metadata,
            });
        } else {
            await addMutation.mutateAsync({
                type: "program",
                title: formData.title,
                description: formData.description,
                metadata,
            });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this program?")) {
            await deleteMutation.mutateAsync({ id, type: "program" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-serif text-foreground">Manage Academic Programs</h3>
                <Button onClick={() => handleOpenDialog()} className="btn-gold">
                    <Plus className="w-4 h-4 mr-2" /> Add Program
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs?.map((program) => (
                    <div key={program.id} className="card-elevated p-6 flex flex-col items-start gap-4">
                        <div className="flex items-start justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                    {program.metadata?.icon}
                                </div>
                                <h4 className="font-bold font-serif text-lg">{program.title}</h4>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenDialog(program)} className="text-muted-foreground hover:text-accent transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(program.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {program.metadata?.duration}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {program.metadata?.students} students</span>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingProgram ? "Edit Program" : "Add New Program"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Program Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Senior High School - STEM"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief overview of the program..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Emoji Icon</Label>
                                <Input
                                    id="icon"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="e.g. 2 Years"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="students">Estimated Students</Label>
                            <Input
                                id="students"
                                value={formData.students}
                                onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                placeholder="e.g. 200+"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="courses">Key Subjects (Comma Separated)</Label>
                            <Textarea
                                id="courses"
                                value={formData.courses}
                                onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                                placeholder="e.g. Mathematics, Science, English"
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={addMutation.isPending || updateMutation.isPending} className="btn-gold">
                            {addMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Program"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProgramsTab;
