// Authentication utility functions

export function isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return false;
    
    try {
        // Parse user data
        const userData = JSON.parse(user);
        // Check if we have all required user data
        if (!userData.type || !userData.username) return false;
        
        return true;
    } catch (e) {
        console.error('Error parsing user data:', e);
        return false;
    }
}

export function getUserData() {
    if (!isAuthenticated()) return null;
    
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
    }
}

export function getToken() {
    return localStorage.getItem('token');
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch event for navigation update
    window.dispatchEvent(new Event('user-data-changed'));
    window.location.href = '/login';
}

export function isAdmin() {
    const userData = getUserData();
    return userData?.type === 'admin';
}

export function getUserType() {
    const userData = getUserData();
    return userData?.type || 'guest';
}

export function checkPermission(requiredType) {
    const userData = getUserData();
    if (!userData) return false;
    
    // Admin has access to everything
    if (userData.type === 'admin') return true;
    
    // Check if user type matches required type
    return userData.type === requiredType;
}

export function handleAuthRedirect(requiredType = null) {
    if (!isAuthenticated()) {
        // Store the current path to redirect back after login
        localStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
        return false;
    }

    // If a specific type is required, check permissions
    if (requiredType && !checkPermission(requiredType)) {
        window.location.href = '/access-denied';
        return false;
    }

    return true;
}

export function handlePostLoginRedirect() {
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath');
    window.location.href = redirectPath;
}
