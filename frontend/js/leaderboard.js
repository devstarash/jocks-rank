const Leaderboard = {
    async loadCategories() {
        return get('/leaderboard/categories');
    },

    async loadLeaderboard(slug) {
        return get(`/leaderboard/${slug}`);
    },

    formatResults(results) {
        return results.map((item, index) => ({
            ...item,
            place: index + 1
        }));
    },

    getPlaceBadge(place) {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3) return '🥉';
        return '';
    }
};
