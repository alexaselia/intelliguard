// src/components/ui/Timeline.tsx
import React, { useEffect, useRef } from 'react';

interface TimelineProps {
  duration: number;
  currentTime: number;
  onScroll: (scrollTop: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ duration, currentTime, onScroll }) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const markers = Array.from({ length: Math.ceil(duration / 600) }, (_, i) => i * 600);

  useEffect(() => {
    if (timelineRef.current) {
      const scrollTop = (currentTime / duration) * timelineRef.current.scrollHeight;
      timelineRef.current.scrollTop = scrollTop;
    }
  }, [currentTime, duration]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    onScroll(newScrollTop);
  };

  return (
    <div
      ref={timelineRef}
      onScroll={handleScroll}
      className="overflow-y-scroll relative bg-gray-800 w-20"
      style={{ height: 'calc(100vh - 100px)', border: '1px solid red' }} // Adjust height to fit your layout
    >
      <div
        className="absolute left-0 w-full h-1 bg-red-500"
        style={{ top: `${(currentTime / duration) * 100}%` }}
      />
      {markers.map((marker) => (
        <div key={marker} className="block w-full text-center text-white py-1">
          {new Date(marker * 1000).toISOString().substr(11, 8)}
        </div>
      ))}
      <div style={{ height: `${markers.length * 50}px` }} /> {/* Ensure enough scrollable space */}
    </div>
  );
};

export default Timeline;
