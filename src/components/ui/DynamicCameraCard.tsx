import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';
import LiveTag from './LiveTag';
import { createClient } from '@/lib/utils/supabase/client';

interface DynamicCameraCardProps {
  name: string;
  streamUrl: string;
  cameraId: string;
  thumbnail: string;
  isLive?: boolean;
  showViewRecordingsButton?: boolean; // Prop to control the visibility of the button
}

const supabase = createClient();

const DynamicCameraCard: React.FC<DynamicCameraCardProps> = ({ name, streamUrl, cameraId, thumbnail, isLive, showViewRecordingsButton = true }) => {
  const [isVideoError, setIsVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // State to track if the camera is online
  const [retryCount, setRetryCount] = useState(0); // State to track retry count
  const maxRetries = 3; // Maximum number of retries
  const retryDelay = 3000; // Delay between retries in milliseconds (3 seconds)
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = async () => {
    if (retryCount < maxRetries) {
      setRetryCount(prevRetryCount => prevRetryCount + 1);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current.play();
        }
      }, retryDelay);
    } else {
      setIsVideoError(true);
      await updateCameraStatus(false); // Update status to offline in Supabase
    }
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setRetryCount(0); // Reset retry count when play is clicked
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.duration; // Seek to the end to start from the most recent point
      videoRef.current.play();
    }
  };

  const updateCameraStatus = async (status: boolean) => {
    try {
      const { error } = await supabase.from('cameras').update({ online: status }).eq('id', cameraId);
      if (error) {
        console.error('Failed to update camera status:', error);
      } else {
        console.log(`Camera ${cameraId} status updated to ${status}`);
      }
    } catch (error) {
      console.error('Error updating camera status:', error);
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    const checkCameraStatus = async () => {
      try {
        const response = await fetch(streamUrl, { method: 'HEAD' });
        if (!response.ok) {
          setIsOnline(false);
          await updateCameraStatus(false); // Update status to offline in Supabase
        } else {
          setIsOnline(true);
          await updateCameraStatus(true); // Update status to online in Supabase
        }
      } catch (error) {
        setIsOnline(false);
        await updateCameraStatus(false); // Update status to offline in Supabase
      }
    };

    checkCameraStatus();
  }, [streamUrl]);

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-background-opacity-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
          {!isOnline || isVideoError ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-background">
              <img src="/icons/video-slash.svg" alt="Câmera Offline" className="w-16 h-16 mb-2" />
              <p className="text-white">Câmera Offline</p>
            </div>
          ) : isPlaying ? (
            <HlsPlayer
              src={streamUrl}
              autoPlay={true}
              className="flex-grow"
              style={{ margin: '-1px' }}
              onError={handleError}
              ref={videoRef}
            />
          ) : (
            <div className="relative w-full h-full">
              <img src={thumbnail || '/icons/video-placeholder.svg'} alt={name} className="w-full h-full object-cover" />
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
              >
                <img src="/icons/play-circle.svg" alt="Play" className="w-12 h-12 md:w-16 md:h-16 shadow-lg" />
              </button>
            </div>
          )}
          {isLive && !isVideoError && isPlaying && (
            <div className="absolute top-2 left-2">
              <LiveTag />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg md:text-base sm:text-sm font-bold mb-1">{name}</h3>
          <p className="text-gray-400 text-sm md:text-xs sm:text-[0.75rem]">Eventos da porta principal</p>
        </div>
        {showViewRecordingsButton && <ViewRecordingsButton cameraId={cameraId} />}
      </CardFooter>
    </Card>
  );
};

export default DynamicCameraCard;
