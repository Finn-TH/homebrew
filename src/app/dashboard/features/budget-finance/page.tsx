import { createClient } from "@/utils/supabase/server";

export default async function BudgetFinancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user?.id);

  return (
    <div className="relative mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">
        Budget & Finance
      </h1>
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        <p className="text-[#A0522D]">
          Track your expenses and savings here...
        </p>
      </div>
    </div>
  );
}
