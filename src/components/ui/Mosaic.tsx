import React, { useEffect, useState } from 'react';
import HlsPlayer from '@/components/ui/HlsPlayer';
import { createClient } from '@/lib/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getDistance } from 'geolib';

interface CameraLocation {
  id: string;
  name: string;
  url: string;
  ownership: string;
  shared: boolean;
  latitude: number;
  longitude: number;
  thumbnail: string;
}

interface MosaicProps {
  onClose: () => void;
}

const Mosaic: React.FC<MosaicProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [casaStreams, setCasaStreams] = useState<CameraLocation[]>([]);
  const [comunidadeStreams, setComunidadeStreams] = useState<CameraLocation[]>([]);
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [filteredStreams, setFilteredStreams] = useState<CameraLocation[]>([]);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from('people')
          .select('share, share_distance')
          .eq('user_uid', user.id)
          .single();

        if (userError) {
          console.error('Failed to fetch user settings:', userError);
        } else {
          setSettings(userData);
          console.log('User settings:', userData);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    const fetchCameras = async () => {
      if (!user) return;

      try {
        const { data: cameraData, error: cameraError } = await supabase
          .from('cameras')
          .select('*');

        if (cameraError) {
          console.error('Failed to fetch cameras:', cameraError);
        } else {
          const userCameras = cameraData.filter(camera => camera.ownership === user.id);
          setCasaStreams(userCameras);

          const sharedCameras = cameraData.filter(camera => camera.shared && camera.ownership !== user.id);
          setComunidadeStreams(sharedCameras);
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };

    fetchUserSettings();
    fetchCameras();
  }, [user]);

  useEffect(() => {
    if (!settings || !user) return;

    const userSharedCameras = casaStreams.filter(camera => camera.shared);

    if (!settings.share || userSharedCameras.length === 0) {
      setFilteredStreams(casaStreams);
      return;
    }

    const filteredComunidadeCameras = comunidadeStreams.filter(camera => {
      const isInUserDistance = casaStreams.some(userCamera => {
        const distance = getDistance(
          { latitude: userCamera.latitude, longitude: userCamera.longitude },
          { latitude: camera.latitude, longitude: camera.longitude }
        );
        return distance <= settings.share_distance;
      });

      return isInUserDistance;
    });

    setFilteredStreams([...casaStreams, ...filteredComunidadeCameras]);
  }, [settings, casaStreams, comunidadeStreams, user]);

  if (!user || !settings) {
    return null;
  }

  const getGridTemplate = (numCameras: number) => {
    const sqrt = Math.ceil(Math.sqrt(numCameras));
    const numCols = sqrt;
    const numRows = Math.ceil(numCameras / sqrt);
    return {
      gridTemplateColumns: `repeat(${numCols}, 1fr)`,
      gridTemplateRows: `repeat(${numRows}, 1fr)`,
    };
  };

  const gridStyle = getGridTemplate(filteredStreams.length);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-50">
        Close
      </button>
      <div className="grid gap-4 p-4 w-full h-full" style={gridStyle}>
        {filteredStreams.map((camera) => (
          <div key={camera.id} className="relative group">
            <HlsPlayer
              src={camera.url}
              autoPlay={true}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white hidden group-hover:flex transition-opacity duration-200">
              <p>{camera.name}</p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .group:hover .group-hover\:flex {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Mosaic;
