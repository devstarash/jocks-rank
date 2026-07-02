const Admin = {
    checkAdminAccess() {
        if (!Auth.isAuthenticated()) {
            throw new Error('Войдите в аккаунт администратора.');
        }
        if (!Auth.isAdmin()) {
            throw new Error('У вас нет прав для выполнения этого действия.');
        }
    },

    async loadUsers() {
        this.checkAdminAccess();
        return await getAuth('/admin/users');
    },

    async loadAllResults() {
        this.checkAdminAccess();
        return await getAuth('/admin/results');
    },

    async loadResultsByStatus(status) {
        this.checkAdminAccess();
        return await getAuth(`/admin/results?status=${status}`);
    },

    async addGlobalResult(userId, categorySlug, value) {
        this.checkAdminAccess();
        if (!userId) throw new Error('Укажите ID пользователя.');
        if (!categorySlug) throw new Error('Выберите категорию.');
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) throw new Error('Значение должно быть положительным числом.');
        return await post(`/admin/results/${userId}`, {
            categorySlug: categorySlug,
            value: numValue
        }, true);
    },

    async approveResult(id) {
        this.checkAdminAccess();
        if (!id) throw new Error('Укажите ID результата.');
        return await put(`/admin/results/${id}/approve`);
    },

    async rejectResult(id) {
        this.checkAdminAccess();
        if (!id) throw new Error('Укажите ID результата.');
        return await put(`/admin/results/${id}/reject`);
    },

    async deleteResult(id) {
        this.checkAdminAccess();
        if (!id) throw new Error('Укажите ID результата.');
        await del(`/admin/results/${id}`);
    },

    async changeRole(userId, role) {
        this.checkAdminAccess();
        if (!userId) throw new Error('Укажите ID пользователя.');
        if (role !== 'USER' && role !== 'ADMIN') throw new Error('Роль может быть только USER или ADMIN.');
        await put(`/admin/users/${userId}/role`, { role });
    }
};
