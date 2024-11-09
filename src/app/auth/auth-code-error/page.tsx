"use client";

import { Coffee, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
      {/* Background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-[#8B4513]/5 blur-3xl animate-pulse-slow" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#D2691E]/5 blur-3xl animate-pulse-slow delay-300" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
      >
        <div className="text-center space-y-4">
          <Coffee className="mx-auto h-12 w-12 text-[#8B4513] animate-spin-slow" />
          <h2 className="text-2xl font-bold text-[#8B4513]">
            Authentication Error
          </h2>
          <p className="text-[#A0522D]/60">
            Oops! Looks like we encountered an error.
          </p>
          <p className="text-[#A0522D]/60">Please try again.</p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
