import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface LivePlayerProps {
  src: string;
}

const LivePlayer: React.FC<LivePlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let player: videojs.Player;

    if (videoRef.current) {
      player = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        preload: 'auto',
        sources: [{ src, type: 'application/x-mpegURL' }],
      });

      player.on('error', () => {
        console.error('Video.js error:', player.error());
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin w-full h-full"></video>
    </div>
  );
};

export default LivePlayer;
