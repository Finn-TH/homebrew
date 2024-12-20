"use client";

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import AddTodoModal from "./add-todo-modal";

export default function AddTodoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-lg 
                 bg-[#8B4513] text-white hover:bg-[#8B4513]/90 
                 transition-colors shadow-sm"
        aria-label="Add new task"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Add Task</span>
        <kbd
          className="hidden group-hover:inline-flex items-center gap-1 px-2 py-0.5 
                     text-xs text-[#8B4513] bg-white/90 rounded-md ml-2"
        >
          Ctrl/⌘ K
        </kbd>
      </button>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
