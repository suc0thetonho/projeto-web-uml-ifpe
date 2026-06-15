const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('xppc-token');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('xppc-token');
    localStorage.removeItem('xppc-usuario');
    window.location.href = '/frontend/pages/login.html';
    return null;
  }

  return res;
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/frontend/pages/login.html';
  }
}
