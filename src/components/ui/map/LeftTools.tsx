import React, { useState, useRef, useEffect } from 'react';
import { Search, Radar } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

interface LeftToolsProps {
  map: mapboxgl.Map | null;
  pulseActive: boolean;
  onPulseToggle: () => void;
}

const LeftTools: React.FC<LeftToolsProps> = ({ map, pulseActive, onPulseToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const geocoderContainerRef = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (map && geocoderContainerRef.current && searchOpen) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Buscar',
      });

      geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

      geocoder.on('result', (e) => {
        map.flyTo({
          center: e.result.center,
          zoom: 16,
        });
      });

      return () => {
        geocoder.onRemove();
      };
    }
  }, [map, searchOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchButtonRef.current &&
      !searchButtonRef.current.contains(event.target as Node) &&
      geocoderContainerRef.current &&
      !geocoderContainerRef.current.contains(event.target as Node)
    ) {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
      <div className="relative">
        <button
          ref={searchButtonRef}
          className="p-2 rounded-full bg-white hover:bg-gray-200 flex items-center z-10"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search size={16} />
        </button>
        <div
          ref={geocoderContainerRef}
          className={`absolute top-0 left-10 transition-all duration-300 z-10 ${
            searchOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ minWidth: searchOpen ? '300px' : '0', maxWidth: '600px' }}
        ></div>
      </div>
      <button
        className={`p-2 rounded-full ${pulseActive ? 'bg-blue-500 hover:bg-blue-700' : 'bg-white'} hover:bg-gray-200`}
        onClick={onPulseToggle}
      >
        <Radar size={16} />
      </button>
      <style jsx>{`
        .mapboxgl-ctrl-geocoder {
          max-width: none;
          width: 100%;
          max-height: 16;
          border-radius: 20px;
          z-index: 1000;
        }
        .mapboxgl-ctrl-geocoder--input {
          border-radius: 20px;
          padding: 2px 12px;
          font-size: 14px;
        }
        .mapboxgl-ctrl-geocoder--icon-search {
          display: none;
        }
        .mapboxgl-ctrl-geocoder--icon-close {
          right: 10px;
        }
        .mapboxgl-ctrl-geocoder--powered-by,
        .mapboxgl-ctrl-geocoder--powered-by a {
          display: none;
        }

        .mapboxgl-ctrl-geocoder--suggestions {
          font-size: 14px;
        }
      `}</style>
      </div>
  );
};

export default LeftTools;
