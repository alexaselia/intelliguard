"use client";

import React, { useEffect, useState } from 'react';
import SecondaryHeader from '@/components/ui/SecondaryHeader';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, LayoutDashboard } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getDistance } from 'geolib';
import { Button } from '@/components/ui/button';
import Mosaic from '@/components/ui/Mosaic';
import Loading from '@/components/ui/Loading';
import { motion } from 'framer-motion';

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [casaStreams, setCasaStreams] = useState<CameraLocation[]>([]);
  const [comunidadeStreams, setComunidadeStreams] = useState<CameraLocation[]>([]);
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Casa');
  const [hasSharedCameras, setHasSharedCameras] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log('No user found, redirecting to login');
        router.push('/login');
      } else {
        console.log('User authenticated:', data.session.user);
        setUser(data.session.user);
      }
      setTimeout(() => setLoading(false), 1000);
    };

    fetchUserSession();
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
        const updatedCameras = cameraData.map(camera => {
          const cachedThumbnail = localStorage.getItem(`thumbnail_${camera.id}`);
          return { ...camera, thumbnail: cachedThumbnail || camera.thumbnail };
        });
        updatedCameras.sort((a, b) => a.name.localeCompare(b.name)); // Sort cameras by name
        setCasaStreams(updatedCameras);
        console.log('Fetched Casa cameras:', updatedCameras);
      }
    } catch (error) {
      console.error('Error fetching Casa cameras:', error);
    }
  };

  const fetchComunidadeCameras = async () => {
    if (!user || !settings) return;

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
          if (camera.ownership === user.id) return false;

          const isInUserDistance = casaStreams.some(userCamera => {
            const distance = getDistance(
              { latitude: userCamera.latitude, longitude: userCamera.longitude },
              { latitude: camera.latitude, longitude: camera.longitude }
            );
            return distance <= settings.share_distance;
          });

          return isInUserDistance;
        }).map(camera => {
          const cachedThumbnail = localStorage.getItem(`thumbnail_${camera.id}`);
          return { ...camera, thumbnail: cachedThumbnail || camera.thumbnail };
        });

        filteredCameras.sort((a, b) => a.name.localeCompare(b.name)); // Sort cameras by name
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
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const shouldShowAlert = selectedCategory === 'Comunidade' && (!settings || !settings.share || !hasSharedCameras);

  const filteredStreams = selectedCategory === 'Casa' ? casaStreams : comunidadeStreams;

  return (
    <div className="p-4 md:p-6 pt-4 md:pt-6">
      <motion.div
        className="flex justify-between items-center mb-1 md:mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Câmeras</h1>
          <p className="text-1xl md:text-1xl text-gray-400">Ao vivo e suas gravações.</p>
        </div>
        <Button onClick={() => router.push('/mosaico')} className="bg-[#2D3343] text-white hover:bg-gray-600">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Mosaico
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <SecondaryHeader selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </motion.div>
      <TransitionGroup>
        {shouldShowAlert && (
          <CSSTransition timeout={300} classNames="fade">
            <Alert className="mt-4">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>
                Para ver câmeras compartilhadas, você precisa ter ao menos uma câmera marcada como compartilhada. Vá em <a href="/configuracoes" className="underline">Configurações</a> para ajustar suas preferências.
              </AlertDescription>
            </Alert>
          </CSSTransition>
        )}
      </TransitionGroup>
      {!shouldShowAlert && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {filteredStreams.length > 0 ? (
            filteredStreams.map((stream) => (
              <div key={stream.id} className="h-[320px] md:h-[300px] xl:h-[300px]">
                <DynamicCameraCard
                  name={stream.name}
                  streamUrl={stream.url}
                  cameraId={stream.id}
                  thumbnail={stream.thumbnail}
                  showViewRecordingsButton={selectedCategory === 'Casa'} // Pass the prop here
                />
              </div>
            ))
          ) : (
            <p className="text-white">No streams available.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Cameras;
