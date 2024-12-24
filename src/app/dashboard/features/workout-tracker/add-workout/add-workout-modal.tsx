"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import WorkoutForm from "./workout-form";

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWorkoutModal({
  isOpen,
  onClose,
}: AddWorkoutModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Content className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-xl bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
                  Add New Workout
                </Dialog.Title>
                <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
                  <X className="h-5 w-5" />
                </Dialog.Close>
              </div>
              <WorkoutForm onComplete={onClose} />
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
