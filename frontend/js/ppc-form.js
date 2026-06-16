// ==========================================
// HELPERS DE EDIÇÃO
// ==========================================

function getEditandoId() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('editar');
    if (fromUrl) return fromUrl;

    // Só usa o localStorage se ppcTempData confirmar a sessão de edição ativa
    const fromStorage = localStorage.getItem('ppcEditandoId');
    if (!fromStorage) return null;
    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    return temp._editandoId == fromStorage ? fromStorage : null;
}

function preencherFormulario(form, dados) {
    if (!dados) return;
    Object.entries(dados).forEach(([nome, valor]) => {
        const el = form.elements[nome];
        if (el && valor !== undefined && valor !== null) {
            el.value = valor;
        }
    });
}

async function carregarDadosEdicao() {
    const editandoId = getEditandoId();
    if (!editandoId) return;

    localStorage.setItem('ppcEditandoId', editandoId);

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    if (temp._editandoId == editandoId) return; // dados já carregados

    window.utils.mostrarNotificacao('Carregando rascunho...', 'info');

    const result = await window.api.buscarPpcPorId(editandoId);
    if (!result.success) {
        window.utils.mostrarNotificacao('Erro ao carregar dados do rascunho.', 'error');
        return;
    }

    const ppc = result.data;

    const etapa1 = {
        campusNome: ppc.campusNome, campusCidade: ppc.campusCidade, campusCnpj: ppc.campusCnpj,
        campusCep: ppc.campusCep, campusBairro: ppc.campusBairro, campusRua: ppc.campusRua,
        campusNumero: ppc.campusNumero, campusTelefoneFax: ppc.campusTelefoneFax,
        campusEmail: ppc.campusEmail, campusAtoLegal: ppc.campusAtoLegal, campusSite: ppc.campusSite
    };

    const etapa2 = {
        cursoTipo: ppc.cursoTipo, cursoNome: ppc.cursoNome, cursoEixoTecnologico: ppc.cursoEixoTecnologico,
        cursoModalidade: ppc.cursoModalidade, cursoOferta: ppc.cursoOferta, cursoTitulacao: ppc.cursoTitulacao,
        cursoEstagio: ppc.cursoEstagio, cursoSemanasLetivas: ppc.cursoSemanasLetivas,
        cursoAtivComplem: ppc.cursoAtivComplem, cursoIntegMinima: ppc.cursoIntegMinima,
        cursoIntegMaxima: ppc.cursoIntegMaxima, cursoFormasAcesso: ppc.cursoFormasAcesso,
        cursoPreRequisitos: ppc.cursoPreRequisitos
    };

    const etapa3 = {
        ofertaRegime: ppc.ofertaRegime, ofertaTurnos: ppc.ofertaTurnos, ofertaNumTurmas: ppc.ofertaNumTurmas,
        ofertaVagasTurma: ppc.ofertaVagasTurma, ofertaVagasTurno: ppc.ofertaVagasTurno,
        ofertaVagasSemestre: ppc.ofertaVagasSemestre, ofertaDuracao: ppc.ofertaDuracao,
        indicadorCC: ppc.indicadorCC, indicadorCPC: ppc.indicadorCPC,
        indicadorEnade: ppc.indicadorEnade, indicadorIGC: ppc.indicadorIGC,
        cursoSituacao: ppc.cursoSituacao, cursoStatus: ppc.cursoStatus
    };

    localStorage.setItem('ppcTempData', JSON.stringify({ _editandoId: editandoId, etapa1, etapa2, etapa3 }));

    const componentes = (ppc.componentes || []).map(c => ({
        codigo: c.codigo, nome: c.nome, tipo: c.tipo, periodo: c.periodo,
        creditosPraticos: c.creditosPraticos, creditosTeoricos: c.creditosTeoricos,
        creditosExtensao: c.creditosExtensao, horasPraticas: c.horasPraticas,
        horasTeoricas: c.horasTeoricas, horasExtensao: c.horasExtensao,
        preRequisitos: c.preRequisitos, correquisitos: c.correquisitos
    }));

    localStorage.setItem('ppcComponentesTemp', JSON.stringify(componentes));
}

