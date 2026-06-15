export {};

// Interface expandida com todos os campos da matriz
interface IComponente {
    codigo: string;
    nome: string;
    credPrat: string;
    credTeor: string;
    credExt: string;
    horasPrat: string;
    horasTeor: string;
    horasExt: string;
    tipo: string;
    periodo: string;
    pre: string;
    correq: string;
}

const listaComponentes: IComponente[] = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.getElementById('btn-adicionar') as HTMLButtonElement;
    const btnGerar = document.querySelector('.botao-gerar') as HTMLButtonElement;
    const tbody = document.querySelector('#tabela-componentes tbody') as HTMLTableSectionElement;

    btnAdd.addEventListener('click', () => {
        // Captura de todos os campos
        const comp: IComponente = {
            codigo: (document.getElementById('comp-codigo') as HTMLInputElement).value,
            nome: (document.getElementById('comp-nome') as HTMLInputElement).value,
            credPrat: (document.getElementById('comp-credPrat') as HTMLInputElement).value,
            credTeor: (document.getElementById('comp-credTeor') as HTMLInputElement).value,
            credExt: (document.getElementById('comp-credExt') as HTMLInputElement).value,
            horasPrat: (document.getElementById('comp-horasPrat') as HTMLInputElement).value,
            horasTeor: (document.getElementById('comp-horasTeor') as HTMLInputElement).value,
            horasExt: (document.getElementById('comp-horasExt') as HTMLInputElement).value,
            tipo: (document.getElementById('comp-tipo') as HTMLInputElement).value,
            periodo: (document.getElementById('comp-periodo') as HTMLInputElement).value,
            pre: (document.getElementById('comp-pre') as HTMLInputElement).value,
            correq: (document.getElementById('comp-correq') as HTMLInputElement).value
        };

        if (!comp.codigo || !comp.nome) return alert("Preencha o código e o nome!");

        listaComponentes.push(comp);

        const row = tbody.insertRow();
    row.innerHTML = `
        <td>${comp.codigo}</td>
        <td>${comp.nome}</td>
        <td>${comp.tipo}</td>
        <td>${comp.periodo}</td>
        <td>${comp.credPrat}/${comp.credTeor}/${comp.credExt}</td>
        <td>${comp.horasPrat}/${comp.horasTeor}/${comp.horasExt}</td>
        <td>${comp.pre || '-'} / ${comp.correq || '-'}</td>
        <td><button type="button" class="btn-remover">Remover</button></td>
    `;

    // Lógica de remoção
    row.querySelector('.btn-remover')?.addEventListener('click', () => {
        const index = listaComponentes.indexOf(comp);
        if (index > -1) {
            listaComponentes.splice(index, 1);
            row.remove();
        }
    });

    (document.getElementById('form-componentes') as HTMLFormElement).reset();
    });

    btnGerar.addEventListener('click', (e) => {
        e.preventDefault();

        if (listaComponentes.length === 0) {
            return alert("Adicione componentes à tabela antes de gerar o documento!");
        }

        const ppcFinal = {
            institucional: JSON.parse(sessionStorage.getItem('xppc_passo1_institucional') || '{}'),
            curso: JSON.parse(sessionStorage.getItem('xppc_passo2_curso') || '{}'),
            infoDetalhada: JSON.parse(sessionStorage.getItem('xppc_passo3_info') || '{}'),
            matrizCurricular: listaComponentes
        };

        sessionStorage.setItem('xppc_ppc_final', JSON.stringify(ppcFinal));
        window.location.href = '../../frontend/pages/visualizarPpc.html';
    });
});