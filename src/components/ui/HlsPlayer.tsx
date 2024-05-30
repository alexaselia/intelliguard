import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src, autoPlay = false, className, style }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.muted = true; // Start video muted
      video.controls = true; // Add controls

      const onLoadedMetadata = () => {
        setLoading(false);
        videoRef.current?.parentElement?.classList.add('video-loaded');
        if (!autoPlay) {
          video.pause(); // Pause the video if autoPlay is false
          video.currentTime = 0; // Ensure the video starts from the beginning
        }
      };

      if (Hls.isSupported()) {
        const hls = new Hls();
        console.log('Loading HLS source:', src);
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded');
          if (autoPlay) {
            video.play();
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', event, data);
        });

        video.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
          hls.destroy();
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected');
        video.src = src;
        video.addEventListener('loadedmetadata', onLoadedMetadata);

        video.addEventListener('error', (event) => {
          console.error('Native HLS error:', event);
        });

        return () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
      } else {
        console.error('HLS is not supported');
      }
    }
  }, [src, autoPlay]);

  return (
    <div className={`video-container ${className}`} style={style}>
      <video ref={videoRef} className="w-full h-full object-cover transform scale-[1.04]" /> {/* Increase zoom */}
      {loading && <div className="loading-spinner"></div>}
    </div>
  );
};

export default HlsPlayer;
