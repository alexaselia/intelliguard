import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer';
import ViewRecordingsButton from '@/components/ui/ViewRecordingsButton';
import { supabase } from '@/lib/supabaseClient';

interface EntranceCardProps {
  userId: string; // Assuming userId is passed as a prop
}

const EntranceCard: React.FC<EntranceCardProps> = ({ userId }) => {
  const [camera, setCamera] = useState<any | null>(null);
  const [isVideoError, setIsVideoError] = useState(false);

  useEffect(() => {
    const fetchCamera = async () => {
      try {
        const { data: mosaicData, error: mosaicError } = await supabase
          .from('user_mosaics')
          .select('spot1')
          .eq('user_id', userId)
          .single();

        if (mosaicError) throw mosaicError;

        if (mosaicData && mosaicData.spot1) {
          const { data: cameraData, error: cameraError } = await supabase
            .from('cameras')
            .select('name, url, camera_id')
            .eq('camera_id', mosaicData.spot1)
            .single();

          if (cameraError) throw cameraError;

          setCamera(cameraData);
        }
      } catch (error) {
        console.error('Failed to fetch camera data:', error);
      }
    };

    fetchCamera();
  }, [userId]);

  const handleError = () => {
    setIsVideoError(true);
  };

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        <div className="relative bg-gray-700 rounded-lg overflow-hidden h-full flex items-center justify-center">
          {isVideoError || !camera ? (
            <div className="flex flex-col items-center justify-center w-full h-full bg-background">
              <img src="/icons/video-slash.svg" alt="Câmera Offline" className="w-16 h-16 mb-2" />
              <p className="text-white">Câmera Offline</p>
            </div>
          ) : (
            <HlsPlayer src={camera.url} autoPlay={false} className="flex-grow" style={{ margin: '-1px' }} onError={handleError} />
          )}
        </div>
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg md:text-base sm:text-sm font-bold mb-1">{camera?.name || 'Megabit'}</h3>
        </div>
        <ViewRecordingsButton cameraId={camera?.camera_id || 'default-camera-id'} />
      </CardFooter>
    </Card>
  );
};

export default EntranceCard;
