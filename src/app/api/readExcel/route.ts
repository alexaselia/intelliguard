import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';

interface CameraData {
  name: string;
  id: string;
  ip: string;
  codec: string;
  size: string;
  fps: number;
}

const getValueAsString = (value: any) => {
  if (value && typeof value === 'object') {
    if (value.hasOwnProperty('text')) {
      return value.text;
    } else {
      return JSON.stringify(value);
    }
  }
  return String(value);
};

export async function GET() {
  const filePath = path.resolve('public/ExampleDB.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const data: CameraData[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      data.push({
        name: getValueAsString(row.getCell(2).value),
        id: getValueAsString(row.getCell(3).value),
        ip: getValueAsString(row.getCell(4).value),
        codec: getValueAsString(row.getCell(5).value),
        size: getValueAsString(row.getCell(6).value),
        fps: Number(row.getCell(7).value),
      });
    }
  });

  return NextResponse.json(data);
}
