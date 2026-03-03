import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  streak_days: number;
  level: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isTeacher: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ data: any; error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Run both queries concurrently to reduce loading time
      const [profileResponse, roleResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle()
      ]);

      if (profileResponse.error) {
        console.error("Error fetching profile:", profileResponse.error);
        return;
      }

      setProfile(profileResponse.data);

      if (roleResponse.error) {
        console.error("Error fetching role:", roleResponse.error);
        return;
      }

      const role = roleResponse.data?.role as string;
      setIsTeacher(role === "teacher" || role === "admin");
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    let isInitialized = false;

    const resolveAuth = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        if (mounted) {
          setProfile(null);
          setIsTeacher(false);
        }
      }

      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        isInitialized = true;
      }
    };

    // 1. Fetch initial session explicitly as a fallback
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (mounted && !isInitialized) {
        resolveAuth(existingSession);
      }
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        if (event === 'INITIAL_SESSION') {
          resolveAuth(currentSession);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          resolveAuth(currentSession);
        } else if (event === 'SIGNED_OUT') {
          resolveAuth(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsTeacher(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isTeacher,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
