import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <TimerIcon className="w-5 h-5" />
      <span>{timeLeft}s</span>
    </div>
  );
};