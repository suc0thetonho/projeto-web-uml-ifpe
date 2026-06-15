const TEMA_KEY = 'xppc-tema';

function aplicarTema(tema) {
  document.body.dataset.tema = tema;
}

aplicarTema(localStorage.getItem(TEMA_KEY) || 'claro');

document.querySelector('.switch-tema')?.addEventListener('click', () => {
  const novo = document.body.dataset.tema === 'claro' ? 'escuro' : 'claro';
  localStorage.setItem(TEMA_KEY, novo);
  aplicarTema(novo);
});
