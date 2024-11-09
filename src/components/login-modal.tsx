"use client";

import { Github } from "lucide-react";
import {
  signInWithGithub,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/app/login/actions";
import Modal from "@/components/ui/modal";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 pt-2">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#8B4513]">
            {isRegister ? "Create your account" : "Sign in to HomeBrew"}
          </h2>
          <p className="text-[#A0522D]/60">
            {isRegister
              ? "Join HomeBrew to start brewing"
              : "Welcome back! Please sign in to continue"}
          </p>
        </div>

        {/* Email/Password Form */}
        <form
          action={isRegister ? signUpWithEmail : signInWithEmail}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              name="email"
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
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
          >
            {isRegister ? "Sign up with Email" : "Sign in with Email"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#8B4513]/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[#A0522D]/60">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
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
        </div>

        {/* Toggle Sign In/Register */}
        <div className="text-center text-sm">
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
        </div>
      </div>
    </Modal>
  );
}
