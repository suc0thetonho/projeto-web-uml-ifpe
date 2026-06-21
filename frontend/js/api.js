// URL base da API do backend — todas as requisições partem deste endereço
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Função central de comunicação com o backend.
 * Todas as outras funções deste arquivo usam apiRequest internamente.
 * Ela padroniza: headers, tratamento de erros e formato de retorno.
 * Retorna sempre um objeto { success: bool, data | error }.
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: { 'Content-Type': 'application/json' },
    };

    // Mescla as opções padrão com as recebidas (ex: method, body)
    // O spread (...) garante que headers customizados não sobrescrevam o Content-Type
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers },
    };

    try {
        // fetch() é a API nativa do navegador para fazer requisições HTTP
        const response = await fetch(url, finalOptions);

        // 204 = No Content (usado em DELETE) — não tem corpo para parsear
        if (response.status === 204) {
            return { success: true, data: null };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Erro na requisição');
        }

        // O backend envolve respostas em { success: true, data: {...} }.
        // Aqui "desempacotamos" para que o chamador receba direto o conteúdo útil.
        const unwrapped = (data !== null && typeof data === 'object' && !Array.isArray(data) && 'data' in data)
            ? data.data
            : data;

        return { success: true, data: unwrapped };
    } catch (error) {
        console.error(`Erro na requisição ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
}

// ==========================================
// AUTH
// ==========================================

async function login(email, senha) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
    });
}

// ==========================================
// USUÁRIOS
// ==========================================

async function cadastrarUsuario(dadosUsuario) {
    return apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify(dadosUsuario),
    });
}

async function listarUsuarios() {
    return apiRequest('/usuarios');
}

// ==========================================
// PPCs
// ==========================================

async function criarPpc(dadosPpc) {
    return apiRequest('/ppcs', {
        method: 'POST',
        body: JSON.stringify(dadosPpc),
    });
}

async function listarPpcs(busca = '') {
    const query = busca ? `?nome=${encodeURIComponent(busca)}` : '';
    return apiRequest(`/ppcs${query}`);
}

async function buscarPpcPorId(id) {
    return apiRequest(`/ppcs/${id}`);
}

async function atualizarPpc(id, dadosAtualizados) {
    return apiRequest(`/ppcs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dadosAtualizados),
    });
}

async function deletarPpc(id) {
    return apiRequest(`/ppcs/${id}`, { method: 'DELETE' });
}

// ==========================================
// COMPONENTES CURRICULARES
// ==========================================

async function listarComponentes(ppcId) {
    return apiRequest(`/ppcs/${ppcId}/componentes`);
}

async function criarComponente(ppcId, dados) {
    return apiRequest(`/ppcs/${ppcId}/componentes`, {
        method: 'POST',
        body: JSON.stringify(dados),
    });
}

async function atualizarComponente(ppcId, componenteId, dados) {
    return apiRequest(`/ppcs/${ppcId}/componentes/${componenteId}`, {
        method: 'PUT',
        body: JSON.stringify(dados),
    });
}

async function deletarTodosComponentes(ppcId) {
    return apiRequest(`/ppcs/${ppcId}/componentes`, { method: 'DELETE' });
}

async function deletarComponente(ppcId, componenteId) {
    return apiRequest(`/ppcs/${ppcId}/componentes/${componenteId}`, { method: 'DELETE' });
}

// ==========================================
// CAMPI
// ==========================================

async function listarCampi() {
    return apiRequest('/campi');
}

async function criarCampus(dados) {
    return apiRequest('/campi', {
        method: 'POST',
        body: JSON.stringify(dados),
    });
}

// ==========================================
// SITES
// ==========================================

async function listarSites() {
    return apiRequest('/sites');
}

async function criarSite(dados) {
    return apiRequest('/sites', {
        method: 'POST',
        body: JSON.stringify(dados),
    });
}

// ==========================================
// PERIODOS
// ==========================================

async function listarPeriodos() {
    return apiRequest('/periodos');
}

async function criarPeriodo(dados) {
    return apiRequest('/periodos', {
        method: 'POST',
        body: JSON.stringify(dados),
    });
}

// ==========================================
// SESSÃO
// ==========================================

function getUsuarioLogado() {
    const dados = localStorage.getItem('usuario');
    return dados ? JSON.parse(dados) : null;
}

function getUsuarioId() {
    return localStorage.getItem('usuarioId');
}

function encerrarSessao() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuarioId');
    window.location.href = '/frontend/pages/login.html';
}

// Expõe todas as funções da API como window.api para que qualquer outro
// arquivo JS possa chamá-las (ex: window.api.criarPpc(dados))
window.api = {
    login,
    cadastrarUsuario,
    listarUsuarios,
    criarPpc,
    listarPpcs,
    buscarPpcPorId,
    atualizarPpc,
    deletarPpc,
    listarComponentes,
    criarComponente,
    atualizarComponente,
    deletarTodosComponentes,
    deletarComponente,
    listarCampi,
    criarCampus,
    listarSites,
    criarSite,
    listarPeriodos,
    criarPeriodo,
    getUsuarioLogado,
    getUsuarioId,
    encerrarSessao,
};
