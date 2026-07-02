import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-96"></div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-96"></div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-96"></div>
            </div>
        </div>
    );
}