import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import HlsPlayer from '@/components/ui/HlsPlayer';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const MonitoringCardWithSelection = () => {
  const { user } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    const fetchCameras = async () => {
      const { data, error } = await supabase.from('cameras').select('*');
      if (error) {
        console.error('Error fetching cameras:', error);
      } else {
        setCameras(data);
      }
    };

    const fetchSelectedCamera = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_mosaics')
          .select('spot1')
          .eq('user_id', user.id)
          .eq('mosaic_id', 1)
          .single();

        if (error) {
          console.error('Error fetching selected camera:', error);
        } else {
          const selected = cameras.find((camera) => camera.id === data.spot1);
          setSelectedCamera(selected);
        }
      }
    };

    fetchCameras();
    fetchSelectedCamera();
  }, [user, cameras]);

  const handleCameraSelect = async (cameraId) => {
    if (user && Number.isInteger(cameraId)) {
      const { error } = await supabase
        .from('user_mosaics')
        .update({ spot1: cameraId })
        .eq('user_id', user.id)
        .eq('mosaic_id', 1);

      if (error) {
        console.error('Error updating user_mosaics:', error);
      } else {
        const selected = cameras.find((camera) => camera.id === cameraId);
        setSelectedCamera(selected);
      }
    } else {
      console.error('Invalid camera ID:', cameraId);
    }
  };

  return (
    <Card className="bg-[#262B31] p-0 cursor-pointer h-80">
      <CardContent className="relative p-0 h-3/4">
        {selectedCamera ? (
          <HlsPlayer src={selectedCamera.url} autoPlay className="flex-grow" style={{ margin: '-1px' }} />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>Selecione uma câmera</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="h-1/4 flex justify-between items-center p-4">
        <div className="text-white flex-1">
          <h3 className="text-lg md:text-base sm:text-sm font-bold mb-1">
            {selectedCamera ? selectedCamera.name : 'Sem câmera selecionada'}
          </h3>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <img src="/icons/vertical-menu.svg" alt="Menu" className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">Selecione uma câmera</h3>
              <ul className="space-y-2">
                {cameras.map((camera) => (
                  <li
                    key={camera.id}
                    onClick={() => handleCameraSelect(parseInt(camera.id))}
                    className="cursor-pointer"
                  >
                    {camera.name}
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default MonitoringCardWithSelection;
