const form = document.querySelector('.formulario-senha');
const btnFinalizar = form?.querySelector('.botao');

// Modo: 'cadastro' (primeiro acesso) ou 'recuperacao' (redefinir senha)
const usuarioId = localStorage.getItem('xppc-cadastro-id');
const emailRecuperacao = localStorage.getItem('xppc-recuperacao-email');
const tokenRecuperacao = localStorage.getItem('xppc-recuperacao-token');

btnFinalizar?.addEventListener('click', async (e) => {
  e.preventDefault();

  const senha = document.getElementById('senha').value;
  const confirmar = document.getElementById('confirmar-senha').value;

  if (!senha || senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres');
    return;
  }
  if (senha !== confirmar) {
    alert('As senhas não coincidem');
    return;
  }

  try {
    let res;

    if (usuarioId) {
      // Primeiro acesso após cadastro
      res = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}/senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
    } else if (emailRecuperacao && tokenRecuperacao) {
      // Redefinição de senha via código
      res = await fetch('http://localhost:3000/api/auth/definir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailRecuperacao, token: tokenRecuperacao, senha }),
      });
    } else {
      alert('Sessão inválida. Volte ao início.');
      return;
    }

    const dados = await res.json();

    if (!res.ok) {
      alert(`Erro: ${dados.erro}`);
      return;
    }

    localStorage.removeItem('xppc-cadastro-id');
    localStorage.removeItem('xppc-recuperacao-email');
    localStorage.removeItem('xppc-recuperacao-token');
    window.location.href = '/frontend/pages/login.html';
  } catch {
    alert('Erro de conexão com o servidor');
  }
});
