import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DynamicCameraCard from '@/components/ui/DynamicCameraCard';
import CameraFilter from './CameraFilter';
import LoadingScreen from './LoadingScreen';
import { CameraLocation } from '@/lib/utils';
import { createMarkers, removeMarkers, togglePulseAnimation } from '@/lib/utils/markerManager';
import Modal from './Modal';
import LeftTools from './LeftTools';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGluZ2FsZXgiLCJhIjoiY2pkazZ5d2JjMWNmMTJ4bzZnczk5a3o2ZyJ9.4RpePuCjlpUU7IQSz_Lfug';

interface MapboxMapProps {
  user: any;
  settings: { share: boolean; share_distance: number } | null;
  casaCameras: CameraLocation[];
  comunidadeCameras: CameraLocation[];
  fetchComunidadeCameras: () => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ user, settings, casaCameras, comunidadeCameras, fetchComunidadeCameras }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [casaActive, setCasaActive] = useState(true);
  const [comunidadeActive, setComunidadeActive] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const initializeMap = async () => {
    setLoadingProgress(10);

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'https://vms.megaguardiao.com.br:3001/mapbox-style',
      center: [-46.8489, -23.5015],
      zoom: 3,
      pitch: 45,
      bearing: 0,
      fadeDuration: 0,
      attributionControl: false,
    });

    setLoadingProgress(30);

    mapRef.current.on('load', () => {
      setLoadingProgress(60);

      // Fly to the first camera in the list if available
      if (casaCameras.length > 0) {
        const firstCamera = casaCameras[0];
        mapRef.current?.flyTo({
          center: [firstCamera.longitude, firstCamera.latitude],
          zoom: 16,
          essential: true,
        });
      }

      setLoadingProgress(80);

      // Add markers with a delay to ensure the map loads properly
      setTimeout(() => {
        createMarkers(mapRef.current!, casaCameras, user, settings, setSelectedCamera, setModalOpen);
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 500);
      }, 1000);
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    initializeMap();

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const handleCasaToggle = () => {
    if (casaActive) {
      removeMarkers(mapRef.current!, casaCameras);
    } else {
      createMarkers(mapRef.current!, casaCameras, user, settings, setSelectedCamera, setModalOpen);
    }
    setCasaActive(!casaActive);
  };

  const handleComunidadeToggle = async () => {
    if (comunidadeActive) {
      removeMarkers(mapRef.current!, comunidadeCameras);
    } else {
      if (comunidadeCameras.length === 0) {
        await fetchComunidadeCameras();
      }
      createMarkers(mapRef.current!, comunidadeCameras, user, settings, setSelectedCamera, setModalOpen);
    }
    setComunidadeActive(!comunidadeActive);
  };

  const handlePulseToggle = async () => {
    setPulseActive(!pulseActive);
    await togglePulseAnimation(mapRef.current!, casaCameras, user, settings, !pulseActive);
  };

  const handleCameraSelect = (camera: CameraLocation) => {
    mapRef.current?.flyTo({
      center: [camera.longitude, camera.latitude],
      zoom: 16,
      essential: true,
    });
    setSelectedCamera(camera);
    setModalOpen(true);
  };

  return (
    <div className="relative h-full">
      {isLoading && <LoadingScreen progress={loadingProgress} />}
      <div ref={mapContainerRef} className="map-container w-full h-full" />
      <LeftTools map={mapRef.current} pulseActive={pulseActive} onPulseToggle={handlePulseToggle} />
      <CameraFilter
        casaActive={casaActive}
        comunidadeActive={comunidadeActive}
        onCasaToggle={handleCasaToggle}
        onComunidadeToggle={handleComunidadeToggle}
        onSelectCamera={handleCameraSelect}
        casaCameras={casaCameras}
        comunidadeCameras={comunidadeCameras}
      />
      {modalOpen && selectedCamera && (
        <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} className="custom-modal" overlayClassName="custom-overlay">
          <div className="modal-content">
            <DynamicCameraCard
              name={selectedCamera.name}
              streamUrl={selectedCamera.url}
              cameraId={selectedCamera.id}
              thumbnail={selectedCamera.thumbnail}
            />
          </div>
        </Modal>
      )}
      <style jsx>{`
        .mapboxgl-ctrl-logo {
          display: none !important;
        }

        .marker {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;
