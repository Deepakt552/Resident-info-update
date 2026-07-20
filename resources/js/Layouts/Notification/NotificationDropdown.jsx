// resources/js/Components/NotificationDropdown.jsx

import React from 'react';
import { Bell, RefreshCw, CheckCheck } from 'lucide-react';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({
    isOpen,
    notifications,
    unreadCount,
    hasMore,
    loading,
    refreshing,
    dark,
    onRefresh,
    onClearAll,
    onLoadMore,
    onNotificationClick,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-[380px] sm:w-[420px] max-h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ease-out transform origin-top-right scale-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-[#22346e] dark:text-gray-300" />
                        <h3 className="font-semibold text-[#22346e] dark:text-white">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            disabled={refreshing}
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            aria-label="Refresh notifications"
                        >
                            <RefreshCw
                                size={16}
                                className={`text-gray-500 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`}
                            />
                        </button>
                        {/* {unreadCount > 0 && ( */}
                            <button
                                onClick={onClearAll}
                                className="text-xs text-[#f34853] hover:text-[#d43d48] font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Clear All
                            </button>
                        {/* )} */}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(500px-60px)]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Bell
                            size={48}
                            className="text-gray-300 dark:text-gray-600 mb-4"
                            strokeWidth={1.5}
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No notifications found
                        </p>
                    </div>
                ) : (
                    <>
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => onNotificationClick(notification)}
                            />
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={onLoadMore}
                                    disabled={loading}
                                    className="text-sm text-[#f34853] hover:text-[#d43d48] font-medium px-4 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;