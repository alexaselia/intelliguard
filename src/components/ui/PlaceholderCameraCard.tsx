// src/components/ui/PlaceholderCameraCard.tsx
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';
import LiveTag from './LiveTag';

interface PlaceholderCameraCardProps {
  name: string;
  videoUrl: string;
  cameraId: string;
  isLive?: boolean;
}

const PlaceholderCameraCard: React.FC<PlaceholderCameraCardProps> = ({ name, videoUrl, cameraId, isLive }) => {
  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-full flex items-center justify-center">
          <video src={videoUrl} controls className="h-full w-full object-cover" />
          {isLive && (
            <div className="absolute top-2 left-2">
              <LiveTag />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg font-bold mb-1">{name}</h3>
          <p className="text-gray-400 text-sm">Eventos da porta principal</p>
        </div>
        <ViewRecordingsButton cameraId={cameraId} />
      </CardFooter>
    </Card>
  );
};

export default PlaceholderCameraCard;
