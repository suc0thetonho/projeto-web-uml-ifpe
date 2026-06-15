requireAuth();

if (new URLSearchParams(window.location.search).get('novo') === '1') {
  ['xppc-ppc-id', 'xppc-ppc-campus', 'xppc-ppc-curso1', 'xppc-ppc-curso2'].forEach(k =>
    localStorage.removeItem(k)
  );
  history.replaceState(null, '', window.location.pathname);
}

// ─── Utilitários ───────────────────────────────────────────────────────────────

function lerLocalStorage(chave) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || '{}') || {};
    return Object.fromEntries(
      Object.entries(dados).map(([k, v]) => [k, v === '' ? null : v])
    );
  } catch {
    return {};
  }
}

function lerFormulario(form) {
  const dados = {};
  form.querySelectorAll('[name]').forEach(el => {
    const val = el.value.trim();
    dados[el.name] = val === '' ? null : val;
  });
  return dados;
}

function obterIdPpc() {
  return localStorage.getItem('xppc-ppc-id');
}

function validarCamposObrigatorios(form) {
  const invalidos = [];
  form.querySelectorAll('.grupo-campo').forEach(grupo => {
    if (grupo.querySelector('.obrigatorio')) {
      const input = grupo.querySelector('input, select, textarea');
      if (input && !input.value.trim()) invalidos.push(input);
    }
  });
  return invalidos;
}

function _limparErroCampo(grupo) {
  grupo.classList.remove('tem-erro');
  grupo.querySelector('.mensagem-erro-campo')?.remove();
}

function _aplicarErroCampo(el, mensagem) {
  const grupo = el.closest('.grupo-campo');
  if (!grupo) return;
  grupo.classList.add('tem-erro');
  let span = grupo.querySelector('.mensagem-erro-campo');
  if (!span) {
    span = document.createElement('span');
    span.className = 'mensagem-erro-campo';
    grupo.appendChild(span);
  }
  span.textContent = mensagem;
  el.addEventListener('input',  () => _limparErroCampo(grupo), { once: true });
  el.addEventListener('change', () => _limparErroCampo(grupo), { once: true });
}

function destacarCamposInvalidos(campos) {
  campos.forEach(el => _aplicarErroCampo(el, 'Campo obrigatório'));
  campos[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  campos[0]?.focus();
}

function mostrarErroCampo(nomeCampo, mensagem) {
  const el = document.querySelector(`[name="${nomeCampo}"]`);
  if (!el) return false;
  _aplicarErroCampo(el, mensagem);
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.focus();
  return true;
}

function feedbackBotao(btn, mensagem = 'Salvo!') {
  const textoOriginal = btn.textContent;
  btn.textContent = mensagem;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = textoOriginal; btn.disabled = false; }, 2000);
}

function mostrarErroBanner(mensagem) {
  const form = document.querySelector('.form-novo-ppc');
  if (!form) return;
  let banner = form.querySelector('.banner-erro-formulario');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'banner-erro-formulario';
    form.insertBefore(banner, form.firstChild);
  }
  banner.textContent = mensagem;
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarErroValidacao(erro) {
  if (erro.campo) {
    const encontrado = mostrarErroCampo(erro.campo, erro.erro);
    if (!encontrado) mostrarErroBanner(erro.erro);
  } else {
    mostrarErroBanner(erro.erro);
  }
}

function validarNomeCurso(form) {
  const campo = form.querySelector('[name="nome_curso"]');
  if (campo) return !!campo.value.trim();
  const salvo = JSON.parse(localStorage.getItem('xppc-ppc-curso1') || '{}');
  if (salvo.nome_curso) return true;
  return !!obterIdPpc();
}

