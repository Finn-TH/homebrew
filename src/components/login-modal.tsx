"use client";

import { Github } from "lucide-react";
import { signInWithGithub } from "@/app/login/actions";
import Modal from "./ui/modal";
import { motion } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 pt-2">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#8B4513]">
            Sign in to HomeBrew
          </h2>
          <p className="text-[#A0522D]/60">
            Welcome back! Please sign in to continue
          </p>
        </motion.div>

        <motion.form
          action={signInWithGithub}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#8B4513] rounded-lg hover:bg-[#8B4513]/5 transition-colors"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </motion.button>
        </motion.form>
      </div>
    </Modal>
  );
}
