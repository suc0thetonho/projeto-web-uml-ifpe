function campo(label, valor) {
    const texto = (valor !== null && valor !== undefined && valor !== '' && valor !== 0)
        ? String(valor)
        : '';
    return `
        <div class="detalhe-campo">
            <label>${label}</label>
            <span${texto ? '' : ' class="vazio"'}>${texto}</span>
        </div>`;
}

function renderizarPpc(ppc) {
    const API_BASE = 'http://localhost:3000/api';
    document.title = `${ppc.cursoNome || 'PPC'} - xPPC`;
    document.getElementById('breadcrumb-nome').textContent = ppc.cursoNome || 'Detalhes do PPC';
    document.getElementById('btn-pdf').href = `${API_BASE}/ppcs/${ppc.id}/export/pdf`;
    document.getElementById('btn-odt').href = `${API_BASE}/ppcs/${ppc.id}/export/odt`;

    const componentes = ppc.componentes || [];

    const tabelaComponentes = componentes.length === 0
        ? `<p class="sem-componentes">Nenhum componente curricular cadastrado.</p>`
        : `<table class="tabela-detalhe">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Período</th>
                    <th>Cr. Teóricos</th>
                    <th>Cr. Práticos</th>
                    <th>Cr. Extensão</th>
                    <th>H. Teóricas</th>
                    <th>H. Práticas</th>
                    <th>H. Extensão</th>
                    <th>Pré-requisitos</th>
                    <th>Correquisitos</th>
                </tr>
            </thead>
            <tbody>
                ${componentes
                    .sort((a, b) => a.periodo - b.periodo || a.nome.localeCompare(b.nome))
                    .map(c => `
                        <tr>
                            <td>${c.codigo}</td>
                            <td>${c.nome}</td>
                            <td>${c.tipo}</td>
                            <td>${c.periodo}º</td>
                            <td>${c.creditosTeoricos ?? 0}</td>
                            <td>${c.creditosPraticos ?? 0}</td>
                            <td>${c.creditosExtensao ?? 0}</td>
                            <td>${c.horasTeoricas ?? 0}</td>
                            <td>${c.horasPraticas ?? 0}</td>
                            <td>${c.horasExtensao ?? 0}</td>
                            <td>${c.preRequisitos || '—'}</td>
                            <td>${c.correquisitos || '—'}</td>
                        </tr>`).join('')}
            </tbody>
        </table>`;

    document.getElementById('conteudo-ppc').innerHTML = `
        <div class="detalhe-cabecalho">
            <h1>${ppc.cursoNome || 'PPC sem nome'}</h1>
            <span class="subtitulo">
                Criado em ${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}
                ${ppc.usuario ? ` · Coordenador: ${ppc.usuario.nome}` : ''}
            </span>
        </div>

        <div class="detalhe-secao">
            <h2>Dados do Campus</h2>
            <div class="detalhe-grade">
                ${campo('Nome do Campus', ppc.campusNome)}
                ${campo('Cidade', ppc.campusCidade)}
                ${campo('CNPJ', ppc.campusCnpj)}
                ${campo('CEP', ppc.campusCep)}
                ${campo('Bairro', ppc.campusBairro)}
                ${campo('Rua', ppc.campusRua)}
                ${campo('Número', ppc.campusNumero)}
                ${campo('Telefone/Fax', ppc.campusTelefoneFax)}
                ${campo('E-mail', ppc.campusEmail)}
                ${campo('Ato Legal', ppc.campusAtoLegal)}
                ${campo('Site', ppc.campusSite)}
            </div>
        </div>

        <div class="detalhe-secao">
            <h2>Dados do Curso</h2>
            <div class="detalhe-grade">
                ${campo('Nome do Curso', ppc.cursoNome)}
                ${campo('Tipo', ppc.cursoTipo)}
                ${campo('Eixo Tecnológico', ppc.cursoEixoTecnologico)}
                ${campo('Modalidade', ppc.cursoModalidade)}
                ${campo('Oferta', ppc.cursoOferta)}
                ${campo('Titulação', ppc.cursoTitulacao)}
                ${campo('Estágio', ppc.cursoEstagio)}
                ${campo('Semanas Letivas', ppc.cursoSemanasLetivas)}
                ${campo('Ativ. Complementares (h)', ppc.cursoAtivComplem)}
                ${campo('Integralização Mínima (sem)', ppc.cursoIntegMinima)}
                ${campo('Integralização Máxima (sem)', ppc.cursoIntegMaxima)}
                ${campo('Formas de Acesso', ppc.cursoFormasAcesso)}
                ${campo('Pré-requisitos', ppc.cursoPreRequisitos)}
                ${campo('Situação', ppc.cursoSituacao)}
                ${campo('Status', ppc.cursoStatus)}
            </div>
        </div>

        <div class="detalhe-secao">
            <h2>Oferta e Indicadores</h2>
            <div class="detalhe-grade">
                ${campo('Regime', ppc.ofertaRegime)}
                ${campo('Turnos', ppc.ofertaTurnos)}
                ${campo('Número de Turmas', ppc.ofertaNumTurmas)}
                ${campo('Vagas por Turma', ppc.ofertaVagasTurma)}
                ${campo('Vagas por Turno', ppc.ofertaVagasTurno)}
                ${campo('Vagas por Semestre', ppc.ofertaVagasSemestre)}
                ${campo('Duração (semestres)', ppc.ofertaDuracao)}
                ${campo('Conceito do Curso (CC)', ppc.indicadorCC)}
                ${campo('CPC', ppc.indicadorCPC)}
                ${campo('ENADE', ppc.indicadorEnade)}
                ${campo('IGC', ppc.indicadorIGC)}
            </div>
        </div>

        <div class="detalhe-secao">
            <h2>Componentes Curriculares (${componentes.length})</h2>
            ${tabelaComponentes}
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('conteudo-ppc').innerHTML =
            '<p style="text-align:center;padding:3rem;color:#c00;">ID do PPC não informado.</p>';
        return;
    }

    const result = await window.api.buscarPpcPorId(id);

    if (!result.success) {
        document.getElementById('conteudo-ppc').innerHTML =
            '<p style="text-align:center;padding:3rem;color:#c00;">Erro ao carregar o PPC.</p>';
        window.utils.mostrarNotificacao('Erro ao carregar PPC.', 'error');
        return;
    }

    renderizarPpc(result.data);
});
