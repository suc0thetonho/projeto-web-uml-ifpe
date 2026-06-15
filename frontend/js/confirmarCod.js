const form = document.querySelector('form');
const aviso = document.querySelector('.aviso');
const btnContinuar = form?.querySelector('.botao');

const email = localStorage.getItem('xppc-recuperacao-email');
if (!email) window.location.href = '/frontend/pages/esqueceuSenha.html';

btnContinuar?.addEventListener('click', async (e) => {
  e.preventDefault();

  const token = form.querySelector('input').value.trim().toUpperCase();
  if (!token) {
    aviso.textContent = '⚠ Informe o código recebido';
    return;
  }

  aviso.textContent = 'ℹ Verificando código...';

  try {
    const res = await fetch('http://localhost:3000/api/auth/verificar-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token }),
    });

    const dados = await res.json();

    if (!res.ok) {
      window.location.href = '/frontend/pages/codInvalid.html';
      return;
    }

    localStorage.setItem('xppc-recuperacao-token', token);
    window.location.href = '/frontend/pages/defsenha.html';
  } catch {
    aviso.textContent = '⚠ Erro de conexão com o servidor';
  }
});
