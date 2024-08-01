// RecordingsAccordion.tsx
"use client";

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Calendar } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingsAccordionProps {
  cameraId: string;
  recordings: { [day: string]: Recording[] };
  planDuration: number;
  selectedDay: string | null;
  handleLiveFeedClick: () => void;
  handleRecordingClick: (recording: string) => void;
  handleCalendarDayClick: (day: string) => void;
  formatDate: (dateString: string) => string;
  extractTimeFromFilename: (filename: string) => string;
  getFilteredRecordings: () => { [day: string]: Recording[] };
  renderDay: (day: Date) => JSX.Element;
  sortOrder?: "newest" | "oldest";
}

const RecordingsAccordion: React.FC<RecordingsAccordionProps> = ({
  cameraId,
  recordings,
  planDuration,
  selectedDay,
  handleLiveFeedClick,
  handleRecordingClick,
  handleCalendarDayClick,
  formatDate,
  extractTimeFromFilename,
  getFilteredRecordings,
  renderDay,
  sortOrder = "newest",
}) => {

  const getDayOfWeekInPortuguese = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const daysOfWeek = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ];
    return daysOfWeek[date.getDay()];
  };

  const formatDateWithDayOfWeek = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    return `${formattedDate} - ${getDayOfWeekInPortuguese(dateString)}`;
  };

  return (
    <div className="w-full h-full">
      <Button onClick={handleLiveFeedClick} className="mb-4 w-full bg-gray-700 hover:bg-gray-800 hover:bg-opacity-50">
        Ver Ao Vivo
      </Button>
      <div className="flex items-center justify-between mb-1 text-white">
        <span>Gravações</span>
        <Popover>
          <PopoverTrigger>
            <Calendar className="cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>
            <ShadcnCalendar
              selectedDate={selectedDay ? new Date(selectedDay) : undefined}
              onSelectDate={(date) => handleCalendarDayClick(date.toISOString().split('T')[0])}
              renderDay={renderDay}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="h-full w-full custom-scroll-area">
        <div className="h-full max-h-[600px] custom-scroll-area">
          <Accordion type="single" collapsible className="text-white">
            <AccordionItem value="escolha-o-dia" className="max-h-100 custom-scroll-area flex flex-col rounded-md mt-1 border border-gray-700 p-2 hover:bg-gray-700 hover:bg-opacity-20">
              <AccordionTrigger>Escolha o Dia</AccordionTrigger>
              <AccordionContent className="max-h-96">
                <Accordion type="single" collapsible className="text-white">
                  {Object.keys(getFilteredRecordings())
                    .sort((a, b) => sortOrder === "newest" ? new Date(b).getTime() - new Date(a).getTime() : new Date(a).getTime() - new Date(b).getTime())
                    .map((day) => (
                      <AccordionItem key={day} value={day} className="rounded-md mt-1 border border-gray-700 p-2 hover:bg-gray-700 hover:bg-opacity-20">
                        <AccordionTrigger>{formatDateWithDayOfWeek(day)}</AccordionTrigger>
                        <AccordionContent className="max-h-48 custom-scroll-area">
                          {recordings[day]
                            .sort((a, b) => sortOrder === "newest" ? new Date(b.startTime).getTime() - new Date(a.startTime).getTime() : new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .map((recording, index) => (
                              <div
                                key={`${cameraId}-${index}`}
                                className="p-2 rounded-md cursor-pointer hover:bg-gray-700 text-white"
                                onClick={() => handleRecordingClick(recording.path)}
                              >
                                {extractTimeFromFilename(recording.path)}
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Card className="mt-4 bg-background rounded-md border border-yellow-500 p-2 hover:bg-yellow-500 hover:bg-opacity-10 cursor-pointer" onClick={() => window.open('https://megabitfibra.com.br/', '_blank')}>
            <CardContent className="flex items-center justify-center space-x-4">
              <Sparkles className="h-16 w-16 text-yellow-500" />
              <div className="text-white">Quer gravar por mais tempo? Faça um upgrade!</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordingsAccordion;
