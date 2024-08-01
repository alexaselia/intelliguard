import axios from 'axios';

export async function fetchRecordingsGroupedByDay(cameraId: string) {
  const url = `/api/playback/${cameraId}`;

  try {
    const response = await axios.get(url);
    const videoFiles = response.data;

    const recordings = videoFiles.map((filePath: string) => {
      // Adjust regex to extract date and time after the first dash
      const match = filePath.match(/-(\d{8})-(\d{6})/);
      if (match) {
        const [_, date, time] = match;
        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6, 8);
        const hours = time.slice(0, 2);
        const minutes = time.slice(2, 4);
        const seconds = time.slice(4, 6);
        const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

        const startTime = Date.parse(formattedTime);

        if (isNaN(startTime)) {
          console.error('Invalid date parsed:', filePath, formattedTime);
          return null;
        }

        return {
          path: `${filePath}`,
          startTime: startTime, // Parse to timestamp
          endTime: startTime + 60000, // Assuming each video is 1 minute, adjust as needed
          time: `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        };
      } else {
        console.error('No valid date-time found in filePath:', filePath);
        return null;
      }
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
