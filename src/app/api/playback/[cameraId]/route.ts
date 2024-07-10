import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

// Function to compute MD5 hash
const md5Hash = (str: string) => {
  return crypto.createHash('md5').update(str).digest('hex');
};

export async function GET(request: Request, { params }: { params: { cameraId: string } }) {
  const { cameraId } = params;

  // Compute the MD5 hash of the cameraId
  const cameraIdHash = md5Hash(cameraId);

  // Construct the URL to fetch the JSON file for the specific camera using the MD5 hash
  const url = `https://nginx.megaguardiao.com.br/api/${cameraIdHash}.json`;

  try {
    // Fetch the JSON file
    const response = await axios.get(url);
    const videoFiles = response.data;

    // Return the list of video files
    return NextResponse.json(videoFiles);
  } catch (error) {
    console.error('Error fetching the file list:', error);
    return new Response('Error fetching the file list', { status: 500 });
  }
}
