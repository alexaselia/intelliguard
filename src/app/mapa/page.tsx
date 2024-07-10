"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CameraLocation } from '@/lib/utils';
import { getDistance } from 'geolib';
import Loading from '@/components/ui/Loading'; // Import the Loading component

const MapboxMap = dynamic(() => import('@/components/ui/map/MapboxMap'), { ssr: false });

const supabase = createClient(); // Use the singleton instance

const MapaPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [casaCameras, setCasaCameras] = useState<CameraLocation[]>([]);
  const [comunidadeCameras, setComunidadeCameras] = useState<CameraLocation[]>([]);
  const [hasFetchedSettings, setHasFetchedSettings] = useState(false);
  const [isReady, setIsReady] = useState(false); // New state to track readiness
  const router = useRouter();

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
      // Add an extra delay before ending the loading state
      setTimeout(() => setLoading(false), 1000); // 1 second delay
    };

    fetchUserSession();
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || hasFetchedSettings) return;

    const fetchUserSettings = async () => {
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
          setHasFetchedSettings(true);
          console.log('User settings:', userData);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
  }, [user, hasFetchedSettings]);

  useEffect(() => {
    if (!user) return;

    const fetchCasaCameras = async () => {
      try {
        const { data: cameraData, error: cameraError } = await supabase
          .from('cameras')
          .select('*')
          .eq('ownership', user.id);

        if (cameraError) {
          console.error('Failed to fetch Casa cameras:', cameraError);
        } else {
          setCasaCameras(cameraData);
          console.log('Fetched Casa cameras:', cameraData);
        }
      } catch (error) {
        console.error('Error fetching Casa cameras:', error);
      }
    };

    fetchCasaCameras();
  }, [user]);

  const fetchComunidadeCameras = async () => {
    if (!user || !settings) return;

    try {
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
        setComunidadeCameras([]);
        return;
      }

      const { data: cameraData, error: cameraError } = await supabase
        .from('cameras')
        .select('*')
        .eq('shared', true);

      if (cameraError) {
        console.error('Failed to fetch cameras:', cameraError);
      } else {
        const filteredCameras = cameraData.filter((camera: CameraLocation) => {
          if (camera.ownership === user.id) return false;

          const isInUserDistance = casaCameras.some(userCamera => {
            const distance = getDistance(
              { latitude: userCamera.latitude, longitude: userCamera.longitude },
              { latitude: camera.latitude, longitude: camera.longitude }
            );
            return distance <= settings.share_distance;
          });

          return isInUserDistance;
        });

        await fetchThumbnails(filteredCameras); // Fetch thumbnails before setting cameras
        setComunidadeCameras(filteredCameras);
        console.log('Fetched Comunidade cameras:', filteredCameras);
      }
    } catch (error) {
      console.error('Error fetching Comunidade cameras:', error);
    }
  };

  // Fetch thumbnails function
  const fetchThumbnails = async (cameras: CameraLocation[]) => {
    for (const camera of cameras) {
      if (camera.thumbnail && !camera.thumbnail.includes('token=')) { // Only fetch if there is a thumbnail and no token in the URL
        const { data, error } = await supabase.storage.from('thumbnails').createSignedUrl(camera.thumbnail, 60);
        if (!error && data) {
          camera.thumbnail = data.signedUrl;
        } else {
          console.error('Error fetching thumbnail:', error);
        }
      }
    }
  };

  useEffect(() => {
    if (user && casaCameras.length > 0 && hasFetchedSettings) {
      fetchComunidadeCameras();
      setIsReady(true); // Set ready state when all required data is fetched
    }
  }, [user, casaCameras, hasFetchedSettings]);

  if (loading || !isReady) {
    return <Loading />; // Show the loading animation
  }

  if (!user) {
    return null; // If user is not authenticated, return null to avoid rendering the page content
  }

  return (
    <div className="map-container">
      <MapboxMap
        user={user}
        settings={settings}
        casaCameras={casaCameras}
        comunidadeCameras={comunidadeCameras}
        fetchComunidadeCameras={fetchComunidadeCameras} // Ensure this is passed down
      />
    </div>
  );
};

export default MapaPage;
