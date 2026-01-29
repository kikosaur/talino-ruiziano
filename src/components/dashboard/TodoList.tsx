import { useState } from "react";
import { Plus, Trash2, CheckCircle, Circle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/useTodos";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TodoList = () => {
  const { toast } = useToast();
  const { todos, isLoading, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsAdding(true);
    const result = await addTodo(newTodoTitle);
    setIsAdding(false);

    if (result.success) {
      setNewTodoTitle("");
      toast({
        title: "Task Added! ✅",
        description: "Your study task has been added.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (todoId: string, currentStatus: boolean) => {
    const result = await toggleTodo(todoId, !currentStatus);
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (todoId: string) => {
    const result = await deleteTodo(todoId);
    if (result.success) {
      toast({
        title: "Task Deleted",
        description: "The task has been removed.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const completedCount = todos.filter((t) => t.is_completed).length;
  const totalCount = todos.length;

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-foreground">📝 Study Tasks</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{totalCount} done
        </span>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Add todo form */}
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new study task..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="input-warm flex-1"
          disabled={isAdding}
        />
        <Button
          type="submit"
          size="icon"
          className="btn-gold shrink-0"
          disabled={isAdding || !newTodoTitle.trim()}
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </form>

      {/* Todo list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">
            No tasks yet. Add your first study task above!
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                todo.is_completed
                  ? "bg-muted/30 border-muted"
                  : "bg-card border-border hover:border-accent/50"
              )}
            >
              <button
                onClick={() => handleToggle(todo.id, todo.is_completed ?? false)}
                className="shrink-0 transition-colors"
              >
                {todo.is_completed ? (
                  <CheckCircle className="w-5 h-5 text-accent" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-accent" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm transition-all",
                  todo.is_completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
