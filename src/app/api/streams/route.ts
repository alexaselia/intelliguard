import { NextResponse } from 'next/server';
import axios from 'axios';
import xml2js from 'xml2js';

// Fetch the RTMP stat data from the NGINX server
async function fetchRTMPStat() {
  const response = await axios.get('http://nginx.megaguardiao.com.br:8080/stat');
  return response.data;
}

// Parse the RTMP stat XML data to get the list of streams
async function parseRTMPStat(xmlData: string) {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);
  const streams = result.rtmp.server[0].application[0].live[0].stream || [];
  return streams.map((stream: any) => ({
    id: stream.name[0],
    name: stream.name[0],
    streamUrl: `https://nginx.megaguardiao.com.br/live/hls/${stream.name[0]}.m3u8`
  }));
}

export async function GET() {
  try {
    const xmlData = await fetchRTMPStat();
    console.log('Fetched XML Data:', xmlData); // Debug log
    const streams = await parseRTMPStat(xmlData);
    console.log('Parsed Streams:', streams); // Debug log
    return NextResponse.json(streams);
  } catch (error) {
    console.error('Failed to fetch or parse RTMP stat data:', error);
    return NextResponse.json([]);
  }
}
