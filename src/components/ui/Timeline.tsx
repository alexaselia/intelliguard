// components/ui/Timeline.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TimelineProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  onTimeSelected: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, setCurrentTime, onTimeSelected }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolling(true);
    clearTimeout(handleScroll.timer);
    const scrollTop = e.currentTarget.scrollTop;
    const seconds = Math.floor(scrollTop / 20); // Assume each second corresponds to 20px of scroll
    setCurrentTime(seconds);
    handleScroll.timer = setTimeout(() => {
      setIsScrolling(false);
      onTimeSelected(seconds);
    }, 3000);
  };

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = currentTime * 20;
    }
  }, [currentTime]);

  return (
    <div className="mt-4 h-96 overflow-y-scroll relative" onScroll={handleScroll} ref={timelineRef}>
      <div className="relative w-full h-full">
        {[...Array(60).keys()].map((second) => (
          <div key={second} className="relative flex items-center h-20">
            <div className="w-16 text-white text-center">{second}s</div>
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 pointer-events-none">
        <div className="relative w-full h-0.5 bg-blue-500" />
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-blue-500" />
      </div>
    </div>
  );
};

export default Timeline;
