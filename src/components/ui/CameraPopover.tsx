import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Table, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import the ScrollArea component
import { Badge } from '@/components/ui/badge'; // Import the Badge component

interface CameraPopoverProps {
  onSelect: (camera: any) => void;
  trigger: React.ReactNode;
}

const CameraPopover: React.FC<CameraPopoverProps> = ({ onSelect, trigger }) => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch camera data here
    const fetchCameras = async () => {
      const response = await fetch('/api/read-cameras');
      if (response.ok) {
        const data = await response.json();
        setCameras(data);
      } else {
        console.error('Failed to fetch camera data');
      }
    };

    fetchCameras();
  }, []);

  const handleSelectCamera = (camera: any) => {
    onSelect(camera);
    setIsOpen(false); // Close the popover when a camera is selected
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="p-4 bg-[#1A1C1F] text-white shadow-md border border-[#262B31] rounded-lg w-72">
        <ScrollArea className="custom-scroll-area max-h-60">
          <Table>
            {TableHeader.displayName && null}
            <TableBody>
              {cameras.map((camera) => (
                <TableRow
                  key={camera.id}
                  className="cursor-pointer hover:bg-[#262B31] border-b border-[#262B31]"
                  onClick={() => handleSelectCamera(camera)}
                >
                  <TableCell>{camera.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {camera.category}
                    </Badge>
                  </TableCell>
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
