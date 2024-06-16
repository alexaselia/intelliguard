import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    const headers = new Headers();
    headers.set('Content-Type', response.headers['content-type']);
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(response.data, {
      headers,
      status: response.status,
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json({ error: 'Error fetching URL' }, { status: 500 });
  }
}
