const form = document.querySelector('.formulario-login');
const aviso = document.querySelector('.aviso');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.querySelector('input[name="email"]').value.trim();
  const senha = form.querySelector('input[name="senha"]').value;

  aviso.textContent = 'ℹ Verificando credenciais...';

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await res.json();

    if (!res.ok) {
      aviso.textContent = `⚠ ${dados.erro}`;
      return;
    }

    localStorage.setItem('xppc-token', dados.token);
    localStorage.setItem('xppc-usuario', JSON.stringify(dados.usuario));
    window.location.href = '/frontend/pages/paginaInicial.html';
  } catch {
    aviso.textContent = '⚠ Erro de conexão com o servidor';
  }
});
