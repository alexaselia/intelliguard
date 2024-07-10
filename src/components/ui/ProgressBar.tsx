// components/ui/ProgressBar.tsx
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="fixed center w-full z-50">
      <Progress value={progress} />
    </div>
  );
};

export default ProgressBar;
