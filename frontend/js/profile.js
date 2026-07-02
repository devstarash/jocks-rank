const Profile = {
    async loadMyResults() {
        if (!Auth.isAuthenticated()) {
            throw new Error('Войдите, чтобы увидеть свои результаты.');
        }
        return await getAuth('/me/results');
    },

    async addResult(categorySlug, value, note = '') {
        if (!Auth.isAuthenticated()) {
            throw new Error('Войдите, чтобы добавить результат.');
        }
        if (!categorySlug) {
            throw new Error('Выберите категорию.');
        }
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
            throw new Error('Значение должно быть положительным числом.');
        }
        return await post('/me/results', {
            categorySlug: categorySlug,
            value: numValue,
            note: note.trim()
        }, true);
    },

    async deleteResult(id) {
        if (!Auth.isAuthenticated()) {
            throw new Error('Войдите, чтобы удалить результат.');
        }
        await del(`/me/results/${id}`);
    },

    groupResultsByCategory(results) {
        const grouped = {};
        results.forEach(result => {
            const category = result.categorySlug || result.categoryName || 'unknown';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(result);
        });
        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => {
                const dateA = new Date(a.recordedAt || a.date);
                const dateB = new Date(b.recordedAt || b.date);
                return dateA - dateB;
            });
        });
        return grouped;
    }
};
