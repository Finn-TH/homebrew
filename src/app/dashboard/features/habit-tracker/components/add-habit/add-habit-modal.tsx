"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import HabitForm from "./habit-form";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddHabitModal({
  open,
  onOpenChange,
}: AddHabitModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
              Add New Habit
            </Dialog.Title>
            <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <HabitForm onComplete={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
