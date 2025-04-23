"use client";

import { useEffect, useState } from "react";

export default function DemoBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_CHATBOT === "true") {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="bg-[#FFF5E1] text-[#8B4513] text-sm font-medium px-4 py-2 text-center border-b border-[#E0C3A0] shadow-sm animate-fade-in-down"
    >
      ☕ This is a demo mode — read-only, with AI features disabled. Explore safely!
    </div>
  );
}
