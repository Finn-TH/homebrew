"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import AddHabitForm from "../add-habit/habit-form";

export default function AddHabitButton() {
  const [open, setOpen] = useState(false);
  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="group flex items-center gap-2 px-4 py-2.5 rounded-lg 
                   bg-[#8B4513] text-white hover:bg-[#8B4513]/90 
                   transition-colors shadow-sm"
          aria-label="Add new habit"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Habit</span>
          <kbd
            className="hidden group-hover:inline-flex items-center gap-1 px-2 py-0.5 
                       text-xs text-[#8B4513] bg-white/90 rounded-md ml-2"
          >
            Ctrl/⌘ K
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
              Add New Habit
            </Dialog.Title>
            <Dialog.Close className="text-[#8B4513]/60 hover:text-[#8B4513]">
              <Plus className="h-5 w-5 rotate-45" />
            </Dialog.Close>
          </div>
          <AddHabitForm onComplete={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
