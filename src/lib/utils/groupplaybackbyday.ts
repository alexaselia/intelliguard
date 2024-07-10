import axios from 'axios';

export async function fetchRecordingsGroupedByDay(cameraId: string) {
  const url = `/api/playback/${cameraId}`;

  try {
    const response = await axios.get(url);
    const videoFiles = response.data;

    const recordings = videoFiles.map((filePath: string) => {
      const parts = filePath.match(/(\d{8})-(\d{6})/); // Extract date and time parts
      if (parts) {
        const date = parts[1];
        const time = parts[2];
        const formattedTime = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}Z`;
        return {
          path: `${filePath}`,
          startTime: Date.parse(formattedTime), // Parse to timestamp
          endTime: Date.parse(formattedTime) + 60000, // Assuming each video is 1 minute, adjust as needed
          time: `${date} ${time}`
        };
      }
      return null;
    }).filter(Boolean); // Filter out null values

    const groupedRecordings: { [day: string]: Recording[] } = recordings.reduce((acc, recording) => {
      const day = new Date(recording.startTime).toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(recording);
      return acc;
    }, {});

    return groupedRecordings;
  } catch (error) {
    console.error('Error fetching the file list:', error);
    throw new Error('Error fetching the file list');
  }
}
