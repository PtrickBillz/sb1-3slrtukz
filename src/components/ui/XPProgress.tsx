import React from 'react';

interface XPProgressProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export const XPProgress: React.FC<XPProgressProps> = ({
  currentXP,
  nextLevelXP,
  level,
}) => {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Level {level}</span>
        <span className="text-sm text-gray-500">{currentXP} / {nextLevelXP} XP</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        {nextLevelXP - currentXP} XP to next level
      </p>
    </div>
  );
};