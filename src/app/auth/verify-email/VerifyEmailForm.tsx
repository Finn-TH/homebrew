"use client";

import { Coffee, Mail, Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resendVerificationEmail } from "@/app/actions/auth";

const getEmailProviderLink = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();

  const providers = {
    "gmail.com": "https://mail.google.com",
    "outlook.com": "https://outlook.live.com",
    "hotmail.com": "https://outlook.live.com",
    "yahoo.com": "https://mail.yahoo.com",
    "icloud.com": "https://www.icloud.com/mail",
    "proton.me": "https://mail.proton.me",
    "protonmail.com": "https://mail.proton.me",
  };

  return providers[domain as keyof typeof providers];
};

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const urlEmail = searchParams.get("email");
    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      const storedEmail = localStorage.getItem("verificationEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email || countdown > 0) return;

    try {
      setIsResending(true);
      setResendStatus("idle");
      await resendVerificationEmail(email);
      setResendStatus("success");
      setCountdown(60);
    } catch (error: any) {
      setResendStatus("error");
      if (error.message?.includes("after")) {
        const seconds = error.message.match(/\d+/)?.[0];
        if (seconds) {
          setCountdown(Number(seconds));
        }
      }
      console.error("Failed to resend:", error);
    } finally {
      setIsResending(false);
    }
  };

  const emailProviderLink = email ? getEmailProviderLink(email) : null;

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
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Coffee className="w-16 h-16 text-[#8B4513]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-1 -top-1"
            >
              <Mail className="w-6 h-6 text-[#8B4513]" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#8B4513]">Check your email</h2>
            <p className="text-[#A0522D]/60">
              We've sent you an email with a confirmation link. Please check your inbox and click the link to verify your account.
            </p>
          </div>

          {emailProviderLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href={emailProviderLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Open Email Provider
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-2 text-[#8B4513]/60">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Waiting for confirmation...</span>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-sm text-[#A0522D]/60">Didn't receive the email?</p>
            <div className="space-y-2">
              <button
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                className="text-sm text-[#8B4513] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Resending...
                  </span>
                ) : countdown > 0 ? (
                  <span className="text-[#A0522D]/60">Resend available in {countdown}s</span>
                ) : (
                  "Click here to resend"
                )}
              </button>

              {resendStatus === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-600"
                >
                  Verification email resent successfully!
                </motion.p>
              )}

              {resendStatus === "error" && countdown === 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  Failed to resend. Please try again.
                </motion.p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-[#8B4513]/10">
            <Link href="/" className="text-sm text-[#8B4513] hover:underline">
              Return to home page
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
