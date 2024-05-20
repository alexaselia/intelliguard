// src/components/ui/ReactPlayerComponent.tsx
import React from 'react';
import ReactPlayer from 'react-player';

interface ReactPlayerComponentProps {
  src: string;
}

const ReactPlayerComponent: React.FC<ReactPlayerComponentProps> = ({ src }) => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        url={src}
        className="react-player"
        controls
        width="100%"
        height="100%"
        config={{
          file: {
            forceHLS: true,
            attributes: {
              crossOrigin: 'anonymous'
            }
          },
        }}
      />
    </div>
  );
};

export default ReactPlayerComponent;
