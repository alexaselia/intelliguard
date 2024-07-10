// components/ui/TimelineVideoPlayer.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';

interface TimelineVideoPlayerProps {
  videoUrl: string;
  currentTime: number;
  isScrolling: boolean;
  frameUrl: string;
}

const TimelineVideoPlayer: React.FC<TimelineVideoPlayerProps> = ({ videoUrl, currentTime, isScrolling, frameUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFrame, setShowFrame] = useState(true);

  useEffect(() => {
    if (isScrolling) {
      setIsPlaying(false);
      setShowFrame(true);
    } else {
      const timer = setTimeout(() => {
        setIsPlaying(true);
        setShowFrame(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isScrolling]);

  useEffect(() => {
    if (videoRef.current && !isScrolling && isPlaying) {
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  }, [currentTime, isScrolling, isPlaying]);

  return (
    <div className="relative w-full h-96 bg-black">
      {showFrame ? (
        <img src={frameUrl} alt={`Frame ${currentTime}`} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          controls
        />
      )}
    </div>
  );
};

export default TimelineVideoPlayer;
