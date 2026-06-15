const form = document.querySelector('.formulario');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    nome:            form.querySelector('[name="nome"]').value.trim(),
    cpf:             form.querySelector('[name="cpf"]').value.trim(),
    data_nascimento: form.querySelector('[name="data_nascimento"]').value,
    email:           form.querySelector('[name="email"]').value.trim(),
    telefone:        form.querySelector('[name="telefone"]').value.trim(),
    matricula:       form.querySelector('[name="matricula"]').value.trim(),
    curso_area:      form.querySelector('[name="curso_area"]').value.trim(),
    departamento:    form.querySelector('[name="departamento"]').value.trim(),
    campus:          form.querySelector('[name="campus"]').value.trim(),
    cidade:          form.querySelector('[name="cidade"]').value.trim(),
    estado:          form.querySelector('[name="estado"]').value.trim(),
  };

  try {
    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const resposta = await res.json();

    if (!res.ok) {
      alert(`Erro: ${resposta.erro}`);
      return;
    }

    localStorage.setItem('xppc-cadastro-id', resposta.usuario.id);
    window.location.href = '/frontend/pages/defsenha.html';
  } catch {
    alert('Erro de conexão com o servidor');
  }
});
