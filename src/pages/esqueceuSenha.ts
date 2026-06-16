export {};

document.addEventListener('DOMContentLoaded', () => {
    const btnContinuar = document.getElementById('btn-continuar') as HTMLButtonElement;
    const inputEmail = document.getElementById('input-email') as HTMLInputElement;

    btnContinuar.addEventListener('click', async () => {
        const email = inputEmail.value;

        if (!email || !email.includes('@')) {
            alert("Por favor, digite um e-mail válido.");
            return;
        }

        // Simulação de chamada ao backend (substitua pela sua rota real)
        try {
            console.log("Enviando código de recuperação para:", email);
            
            // Exemplo de fetch (comente se não tiver a rota pronta ainda)
            // await fetch('/api/auth/recuperar-senha', { method: 'POST', body: JSON.stringify({ email }) });

            alert("Código de acesso enviado para o seu e-mail!");
            
            // Redirecionamento após sucesso
            window.location.href = '../pages/ConfirmarCod.html';
        } catch (error) {
            alert("Erro ao processar solicitação. Tente novamente.");
        }
    });
});