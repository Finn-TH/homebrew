import FeatureLayout from "@/app/dashboard/components/feature-layout";
import { createClient } from "@/utils/supabase/server";

export default async function TodoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <FeatureLayout user={user} title="Todo List">
      <p className="text-[#A0522D]">Sample todo list content...</p>
    </FeatureLayout>
  );
}
