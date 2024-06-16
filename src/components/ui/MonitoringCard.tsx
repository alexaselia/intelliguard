import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CameraPopover from './CameraPopover';
import HlsPlayer from './HlsPlayer';
import ExpandButton from './ExpandButton';
import MinimizeButton from './MinimizeButton';

const MonitoringCard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCameras, setSelectedCameras] = useState<(any | null)[]>([null, null, null, null]);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoErrors, setVideoErrors] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    const fetchMosaicData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_mosaics')
        .select('*')
        .eq('user_id', user.id)
        .eq('mosaic_id', 1) // Assuming mosaic_id "1" as the default
        .single();

      if (error) {
        console.error('Failed to fetch mosaic data:', error);
      } else {
        const spots = [data.spot1, data.spot2, data.spot3, data.spot4];
        const camerasPromises = spots.map((spotId) =>
          spotId ? supabase.from('cameras').select('*').eq('camera_id', spotId).single() : null
        );

        const cameras = await Promise.all(camerasPromises);
        setSelectedCameras(cameras.map(camera => camera?.data || null));
      }
    };

    fetchMosaicData();
  }, [user]);

  const handleBoxClick = (index: number) => {
    setActiveBox(index);
  };

  const handleSelectCamera = async (camera: any) => {
    if (activeBox !== null) {
      const newSelectedCameras = [...selectedCameras];
      newSelectedCameras[activeBox] = camera;
      setSelectedCameras(newSelectedCameras);
      setActiveBox(null);

      const spots = {
        spot1: newSelectedCameras[0]?.camera_id || null,
        spot2: newSelectedCameras[1]?.camera_id || null,
        spot3: newSelectedCameras[2]?.camera_id || null,
        spot4: newSelectedCameras[3]?.camera_id || null,
      };

      const { error } = await supabase
        .from('user_mosaics')
        .upsert({
          user_id: user.id,
          mosaic_id: 1, // Assuming mosaic_id "1" as the default
          ...spots,
        }, {
          onConflict: ['user_id', 'mosaic_id']
        });

      if (error) {
        console.error('Failed to update mosaic data:', error);
      }
    }
  };

  const handleVideoError = useCallback((index: number) => {
    setVideoErrors(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[index] = true;
      return newErrors;
    });
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderCamera = (camera: any, index: number) => {
    return (
      <ResizablePanel key={index} defaultSize={50} className="border-[#262B31]">
        <CameraPopover
          onSelect={handleSelectCamera}
          trigger={
            <div
              className="relative w-full h-full bg-[#1A1C1F] cursor-pointer"
              onClick={() => handleBoxClick(index)}
            >
              {camera ? (
                <div className="absolute inset-0">
                  {videoErrors[index] ? (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-background">
                      <img src="/icons/video-slash.svg" alt="Câmera Offline" className="w-1/3 h-1/3 mb-2" />
                      <p className="text-white">Câmera Offline</p>
                    </div>
                  ) : (
                    <HlsPlayer src={camera.url} autoPlay={false} className="w-full h-full object-cover" onError={() => handleVideoError(index)} />
                  )}
                  <span className="absolute bottom-2 left-2 text-sm font-semibold">
                    {camera.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <img src="/icons/addnew.svg" alt="Add new camera" className="w-6 h-6" />
                </div>
              )}
            </div>
          }
        />
      </ResizablePanel>
    );
  };

  return (
    <Card className={`bg-[#262B31] text-white p-0 cursor-pointer ${isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50' : 'h-80'}`}>
      <CardContent className={`relative p-0 ${isFullscreen ? 'h-5/6' : 'h-3/4'}`}>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border border-[#262B31]"
        >
          <ResizablePanel defaultSize={50} className="border-[#262B31]">
            <ResizablePanelGroup direction="vertical" className="border-[#262B31]">
              {renderCamera(selectedCameras[0], 0)}
              <ResizableHandle className="border-[#262B31]" />
              {renderCamera(selectedCameras[1], 1)}
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="border-[#262B31]" />
          <ResizablePanel defaultSize={50} className="border-[#262B31]">
            <ResizablePanelGroup direction="vertical" className="border-[#262B31]">
              {renderCamera(selectedCameras[2], 2)}
              <ResizableHandle className="border-[#262B31]" />
              {renderCamera(selectedCameras[3], 3)}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
      <CardFooter className={`flex justify-between items-center ${isFullscreen ? 'h-20 p-4' : 'h-1/4 p-4'}`}>
        <div className="text-white flex-1">
          <h3 className={`text-lg md:text-base sm:text-sm font-bold mb-1 ${isFullscreen ? 'text-xs' : ''}`}>Mosaico</h3>
          <p className={`text-gray-400 text-sm md:text-xs sm:text-[0.75rem] ${isFullscreen ? 'text-[0.5rem]' : ''}`}>Acesso rápido à câmeras de sua escolha</p>
        </div>
        {isFullscreen ? (
          <MinimizeButton onClick={toggleFullscreen} />
        ) : (
          <ExpandButton onClick={toggleFullscreen} />
        )}
      </CardFooter>
    </Card>
  );
};

export default MonitoringCard;
