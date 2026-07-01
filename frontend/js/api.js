const API_BASE = '/api';

async function request(method, path, body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method,
        headers,
        credentials: 'include' // ВАЖНО: отправляем куки
    };

    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${path}`, config);

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (response.status === 401 && auth) {
            clearAuth();
            window.location.hash = '/login';
        }
        throw new Error(body?.message || `Ошибка ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
}

function get(path) {
    return request('GET', path, null, false);
}

function getAuth(path) {
    return request('GET', path, null, true);
}

function post(path, body, auth = true) {
    return request('POST', path, body, auth);
}

function put(path, body) {
    return request('PUT', path, body, true);
}

function del(path) {
    return request('DELETE', path, null, true);
}

// Сохраняем юзера в localStorage (токен в куке httpOnly)
function saveAuth(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('user');
}

function getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

function isAuthenticated() {
    return getUser() !== null;
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'ADMIN';
}
