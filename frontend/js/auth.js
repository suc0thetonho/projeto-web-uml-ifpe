// Páginas que só podem ser acessadas por usuários logados
const PAGINAS_PROTEGIDAS = [
    'paginaInicial', 'NovoPPc', 'NovoPPcCurso',
    'NovoPPcCurso2', 'NovoPPcComponentes', 'PPcCad', 'PPcAndamento'
];

// Verifica se a URL atual corresponde a alguma página protegida
function paginaAtualProtegida() {
    return PAGINAS_PROTEGIDAS.some(p => window.location.pathname.includes(p));
}

/**
 * Proteção de rotas no frontend: se o usuário não está logado (não tem dados
 * no localStorage) e tenta acessar uma página protegida, redireciona para login.
 */
function checarAutenticacao() {
    if (paginaAtualProtegida() && !window.api.getUsuarioLogado()) {
        window.location.href = '/frontend/pages/login.html';
    }
}

// ==========================================
// CADASTRO — Etapa 1 (cadastro.html)
// Coleta dados pessoais e salva temporariamente no localStorage.
// O cadastro é dividido em 2 etapas: dados pessoais → definição de senha.
// ==========================================
function initCadastro() {
    const form = document.querySelector('form.formulario');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = {
            nome: form.elements['nome'].value.trim(),
            cpf: form.elements['cpf'].value.trim(),
            dataNascimento: form.elements['dataNascimento'].value,
            email: form.elements['email'].value.trim(),
            telefoneCelular: form.elements['telefoneCelular'].value.trim(),
            matricula: form.elements['matricula'].value.trim(),
            cursoAreaCoordena: form.elements['cursoAreaCoordena'].value.trim(),
            departamentoSetor: form.elements['departamentoSetor'].value.trim(),
            campus: form.elements['campus'].value.trim(),
            cidade: form.elements['cidade'].value.trim(),
        };

        if (!dados.nome || !dados.cpf || !dados.email || !dados.matricula) {
            window.utils.mostrarNotificacao('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!window.utils.validarEmail(dados.email)) {
            window.utils.mostrarNotificacao('Informe um e-mail válido.', 'error');
            return;
        }

        if (!window.utils.validarCPF(dados.cpf)) {
            window.utils.mostrarNotificacao('CPF inválido.', 'error');
            return;
        }

        // Salva os dados temporariamente para a etapa 2 (definição de senha)
        localStorage.setItem('cadastroTemp', JSON.stringify(dados));
        window.location.href = '/frontend/pages/defsenha.html';
    });
}

// ==========================================
// CADASTRO — Etapa 2 (defsenha.html)
// Recupera os dados pessoais do localStorage, junta com a senha
// e envia tudo para a API POST /api/usuarios para criar o coordenador.
// ==========================================
function initDefSenha() {
    const form = document.querySelector('form.formulario-senha');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const senha = form.elements['senha'].value;
        const confirmarSenha = form.elements['confirmarSenha'].value;

        if (!senha || senha.length < 6) {
            window.utils.mostrarNotificacao('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (senha !== confirmarSenha) {
            window.utils.mostrarNotificacao('As senhas não coincidem.', 'error');
            return;
        }

        const dadosTemp = JSON.parse(localStorage.getItem('cadastroTemp') || '{}');

        if (!dadosTemp.nome) {
            window.utils.mostrarNotificacao('Dados de cadastro não encontrados. Volte e preencha novamente.', 'error');
            window.location.href = '/frontend/pages/cadastro.html';
            return;
        }

        // Junta os dados pessoais (etapa 1) com a senha (etapa 2) usando spread (...)
        const resultado = await window.api.cadastrarUsuario({ ...dadosTemp, senha });

        if (resultado.success) {
            localStorage.removeItem('cadastroTemp');
            window.utils.mostrarNotificacao('Cadastro realizado com sucesso!', 'success');
            setTimeout(() => { window.location.href = '/frontend/pages/login.html'; }, 1500);
        } else {
            window.utils.mostrarNotificacao(resultado.error || 'Erro ao cadastrar. Tente novamente.', 'error');
        }
    });
}

// ==========================================
// LOGIN (login.html)
// ==========================================
function initLogin() {
    const form = document.querySelector('form.formulario-login');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.elements['email'].value.trim();
        const senha = form.elements['senha'].value;

        if (!email || !senha) {
            window.utils.mostrarNotificacao('Preencha e-mail e senha.', 'error');
            return;
        }

        const resultado = await window.api.login(email, senha);

        if (resultado.success) {
            const usuario = resultado.data;
            // Salva os dados do usuário no localStorage para manter a "sessão" ativa.
            // Enquanto esses dados existirem, o usuário é considerado logado.
            localStorage.setItem('usuario', JSON.stringify(usuario));
            localStorage.setItem('usuarioId', usuario.id);
            window.location.href = '/frontend/pages/paginaInicial.html';
        } else {
            window.utils.mostrarNotificacao(resultado.error || 'E-mail ou senha incorretos.', 'error');
        }
    });
}

// ==========================================
// LOGOUT
// ==========================================
function initLogout() {
    const botaoLogout = document.querySelector('.botao-logout');
    if (botaoLogout) {
        botaoLogout.addEventListener('click', (e) => {
            e.preventDefault();
            window.api.encerrarSessao();
        });
    }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
// Ao carregar qualquer página, verifica autenticação e inicializa
// a funcionalidade correspondente à página atual (cadastro, login, etc.)
document.addEventListener('DOMContentLoaded', () => {
    checarAutenticacao();

    const path = window.location.pathname;

    if (path.includes('cadastro')) initCadastro();
    if (path.includes('defsenha')) initDefSenha();
    if (path.includes('login')) initLogin();

    initLogout();
});
