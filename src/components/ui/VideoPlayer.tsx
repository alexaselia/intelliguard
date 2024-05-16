// src/components/ui/VideoPlayer.tsx
import React from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <video controls autoPlay preload="auto" className="w-full max-w-4xl">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
