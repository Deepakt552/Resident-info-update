// resources/js/utils/storage.js

const STORAGE_KEY = 'resident_signup_submission';
const EXPIRY_HOURS = 24;

/**
 * Check if a timestamp is expired (older than 24 hours)
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {boolean}
 */
export const isExpired = (timestamp) => {
    if (!timestamp) return true;
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return (now - timestamp) > expiryTime;
};

/**
 * Get stored signup data from localStorage
 * @returns {Object|null} - Returns the stored data or null if not found/expired
 */
export const getStoredSignup = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) return null;

        const data = JSON.parse(storedData);
        
        // Check if data has expired
        if (isExpired(data.submitted_at)) {
            clearExpiredSignup();
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

/**
 * Clear expired signup data from localStorage
 */
export const clearExpiredSignup = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

/**
 * Store signup data in localStorage
 * @param {Object} data - Signup data to store
 * @param {string} data.submission_id - Unique submission ID
 * @param {string} data.property_name - Property name
 * @param {string} data.property_address - Property address
 * @param {string} data.unitno - Unit number
 */
export const storeSignupData = (data) => {
    try {
        const submissionData = {
            ...data,
            submitted_at: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissionData));
        return submissionData;
    } catch (error) {
        console.error('Error storing in localStorage:', error);
        return null;
    }
};

/**
 * Get remaining time until expiry in human-readable format
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Formatted remaining time
 */
export const getRemainingTime = (timestamp) => {
    if (!timestamp) return 'Expired';
    
    const now = Date.now();
    const elapsed = now - timestamp;
    const expiryMs = 24 * 60 * 60 * 1000;
    const remaining = expiryMs - elapsed;

    if (remaining <= 0) return 'Expired';

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
};