import mapboxgl from 'mapbox-gl';
import { CameraLocation } from '@/lib/utils';
import * as turf from '@turf/turf';

const markersMap: Record<string, mapboxgl.Marker> = {};
const pulseLayers: Record<string, string> = {};
let pulseAnimationEnabled = false;
let pulseAnimationFrameId: number | null = null;

export const createMarkers = (
  map: mapboxgl.Map,
  cameras: CameraLocation[],
  user: any,
  settings: { share: boolean; share_distance: number } | null,
  setSelectedCamera: (camera: CameraLocation | null) => void,
  setModalOpen: (open: boolean) => void
) => {
  cameras.forEach((camera) => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(${camera.thumbnail})`;
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'cover';
    el.style.borderRadius = '50%';
    el.style.border = camera.ownership === user.id ? '2px solid #22C55E' : 'none';
    el.style.position = 'absolute';
    el.style.zIndex = '0';
    el.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

    const marker = new mapboxgl.Marker(el)
      .setLngLat([camera.longitude, camera.latitude])
      .addTo(map);

    marker.getElement().addEventListener('click', () => {
      setSelectedCamera(camera);
      setModalOpen(true);
    });

    markersMap[camera.id] = marker;

    el.dataset.markerId = camera.id;
  });
};

export const removeMarkers = (map: mapboxgl.Map, cameras: CameraLocation[]) => {
  cameras.forEach((camera) => {
    const marker = markersMap[camera.id];
    if (marker) {
      marker.remove();
      delete markersMap[camera.id];
    }
  });
};

export const togglePulseAnimation = async (map: mapboxgl.Map, cameras: CameraLocation[], user: any, settings: { share: boolean; share_distance: number } | null, enabled: boolean) => {
  if (!settings) {
    console.error('Settings are required to toggle pulse animation');
    return;
  }

  pulseAnimationEnabled = enabled;
  if (enabled) {
    for (const camera of cameras) {
      if (camera.ownership === user.id) {
        const pulseLayerId = `pulse-layer-${camera.id}`;
        pulseLayers[camera.id] = pulseLayerId;
        animatePulse(map, [camera.longitude, camera.latitude], settings.share_distance, pulseLayerId);
      }
    }
  } else {
    for (const camera of cameras) {
      const pulseLayerId = pulseLayers[camera.id];
      if (pulseLayerId && map.getLayer(pulseLayerId)) {
        map.removeLayer(pulseLayerId);
        map.removeSource(pulseLayerId);
        delete pulseLayers[camera.id];
      }
    }
  }
};

const animatePulse = (map: mapboxgl.Map, center: [number, number], radiusInMeters: number, pulseLayerId: string) => {
  let radius = 0;
  const maxRadius = radiusInMeters;
  const duration = 3000;
  const fps = 60; // Frames per second for the animation

  const animate = () => {
    radius += maxRadius / (duration / (1000 / fps)); // Increment radius based on the frame rate

    if (radius > maxRadius) {
      radius = 0; // Reset radius
    }

    const circle = createCircle(center, radius);
    const opacity = 1 - (radius / maxRadius); // Smooth transition for opacity

    if (map.getSource(pulseLayerId)) {
      (map.getSource(pulseLayerId) as mapboxgl.GeoJSONSource).setData(circle);
      map.setPaintProperty(pulseLayerId, 'line-opacity', opacity);
    } else {
      map.addLayer({
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

    if (pulseAnimationEnabled) {
      pulseAnimationFrameId = requestAnimationFrame(animate);
    } else {
      if (map.getLayer(pulseLayerId)) {
        map.removeLayer(pulseLayerId);
        map.removeSource(pulseLayerId);
      }
    }
  };

  animate();
};

const createCircle = (center: [number, number], radiusInMeters: number) => {
  return turf.circle(center, radiusInMeters / 1000, {
    steps: 64,
    units: 'kilometers',
  });
};