// ==========================================
// VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
// ==========================================
function validarCamposObrigatorios(form) {
    const grupos = form.querySelectorAll('.grupo-campo');
    let valido = true;
    let primeiroInvalido = null;

    grupos.forEach(grupo => {
        if (!grupo.querySelector('.obrigatorio')) return;
        const campo = grupo.querySelector('input, select, textarea');
        if (!campo) return;

        if (!campo.value.trim()) {
            campo.classList.add('campo-invalido');
            if (!primeiroInvalido) primeiroInvalido = campo;
            valido = false;
            campo.addEventListener('input', () => campo.classList.remove('campo-invalido'), { once: true });
            campo.addEventListener('change', () => campo.classList.remove('campo-invalido'), { once: true });
        }
    });

    if (!valido) {
        window.utils.mostrarNotificacao('Preencha todos os campos obrigatórios (*).', 'error');
        primeiroInvalido?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valido;
}

// ==========================================
// ETAPA 1 — Dados do Campus (NovoPPc.html)
// ==========================================
async function initEtapa1() {
    const form = document.querySelector('form.form-novo-ppc');
    if (!form) return;

    await carregarDadosEdicao();

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    preencherFormulario(form, temp.etapa1);

    document.querySelector('.botao-cancelar')?.addEventListener('click', cancelarPpc);
    document.querySelector('.botao-rascunho')?.addEventListener('click', () => {
        salvarEtapa('etapa1', Object.fromEntries(new FormData(form)));
        salvarRascunho();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(form));

        if (!validarCamposObrigatorios(form)) return;

        salvarEtapa('etapa1', dados);
        window.location.href = '/frontend/pages/NovoPPcCurso';
    });
}

// ==========================================
// ETAPA 2 — Dados do Curso (NovoPPcCurso.html)
// ==========================================
function initEtapa2() {
    const form = document.querySelector('form.form-novo-ppc');
    if (!form) return;

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    preencherFormulario(form, temp.etapa2);

    document.querySelector('.botao-cancelar')?.addEventListener('click', cancelarPpc);
    document.querySelector('.botao-rascunho')?.addEventListener('click', () => {
        salvarEtapa('etapa2', Object.fromEntries(new FormData(form)));
        salvarRascunho();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(form));

        if (!validarCamposObrigatorios(form)) return;

        salvarEtapa('etapa2', dados);
        window.location.href = '/frontend/pages/NovoPPcCurso2';
    });
}

// ==========================================
// ETAPA 3 — Oferta e Indicadores (NovoPPcCurso2.html)
// Apenas salva localmente e avança para a etapa de componentes.
// ==========================================
function initEtapa3() {
    const form = document.querySelector('form.form-novo-ppc');
    if (!form) return;

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    preencherFormulario(form, temp.etapa3);

    document.querySelector('.botao-cancelar')?.addEventListener('click', cancelarPpc);
    document.querySelector('.botao-rascunho')?.addEventListener('click', () => {
        salvarEtapa('etapa3', Object.fromEntries(new FormData(form)));
        salvarRascunho();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(form));

        if (!validarCamposObrigatorios(form)) return;

        salvarEtapa('etapa3', dados);

        window.location.href = '/frontend/pages/NovoPPcComponentes';
    });
}

// ==========================================
// ETAPA 4 — Componentes Curriculares (NovoPPcComponentes.html)
// Acumula componentes localmente e só envia tudo ao clicar em "Concluir".
// ==========================================
function initEtapa4() {
    const form = document.querySelector('form.form-novo-ppc');
    if (!form) return;

    renderizarTabelaLocal();

    document.querySelector('.botao-cancelar')?.addEventListener('click', cancelarPpc);

    document.querySelector('.botao-salvar-rascunho')?.addEventListener('click', () => salvarComoRascunho());

    document.querySelector('.botao-concluir')?.addEventListener('click', () => enviarTudo());

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dados = Object.fromEntries(new FormData(form));

        if (!dados.codigo || !dados.nome || !dados.tipo || !dados.periodo) {
            window.utils.mostrarNotificacao('Preencha código, nome, tipo e período.', 'error');
            return;
        }

        const componentes = getComponentesTemp();

        if (componentes.some(c => c.codigo === dados.codigo)) {
            window.utils.mostrarNotificacao(`Já existe um componente com o código "${dados.codigo}".`, 'error');
            return;
        }

        componentes.push(dados);
        localStorage.setItem('ppcComponentesTemp', JSON.stringify(componentes));

        form.reset();
        renderizarTabelaLocal();
        window.utils.mostrarNotificacao(`"${dados.nome}" adicionado à lista.`, 'success');
    });
}

