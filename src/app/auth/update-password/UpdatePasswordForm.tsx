"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function UpdatePasswordForm() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const validatePassword = () => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (confirmPassword && password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  if (!tokenHash || !type) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
        >
          <div className="text-center space-y-4">
            <Coffee className="mx-auto h-12 w-12 text-[#8B4513] animate-spin-slow" />
            <h2 className="text-2xl font-bold text-[#8B4513]">Invalid Reset Link</h2>
            <p className="text-[#A0522D]/60">This password reset link is invalid or has expired.</p>
            <Link href="/" className="inline-block px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D] transition-colors">
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUpdating(true);

    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as any,
      });
      if (verifyError) throw verifyError;

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      router.push("/?message=Password updated successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-[#8B4513]/5 blur-3xl animate-pulse-slow" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#D2691E]/5 blur-3xl animate-pulse-slow delay-300" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg"
      >
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-16 h-16">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <KeyRound className="w-16 h-16 text-[#8B4513]" />
            </motion.div>
          </div>

          <h2 className="text-2xl font-bold text-[#8B4513]">Update Your Password</h2>
          <p className="text-[#A0522D]/60">Please enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="New Password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-[#8B4513] rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B4513]/60 hover:text-[#8B4513] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Confirm New Password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-[#8B4513] rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B4513]/60 hover:text-[#8B4513] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-sm space-y-1">
              <p className={`text-${password.length >= 6 ? "green" : "gray"}-600`}>
                • At least 6 characters
              </p>
              <p className={`text-${password && confirmPassword && password === confirmPassword ? "green" : "gray"}-600`}>
                • Passwords match
              </p>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isUpdating || !password || !confirmPassword || password !== confirmPassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors disabled:opacity-50"
            >
              {isUpdating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
