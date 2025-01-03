"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { MOOD_EMOJIS, type Mood } from "../types";
import RichTextEditor from "./rich-text-editor";
import { createJournalEntry } from "../journal-actions";
import { useRouter } from "next/navigation";

interface NewEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACTIVITY_OPTIONS = [
  "Exercise",
  "Meditation",
  "Therapy",
  "Reading",
  "Nature",
];

export default function NewEntryDialog({
  open,
  onOpenChange,
}: NewEntryDialogProps) {
  const router = useRouter();
  const [mood, setMood] = useState<Mood | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content) return; // Basic validation

    try {
      setIsSubmitting(true);
      await createJournalEntry({
        title: title || null,
        content,
        mood,
        gratitude: gratitude || null,
        activities,
      });

      // Reset form and close dialog
      setMood(null);
      setTitle("");
      setContent("");
      setGratitude("");
      setActivities([]);
      onOpenChange(false);

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error("Failed to create journal entry:", error);
      // You might want to add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-semibold text-[#8B4513]">
              New Journal Entry
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-2 hover:bg-[#8B4513]/5 transition-colors">
              <X className="h-5 w-5 text-[#8B4513]/40" />
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Mood Selection */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#8B4513]">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(MOOD_EMOJIS) as Mood[]).map((moodOption) => (
                  <button
                    key={moodOption}
                    onClick={() => setMood(moodOption)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                      mood === moodOption
                        ? "bg-[#8B4513]/10"
                        : "hover:bg-[#8B4513]/5"
                    }`}
                  >
                    <span className="text-2xl">{MOOD_EMOJIS[moodOption]}</span>
                    <span className="text-sm text-[#8B4513]/70 capitalize">
                      {moodOption}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#8B4513]">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full p-3 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 text-[#8B4513]"
              />
            </div>

            {/* Journal Content */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#8B4513]">
                Journal Entry
              </label>
              <div className="relative">
                <RichTextEditor content={content} onChange={setContent} />
                <div className="absolute right-2 bottom-2 text-sm text-[#8B4513]/40">
                  {content.length}/500 words
                </div>
              </div>
            </div>

            {/* Gratitude Input */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#8B4513]">
                Gratitude (Optional)
              </label>
              <input
                type="text"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="I am grateful for..."
                className="w-full p-3 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 text-[#8B4513]"
              />
            </div>

            {/* Activities */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#8B4513]">
                Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_OPTIONS.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => {
                      setActivities((prev) =>
                        prev.includes(activity)
                          ? prev.filter((a) => a !== activity)
                          : [...prev, activity]
                      );
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activities.includes(activity)
                        ? "bg-[#8B4513] text-white"
                        : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content}
                className="px-4 py-2 rounded-lg bg-[#8B4513] text-white hover:bg-[#8B4513]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
