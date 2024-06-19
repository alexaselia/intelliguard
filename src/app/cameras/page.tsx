// src/app/cameras/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import { createClient } from '@/lib/utils/supabase/client'; // Correct import
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getDistance } from 'geolib';
import { Button } from '@/components/ui/button';
import Mosaic from '@/components/ui/Mosaic';

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

const Cameras: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [casaStreams, setCasaStreams] = useState<CameraLocation[]>([]);
  const [comunidadeStreams, setComunidadeStreams] = useState<CameraLocation[]>([]);
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Casa');
  const [hasSharedCameras, setHasSharedCameras] = useState(false);
  const [isMosaicOpen, setIsMosaicOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const supabase = createClient(); // Create the client instance here

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

  const fetchCasaCameras = async () => {
    if (!user) return;

    try {
      const { data: cameraData, error: cameraError } = await supabase
        .from('cameras')
        .select('*')
        .eq('ownership', user.id);

      if (cameraError) {
        console.error('Failed to fetch cameras:', cameraError);
      } else {
        setCasaStreams(cameraData);
        console.log('Fetched Casa cameras:', cameraData);
      }
    } catch (error) {
      console.error('Error fetching Casa cameras:', error);
    }
  };

  const fetchComunidadeCameras = async () => {
    if (!user || !settings) return;

    // Check if the user has any shared cameras
    const { data: userCameras, error: userCamerasError } = await supabase
      .from('cameras')
      .select('*')
      .eq('ownership', user.id)
      .eq('shared', true);

    if (userCamerasError) {
      console.error('Failed to fetch user cameras:', userCamerasError);
      return;
    }

    if (!settings.share || userCameras.length === 0) {
      setHasSharedCameras(false);
      setComunidadeStreams([]);
      return;
    }

    try {
      const { data: cameraData, error: cameraError } = await supabase
        .from('cameras')
        .select('*')
        .eq('shared', true);

      if (cameraError) {
        console.error('Failed to fetch cameras:', cameraError);
      } else {
        const filteredCameras = cameraData.filter((camera: CameraLocation) => {
          if (camera.ownership === user.id) return false; // Exclude user's own cameras

          const isInUserDistance = casaStreams.some(userCamera => {
            const distance = getDistance(
              { latitude: userCamera.latitude, longitude: userCamera.longitude },
              { latitude: camera.latitude, longitude: camera.longitude }
            );
            return distance <= settings.share_distance;
          });

          return isInUserDistance;
        });

        setComunidadeStreams(filteredCameras);
        setHasSharedCameras(true);
        console.log('Fetched Comunidade cameras:', filteredCameras);
      }
    } catch (error) {
      console.error('Error fetching Comunidade cameras:', error);
    }
  };

  useEffect(() => {
    fetchUserSettings();
    fetchCasaCameras();
  }, [user]);

  useEffect(() => {
    if (selectedCategory === 'Comunidade') {
      fetchComunidadeCameras();
    }
  }, [selectedCategory, settings, casaStreams]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  const shouldShowAlert = selectedCategory === 'Comunidade' && (!settings || !settings.share || !hasSharedCameras);

  const filteredStreams = selectedCategory === 'Casa' ? casaStreams : comunidadeStreams;

  return (
    <div className="p-4 md:p-6 pt-4 md:pt-6">
      <div className="flex justify-between items-center mb-1 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Câmeras</h1>
          <p className="text-gray-400">Veja as câmeras ao vivo e suas gravações.</p>
        </div>
        <Button onClick={() => setIsMosaicOpen(true)} className="bg-[#2D3343] text-white hover:bg-gray-600">
          <img src="/icons/expand.svg" alt="Mosaico" className="w-4 h-4 mr-2" />
          Mosaico
        </Button>
      </div>
      <SecondaryHeader selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <TransitionGroup>
        {shouldShowAlert && (
          <CSSTransition timeout={300} classNames="fade">
            <Alert className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>
                Para ver câmeras compartilhadas, você precisa ter ao menos uma câmera marcada como compartilhada. Vá em <a href="/configuracoes" className="underline">Configurações</a> para ajustar suas preferências.
              </AlertDescription>
            </Alert>
          </CSSTransition>
        )}
      </TransitionGroup>
      {!shouldShowAlert && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {filteredStreams.length > 0 ? (
            filteredStreams.map((stream) => (
              <DynamicCameraCard
                key={stream.id}
                name={stream.name}
                streamUrl={stream.url}
                cameraId={stream.id}
                thumbnail={stream.thumbnail}
              />
            ))
          ) : (
            <p className="text-white">No streams available.</p>
          )}
        </div>
      )}
      {isMosaicOpen && <Mosaic onClose={() => setIsMosaicOpen(false)} />}
    </div>
  );
};

export default Cameras;
