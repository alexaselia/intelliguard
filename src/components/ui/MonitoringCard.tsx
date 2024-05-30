import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CameraPopover from './CameraPopover';
import HlsPlayer from './HlsPlayer';
import ExpandButton from './ExpandButton';
import MinimizeButton from './MinimizeButton';

const MonitoringCard: React.FC = () => {
  const [selectedCameras, setSelectedCameras] = useState<(any | null)[]>([null, null, null, null]);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBoxClick = (index: number) => {
    setActiveBox(index);
  };

  const handleSelectCamera = (camera: any) => {
    if (activeBox !== null) {
      const newSelectedCameras = [...selectedCameras];
      newSelectedCameras[activeBox] = camera;
      setSelectedCameras(newSelectedCameras);
      setActiveBox(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`bg-[#262B31] text-white p-0 cursor-pointer ${isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50' : 'h-80'}`}>
      <CardContent className={`relative p-0 ${isFullscreen ? 'h-5/6' : 'h-3/4'}`}>
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full rounded-lg border border-[#262B31]"
        >
          <ResizablePanel defaultSize={50} className="border-[#262B31]">
            <ResizablePanelGroup direction="vertical" className="border-[#262B31]">
              <ResizablePanel defaultSize={50} className="border-[#262B31]">
                <CameraPopover
                  onSelect={handleSelectCamera}
                  trigger={
                    <div
                      className="relative w-full h-full bg-[#1A1C1F] cursor-pointer"
                      onClick={() => handleBoxClick(0)}
                    >
                      {selectedCameras[0] ? (
                        <div className="absolute inset-0">
                          <HlsPlayer src={selectedCameras[0].url} autoPlay className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-sm font-semibold">
                            {selectedCameras[0].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <img src="/icons/addnew.svg" alt="Add new camera" className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  }
                />
              </ResizablePanel>
              <ResizableHandle className="border-[#262B31]" />
              <ResizablePanel defaultSize={50} className="border-[#262B31]">
                <CameraPopover
                  onSelect={handleSelectCamera}
                  trigger={
                    <div
                      className="relative w-full h-full bg-[#1A1C1F] cursor-pointer"
                      onClick={() => handleBoxClick(1)}
                    >
                      {selectedCameras[1] ? (
                        <div className="absolute inset-0">
                          <HlsPlayer src={selectedCameras[1].url} autoPlay className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-sm font-semibold">
                            {selectedCameras[1].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <img src="/icons/addnew.svg" alt="Add new camera" className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  }
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="border-[#262B31]" />
          <ResizablePanel defaultSize={50} className="border-[#262B31]">
            <ResizablePanelGroup direction="vertical" className="border-[#262B31]">
              <ResizablePanel defaultSize={50} className="border-[#262B31]">
                <CameraPopover
                  onSelect={handleSelectCamera}
                  trigger={
                    <div
                      className="relative w-full h-full bg-[#1A1C1F] cursor-pointer"
                      onClick={() => handleBoxClick(2)}
                    >
                      {selectedCameras[2] ? (
                        <div className="absolute inset-0">
                          <HlsPlayer src={selectedCameras[2].url} autoPlay className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-sm font-semibold">
                            {selectedCameras[2].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <img src="/icons/addnew.svg" alt="Add new camera" className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  }
                />
              </ResizablePanel>
              <ResizableHandle className="border-[#262B31]" />
              <ResizablePanel defaultSize={50} className="border-[#262B31]">
                <CameraPopover
                  onSelect={handleSelectCamera}
                  trigger={
                    <div
                      className="relative w-full h-full bg-[#1A1C1F] cursor-pointer"
                      onClick={() => handleBoxClick(3)}
                    >
                      {selectedCameras[3] ? (
                        <div className="absolute inset-0">
                          <HlsPlayer src={selectedCameras[3].url} autoPlay className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 text-sm font-semibold">
                            {selectedCameras[3].name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <img src="/icons/addnew.svg" alt="Add new camera" className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  }
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
      <CardFooter className={`flex justify-between items-center ${isFullscreen ? 'h-20 p-4' : 'h-1/4 p-4'}`}>
        <div className="text-white flex-1">
          <h3 className={`text-lg md:text-base sm:text-sm font-bold mb-1 ${isFullscreen ? 'text-xs' : ''}`}>Monitoring</h3>
          <p className={`text-gray-400 text-sm md:text-xs sm:text-[0.75rem] ${isFullscreen ? 'text-[0.5rem]' : ''}`}>2 of 2 points activated</p>
        </div>
        {isFullscreen ? (
          <MinimizeButton onClick={toggleFullscreen} />
        ) : (
          <ExpandButton onClick={toggleFullscreen} />
        )}
      </CardFooter>
    </Card>
  );
};

export default MonitoringCard;
