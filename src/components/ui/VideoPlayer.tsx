import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  videoUrl: string;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  isLive?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, currentTime, onTimeUpdate, isLive = false }) => {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = internalRef;
  const [loading, setLoading] = useState(true);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      const video = videoRef.current;
      video.muted = true;
      video.controls = true;

      const onLoadedMetadata = () => {
        setLoading(false);
        if (!isLive) {
          video.pause();
          video.currentTime = 0;
        }
      };

      const handleVideoError = () => {
        setLoading(false);
      };

      if (Hls.isSupported() && videoUrl.endsWith('.m3u8')) {
        const hls = new Hls({
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 5,
          liveBackBufferLength: 60, // Keep 60 seconds of back buffer for live
          enableWorker: true,
          lowLatencyMode: true,
          maxMaxBufferLength: 30, // Set max buffer length to 30 seconds
          maxBufferLength: 30, // Initial max buffer length
          maxBufferSize: 60 * 1000 * 1000, // Max buffer size in bytes
          startLevel: -1,
          startFragPrefetch: true,
        });
        setHlsInstance(hls);
        console.log('Loading HLS source:', videoUrl);
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded');
          if (isLive) {
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
          setHlsInstance(null);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', handleVideoError);
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected');
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', handleVideoError);

        return () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', handleVideoError);
        };
      } else {
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', handleVideoError);

        return () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', handleVideoError);
        };
      }
    }
  }, [videoUrl, isLive]);

  useEffect(() => {
    if (hlsInstance && videoRef.current) {
      console.log('Updating HLS source:', videoUrl);
      hlsInstance.loadSource(videoUrl);
    }
  }, [videoUrl, hlsInstance]);

  const handlePlayClick = () => {
    videoRef.current?.play();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative bg-background-opacity-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover transform scale-[1.04]"
        controls
        muted
        onTimeUpdate={() => {
          if (videoRef.current && onTimeUpdate) {
            onTimeUpdate(videoRef.current.currentTime);
          }
        }}
        onPlay={handlePlay}
        onPause={handlePause}
      />
      {loading && <div className="loading-spinner"></div>}
      {!isLive && !loading && !isPlaying && (
        <button
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <img src="/icons/play-circle.svg" alt="Play" className="w-12 h-12 md:w-16 md:h-16 shadow-lg" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
