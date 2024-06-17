import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Table, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { getDistance } from 'geolib';

interface CameraPopoverProps {
  onSelect: (camera: any) => void;
  trigger: React.ReactNode;
}

const CameraPopover: React.FC<CameraPopoverProps> = ({ onSelect, trigger }) => {
  const { user } = useAuth();
  const [cameras, setCameras] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<{ share: boolean; share_distance: number } | null>(null);
  const [settingsFetched, setSettingsFetched] = useState(false); // Track if settings have been fetched

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user || settingsFetched) return;

      try {
        const { data: userData, error: userError } = await supabase
          .from('people')
          .select('share, share_distance')
          .eq('user_uid', user.id)
          .single();

        if (userError) {
          console.error('Failed to fetch user settings:', userError);
        } else {
          setSettings(userData);
          setSettingsFetched(true); // Set to true after fetching settings
          console.log('User settings:', userData);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    const fetchCameras = async () => {
      if (!user || !settingsFetched) return; // Wait until settings are fetched

      const { data, error } = await supabase
        .from('cameras')
        .select('*');

      if (error) {
        console.error('Failed to fetch camera data:', error);
      } else {
        const categorizedCameras = data.map((camera) => ({
          ...camera,
          category: camera.ownership === user.id ? 'Casa' : (camera.shared ? 'Comunidade' : ''),
        })).filter(camera => camera.category !== '');

        const filteredCameras = categorizedCameras.filter((camera) => {
          if (camera.category === 'Casa') return true;

          if (camera.category === 'Comunidade' && settings) {
            const isInUserDistance = categorizedCameras.some(userCamera => {
              if (userCamera.ownership === user.id) {
                const distance = getDistance(
                  { latitude: userCamera.latitude, longitude: userCamera.longitude },
                  { latitude: camera.latitude, longitude: camera.longitude }
                );
                return distance <= settings.share_distance;
              }
              return false;
            });

            return isInUserDistance;
          }

          return false;
        });

        // Sort cameras: Casa first, then Comunidade
        filteredCameras.sort((a, b) => {
          if (a.category === 'Casa' && b.category === 'Comunidade') return -1;
          if (a.category === 'Comunidade' && b.category === 'Casa') return 1;
          return 0;
        });

        setCameras(filteredCameras || []);
      }
    };

    fetchUserSettings();
    fetchCameras();
  }, [user, settingsFetched]);

  const handleSelectCamera = (camera: any) => {
    onSelect(camera);
    setIsOpen(false); // Close the popover when a camera is selected
  };

  return (
    <Popover open={isOpen} onOpenChange={(isOpen) => { setIsOpen(isOpen); if (isOpen) setSettingsFetched(false); }}>
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
                      {camera.category === 'Casa' ? 'Casa' : 'Comunidade'}
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
