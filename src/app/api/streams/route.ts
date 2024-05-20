// src/app/api/streams/route.ts
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

const streams = [
  { id: 's-matriz', name: 'Matriz', streamUrl: 'http://nginx.megaguardiao.com.br/live/hls/s-matriz.m3u8' },
  { id: 's-ozeaisportao', name: 'Ozeais Portao', streamUrl: 'http://nginx.megaguardiao.com.br/live/hls/s-ozeaisportao.m3u8' },
  { id: 's-lojagil', name: 'Loja Gil', streamUrl: 'http://nginx.megaguardiao.com.br/live/hls/s-lojagil.m3u8' },
];

const MAX_RETRIES = 10;
const RETRY_DELAY = 1000; // 1000 = 1 second

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${url}:`, error);
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }
  return false;
}

export async function GET() {
  const results = [];

  for (const stream of streams) {
    const available = await fetchWithRetry(stream.streamUrl);
    if (available) {
      results.push(stream);
    }
  }

  return NextResponse.json(results);
}
