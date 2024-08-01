"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert, X } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getDistance } from 'geolib';
import { Button } from '@/components/ui/button';
import MosaicPlayer from '@/components/ui/MosaicPlayer';
import Loading from '@/components/ui/Loading';
import _ from "lodash";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css"; // Ensure styles are included
import "react-resizable/css/styles.css"; // Ensure resizable styles are included
import "./MosaicPage.css"; // Import custom CSS file

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface CameraLocation {
  id: string;
  name: string;
  url: string;
  ownership: string;
  shared: boolean;
  latitude: number;
  longitude: number;
}

const MosaicPage: React.FC = () => {
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
        cameraData.sort((a, b) => a.name.localeCompare(b.name)); // Sort cameras by name
        setCasaStreams(cameraData);
        console.log('Fetched Casa cameras:', cameraData);
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

  const layout = filteredStreams.map((stream, index) => ({
    i: stream.id,
    x: (index % 4) * 3,
    y: Math.floor(index / 4) * 3,
    w: 3,
    h: 3,
  }));

  const categoryButtonClass = (category: string) => `
    text-sm px-5 py-2 rounded-full text-left ${
      selectedCategory === category
        ? 'bg-[#0E1F3B] text-[#3B82F6] border border-[#3B82F6]'
        : 'bg-[#242B33] text-gray-400 hover:bg-gray-600 hover:text-white'
    }
  `;

  return (
    <div className="relative h-screen w-screen bg-black custom-scroll-area">
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <Button
          className={categoryButtonClass('Casa')}
          onClick={() => setSelectedCategory('Casa')}
        >
          Casa
        </Button>
        <Button
          className={categoryButtonClass('Comunidade')}
          onClick={() => setSelectedCategory('Comunidade')}
        >
          Comunidade
        </Button>
      </div>
      <Button
        className="absolute top-4 right-4 bg-gray-700 text-white px-4 py-2 rounded-md z-10"
        onClick={() => router.push('/cameras')}
      >
        <X className="w-5 h-5" />
      </Button>
      <TransitionGroup>
        {shouldShowAlert && (
          <CSSTransition timeout={300} classNames="fade">
            <Alert className="absolute top-16 left-4 mt-4 z-10">
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
        <ResponsiveReactGridLayout
          className="layout"
          layouts={{ lg: layout }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isBounded={true}
          measureBeforeMount={false}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
          margin={[5, 5]} // Decrease the gap between panels
          style={{ height: '100%', width: '100%' }}
        >
          {filteredStreams.length > 0 ? (
            filteredStreams.map((stream) => (
              <div key={stream.id} className="relative h-full flex items-center justify-center border border-gray-700 group">
                <MosaicPlayer src={stream.url} autoPlay className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full p-1 text-white text-opacity-50 group-hover:text-opacity-100 drop-shadow-md text-sm md:text-base lg:text-lg xl:text-xl">
                  {stream.name}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No streams available.</p>
          )}
        </ResponsiveReactGridLayout>
      )}
    </div>
  );
};

export default MosaicPage;
