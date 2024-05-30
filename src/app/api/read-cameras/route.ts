// src/app/api/read-cameras/route.ts
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

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
    const data = [];

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
        const shared = row.getCell(9).value.toString().toLowerCase() === 'true';
        const ownership = row.getCell(10).value.toString().toLowerCase() === 'true';
        const url = row.getCell(11).value?.text || row.getCell(11).value || '';

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
