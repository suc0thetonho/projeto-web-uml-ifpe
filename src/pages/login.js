"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const inputEmail = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const divAviso = document.getElementById('mensagem-aviso');
    formLogin.addEventListener('submit', async (evento) => {
        // Previne o recarregamento padrão da página
        evento.preventDefault();
        const dadosLogin = {
            email: inputEmail.value,
            senha: inputSenha.value
        };
        try {
            // Atualiza a mensagem na tela para dar feedback ao usuário
            divAviso.textContent = '⏳ Autenticando...';
            divAviso.style.color = '#333';
            // ATENÇÃO: O seu colega de backend precisa criar exatamente essa rota '/api/auth/login'
            const resposta = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosLogin)
            });
            if (!resposta.ok) {
                // Se o backend retornar erro (ex: 401 Não Autorizado)
                throw new Error('E-mail ou senha inválidos.');
            }
            const dados = await resposta.json();
            // Salva o token de acesso no navegador para usar nas próximas telas
            localStorage.setItem('xppc_token', dados.token);
            // Salva os dados básicos do usuário para exibir o nome no painel
            localStorage.setItem('xppc_usuario', JSON.stringify(dados.usuario));
            divAviso.textContent = '✅ Login realizado com sucesso! Redirecionando...';
            divAviso.style.color = 'green';
            // Redireciona para a página inicial logada 
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1000);
        }
        catch (erro) {
            // Exibe o erro na tela
            divAviso.textContent = `❌ Erro: ${erro.message}`;
            divAviso.style.color = 'red';
        }
    });
});
