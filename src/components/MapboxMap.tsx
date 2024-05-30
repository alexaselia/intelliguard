// src/components/MapboxMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';
import { CameraLocation } from '@/lib/utils'; // Adjust the import path as necessary

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

interface MapboxMapProps {
  cameras: CameraLocation[];
}

const MapboxMap: React.FC<MapboxMapProps> = ({ cameras }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initialCenter: [number, number] = [-46.8489, -23.5015];
    const ownerCamera = cameras.find(camera => camera.ownership);
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
    });
    mapRef.current.addControl(geocoder, 'top-left');

    // Add navigation control (zoom and rotation) below the search bar
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    mapRef.current.on('load', () => {
      cameras.forEach((camera) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
        el.style.width = '50px';
        el.style.height = '50px';
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
    });

    return () => mapRef.current?.remove();
  }, [cameras]);

  return (
    <>
      <div ref={mapContainerRef} className="map-container" style={{ width: '100%', height: '100%' }} />
      <div className="top-right-controls">
        <Button onClick={() => alert('Menu clicked!')} className="menu-button">
          <img src="/icons/menu.svg" alt="Menu" />
        </Button>
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
    </>
  );
};

export default MapboxMap;
