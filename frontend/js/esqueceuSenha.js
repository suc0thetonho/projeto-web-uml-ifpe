const form = document.querySelector('.formulario');
const aviso = document.querySelector('.aviso');
const btnContinuar = form?.querySelector('.botao');

btnContinuar?.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = form.querySelector('input[type="email"]').value.trim();
  if (!email) {
    aviso.textContent = '⚠ Informe o seu email';
    return;
  }

  aviso.textContent = 'ℹ Enviando código...';

  try {
    const res = await fetch('http://localhost:3000/api/auth/esqueceu-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const dados = await res.json();

    if (!res.ok) {
      aviso.textContent = `⚠ ${dados.erro}`;
      return;
    }

    localStorage.setItem('xppc-recuperacao-email', email);
    window.location.href = '/frontend/pages/ConfirmarCod.html';
  } catch {
    aviso.textContent = '⚠ Erro de conexão com o servidor';
  }
});
