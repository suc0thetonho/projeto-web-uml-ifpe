interface IDadosCursoPPC {
    tipoCurso: string;
    nomeCurso: string;
    eixoTecnologico: string;
    modalidade: string;
    formasOferta: string;
    titulacao: string;
    chEstagio: string;
    numSemanas: string;
    chAtividades: string;
    periodoMin: string;
    periodoMax: string;
    formasAcesso: string;
    preRequisitos: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const formCurso = document.getElementById('form-curso') as HTMLFormElement;
    const btnRascunho = document.getElementById('btn-rascunho') as HTMLButtonElement;

    const coletarDadosCurso = (): IDadosCursoPPC => ({
        tipoCurso: (document.getElementById('tipoCurso') as HTMLInputElement).value,
        nomeCurso: (document.getElementById('nomeCurso') as HTMLInputElement).value,
        eixoTecnologico: (document.getElementById('eixoTecnologico') as HTMLInputElement).value,
        modalidade: (document.getElementById('modalidade') as HTMLInputElement).value,
        formasOferta: (document.getElementById('formasOferta') as HTMLInputElement).value,
        titulacao: (document.getElementById('titulacao') as HTMLInputElement).value,
        chEstagio: (document.getElementById('chEstagio') as HTMLInputElement).value,
        numSemanas: (document.getElementById('numSemanas') as HTMLInputElement).value,
        chAtividades: (document.getElementById('chAtividades') as HTMLInputElement).value,
        periodoMin: (document.getElementById('periodoMin') as HTMLInputElement).value,
        periodoMax: (document.getElementById('periodoMax') as HTMLInputElement).value,
        formasAcesso: (document.getElementById('formasAcesso') as HTMLInputElement).value,
        preRequisitos: (document.getElementById('preRequisitos') as HTMLInputElement).value,
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