// src/components/ui/PlyrPlayer.tsx
import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';

interface PlyrPlayerProps {
  src: string;
}

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const player = new Plyr(videoRef.current, {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'captions',
        'settings',
        'pip',
        'airplay',
        'fullscreen',
      ],
    });

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS Manifest loaded');
        player.play();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = src;
      videoRef.current.addEventListener('loadedmetadata', () => {
        console.log('Native HLS loaded');
        player.play();
      });
      videoRef.current.addEventListener('error', (event) => {
        console.error('Native HLS error:', event);
      });
    }

    return () => {
      player.destroy();
    };
  }, [src]);

  return (
    <div className="plyr__video-embed">
      <video ref={videoRef} className="plyr__video-embed" />
    </div>
  );
};

export default PlyrPlayer;
