import React, { useMemo } from 'react';
import { flexRender, ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface Camera {
  id: string;
  name: string;
  shared: boolean;
}

interface CameraSettingsProps {
  cameras: Camera[];
  onCameraShareChange: (cameraId: string, shared: boolean) => void;
}

const CameraSettings: React.FC<CameraSettingsProps> = ({ cameras, onCameraShareChange }) => {
  const sortedCameras = useMemo(() => {
    return [...cameras].sort((a, b) => a.name.localeCompare(b.name));
  }, [cameras]);

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
            onCameraShareChange(row.original.id, value as boolean)
          }
        />
      ),
    },
  ];

  const table = useReactTable({
    data: sortedCameras,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (camera: Camera) => {
    onCameraShareChange(camera.id, !camera.shared);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-white">Minhas Câmeras</h2>
      <div className="rounded-md mt-4 border border-gray-700">
        <Table className="rounded-md">
          <TableHeader className="border-b border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
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
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CameraSettings;
