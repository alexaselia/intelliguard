"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { CameraLocation } from '@/lib/utils'; // Adjust the import path as necessary

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false });

const MapaPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cameras, setCameras] = useState<CameraLocation[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if user is not authenticated
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (loading) return;
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('cameras')
          .select('*')
          .or(`ownership.eq.${user.id},shared.eq.true`);

        if (error) {
          console.error('Failed to fetch camera data:', error);
        } else {
          console.log('Fetched camera data:', data);
          setCameras(data);
        }
      } catch (error) {
        console.error('Error fetching camera data:', error);
      }
    };
    fetchCameras();
  }, [user, loading]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking user session
  }

  if (!user) {
    return null; // If user is not authenticated, return null to avoid rendering the page content
  }

  return (
    <div className="map-container">
      <MapboxMap cameras={cameras} />
    </div>
  );
};

export default MapaPage;
