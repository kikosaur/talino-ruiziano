import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Award, Loader2 } from "lucide-react";
import { useAdminBadges } from "@/hooks/useAdminBadges";
import { Badge } from "@/hooks/useBadges";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AdminBadges = () => {
    const { badges, isLoading, addBadge, updateBadge, deleteBadge } = useAdminBadges();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        icon: "🏅",
        description: "",
        required_points: "",
        required_submissions: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            icon: "🏅",
            description: "",
            required_points: "",
            required_submissions: "",
        });
        setEditingBadge(null);
    };

    const handleOpenDialog = (badge?: Badge) => {
        if (badge) {
            setEditingBadge(badge);
            setFormData({
                name: badge.name,
                icon: badge.icon,
                description: badge.description,
                required_points: badge.required_points?.toString() || "",
                required_submissions: badge.required_submissions?.toString() || "",
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    const handleSave = async () => {
        if (!formData.name || !formData.description) {
            toast({
                title: "Missing Fields",
                description: "Name and description are required.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: formData.name,
            icon: formData.icon || "🏅",
            description: formData.description,
            required_points: formData.required_points ? parseInt(formData.required_points) : null,
            required_submissions: formData.required_submissions ? parseInt(formData.required_submissions) : null,
        };

        let success = false;
        if (editingBadge) {
            success = await updateBadge(editingBadge.id, payload);
        } else {
            success = await addBadge(payload);
        }

        setIsSubmitting(false);
        if (success) {
            handleCloseDialog();
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this badge? This action cannot be undone.")) {
            await deleteBadge(id);
        }
    };

    if (isLoading && badges.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="section-title text-3xl">Manage Badges</h1>
                    <p className="text-muted-foreground mt-2">
                        Create and manage achievements that students can unlock.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="btn-gold flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Badge
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                {badges.map((badge) => (
                    <div key={badge.id} className="card-elevated p-6 flex flex-col h-full relative group">
                        <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                            <button
                                onClick={() => handleOpenDialog(badge)}
                                className="p-2 bg-background/80 hover:bg-accent/20 rounded-lg text-foreground hover:text-accent transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(badge.id)}
                                className="p-2 bg-background/80 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-5xl mb-4 flex justify-center">{badge.icon}</div>

                        <h3 className="text-xl font-bold text-foreground text-center mb-2">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground text-center mb-6 flex-grow">{badge.description}</p>

                        <div className="space-y-2 mt-auto text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Req. Points:</span>
                                <span className="text-foreground font-bold">{badge.required_points || "None"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Req. Submissions:</span>
                                <span className="text-foreground font-bold">{badge.required_submissions || "None"}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {badges.length === 0 && (
                    <div className="col-span-full card-elevated p-12 text-center flex flex-col items-center">
                        <Award className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-xl font-bold text-foreground mb-2">No Badges Found</h3>
                        <p className="text-muted-foreground mb-6">You haven't created any custom badges yet.</p>
                        <Button onClick={() => handleOpenDialog()} variant="outline">
                            Create First Badge
                        </Button>
                    </div>
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingBadge ? "Edit Badge" : "Create New Badge"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right font-medium">
                                Icon
                            </Label>
                            <Input
                                id="icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="col-span-1 text-center"
                                placeholder="🏅"
                            />
                            <p className="col-span-2 text-xs text-muted-foreground">Use an emoji (e.g. 🏆, 🌟, 🚀)</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name" className="font-medium">
                                Badge Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="E.g., High Achiever"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What is this badge awarded for?"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="required_points" className="font-medium text-xs">
                                    Required Points
                                </Label>
                                <Input
                                    id="required_points"
                                    type="number"
                                    value={formData.required_points}
                                    onChange={(e) => setFormData({ ...formData, required_points: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="required_submissions" className="font-medium text-xs">
                                    Req. Submissions
                                </Label>
                                <Input
                                    id="required_submissions"
                                    type="number"
                                    value={formData.required_submissions}
                                    onChange={(e) => setFormData({ ...formData, required_submissions: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSubmitting} className="btn-gold">
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingBadge ? "Save Changes" : "Create Badge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBadges;
