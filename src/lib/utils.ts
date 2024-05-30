// src/lib/utils.ts
import ExcelJS from 'exceljs';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CameraData {
  name: string;
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
  url: string;
}

export const readExcelFile = async (filePath: string): Promise<CameraData[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const data: CameraData[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      data.push({
        name: row.getCell(1).value as string, // Column A
        id: row.getCell(2).value as string,   // Column B
        ip: row.getCell(3).value as string,   // Column C
        codec: row.getCell(4).value as string, // Column D
        size: row.getCell(5).value as string,  // Column E
        fps: row.getCell(6).value as number,   // Column F
        url: row.getCell(11).value as string,  // Column K
      });
    }
  });

  return data;
};

export interface CameraLocation {
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
  name: string;
  latitude: number;
  longitude: number;
  shared: boolean;
  ownership: boolean;
  url: string;
  category: string;
}

export const readCamerasFromExcel = async (): Promise<CameraLocation[]> => {
  const response = await fetch('/cameras.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.worksheets[0];
  const cameras: CameraLocation[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const camera: CameraLocation = {
      name: row.getCell(1).value?.toString() || '',   // Column A
      id: row.getCell(2).value?.toString() || '',     // Column B
      ip: row.getCell(3).value?.toString() || '',     // Column C
      codec: row.getCell(4).value?.toString() || '',  // Column D
      size: row.getCell(5).value?.toString() || '',   // Column E
      fps: parseFloat(row.getCell(6).value?.toString() || '0'),   // Column F
      latitude: parseFloat(row.getCell(7).value?.toString() || '0'), // Column G
      longitude: parseFloat(row.getCell(8).value?.toString() || '0'), // Column H
      shared: row.getCell(9).value?.toString().toLowerCase() === 'true',
      ownership: row.getCell(10).value?.toString().toLowerCase() === 'true',
      url: row.getCell(11).value?.toString() || '',  // Column K
      category: row.getCell(10).value?.toString().toLowerCase() === 'true' ? 'Casa' : (row.getCell(9).value?.toString().toLowerCase() === 'true' ? 'Comunidade' : ''),
    };

    if (camera.category) {
      cameras.push(camera);
    }
  });

  return cameras;
};
