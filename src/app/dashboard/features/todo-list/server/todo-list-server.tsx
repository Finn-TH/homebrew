import { createClient } from "@/utils/supabase/server";
import TodoListClient from "../client/todo-list-client";
import { Todo } from "../types";

export default async function TodoListServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  // Calculate initial task counts
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = (todos || []).filter(
    (todo) =>
      todo.due_date && new Date(todo.due_date) < today && !todo.completed
  ).length;

  const todayTasks = (todos || []).filter(
    (todo) =>
      todo.due_date &&
      new Date(todo.due_date).toDateString() === today.toDateString() &&
      !todo.completed
  ).length;

  return (
    <TodoListClient
      initialTodos={todos || []}
      initialOverdueTasks={overdueTasks}
      initialTodayTasks={todayTasks}
    />
  );
}
