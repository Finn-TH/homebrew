// app/auth/verify-email/page.tsx
"use client";

import { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDF6EC] text-[#8B4513] text-xl">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
