import { createClient } from "@/utils/supabase/server";

export default async function MentalHealthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: journals } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">
        Mental Health Journal
      </h1>
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        <p className="text-[#A0522D]">Write your daily reflections here...</p>
      </div>
    </div>
  );
}
