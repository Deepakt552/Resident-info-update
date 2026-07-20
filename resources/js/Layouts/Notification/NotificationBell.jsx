// resources/js/Components/NotificationBell.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import notificationApi from './notificationApi';
import { toast } from 'react-toastify';

const NotificationBell = ({ dark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentOffset, setCurrentOffset] = useState(0);
    const dropdownRef = useRef(null);

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.count);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    // Fetch notifications
    const fetchNotifications = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await notificationApi.getNotifications();
            if (response.success) {
                setNotifications(response.data);
                setHasMore(response.has_more);
                setCurrentOffset(response.data.length);
            }
        } catch (error) {
            toast.error('Failed to load notifications');
            console.error('Failed to fetch notifications:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Load more notifications
    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await notificationApi.loadMore(currentOffset);
            if (response.success) {
                setNotifications(prev => [...prev, ...response.data]);
                setHasMore(response.has_more);
                setCurrentOffset(prev => prev + response.data.length);
            }
        } catch (error) {
            toast.error('Failed to load more notifications');
            console.error('Failed to load more:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (id) => {
        try {
            const response = await notificationApi.markAsRead(id);
            if (response.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === id
                            ? { ...notif, read: true, read_date: new Date().toISOString() }
                            : notif
                    )
                );
                setUnreadCount(response.unread_count);
                toast.success('Notification marked as read');
            }
        } catch (error) {
            toast.error('Failed to mark as read');
            console.error('Failed to mark as read:', error);
        }
    };

    // Clear all notifications
    const clearAll = async () => {
        try {
            const response = await notificationApi.clearAll();
            if (response.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, read: true }))
                );
                setUnreadCount(0);
                // toast.success('All notifications cleared');
            }
            refresh();
        } catch (error) {
            toast.error('Failed to clear notifications');
            console.error('Failed to clear all:', error);
        }
    };

    // Refresh notifications
    const refresh = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchNotifications(false),
            fetchUnreadCount()
        ]);
        setRefreshing(false);
        toast.info('Notifications refreshed');
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        console.log(notification)
        // Redirect to resident signup list
        window.location.href = '/resident-signup/'+notification.resident_signups_id;
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isOpen) {
                fetchUnreadCount();
            } else {
                // If dropdown is open, refresh everything
                refresh();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isOpen]);

    // Initial load
    useEffect(() => {
        fetchUnreadCount();
        fetchNotifications(false);
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-md transition-colors hover:bg-gray-200/80 dark:hover:bg-gray-800/80"
                aria-label="Notifications"
            >
                <Bell
                    size={20}
                    className="text-[#22346e] dark:text-gray-300"
                    strokeWidth={1.8}
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce-once">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            <NotificationDropdown
                isOpen={isOpen}
                notifications={notifications}
                unreadCount={unreadCount}
                hasMore={hasMore}
                loading={loading}
                refreshing={refreshing}
                dark={dark}
                onRefresh={refresh}
                onClearAll={clearAll}
                onLoadMore={loadMore}
                onNotificationClick={handleNotificationClick}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export default NotificationBell;