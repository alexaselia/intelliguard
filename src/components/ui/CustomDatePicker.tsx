"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CustomDatePickerProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  daysWithRecordings: string[];
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onSelectDate, daysWithRecordings }) => {
  const dayHasRecordings = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return daysWithRecordings.includes(formattedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          dayHasRecordings={dayHasRecordings}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default CustomDatePicker;