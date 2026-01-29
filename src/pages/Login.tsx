import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Get current session and check role
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Check if user is teacher
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      toast({
        title: "Welcome back! 🎓",
        description: "You've been successfully logged in.",
      });

      setIsLoading(false);

      // Log login event explicitly
      // Note: We can't use useAnalytics here easily if it depends on AuthContext which might not be fully updated yet?
      // Actually, we can just insert directly for critical auth events where hook context might be racing.
      try {
        await supabase.from('usage_logs').insert({
          user_id: session.user.id,
          action: 'login',
          details: { role: roleData?.role || 'student', method: 'email' }
        });
      } catch (err) {
        console.error("Failed to log login:", err);
      }

      // Navigate based on role
      if (roleData?.role === "teacher") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setIsLoading(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="w-24 h-24 bg-accent rounded-3xl flex items-center justify-center mx-auto shadow-[var(--shadow-gold)] animate-float">
            <BookOpen className="w-12 h-12 text-accent-foreground" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold text-primary-foreground">
              Talino-Ruiziano
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md mx-auto">
              Your gamified learning journey awaits. Earn points, unlock badges,
              and excel in your studies!
            </p>
          </div>

          {/* Floating badges */}
          <div className="flex justify-center gap-4 mt-8">
            {["🌟", "📚", "🔥", "🏆"].map((emoji, i) => (
              <div
                key={i}
                className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center text-2xl animate-float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/bulb.png"
                alt="Talino Ruiziano Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-serif font-bold text-foreground">
                Talino-Ruiziano
              </span>
            </Link>
          </div>

          <div className="card-elevated p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Welcome Back! 👋
              </h2>
              <p className="text-muted-foreground">
                Sign in to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-warm pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-warm pl-12"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="btn-gold w-full text-lg flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Signing in...</span>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
