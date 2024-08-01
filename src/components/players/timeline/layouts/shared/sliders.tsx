import React, { useEffect, useState } from 'react';
import { TimeSlider } from '@vidstack/react';

async function fetchAndParseVTT(url: string) {
  const response = await fetch(url);
  const vttText = await response.text();
  const parser = new window.WebVTT.Parser(window, window.vttjs, window.WebVTT.StringDecoder());
  const cues = [];
  parser.oncue = (cue) => cues.push(cue);
  parser.parse(vttText);
  parser.flush();
  return cues;
}

export interface TimeSliderProps {
  vttUrl: string;
}

export function Time({ vttUrl }: TimeSliderProps) {
  const [thumbnails, setThumbnails] = useState<{ start: number; url: string }[]>([]);

  useEffect(() => {
    async function loadVTT() {
      const parsedVTT = await fetchAndParseVTT(vttUrl);
      const cues = parsedVTT.map((cue) => ({
        start: cue.startTime,
        url: cue.text // Assuming the cue text contains the thumbnail URL
      }));
      setThumbnails(cues);
    }

    loadVTT();
  }, [vttUrl]);

  return (
    <TimeSlider.Root className="vds-time-slider vds-slider">
      <TimeSlider.Chapters className="vds-slider-chapters">
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div className="vds-slider-chapter" key={cue.startTime} ref={forwardRef}>
              <TimeSlider.Track className="vds-slider-track" />
              <TimeSlider.TrackFill className="vds-slider-track-fill vds-slider-track" />
              <TimeSlider.Progress className="vds-slider-progress vds-slider-track" />
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb className="vds-slider-thumb" />

      <TimeSlider.Preview className="vds-slider-preview">
        {thumbnails.length > 0 && (
          <TimeSlider.Thumbnail.Root
            className="vds-slider-thumbnail vds-thumbnail"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail.url}
                className="vds-thumbnail-img"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${index * 100}%`,
                  transition: 'left 0.1s linear'
                }}
                alt={`Thumbnail ${index}`}
              />
            ))}
          </TimeSlider.Thumbnail.Root>
        )}

        <TimeSlider.ChapterTitle className="vds-slider-chapter-title" />
        <TimeSlider.Value className="vds-slider-value" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
