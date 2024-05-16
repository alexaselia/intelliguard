import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true; // Start video muted
      video.controls = true; // Add controls

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('Hls.js error:', event, data);
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });

        video.addEventListener('error', (event) => {
          console.error('Native HLS error:', event);
        });

        return () => {
          video.removeEventListener('loadedmetadata', () => {
            video.play();
          });
        };
      }
    }
  }, [src]);

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
};

export default HlsPlayer;
