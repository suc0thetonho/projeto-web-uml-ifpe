requireAuth();

const tabela = document.getElementById('tabelaPpcs') || document.getElementById('tabelaPpcsAndamento');
const campoBusca = document.getElementById('buscarDocumento');

const isAndamento = !!document.getElementById('tabelaPpcsAndamento');
const statusFiltro = isAndamento ? 'andamento' : 'concluido';

let ppcsCarregados = [];

function formatarData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function statusBadge(status) {
  const cores = { rascunho: '#888', andamento: '#f90', concluido: '#2a2' };
  const cor = cores[status] || '#888';
  return `<span style="color:${cor};font-weight:600">${status}</span>`;
}

function renderizarTabela(lista) {
  if (!tabela) return;

  if (lista.length === 0) {
    tabela.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:1rem">Nenhum documento encontrado</td></tr>';
    return;
  }

  tabela.innerHTML = lista.map(ppc => `
    <tr>
      <td>
        <a href="#" class="link-ppc" data-id="${ppc.id}" style="font-weight:500;text-decoration:underline;cursor:pointer">${ppc.nome_curso || '—'}</a>
        <small style="color:#888">(${ppc.nome_campus || '—'})</small>
      </td>
      <td>${formatarData(ppc.created_at)}</td>
      <td>${statusBadge(ppc.status)}</td>
      <td>${isAndamento
        ? `<button class="btn-apagar" data-id="${ppc.id}"
             style="background:#fdecea;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:12px;color:#c0392b;font-weight:600">
             🗑 Apagar</button>`
        : `<button class="btn-pdf" data-id="${ppc.id}"
             style="background:#e8eef7;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:12px;color:#0056c7;font-weight:600;margin-right:4px">
             ⬇ PDF</button>
           <button class="btn-odt" data-id="${ppc.id}"
             style="background:#e6f4ec;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;font-size:12px;color:#1a7a3c;font-weight:600">
             ⬇ ODT</button>`
      }</td>
    </tr>`).join('');

  tabela.querySelectorAll('.link-ppc').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAndamento) {
        localStorage.setItem('xppc-ppc-id', link.dataset.id);
        window.location.href = '/frontend/pages/NovoPPc.html';
      } else {
        localStorage.setItem('xppc-detalhe-id', link.dataset.id);
        window.location.href = '/frontend/pages/PPcDetalhes.html';
      }
    });
  });

  tabela.querySelectorAll('.btn-pdf').forEach(btn => {
    btn.addEventListener('click', () => gerarPdfPpc(btn.dataset.id));
  });

  tabela.querySelectorAll('.btn-odt').forEach(btn => {
    btn.addEventListener('click', () => gerarOdtPpc(btn.dataset.id));
  });

  tabela.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async () => {
      const nome = btn.closest('tr').querySelector('.link-ppc').textContent;
      if (!confirm(`Deseja apagar o PPC "${nome}"? Esta ação não pode ser desfeita.`)) return;

      const res = await apiFetch(`/ppcs/${btn.dataset.id}`, { method: 'DELETE' });
      if (!res) return;

      if (res.ok) {
        ppcsCarregados = ppcsCarregados.filter(p => String(p.id) !== btn.dataset.id);
        renderizarTabela(ppcsCarregados);
      } else {
        const dados = await res.json();
        alert(`Erro ao apagar: ${dados.erro}`);
      }
    });
  });
}

async function carregarPpcs() {
  const res = await apiFetch(`/ppcs?status=${statusFiltro}`);
  if (!res) return;

  ppcsCarregados = await res.json();
  renderizarTabela(ppcsCarregados);
}

campoBusca?.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase();
  const filtrados = ppcsCarregados.filter(p =>
    (p.nome_curso || '').toLowerCase().includes(termo) ||
    (p.nome_campus || '').toLowerCase().includes(termo)
  );
  renderizarTabela(filtrados);
});

carregarPpcs();
