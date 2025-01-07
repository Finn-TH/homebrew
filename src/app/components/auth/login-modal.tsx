"use client";

import { Github, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
} from "@/app/actions/auth";
import Modal from "@/app/components/ui/modal";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleResetPassword = async (email: string) => {
    if (!email) {
      setResetStatus("error");
      return;
    }

    try {
      setIsResetting(true);
      setResetStatus("idle");
      const formData = new FormData();
      formData.append("email", email);
      await resetPassword(formData);
      setResetStatus("success");
    } catch (error) {
      setResetStatus("error");
      console.error("Failed to reset:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isRegister ? "register" : "login"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6 pt-2"
        >
          <div className="text-center space-y-2">
            <motion.h2
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-[#8B4513]"
            >
              {isRegister ? "Create your account" : "Sign in to HomeBrew"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[#A0522D]/60"
            >
              {isRegister
                ? "Join HomeBrew to start brewing"
                : "Welcome back! Please sign in to continue"}
            </motion.p>
          </div>

          {/* Email/Password Form */}
          <motion.form
            action={isRegister ? signUpWithEmail : signInWithEmail}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 border border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
              />
            </div>

            {!isRegister && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    const emailInput = document.getElementById(
                      "email"
                    ) as HTMLInputElement;
                    handleResetPassword(emailInput.value);
                  }}
                  disabled={isResetting}
                  className="text-sm text-[#8B4513] hover:underline disabled:opacity-50"
                >
                  {isResetting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Forgot your password?"
                  )}
                </button>
              </motion.div>
            )}

            {resetStatus === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600"
              >
                Check your email for password reset instructions.
              </motion.p>
            )}

            {resetStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                Failed to send reset email. Please try again.
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
            >
              {isRegister ? "Sign up with Email" : "Sign in with Email"}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#8B4513]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#A0522D]/60">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <form action={signInWithGoogle}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#8B4513] rounded-lg hover:bg-[#8B4513]/5 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <form action={signInWithGithub}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#8B4513] rounded-lg hover:bg-[#8B4513]/5 transition-colors">
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>
            </form>
          </motion.div>

          {/* Toggle Sign In/Register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm"
          >
            <span className="text-[#A0522D]/60">
              {isRegister
                ? "Already have an account? "
                : "Don't have an account? "}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#8B4513] hover:underline"
            >
              {isRegister ? "Sign in" : "Register"}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
}
