"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formCursoInfo = document.querySelector('.form-novo-ppc');
    formCursoInfo.addEventListener('submit', (e) => {
        e.preventDefault();
        // Coleta e tipagem dos dados
        const dados = {
            regime: document.querySelector('input[placeholder="Informe o regime do curso"]').value,
            turnos: document.querySelector('input[placeholder="Informe quantos turnos o curso é oferecido"]').value,
            numTurmasPorTurno: parseInt(document.querySelector('input[placeholder="Informe o número de turmas por turno de oferta"]').value),
            vagasPorTurma: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por turma"]').value),
            vagasPorTurno: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por turno de oferta"]').value),
            vagasPorSemestre: parseInt(document.querySelector('input[placeholder="Informe o número de vagas por semestre"]').value),
            duracaoCurso: document.querySelector('input[placeholder="Informe a duração do curso"]').value,
            conceitoCC: parseFloat(document.querySelector('input[placeholder="Informe o conceito de curso (CC)"]').value),
            conceitoCPC: parseFloat(document.querySelector('input[placeholder="Informe o conceito preliminar de curso (CPC)"]').value),
            conceitoEnade: parseFloat(document.querySelector('input[placeholder="Informe o conceito do Enade"]').value),
            indiceIGC: parseFloat(document.querySelector('input[placeholder="Informe o índice geral de cursos (IGC)"]').value),
            situacaoCurso: document.querySelector('input[placeholder="Informe a situação do curso"]').value,
            statusCurso: document.querySelector('input[placeholder="Informe o status do curso"]').value,
        };
        sessionStorage.setItem('xppc_passo3_info', JSON.stringify(dados));
        window.location.href = '../../frontend/pages/NovoPPcComponentes.html';
    });
});
