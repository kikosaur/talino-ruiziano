import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, Tag, Calendar as CalendarIcon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

const BulletinsTab = () => {
    const { data: bulletins, isLoading } = usePublicContent("bulletin");
    const addMutation = useAddPublicContent();
    const updateMutation = useUpdatePublicContent();
    const deleteMutation = useDeletePublicContent();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBulletin, setEditingBulletin] = useState<PublicContent | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Announcement",
        icon: "📢",
        date: new Date().toISOString().split('T')[0], // format YYYY-MM-DD for input
        pinned: false,
    });

    const handleOpenDialog = (bulletin?: PublicContent) => {
        if (bulletin) {
            setEditingBulletin(bulletin);
            setFormData({
                title: bulletin.title,
                description: bulletin.description || "",
                category: bulletin.metadata?.category || "Announcement",
                icon: bulletin.metadata?.icon || "📢",
                date: bulletin.metadata?.date ? new Date(bulletin.metadata.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                pinned: !!bulletin.metadata?.pinned,
            });
        } else {
            setEditingBulletin(null);
            setFormData({
                title: "",
                description: "",
                category: "Announcement",
                icon: "📢",
                date: new Date().toISOString().split('T')[0],
                pinned: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title) return;

        const metadata = {
            category: formData.category,
            icon: formData.icon,
            date: new Date(formData.date).toISOString(), // Convert back to full ISO string
            pinned: formData.pinned,
        };

        if (editingBulletin) {
            await updateMutation.mutateAsync({
                id: editingBulletin.id,
                type: "bulletin",
                title: formData.title,
                description: formData.description,
                metadata,
            });
        } else {
            await addMutation.mutateAsync({
                type: "bulletin",
                title: formData.title,
                description: formData.description,
                metadata,
            });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this bulletin?")) {
            await deleteMutation.mutateAsync({ id, type: "bulletin" });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    // Sort bulletins: Pinned first, then by date descending
    const sortedBulletins = [...(bulletins || [])].sort((a, b) => {
        const aPinned = a.metadata?.pinned;
        const bPinned = b.metadata?.pinned;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;

        const dateA = a.metadata?.date ? new Date(a.metadata.date).getTime() : 0;
        const dateB = b.metadata?.date ? new Date(b.metadata.date).getTime() : 0;
        return dateB - dateA;
    });


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-serif text-foreground">Manage Bulletins</h3>
                <Button onClick={() => handleOpenDialog()} className="btn-gold">
                    <Plus className="w-4 h-4 mr-2" /> Add Bulletin
                </Button>
            </div>

            <div className="grid gap-4">
                {sortedBulletins.map((bulletin) => (
                    <div key={bulletin.id} className={`card-elevated p-6 transition-all ${bulletin.metadata?.pinned ? 'border-l-4 border-l-accent' : ''}`}>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                {bulletin.metadata?.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {bulletin.metadata?.pinned && (
                                                <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                    📌 Pinned
                                                </span>
                                            )}
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600">
                                                <Tag className="w-3 h-3 inline mr-1" />
                                                {bulletin.metadata?.category}
                                            </span>
                                        </div>
                                        <h4 className="font-bold font-serif text-lg">{bulletin.title}</h4>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenDialog(bulletin)} className="text-muted-foreground hover:text-accent transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(bulletin.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 mb-3">
                                    <CalendarIcon className="w-3 h-3" />
                                    {bulletin.metadata?.date ? format(new Date(bulletin.metadata.date), "MMMM d, yyyy") : 'No Date'}
                                </div>
                                <p className="text-sm text-muted-foreground">{bulletin.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingBulletin ? "Edit Bulletin" : "Add New Bulletin"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Bulletin Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Content</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="e.g. Announcement, Event"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="icon">Emoji Icon</Label>
                                    <Input
                                        id="icon"
                                        className="w-20"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="pinned"
                                    checked={formData.pinned}
                                    onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
                                />
                                <Label htmlFor="pinned">Pin to Top</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={addMutation.isPending || updateMutation.isPending} className="btn-gold">
                            {addMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Bulletin"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BulletinsTab;
