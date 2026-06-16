// Gerenciamento do formulário de criação de PPC (3 etapas)

// Armazenar dados temporários do PPC
let ppcTempData = {};

// Carregar dados salvos ao iniciar página
function loadPpcTempData() {
    const saved = localStorage.getItem('ppcTempData');
    if (saved) {
        ppcTempData = JSON.parse(saved);
    }
}

// Salvar dados da etapa atual
function savePpcStep(step, data) {
    ppcTempData[step] = data;
    localStorage.setItem('ppcTempData', JSON.stringify(ppcTempData));
}

// ==========================================
// ETAPA 1: Dados do Campus (NovoPPc.html)
// ==========================================
function submitEtapa1(event) {
    event.preventDefault();

    const dados = {
        campusNome: document.querySelector('input[placeholder="Informe o nome do campus"]')?.value,
        campusCnpj: document.querySelector('input[placeholder="Informe o CNPJ do campus"]')?.value,
        campusCidade: document.querySelector('input[placeholder="Informe a cidade do campus"]')?.value,
        campusCep: document.querySelector('input[placeholder="Informe o CEP do campus"]')?.value,
        campusBairro: document.querySelector('input[placeholder="Informe o bairro do campus"]')?.value,
        campusRua: document.querySelectorAll('input[placeholder="Informe a rua do campus"]')[0]?.value,
        campusNumero: document.querySelectorAll('input[placeholder="Informe o número do campus"]')[0]?.value,
        campusTelefoneFax: document.querySelector('input[placeholder="Informe o telefone/fax do campus"]')?.value,
        campusEmail: document.querySelector('input[type="email"]')?.value,
        campusAtoLegal: document.querySelector('input[placeholder="Informe o ato legal de criação do curso"]')?.value,
        campusSite: document.querySelector('input[placeholder="sitio"]')?.value,
    };

    // Validar campos obrigatórios
    if (!dados.campusNome || !dados.campusCnpj) {
        alert('Por favor, preencha os campos obrigatórios (Campus e CNPJ).');
        return;
    }

    savePpcStep('etapa1', dados);
    window.location.href = '/frontend/pages/NovoPPcCurso.html';
}

// ==========================================
// ETAPA 2: Dados do Curso (NovoPPcCurso.html)
// ==========================================
function submitEtapa2(event) {
    event.preventDefault();

    const dados = {
        usuarioId: localStorage.getItem('usuarioId'),
        cursoTipo: document.querySelector('input[placeholder="Informe o tipo do curso"]')?.value,
        cursoNome: document.querySelector('input[placeholder="Informe o nome do curso"]')?.value,
        cursoEixoTecnologico: document.querySelector('input[placeholder="Informe o eixo tecnológico do curso"]')?.value,
        cursoModalidade: document.querySelector('input[placeholder="Informe a modalidade do curso"]')?.value,
        cursoOferta: document.querySelector('input[placeholder="Informe oas formas de ofertas do curso"]')?.value,
        cursoTitulacao: document.querySelector('input[placeholder="Informe a titulação do curso"]')?.value,
        cursoEstagio: document.querySelector('input[placeholder="H/R"]')?.value,
        cursoSemanasLetivas: parseInt(document.querySelectorAll('input[placeholder="Digite o N de semanas letivas"]')[0]?.value) || 0,
        cursoAtivComplem: parseInt(document.querySelectorAll('input[placeholder="H/R"]')[1]?.value) || 0,
        cursoIntegMinima: parseInt(document.querySelector('input[placeholder="Informe o período de integralização mínima"]')?.value) || 0,
        cursoIntegMaxima: parseInt(document.querySelector('input[placeholder="Informe o período de integralização máxima"]')?.value) || 0,
        cursoFormasAcesso: document.querySelector('input[placeholder="Informe oas formas de acesso do curso"]')?.value,
        cursoPreRequisitos: document.querySelector('input[placeholder="Informe os pré-requisitos para ingresso"]')?.value,
    };

    if (!dados.cursoNome) {
        alert('Por favor, informe o nome do curso.');
        return;
    }

    savePpcStep('etapa2', dados);
    window.location.href = '/frontend/pages/NovoPPcCurso2.html';
}

