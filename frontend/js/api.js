const API_BASE = 'http://localhost:8080';

async function request(method, path, body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (auth) {
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${path}`, config);

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        throw new Error(`Ошибка ${response.status}`);
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

function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
}

function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'ADMIN';
}
