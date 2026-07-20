// resources/js/api/notificationApi.js

import axios from 'axios';

const API = {
    async getNotifications() {
        const response = await axios.get('/notifications');
        return response.data;
    },

    async loadMore(offset) {
        const response = await axios.get('/notifications/load-more', {
            params: { offset }
        });
        return response.data;
    },

    async getUnreadCount() {
        const response = await axios.get('/notifications/count');
        return response.data;
    },

    async markAsRead(id) {
        const response = await axios.post(`/notifications/${id}/read`);
        return response.data;
    },

    async clearAll() {
        const response = await axios.post('/notifications/clear-all');
        return response.data;
    }
};

export default API;