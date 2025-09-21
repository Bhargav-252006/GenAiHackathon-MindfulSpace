// Local storage utility functions

export const getStoredData = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error getting data from localStorage for key "${key}":`, error);
        return defaultValue;
    }
};

export const saveData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving data to localStorage for key "${key}":`, error);
        return false;
    }
};

export const removeData = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing data from localStorage for key "${key}":`, error);
        return false;
    }
};

export const clearAllData = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
};

export const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
};

// Notification helper
export const showNotification = (message, type = 'info') => {
    // Simple console notification for development
    console.log(`[${type.toUpperCase()}] ${message}`);

    // You could implement toast notifications here
    // For now, just return the message for display
    return {message, type, timestamp: Date.now()};
};