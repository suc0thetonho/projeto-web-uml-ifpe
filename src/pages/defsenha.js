"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formDefSenha = document.getElementById('form-defsenha');
    const inputSenha = document.getElementById('senha');
    const inputConfirmarSenha = document.getElementById('confirmar-senha');
    const divAviso = document.getElementById('mensagem-aviso');
    // 1. Resgata os dados da tela anterior que estão no sessionStorage
    const dadosSalvos = sessionStorage.getItem('xppc_dados_cadastro');
    // Se o usuário tentar acessar essa tela direto pela URL sem passar pela tela 1, barramos ele.
    if (!dadosSalvos) {
        alert("Nenhum dado de cadastro encontrado. Retornando para a tela inicial.");
        window.location.href = '/frontend/pages/cadastro.html';
        return;
    }
    const dadosCadastro = JSON.parse(dadosSalvos);
    formDefSenha.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        // 2. Validação: Verifica se as senhas são iguais
        if (inputSenha.value !== inputConfirmarSenha.value) {
            divAviso.textContent = '❌ As senhas não coincidem. Tente novamente.';
            divAviso.style.color = 'red';
            return;
        }
        // 3. Monta o JSON final juntando os dados da tela 1 com a senha da tela 2
        const payloadFinal = {
            ...dadosCadastro, // Pega todos os campos (nome, cpf, etc) e espalha aqui dentro
            senha: inputSenha.value
        };
        console.log("JSON FINAL PRONTO PARA ENVIO:", JSON.stringify(payloadFinal));
        try {
            divAviso.textContent = '⏳ Finalizando cadastro...';
            divAviso.style.color = '#333';
            // 4. Dispara para o backend
            const resposta = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadFinal)
            });
            // Simulando o sucesso para você não ficar travado enquanto o backend não fica pronto:
            // Apague ou comente o bloco IF abaixo e ative essa simulação se precisar testar o fluxo visual completo
            await new Promise(resolve => setTimeout(resolve, 1000));
            divAviso.textContent = '✅ Cadastro realizado! Redirecionando para login...';
            divAviso.style.color = 'green';
            sessionStorage.removeItem('xppc_dados_cadastro');
            setTimeout(() => { window.location.href = '/frontend/pages/login.html'; }, 1500);
            return;
            if (!resposta.ok) {
                throw new Error('Falha ao comunicar com o servidor.');
            }
            // Limpa o armazenamento temporário pois já enviamos para o banco
            sessionStorage.removeItem('xppc_dados_cadastro');
            divAviso.textContent = '✅ Cadastro realizado com sucesso! Redirecionando para login...';
            divAviso.style.color = 'green';
            // Redireciona para o login para ele usar a nova senha
            setTimeout(() => {
                window.location.href = '../../frontend/pages/login.html';
            }, 1500);
        }
        catch (erro) {
            // Se der erro de conexão (backend offline), cai aqui
            divAviso.textContent = `❌ Erro de conexão. Verifique o console.`;
            divAviso.style.color = 'red';
        }
    });
});
