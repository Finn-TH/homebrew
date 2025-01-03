"use client";

import { useState } from "react";
import { Plus, Coffee, BarChart2, Calendar } from "lucide-react";
import NewEntryDialog from "./new-entry-dialog";
import JournalHybridView from "./journal-hybrid-view";
import MoodTracker from "./mood-tracker";
import JournalEntries from "./journal-entries";
import { JournalEntry } from "../types";

interface JournalClientProps {
  initialEntries: JournalEntry[];
}

export default function JournalClient({ initialEntries }: JournalClientProps) {
  const [view, setView] = useState<"list" | "hybrid" | "analytics">("list");
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-colors ${
              view === "list"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
          >
            <Coffee className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("hybrid")}
            className={`p-2 rounded-lg transition-colors ${
              view === "hybrid"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`p-2 rounded-lg transition-colors ${
              view === "analytics"
                ? "bg-[#8B4513] text-white"
                : "hover:bg-[#8B4513]/5 text-[#8B4513]"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setIsNewEntryOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Daily Mood Tracker */}
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-[#8B4513] mb-4">
          Today&apos;s Mood
        </h2>
        <MoodTracker />
      </div>

      {/* Main Content */}
      <div className="bg-white/80 rounded-xl p-6 backdrop-blur-sm min-h-[500px]">
        {view === "list" && <JournalEntries entries={initialEntries} />}
        {view === "hybrid" && <JournalHybridView entries={initialEntries} />}
        {view === "analytics" && <div>Analytics view coming soon...</div>}
      </div>

      {/* New Entry Dialog */}
      <NewEntryDialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen} />
    </div>
  );
}
