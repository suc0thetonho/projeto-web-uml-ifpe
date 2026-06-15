requireAuth();

const id = localStorage.getItem('xppc-detalhe-id');
if (!id) window.location.href = '/frontend/pages/PPcCad.html';

function preencher(elementId, valor) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (valor != null && String(valor).trim() !== '') {
    el.textContent = valor;
  } else {
    el.textContent = '—';
    el.classList.add('vazio');
  }
}

function definirBadge(status) {
  const badge = document.getElementById('badge-status');
  if (!badge) return;
  badge.textContent = status;
  badge.className = `badge-status badge-${status}`;
}

async function carregarPpc() {
  const res = await apiFetch(`/ppcs/${id}`);
  if (!res || !res.ok) {
    alert('Erro ao carregar o PPC');
    window.location.href = '/frontend/pages/PPcCad.html';
    return;
  }

  const ppc = await res.json();

  // Cabeçalho
  document.title = `${ppc.nome_curso || 'PPC'} - xPPC`;
  document.getElementById('titulo-ppc').textContent = ppc.nome_curso || 'PPC sem nome';
  document.getElementById('subtitulo-ppc').textContent = ppc.nome_campus || '';
  document.getElementById('breadcrumb-nome').textContent = ppc.nome_curso || 'Detalhes';
  definirBadge(ppc.status);

  // Campus
  preencher('nome_campus', ppc.nome_campus);
  preencher('cnpj', ppc.cnpj);
  preencher('cidade_campus', ppc.cidade_campus);
  preencher('cep', ppc.cep);
  preencher('bairro', ppc.bairro);
  preencher('rua', ppc.rua);
  preencher('numero', ppc.numero);
  preencher('telefone_fax', ppc.telefone_fax);
  preencher('email_contato', ppc.email_contato);
  preencher('ato_legal', ppc.ato_legal);
  preencher('sitio', ppc.sitio);

  // Curso (parte 1)
  preencher('tipo_curso', ppc.tipo_curso);
  preencher('nome_curso', ppc.nome_curso);
  preencher('eixo_tecnologico', ppc.eixo_tecnologico);
  preencher('modalidade', ppc.modalidade);
  preencher('formas_oferta', ppc.formas_oferta);
  preencher('titulacao', ppc.titulacao);
  preencher('ch_estagio_hr', ppc.ch_estagio_hr);
  preencher('num_semanas_letivas', ppc.num_semanas_letivas);
  preencher('atividades_complementares_hr', ppc.atividades_complementares_hr);
  preencher('formas_acesso', ppc.formas_acesso);
  preencher('periodo_integralizacao_min', ppc.periodo_integralizacao_min);
  preencher('periodo_integralizacao_max', ppc.periodo_integralizacao_max);
  preencher('prerequisitos_ingresso', ppc.prerequisitos_ingresso);

  // Curso (parte 2)
  preencher('regime', ppc.regime);
  preencher('turnos', ppc.turnos);
  preencher('duracao_curso', ppc.duracao_curso);
  preencher('num_turmas_por_turno', ppc.num_turmas_por_turno);
  preencher('vagas_por_turma', ppc.vagas_por_turma);
  preencher('num_vagas_por_turno', ppc.num_vagas_por_turno);
  preencher('vagas_por_semestre', ppc.vagas_por_semestre);
  preencher('conceito_curso', ppc.conceito_curso);
  preencher('conceito_preliminar_curso', ppc.conceito_preliminar_curso);
  preencher('conceito_enade', ppc.conceito_enade);
  preencher('igc', ppc.igc);
  preencher('situacao_curso', ppc.situacao_curso);
  preencher('status_curso', ppc.status_curso);
}

async function carregarComponentes() {
  const res = await apiFetch(`/ppcs/${id}/componentes`);
  const tbody = document.getElementById('tbody-componentes');

  if (!res || !res.ok) {
    tbody.innerHTML = '<tr><td colspan="12" class="sem-dados">Erro ao carregar componentes</td></tr>';
    return;
  }

  const lista = await res.json();

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" class="sem-dados">Nenhum componente cadastrado</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(c => `
    <tr>
      <td>${c.codigo || '—'}</td>
      <td>${c.nome || '—'}</td>
      <td>${c.tipo || '—'}</td>
      <td>${c.periodo || '—'}</td>
      <td>${c.creditos_praticas ?? '—'}</td>
      <td>${c.creditos_teoricas ?? '—'}</td>
      <td>${c.creditos_extensao ?? '—'}</td>
      <td>${c.total_horas_praticas ?? '—'}</td>
      <td>${c.total_horas_teoricas ?? '—'}</td>
      <td>${c.total_horas_extensao ?? '—'}</td>
      <td>${c.prerequisitos || '—'}</td>
      <td>${c.correquisitos || '—'}</td>
    </tr>
  `).join('');
}

document.getElementById('btn-baixar-pdf')?.addEventListener('click', () => gerarPdfPpc(id));
document.getElementById('btn-baixar-odt')?.addEventListener('click', () => gerarOdtPpc(id));

carregarPpc();
carregarComponentes();
