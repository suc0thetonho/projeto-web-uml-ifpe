requireAuth();

const usuario = JSON.parse(localStorage.getItem('xppc-usuario') || '{}');

async function carregarResumo() {
  const [resAndamento, resConcluidos] = await Promise.all([
    apiFetch('/ppcs?status=andamento'),
    apiFetch('/ppcs?status=concluido'),
  ]);

  if (!resAndamento || !resConcluidos) return;

  const andamento = await resAndamento.json();
  const concluidos = await resConcluidos.json();

  const cardAndamento = document.querySelector('.cards-resumo .card-resumo:nth-child(1) .texto-laranja');
  const cardConcluidos = document.querySelector('.cards-resumo .card-resumo:nth-child(2) .texto-verde');

  if (cardAndamento) cardAndamento.textContent = `${andamento.length} registro${andamento.length !== 1 ? 's' : ''}`;
  if (cardConcluidos) cardConcluidos.textContent = `${concluidos.length} registro${concluidos.length !== 1 ? 's' : ''}`;
}

async function carregarAtividades() {
  const res = await apiFetch('/ppcs');
  if (!res) return;

  const ppcs = await res.json();
  const area = document.querySelector('.ultimas-atividades p');
  if (!area) return;

  if (ppcs.length === 0) {
    area.textContent = 'Nenhuma atividade recente.';
    return;
  }

  area.textContent = ppcs
    .slice(0, 5)
    .map(p => `${p.nome_curso || 'PPC sem nome'} — ${p.status}`)
    .join(' · ');
}

carregarResumo();
carregarAtividades();
