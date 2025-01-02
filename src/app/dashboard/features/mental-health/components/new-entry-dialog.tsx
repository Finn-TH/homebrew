"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Editor } from "@tiptap/react";
import RichTextEditor from "./rich-text-editor";

interface NewEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewEntryDialog({
  open,
  onOpenChange,
}: NewEntryDialogProps) {
  const [content, setContent] = useState("");
  const [gratitude, setGratitude] = useState<string[]>([""]);
  const [activities, setActivities] = useState<string[]>([]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-6 shadow-lg focus:outline-none">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[#8B4513]">
              New Journal Entry
            </Dialog.Title>
            <Dialog.Close className="p-2 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#8B4513]" />
            </Dialog.Close>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
            {/* Mood Tracker Component will be included here */}

            {/* Journal Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#8B4513]/70">
                Journal Entry
              </label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Gratitude Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#8B4513]/70">
                Gratitude
              </label>
              {gratitude.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newGratitude = [...gratitude];
                    newGratitude[index] = e.target.value;
                    if (
                      index === gratitude.length - 1 &&
                      e.target.value.length > 0
                    ) {
                      newGratitude.push("");
                    }
                    setGratitude(newGratitude);
                  }}
                  placeholder="I am grateful for..."
                  className="w-full p-2 rounded-lg border border-[#8B4513]/10 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
                />
              ))}
            </div>

            {/* Activities */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#8B4513]/70">
                Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {["Exercise", "Meditation", "Therapy", "Reading", "Nature"].map(
                  (activity) => (
                    <button
                      key={activity}
                      onClick={() => {
                        setActivities((prev) =>
                          prev.includes(activity)
                            ? prev.filter((a) => a !== activity)
                            : [...prev, activity]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        activities.includes(activity)
                          ? "bg-[#8B4513] text-white"
                          : "bg-[#8B4513]/5 text-[#8B4513] hover:bg-[#8B4513]/10"
                      }`}
                    >
                      {activity}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Dialog.Close className="px-4 py-2 text-[#8B4513] hover:bg-[#8B4513]/5 rounded-lg transition-colors">
              Cancel
            </Dialog.Close>
            <button className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors">
              Save Entry
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
