// components/ui/Timeline.tsx
import React from 'react';

interface TimelineProps {
  recordings: Recording[];
  onThumbnailClick: (recording: Recording) => void;
}

const Timeline: React.FC<TimelineProps> = ({ recordings, onThumbnailClick }) => {
  return (
    <div className="timeline-container">
      {recordings.map((recording) => (
        <div key={recording.path} className="timeline-thumbnail" onClick={() => onThumbnailClick(recording)}>
          <img src={recording.thumbnail} alt="thumbnail" />
        </div>
      ))}
    </div>
  );
};

export default Timeline;
