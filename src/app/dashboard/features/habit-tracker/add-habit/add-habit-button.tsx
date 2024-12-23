"use client";

import { Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import HabitForm from "./habit-form";

export default function AddHabitButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#8B4513] px-4 py-2 text-sm font-medium text-white hover:bg-[#8B4513]/90 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20">
          <Plus className="h-4 w-4" />
          Add Habit
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-[#8B4513]">
              Add New Habit
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-1.5 text-[#8B4513]/60 hover:bg-[#8B4513]/10 hover:text-[#8B4513]">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <HabitForm
            onComplete={() =>
              document
                .querySelector<HTMLButtonElement>("[data-radix-focus-guard]")
                ?.click()
            }
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
