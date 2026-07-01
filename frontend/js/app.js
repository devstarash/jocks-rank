const CATEGORIES = {
    pullups: { name: 'Подтягивания', icon: '💪' },
    bench: { name: 'Жим лежа', icon: '🏋️' },
    complex: { name: 'Комплекс', icon: '🤸' },
    'one-rep': { name: 'На раз', icon: '⚡' },
    tonnage: { name: 'Тоннаж', icon: '📦' }
};

const CATEGORY_TITLES = {
    pullups: "Топ лидеров: Максимальные подтягивания",
    bench: "Топ лидеров: Классический жим штанги лежа",
    complex: "Топ лидеров: Функциональный комплекс на время",
    'one-rep': "Топ лидеров: Максимальный подъем на 1 раз",
    tonnage: "Топ лидеров: Суммарный тоннаж за тренировку"
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 fade-in max-w-sm`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showLoading(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <span class="ml-3 text-slate-500">Загрузка...</span>
        </div>
    `;
}

function showError(container, message, retryAction) {
    container.innerHTML = `
        <div class="text-center py-12">
            <p class="text-red-500 mb-4">${message}</p>
            ${retryAction ? `
                <button onclick="window.retryAction()" class="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    Повторить
                </button>
            ` : ''}
        </div>
    `;
    if (retryAction) window.retryAction = retryAction;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    router();
});

window.addEventListener('hashchange', router);

function router() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    updateNavbar();
    app.innerHTML = '';

    if (hash === '/') {
        renderOverview(app);
    } else if (hash.startsWith('/leaderboard/')) {
        const category = hash.split('/')[2];
        renderLeaderboard(app, category);
    } else if (hash === '/login') {
        renderLogin(app);
    } else if (hash === '/register') {
        renderRegister(app);
    } else if (hash === '/profile') {
        if (!Auth.isAuthenticated()) {
            window.location.hash = '/login';
            return;
        }
        renderProfile(app);
    } else if (hash === '/admin') {
        if (!Auth.isAdmin()) {
            window.location.hash = '/login';
            return;
        }
        renderAdmin(app);
    } else {
        renderOverview(app);
    }
}

function updateNavbar() {
    const container = document.getElementById('auth-buttons');
    if (Auth.isAuthenticated()) {
        const user = Auth.getCurrentUser();
        const isAdmin = Auth.isAdmin();
        container.innerHTML = `
            <div class="flex items-center gap-3">
                ${isAdmin ? `
                    <a href="#/admin" class="text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 px-3 py-2 rounded-lg transition">
                        Админка
                    </a>
                ` : ''}
                <a href="#/profile" class="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        ${Auth.getInitials()}
                    </span>
                    ${user.username}
                </a>
                <button onclick="handleLogout()" class="text-sm text-slate-500 hover:text-red-600">
                    Выйти
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="flex items-center gap-3">
                <a href="#/login" class="text-sm font-medium text-slate-700 hover:text-slate-900">Войти</a>
                <a href="#/register" class="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                    Регистрация
                </a>
            </div>
        `;
    }
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
}

