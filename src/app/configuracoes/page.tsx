"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { flexRender, ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Configuracoes {
  name: string;
  share: boolean;
  share_distance: number;
}

interface Camera {
  id: string;
  name: string;
  shared: boolean;
  ownership: string;
}

const Configuracoes: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Configuracoes | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [hasSharedCameras, setHasSharedCameras] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (loading || !user) return;

      try {
        console.log('Fetching settings for user:', user.id);
        const { data, error } = await supabase
          .from('people')
          .select('name, share, share_distance')
          .eq('user_uid', user.id)
          .single();

        if (error) {
          console.error('Failed to fetch user settings:', error);
        } else if (!data) {
          console.error('No user settings found for user:', user.id);
        } else {
          console.log('Fetched settings:', data);
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };
    fetchSettings();
  }, [user, loading]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('cameras')
          .select('*')
          .eq('ownership', user.id);

        if (error) {
          console.error('Failed to fetch cameras:', error);
        } else {
          setCameras(data);
          const shared = data.some((camera: Camera) => camera.shared);
          setHasSharedCameras(shared);
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
      }
    };
    fetchCameras();
  }, [user]);

  const handleShareChange = async (checked: boolean) => {
    if (!settings) return;

    console.log('Toggling share to:', checked);

    const updatedSettings = { ...settings, share: checked };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('people')
        .update({ share: checked })
        .eq('user_uid', user.id);

      if (error) {
        console.error('Failed to update share setting:', error);
      }
    } catch (error) {
      console.error('Error updating share setting:', error);
    }
  };

  const handleShareDistanceChange = async (value: number) => {
    if (!settings) return;

    console.log('Updating share distance to:', value);

    const updatedSettings = { ...settings, share_distance: value };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('people')
        .update({ share_distance: value })
        .eq('user_uid', user.id);

      if (error) {
        console.error('Failed to update share distance setting:', error);
      }
    } catch (error) {
      console.error('Error updating share distance setting:', error);
    }
  };

  const handleCameraShareChange = async (cameraId: string, shared: boolean) => {
    try {
      const { error } = await supabase
        .from('cameras')
        .update({ shared })
        .eq('id', cameraId);

      if (error) {
        console.error('Failed to update camera share setting:', error);
      } else {
        // Re-fetch cameras after updating
        const { data, error: fetchError } = await supabase
          .from('cameras')
          .select('*')
          .eq('ownership', user!.id);

        if (fetchError) {
          console.error('Error re-fetching cameras:', fetchError);
        } else {
          setCameras(data);
          const shared = data.some((camera: Camera) => camera.shared);
          setHasSharedCameras(shared);
        }
      }
    } catch (error) {
      console.error('Error updating camera share setting:', error);
    }
  };

  const columns: ColumnDef<Camera>[] = [
    {
      accessorKey: 'name',
      header: 'Câmeras',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'shared',
      header: 'Compartilhado',
      cell: ({ row }) => (
        <Checkbox
          checked={row.getValue('shared')}
          onCheckedChange={(value) =>
            handleCameraShareChange(row.original.id, value as boolean)
          }
        />
      ),
    },
  ];

  const table = useReactTable({
    data: cameras,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading || !settings) {
    return <p>Loading...</p>;
  }

  console.log('Current settings:', settings);

  return (
    <div className="p-6 pt-4">
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
        .fade-enter {
          opacity: 0;
          transform: translateY(-20px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400">Gerencie suas configurações de usuário.</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400">Nome</label>
          <p className="text-lg font-semibold text-white">{settings.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400">Compartilhar</label>
          <div className="flex items-center space-x-2">
            <Switch
              id="share-switch"
              checked={settings.share}
              onCheckedChange={handleShareChange}
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
                settings.share ? 'bg-white' : 'bg-gray-400'
              }`}
            />
            <span className="text-sm font-medium text-gray-400">
              {settings.share ? 'On' : 'Off'}
            </span>
          </div>
          <TransitionGroup>
            {settings.share && !hasSharedCameras && (
              <CSSTransition timeout={300} classNames="fade">
                <Alert className="mt-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    Para ver as câmeras da comunidade, você precisa compartilhar ao menos uma câmera própria. Ligue o compartilhamento de alguma câmera logo abaixo. (:
                  </AlertDescription>
                </Alert>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
        <TransitionGroup>
          {settings.share && (
            <CSSTransition timeout={300} classNames="fade">
              <div>
                <label className="block text-sm font-medium text-gray-400">Distância de Compartilhamento</label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[settings.share_distance]}
                    min={50}
                    max={1000}
                    step={10}
                    className="w-[60%]"
                    onValueChange={(values) => handleShareDistanceChange(values[0])}
                  />
                  <input
                    type="number"
                    value={settings.share_distance}
                    min={50}
                    max={1000}
                    onChange={(e) => handleShareDistanceChange(Number(e.target.value))}
                    className="w-20 p-2 border border-gray-700 rounded bg-background text-white"
                  />
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
        <TransitionGroup>
          {settings.share && (
            <CSSTransition timeout={300} classNames="fade">
              <div className="mt-6">
                <h2 className="text-lg font-medium text-white">Minhas Câmeras</h2>
                <div className="rounded-md mt-4">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default Configuracoes;