async function salvarOuAtualizarRascunho(dados) {
  const id = obterIdPpc();
  let res;

  if (id) {
    res = await apiFetch(`/ppcs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...dados, status: 'andamento' }),
    });
  } else {
    res = await apiFetch('/ppcs', {
      method: 'POST',
      body: JSON.stringify({ ...dados, status: 'andamento' }),
    });
  }

  if (!res) return null;
  const ppc = await res.json();

  if (!res.ok) {
    const mensagem = ppc.erro || 'Erro ao salvar. Tente novamente.';
    if (ppc.campo) {
      const encontrado = mostrarErroCampo(ppc.campo, mensagem);
      if (!encontrado) mostrarErroBanner(mensagem);
    } else {
      mostrarErroBanner(mensagem);
    }
    return null;
  }

  localStorage.setItem('xppc-ppc-id', ppc.id);
  return ppc;
}

function cancelar() {
  ['xppc-ppc-id', 'xppc-ppc-campus', 'xppc-ppc-curso1', 'xppc-ppc-curso2'].forEach(k =>
    localStorage.removeItem(k)
  );
  window.location.href = '/frontend/pages/paginaInicial.html';
}

async function preencherFormulario(form, chaveLocal) {
  const id = obterIdPpc();
  if (id) {
    const res = await apiFetch(`/ppcs/${id}`);
    if (res?.ok) {
      const ppc = await res.json();
      form.querySelectorAll('[name]').forEach(el => {
        if (ppc[el.name] != null) el.value = ppc[el.name];
      });
    }
  } else {
    const salvo = lerLocalStorage(chaveLocal);
    Object.entries(salvo).forEach(([k, v]) => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el && v != null) el.value = v;
    });
  }
}

// ─── Etapa 1: Dados do Campus ──────────────────────────────────────────────────

const formCampus = document.getElementById('form-campus');
if (formCampus) {
  preencherFormulario(formCampus, 'xppc-ppc-campus');
  CamposRegras.aplicarAtributos(formCampus);

  formCampus.querySelector('.botao-cancelar')?.addEventListener('click', cancelar);

  formCampus.querySelector('.botao-proximo')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const invalidos = validarCamposObrigatorios(formCampus);
    if (invalidos.length > 0) {
      destacarCamposInvalidos(invalidos);
      return;
    }
    const dados = lerFormulario(formCampus);
    const erroRegras = CamposRegras.validar(dados);
    if (erroRegras) { mostrarErroValidacao(erroRegras); return; }
    localStorage.setItem('xppc-ppc-campus', JSON.stringify(dados));
    const ppc1 = await salvarOuAtualizarRascunho(dados);
    if (!ppc1) return;
    window.location.href = '/frontend/pages/NovoPPcCurso.html';
  });
}

// ─── Etapa 2: Dados do Curso (parte 1) ────────────────────────────────────────

const formCurso1 = document.getElementById('form-curso1');
if (formCurso1) {
  preencherFormulario(formCurso1, 'xppc-ppc-curso1');
  CamposRegras.aplicarAtributos(formCurso1);

  formCurso1.querySelector('.botao-cancelar')?.addEventListener('click', cancelar);

  formCurso1.querySelector('.botao-rascunho')?.addEventListener('click', async (e) => {
    if (!validarNomeCurso(formCurso1)) {
      mostrarErroCampo('nome_curso', 'Preencha o Nome do Curso antes de salvar o rascunho');
      return;
    }
    const dados = lerFormulario(formCurso1);
    const erroRegras = CamposRegras.validar(dados);
    if (erroRegras) { mostrarErroValidacao(erroRegras); return; }
    localStorage.setItem('xppc-ppc-curso1', JSON.stringify(dados));
    const dadosCampus = lerLocalStorage('xppc-ppc-campus');
    const ppc = await salvarOuAtualizarRascunho({ ...dadosCampus, ...dados });
    if (ppc) feedbackBotao(e.target);
  });

  formCurso1.querySelector('.botao-proximo')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const invalidos = validarCamposObrigatorios(formCurso1);
    if (invalidos.length > 0) {
      destacarCamposInvalidos(invalidos);
      return;
    }
    const dados = lerFormulario(formCurso1);
    const erroRegras = CamposRegras.validar(dados);
    if (erroRegras) { mostrarErroValidacao(erroRegras); return; }
    localStorage.setItem('xppc-ppc-curso1', JSON.stringify(dados));
    const dadosCampus = lerLocalStorage('xppc-ppc-campus');
    const ppc2 = await salvarOuAtualizarRascunho({ ...dadosCampus, ...dados });
    if (!ppc2) return;
    window.location.href = '/frontend/pages/NovoPPcCurso2.html';
  });
}

// ─── Etapa 3: Dados do Curso (parte 2) ────────────────────────────────────────

const formCurso2 = document.getElementById('form-curso2');
if (formCurso2) {
  preencherFormulario(formCurso2, 'xppc-ppc-curso2');
  CamposRegras.aplicarAtributos(formCurso2);

  formCurso2.querySelector('.botao-cancelar')?.addEventListener('click', cancelar);

  formCurso2.querySelector('.botao-rascunho')?.addEventListener('click', async (e) => {
    if (!validarNomeCurso(formCurso2)) {
      mostrarErroBanner('Preencha o campo "Nome do Curso" na etapa anterior antes de salvar o rascunho');
      return;
    }
    const dados = lerFormulario(formCurso2);
    const erroRegras = CamposRegras.validar(dados);
    if (erroRegras) { mostrarErroValidacao(erroRegras); return; }
    localStorage.setItem('xppc-ppc-curso2', JSON.stringify(dados));
    const dadosCampus = lerLocalStorage('xppc-ppc-campus');
    const dadosCurso1 = lerLocalStorage('xppc-ppc-curso1');
    const ppc = await salvarOuAtualizarRascunho({ ...dadosCampus, ...dadosCurso1, ...dados });
    if (ppc) feedbackBotao(e.target);
  });

  formCurso2.querySelector('.botao-proximo')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const invalidos = validarCamposObrigatorios(formCurso2);
    if (invalidos.length > 0) {
      destacarCamposInvalidos(invalidos);
      return;
    }
    const dados = lerFormulario(formCurso2);
    const erroRegras = CamposRegras.validar(dados);
    if (erroRegras) { mostrarErroValidacao(erroRegras); return; }
    localStorage.setItem('xppc-ppc-curso2', JSON.stringify(dados));
    const dadosCampus = lerLocalStorage('xppc-ppc-campus');
    const dadosCurso1 = lerLocalStorage('xppc-ppc-curso1');
    const ppc3 = await salvarOuAtualizarRascunho({ ...dadosCampus, ...dadosCurso1, ...dados });
    if (!ppc3) return;
    window.location.href = '/frontend/pages/NovoPPcComponentes.html';
  });
}

// ─── Etapa 4: Componentes Curriculares ────────────────────────────────────────

const formComponentes = document.getElementById('form-componentes');
if (formComponentes) {
  const tbody = formComponentes.querySelector('tbody');
  let componentesLocais = [];

  function renderizarComponentes() {
    tbody.innerHTML = componentesLocais.length === 0
      ? '<tr><td colspan="10" style="text-align:center;padding:.5rem">Nenhum componente adicionado</td></tr>'
      : componentesLocais.map(c => `
          <tr>
            <td>${c.codigo}</td>
            <td>${c.nome}</td>
            <td>${c.tipo}</td>
            <td>${c.periodo}</td>
            <td>${Number(c.creditos_praticas || 0) + Number(c.creditos_teoricas || 0) + Number(c.creditos_extensao || 0)}</td>
            <td>${c.total_horas_teoricas}</td>
            <td>${c.total_horas_praticas}</td>
            <td>${c.total_horas_extensao}</td>
            <td>${c.prerequisitos || '—'}</td>
            <td>${c.correquisitos || '—'}</td>
          </tr>`).join('');
  }

  renderizarComponentes();

  (async () => {
    const id = obterIdPpc();
    if (!id) return;
    const res = await apiFetch(`/ppcs/${id}/componentes`);
    if (res?.ok) {
      componentesLocais = await res.json();
      renderizarComponentes();
    }
  })();

  formComponentes.querySelector('.botao-cancelar')?.addEventListener('click', cancelar);

  formComponentes.querySelector('.botao-adicionar')?.addEventListener('click', (e) => {
    e.preventDefault();

    const invalidos = validarCamposObrigatorios(formComponentes);
    if (invalidos.length > 0) {
      destacarCamposInvalidos(invalidos);
      return;
    }

    const comp = {
      codigo:               formComponentes.querySelector('[name="codigo"]').value.trim(),
      nome:                 formComponentes.querySelector('[name="nome_componente"]').value.trim(),
      creditos_praticas:    formComponentes.querySelector('[name="creditos_praticas"]').value,
      creditos_teoricas:    formComponentes.querySelector('[name="creditos_teoricas"]').value,
      creditos_extensao:    formComponentes.querySelector('[name="creditos_extensao"]').value,
      total_horas_praticas: formComponentes.querySelector('[name="total_horas_praticas"]').value,
      total_horas_teoricas: formComponentes.querySelector('[name="total_horas_teoricas"]').value,
      total_horas_extensao: formComponentes.querySelector('[name="total_horas_extensao"]').value,
      tipo:                 formComponentes.querySelector('[name="tipo_componente"]').value.trim(),
      periodo:              formComponentes.querySelector('[name="periodo"]').value.trim(),
      prerequisitos:        formComponentes.querySelector('[name="prerequisitos_componente"]').value.trim(),
      correquisitos:        formComponentes.querySelector('[name="correquisitos"]').value.trim(),
    };

    componentesLocais.push(comp);
    renderizarComponentes();
    formComponentes.querySelectorAll('[name]').forEach(el => { el.value = ''; });
  });

  formComponentes.querySelector('.botao-gerar')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const id = obterIdPpc();
    if (!id) {
      mostrarErroBanner('Nenhum PPC em andamento. Volte ao início e preencha os dados do campus.');
      return;
    }

    if (componentesLocais.length === 0) {
      mostrarErroBanner('Adicione pelo menos um componente curricular antes de gerar o documento.');
      return;
    }

    try {
      await apiFetch(`/ppcs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'concluido' }),
      });

      await Promise.all(componentesLocais.map(comp =>
        apiFetch(`/ppcs/${id}/componentes`, {
          method: 'POST',
          body: JSON.stringify(comp),
        })
      ));

      ['xppc-ppc-id', 'xppc-ppc-campus', 'xppc-ppc-curso1', 'xppc-ppc-curso2'].forEach(k =>
        localStorage.removeItem(k)
      );

      window.location.href = '/frontend/pages/PPcCad.html';
    } catch {
      mostrarErroBanner('Erro ao salvar o PPC. Verifique sua conexão e tente novamente.');
    }
  });
}
