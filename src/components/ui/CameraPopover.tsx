import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Table, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CameraLocation } from '@/lib/utils';

interface CameraPopoverProps {
  onSelect: (camera: CameraLocation) => void;
  trigger: React.ReactNode;
  cameras: CameraLocation[];
  settings: { share: boolean; share_distance: number } | null;
}

const CameraPopover: React.FC<CameraPopoverProps> = ({ onSelect, trigger, cameras = [], settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectCamera = (camera: CameraLocation, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    setIsOpen(false); // Close the popover
    // Delay the onSelect call to ensure the popover state update does not interfere
    setTimeout(() => onSelect(camera), 0);
  };

  return (
    <Popover open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="bg-[#1A1C1F] p-1 mb-0 text-white shadow-md border border-[#262B31] rounded-lg w-64 h-flex">
        <ScrollArea className="custom-scroll-area max-h-60 h-flex">
          <Table>
            <TableBody>
              {cameras.map((camera) => (
                <TableRow
                  key={camera.id}
                  className="cursor-pointer hover:bg-[#262B31] border-b border-[#262B31]"
                  onClick={(e) => handleSelectCamera(camera, e)}
                >
                  <TableCell>{camera.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CameraPopover;
