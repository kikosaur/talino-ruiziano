import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setIsSubmitted(true);
            toast({
                title: "Check your email",
                description: "We've sent you a password reset link.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Form Side */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-background relative">
                <div className="w-full max-w-md mx-auto space-y-8">
                    {/* Back Link */}
                    <Link
                        to="/login"
                        className="absolute top-8 left-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    {/* Header */}
                    <div className="space-y-2 text-center lg:text-left pt-12 lg:pt-0">
                        <h1 className="text-3xl font-bold font-serif tracking-tight">
                            Forgot password?
                        </h1>
                        <p className="text-muted-foreground">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 input-warm"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-gold h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending link...
                                    </>
                                ) : (
                                    "Reset password"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Check your email</h3>
                                <p className="text-muted-foreground text-sm mt-1">
                                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Try another email
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-sm">
                        Remember your password?{" "}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Decoration Side */}
            <div className="hidden lg:flex relative bg-foreground items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent"></div>

                <div className="relative z-10 p-12 text-background max-w-lg text-center">
                    <div className="w-20 h-20 bg-background/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                        <KeyRound className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-3xl font-bold font-serif mb-6">
                        Secure & Recoverable
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed">
                        Your security is our priority. We use industry-standard encryption to keep your account safe while ensuring you can easily recover access when needed.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
