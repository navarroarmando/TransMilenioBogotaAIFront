import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ml-1 ${className}`}>
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        aria-label="Información"
      >
        <Info size={16} />
      </button>
      {isVisible && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-80 p-3 pl-4 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50">
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
