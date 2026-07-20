// resources/js/Components/NotificationItem.jsx

import React from 'react';
import { Building2, MapPin, Clock } from 'lucide-react';

const NotificationItem = ({ notification, onClick }) => {
    const { resident, formatted_time, read } = notification;
    const isUnread = !read;

    return (
        <div
            onClick={onClick}
            className={`
                px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer
                transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50
                ${isUnread ? 'bg-red-50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-800'}
                ${isUnread ? 'hover:bg-red-100 dark:hover:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                    <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center
                        ${isUnread ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}
                    `}>
                        <Building2
                            size={16}
                            className={isUnread ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <h4 className={`
                                text-sm font-medium truncate
                                ${isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}
                            `}>
                                Resident Signup
                                {isUnread && (
                                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse" />
                                )}
                            </h4>

                            <div className="mt-1 space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-[#22346e] dark:text-gray-300">
                                        ID:
                                    </span>
                                    <span>{resident.uid}</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <Building2 size={12} className="flex-shrink-0" />
                                    <span className="font-medium">Property:</span>
                                    <span className="truncate">{resident.property_name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                            <Clock size={12} />
                            <span>{formatted_time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;