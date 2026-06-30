document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    router();
});

window.addEventListener('hashchange', router);

function router() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    app.innerHTML = '';

    if (hash === '/') {
        renderHome(app);
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
    } else {
        renderHome(app);
    }

    updateNavbar();
}

function updateNavbar() {
    const container = document.getElementById('auth-buttons');
    const user = Auth.getCurrentUser();

    if (Auth.isAuthenticated() && user) {
        container.innerHTML = `
            <div class="flex items-center gap-3">
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

function renderHome(container) {
    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-3xl font-black text-slate-900 mb-4">
                Рейтинг качков Иркутска
            </h1>
            <p class="text-slate-600 mb-6">
                Выбери категорию для просмотра лидерборда.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="#/leaderboard/pullups" class="bg-white p-6 rounded-xl border hover:shadow-md transition">
                    <div class="font-bold">Подтягивания</div>
                    <div class="text-sm text-slate-500">повторений</div>
                </a>
                <a href="#/leaderboard/bench" class="bg-white p-6 rounded-xl border hover:shadow-md transition">
                    <div class="font-bold">Жим лежа</div>
                    <div class="text-sm text-slate-500">кг</div>
                </a>
                <a href="#/leaderboard/complex" class="bg-white p-6 rounded-xl border hover:shadow-md transition">
                    <div class="font-bold">Комплекс</div>
                    <div class="text-sm text-slate-500">баллов</div>
                </a>
            </div>
        </div>
    `;
}

async function renderLeaderboard(container, categorySlug) {
    container.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <span class="ml-3 text-slate-500">Загрузка...</span>
        </div>
    `;

    let results;
    try {
        results = await Leaderboard.loadLeaderboard(categorySlug);
    } catch (error) {
        container.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 mb-4">Ошибка: ${error.message}</p>
                <button onclick="window.location.reload()" class="bg-slate-900 text-white px-4 py-2 rounded-lg">
                    Повторить
                </button>
            </div>
        `;
        return;
    }

    const formatted = Leaderboard.formatResults(results);

    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-3xl font-black text-slate-900 mb-2">
                Лидерборд: ${categorySlug}
            </h1>
            <p class="text-slate-600 mb-6">Топ атлетов в этой категории</p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-slate-400 text-xs uppercase border-b">
                                <th class="py-3 px-4 text-left">Место</th>
                                <th class="py-3 px-4 text-left">Атлет</th>
                                <th class="py-3 px-4 text-right">Результат</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${formatted.map(item => `
                                <tr class="border-b hover:bg-slate-50">
                                    <td class="py-3 px-4">
                                        ${Leaderboard.getPlaceBadge(item.place) || item.place}
                                    </td>
                                    <td class="py-3 px-4 font-semibold">${item.username}</td>
                                    <td class="py-3 px-4 text-right font-bold">
                                        ${item.value} ${item.unit || ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="bg-white rounded-xl border p-6">
                    <h2 class="font-bold text-slate-900 mb-4">Топ-10</h2>
                    <div id="leaderboard-chart" class="w-full h-[350px]"></div>
                </div>
            </div>
        </div>
    `;

    const chartData = formatted.slice(0, 10).map(r => ({
        name: r.username,
        value: r.value
    }));
    Charts.renderBarChart('leaderboard-chart', chartData, results[0]?.unit || '');
}

function renderLogin(container) {
    container.innerHTML = `
        <div class="fade-in flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Вход</h2>
                <form onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Логин</label>
                        <input type="text" id="login-username" required
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Пароль</label>
                        <input type="password" id="login-password" required
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                    </div>
                    <div id="login-error" class="text-red-500 text-sm hidden"></div>
                    <button type="submit" class="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800">
                        Войти
                    </button>
                </form>
                <p class="text-sm text-slate-500 text-center mt-4">
                    Нет аккаунта? <a href="#/register" class="text-blue-600 hover:underline">Зарегистрируйся</a>
                </p>
            </div>
        </div>
    `;
}

function renderRegister(container) {
    container.innerHTML = `
        <div class="fade-in flex justify-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">Регистрация</h2>
                <form onsubmit="handleRegister(event)" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Логин</label>
                        <input type="text" id="reg-username" required minlength="3"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                        <input type="email" id="reg-email" required
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Пароль</label>
                        <input type="password" id="reg-password" required minlength="6"
                               class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none">
                    </div>
                    <div id="register-error" class="text-red-500 text-sm hidden"></div>
                    <button type="submit" class="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800">
                        Создать аккаунт
                    </button>
                </form>
                <p class="text-sm text-slate-500 text-center mt-4">
                    Уже есть аккаунт? <a href="#/login" class="text-blue-600 hover:underline">Войди</a>
                </p>
            </div>
        </div>
    `;
}

function renderProfile(container) {
    const user = Auth.getCurrentUser();
    const username = user ? user.username : 'Пользователь';
    container.innerHTML = `
        <div class="fade-in">
            <h1 class="text-2xl font-black text-slate-900 mb-6">
                👤 Профиль: ${username}
            </h1>
            <div class="bg-white rounded-xl border p-6">
                <p class="text-slate-600">Загрузка данных...</p>
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
        window.location.hash = '/profile';
    } catch (error) {
        errorDiv.textContent = 'Неверный логин или пароль';
        errorDiv.classList.remove('hidden');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorDiv = document.getElementById('register-error');

    errorDiv.classList.add('hidden');

    try {
        await Auth.register(username, email, password);
        window.location.hash = '/profile';
    } catch (error) {
        errorDiv.textContent = 'Ошибка регистрации: ' + error.message;
        errorDiv.classList.remove('hidden');
    }
}

function handleLogout() {
    Auth.logout();
    window.location.hash = '/';
}
