import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const TimelinePlayer = ({ recordings, currentSegment, currentTime }) => {
  const videoRef = useRef(null);
  const hls = useRef(null);

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
