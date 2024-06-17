import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import CameraPopover from '@/components/ui/CameraPopover';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import { CameraLocation } from '@/lib/utils';
import { getDistance } from 'geolib';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import * as turf from '@turf/turf';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGluZ2FsZXgiLCJhIjoiY2pkazZ5d2JjMWNmMTJ4bzZnczk5a3o2ZyJ9.4RpePuCjlpUU7IQSz_Lfug';

interface MapboxMapProps {
  cameras: CameraLocation[];
}

const MapboxMap: React.FC<MapboxMapProps> = ({ cameras }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [casaStreams, setCasaStreams] = useState<CameraLocation[]>([]);
  const [comunidadeStreams, setComunidadeStreams] = useState<CameraLocation[]>([]);
  const [hasSharedCameras, setHasSharedCameras] = useState(false);

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

    fetchUserSettings();
  }, [user]);

  useEffect(() => {
    if (!settings || !user) return;

    const fetchCasaCameras = () => {
      const userCameras = cameras.filter(camera => user && camera.ownership === user.id);
      setCasaStreams(userCameras);
    };

    const fetchComunidadeCameras = async () => {
      const userSharedCameras = cameras.filter(camera => camera.ownership === user.id && camera.shared);

      if (!settings.share || userSharedCameras.length === 0) {
        setHasSharedCameras(false);
        setComunidadeStreams([]);
        return;
      }

      const sharedCameras = cameras.filter(camera => {
        if (camera.ownership === user.id) return false;

        const isInUserDistance = casaStreams.some(userCamera => {
          const distance = getDistance(
            { latitude: userCamera.latitude, longitude: userCamera.longitude },
            { latitude: camera.latitude, longitude: camera.longitude }
          );
          return distance <= settings.share_distance;
        });

        return isInUserDistance && camera.shared;
      });

      setComunidadeStreams(sharedCameras);
      setHasSharedCameras(true);
    };

    fetchCasaCameras();
    fetchComunidadeCameras();
  }, [settings, cameras, user]);

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
      style: 'https://159.203.23.205:3001/mapbox-style',
      center: initialCenter,
      zoom: 3,
      pitch: 45,
      bearing: 0,
      fadeDuration: 0,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search here',
      zoom: 16,
    });
    mapRef.current.addControl(geocoder, 'top-left');

    const searchBox = document.querySelector('.mapboxgl-ctrl-geocoder--input') as HTMLElement;
    if (searchBox) {
      searchBox.style.width = '250px';
    }

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    const filterCameras = [...casaStreams, ...comunidadeStreams];

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
      const pulseLayerId = `pulse-layer-${center[0]}-${center[1]}`;

      const animate = () => {
        radius += maxRadius / (duration / 16);

        if (radius > maxRadius) {
          radius = 0;
        }

        const circle = createCircle(center, radius);
        const opacity = 1 - (radius / maxRadius);

        if (mapRef.current) {
          if (mapRef.current.getSource(pulseLayerId)) {
            (mapRef.current.getSource(pulseLayerId) as mapboxgl.GeoJSONSource).setData(circle);
            mapRef.current.setPaintProperty(pulseLayerId, 'line-opacity', opacity);
          } else {
            mapRef.current.addLayer({
              id: pulseLayerId,
              type: 'line',
              source: {
                type: 'geojson',
                data: circle,
              },
              paint: {
                'line-color': '#68799E',
                'line-opacity': opacity,
                'line-width': 2,
              },
            });
          }
        }

        requestAnimationFrame(animate);
      };

      animate();
    };

    mapRef.current.on('load', () => {
      filterCameras.forEach((camera) => {
        console.log('Camera Thumbnail URL:', camera.thumbnail);

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${camera.thumbnail})`;
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = 'cover';
        el.style.borderRadius = '50%';
        el.style.border = camera.ownership === user?.id ? '2px solid #22C55E' : 'none';
        el.style.position = 'absolute';
        el.style.zIndex = '0';
        el.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([camera.longitude, camera.latitude])
          .addTo(mapRef.current!);

        marker.getElement().addEventListener('click', () => {
          setSelectedCamera(camera);
          setModalOpen(true);
        });

        if (camera.ownership === user?.id && settings.share_distance) {
          animatePulse([camera.longitude, camera.latitude], settings.share_distance);
        }
      });

      if (ownerCamera) {
        mapRef.current!.flyTo({
          center: [ownerCamera.longitude, ownerCamera.latitude],
          zoom: 16,
          essential: true,
        });
      }
    });

    return () => mapRef.current?.remove();
  }, [casaStreams, comunidadeStreams, settings, user]);

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
      <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
        {selectedCamera && (
          <div className="modal-content">
            <DynamicCameraCard
              name={selectedCamera.name}
              streamUrl={selectedCamera.url}
              cameraId={selectedCamera.id}
              thumbnail={selectedCamera.thumbnail}
            />
          </div>
        )}
      </Modal>
      <style jsx>{`
        .marker {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
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
