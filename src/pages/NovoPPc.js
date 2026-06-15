"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formNovoPpc = document.getElementById('form-novo-ppc');
    const btnRascunho = document.getElementById('btn-rascunho');
    const btnCancelar = document.getElementById('btn-cancelar');
    // Função para extrair os dados da tela
    const coletarDadosTela = () => {
        return {
            nomeCampus: document.getElementById('nomeCampus').value,
            cnpj: document.getElementById('cnpj').value,
            cidade: document.getElementById('cidade').value,
            cep: document.getElementById('cep').value,
            bairro: document.getElementById('bairro').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            atoLegal: document.getElementById('atoLegal').value,
            sitio: document.getElementById('sitio').value,
        };
    };
    // Ação do botão "Próximo" (Submit do form)
    formNovoPpc.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const dadosPasso1 = coletarDadosTela();
        // Salva os dados do Passo 1 no sessionStorage
        sessionStorage.setItem('xppc_passo1_institucional', JSON.stringify(dadosPasso1));
        // Vai para a tela 2
        window.location.href = '../../frontend/pages/NovoPPcCurso.html';
    });
    // Ação do botão "Salvar rascunho"
    btnRascunho.addEventListener('click', () => {
        const dadosPasso1 = coletarDadosTela();
        // Salva os dados no localStorage para persistência de rascunho
        localStorage.setItem('xppc_raschunho_institucional', JSON.stringify(dadosPasso1));
        alert('Rascunho salvo com sucesso no seu navegador!');
    });
    // Ação do botão "Cancelar" (Redirecionamento fixo e seguro)
    btnCancelar.addEventListener('click', () => {
        window.location.href = '../../frontend/pages/paginainicial.html';
    });
});
