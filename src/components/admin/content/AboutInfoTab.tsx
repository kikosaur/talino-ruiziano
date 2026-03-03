import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
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

const ContentSection = ({ type, title }: { type: string, title: string }) => {
    const { data: items, isLoading } = usePublicContent(type);
    const addMutation = useAddPublicContent();
    const updateMutation = useUpdatePublicContent();
    const deleteMutation = useDeletePublicContent();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

    const handleEdit = (item: PublicContent) => {
        setEditingId(item.id);
        setFormData({
            title: item.title,
            description: item.description || "",
            icon: item.metadata?.icon || ""
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ title: "", description: "", icon: "" });
    };

    const handleSave = async (id?: string) => {
        if (!formData.title) return;

        if (id) {
            await updateMutation.mutateAsync({
                id,
                type,
                title: formData.title,
                description: formData.description,
                metadata: { icon: formData.icon }
            });
        } else {
            await addMutation.mutateAsync({
                type,
                title: formData.title,
                description: formData.description,
                metadata: { icon: formData.icon }
            });
        }
        handleCancel();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this item?")) {
            await deleteMutation.mutateAsync({ id, type });
        }
    };

    if (isLoading) return <div className="py-4"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

    return (
        <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg border-b pb-2">{title}</h4>

            <div className="grid gap-3">
                {items?.map(item => (
                    <div key={item.id} className="card-elevated p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {editingId === item.id ? (
                            <div className="flex-1 w-full grid gap-2">
                                <div className="flex gap-2">
                                    <Input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="flex-1" />
                                    <Input placeholder="Icon Name" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-32" />
                                </div>
                                <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="h-20" />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                                    <Button size="sm" onClick={() => handleSave(item.id)} className="btn-gold">Save</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0 text-xs">
                                    {item.metadata?.icon || 'Icon'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-muted-foreground hover:text-accent"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {editingId === 'new' ? (
                    <div className="card-elevated p-4 grid gap-2 border-2 border-accent border-dashed">
                        <div className="flex gap-2">
                            <Input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="flex-1" />
                            <Input placeholder="Icon Name (e.g. Users, Mail)" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-48" />
                        </div>
                        <Textarea placeholder="Description/Content" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="h-20" />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                            <Button size="sm" onClick={() => handleSave()} className="btn-gold">Save New</Button>
                        </div>
                    </div>
                ) : (
                    <Button variant="outline" className="border-dashed w-full" onClick={() => { setEditingId('new'); setFormData({ title: '', description: '', icon: '' }); }}>
                        <Plus className="w-4 h-4 mr-2" /> Add New Item
                    </Button>
                )}
            </div>
        </div>
    );
};

const AboutInfoTab = () => {
    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-muted p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                    Edit the content that appears on the <strong>About Us</strong> page. Icon names should match Lucide React icons (e.g. `Users`, `Award`, `MapPin`).
                </p>
            </div>

            <ContentSection type="about_stat" title="School Statistics" />
            <ContentSection type="about_value" title="Core Values" />
            <ContentSection type="about_contact" title="Contact Information" />
        </div>
    );
};

export default AboutInfoTab;
