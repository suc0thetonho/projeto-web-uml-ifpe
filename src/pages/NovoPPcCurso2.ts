interface IDadosCursoInfoPPC {
    regime: string;
    turnos: string;
    numTurmasPorTurno: number;
    vagasPorTurma: number;
    vagasPorTurno: number;
    vagasPorSemestre: number;
    duracaoCurso: string;
    conceitoCC: number;
    conceitoCPC: number;
    conceitoEnade: number;
    indiceIGC: number;
    situacaoCurso: string;
    statusCurso: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const formCursoInfo = document.querySelector('.form-novo-ppc') as HTMLFormElement;
    
    formCursoInfo.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Coleta e tipagem dos dados
        const dados: IDadosCursoInfoPPC = {
            regime: (document.querySelector('input[placeholder="Informe o regime do curso"]') as HTMLInputElement).value,
            turnos: (document.querySelector('input[placeholder="Informe quantos turnos o curso é oferecido"]') as HTMLInputElement).value,
            numTurmasPorTurno: parseInt((document.querySelector('input[placeholder="Informe o número de turmas por turno de oferta"]') as HTMLInputElement).value),
            vagasPorTurma: parseInt((document.querySelector('input[placeholder="Informe o número de vagas por turma"]') as HTMLInputElement).value),
            vagasPorTurno: parseInt((document.querySelector('input[placeholder="Informe o número de vagas por turno de oferta"]') as HTMLInputElement).value),
            vagasPorSemestre: parseInt((document.querySelector('input[placeholder="Informe o número de vagas por semestre"]') as HTMLInputElement).value),
            duracaoCurso: (document.querySelector('input[placeholder="Informe a duração do curso"]') as HTMLInputElement).value,
            conceitoCC: parseFloat((document.querySelector('input[placeholder="Informe o conceito de curso (CC)"]') as HTMLInputElement).value),
            conceitoCPC: parseFloat((document.querySelector('input[placeholder="Informe o conceito preliminar de curso (CPC)"]') as HTMLInputElement).value),
            conceitoEnade: parseFloat((document.querySelector('input[placeholder="Informe o conceito do Enade"]') as HTMLInputElement).value),
            indiceIGC: parseFloat((document.querySelector('input[placeholder="Informe o índice geral de cursos (IGC)"]') as HTMLInputElement).value),
            situacaoCurso: (document.querySelector('input[placeholder="Informe a situação do curso"]') as HTMLInputElement).value,
            statusCurso: (document.querySelector('input[placeholder="Informe o status do curso"]') as HTMLInputElement).value,
        };

        sessionStorage.setItem('xppc_passo3_info', JSON.stringify(dados));
        window.location.href = '../../frontend/pages/NovoPPcComponentes.html';
    });
});