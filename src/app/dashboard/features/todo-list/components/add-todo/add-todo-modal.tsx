"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import QuickAdd from "./quick-add";
import CustomAdd from "../add-todo/custom-add";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTodoModal({ isOpen, onClose }: AddTodoModalProps) {
  const [mode, setMode] = useState<"quick" | "custom">("quick");

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
                                 w-full max-w-lg bg-white rounded-xl shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#8B4513]/10">
            <div className="space-y-1">
              <Dialog.Title className="text-lg font-semibold text-[#8B4513]">
                Add New Todo
              </Dialog.Title>
              <Dialog.Description className="text-sm text-[#8B4513]/60">
                Choose how you want to add your todo
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="p-2 text-[#8B4513]/40 hover:text-[#8B4513] 
                                   hover:bg-[#8B4513]/5 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Mode Selector */}
          <div className="flex p-4 gap-4">
            <button
              onClick={() => setMode("quick")}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors
                       ${
                         mode === "quick"
                           ? "border-[#8B4513] bg-[#8B4513]/5"
                           : "border-[#8B4513]/10 hover:border-[#8B4513]/20"
                       }`}
            >
              <h3 className="font-medium text-[#8B4513]">Quick Add</h3>
              <p className="text-sm text-[#8B4513]/60 mt-1">
                Simple todo with basic details
              </p>
            </button>

            <button
              onClick={() => setMode("custom")}
              className={`flex-1 p-4 rounded-lg border-2 transition-colors
                       ${
                         mode === "custom"
                           ? "border-[#8B4513] bg-[#8B4513]/5"
                           : "border-[#8B4513]/10 hover:border-[#8B4513]/20"
                       }`}
            >
              <h3 className="font-medium text-[#8B4513]">Custom Add</h3>
              <p className="text-sm text-[#8B4513]/60 mt-1">
                Detailed todo with all options
              </p>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 border-t border-[#8B4513]/10">
            {mode === "quick" ? (
              <QuickAdd onClose={onClose} />
            ) : (
              <CustomAdd onClose={onClose} />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
