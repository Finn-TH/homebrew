"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface DatePickerProps {
  onDateChange: (date: Date | null) => void;
  selectedDate: Date | null;
}

export function TodoDatePicker({
  onDateChange,
  selectedDate,
}: DatePickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="p-2 text-[#8B4513]/40 hover:text-[#8B4513] 
                   hover:bg-[#8B4513]/5 rounded-lg transition-colors"
          aria-label="Set due date"
        >
          <Calendar className="h-5 w-5" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 bg-white rounded-lg shadow-lg p-2 border border-[#8B4513]/10"
          sideOffset={5}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => onDateChange(date)}
            inline
            minDate={new Date()}
            dateFormat="MMM d, yyyy"
            placeholderText="Select due date"
          />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
