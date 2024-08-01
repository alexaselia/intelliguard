// components/ui/RollingFilm.tsx
import React, { useEffect, useState } from 'react';

const RollingFilm: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const res = await fetch('/frame'); // Fetches from the public folder
        const text = await res.text();
        const fileMatches = text.match(/"[^"]*\.jpg"/g);
        const files = fileMatches ? fileMatches.map((match) => match.replace(/"/g, '')) : [];
        files.sort((a, b) => {
          const dateA = a.match(/-(\d{8})-(\d{6})/);
          const dateB = b.match(/-(\d{8})-(\d{6})/);
          return dateA && dateB ? dateA[0].localeCompare(dateB[0]) : 0;
        });
        setFiles(files);
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };

    fetchFrames();
  }, []);

  return (
    <div className="rollingFilmContainer">
      {files.map((file, index) => (
        <img key={index} src={`/frame/${file}`} alt={`frame-${index}`} className={styles.rollingFilmFrame} />
      ))}
    </div>
  );
};

export default RollingFilm;