function getComponentesTemp() {
    return JSON.parse(localStorage.getItem('ppcComponentesTemp') || '[]');
}

function renderizarTabelaLocal() {
    const tbody = document.querySelector('.tabela-componentes tbody');
    if (!tbody) return;

    const componentes = getComponentesTemp();

    if (componentes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Nenhum componente adicionado ainda</td></tr>';
        return;
    }

    tbody.innerHTML = componentes.map((c, i) => `
        <tr>
            <td>${c.codigo}</td>
            <td>${c.nome}</td>
            <td>${c.tipo}</td>
            <td>${c.periodo}º</td>
            <td>${(Number(c.creditosTeoricos) || 0) + (Number(c.creditosPraticos) || 0) + (Number(c.creditosExtensao) || 0)}</td>
            <td>${c.horasTeoricas || 0}</td>
            <td>${c.horasPraticas || 0}</td>
            <td>${c.horasExtensao || 0}</td>
            <td>${c.preRequisitos || '—'}</td>
            <td>${c.correquisitos || '—'}</td>
        </tr>
    `).join('');
}

async function enviarTudo() {
    const componentes = getComponentesTemp();

    if (componentes.length === 0) {
        window.utils.mostrarNotificacao('Adicione pelo menos um componente curricular antes de concluir.', 'error');
        return;
    }

    const usuarioId = window.api.getUsuarioId() || window.api.getUsuarioLogado()?.id;

    if (!usuarioId) {
        window.utils.mostrarNotificacao('Sessão expirada. Faça login novamente.', 'error');
        window.location.href = '/frontend/pages/login';
        return;
    }

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    const editandoId = localStorage.getItem('ppcEditandoId');

    const ppcCompleto = {
        usuarioId: parseInt(usuarioId),
        campusNome: '', campusCidade: '', campusCnpj: '', campusCep: '',
        campusBairro: '', campusRua: '', campusNumero: '', campusTelefoneFax: '',
        campusEmail: '', campusAtoLegal: '', campusSite: '',
        cursoTipo: '', cursoNome: '', cursoEixoTecnologico: '', cursoModalidade: '',
        cursoOferta: '', cursoTitulacao: '', cursoEstagio: '',
        cursoSemanasLetivas: 0, cursoAtivComplem: 0, cursoIntegMinima: 0, cursoIntegMaxima: 0,
        cursoFormasAcesso: '', cursoPreRequisitos: '',
        ofertaRegime: '', ofertaTurnos: '', ofertaNumTurmas: 0, ofertaVagasTurma: 0,
        ofertaVagasTurno: 0, ofertaVagasSemestre: 0, ofertaDuracao: 0,
        indicadorCC: 'Não se aplica', indicadorCPC: 'Não se aplica',
        indicadorEnade: 'Não se aplica', indicadorIGC: 'Não se aplica',
        cursoSituacao: '', cursoStatus: '',
        ...temp.etapa1,
        ...temp.etapa2,
        ...temp.etapa3,
        status: 'CONCLUIDO',
    };

    window.utils.mostrarNotificacao('Salvando PPC...', 'info');

    let ppcId;

    if (editandoId) {
        const resultado = await window.api.atualizarPpc(editandoId, ppcCompleto);
        if (!resultado.success) {
            window.utils.mostrarNotificacao(`Erro ao atualizar PPC: ${resultado.error}`, 'error');
            return;
        }
        ppcId = Number(editandoId);
        await window.api.deletarTodosComponentes(ppcId);
    } else {
        const resultado = await window.api.criarPpc(ppcCompleto);
        if (!resultado.success) {
            window.utils.mostrarNotificacao(`Erro ao criar PPC: ${resultado.error}`, 'error');
            return;
        }
        ppcId = resultado.data.id;
    }

    for (const componente of componentes) {
        const resultado = await window.api.criarComponente(ppcId, componente);
        if (!resultado.success) {
            window.utils.mostrarNotificacao(`Erro ao salvar "${componente.nome}": ${resultado.error}`, 'error');
            return;
        }
    }

    localStorage.removeItem('ppcTempData');
    localStorage.removeItem('ppcComponentesTemp');
    localStorage.removeItem('ppcEditandoId');

    window.utils.mostrarNotificacao('PPC concluído com sucesso!', 'success');
    setTimeout(() => { window.location.href = '/frontend/pages/paginaInicial'; }, 1500);
}

