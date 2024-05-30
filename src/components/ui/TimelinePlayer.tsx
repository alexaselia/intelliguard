import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface TimelinePlayerProps {
  recordings: Recording[];
  currentSegment: number;
  currentTime: number;
}

const TimelinePlayer: React.FC<TimelinePlayerProps> = ({ recordings, currentSegment, currentTime }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hls = useRef<Hls | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      hls.current = new Hls();
      hls.current.loadSource(recordings[currentSegment].path);
      hls.current.attachMedia(videoRef.current);
      videoRef.current.currentTime = currentTime;
    }

    return () => {
      if (hls.current) {
        hls.current.destroy();
      }
    };
  }, [currentSegment, currentTime, recordings]);

  return <video ref={videoRef} controls style={{ width: '100%', height: 'auto' }} />;
};

export default TimelinePlayer;
