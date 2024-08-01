import React, { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import MosaicPlayer from './MosaicPlayer';

interface MosaicProps {
  cameras: { id: string, url: string }[];
  onClose: () => void;
}

const Mosaic: React.FC<MosaicProps> = ({ cameras, onClose }) => {
  const [layout, setLayout] = useState(cameras);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col">
      <button
        onClick={onClose}
        className="bg-red-600 text-white p-2 rounded-md self-end m-4"
      >
        Close Mosaic
      </button>
      <div className="flex-grow p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {layout.map((camera) => (
            <div key={camera.id} className="relative">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={100}>
                  <div className="h-full flex flex-col">
                    <MosaicPlayer src={camera.url} autoPlay className="flex-grow" />
                  </div>
                </ResizablePanel>
                <ResizableHandle />
              </ResizablePanelGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mosaic;
