// Gerenciamento das tabelas de PPCs cadastrados e em andamento

const API_BASE = 'http://localhost:3000/api';

// Carregar PPCs cadastrados (concluídos)
async function carregarPpcsCadastrados() {
    const tbody = document.getElementById('tabelaPpcs');
    if (!tbody) return;

    const result = await window.api.listarPpcs();

    if (result.success && result.data) {
        const ppcsConcluidos = result.data.filter(ppc => ppc.status === 'CONCLUIDO');

        if (ppcsConcluidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum PPC cadastrado encontrado</td></tr>`;
            return;
        }

        tbody.innerHTML = ppcsConcluidos.map(ppc => `
            <tr>
                <td><a href="/frontend/pages/PPcDetalhe?id=${ppc.id}">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>✅ Concluído</td>
                <td class="acoes-tabela">
                    <a class="btn-acao btn-pdf" href="${API_BASE}/ppcs/${ppc.id}/export/pdf" target="_blank" title="Baixar PDF">PDF</a>
                    <a class="btn-acao btn-odt" href="${API_BASE}/ppcs/${ppc.id}/export/odt" target="_blank" title="Baixar ODT">ODT</a>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar PPCs</td></tr>`;
    }
}

// Carregar PPCs em andamento
async function carregarPpcsAndamento() {
    const tbody = document.getElementById('tabelaPpcsAndamento');
    if (!tbody) return;

    const result = await window.api.listarPpcs();

    if (result.success && result.data) {
        // Filtrar apenas PPCs EM_ANDAMENTO
        const ppcsAndamento = result.data.filter(ppc => ppc.status === 'EM_ANDAMENTO');

        if (ppcsAndamento.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Nenhum PPC em andamento encontrado</td></tr>`;
            return;
        }

        tbody.innerHTML = ppcsAndamento.map(ppc => `
            <tr>
                <td><a href="#" onclick="verPpc(${ppc.id}, 'EM_ANDAMENTO'); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>📝 Em andamento</td>
                <td class="acoes-tabela">
                    <button class="btn-acao btn-excluir" onclick="confirmarDeletarPpc(${ppc.id}, '${(ppc.cursoNome || 'este PPC').replace(/'/g, "\\'")}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Erro ao carregar PPCs</td></tr>`;
    }
}

// Buscar PPCs por nome
async function buscarPpcs() {
    const buscaInput = document.getElementById('buscarDocumento');
    if (!buscaInput) return;

    const termo = buscaInput.value;
    const result = await window.api.listarPpcs(termo);

    // Determinar qual tabela está visível
    const tabelaCadastrados = document.getElementById('tabelaPpcs');
    const tabelaAndamento = document.getElementById('tabelaPpcsAndamento');

    let ppcs = result.success ? result.data : [];

    if (tabelaCadastrados) {
        const ppcsFiltrados = ppcs.filter(ppc => ppc.status === 'CONCLUIDO');
        tabelaCadastrados.innerHTML = ppcsFiltrados.map(ppc => `
            <tr>
                <td><a href="/frontend/pages/PPcDetalhe?id=${ppc.id}">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>✅ Concluído</td>
                <td class="acoes-tabela">
                    <a class="btn-acao btn-pdf" href="${API_BASE}/ppcs/${ppc.id}/export/pdf" target="_blank">PDF</a>
                    <a class="btn-acao btn-odt" href="${API_BASE}/ppcs/${ppc.id}/export/odt" target="_blank">ODT</a>
                </td>
            </tr>
        `).join('');
    }

    if (tabelaAndamento) {
        const ppcsFiltrados = ppcs.filter(ppc => ppc.status === 'EM_ANDAMENTO');
        tabelaAndamento.innerHTML = ppcsFiltrados.map(ppc => `
            <tr>
                <td><a href="#" onclick="verPpc(${ppc.id}, 'EM_ANDAMENTO'); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>📝 Em andamento</td>
                <td class="acoes-tabela">
                    <button class="btn-acao btn-excluir" onclick="confirmarDeletarPpc(${ppc.id}, '${(ppc.cursoNome || 'este PPC').replace(/'/g, "\\'")}')">Excluir</button>
                </td>
            </tr>
        `).join('');
    }
}

// Deletar PPC em andamento
async function confirmarDeletarPpc(id, nome) {
    if (!confirm(`Deseja excluir o rascunho "${nome}"? Esta ação não pode ser desfeita.`)) return;

    const result = await window.api.deletarPpc(id);

    if (result.success) {
        window.utils.mostrarNotificacao('Rascunho excluído com sucesso.', 'success');
        carregarPpcsAndamento();
    } else {
        window.utils.mostrarNotificacao('Erro ao excluir o PPC.', 'error');
    }
}

// Visualizar / continuar PPC
function verPpc(id, status) {
    if (status === 'EM_ANDAMENTO') {
        localStorage.removeItem('ppcTempData');
        localStorage.removeItem('ppcComponentesTemp');
        localStorage.setItem('ppcEditandoId', id);
        window.location.href = `/frontend/pages/NovoPPc?editar=${id}`;
        return;
    }

    window.location.href = `/frontend/pages/PPcDetalhe?id=${id}`;
}

// Buscar dinâmica enquanto digita (debounce)
let buscaTimeout;
function setupBuscaDinamica() {
    const buscaInput = document.getElementById('buscarDocumento');
    if (buscaInput) {
        buscaInput.addEventListener('input', () => {
            clearTimeout(buscaTimeout);
            buscaTimeout = setTimeout(buscarPpcs, 500);
        });
    }
}

// Inicializar páginas
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('PPcCad')) {
        carregarPpcsCadastrados();
        setupBuscaDinamica();
    }

    if (path.includes('PPcAndamento')) {
        carregarPpcsAndamento();
        setupBuscaDinamica();
    }
});

window.ppcListas = {
    carregarCadastrados: carregarPpcsCadastrados,
    carregarAndamento: carregarPpcsAndamento,
    buscar: buscarPpcs,
    ver: verPpc,
};