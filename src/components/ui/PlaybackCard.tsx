import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';

interface PlaybackCardProps {
  name: string;
  streamUrl: string;
  cameraId: string;
  thumbnail: string;
  showViewRecordingsButton?: boolean;
}

const PlaybackCard: React.FC<PlaybackCardProps> = ({ name, streamUrl, cameraId, thumbnail, showViewRecordingsButton = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-background-opacity-100 rounded-lg overflow-hidden h-full flex items-center justify-center">
          {isPlaying ? (
            <video
              ref={videoRef}
              src={streamUrl}
              controls
              className="w-full h-full"
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
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg md:text-base sm:text-sm font-bold mb-1">{name}</h3> {/* Responsive text size */}
          <p className="text-gray-400 text-sm md:text-xs sm:text-[0.75rem]">Eventos da porta principal</p> {/* Responsive text size */}
        </div>
        {showViewRecordingsButton && <ViewRecordingsButton cameraId={cameraId} />}
      </CardFooter>
    </Card>
  );
};

export default PlaybackCard;
