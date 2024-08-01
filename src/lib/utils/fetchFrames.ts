// lib/utils/fetchFrames.ts
import axios from 'axios';

export async function fetchFrames() {
  const url = '/api/frames';

  try {
    const response = await axios.get(url);
    const files = response.data;

    const sortedFiles = files.sort((a: string, b: string) => {
      const dateA = a.match(/-(\d{8})-(\d{6})/);
      const dateB = b.match(/-(\d{8})-(\d{6})/);
      return dateA && dateB ? dateA[0].localeCompare(dateB[0]) : 0;
    });

    return sortedFiles;
  } catch (error) {
    console.error('Error fetching frame files:', error);
    throw new Error('Error fetching frame files');
  }
}
