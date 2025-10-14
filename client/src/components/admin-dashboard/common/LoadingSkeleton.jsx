import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div>
            <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
            <div className="w-32 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-16 h-3 bg-gray-200 rounded mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="w-16 h-3 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
          <div className="w-8 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
      </div>
      
      <div className="flex justify-between">
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 border-b">
      <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse">
    <div className="bg-gray-200 p-6 rounded-t-xl">
      <div className="w-48 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-64 h-4 bg-gray-300 rounded"></div>
    </div>
    
    <div className="p-6 space-y-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-full h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      
      <div className="flex justify-end gap-4 pt-6 border-t">
        <div className="w-20 h-10 bg-gray-200 rounded"></div>
        <div className="w-32 h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center animate-pulse">
        <div className="w-16 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
        <div className="w-24 h-4 bg-gray-200 rounded mx-auto"></div>
      </div>
    ))}
  </div>
);

const LoadingSkeleton = {
  Card: SkeletonCard,
  Table: SkeletonTable,
  Form: SkeletonForm,
  Stats: SkeletonStats,
};

export default LoadingSkeleton;