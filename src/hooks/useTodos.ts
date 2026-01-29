import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setTodos((data || []) as Todo[]);
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const addTodo = async (title: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { error: insertError } = await supabase.from("todos").insert({
        user_id: user.id,
        title: title.trim(),
        is_completed: false,
      });

      if (insertError) throw insertError;

      await fetchTodos();
      return { success: true };
    } catch (err) {
      console.error("Error adding todo:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add todo",
      };
    }
  };

  const toggleTodo = async (
    todoId: string,
    isCompleted: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { error: updateError } = await supabase
        .from("todos")
        .update({ is_completed: isCompleted })
        .eq("id", todoId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      await fetchTodos();
      return { success: true };
    } catch (err) {
      console.error("Error updating todo:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update todo",
      };
    }
  };

  const deleteTodo = async (todoId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    try {
      const { error: deleteError } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      await fetchTodos();
      return { success: true };
    } catch (err) {
      console.error("Error deleting todo:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete todo",
      };
    }
  };

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
};
