// API Client - Comunicação com o backend
const API_BASE_URL = 'http://localhost:3000/api';

// Função auxiliar para fazer requisições
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Se tiver token de autenticação (para futuro)
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);

        // Se a resposta for 204 (No Content), retorna vazio
        if (response.status === 204) {
            return { success: true, data: null };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Erro na requisição');
        }

        return { success: true, data };
    } catch (error) {
        console.error(`Erro na requisição ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
}

// ==========================================
// USUÁRIOS (Coordenadores)
// ==========================================

// Cadastrar novo usuário
async function cadastrarUsuario(dadosUsuario) {
    return apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify(dadosUsuario),
    });
}

// Listar todos os usuários
async function listarUsuarios() {
    return apiRequest('/usuarios');
}

// ==========================================
// PPCs
// ==========================================

// Criar novo PPC
async function criarPpc(dadosPpc) {
    return apiRequest('/ppcs', {
        method: 'POST',
        body: JSON.stringify(dadosPpc),
    });
}

// Listar todos os PPCs (com busca opcional por nome)
async function listarPpcs(busca = '') {
    const query = busca ? `?nome=${encodeURIComponent(busca)}` : '';
    return apiRequest(`/ppcs${query}`);
}

// Buscar PPC por ID (com componentes)
async function buscarPpcPorId(id) {
    return apiRequest(`/ppcs/${id}`);
}

// Atualizar PPC
async function atualizarPpc(id, dadosAtualizados) {
    return apiRequest(`/ppcs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dadosAtualizados),
    });
}

// Deletar PPC
async function deletarPpc(id) {
    return apiRequest(`/ppcs/${id}`, {
        method: 'DELETE',
    });
}

// ==========================================
// FUNÇÕES AUXILIARES PARA PPC
// ==========================================

// Função para validar se o usuário está logado
function isLoggedIn() {
    const usuario = localStorage.getItem('usuario');
    return !!usuario;
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('authToken');
    window.location.href = '/frontend/pages/login.html';
}

// Exportar funções para uso global (no navegador)
window.api = {
    cadastrarUsuario,
    listarUsuarios,
    criarPpc,
    listarPpcs,
    buscarPpcPorId,
    atualizarPpc,
    deletarPpc,
    isLoggedIn,
    logout,
};