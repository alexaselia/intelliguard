import { NextResponse } from 'next/server';
import ExcelJS, { CellValue } from 'exceljs';
import path from 'path';
import fs from 'fs';

interface CameraData {
  name: string;
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
  latitude: number;
  longitude: number;
  shared: boolean;
  ownership: boolean;
  url: string;
  category: string;
}

export async function GET() {
  const filePath = path.resolve('public/cameras.xlsx');
  const workbook = new ExcelJS.Workbook();

  console.log('Reading file from:', filePath);

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    const data: CameraData[] = [];

    const getCellValueAsString = (cellValue: CellValue): string => {
      if (typeof cellValue === 'object' && cellValue !== null && 'text' in cellValue) {
        return cellValue.text;
      }
      return cellValue?.toString() || '';
    };

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const name = row.getCell(1).value as string;
        const id = row.getCell(2).value as string;
        const ip = row.getCell(3).value as string;
        const codec = row.getCell(4).value as string;
        const size = row.getCell(5).value as string;
        const fps = row.getCell(6).value as number;
        const latitude = row.getCell(7).value as number;
        const longitude = row.getCell(8).value as number;
        const shared = row.getCell(9).value?.toString().toLowerCase() === 'true';
        const ownership = row.getCell(10).value?.toString().toLowerCase() === 'true';
        const url = getCellValueAsString(row.getCell(11).value);

        console.log('Row data:', { name, id, ip, codec, size, fps, latitude, longitude, shared, ownership, url });

        const category = ownership ? 'Casa' : (shared ? 'Comunidade' : '');

        if (category) {
          data.push({
            name,
            id,
            ip,
            codec,
            size,
            fps,
            latitude,
            longitude,
            shared,
            ownership,
            url,
            category,
          });
        }
      }
    });

    console.log('Data collected:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json({ error: 'Failed to read Excel file' }, { status: 500 });
  }
}
