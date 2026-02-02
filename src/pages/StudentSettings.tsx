import { useState } from "react";
import { User, Lock, Save, Loader2, Camera, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SessionHistory } from "@/components/profile/SessionHistory";

const StudentSettings = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { toast } = useToast();

    // Profile State
    const [displayName, setDisplayName] = useState(profile?.display_name || "");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Password State
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsUpdatingProfile(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ display_name: displayName })
                .eq("user_id", user.id);

            if (error) throw error;

            await refreshProfile();

            toast({
                title: "Profile Updated",
                description: "Your display name has been updated.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters.",
                variant: "destructive",
            });
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast({
                title: "Password Updated",
                description: "Your password has been changed successfully.",
            });

            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update password.",
                variant: "destructive",
            });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-1">
                        <h1 className="section-title text-3xl flex items-center gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            Account Settings
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your profile details and security preferences.
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {/* Profile Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your public display information.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-6">
                                    {/* Avatar Selection */}
                                    <div className="space-y-4">
                                        <Label>Profile Picture</Label>
                                        <div className="flex items-center gap-6">
                                            {/* Current Avatar Preview */}
                                            <div className="relative group shrink-0">
                                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                                                    {profile?.avatar_url ? (
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt="Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-primary text-3xl font-bold">
                                                            {(profile?.display_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Avatar Options */}
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground mb-3">Choose an avatar:</p>

                                                {/* Single Avatar Grid */}
                                                <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto pr-2">
                                                    {[
                                                        // People (9)
                                                        { style: "avataaars", seed: "Felix" },
                                                        { style: "avataaars", seed: "Aneka" },
                                                        { style: "avataaars", seed: "Jack" },
                                                        { style: "avataaars", seed: "Harper" },
                                                        { style: "avataaars", seed: "Oliver" },
                                                        { style: "avataaars", seed: "Emma" },
                                                        { style: "avataaars", seed: "Liam" },
                                                        { style: "avataaars", seed: "Sophia" },
                                                        { style: "avataaars", seed: "Mia" },
                                                        // Robots (9)
                                                        { style: "bottts", seed: "Bolt" },
                                                        { style: "bottts", seed: "Sparky" },
                                                        { style: "bottts", seed: "Gizmo" },
                                                        { style: "bottts", seed: "Chip" },
                                                        { style: "bottts", seed: "Byte" },
                                                        { style: "bottts", seed: "Nano" },
                                                        { style: "bottts", seed: "Echo" },
                                                        { style: "bottts", seed: "Nova" },
                                                        { style: "bottts", seed: "Atlas" },
                                                        // Pixel Art (9)
                                                        { style: "pixel-art", seed: "Mario" },
                                                        { style: "pixel-art", seed: "Luigi" },
                                                        { style: "pixel-art", seed: "Peach" },
                                                        { style: "pixel-art", seed: "Link" },
                                                        { style: "pixel-art", seed: "Sonic" },
                                                        { style: "pixel-art", seed: "Kirby" },
                                                        { style: "pixel-art", seed: "Pikachu" },
                                                        { style: "pixel-art", seed: "Squirtle" },
                                                        { style: "pixel-art", seed: "Eevee" },
                                                        // Fun Emoji (9)
                                                        { style: "fun-emoji", seed: "happy" },
                                                        { style: "fun-emoji", seed: "cool" },
                                                        { style: "fun-emoji", seed: "smile" },
                                                        { style: "fun-emoji", seed: "party" },
                                                        { style: "fun-emoji", seed: "star" },
                                                        { style: "fun-emoji", seed: "fire" },
                                                        { style: "fun-emoji", seed: "rocket" },
                                                        { style: "fun-emoji", seed: "sparkle" },
                                                        { style: "fun-emoji", seed: "heart" },
                                                    ].map((avatar, index) => {
                                                        const avatarUrl = `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}`;
                                                        const isSelected = profile?.avatar_url === avatarUrl;

                                                        return (
                                                            <button
                                                                key={`${avatar.style}-${avatar.seed}-${index}`}
                                                                type="button"
                                                                onClick={async () => {
                                                                    if (!user) return;
                                                                    const { error } = await supabase
                                                                        .from("profiles")
                                                                        .update({ avatar_url: avatarUrl })
                                                                        .eq("user_id", user.id);

                                                                    if (!error) {
                                                                        await refreshProfile();
                                                                        toast({ title: "Avatar Updated", description: "Looking great! ✨" });
                                                                    }
                                                                }}
                                                                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${isSelected ? "border-accent ring-2 ring-accent/30 scale-110" : "border-transparent hover:border-primary/30"}`}
                                                            >
                                                                <img src={avatarUrl} alt={avatar.seed} className="w-full h-full object-cover" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="input-warm"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="bg-muted cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/10 border-t flex justify-end p-4">
                                    <Button
                                        type="submit"
                                        className="btn-gold"
                                        disabled={isUpdatingProfile}
                                    >
                                        {isUpdatingProfile ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Profile
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>

                        {/* Security Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Security
                                </CardTitle>
                                <CardDescription>
                                    Manage your password and account security.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdatePassword}>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="input-warm"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="input-warm"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/10 border-t flex justify-end p-4">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        disabled={isUpdatingPassword}
                                    >
                                        {isUpdatingPassword ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>

                        {/* Session History Section */}
                        <SessionHistory />
                    </div>
                </div>
            </main >
        </div >
    );
};

export default StudentSettings;
