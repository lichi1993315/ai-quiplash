import React from 'react';
import { Bot } from 'lucide-react';

interface PlayerAvatarProps {
  player: string;
  avatar?: string;
  isAI: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  avatar,
  isAI,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <div className="flex items-center space-x-2">
      {avatar && (
        <img
          src={avatar}
          alt={`${player}'s avatar`}
          className={`${sizeClasses[size]} rounded-full`}
        />
      )}
      <span className="font-medium">{player}</span>
      {isAI && <Bot className="w-4 h-4 text-blue-500" />}
    </div>
  );
};