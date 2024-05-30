import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';
import LiveTag from './LiveTag';

interface DynamicCameraCardProps {
  name: string;
  streamUrl: string;
  cameraId: string;
  isLive?: boolean;
  showViewRecordingsButton?: boolean; // New prop to control the visibility of the button
}

const DynamicCameraCard: React.FC<DynamicCameraCardProps> = ({ name, streamUrl, cameraId, isLive, showViewRecordingsButton = true }) => {
  console.log('Rendering DynamicCameraCard with streamUrl:', streamUrl);

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-full flex items-center justify-center">
          <HlsPlayer src={streamUrl} autoPlay={isLive} className="flex-grow" style={{ margin: '-1px' }} /> {/* Slight zoom effect with margin */}
          {isLive && (
            <div className="absolute top-2 left-2">
              <LiveTag />
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

export default DynamicCameraCard;