async function renderOverview(container) {
    showLoading(container);

    let categories;
    try {
        categories = await Leaderboard.loadCategories();
    } catch (error) {
        showError(container, error.message, () => renderOverview(container));
        return;
    }

    let chartData = [];
    let topByCategory = {};
    try {
        const firstCategory = categories[0];
        if (firstCategory) {
            const results = await Leaderboard.loadLeaderboard(firstCategory.slug);
            chartData = results.slice(0, 5).map(r => ({ name: r.username, value: r.value }));
        }
    } catch {}

    for (const cat of categories.slice(0, 5)) {
        try {
            const results = await Leaderboard.loadLeaderboard(cat.slug);
            topByCategory[cat.slug] = results.slice(0, 3);
        } catch {}
    }

    container.innerHTML = `
        <div class="fade-in">
            <section class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
                    Рейтинг качков Иркутска
                </h1>
                <p class="text-slate-600 max-w-2xl text-sm sm:text-base">
                    Единая платформа для сравнения силовых показателей атлетов.
                    Выбирай категорию, отслеживай прогресс и забивай свои рекорды.
                </p>
            </section>

            <section class="mb-8 border-b border-slate-200">
                <div class="flex overflow-x-auto gap-2 pb-3 max-w-full">
                    ${categories.map(cat => `
                        <a href="#/leaderboard/${cat.slug}" class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-slate-100 transition">
                            ${CATEGORIES[cat.slug]?.icon || '🏆'} ${cat.name}
                        </a>
                    `).join('')}
                </div>
            </section>

            <section class="mb-8">
                <h2 class="text-lg font-black tracking-tight text-slate-950 mb-4">Топ по категориям</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${categories.slice(0, 5).map(cat => {
                        const top = topByCategory[cat.slug] || [];
                        return `
                            <div class="bg-white border border-slate-200 rounded-xl p-4">
                                <h3 class="font-semibold text-slate-900 mb-2">${CATEGORIES[cat.slug]?.icon || '🏆'} ${cat.name}</h3>
                                ${top.length > 0 ? top.map((r, i) => `
                                    <div class="flex justify-between text-sm py-1">
                                        <span class="text-slate-600">${i + 1}. ${r.username}</span>
                                        <span class="font-semibold">${r.value} ${r.unit || ''}</span>
                                    </div>
                                `).join('') : '<p class="text-slate-400 text-sm">Нет данных</p>'}
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h2 class="text-lg font-black tracking-tight text-slate-950 mb-4">Добро пожаловать!</h2>
                    <p class="text-slate-600 text-sm mb-4">
                        На этой платформе вы можете просматривать рейтинги атлетов по различным
                        силовым категориям, отслеживать свой прогресс и добавлять свои результаты.
                    </p>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <span>&#10003;</span><span>Просмотр публичных лидербордов</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <span>&#10003;</span><span>Регистрация и авторизация</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <span>&#10003;</span><span>Личный кабинет с прогрессией</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <span>&#10003;</span><span>Админ-панель для верификации</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h2 class="text-lg font-black tracking-tight text-slate-950 mb-4">Топ-5 лидеров</h2>
                    ${chartData.length > 0
                        ? `<div id="overview-chart" class="w-full h-[300px]"></div>`
                        : `<p class="text-slate-400 text-sm">Пока нет данных для отображения</p>`
                    }
                </div>
            </div>
        </div>
    `;

    if (chartData.length > 0) {
        setTimeout(() => {
            Charts.renderBarChart('overview-chart', chartData, categories[0]?.unit || '');
        }, 50);
    }
}

async function renderLeaderboard(container, categorySlug) {
    showLoading(container);

    let results;
    try {
        results = await Leaderboard.loadLeaderboard(categorySlug);
    } catch (error) {
        showError(container, error.message, () => renderLeaderboard(container, categorySlug));
        return;
    }

    const formattedResults = Leaderboard.formatResults(results);
    const catInfo = CATEGORIES[categorySlug] || { name: categorySlug, icon: '🏆' };

    container.innerHTML = `
        <div class="fade-in">
            <section class="mb-8 border-b border-slate-200">
                <div class="flex overflow-x-auto gap-2 pb-3 max-w-full">
                    ${Object.entries(CATEGORIES).map(([key, c]) => `
                        <a href="#/leaderboard/${key}" class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-slate-100 transition ${key === categorySlug ? 'bg-slate-100 font-semibold' : ''}">
                            ${c.icon} ${c.name}
                        </a>
                    `).join('')}
                </div>
            </section>

            <section class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mb-2">
                    ${CATEGORY_TITLES[categorySlug] || catInfo.name}
                </h1>
                <p class="text-slate-600 max-w-2xl text-sm sm:text-base">
                    Топ атлетов в категории «${catInfo.name}».
                </p>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-black tracking-tight text-slate-950">Топ-10: ${catInfo.name}</h2>
                        ${Auth.isAuthenticated() ? `
                            <button onclick="showAddResultModal('${categorySlug}')" class="text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg transition shadow-sm">
                                + Добавить
                            </button>
                        ` : '<span class="text-xs text-slate-400">Войдите, чтобы добавить</span>'}
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-100 text-sm text-left">
                            <thead>
                                <tr class="text-slate-400 font-semibold text-xs tracking-wider uppercase">
                                    <th class="py-3 px-2">Место</th>
                                    <th class="py-3 px-3">Атлет</th>
                                    <th class="py-3 px-3 text-right">Результат</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 font-medium">
                                ${formattedResults.map(item => {
                                    const badge = Leaderboard.getPlaceBadge(item.place) || `<span class="inline-block w-6 text-center font-bold text-slate-400">${item.place}</span>`;
                                    return `
                                        <tr class="hover:bg-slate-50 transition">
                                            <td class="py-3.5 px-2">${badge}</td>
                                            <td class="py-3.5 px-3">
                                                <span class="text-slate-950 font-semibold">${item.username}</span>
                                            </td>
                                            <td class="py-3.5 px-3 text-right font-bold text-slate-950">
                                                ${item.value} <span class="text-xs font-normal text-slate-400 ml-0.5">${item.unit || ''}</span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                    <h2 class="text-lg font-black tracking-tight text-slate-950 mb-4">Визуализация</h2>
                    <div id="category-chart" class="w-full h-[400px]"></div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const chartData = formattedResults.slice(0, 10).map(r => ({ name: r.username, value: r.value }));
        Charts.renderBarChart('category-chart', chartData, results[0]?.unit || '');
    }, 100);
}

function renderLogin(container) {
    container.innerHTML = `
        <div class="fade-in flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 class="text-2xl font-black text-slate-950 mb-6 text-center">Вход</h2>
                <form onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Логин</label>
                        <input type="text" id="login-username" required placeholder="Введите логин"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Пароль</label>
                        <input type="password" id="login-password" required placeholder="Введите пароль"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div id="login-error" class="text-red-500 text-sm hidden"></div>
                    <button type="submit" class="w-full bg-slate-950 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-slate-800 transition">
                        Войти
                    </button>
                </form>
                <p class="text-sm text-slate-500 text-center mt-4">
                    Нет аккаунта? <a href="#/register" class="text-blue-600 hover:underline">Зарегистрируйтесь</a>
                </p>
            </div>
        </div>
    `;
}

function renderRegister(container) {
    container.innerHTML = `
        <div class="fade-in flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 class="text-2xl font-black text-slate-950 mb-6 text-center">Создать аккаунт</h2>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Логин</label>
                        <input type="text" id="reg-username" required placeholder="Иван" minlength="3" maxlength="64"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                        <input type="email" id="reg-email" required placeholder="your@email.com"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Пароль</label>
                        <input type="password" id="reg-password" required placeholder="Минимум 6 символов" minlength="6"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Подтвердите пароль</label>
                        <input type="password" id="reg-password-confirm" required placeholder="Повторите пароль" minlength="6"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition">
                    </div>
                    <div id="register-error" class="text-red-500 text-sm hidden"></div>
                    <button type="submit" class="w-full bg-slate-950 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-slate-800 transition">
                        Зарегистрироваться
                    </button>
                </form>
                <p class="text-sm text-slate-500 text-center mt-4">
                    Уже есть аккаунт? <a href="#/login" class="text-blue-600 hover:underline">Войдите</a>
                </p>
            </div>
        </div>
    `;
}

async function renderProfile(container) {
    showLoading(container);

    let results;
    try {
        results = await Profile.loadMyResults();
    } catch (error) {
        showError(container, error.message, () => renderProfile(container));
        return;
    }

    const user = Auth.getCurrentUser();
    const grouped = Profile.groupResultsByCategory(results);

    const chartsHtml = Object.entries(grouped).map(([categoryName, items]) => {
        const safeId = categoryName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '-');
        return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-4">
                <h5 class="font-semibold text-slate-800 mb-3">📊 ${categoryName}</h5>
                <div id="chart-${safeId}" style="height: 220px;"></div>
            </div>
        `;
    }).join('');

    const resultsRows = results.length === 0
        ? '<tr><td colspan="5" class="text-center text-slate-400 py-4">Нет результатов</td></tr>'
        : results.map(r => {
            const cat = CATEGORIES[r.categorySlug] || { name: r.categoryName || r.categorySlug || '—', icon: '🏆' };
            return `
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td class="py-3 px-4">${cat.icon} ${cat.name}</td>
                    <td class="py-3 px-4 font-semibold text-slate-900">${r.value}</td>
                    <td class="py-3 px-4 text-slate-500">${formatDate(r.recordedAt || r.date)}</td>
                    <td class="py-3 px-4 text-slate-500">${r.note || '—'}</td>
                    <td class="py-3 px-4">
                        <button onclick="handleDeleteMyResult(${r.id})" class="text-red-500 hover:text-red-700 text-sm">
                            Удалить
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

    container.innerHTML = `
        <div class="fade-in">
            <h2 class="text-2xl font-black text-slate-950 mb-6">Личный кабинет</h2>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center h-fit">
                    <div class="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                        ${Auth.getInitials()}
                    </div>
                    <h3 class="text-xl font-bold text-slate-900">${user.username}</h3>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} mb-4">
                        ${user.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                    </span>
                    <button onclick="showAddResultModal()" class="w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        + Добавить результат
                    </button>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <h3 class="text-lg font-bold text-slate-900">Моя прогрессия</h3>
                    ${chartsHtml || '<p class="text-slate-400">Добавьте результаты, чтобы увидеть графики</p>'}

                    <h3 class="text-lg font-bold text-slate-900">История результатов</h3>
                    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-slate-100">
                                    <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Категория</th>
                                    <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Результат</th>
                                    <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Дата</th>
                                    <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Примечание</th>
                                    <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Действия</th>
                                </tr>
                            </thead>
                            <tbody>${resultsRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        Object.entries(grouped).forEach(([categoryName, items]) => {
            const safeId = categoryName.replace(/[^a-zA-Zа-яА-Я0-9]/g, '-');
            const chartData = items.map(r => ({
                date: r.recordedAt || r.date,
                value: r.value
            }));
            Charts.renderProgressChart(`chart-${safeId}`, chartData);
        });
    }, 100);
}

async function renderAdmin(container) {
    showLoading(container);

    let users;
    try {
        users = await Admin.loadUsers();
    } catch (error) {
        showError(container, error.message, () => renderAdmin(container));
        return;
    }

    let allResults = [];
    try {
        allResults = await Admin.loadAllResults();
    } catch {}

    const usersRows = users.map(u => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="py-3 px-4 text-slate-500">${u.id}</td>
            <td class="py-3 px-4 font-semibold text-slate-900">${u.username}</td>
            <td class="py-3 px-4 text-slate-600">${u.email || '—'}</td>
            <td class="py-3 px-4">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}">
                    ${u.role === 'ADMIN' ? 'Админ' : 'Пользователь'}
                </span>
            </td>
            <td class="py-3 px-4 text-slate-500">${formatDate(u.createdAt)}</td>
            <td class="py-3 px-4">
                <button onclick="handleChangeRole(${u.id}, '${u.role === 'ADMIN' ? 'USER' : 'ADMIN'}')" class="text-blue-500 hover:text-blue-700 text-sm">
                    ${u.role === 'ADMIN' ? 'Сделать пользователем' : 'Сделать админом'}
                </button>
            </td>
        </tr>
    `).join('');

    const resultsRows = allResults.slice(0, 20).map((r, i) => `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="py-3 px-4 text-slate-500">${i + 1}</td>
            <td class="py-3 px-4 font-semibold text-slate-900">${r.username}</td>
            <td class="py-3 px-4 text-slate-600">${r.categoryName || r.categorySlug}</td>
            <td class="py-3 px-4 font-semibold text-slate-900">${r.value} ${r.unit || ''}</td>
            <td class="py-3 px-4">
                <button onclick="handleDeleteResult(${r.id})" class="text-red-500 hover:text-red-700 text-sm">
                    Удалить
                </button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-black text-slate-950">Панель администратора</h2>
                <span class="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                    Режим верификации
                </span>
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                <h3 class="text-lg font-bold text-amber-900 mb-4">Внесение глобального рекорда</h3>
                <form onsubmit="handleAdminSubmit(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-amber-800 uppercase mb-1">Спортсмен</label>
                        <select id="admin-athlete" class="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            ${users.map(u => `<option value="${u.id}">${u.username}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-amber-800 uppercase mb-1">Дисциплина</label>
                        <select id="admin-cat" class="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            ${Object.entries(CATEGORIES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-amber-800 uppercase mb-1">Результат</label>
                        <input type="number" id="admin-val" placeholder="Значение" step="0.01" min="0.01"
                               class="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition shadow-sm">
                            Зафиксировать
                        </button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="border-b border-slate-100 px-6 py-4">
                    <h4 class="font-semibold text-slate-800">Пользователи (${users.length})</h4>
                </div>
                <div class="p-6">
                    <table class="w-full text-sm mb-8">
                        <thead>
                            <tr class="border-b border-slate-100">
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">ID</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Логин</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Роль</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Дата регистрации</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody>${usersRows}</tbody>
                    </table>

                    <h4 class="font-semibold text-slate-800 mb-3">Глобальные результаты (${allResults.length})</h4>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-slate-100">
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">#</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Пользователь</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Категория</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Результат</th>
                                <th class="py-3 px-4 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody>${resultsRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.classList.add('hidden');

    try {
        await Auth.login(username, password);
        showNotification('Вы успешно вошли!', 'success');
        window.location.hash = '/profile';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;
    const errorDiv = document.getElementById('register-error');
    errorDiv.classList.add('hidden');

    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Пароли не совпадают';
        errorDiv.classList.remove('hidden');
        return;
    }

    try {
        await Auth.register(username, email, password);
        showNotification('Регистрация успешна!', 'success');
        window.location.hash = '/profile';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

function handleLogout() {
    Auth.logout();
    showNotification('Вы вышли из аккаунта', 'info');
    window.location.hash = '/';
}

async function handleAdminSubmit(event) {
    event.preventDefault();
    const userId = parseInt(document.getElementById('admin-athlete').value);
    const category = document.getElementById('admin-cat').value;
    const value = parseFloat(document.getElementById('admin-val').value);

    try {
        await Admin.addGlobalResult(userId, category, value);
        showNotification('Результат добавлен!', 'success');
        renderAdmin(document.getElementById('app'));
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleChangeRole(userId, newRole) {
    try {
        await Admin.changeRole(userId, newRole);
        showNotification('Роль изменена', 'success');
        renderAdmin(document.getElementById('app'));
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleDeleteResult(resultId) {
    if (!confirm('Вы уверены, что хотите удалить этот результат?')) return;
    try {
        await Admin.deleteResult(resultId);
        showNotification('Результат удалён', 'success');
        renderAdmin(document.getElementById('app'));
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleDeleteMyResult(resultId) {
    if (!confirm('Удалить этот результат?')) return;
    try {
        await Profile.deleteResult(resultId);
        showNotification('Результат удалён', 'success');
        renderProfile(document.getElementById('app'));
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function showAddResultModal(categorySlug = null) {
    const modal = document.getElementById('add-result-modal');
    Leaderboard.loadCategories().then(categories => {
        const select = document.getElementById('add-result-category');
        select.innerHTML = categories.map(c =>
            `<option value="${c.slug}" ${c.slug === categorySlug ? 'selected' : ''}>${c.name}</option>`
        ).join('');
    });
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

async function handleAddResult(event) {
    event.preventDefault();
    const categorySlug = document.getElementById('add-result-category').value;
    const value = parseFloat(document.getElementById('add-result-value').value);
    const note = document.getElementById('add-result-note').value;

    try {
        await Profile.addResult(categorySlug, value, note);
        showNotification('Результат добавлен!', 'success');
        const modal = document.getElementById('add-result-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        renderProfile(document.getElementById('app'));
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
