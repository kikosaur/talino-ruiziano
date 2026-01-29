import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import StudentLayout from "@/layouts/StudentLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SubmitILT from "./pages/SubmitILT";
import StudyCalendar from "./pages/StudyCalendar";
import Todos from "./pages/Todos";
import StudentSettings from "./pages/StudentSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminDeadlines from "./pages/AdminDeadlines";
import AdminStudents from "./pages/AdminStudents";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import Programs from "./pages/Programs";
import About from "./pages/About";
import Bulletin from "./pages/Bulletin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Analytics Tracker Component
const PageTracker = () => {
  const location = useLocation();
  const { logEvent } = useAnalytics();

  useEffect(() => {
    // Log page view on route change
    logEvent("view_page", { path: location.pathname });
  }, [location.pathname, logEvent]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/about" element={<About />} />
            <Route path="/bulletin" element={<Bulletin />} />
            {/* Dashboard Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="submit" element={<SubmitILT />} />
              <Route path="calendar" element={<StudyCalendar />} />
              <Route path="todos" element={<Todos />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>
            {/* Admin Routes with Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireTeacher>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="deadlines" element={<AdminDeadlines />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
