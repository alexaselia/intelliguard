import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { cameraId: string } }) {
  const { cameraId } = params;
  const playbackDir = path.join(process.cwd(), 'public', 'recordings', cameraId);

  if (!fs.existsSync(playbackDir)) {
    return NextResponse.json({ recordings: [] });
  }

  const recordings = fs.readdirSync(playbackDir).map(folder => {
    const startTime = new Date(
      parseInt(folder.slice(0, 4)), // year
      parseInt(folder.slice(4, 6)) - 1, // month
      parseInt(folder.slice(6, 8)), // day
      parseInt(folder.slice(9, 11)), // hour
      parseInt(folder.slice(11, 13)) // minute
    ).getTime();

    return {
      time: folder,
      path: `/recordings/${cameraId}/${folder}/index.m3u8`,
      startTime: startTime
    };
  });

  return NextResponse.json({ recordings });
}
