export const getUserId = () => {
    let userId = localStorage.getItem('device_user_id');
    if (!userId) {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            userId = crypto.randomUUID();
        } else {
            userId = 'user-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
        }
        localStorage.setItem('device_user_id', userId);
    }
    return userId;
};
