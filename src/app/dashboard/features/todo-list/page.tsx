import { createClient } from "@/utils/supabase/server";

export default async function TodoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">Todo List</h1>
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        <p className="text-[#A0522D]">Manage your daily tasks here...</p>
      </div>
    </div>
  );
}
