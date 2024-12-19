import { createClient } from "@/utils/supabase/server";
import TodoList from "./components/todo-list";
import AddTodoButton from "./components/add-todo/add-todo-button";
import FeatureLayout from "../../components/layout/feature-layout";
import { Todo } from "./types";

export default async function TodoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = (await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })) as { data: Todo[] };

  return (
    <FeatureLayout user={user} title="Todo List">
      <div className="space-y-6">
        <AddTodoButton />
        <TodoList todos={todos || []} />
      </div>
    </FeatureLayout>
  );
}
