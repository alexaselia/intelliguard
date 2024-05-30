// src/app/mapa/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { readCamerasFromExcel, CameraLocation } from '@/lib/utils';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), { ssr: false });

const MapaPage: React.FC = () => {
  const [cameras, setCameras] = useState<CameraLocation[]>([]);

  useEffect(() => {
    const loadCameras = async () => {
      const cameraData = await readCamerasFromExcel();
      setCameras(cameraData.filter(camera => camera.shared)); // Filter only shared cameras
    };
    loadCameras();
  }, []);

  return (
    <div className="map-container">
      <MapboxMap cameras={cameras} />
    </div>
  );
};

export default MapaPage;
