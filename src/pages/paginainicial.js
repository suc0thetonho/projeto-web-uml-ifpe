"use strict";
document.addEventListener('DOMContentLoaded', async () => {
    // 1. PROTEÇÃO DE ROTA (Auth Guard)
    const token = localStorage.getItem('xppc_token');
    // Se não tiver token, expulsa para o login
    if (!token) {
        window.location.href = '../../frontend/pages/login.html';
        return;
    }
    // 2. Mapeamento dos elementos do DOM
    const spanAndamento = document.getElementById('contador-andamento');
    const spanConcluidos = document.getElementById('contador-concluidos');
    const pAtividades = document.getElementById('texto-atividades');
    try {
        // SIMULAÇÃO PARA TESTES VISUAIS
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula o tempo de rede
        const dados = {
            ppcsEmAndamento: 3,
            ppcsConcluidos: 12,
            ultimasAtividades: "PPC de Engenharia de Software salvo como rascunho.\nMatriz curricular de Administração atualizada."
        };
        // 4. Injeta os dados na tela
        spanAndamento.textContent = `${dados.ppcsEmAndamento} registro${dados.ppcsEmAndamento !== 1 ? 's' : ''}`;
        spanConcluidos.textContent = `${dados.ppcsConcluidos} registro${dados.ppcsConcluidos !== 1 ? 's' : ''}`;
        pAtividades.innerText = dados.ultimasAtividades;
    }
    catch (erro) {
        console.error(erro);
        spanAndamento.textContent = "-";
        spanConcluidos.textContent = "-";
        pAtividades.textContent = "Não foi possível carregar as atividades no momento.";
        pAtividades.style.color = "red";
    }
});
