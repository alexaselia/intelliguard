import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import CameraPopover from '@/components/ui/CameraPopover'; // Adjust the import path as necessary
import { CameraLocation, readCamerasFromSupabase } from '@/lib/utils'; // Adjust the import path as necessary
import { getDistance } from 'geolib';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import * as turf from '@turf/turf';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGluZ2FsZXgiLCJhIjoiY2pkazZ5d2JjMWNmMTJ4bzZnczk5a3o2ZyJ9.4RpePuCjlpUU7IQSz_Lfug';

interface Camera {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  ip: string;
  codec: string;
  size: string;
  fps: number;
}

const MapboxMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [cameras, setCameras] = useState<CameraLocation[]>([]);

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
      const fetchedCameras = await readCamerasFromSupabase();
      setCameras(fetchedCameras);
    };

    fetchUserSettings();
    fetchCameras();
  }, [user]);

  useEffect(() => {
    if (!settings) return;

    const initialCenter: [number, number] = [-46.8489, -23.5015];
    const ownerCamera = cameras.find(camera => camera.ownership === user?.id);
    if (ownerCamera) {
      initialCenter[0] = ownerCamera.longitude;
      initialCenter[1] = ownerCamera.latitude;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/testingalex/clwgh4lz802mr01qgc3tg8tmn',
      center: initialCenter,
      zoom: 3,
      pitch: 45,
      bearing: 0,
      fadeDuration: 0,
    });

    // Add geocoder (search bar) to the top-left position
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search here', // Adjust placeholder text
      zoom: 16, // Adjust zoom level if needed
    });
    mapRef.current.addControl(geocoder, 'top-left');

    const searchBox = document.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLElement;
    if (searchBox) {
      searchBox.style.width = '250px'; // Adjust width to make it smaller
    }

    // Add navigation control (zoom and rotation) below the search bar
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    const filterCameras = cameras.filter(camera => {
      if (camera.ownership === user?.id) return true; // Always show the user's own cameras

      if (camera.shared) {
        const isInUserDistance = cameras.some(userCamera => {
          if (userCamera.ownership === user?.id) {
            const distance = getDistance(
              { latitude: userCamera.latitude, longitude: userCamera.longitude },
              { latitude: camera.latitude, longitude: camera.longitude }
            );
            return distance <= settings.share_distance;
          }
          return false;
        });

        return isInUserDistance;
      }

      return false;
    });

    const createCircle = (center: [number, number], radiusInMeters: number) => {
      return turf.circle(center, radiusInMeters / 1000, {
        steps: 64,
        units: 'kilometers',
      });
    };

    const animatePulse = (center: [number, number], radiusInMeters: number) => {
      let radius = 0;
      const maxRadius = radiusInMeters;
      const duration = 3000;
      const pulseLayerId = 'pulse-layer';

      const animate = () => {
        radius += maxRadius / (duration / 16);

        if (radius > maxRadius) {
          radius = 0;
        }

        const circle = createCircle(center, radius);

        if (mapRef.current.getSource(pulseLayerId)) {
          (mapRef.current.getSource(pulseLayerId) as mapboxgl.GeoJSONSource).setData(circle);
        } else {
          mapRef.current.addLayer({
            id: pulseLayerId,
            type: 'fill',
            source: {
              type: 'geojson',
              data: circle,
            },
            paint: {
              'fill-color': 'rgba(140, 197, 231, 0.5)',
              'fill-opacity': 0.5,
            },
          });
        }

        requestAnimationFrame(animate);
      };

      animate();
    };

    mapRef.current.on('load', () => {
      filterCameras.forEach((camera) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(/icons/video-camera.png)';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = '100%';
        el.style.position = 'absolute';
        el.style.zIndex = '0';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([camera.longitude, camera.latitude])
          .addTo(mapRef.current!);

        marker.getElement().addEventListener('click', () => {
          setSelectedCamera(camera);
          setModalOpen(true);
        });
      });

      if (ownerCamera) {
        mapRef.current!.flyTo({
          center: [ownerCamera.longitude, ownerCamera.latitude],
          zoom: 16,
          essential: true,
        });
      }

      if (ownerCamera && settings.share_distance) {
        animatePulse([ownerCamera.longitude, ownerCamera.latitude], settings.share_distance);
      }
    });

    return () => mapRef.current?.remove();
  }, [cameras, settings, user]);

  const handleSelectCamera = (camera: CameraLocation) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [camera.longitude, camera.latitude],
        zoom: 16,
        essential: true,
      });
      setSelectedCamera(camera);
      setModalOpen(true);
    }
  };

  return (
    <>
      <div ref={mapContainerRef} className="map-container w-full h-full relative" />
      <div className="top-left-controls absolute top-4 left-4 z-10">
        <div id="geocoder-container" />
      </div>
      <div className="top-left-controls absolute top-20 left-4 z-10">
        <div id="navigation-container" />
      </div>
      <div className="top-right-controls absolute top-4 right-4 z-10">
        <CameraPopover
          onSelect={handleSelectCamera}
          trigger={
            <Button className="menu-button bg-white hover:bg-gray-200">
              <img src="/icons/menu.svg" alt="Menu" />
            </Button>
          }
        />
      </div>
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
        {selectedCamera && (
          <div>
            <h2>{selectedCamera.name}</h2>
            <p>IP: {selectedCamera.ip}</p>
            <p>Codec: {selectedCamera.codec}</p>
            <p>Size: {selectedCamera.size}</p>
            <p>FPS: {selectedCamera.fps}</p>
          </div>
        )}
      </Modal>
      <style jsx>{`
        @media (max-width: 640px) {
          .top-left-controls {
            left: 2%;
            top: 2%;
          }
          .top-right-controls {
            right: 2%;
            top: 2%;
          }
          .menu-button {
            padding: 0.5rem;
            border-radius: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default MapboxMap;
