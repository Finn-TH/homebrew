"use client";

import { format } from "date-fns";
import { Coffee, MoreVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: number;
  energy: number;
  activities: string[];
  gratitude_points: string[];
}

interface JournalEntriesProps {
  entries: JournalEntry[];
}

export default function JournalEntries({ entries }: JournalEntriesProps) {
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#8B4513]/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h3 className="font-medium text-[#8B4513]">
                {format(new Date(entry.date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-[#8B4513]/70">
                  <span>Mood:</span>
                  <div className="flex">
                    {Array.from({ length: entry.mood }).map((_, i) => (
                      <span key={i} className="text-[#8B4513]">
                        ☕️
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#8B4513]/70">
                  <span>Energy:</span>
                  <div className="flex">
                    {Array.from({ length: entry.energy }).map((_, i) => (
                      <Coffee
                        key={i}
                        className="w-4 h-4 text-[#8B4513] fill-[#8B4513]/10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-1 hover:bg-[#8B4513]/5 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-[#8B4513]/60" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-48 bg-white rounded-lg shadow-lg border border-[#8B4513]/10 py-1"
                  align="end"
                >
                  <DropdownMenu.Item className="px-4 py-2 text-sm text-[#8B4513] hover:bg-[#8B4513]/5 cursor-pointer">
                    Edit Entry
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">
                    Delete Entry
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="prose prose-coffee max-w-none">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </div>

          {entry.activities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-[#8B4513]/70 mb-2">
                Activities
              </h4>
              <div className="flex flex-wrap gap-2">
                {entry.activities.map((activity) => (
                  <span
                    key={activity}
                    className="px-2 py-1 text-sm bg-[#8B4513]/5 text-[#8B4513] rounded-full"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.gratitude_points.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-[#8B4513]/70 mb-2">
                Gratitude
              </h4>
              <ul className="list-disc list-inside text-sm text-[#8B4513]/70">
                {entry.gratitude_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
