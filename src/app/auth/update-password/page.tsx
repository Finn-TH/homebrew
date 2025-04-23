export const dynamic = "force-dynamic"; // 👈 Opt out of prerendering

import { Suspense } from "react";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC] text-[#8B4513] text-xl">
          Loading...
        </div>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
