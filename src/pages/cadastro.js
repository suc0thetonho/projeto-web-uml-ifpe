"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');
    formCadastro.addEventListener('submit', (evento) => {
        // Impede o recarregamento da página
        evento.preventDefault();
        // Coleta todos os valores dos inputs pelos IDs
        const dadosParciais = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            matricula: document.getElementById('matricula').value,
            curso: document.getElementById('curso').value,
            departamento: document.getElementById('departamento').value,
            campus: document.getElementById('campus').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
        };
        // Imprime no console para ter certeza de que capturou tudo certo
        console.log("Dados parciais salvos:", dadosParciais);
        // Salva os dados no sessionStorage (armazenamento temporário da aba)
        sessionStorage.setItem('xppc_dados_cadastro', JSON.stringify(dadosParciais));
        // Redireciona o usuário para a tela de definição de senha
        window.location.href = '../../frontend/pages/defsenha.html';
    });
});
