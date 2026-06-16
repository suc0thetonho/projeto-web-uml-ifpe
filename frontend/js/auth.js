// auth.js - Versão com seletores corrigidos

// Aguarda a página carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, iniciando auth.js');
    console.log('📍 Página atual:', window.location.pathname);

    // ==========================================
    // Página de cadastro (cadastro.html)
    // ==========================================
    if (window.location.pathname.includes('cadastro.html')) {
        // Tentar diferentes seletores para encontrar o formulário
        let formCadastro = document.querySelector('.card-formulario .formulario');
        if (!formCadastro) formCadastro = document.querySelector('.formulario');
        if (!formCadastro) formCadastro = document.querySelector('form');

        if (formCadastro) {
            console.log('✅ Formulário de cadastro encontrado!');
            formCadastro.addEventListener('submit', submitCadastro);
        } else {
            console.error('❌ NENHUM formulário encontrado em cadastro.html');
            console.log('📋 Estrutura da página:', document.body.innerHTML.substring(0, 500));
        }
    }

    // ==========================================
    // Página de definição de senha (defsenha.html)
    // ==========================================
    if (window.location.pathname.includes('defsenha.html')) {
        let formSenha = document.querySelector('.formulario-senha');
        if (!formSenha) formSenha = document.querySelector('form');

        if (formSenha) {
            console.log('✅ Formulário de senha encontrado!');
            formSenha.addEventListener('submit', submitSenha);
        } else {
            console.error('❌ Formulário de senha NÃO encontrado');
        }
    }

    // ==========================================
    // Página de login (login.html)
    // ==========================================
    if (window.location.pathname.includes('login.html')) {
        let formLogin = document.querySelector('.formulario-login');
        if (!formLogin) formLogin = document.querySelector('form');

        if (formLogin) {
            console.log('✅ Formulário de login encontrado!');
            formLogin.addEventListener('submit', submitLogin);
        } else {
            console.error('❌ Formulário de login NÃO encontrado');
        }
    }
});

// ==========================================
// Função de cadastro - VERSÃO MODIFICADA
// ==========================================
async function submitCadastro(event) {
    event.preventDefault();
    console.log('📝 submitCadastro executado!');

    // Usar seletores mais simples e robustos
    const inputs = document.querySelectorAll('input');
    console.log('📋 Inputs encontrados:', inputs.length);

    // Mapear os inputs pela posição (mais confiável)
    const nome = inputs[0]?.value;           // Primeiro input = Nome
    const cpf = inputs[1]?.value;             // Segundo input = CPF
    const dataNascimento = inputs[2]?.value;  // Terceiro input = Data
    const email = inputs[3]?.value;           // Quarto input = Email
    const telefoneCelular = inputs[4]?.value; // Quinto input = Telefone
    const matricula = inputs[5]?.value;       // Sexto input = Matrícula
    const cursoAreaCoordena = inputs[6]?.value; // Sétimo input = Curso
    const departamentoSetor = inputs[7]?.value; // Oitavo input = Departamento
    const campus = inputs[8]?.value;          // Nono input = Campus
    const cidade = inputs[9]?.value;          // Décimo input = Cidade

    console.log('Dados coletados:', {
        nome, cpf, email, matricula, campus, cidade
    });

    // Validação básica
    if (!nome || !cpf || !email || !matricula) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        console.log('❌ Campos faltando:', { nome, cpf, email, matricula });
        return;
    }

    // Salvar dados temporariamente
    const dadosTemp = {
        nome, cpf, dataNascimento, email, telefoneCelular,
        matricula, cursoAreaCoordena, departamentoSetor, campus, cidade
    };

    localStorage.setItem('cadastroTemp', JSON.stringify(dadosTemp));
    console.log('✅ Dados salvos no localStorage');

    // Redirecionar
    window.location.href = '/frontend/pages/defsenha.html';
}

// ==========================================
// Função de definição de senha
// ==========================================
async function submitSenha(event) {
    event.preventDefault();
    console.log('🔐 submitSenha executado!');

    const senha = document.querySelector('#senha')?.value;
    const confirmarSenha = document.querySelector('#confirmar-senha')?.value;

    console.log('Senha preenchida?', senha ? 'Sim' : 'Não');

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (!senha || senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    const dadosUsuario = JSON.parse(localStorage.getItem('cadastroTemp') || '{}');
    console.log('Dados recuperados do localStorage:', dadosUsuario);

    if (!dadosUsuario.nome) {
        alert('Dados de cadastro não encontrados. Volte para o início.');
        window.location.href = '/frontend/pages/cadastro.html';
        return;
    }

    dadosUsuario.senha = senha;

    console.log('📤 Enviando para API:', dadosUsuario);

    try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosUsuario)
        });

        const data = await response.json();
        console.log('📥 Resposta da API:', data);

        if (response.ok) {
            alert('✅ Cadastro realizado com sucesso! Faça login.');
            localStorage.removeItem('cadastroTemp');
            window.location.href = '/frontend/pages/login.html';
        } else {
            alert('❌ Erro ao cadastrar: ' + (data.error || data.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        alert('❌ Erro ao conectar com o servidor. Verifique se o backend está rodando em http://localhost:3000');
    }
}

// ==========================================
// Função de login
// ==========================================
async function submitLogin(event) {
    event.preventDefault();
    console.log('🔑 submitLogin executado!');

    const email = document.querySelector('input[type="email"]')?.value;
    const senha = document.querySelector('input[type="password"]')?.value;

    console.log('Email:', email);

    if (!email || !senha) {
        alert('Preencha email e senha.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        const usuarios = await response.json();
        console.log('Usuários cadastrados:', usuarios);

        const usuario = usuarios.find(u => u.email === email);

        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            localStorage.setItem('usuarioId', usuario.id);
            alert('✅ Login realizado com sucesso!');
            window.location.href = '/frontend/pages/paginaInicial.html';
        } else {
            alert('❌ Email não encontrado. Verifique seus dados ou faça o cadastro.');
        }
    } catch (error) {
        console.error('❌ Erro no login:', error);
        alert('❌ Erro ao conectar com o servidor.');
    }
}

// ==========================================
// Função de recuperar senha
// ==========================================
function submitRecuperarSenha(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="email"]')?.value;

    if (!email) {
        alert('Digite seu email.');
        return;
    }

    alert(`📧 Um código de recuperação foi enviado para ${email}`);
    window.location.href = '/frontend/pages/ConfirmarCod.html';
}

// ==========================================
// Verificar autenticação
// ==========================================
function checkAuth() {
    const usuario = localStorage.getItem('usuario');
    const paginasProtegidas = [
        'paginaInicial.html',
        'NovoPPc.html',
        'NovoPPcCurso.html',
        'NovoPPcCurso2.html',
        'NovoPPcComponentes.html',
        'PPcCad.html',
        'PPcAndamento.html'
    ];

    const paginaAtual = window.location.pathname;

    for (const pagina of paginasProtegidas) {
        if (paginaAtual.includes(pagina)) {
            if (!usuario) {
                console.log('🔒 Página protegida, redirecionando para login');
                window.location.href = '/frontend/pages/login.html';
            }
            break;
        }
    }
}

// Executar verificação
checkAuth();

console.log('✅ auth.js carregado com sucesso!');