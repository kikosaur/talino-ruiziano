import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { user, isTeacher } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const homeRoute = user ? (isTeacher ? "/admin" : "/dashboard") : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="btn-gold">
          <Link to={homeRoute}>
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
