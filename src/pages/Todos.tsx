import TodoList from "@/components/dashboard/TodoList";
import { CheckSquare } from "lucide-react";

const Todos = () => {
    return (
        <div className="min-h-screen bg-background">

            <main className="ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="section-title text-3xl flex items-center gap-3">
                            <CheckSquare className="w-8 h-8 text-secondary" />
                            My To-Do List
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your study tasks and stay organized!
                        </p>
                    </div>

                    {/* Todo List Component */}
                    {/* We reuse the component but might want to style it slightly differently for full page? 
              For now, just render it. It's designed as a card. */}
                    <TodoList />
                </div>
            </main>
        </div>
    );
};

export default Todos;
