// Gerenciamento das tabelas de PPCs cadastrados e em andamento

// Carregar PPCs cadastrados (concluídos)
async function carregarPpcsCadastrados() {
    const tbody = document.getElementById('tabelaPpcs');
    if (!tbody) return;

    const result = await window.api.listarPpcs();

    if (result.success && result.data) {
        // Filtrar apenas PPCs CONCLUIDOS
        const ppcsConcluidos = result.data.filter(ppc => ppc.status === 'CONCLUIDO');

        if (ppcsConcluidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Nenhum PPC cadastrado encontrado</td></tr>`;
            return;
        }

        tbody.innerHTML = ppcsConcluidos.map(ppc => `
            <tr>
                <td><a href="#" onclick="verPpc(${ppc.id}); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>${ppc.status === 'CONCLUIDO' ? '✅ Concluído' : '📝 Em andamento'}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Erro ao carregar PPCs</td></tr>`;
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
                <td><a href="#" onclick="verPpc(${ppc.id}); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>📝 ${ppc.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Concluído'}</td>
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
                <td><a href="#" onclick="verPpc(${ppc.id}); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>✅ Concluído</td>
            </tr>
        `).join('');
    }

    if (tabelaAndamento) {
        const ppcsFiltrados = ppcs.filter(ppc => ppc.status === 'EM_ANDAMENTO');
        tabelaAndamento.innerHTML = ppcsFiltrados.map(ppc => `
            <tr>
                <td><a href="#" onclick="verPpc(${ppc.id}); return false;">${ppc.cursoNome || 'PPC sem nome'}</a></td>
                <td>${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>📝 Em andamento</td>
            </tr>
        `).join('');
    }
}

// Visualizar detalhes do PPC
async function verPpc(id) {
    const result = await window.api.buscarPpcPorId(id);
    if (result.success) {
        const ppc = result.data;
        alert(`
            PPC: ${ppc.cursoNome}
            Status: ${ppc.status}
            Criado em: ${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}
            Campus: ${ppc.campusNome}
            Curso: ${ppc.cursoTipo} em ${ppc.cursoModalidade}
            Componentes: ${ppc.componentes?.length || 0} disciplinas
        `);
        // Aqui poderia abrir uma página de detalhes
    } else {
        alert('Erro ao carregar detalhes do PPC');
    }
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

    if (path.includes('PPcCad.html')) {
        carregarPpcsCadastrados();
        setupBuscaDinamica();
    }

    if (path.includes('PPcAndamento.html')) {
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