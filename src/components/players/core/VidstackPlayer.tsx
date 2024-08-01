// components/players/core/VidstackPlayer.tsx
import '@vidstack/react/player/styles/default/theme.css';
import { useEffect, useRef } from 'react';
import styles from './player.module.css';
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

import { VideoLayout } from './layouts/video-layout';
import { textTracks } from './tracks';

interface VidstackPlayerProps {
  videoUrl: string | null;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isLive: boolean;
  onEnded?: () => void;
}

export const VidstackPlayer: React.FC<VidstackPlayerProps> = ({ videoUrl, currentTime, onTimeUpdate, isLive, onEnded }) => {
  const playerRef = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.currentTime = currentTime;
    }

    const handleTimeUpdate = () => {
      if (playerRef.current) {
        onTimeUpdate(playerRef.current.currentTime);
      }
    };

    playerRef.current?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      playerRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentTime, onTimeUpdate]);

  const onProviderChange = (provider: MediaProviderAdapter | null, nativeEvent: MediaProviderChangeEvent) => {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  };

  const onCanPlay = (detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) => {
    // Handle can play event
  };

  const posterUrl = "https://files.vidstack.io/sprite-fight/poster.webp";

  return (
    <MediaPlayer
      className={`${styles.player} media-player`}
      title="Playback"
      src={videoUrl || posterUrl}
      autoplay
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={playerRef}
      aspectRatio="16/9"
      onEnded={onEnded}
    >
      <MediaProvider>
        <Poster
          className={`${styles.poster} vds-poster`}
          src={posterUrl}
          alt="Playback Poster"
        />
      </MediaProvider>
      {videoUrl && <VideoLayout thumbnails="/frame/51d768dae4a9d672e4d92cf0b27c1fee-20240705-000051.vtt" />}
    </MediaPlayer>
  );
};
