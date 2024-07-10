"use client";

import React from "react";
import Calendar from "react-calendar";

interface CustomCalendarProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
  daysWithRecordings: string[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onSelectDate, daysWithRecordings }) => {
  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month' && daysWithRecordings.includes(date.toISOString().split('T')[0])) {
      return 'highlight';
    }
    return null;
  };

  return (
    <Calendar
      value={selectedDate}
      onClickDay={onSelectDate}
      tileClassName={tileClassName}
    />
  );
};

export default CustomCalendar;
