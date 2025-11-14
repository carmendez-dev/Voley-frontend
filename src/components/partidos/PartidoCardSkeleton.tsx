import React from 'react';

const PartidoCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Info skeleton */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Badge skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-end space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default PartidoCardSkeleton;
