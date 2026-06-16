export {};

document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.getElementById('input-email-erro') as HTMLInputElement;
    const inputCodigo = document.getElementById('input-codigo-erro') as HTMLInputElement;
    const btnVerificar = document.getElementById('btn-verificar-erro') as HTMLButtonElement;

    // Recupera o e-mail mantido na sessão
    const emailArmazenado = sessionStorage.getItem('email_recuperacao');
    if (emailArmazenado) {
        inputEmail.value = emailArmazenado;
    }

    btnVerificar.addEventListener('click', async () => {
        const codigo = inputCodigo.value;

        if (!codigo) {
            alert("Por favor, digite o código.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/validar-codigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailArmazenado, codigo: codigo })
            });

            if (response.ok) {
                alert("Código validado!");
                window.location.href = '../pages/novaSenha.html';
            } else {
                // Mantém na mesma tela se falhar novamente
                alert("Código ainda inválido. Tente novamente.");
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    });
});