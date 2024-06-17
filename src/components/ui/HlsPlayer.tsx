import React, { useEffect, useRef, useState, forwardRef } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  src: string;
  autoPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: () => void;
}

const HlsPlayer = forwardRef<HTMLVideoElement, HlsPlayerProps>(({ src, autoPlay = false, className, style, onError }, ref) => {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = (ref as React.RefObject<HTMLVideoElement>) || internalRef;
  const [loading, setLoading] = useState(true);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);

  useEffect(() => {
    if (videoRef.current && src) {
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

      const handleVideoError = () => {
        setLoading(false); // Hide loading spinner on error
        if (onError) onError();
      };

      if (Hls.isSupported()) {
        const hls = new Hls();
        setHlsInstance(hls); // Store the Hls instance in state
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
          handleVideoError();
        });

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', handleVideoError);

        return () => {
          hls.destroy();
          setHlsInstance(null); // Clear the Hls instance from state
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', handleVideoError);
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected');
        video.src = src;
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', handleVideoError);

        return () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', handleVideoError);
        };
      } else {
        console.error('HLS is not supported');
        handleVideoError();
      }
    }
  }, [src, autoPlay, onError]);

  useEffect(() => {
    // If the src changes, update the HLS instance
    if (hlsInstance && videoRef.current) {
      console.log('Updating HLS source:', src);
      hlsInstance.loadSource(src);
    }
  }, [src, hlsInstance]);

  return (
    <div className={`video-container ${className}`} style={style}>
      <video ref={videoRef} className="w-full h-full object-cover transform scale-[1.04]" controls={true} muted={true} />
      {loading && <div className="loading-spinner"></div>}
    </div>
  );
});

HlsPlayer.displayName = 'HlsPlayer';

export default React.memo(HlsPlayer);
