import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Submission {
  id: string;
  user_id: string;
  ilt_name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  status: "pending" | "reviewed" | "graded";
  points_awarded: number;
  grade: string | null;
  submitted_at: string;
  updated_at: string;
  // Joined from profiles
  student_name?: string;
  student_email?: string;
}

export const useSubmissions = (isTeacherView = false) => {
  const { user, isTeacher } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from("submissions").select("*");

      // Teachers only see their own submissions unless specified
      if (!isTeacherView || !isTeacher) {
        query = query.eq("user_id", user.id);
      }

      const { data, error: fetchError } = await query.order("submitted_at", { ascending: false });

      if (fetchError) throw fetchError;

      // If teacher view, fetch profile info for each submission
      if (isTeacherView && isTeacher && data) {
        const userIds = [...new Set(data.map((s) => s.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, email")
          .in("user_id", userIds);

        const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));

        const enrichedSubmissions = data.map((s) => ({
          ...s,
          student_name: profileMap.get(s.user_id)?.display_name || "Unknown",
          student_email: profileMap.get(s.user_id)?.email || "",
        }));

        setSubmissions(enrichedSubmissions as Submission[]);
      } else {
        setSubmissions((data || []) as Submission[]);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user, isTeacher, isTeacherView]);

  const submitILT = async (
    iltName: string,
    file: File
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("submissions")
        .getPublicUrl(fileName);

      // Create submission record
      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: user.id,
        ilt_name: iltName,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: urlData.publicUrl,
        points_awarded: 50,
      });

      if (insertError) throw insertError;

      // Update user's total points
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ total_points: profile.total_points + 50 })
          .eq("user_id", user.id);
      }

      // Refresh submissions list
      await fetchSubmissions();

      return { success: true };
    } catch (err) {
      console.error("Error submitting ILT:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to submit ILT",
      };
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: "pending" | "reviewed" | "graded",
    grade?: string
  ) => {
    if (!isTeacher) return { success: false, error: "Not authorized" };

    try {
      const { error } = await supabase
        .from("submissions")
        .update({ status, grade: grade || null })
        .eq("id", submissionId);

      if (error) throw error;

      await fetchSubmissions();
      return { success: true };
    } catch (err) {
      console.error("Error updating submission:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update submission",
      };
    }
  };

  return {
    submissions,
    isLoading,
    error,
    fetchSubmissions,
    submitILT,
    updateSubmissionStatus,
  };
};
