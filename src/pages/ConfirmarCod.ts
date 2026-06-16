export {};

document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.getElementById('input-email-confirmacao') as HTMLInputElement;
    const inputCodigo = document.getElementById('input-codigo') as HTMLInputElement;
    const btnVerificar = document.getElementById('btn-verificar') as HTMLButtonElement;

    // Recupera o e-mail da tela anterior
    const emailArmazenado = sessionStorage.getItem('email_recuperacao');
    if (emailArmazenado) {
        inputEmail.value = emailArmazenado;
    }

    btnVerificar.addEventListener('click', async () => {
        const codigo = inputCodigo.value;

        if (!codigo) {
            alert("Por favor, digite o código de confirmação.");
            return;
        }

        // Lógica de comunicação com o Backend
        try {
            const response = await fetch('http://localhost:3000/api/auth/validar-codigo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailArmazenado, codigo: codigo })
            });

            if (response.ok) {
                alert("Código validado com sucesso! Redirecionando...");
                window.location.href = '../pages/novaSenha.html'; // Próxima tela
            } else {
                alert("Código inválido ou expirado.");
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        }
    });
});