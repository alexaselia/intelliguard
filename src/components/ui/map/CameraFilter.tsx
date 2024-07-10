import React from 'react';
import { CameraLocation } from '@/lib/utils';
import CameraPopover from '@/components/ui/CameraPopover';
import { Menu } from 'lucide-react';

const CameraFilter: React.FC<CameraFilterProps> = ({
  casaActive,
  comunidadeActive,
  onCasaToggle,
  onComunidadeToggle,
  onSelectCamera,
  casaCameras,
  comunidadeCameras,
}) => {
  return (
    <div className="filter-container absolute top-4 right-4 z-9 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
      <div className="flex space-x-2 h-8 md:h-10">
        <button
          onClick={() => {
            console.log("Casa toggle clicked");
            onCasaToggle();
          }}
          className={`text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center ${
            casaActive
              ? 'bg-[#0E1F3B] text-[#3B82F6] border border-[#3B82F6]'
              : 'bg-[#242B33] text-gray-400 border border-gray-400 border-opacity-20 hover:bg-gray-600 hover:text-white'
          }`}
        >
          Casa
          <CameraPopover
            onSelect={(camera) => {
              console.log("Camera selected from popover:", camera);
              onSelectCamera(camera);
            }}
            cameras={casaCameras}
            settings={null}
            trigger={
              <div // Changed to div
                className="ml-1 p-1 md:ml-2 md:p-2 rounded-full hover:bg-gray-600 hover:bg-opacity-20 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Popover trigger clicked");
                  if (!casaActive) onCasaToggle();
                }}
              >
                <Menu size={16} />
              </div>
            }
          />
        </button>
        <button
          onClick={() => {
            console.log("Comunidade toggle clicked");
            onComunidadeToggle();
          }}
          className={`text-xs md:text-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center ${
            comunidadeActive
              ? 'bg-[#0E1F3B] text-[#3B82F6] border border-[#3B82F6]'
              : 'bg-[#242B33] text-gray-400 border border-gray-400 border-opacity-20 hover:bg-gray-600 hover:text-white'
          }`}
        >
          Comunidade
          <CameraPopover
            onSelect={(camera) => {
              console.log("Camera selected from popover:", camera);
              onSelectCamera(camera);
            }}
            cameras={comunidadeCameras}
            settings={null}
            trigger={
              <div // Changed to div
                className="ml-1 p-1 md:ml-2 md:p-2 rounded-full hover:bg-gray-600 hover:bg-opacity-20 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Popover trigger clicked");
                  if (!comunidadeActive) onComunidadeToggle();
                }}
              >
                <Menu size={16} />
              </div>
            }
          />
        </button>
      </div>
      <style jsx>{`
        .filter-container {
          padding: 0.2rem;
          background: rgba(0, 0, 0, 0);
          border-radius: 9999px;
        }
        @media (max-width: 640px) {
          .filter-container {
            top: 2%;
            right: 2%;
          }
        }
      `}</style>
    </div>
  );
};

export default CameraFilter;
