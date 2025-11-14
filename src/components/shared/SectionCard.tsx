import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'indigo';
  onClick: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:border-green-400 hover:shadow-green-100'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:border-blue-400 hover:shadow-blue-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      border: 'border-indigo-200',
      hover: 'hover:border-indigo-400 hover:shadow-indigo-100'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:border-purple-400 hover:shadow-purple-100'
    }
  };

  const classes = colorClasses[color];

  return (
    <button
      onClick={onClick}
      className={`
        w-full bg-white rounded-2xl shadow-lg p-8
        border-2 ${classes.border}
        transition-all duration-300
        hover:shadow-2xl hover:scale-105 ${classes.hover}
        cursor-pointer
        text-left
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-${color}-500
      `}
    >
      {/* Icon Container */}
      <div className={`${classes.bg} w-20 h-20 rounded-xl flex items-center justify-center mb-6`}>
        <Icon className={`${classes.icon} w-10 h-10`} />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

      {/* Arrow Indicator */}
      <div className="mt-6 flex items-center text-sm font-medium text-gray-500">
        <span>Acceder</span>
        <svg
          className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
};

export default SectionCard;
