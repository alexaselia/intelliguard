"use client";

import { useEffect, useRef } from 'react';
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';

const TimelinePage = () => {
  const videoRef = useRef<HTMLMediaElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.textTracks[0].mode = 'showing'; // Ensure the VTT file is shown
    }
  }, []);

  return (
    <div className="video-container">
      <Media>
        <MediaProvider src="/timelinetest/51d768dae4a9d672e4d92cf0b27c1fee-20240705-235950.mp4" poster="/timelinetest/51d768dae4a9d672e4d92cf0b27c1fee-20240705-235950.jpg">
          <video
            ref={videoRef}
            controls
            className="video-player"
            preload="metadata"
            data-annotations="/timelinetest/51d768dae4a9d672e4d92cf0b27c1fee-20240705-235950.vtt"
          />
        </MediaProvider>
        <MediaPoster />
        <MediaLoadingIndicator />
      </Media>
    </div>
  );
};

export default TimelinePage;
