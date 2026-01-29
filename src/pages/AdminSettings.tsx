import { useState } from "react";
import { Settings, Save, AlertCircle, Calendar, GraduationCap } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
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

const AdminSettings = () => {
    const { toast } = useToast();
    const [academicYear, setAcademicYear] = useState("2025-2026");
    const [semester, setSemester] = useState("First Semester");
    const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: "Settings Saved",
            description: "Application configuration has been updated.",
        });
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />

            <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
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
                        <TabsList className="grid w-full grid-cols-3 max-w-md">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="system">System</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Class Information</CardTitle>
                                    <CardDescription>
                                        Basic details about the class environment.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="class-name">Class Name</Label>
                                        <Input id="class-name" defaultValue="BSIT Capstone Project" className="input-warm" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="instructor">Instructor Name</Label>
                                        <Input id="instructor" defaultValue="Prof. Dela Cruz" className="input-warm" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" defaultValue="Capstone project management and submission system." className="input-warm" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSave} disabled={isSaving} className="btn-gold ml-auto">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="academic" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Academic Configuration</CardTitle>
                                    <CardDescription>
                                        Manage grading periods and submission policies.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="year">Academic Year</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="year"
                                                    value={academicYear}
                                                    onChange={(e) => setAcademicYear(e.target.value)}
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
                                                    value={semester}
                                                    onChange={(e) => setSemester(e.target.value)}
                                                    className="pl-9 input-warm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-muted/20">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Allow Late Submissions</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Students can upload files after the deadline (marked as late).
                                            </p>
                                        </div>
                                        <Switch
                                            checked={allowLateSubmissions}
                                            onCheckedChange={setAllowLateSubmissions}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSave} disabled={isSaving} className="btn-gold ml-auto">
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="system" className="mt-6">
                            <Card className="border-destructive/20">
                                <CardHeader>
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                    <CardDescription>
                                        Advanced system controls. Proceed with caution.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between space-x-2 border border-destructive/20 p-4 rounded-lg bg-destructive/5">
                                        <div className="space-y-0.5">
                                            <Label className="text-base text-destructive flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Maintenance Mode
                                            </Label>
                                            <p className="text-sm text-destructive/80">
                                                Disable access for students temporarily.
                                            </p>
                                        </div>
                                        <Switch
                                            checked={maintenanceMode}
                                            onCheckedChange={setMaintenanceMode}
                                            className="data-[state=checked]:bg-destructive"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="destructive" onClick={handleSave} disabled={isSaving} className="ml-auto">
                                        {isSaving ? "Saving..." : "Save System Settings"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
