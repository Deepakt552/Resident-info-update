import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_BADGES = {
    pending: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: 'Pending' },
    approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Approved' },
    rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
    completed: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Completed' },
    draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', label: 'Draft' },
};

export default function RecentActivities({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity) => {
                    const badge = STATUS_BADGES[activity.status] || STATUS_BADGES.draft;
                    
                    return (
                        <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {activity.tenant_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.tenant_name}
                                        </p>
                                        <span className={`px-2 py-1 text-xs rounded-full ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {activity.property_name} • {activity.inspection_type}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {activity.created_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}