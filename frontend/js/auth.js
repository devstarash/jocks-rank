const Auth = {
    async login(username, password) {
        const response = await post('/auth/login', { username, password }, false);
        saveAuth(response.token, { username: response.username, role: response.role });
        return response
    },

    async register(username, email, password) {
        const response = await post('auth/register', { username, email, password }, false);
        saveAuth(response.token, { username: response.username, role: response.role });
        return response;
    },

    logout() {
        clearAuth();
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
        return user.username.substring(0, 2).toUpperCase();
    }
};