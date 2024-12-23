"use client";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HabitDatePickerProps {
  selected: Date;
  onChange: (date: Date | null) => void;
  name: string;
}

export function HabitDatePicker({
  selected,
  onChange,
  name,
}: HabitDatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      name={name}
      dateFormat="MMM d, yyyy"
      className="w-full rounded-lg border border-[#8B4513]/10 px-3 py-2 text-[#8B4513] focus:border-[#8B4513]/20 focus:outline-none focus:ring-1 focus:ring-[#8B4513]/20"
    />
  );
}
