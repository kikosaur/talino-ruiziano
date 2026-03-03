import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, Save } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Temporary sub-components for each tab to keep the file manageable
import ProgramsTab from "@/components/admin/content/ProgramsTab";
import BulletinsTab from "@/components/admin/content/BulletinsTab";
import AboutInfoTab from "@/components/admin/content/AboutInfoTab";

const AdminContent = () => {
    return (
        <div className="p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="section-title text-3xl">Public Content Editor</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage the content shown on the public-facing pages (Programs, Bulletin, About).
                    </p>
                </div>

                <Tabs defaultValue="programs" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl">
                        <TabsTrigger value="programs" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Programs</TabsTrigger>
                        <TabsTrigger value="bulletins" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Bulletins</TabsTrigger>
                        <TabsTrigger value="about" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">About Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="programs" className="mt-6">
                        <ProgramsTab />
                    </TabsContent>

                    <TabsContent value="bulletins" className="mt-6">
                        <BulletinsTab />
                    </TabsContent>

                    <TabsContent value="about" className="mt-6">
                        <AboutInfoTab />
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
};

export default AdminContent;
