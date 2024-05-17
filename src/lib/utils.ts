// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ExcelJS from 'exceljs';

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
}

export const readExcelFile = async (filePath: string): Promise<CameraData[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const data: CameraData[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      data.push({
        name: row.getCell(2).value as string,
        id: row.getCell(3).value as string,
        ip: row.getCell(4).value as string,
        codec: row.getCell(5).value as string,
        size: row.getCell(6).value as string,
        fps: row.getCell(7).value as number,
      });
    }
  });

  return data;
};
