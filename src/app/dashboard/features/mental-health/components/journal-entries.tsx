"use client";

import { format } from "date-fns";
import { JournalEntry } from "../types";
import { MOOD_EMOJIS } from "../types";
import { Calendar, ChevronDown, MoreVertical, Trash } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { deleteJournalEntry } from "../journal-actions";
import { useRouter } from "next/navigation";

interface JournalEntriesProps {
  entries: JournalEntry[];
}

export default function JournalEntries({ entries }: JournalEntriesProps) {
  const router = useRouter();
  const [openEntries, setOpenEntries] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const toggleEntry = (id: string) => {
    setOpenEntries((prev) =>
      prev.includes(id)
        ? prev.filter((entryId) => entryId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (entryId: string) => {
    setShowDeleteDialog(false);
    setIsDeleting(entryId);
    try {
      await deleteJournalEntry(entryId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    } finally {
      setIsDeleting(null);
      setEntryToDelete(null);
    }
  };

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8B4513]/60 mb-4">
          No journal entries for this week yet.
        </p>
        <p className="text-[#8B4513]/60">
          Start journaling to track your mental health journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-[#8B4513]/10 overflow-hidden">
              <div
                onClick={() => toggleEntry(entry.id)}
                className="flex flex-col gap-3 p-4 hover:bg-[#8B4513]/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#8B4513]/40">
                      #{entries.length - index}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-[#8B4513]/70">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(entry.created_at), "MMMM d, yyyy")}
                    </div>
                    {entry.mood && (
                      <span className="text-lg" title={entry.mood}>
                        {MOOD_EMOJIS[entry.mood]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-[#8B4513]/10 rounded-lg transition-colors"
                          disabled={isDeleting === entry.id}
                        >
                          <MoreVertical className="w-4 h-4 text-[#8B4513]/40" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[180px] rounded-lg bg-white p-1 shadow-xl"
                          sideOffset={5}
                        >
                          <DropdownMenu.Item
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEntryToDelete(entry.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash className="w-4 h-4" />
                            Delete Entry
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8B4513]/40 transition-transform ${
                        openEntries.includes(entry.id) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {entry.title && (
                      <h3 className="text-lg font-medium text-[#8B4513]">
                        {entry.title}
                      </h3>
                    )}
                  </div>
                  {entry.activities && entry.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.activities.map((activity) => (
                        <span
                          key={activity}
                          className="px-2 py-1 text-xs rounded-full bg-[#8B4513]/10 text-[#8B4513]"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {openEntries.includes(entry.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[#8B4513]/10"
                >
                  <div className="p-4 space-y-4">
                    <div className="prose prose-brown max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                      />
                    </div>

                    {entry.gratitude && (
                      <div className="p-4 bg-[#8B4513]/5 rounded-lg">
                        <h4 className="font-medium text-[#8B4513] mb-2">
                          Gratitude
                        </h4>
                        <p className="text-[#8B4513]/70">{entry.gratitude}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[90vw] max-w-md">
            <Dialog.Title className="text-lg font-medium text-[#8B4513] mb-4">
              Delete Journal Entry
            </Dialog.Title>
            <Dialog.Description className="text-[#8B4513]/70 mb-6">
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-lg text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => entryToDelete && handleDelete(entryToDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
