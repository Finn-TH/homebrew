import TodoListServer from "./server/todo-list-server";
import AddTodoButton from "./components/add-todo/add-todo-button";
import FeatureLayout from "../../components/layout/feature-layout";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todo List | Homebrew",
  description: "Manage your tasks efficiently with Homebrew Todo List",
};

export default async function TodoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return (
    <FeatureLayout user={user} title="Todo List">
      <div className="space-y-6">
        <AddTodoButton />
        <TodoListServer />
      </div>
    </FeatureLayout>
  );
}