// ==========================================
// ETAPA 3: Oferta e Indicadores (NovoPPcCurso2.html)
// ==========================================
function submitEtapa3(event) {
    event.preventDefault();

    const dados = {
        ofertaRegime: document.querySelector('input[placeholder="Informe o regime do curso"]')?.value,
        ofertaTurnos: document.querySelector('input[placeholder="Informe quantos turnos o curso é oferecido"]')?.value,
        ofertaNumTurmas: parseInt(document.querySelector('input[placeholder="Informe o número de turmas por turno de oferta"]')?.value) || 0,
        ofertaVagasTurma: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por turma"]')?.value) || 0,
        ofertaVagasTurno: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por turno de oferta"]')?.value) || 0,
        ofertaVagasSemestre: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por semestre"]')?.value) || 0,
        ofertaDuracao: parseInt(document.querySelector('input[placeholder="Informe a duração do curso"]')?.value) || 0,
        indicadorCC: document.querySelector('input[placeholder="Informe o conceito de curso (CC)"]')?.value || 'Não se aplica',
        indicadorCPC: document.querySelector('input[placeholder="Informe o conceito preliminar de curso (CPC)"]')?.value || 'Não se aplica',
        indicadorEnade: document.querySelector('input[placeholder="Informe o conceito do Enade"]')?.value || 'Não se aplica',
        indicadorIGC: document.querySelector('input[placeholder="Informe o índice geral de cursos (IGC)"]')?.value || 'Não se aplica',
        cursoSituacao: document.querySelector('input[placeholder="Informe a situação do curso"]')?.value,
        cursoStatus: document.querySelector('input[placeholder="Informe o status do curso"]')?.value,
    };

    savePpcStep('etapa3', dados);

    // Juntar todas as etapas e enviar para o backend
    enviarPpcCompleto();
}

// Enviar PPC completo para o backend
async function enviarPpcCompleto() {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
        alert('Você precisa estar logado para criar um PPC.');
        window.location.href = '/frontend/pages/login.html';
        return;
    }

    // Combinar todos os dados
    const ppcCompleto = {
        usuarioId: parseInt(usuarioId),
        ...ppcTempData.etapa1,
        ...ppcTempData.etapa2,
        ...ppcTempData.etapa3,
        status: 'EM_ANDAMENTO'
    };

    // Enviar para API
    const result = await window.api.criarPpc(ppcCompleto);

    if (result.success) {
        alert('PPC criado com sucesso!');
        localStorage.removeItem('ppcTempData');
        window.location.href = '/frontend/pages/paginaInicial.html';
    } else {
        alert(`Erro ao criar PPC: ${result.error}`);
    }
}

// Cancelar criação (limpar dados)
function cancelarPpc() {
    if (confirm('Tem certeza que deseja cancelar? Os dados não salvos serão perdidos.')) {
        localStorage.removeItem('ppcTempData');
        window.location.href = '/frontend/pages/paginaInicial.html';
    }
}

// Salvar rascunho
function salvarRascunho() {
    alert('Rascunho salvo com sucesso!');
    // Os dados já estão salvos no localStorage via savePpcStep
}

// Inicializar listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPpcTempData();

    const path = window.location.pathname;

    // Etapa 1
    if (path.includes('NovoPPc.html')) {
        const form = document.querySelector('.form-novo-ppc');
        if (form) {
            form.addEventListener('submit', submitEtapa1);
        }
        const cancelarBtn = document.querySelector('.botao-cancelar');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', cancelarPpc);
        }
        const rascunhoBtn = document.querySelector('.botao-rascunho');
        if (rascunhoBtn) {
            rascunhoBtn.addEventListener('click', salvarRascunho);
        }
    }

    // Etapa 2
    if (path.includes('NovoPPcCurso.html') && !path.includes('Curso2')) {
        const form = document.querySelector('.form-novo-ppc');
        if (form) {
            form.addEventListener('submit', submitEtapa2);
        }
        const cancelarBtn = document.querySelector('.botao-cancelar');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', cancelarPpc);
        }
        const rascunhoBtn = document.querySelector('.botao-rascunho');
        if (rascunhoBtn) {
            rascunhoBtn.addEventListener('click', salvarRascunho);
        }
    }

    // Etapa 3
    if (path.includes('NovoPPcCurso2.html')) {
        const form = document.querySelector('.form-novo-ppc');
        if (form) {
            form.addEventListener('submit', submitEtapa3);
        }
        const cancelarBtn = document.querySelector('.botao-cancelar');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', cancelarPpc);
        }
        const rascunhoBtn = document.querySelector('.botao-rascunho');
        if (rascunhoBtn) {
            rascunhoBtn.addEventListener('click', salvarRascunho);
        }
    }

    // Etapa 4 (Componentes) - ainda sem backend específico
    if (path.includes('NovoPPcComponentes.html')) {
        const gerarBtn = document.querySelector('.botao-gerar');
        if (gerarBtn) {
            gerarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Funcionalidade de componentes curriculares será implementada em breve!');
            });
        }
        const cancelarBtn = document.querySelector('.botao-cancelar');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', cancelarPpc);
        }
    }
});

window.ppcForm = {
    cancelar: cancelarPpc,
    salvarRascunho,
};