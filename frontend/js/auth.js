const Auth = {
    async login(username, password) {
        const response = await post('/auth/login', { username, password }, false);
        saveAuth(response);
        return response;
    },

    async register(username, email, password) {
        const response = await post('/auth/register', { username, email, password }, false);
        saveAuth(response);
        return response;
    },

    async telegramAuth(telegramData) {
        const response = await post('/auth/telegram', telegramData, false);
        saveAuth(response);
        return response;
    },

    logout() {
        clearAuth();
        window.location.reload();
    },

    getCurrentUser() {
        return getUser();
    },

    isAuthenticated() {
        return isAuthenticated();
    },

    isAdmin() {
        return isAdmin();
    },

    getInitials() {
        const user = this.getCurrentUser();
        if (!user) return '??';
        return user.username.substring(0, 1).toUpperCase();
    }
};