// ==========================================
// UTILITÁRIOS
// ==========================================
function salvarEtapa(etapa, dados) {
    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    temp[etapa] = dados;
    localStorage.setItem('ppcTempData', JSON.stringify(temp));
}

function cancelarPpc() {
    if (confirm('Deseja cancelar? Os dados não salvos serão perdidos.')) {
        localStorage.removeItem('ppcTempData');
        localStorage.removeItem('ppcComponentesTemp');
        localStorage.removeItem('ppcEditandoId');
        window.location.href = '/frontend/pages/paginaInicial';
    }
}

function salvarRascunho() {
    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');
    if (!temp.etapa2?.cursoNome) {
        window.utils.mostrarNotificacao('Preencha o Nome do Curso (etapa 2) antes de salvar o rascunho.', 'error');
        return;
    }
    salvarComoRascunho();
}

async function salvarComoRascunho() {
    const usuarioId = window.api.getUsuarioId() || window.api.getUsuarioLogado()?.id;

    if (!usuarioId) {
        window.utils.mostrarNotificacao('Sessão expirada. Faça login novamente.', 'error');
        window.location.href = '/frontend/pages/login';
        return;
    }

    const temp = JSON.parse(localStorage.getItem('ppcTempData') || '{}');

    if (!temp.etapa2?.cursoNome) {
        window.utils.mostrarNotificacao('Preencha o Nome do Curso (etapa 2) antes de salvar o rascunho.', 'error');
        return;
    }

    const editandoId = localStorage.getItem('ppcEditandoId');

    const ppcRascunho = {
        usuarioId: parseInt(usuarioId),
        campusNome: '', campusCidade: '', campusCnpj: '', campusCep: '',
        campusBairro: '', campusRua: '', campusNumero: '', campusTelefoneFax: '',
        campusEmail: '', campusAtoLegal: '', campusSite: '',
        cursoTipo: '', cursoNome: '', cursoEixoTecnologico: '', cursoModalidade: '',
        cursoOferta: '', cursoTitulacao: '', cursoEstagio: '',
        cursoSemanasLetivas: 0, cursoAtivComplem: 0, cursoIntegMinima: 0, cursoIntegMaxima: 0,
        cursoFormasAcesso: '', cursoPreRequisitos: '',
        ofertaRegime: '', ofertaTurnos: '', ofertaNumTurmas: 0, ofertaVagasTurma: 0,
        ofertaVagasTurno: 0, ofertaVagasSemestre: 0, ofertaDuracao: 0,
        indicadorCC: 'Não se aplica', indicadorCPC: 'Não se aplica',
        indicadorEnade: 'Não se aplica', indicadorIGC: 'Não se aplica',
        cursoSituacao: '', cursoStatus: '',
        ...temp.etapa1,
        ...temp.etapa2,
        ...temp.etapa3,
        status: 'EM_ANDAMENTO',
    };

    window.utils.mostrarNotificacao('Salvando rascunho...', 'info');

    let ppcId;

    if (editandoId) {
        const resultado = await window.api.atualizarPpc(editandoId, ppcRascunho);
        if (!resultado.success) {
            window.utils.mostrarNotificacao(`Erro ao atualizar rascunho: ${resultado.error}`, 'error');
            return;
        }
        ppcId = Number(editandoId);
        await window.api.deletarTodosComponentes(ppcId);
    } else {
        const resultado = await window.api.criarPpc(ppcRascunho);
        if (!resultado.success) {
            window.utils.mostrarNotificacao(`Erro ao salvar rascunho: ${resultado.error}`, 'error');
            return;
        }
        ppcId = resultado.data.id;
    }

    const componentes = getComponentesTemp();
    for (const componente of componentes) {
        await window.api.criarComponente(ppcId, componente);
    }

    localStorage.removeItem('ppcTempData');
    localStorage.removeItem('ppcComponentesTemp');
    localStorage.removeItem('ppcEditandoId');

    window.utils.mostrarNotificacao('Rascunho salvo! Você pode continuar depois em "PPCs em andamento".', 'success');
    setTimeout(() => { window.location.href = '/frontend/pages/paginaInicial'; }, 2000);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('NovoPPc') && !path.includes('Curso') && !path.includes('Componentes')) initEtapa1();
    if (path.includes('NovoPPcCurso') && !path.includes('Curso2')) initEtapa2();
    if (path.includes('NovoPPcCurso2')) initEtapa3();
    if (path.includes('NovoPPcComponentes')) initEtapa4();
});
