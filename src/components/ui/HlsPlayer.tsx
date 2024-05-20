import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
}

const HlsPlayer: React.FC<HlsPlayerProps> = ({ src }) => {
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
      };

      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 20, // Reduce buffer length
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000, // 60MB
          maxBufferHole: 0.1,
          highBufferWatchdogPeriod: 3,
          nudgeMaxRetry: 5,
          fragLoadingTimeOut: 20000,
          levelLoadingTimeOut: 10000,
          fragLoadingRetryDelay: 1000,
          levelLoadingRetryDelay: 1000,
          fragLoadingMaxRetryTimeout: 64000,
          startLevel: -1,
          capLevelToPlayerSize: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error:', data);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error:', data);
                hls.recoverMediaError();
                break;
              default:
                console.error('Other fatal error:', data);
                hls.destroy();
                break;
            }
          } else {
            console.warn('Non-fatal error:', data);
            if (data.details === Hls.ErrorDetails.BUFFER_APPEND_ERROR) {
              hls.recoverMediaError();
            }
          }
        });

        video.addEventListener('loadedmetadata', onLoadedMetadata);

        return () => {
          hls.destroy();
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', onLoadedMetadata);

        video.addEventListener('error', (event) => {
          console.error('Native HLS error:', event);
        });

        return () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
      }
    }
  }, [src]);

  return (
    <div className="video-container">
      <video ref={videoRef} className="w-full h-full object-cover" />
      {loading && <div className="loading-spinner"></div>}
    </div>
  );
};

export default HlsPlayer;
