import { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, Calendar, GraduationCap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useAppSettings } from "@/hooks/useAppSettings";

const AdminSettings = () => {
    const { settings, isLoading, updateSettings } = useAppSettings();
    const [isSaving, setIsSaving] = useState(false);

    // Local state for form inputs, initialized from settings
    const [formData, setFormData] = useState({
        class_name: "",
        instructor_name: "",
        course_description: "",
        academic_year: "",
        semester: "",
        allow_late_submissions: true,
        maintenance_mode: false
    });

    // Sync local state when settings load
    useEffect(() => {
        if (settings) {
            setFormData({
                class_name: settings.class_name,
                instructor_name: settings.instructor_name,
                course_description: settings.course_description,
                academic_year: settings.academic_year,
                semester: settings.semester,
                allow_late_submissions: settings.allow_late_submissions,
                maintenance_mode: settings.maintenance_mode
            });
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        await updateSettings(formData);
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-accent animate-spin" />
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="p-6 lg:p-8 transition-all duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="section-title text-3xl flex items-center gap-3">
                        <Settings className="w-8 h-8 text-accent" />
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure application preferences and class settings.
                    </p>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50 rounded-xl p-1">
                        <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">General</TabsTrigger>
                        <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Academic</TabsTrigger>
                        <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">System</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-6">
                        <Card className="card-elevated border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Class Information</CardTitle>
                                <CardDescription>Basic details about the class environment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="class-name">Class Name</Label>
                                    <Input
                                        id="class-name"
                                        value={formData.class_name}
                                        onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                                        className="input-warm"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="instructor">Instructor Name</Label>
                                    <Input
                                        id="instructor"
                                        value={formData.instructor_name}
                                        onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                                        className="input-warm"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={formData.course_description}
                                        onChange={(e) => setFormData({ ...formData, course_description: e.target.value })}
                                        className="input-warm"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isSaving} className="btn-gold ml-auto shadow-[var(--shadow-gold)] font-bold px-8">
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="academic" className="mt-6">
                        <Card className="card-elevated border-none shadow-xl">
                            <CardHeader>
                                <CardTitle>Academic Configuration</CardTitle>
                                <CardDescription>Manage grading periods and submission policies.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="year">Academic Year</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="year"
                                                value={formData.academic_year}
                                                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                                                className="pl-9 input-warm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="semester">Semester</Label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="semester"
                                                value={formData.semester}
                                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                                className="pl-9 input-warm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between space-x-2 border p-4 rounded-xl bg-muted/20 border-border/50">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold text-foreground">Allow Late Submissions</Label>
                                        <p className="text-sm text-muted-foreground">Students can upload files after the deadline (marked as late).</p>
                                    </div>
                                    <Switch
                                        checked={formData.allow_late_submissions}
                                        onCheckedChange={(c) => setFormData({ ...formData, allow_late_submissions: c })}
                                        className="data-[state=checked]:bg-accent"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isSaving} className="btn-gold ml-auto shadow-[var(--shadow-gold)] font-bold px-8">
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" className="mt-6">
                        <Card className="card-elevated border-2 border-destructive/20 shadow-xl bg-destructive/[0.02]">
                            <CardHeader>
                                <CardTitle className="text-destructive font-bold">Danger Zone</CardTitle>
                                <CardDescription>Advanced system controls. Proceed with caution.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-x-2 border border-destructive/20 p-4 rounded-xl bg-destructive/5">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-destructive font-bold flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Maintenance Mode
                                        </Label>
                                        <p className="text-sm text-destructive/80">Disable access for students temporarily.</p>
                                    </div>
                                    <Switch
                                        checked={formData.maintenance_mode}
                                        onCheckedChange={(c) => setFormData({ ...formData, maintenance_mode: c })}
                                        className="data-[state=checked]:bg-destructive"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" onClick={handleSave} disabled={isSaving} className="ml-auto font-bold px-8">
                                    {isSaving ? "Saving..." : "Save System Settings"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
};

export default AdminSettings;
