"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const formCurso = document.getElementById('form-curso');
    const btnRascunho = document.getElementById('btn-rascunho');
    const coletarDadosCurso = () => ({
        tipoCurso: document.getElementById('tipoCurso').value,
        nomeCurso: document.getElementById('nomeCurso').value,
        eixoTecnologico: document.getElementById('eixoTecnologico').value,
        modalidade: document.getElementById('modalidade').value,
        formasOferta: document.getElementById('formasOferta').value,
        titulacao: document.getElementById('titulacao').value,
        chEstagio: document.getElementById('chEstagio').value,
        numSemanas: document.getElementById('numSemanas').value,
        chAtividades: document.getElementById('chAtividades').value,
        periodoMin: document.getElementById('periodoMin').value,
        periodoMax: document.getElementById('periodoMax').value,
        formasAcesso: document.getElementById('formasAcesso').value,
        preRequisitos: document.getElementById('preRequisitos').value,
    });
    formCurso.addEventListener('submit', (evento) => {
        evento.preventDefault();
        sessionStorage.setItem('xppc_passo2_curso', JSON.stringify(coletarDadosCurso()));
        window.location.href = '../../frontend/pages/NovoPPcCurso2.html';
    });
    btnRascunho.addEventListener('click', () => {
        localStorage.setItem('xppc_rascunho_curso', JSON.stringify(coletarDadosCurso()));
        alert('Rascunho do curso salvo!');
    });
});
